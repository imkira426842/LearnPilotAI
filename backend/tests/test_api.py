"""
LearnPilot AI — backend test suite.

Run from the backend/ directory:
    pytest tests/ -v

All external HTTP calls (Gemini, YouTube) are mocked so no real API keys
are required.  Tests that exercise configuration errors intentionally set
invalid environment variables via monkeypatching.
"""

import json
import os
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

# ---------------------------------------------------------------------------
# Make sure 'app' is importable when pytest runs from backend/
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Set DATABASE_URL to in-memory SQLite BEFORE importing the app so that
# load_dotenv(override=False) in main.py won't override it.
# Use a named shared-cache URL so all SQLAlchemy connections/sessions share
# the same in-memory database within this process.
os.environ["DATABASE_URL"] = "sqlite:///file:learnpilot_test?mode=memory&cache=shared&uri=true"

# Clear real API keys from env so tests start clean (monkeypatch adds them per test)
for _k in ("GEMINI_API_KEY", "LLM_API_KEY", "YOUTUBE_API_KEY", "LLM_PROVIDER", "LLM_MODEL"):
    os.environ.pop(_k, None)
os.environ["LLM_PROVIDER"] = "gemini"

from fastapi.testclient import TestClient  # noqa: E402 — must be after env setup

# Import app *after* setting env so all modules read the test environment
from app.main import app  # noqa: E402
from app.db import Base, engine  # noqa: E402

# Create all tables in the in-memory database once for the test session
Base.metadata.create_all(bind=engine)

client = TestClient(app)


# ===========================================================================
# 1. Health endpoint — keys absent
# ===========================================================================

class TestHealthEndpointNoKeys:
    def test_status_ok_without_keys(self):
        resp = client.get("/api/health")
        assert resp.status_code == 200

    def test_youtube_not_configured_when_key_absent(self):
        resp = client.get("/api/health")
        data = resp.json()
        assert data["youtube_configured"] is False

    def test_ai_not_configured_when_key_absent(self):
        resp = client.get("/api/health")
        data = resp.json()
        assert data["ai_configured"] is False

    def test_ai_provider_is_gemini(self):
        resp = client.get("/api/health")
        assert resp.json()["ai_provider"] == "gemini"

    def test_hints_present_when_keys_absent(self):
        resp = client.get("/api/health")
        data = resp.json()
        assert "ai_hint" in data
        assert "youtube_hint" in data


# ===========================================================================
# 2. Health endpoint — wrong key format (OAuth2 token instead of API key)
# ===========================================================================

class TestHealthEndpointWrongKeyFormat:
    def test_oauth_token_reports_unconfigured(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "AQ.someOAuth2TokenValue")
        resp = client.get("/api/health")
        data = resp.json()
        assert data["ai_configured"] is False
        assert "AQ." in data.get("ai_hint", "")

    def test_unrecognised_gemini_key_format(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "sk-something-openai-style")
        resp = client.get("/api/health")
        data = resp.json()
        assert data["ai_configured"] is False

    def test_placeholder_value_reports_unconfigured(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")
        resp = client.get("/api/health")
        assert resp.json()["ai_configured"] is False

    def test_youtube_wrong_format(self, monkeypatch):
        monkeypatch.setenv("YOUTUBE_API_KEY", "not-a-real-key")
        resp = client.get("/api/health")
        assert resp.json()["youtube_configured"] is False


# ===========================================================================
# 3. Health endpoint — valid key format present
# ===========================================================================

class TestHealthEndpointValidKeys:
    def test_ai_configured_true_with_valid_gemini_key(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "AIzaFakeButCorrectFormatKey12345678")
        resp = client.get("/api/health")
        data = resp.json()
        assert data["ai_configured"] is True
        assert "ai_hint" not in data

    def test_youtube_configured_true_with_valid_key(self, monkeypatch):
        monkeypatch.setenv("YOUTUBE_API_KEY", "AIzaFakeYouTubeKeyForTesting1234567")
        resp = client.get("/api/health")
        data = resp.json()
        assert data["youtube_configured"] is True
        assert "youtube_hint" not in data

    def test_both_configured_no_hints(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "AIzaFakeButCorrectFormatKey12345678")
        monkeypatch.setenv("YOUTUBE_API_KEY", "AIzaFakeYouTubeKeyForTesting1234567")
        resp = client.get("/api/health")
        data = resp.json()
        assert data["ai_configured"] is True
        assert data["youtube_configured"] is True
        assert "ai_hint" not in data
        assert "youtube_hint" not in data


# ===========================================================================
# 4. Configuration loading — _is_placeholder helper
# ===========================================================================

class TestIsPlaceholder:
    def setup_method(self):
        from app.services.integrations import _is_placeholder
        self.fn = _is_placeholder

    def test_empty_string_is_placeholder(self):
        assert self.fn("") is True

    def test_your_key_here_is_placeholder(self):
        assert self.fn("YOUR_GEMINI_API_KEY_HERE") is True

    def test_real_looking_key_is_not_placeholder(self):
        assert self.fn("AIzaFakeKey1234") is False

    def test_placeholder_case_insensitive(self):
        assert self.fn("your_api_key_here") is True


# ===========================================================================
# 5. _validate_gemini_key
# ===========================================================================

class TestValidateGeminiKey:
    def setup_method(self):
        from app.services.integrations import _validate_gemini_key, ConfigurationError
        self.fn = _validate_gemini_key
        self.err = ConfigurationError

    def test_empty_raises(self):
        with pytest.raises(self.err, match="not configured"):
            self.fn("")

    def test_placeholder_raises(self):
        with pytest.raises(self.err):
            self.fn("YOUR_GEMINI_API_KEY_HERE")

    def test_oauth_token_raises_with_hint(self):
        with pytest.raises(self.err, match="AQ\\."):
            self.fn("AQ.some_oauth_token")

    def test_unrecognised_format_raises(self):
        with pytest.raises(self.err, match="AIza"):
            self.fn("sk-openai-style-key")

    def test_valid_format_passes(self):
        key = "AIzaFakeButCorrectFormatKey12345678"
        assert self.fn(key) == key


# ===========================================================================
# 6. _validate_youtube_key
# ===========================================================================

class TestValidateYouTubeKey:
    def setup_method(self):
        from app.services.integrations import _validate_youtube_key, ConfigurationError
        self.fn = _validate_youtube_key
        self.err = ConfigurationError

    def test_empty_raises(self):
        with pytest.raises(self.err, match="not configured"):
            self.fn("")

    def test_placeholder_raises(self):
        with pytest.raises(self.err):
            self.fn("YOUR_YOUTUBE_DATA_API_V3_KEY_HERE")

    def test_wrong_format_raises(self):
        with pytest.raises(self.err, match="AIza"):
            self.fn("some-random-string")

    def test_valid_format_passes(self):
        key = "AIzaFakeYouTubeKeyForTesting1234567"
        assert self.fn(key) == key


# ===========================================================================
# 7. llm_json_or_text — ConfigurationError when key missing
# ===========================================================================

class TestLLMConfigurationError:
    @pytest.mark.asyncio
    async def test_raises_configuration_error_when_no_key(self, monkeypatch):
        monkeypatch.delenv("GEMINI_API_KEY", raising=False)
        monkeypatch.delenv("LLM_API_KEY", raising=False)
        monkeypatch.setenv("LLM_PROVIDER", "gemini")
        from app.services.integrations import llm_json_or_text, ConfigurationError
        with pytest.raises(ConfigurationError):
            await llm_json_or_text("system", "user")

    @pytest.mark.asyncio
    async def test_raises_configuration_error_for_oauth_token(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "AQ.some_oauth_token")
        monkeypatch.setenv("LLM_PROVIDER", "gemini")
        from app.services.integrations import llm_json_or_text, ConfigurationError
        with pytest.raises(ConfigurationError, match="AQ\\."):
            await llm_json_or_text("system", "user")

    @pytest.mark.asyncio
    async def test_raises_configuration_error_for_unsupported_provider(self, monkeypatch):
        monkeypatch.setenv("LLM_PROVIDER", "unsupported-provider")
        monkeypatch.setenv("GEMINI_API_KEY", "AIzaFakeKey")
        from app.services.integrations import llm_json_or_text, ConfigurationError
        with pytest.raises(ConfigurationError, match="Unsupported"):
            await llm_json_or_text("system", "user")


# ===========================================================================
# 8. llm_json_or_text — mocked successful Gemini call
# ===========================================================================

class TestLLMMockedSuccess:
    @pytest.mark.asyncio
    async def test_gemini_returns_text(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "AIzaFakeButCorrectFormatKey12345678")
        monkeypatch.setenv("LLM_PROVIDER", "gemini")
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "candidates": [{"content": {"parts": [{"text": "Hello from Gemini!"}]}}]
        }
        mock_client = AsyncMock()
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client.post = AsyncMock(return_value=mock_response)

        with patch("app.services.integrations.httpx.AsyncClient", return_value=mock_client):
            from app.services.integrations import llm_json_or_text
            result = await llm_json_or_text("system", "user prompt")

        assert result == "Hello from Gemini!"

    @pytest.mark.asyncio
    async def test_gemini_raises_runtime_error_on_http_400(self, monkeypatch):
        monkeypatch.setenv("GEMINI_API_KEY", "AIzaFakeButCorrectFormatKey12345678")
        monkeypatch.setenv("LLM_PROVIDER", "gemini")
        mock_response = MagicMock()
        mock_response.status_code = 400
        mock_response.json.return_value = {"error": {"message": "API_KEY_INVALID"}}
        mock_client = AsyncMock()
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client.post = AsyncMock(return_value=mock_response)

        with patch("app.services.integrations.httpx.AsyncClient", return_value=mock_client):
            from app.services.integrations import llm_json_or_text
            with pytest.raises(RuntimeError, match="400"):
                await llm_json_or_text("system", "user")


# ===========================================================================
# 9. youtube_search — ConfigurationError when key missing
# ===========================================================================

class TestYouTubeConfigurationError:
    @pytest.mark.asyncio
    async def test_raises_when_no_key(self, monkeypatch):
        monkeypatch.delenv("YOUTUBE_API_KEY", raising=False)
        from app.services.integrations import youtube_search, ConfigurationError
        with pytest.raises(ConfigurationError):
            await youtube_search("machine learning")

    @pytest.mark.asyncio
    async def test_raises_when_placeholder(self, monkeypatch):
        monkeypatch.setenv("YOUTUBE_API_KEY", "YOUR_YOUTUBE_DATA_API_V3_KEY_HERE")
        from app.services.integrations import youtube_search, ConfigurationError
        with pytest.raises(ConfigurationError):
            await youtube_search("machine learning")


# ===========================================================================
# 10. youtube_search — mocked successful call
# ===========================================================================

class TestYouTubeMockedSuccess:
    @pytest.mark.asyncio
    async def test_returns_video_list(self, monkeypatch):
        monkeypatch.setenv("YOUTUBE_API_KEY", "AIzaFakeYouTubeKeyForTesting1234567")
        search_resp = MagicMock()
        search_resp.status_code = 200
        search_resp.json.return_value = {
            "items": [
                {
                    "id": {"videoId": "abc123"},
                    "snippet": {
                        "title": "Intro to ML",
                        "channelTitle": "TestChannel",
                        "publishedAt": "2024-01-01T00:00:00Z",
                        "description": "Great intro",
                        "thumbnails": {"high": {"url": "https://img.example.com/hq.jpg"}},
                    },
                }
            ]
        }
        detail_resp = MagicMock()
        detail_resp.status_code = 200
        detail_resp.json.return_value = {
            "items": [
                {
                    "id": "abc123",
                    "contentDetails": {"duration": "PT15M30S"},
                    "statistics": {"viewCount": "12345"},
                }
            ]
        }
        mock_client = AsyncMock()
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client.get = AsyncMock(side_effect=[search_resp, detail_resp])

        with patch("app.services.integrations.httpx.AsyncClient", return_value=mock_client):
            from app.services.integrations import youtube_search
            results = await youtube_search("machine learning", 1)

        assert len(results) == 1
        r = results[0]
        assert r["video_id"] == "abc123"
        assert r["title"] == "Intro to ML"
        assert r["duration"] == "15:30"
        assert r["views"] == 12345
        assert r["url"] == "https://www.youtube.com/watch?v=abc123"


# ===========================================================================
# 11. Chat endpoint — 503 when AI not configured
# ===========================================================================

class TestChatEndpointNotConfigured:
    def test_chat_returns_503_when_no_ai_key(self, monkeypatch):
        monkeypatch.delenv("GEMINI_API_KEY", raising=False)
        monkeypatch.delenv("LLM_API_KEY", raising=False)
        resp = client.post(
            "/api/assistant/chat",
            json={"message": "Hello", "language": "English", "context": ""},
            headers={"X-Profile-ID": "test-profile-health"},
        )
        assert resp.status_code == 503
        data = resp.json()
        assert data.get("code") == "service_not_configured"


# ===========================================================================
# 12. Lecture search endpoint — 503 when YouTube not configured
# ===========================================================================

class TestLectureSearchNotConfigured:
    def test_lecture_search_returns_503_when_no_yt_key(self, monkeypatch):
        monkeypatch.delenv("YOUTUBE_API_KEY", raising=False)
        resp = client.get(
            "/api/lectures/search?q=python+tutorial",
            headers={"X-Profile-ID": "test-profile-yt"},
        )
        assert resp.status_code == 503
        data = resp.json()
        assert data.get("code") == "service_not_configured"


# ===========================================================================
# 13. Basic CRUD — profile, subjects (no external API deps)
# ===========================================================================

class TestCRUDWithoutAPIKeys:
    def test_get_profile_creates_guest(self):
        resp = client.get(
            "/api/profile", headers={"X-Profile-ID": "crud-test-001"}
        )
        assert resp.status_code == 200
        assert resp.json()["id"] == "crud-test-001"

    def test_add_and_list_subject(self):
        headers = {"X-Profile-ID": "crud-test-002"}
        resp = client.post(
            "/api/curriculum/subjects",
            json={"name": "Mathematics", "description": "Core maths", "topics": []},
            headers=headers,
        )
        assert resp.status_code == 201
        assert resp.json()["name"] == "Mathematics"

        list_resp = client.get("/api/curriculum/subjects", headers=headers)
        assert any(s["name"] == "Mathematics" for s in list_resp.json())

    def test_dashboard_returns_ok(self):
        resp = client.get(
            "/api/dashboard", headers={"X-Profile-ID": "crud-test-003"}
        )
        assert resp.status_code == 200


