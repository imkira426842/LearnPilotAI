# LearnPilot AI

**An AI-Powered Personalized Learning and Lecture Recommendation System** — a full-stack college mini-project built with React/Vite and FastAPI.

The application runs in guest mode without an account password. Curriculum, tasks, notes, quiz results, lecture bookmarks and completion state persist in SQLite and are separated by a random browser profile ID. This is a convenient demo profile, **not secure authentication**.

## Features

- Responsive React interface: dashboard, curriculum, recommended lectures, AI assistant, AI notes, quiz generator, study planner and profile settings.
- Add, rename and delete subjects/topics; track topic status.
- Upload text-based syllabus PDFs, extract text and review candidate topic lines before saving. Scanned/image PDFs are rejected with an honest message; OCR is not bundled.
- Real YouTube Data API search with returned video IDs, titles, channel names, thumbnails, durations and view counts; keyword relevance ranking; filters and original video links.
- Save/remove lecture bookmarks and mark/unmark lectures as completed.
- Configurable Gemini API integration (default) for the study assistant, notes and multiple-choice quizzes, with optional OpenAI-compatible provider support. Chat history persists in SQLite and recent turns are sent as context.
- If no API key is configured or the key format is wrong (e.g. an OAuth2 token was pasted instead of an API key), the health endpoint and API responses return a clear, actionable error message — never fake output and never an exposed key value.
- Edit/save/delete notes, answer quizzes and persist scores, and create/edit/complete/delete study tasks.
- Profile preferences and dashboard statistics derived from database records.
- FastAPI validation, CORS, per-profile query scoping, SQLite persistence, and interactive API docs.

---

## 1. Prerequisites

| Tool | Minimum version |
|---|---|
| Python | 3.10 (3.11+ recommended) |
| Node.js + npm | 18+ |
| Google Gemini API key | From [AI Studio](https://aistudio.google.com/apikey) — starts with `AIza` |
| YouTube Data API v3 key | From [Google Cloud Console](https://console.cloud.google.com/apis/library/youtube.googleapis.com) — starts with `AIza` |

> **Important key format note:** Gemini API keys from AI Studio always start with `AIza`. If your key starts with `AQ.`, you have an OAuth2 access token, not an API key. Go to https://aistudio.google.com/apikey and create a proper API key.

---

## 2. Configure and run the backend (Windows PowerShell)

### 2a. Create and activate the virtual environment

Open PowerShell in the **project root** (`LearnPilot-Gemini\`):

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 2b. Configure your API keys

Copy the example file and add your real keys:

```powershell
Copy-Item .env.example .env
notepad .env
```

Edit `backend/.env` — replace the placeholder values with your real keys:

```dotenv
DATABASE_URL=sqlite:///./learnpilot.db
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

YOUTUBE_API_KEY=AIza...your_youtube_key_here
LLM_PROVIDER=gemini
GEMINI_API_KEY=AIza...your_gemini_key_here
LLM_MODEL=gemini-2.5-flash
```

**Where to get each key:**

- **Gemini API key:** https://aistudio.google.com/apikey → Create API key → Copy the `AIza...` string
- **YouTube Data API v3 key:** https://console.cloud.google.com → APIs & Services → Enable "YouTube Data API v3" → Credentials → Create API key

**Never commit `backend/.env`.** The `.gitignore` should exclude it. Never put keys in frontend `.env` or Vite environment variables.

### 2c. Start the backend

Run this from inside the `backend/` directory (the virtual environment must be active):

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Verify configuration at: http://127.0.0.1:8000/api/health

When both keys are correctly configured, you will see:

```json
{
  "status": "ok",
  "app": "LearnPilot AI",
  "youtube_configured": true,
  "ai_provider": "gemini",
  "ai_configured": true
}
```

If a key is wrong or missing, `ai_configured` or `youtube_configured` will be `false` and an `ai_hint` or `youtube_hint` field will explain what to fix — without exposing the key value.

Interactive API docs: http://127.0.0.1:8000/docs

---

## 3. Run the frontend

Open a **second** PowerShell terminal in the **project root** (not the `backend/` folder):

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually http://localhost:5173).

The frontend calls `http://127.0.0.1:8000/api` by default. To change the backend URL, copy `.env.example` to `.env` in the project root and set `VITE_API_BASE_URL`. This is a **public URL only** — never put API secrets here.

Build the production frontend with `npm run build`.

---

## 4. Run the test suite

From inside the `backend/` directory with the virtual environment active:

```powershell
pytest tests/ -v
```

All 38 tests run without real API keys. External HTTP calls (Gemini and YouTube) are mocked. Tests cover:

- Health endpoint with missing, placeholder, wrong-format (OAuth2), and valid keys
- `_is_placeholder`, `_validate_gemini_key`, `_validate_youtube_key` helpers
- `llm_json_or_text` — `ConfigurationError` when unconfigured, mocked successful call, HTTP 400 error handling
- `youtube_search` — `ConfigurationError` when unconfigured, mocked successful call with duration/views enrichment
- Chat and lecture search endpoints returning HTTP 503 when not configured
- Basic CRUD: profile creation, subject/topic management, dashboard

---

## 5. API overview

- `GET /api/health` — configuration status (key presence, format check, hints — never exposes key values)
- `GET/PATCH /api/profile`
- `GET/POST /api/curriculum/subjects`, `PATCH/DELETE /api/curriculum/subjects/{id}`
- `POST /api/curriculum/subjects/{id}/topics`, `PATCH/DELETE /api/curriculum/topics/{id}`
- `POST /api/curriculum/upload`
- `GET /api/lectures/search?q=...`, `GET /api/lectures/saved`
- `POST /api/bookmarks`, `DELETE /api/bookmarks/{video_id}`, `POST /api/lectures/{video_id}/complete`
- `GET/DELETE /api/assistant/history`, `POST /api/assistant/chat`
- `GET/POST/PATCH/DELETE /api/notes`, `POST /api/notes/generate`
- `POST /api/quizzes/generate`, `POST /api/quizzes/submit`, `GET /api/quizzes/results`
- `GET/POST/PATCH/DELETE /api/tasks`, `GET /api/dashboard`, `GET /api/progress`

Every frontend request sends `X-Profile-ID`. The backend scopes student-owned data to this ID.

---

## 6. Using OpenAI-compatible providers instead of Gemini

Set `LLM_PROVIDER=openai` in `backend/.env` and configure:

```dotenv
LLM_PROVIDER=openai
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
```

Leave `GEMINI_API_KEY` blank or remove it. The health endpoint will report `ai_provider: openai`.

---

## 7. Lecture source notes

The live source is YouTube Data API v3. Search results and metadata are returned by Google; the app does not invent video IDs, URLs, channels, thumbnails or durations. Google API quotas and errors apply. The NPTEL/MIT OCW/Khan Academy filters only keep matching channel/title labels among returned YouTube results — they do not query those platforms independently.

Relevance scoring is a transparent keyword-overlap heuristic over actual title and description data. Duration filtering excludes videos whose metadata is unavailable.

---

## 8. Syllabus extraction notes

The PDF upload endpoint extracts selectable text using `pypdf`. Candidate topic lines are suggestions only; students review and choose them before saving. For image-only/scanned PDFs, OCR must be performed first or topics should be added manually.

---

## 9. Troubleshoot

| Symptom | Fix |
|---|---|
| `ai_configured: false` in `/api/health` | Check `backend/.env`. Key must start with `AIza`. See `ai_hint` in the response. |
| `youtube_configured: false` | Check `YOUTUBE_API_KEY` in `backend/.env`. Must start with `AIza`. Enable YouTube Data API v3 in Google Cloud Console. |
| `AQ.` key prefix warning | You pasted an OAuth2 token. Go to https://aistudio.google.com/apikey and create a proper API key. |
| `503 service_not_configured` from chat/quiz | `ai_configured` is false — fix the Gemini key first. |
| `503 service_not_configured` from lecture search | `youtube_configured` is false — fix the YouTube key first. |
| Frontend shows connection error | Confirm the backend is running on port 8000 and `/api/health` loads. |
| `npm install` fails | Check your internet/proxy configuration and retry. |
| `uvicorn: command not found` | Activate the virtual environment first: `.\.venv\Scripts\Activate.ps1` |

---

## 10. Architecture

```text
React/Vite browser
  └── Fetch API + X-Profile-ID header
       └── FastAPI routes / Pydantic validation
            ├── SQLAlchemy → SQLite (curriculum, profile, tasks, notes, quiz results, lecture state)
            ├── YouTube Data API v3 → genuine video results + metadata
            ├── pypdf → syllabus text extraction
            └── Gemini generateContent API → chat, notes, quizzes
                (or any OpenAI-compatible provider)
```

See `PROJECT_PLAN.md` for implementation status and known limitations.
