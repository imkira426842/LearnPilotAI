# LearnPilot AI: Handoff

Read this first, then `docs/MIGRATION_PLAN.md`. It lets a new chat or a new person continue without the earlier conversation.

## 1. What the project is
College learning platform: syllabus to recommended YouTube lectures, AI assistant, notes, quizzes, study planner.
Being migrated from React + FastAPI + SQLite to **React (Vite) + Tailwind v4 + Express + MongoDB Atlas**.

## 2. Repository layout
```text
backend/   legacy FastAPI app. READ-ONLY reference. Still serves the frontend today.
server/    new Express API (milestones M0, M1 done; next is M2 authentication)
src/       React frontend, migrated page by page to Tailwind
docs/      MIGRATION_PLAN.md (roadmap), HANDOFF.md (this file)
```

## 3. Current status
- Backend: M0 (housekeeping) and M1 (Express skeleton) delivered. Next: M2 authentication.
- Frontend: F0 delivered (new shell and Dashboard). Next: the page the owner names, from their reference image.
- Frontend still calls the legacy FastAPI (`VITE_API_BASE_URL`, default `http://127.0.0.1:8000/api`). It switches to Express later.

## 4. Frontend conventions (every new page must follow these)
**Tailwind v4, set up in `src/tailwind.css`:**
- Every utility has the prefix `tw:`. Variants come after it: `tw:flex`, `tw:hover:bg-brand-600`, `tw:lg:grid-cols-2`, `tw:wide:grid-cols-3`. A class without `tw:` is not Tailwind.
- Utilities are `important`, so they beat Bootstrap and the legacy CSS. Do not fight this with extra CSS.
- Preflight is not loaded, so old pages look unchanged. Put the class `lp-scope` on the root element of every new component or page. It applies a small scoped reset (margins, list styles, link colours, borders).
- Breakpoints, ascending: sm 640, md 768, lg 1024, xl 1280, **wide 1400**, 2xl 1536. The full list is declared in order on purpose, because Tailwind emits variants in declaration order.
- Tokens: colours `brand-50..900`, `ink-300..900`, `line`, `surface`; shadows `shadow-card` and `shadow-card-hover`; font Inter.
- Write full class names. Never build them dynamically (`tw:bg-${tone}` will not work).
- Do not put conflicting utilities in one string (for example `tw:bg-a` and `tw:hover:bg-b` plus an active variant). Choose one set per state, as `Sidebar.jsx` does.

**Files:**
```text
src/layouts/AppShell.jsx           shell: sidebar + topbar + error boundary + toast
src/components/layout/*            Sidebar, Topbar, GlobalSearch, SemesterSelect, NotificationsMenu, ProfileMenu
src/components/ui/*                Panel, ProgressBar, ProgressRing, Avatar, LogoMark, Toast, ErrorBoundary
src/config/navigation.js           sidebar items
src/config/flags.js                VITE_DASHBOARD_DEMO, VITE_LEGACY_SHELL
src/context/UserContext.jsx        useUser() -> { user: { name, firstName, initials, subtitle } }
src/features/<page>/               one folder per page (DashboardPage.jsx is the model to copy)
src/pages/ComingSoon*.jsx          placeholders for unbuilt sidebar pages
src/App.jsx                        legacy pages + routes (dense; edit only the route table)
```
**Shared files are frozen** for parallel work (`tailwind.css`, `components/ui/*`, `layouts/*`, `components/layout/*`, `config/navigation.js`). If a page needs a change there, report it instead of editing.

**How to build or migrate a page:**
1. Create `src/features/<page>/<Name>Page.jsx` with `lp-scope tw:font-sans` on the root. Use `Panel` and the other shared components.
2. Keep the existing page logic and API calls. Move them, do not rewrite them. Keep the old function in `App.jsx` until the new page is verified.
3. In `App.jsx`, change only that page's `<Route element=...>`.
4. Data pattern: a `useXData()` hook calls the API, a pure `buildXData()` maps it to a view-model, and a presentational view renders it. Sample data is used only where the backend does not exist yet, and it is labelled with the `Sample data` badge (see `features/dashboard`).
5. Test at 1536, 1280, 1024, 768 and 390 px wide. There must be no horizontal scroll.

## 5. Switches (project-root `.env`, public values only)
- `VITE_DASHBOARD_DEMO=true` shows the full sample dataset (the mock-up numbers) instead of live data.
- `VITE_LEGACY_SHELL=true` rolls back to the old sidebar, topbar and dashboard.

## 6. Legacy API shapes the frontend uses today
`GET /curriculum/subjects` returns `[{id, name, topics: [{id, name, unit, status}]}]` (status: `not_started`, `in_progress`, `completed`).
`GET /tasks` returns `[{id, title, subject, due_date: "YYYY-MM-DD" | null, completed}]`.
`GET /profile` returns `{name, language, difficulty}`.
`GET /lectures/search?q=` returns `{results: [...], notice}`. Not `[]`: the legacy page crashes on an array.
All requests send `X-Profile-ID` (guest id). Real authentication arrives in backend milestone M2.

## 7. Known limitations and decisions
- Hero artwork is an SVG approximation of the mock-up. To use the original image, drop it into `public/` and render an `<img>` in `HeroBanner.jsx`.
- "Recommended Lectures" was added to the sidebar (not in the mock-up) so the existing YouTube lecture search stays reachable.
- Semester dropdown is remembered locally and does not filter data. Notifications are placeholders. Logout shows a message, because no accounts exist yet.
- Continue Learning uses sample data: watch progress does not exist until the video-player milestone.
- Exam Preparation, Reminders and Help & Support are "Coming soon" pages.
- Known legacy issues, not fixed: the Lectures page reads `window.location.search` only once (a topbar search made while already on `/lectures` will not re-run), and `/quiz-history` has no link anywhere.
- Verification so far used the real Tailwind v4 compiler plus headless Chromium (render, interaction and responsive checks). `npm install` and `npm run build` with the `@tailwindcss/vite` plugin were **not** run in that environment. Run them on your machine.

## 8. Working with several accounts
- One account per page, each on its own branch (`page-<name>`).
- Each account returns a zip of only new and changed files, plus the exact route line for `App.jsx`.
- Merge one page at a time into `mern-migration`, run `npm run dev`, then commit.
- Never share `.env`, `node_modules` or `.git`. Rotate the API keys if `.env` was ever uploaded anywhere.

## 9. Prompt template for a new page
```text
Continue LearnPilot AI. Read docs/HANDOFF.md and docs/MIGRATION_PLAN.md first.
Build only this page: <PAGE>. The attached image is the primary design spec.
Follow the frontend conventions in HANDOFF.md section 4 (tw: prefix, lp-scope, shared files frozen).
Keep the existing page logic and API calls. Inspect the current page in src/App.jsx first.
Deliver a zip of new and changed files, the route line for App.jsx, run instructions,
and a list of anything you could not verify.
```
