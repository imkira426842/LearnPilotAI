# LearnPilot AI — Project Plan

## Objective
Build a student-focused syllabus-to-lecture recommendation system that finds genuine educational resources, ranks them by relevance, and tracks learning progress.

## Architecture
- **Frontend:** React + Vite, JavaScript, Bootstrap 5, custom CSS, React Router, Lucide React, Fetch API.
- **Backend:** FastAPI, Pydantic v2, SQLAlchemy 2, SQLite, pypdf, httpx.
- **Lecture source:** YouTube Data API v3 (real video metadata; key stays on backend).
- **AI provider:** configurable OpenAI-compatible chat-completions endpoint for assistant, notes and quiz generation.
- **Guest profile:** random browser profile ID sent as `X-Profile-ID`; data scoped per ID. This is not secure authentication.

## Phase status

### Phase 1 — Frontend MVP
- [x] Responsive shell and all requested pages.
- [x] Consistent styling, navigation, loading/error/empty states.
- [x] Replaced sample-only state with API-backed screens for main workflows.

### Phase 2 — FastAPI + SQLite
- [x] Database models: guest profile, subject/topic, syllabus, lecture records, notes, quiz results, chat messages and tasks.
- [x] REST endpoints with Pydantic request validation, status codes, CORS and error responses.
- [x] Curriculum CRUD/status, PDF text extraction, notes CRUD, tasks CRUD, quiz result persistence, dashboard/progress.
- [x] Per-profile data scoping.

### Phase 3 — Real lecture retrieval
- [x] YouTube Data API v3 search and metadata enrichment for actual video results.
- [x] Keyword relevance score; duration/source filters; result cards with title, channel, thumbnail, duration, view count and original URL.
- [x] Persistent bookmarks and completed-lecture state.
- [x] Missing key/API failures are explicit, not replaced with sample data.
- [ ] Independent NPTEL, MIT OCW and Khan Academy search integrations (current labels filter YouTube results only).

### Phase 4 — AI integration
- [x] Configurable OpenAI-compatible LLM endpoint for assistant, notes and quiz generation.
- [x] No fake AI success when unconfigured or provider errors occur.
- [x] MCQ answer/score submission and persisted results.
- [x] Persist chat messages in SQLite, include recent conversation context, and support clearing history.

### Phase 5 — Frontend/backend integration
- [x] Frontend fetches API data and uses database-backed actions for curriculum, lecture state, notes, tasks, profile and dashboard.
- [x] Upload/extraction review flow.
- [x] Honest configuration/error states.
- [x] Dedicated saved-lectures page and quiz-history UI.

### Phase 6 — Testing and delivery
- [x] Python compilation check and API smoke tests for health, profile, subject/topic CRUD, tasks, notes and explicit unconfigured integrations.
- [x] README setup, API reference, architecture, key configuration and limitations.
- [x] `.gitignore` protects environment files and SQLite database.
- [ ] Production frontend build not verified in this environment because npm dependency installation timed out / registry cache was unavailable.
- [ ] End-to-end UI browser test not run in this environment.

## API contracts implemented
- `GET /api/health`
- `GET/PATCH /api/profile`
- `GET/POST /api/curriculum/subjects`; `PATCH/DELETE /api/curriculum/subjects/{subject_id}`
- `POST /api/curriculum/subjects/{subject_id}/topics`; `PATCH/DELETE /api/curriculum/topics/{topic_id}`
- `POST /api/curriculum/upload`
- `GET /api/lectures/search?q=&source=&language=&duration=&sort=`; `GET /api/lectures/saved`
- `POST /api/bookmarks`; `DELETE /api/bookmarks/{video_id}`; `POST /api/lectures/{video_id}/complete`
- `GET/DELETE /api/assistant/history`; `POST /api/assistant/chat`
- `GET/POST/PATCH/DELETE /api/notes`; `POST /api/notes/generate`
- `POST /api/quizzes/generate`; `POST /api/quizzes/submit`; `GET /api/quizzes/results`
- `GET/POST/PATCH/DELETE /api/tasks`
- `GET /api/dashboard`; `GET /api/progress`

## Important decisions and known limitations
- Do not add fake video or AI responses. API keys are optional for running database-backed features but required for the corresponding live service.
- YouTube Data API v3 is the only live lecture retrieval provider currently wired. Source filters for NPTEL/MIT OCW/Khan Academy match channel/title labels within YouTube results; they do not perform independent platform searches.
- Relevance is a transparent keyword-overlap heuristic on retrieved metadata, not a claim of sophisticated semantic AI ranking.
- PDF extraction supports selectable text. Scanned PDFs require OCR; extracted candidates must be reviewed before saving.
- Guest profile ID provides convenient demo separation, not authentication/security against malicious users. Add real authentication before a public deployment.
- Frontend dependency install/build remains unverified here because `npm install` timed out in this environment. Run `npm install` then `npm run build` on a machine with registry access.
