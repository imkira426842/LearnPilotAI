# LearnPilot AI: MERN Migration Plan

Migration of LearnPilot AI from Python FastAPI + SQLite to Node.js + Express + MongoDB Atlas, with Tailwind CSS adopted page by page.
The legacy backend in `backend/` is kept **unchanged** as a reference. Work happens one milestone at a time; each milestone is reviewed before the next begins.

## Decisions

| Topic | Decision |
|---|---|
| Backend | Express 5 on Node >= 22, plain JavaScript (ES modules), in `server/` |
| Database | MongoDB Atlas + Mongoose |
| Auth (M2/M3) | bcrypt passwords, short-lived access JWT, rotating refresh token in an httpOnly cookie, Google sign-in via ID-token verification |
| AI (M8+) | Gemini; RAG with embeddings + Atlas Vector Search |
| Frontend | Keep React + Vite and the existing page logic; adopt Tailwind gradually (prefixed classes, preflight disabled while Bootstrap coexists) |
| Existing data | Legacy SQLite guest data is not migrated (test data only) |
| Branching | Work on branch `mern-migration` |

## Repository layout

```text
backend/   legacy FastAPI app (read-only reference)
server/    new Express API
src/       React frontend (evolves in place)
docs/      this plan
```

## API conventions for the new server

- Base path `/api`; JSON field names stay **snake_case** like the legacy API so existing frontend code needs minimal changes. Resource ids become strings.
- Errors: `{ "detail": "...", "code": "machine_code", "request_id": "...", "errors": [{ "path", "message" }]? }`. The frontend already reads `detail`.
- Every response carries `X-Request-ID`.
- All user-owned queries are filtered by the authenticated `userId` from the token, never from a client-supplied header.
- Secrets live only in `server/.env`. They are never logged, never returned by the API, never placed in `VITE_*` variables.

## Milestones

| # | Milestone | Status | Done when |
|---|---|---|---|
| M0 | Housekeeping | In review | `.gitattributes` and `.gitignore` in place, line endings normalised, `.env.example` restored, docs corrected |
| M1 | Express skeleton | In review | Server boots against Atlas, `/api/health` and `/api/health/ready` work, tests pass, bad config fails fast without leaking values |
| M2 | Authentication | Planned | Register, login, refresh, logout, `me`; protected-route middleware; login/register pages (first Tailwind pages) |
| M3 | Google OAuth | Planned | ID-token verification, account linking |
| M4 | Curriculum | Planned | Subjects, units, topics API; frontend wired; Curriculum page on Tailwind |
| M5 | Syllabus upload | Planned | Node PDF extraction, hash de-duplication, review flow, better unit detection |
| M6 | Lectures | Planned | YouTube service with caching and typed errors, bookmarks, completion; Lectures and Saved pages on Tailwind |
| M7 | Video player | Planned | IFrame Player API, watch-progress tracking |
| M8 | AI foundation | Planned | Gemini service, real chat, sessions, rate limits and per-user quotas |
| M9 | RAG | Planned | Chunking, embeddings, vector index, retrieval, grounded chat with citations |
| M10 | Grounded notes and quizzes | Planned | Server-side scoring, quiz history, Markdown rendering |
| M11 | Planner and reminders | Planned | Calendar view, reminders, dashboard analytics |
| M12 | Semantic lecture ranking | Planned | Embedding rerank; remaining pages on Tailwind; Bootstrap removed |
| M13 | Hardening and delivery | Planned | Test coverage, security review, accessibility, deployment, docs |

## Frontend track (Tailwind, page by page)

Runs in parallel with the backend milestones above. Each page is built from the owner's reference image, keeps the existing page logic, and ships separately.

| # | Page | Status |
|---|---|---|
| F0 | Shell (sidebar, topbar, error boundary) + Dashboard | In review |
| F1 | AI Study Assistant | Waiting for reference image |
| F2 | AI Notes | Planned |
| F3 | Quiz Generator | Planned |
| F4 | My Curriculum | Planned |
| F5 | Study Planner | Planned |
| F6 | Lectures (recommended + saved) | Planned |
| F7 | Settings, Exam Preparation, Reminders, Help | Planned |
| F8 | Remove Bootstrap and legacy `styles.css` | Planned |

See `docs/HANDOFF.md` for the frontend conventions every page must follow.

## Definition of done (every milestone)

1. Code, tests and documentation updated together.
2. Tests pass locally; anything that could not be run is stated explicitly.
3. No secrets in code, logs, fixtures or Git history.
4. Existing working behaviour is preserved or its change is documented.
