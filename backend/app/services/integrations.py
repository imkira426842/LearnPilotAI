"""
LearnPilot AI — external API integrations.

All secrets are read from environment variables set in backend/.env.
Nothing here ever exposes key values to API responses or logs.
"""

import os
import re
import httpx

# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class ConfigurationError(Exception):
    """Raised when a required API key or provider setting is missing."""


# ---------------------------------------------------------------------------
# Key validation helpers (format checks only — no actual API calls)
# ---------------------------------------------------------------------------

def _is_placeholder(value: str) -> bool:
    """Return True when the value looks like an unfilled template placeholder."""
    upper = value.upper()
    return (
        not value
        or upper.startswith("YOUR_")
        or upper in ("PLACEHOLDER", "CHANGEME", "TODO", "FIXME", "<KEY>", "KEY_HERE")
        or upper.endswith("_KEY_HERE")
        or upper.endswith("_HERE")
    )


def _validate_gemini_key(key: str) -> str:
    """
    Return the key unchanged, or raise ConfigurationError with an actionable hint.

    Gemini API keys obtained from https://aistudio.google.com/apikey are
    39-character strings that start with 'AIza'.  OAuth2 access tokens
    (starting with 'AQ.') and client-secret JSON values are NOT API keys.
    """
    if not key or _is_placeholder(key):
        raise ConfigurationError(
            "Gemini is not configured. "
            "Open backend/.env, set GEMINI_API_KEY to your Gemini API key "
            "(get one at https://aistudio.google.com/apikey), then restart the API."
        )
    if key.startswith("AQ."):
        raise ConfigurationError(
            "GEMINI_API_KEY looks like an OAuth2 access token (starts with 'AQ.'), "
            "not a Gemini API key.  Go to https://aistudio.google.com/apikey, "
            "create an API key (it will start with 'AIza'), paste it into "
            "backend/.env as GEMINI_API_KEY=AIza..., then restart the API."
        )
    if not key.startswith("AIza"):
        raise ConfigurationError(
            "GEMINI_API_KEY does not look like a valid Gemini API key. "
            "Gemini API keys start with 'AIza' and are ~39 characters long. "
            "Obtain one from https://aistudio.google.com/apikey and update backend/.env."
        )
    return key


def _validate_youtube_key(key: str) -> str:
    """Return the key unchanged, or raise ConfigurationError with an actionable hint."""
    if not key or _is_placeholder(key):
        raise ConfigurationError(
            "Live lecture search is not configured. "
            "Add YOUTUBE_API_KEY to backend/.env. "
            "Get a key from Google Cloud Console "
            "(https://console.cloud.google.com/apis/library/youtube.googleapis.com) "
            "and enable YouTube Data API v3."
        )
    if not key.startswith("AIza"):
        raise ConfigurationError(
            "YOUTUBE_API_KEY does not look like a valid Google API key. "
            "YouTube Data API v3 keys start with 'AIza'. "
            "Check your key in Google Cloud Console and update backend/.env."
        )
    return key


# ---------------------------------------------------------------------------
# LLM integration
# ---------------------------------------------------------------------------

async def llm_json_or_text(system: str, user: str, json_mode: bool = False) -> str:
    """Call Gemini or an OpenAI-compatible chat-completions provider.

    Gemini uses its native generateContent REST API.
    Set LLM_PROVIDER=gemini and GEMINI_API_KEY in backend/.env.
    Secrets remain on the backend and are never forwarded to the frontend.
    """
    provider = os.getenv("LLM_PROVIDER", "gemini").strip().lower()
    model = os.getenv("LLM_MODEL", "gemini-2.5-flash").strip()
    timeout = httpx.Timeout(75.0)

    if provider == "gemini":
        raw_key = (os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY") or "").strip()
        key = _validate_gemini_key(raw_key)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        payload: dict = {
            "systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": {"temperature": 0.3},
        }
        if json_mode:
            payload["generationConfig"]["responseMimeType"] = "application/json"

        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                url,
                headers={"x-goog-api-key": key, "Content-Type": "application/json"},
                json=payload,
            )
            if response.status_code >= 400:
                raise RuntimeError(
                    f"Gemini API returned HTTP {response.status_code}: "
                    f"{_error_message(response)}"
                )
            data = response.json()

        try:
            parts = data["candidates"][0]["content"]["parts"]
            return "".join(part.get("text", "") for part in parts if "text" in part)
        except (KeyError, IndexError, TypeError):
            block = data.get("promptFeedback", {}).get("blockReason")
            if block:
                raise RuntimeError(
                    f"Gemini could not answer because the prompt was blocked: {block}"
                )
            raise RuntimeError(
                "Gemini response format was not recognized or contained no text."
            )

    if provider in ("openai", "openai-compatible"):
        url = os.getenv("LLM_API_URL", "https://api.openai.com/v1/chat/completions").strip()
        raw_key = (os.getenv("LLM_API_KEY") or "").strip()
        if not raw_key or _is_placeholder(raw_key) or not url:
            raise ConfigurationError(
                "AI provider is not configured. "
                "Add LLM_API_KEY and LLM_API_URL to backend/.env, then restart the API."
            )
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.3,
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                url,
                headers={"Authorization": f"Bearer {raw_key}", "Content-Type": "application/json"},
                json=payload,
            )
            if response.status_code >= 400:
                raise RuntimeError(
                    f"AI provider returned HTTP {response.status_code}: "
                    f"{_error_message(response)}"
                )
            data = response.json()

        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError):
            raise RuntimeError("AI provider response format was not recognized.")

    raise ConfigurationError(
        f"Unsupported LLM_PROVIDER value: '{provider}'. "
        "Use 'gemini', 'openai', or 'openai-compatible' in backend/.env."
    )


# ---------------------------------------------------------------------------
# YouTube search integration
# ---------------------------------------------------------------------------

async def youtube_search(query: str, max_results: int = 12, order: str = "relevance") -> list:
    raw_key = os.getenv("YOUTUBE_API_KEY", "").strip()
    key = _validate_youtube_key(raw_key)

    async with httpx.AsyncClient(timeout=25) as client:
        r = await client.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "type": "video",
                "q": query,
                "maxResults": max(1, min(max_results, 25)),
                "order": order,
                "key": key,
                "safeSearch": "moderate",
            },
        )
        if r.status_code >= 400:
            try:
                msg = r.json().get("error", {}).get("message", r.text[:250])
            except Exception:
                msg = r.text[:250]
            raise RuntimeError(f"YouTube API error: {msg}")

        data = r.json()
        items: list = []
        for item in data.get("items", []):
            vid = item.get("id", {}).get("videoId")
            sn = item.get("snippet", {})
            if not vid:
                continue
            thumb = (
                sn.get("thumbnails", {}).get("high")
                or sn.get("thumbnails", {}).get("medium")
                or sn.get("thumbnails", {}).get("default")
                or {}
            ).get("url", "")
            items.append(
                {
                    "video_id": vid,
                    "title": sn.get("title", "Untitled"),
                    "channel": sn.get("channelTitle", ""),
                    "source": "YouTube",
                    "url": f"https://www.youtube.com/watch?v={vid}",
                    "thumbnail": thumb,
                    "duration": "",
                    "views": 0,
                    "published_at": sn.get("publishedAt", ""),
                    "description": sn.get("description", ""),
                }
            )

        # Enrich with duration and view count where quota permits.
        if items:
            ids = ",".join(x["video_id"] for x in items)
            d = await client.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={"part": "contentDetails,statistics", "id": ids, "key": key},
            )
            if d.status_code < 400:
                for v in d.json().get("items", []):
                    target = next(
                        (x for x in items if x["video_id"] == v["id"]), None
                    )
                    if target:
                        target["duration"] = _duration(
                            v.get("contentDetails", {}).get("duration", "")
                        )
                        target["views"] = int(
                            v.get("statistics", {}).get("viewCount", 0) or 0
                        )

    return items


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _error_message(response: httpx.Response) -> str:
    try:
        data = response.json()
        error = data.get("error", {})
        if isinstance(error, dict):
            return str(error.get("message") or error)[:400]
        return str(error or data)[:400]
    except Exception:
        return response.text[:400]


def _duration(value: str) -> str:
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", value or "")
    if not m:
        return ""
    h, mi, s = (int(x or 0) for x in m.groups())
    if h:
        return f"{h}:{mi:02d}:{s:02d}"
    return f"{mi}:{s:02d}"


def relevance(title: str, description: str, query: str) -> int:
    terms = {x.lower() for x in re.findall(r"[a-zA-Z0-9]+", query) if len(x) > 2}
    if not terms:
        return 0
    t = (title + " " + title + " " + description).lower()
    matched = sum(1 for x in terms if x in t)
    return round(100 * matched / len(terms))
