# Spec: AI Interview Coach (frontend)

## Approval

- **Phase 1 (Specify):** Approved — 2026-05-14
- **Phase 2 (Plan) & Phase 3 (Tasks):** Approved — 2026-05-14

Implementation may proceed per **Phase 4 — Implement** and the Phase 3 checklist.

---

## ASSUMPTIONS I'M MAKING

1. This specification covers the **Next.js app** in `ai-interview-coach` only; the **NestJS** API lives in sibling repo `ai-interview-coach-backend`.
2. **Auth** is session/cookie-based via Better Auth against that backend (`credentials: 'include'`), not a pure JWT-in-localStorage SPA.
3. **Target clients** are modern browsers; Web Speech API is an intentional dependency for live interviews (Chrome/Chromium-class).
4. **Package manager** for this repo is **npm** (lockfile as committed).
5. **Vitest** runs small unit tests (`npm test`); the suite is not yet exhaustive — expand with feature work.

---

## Objective

**What:** A web app where users prepare for job interviews: marketing site, sign-in, dashboard, configurable mock interviews (voice + transcript), per-answer and session-level feedback, history, analytics, and admin tools. The UI consumes a remote Nest API.

**Who:** Candidates (practice), admins (content/users/stats).

**Success looks like:**

- A developer can run the app locally with documented env + backend.
- Auth flows reach the real API when `NEXT_PUBLIC_API_URL` is set.
- Interview flow: setup → live session → submit answers → optional feedback/result views → session completion without uncaught client errors in supported browsers.
- ESLint passes; production build succeeds.
- Spec and tasks stay in sync when scope changes.

---

## Tech Stack

| Area | Choice |
|------|--------|
| Framework | Next.js **16.2.6** (App Router) |
| UI | React **19.2.4**, TypeScript **5.x** |
| Styling | Tailwind CSS **v4** (`@tailwindcss/postcss`), `tailwind-merge`, CVA |
| Components | `@base-ui/react`, Lucide, `next-themes` |
| Data | TanStack Query **v5** (+ devtools in dev) |
| Auth (client) | `better-auth` |
| Charts | Recharts |
| Toasts | Sonner |
| Animation | framer-motion (where used) |

**External system:** Nest backend at `NEXT_PUBLIC_API_URL` (REST under `/api`, auth paths as implemented in `lib/api-url.ts`).

---

## Commands

```bash
# Install
npm install

# Develop (Turbopack)
npm run dev

# Production build
npm run build

# Run production server (after build)
npm run start

# Lint
npm run lint

# Typecheck (no emit)
npm run typecheck

# Tests (Vitest — URL helpers)
npm test

# Watch mode
npm run test:watch
```

---

## Project Structure

```text
app/                    # Next.js App Router: routes & layouts
  (marketing)/          # Public marketing routes
  (auth)/               # Login / register (no dashboard chrome)
  (dashboard)/          # Authenticated shell: dashboard, interview, history, admin, …
components/             # UI: ui/, layout/, interview/, admin/, …
lib/                    # api client, auth-client, hooks/, types, providers
public/                 # Static assets
docs/                   # Specifications and ADRs (this file)
graphify-out/           # Optional code graph artifacts (generated)
.cursor/                # Cursor rules & skills (not app runtime)
```

**Tests:** `lib/**/*.test.ts` (Vitest); expand as features grow (see Testing Strategy).

---

## Code Style

**Conventions (match existing code):**

- **Client hooks / browser APIs:** use `"use client"` on pages or leaf components that call `useQuery`, `useMutation`, `useParams`, Web Speech API, etc.
- **Imports:** `@/` path alias for repo root.
- **Components:** PascalCase files where already established; prefer named exports matching filename.
- **Types:** Shared domain types in `lib/types.ts`; avoid `any` unless bridging untyped browser APIs (narrow with local types when practical).

**Example (client boundary + hook):**

```tsx
"use client";

import { useParams } from "next/navigation";
import { useSessionDetail } from "@/lib/hooks/useInterview";

export default function LiveInterviewPage() {
  const sessionId = useParams().sessionId as string;
  const { data: session, isLoading, isError } = useSessionDetail(sessionId);
  // ...
}
```

---

## Testing Strategy

**Current state:** Vitest **3.x** with `npm test` / `npm run test:watch`. Initial coverage: `lib/backend-origin.test.ts`, `lib/api-url.test.ts` (pure URL normalization — small / fast).

**Direction (to adopt when we implement):**

| Level | Tool (proposed) | Scope |
|--------|------------------|--------|
| Unit / component | Vitest + React Testing Library | `lib/*`, pure components |
| Integration | Vitest + MSW (optional) | API client, hooks with mocked fetch |
| E2E | Playwright (optional) | Critical paths: login, one interview happy path |

**Coverage expectation:** Not enforced until a runner exists; first milestone is “CI runs lint + build + unit tests for new critical logic.”

Developer onboarding: `README.md` + this spec. Run **`npm test`** after changes to `lib/backend-origin.ts` or `lib/api-url.ts`; run **`npm run typecheck`** before merge when touching TS.

---

## Boundaries

### Always

- Run **`npm run lint`** (and **`npm run build`** before release) for non-trivial changes.
- Keep **`NEXT_PUBLIC_API_URL`** out of committed secrets; use `.env.local` (gitignored) and `.env.example` for shape only.
- Match existing patterns for Client vs Server Components when adding hooks or browser APIs.
- Update **this spec** when product scope or architecture boundaries change.

### Ask first

- Adding or upgrading **major** dependencies (Next major, React major, auth library).
- Introducing a **BFF** or proxy in Next that changes how cookies/CORS work.
- Changing **public API** of shared `lib/types.ts` without coordinating backend.
- Adding **CI** workflows or deployment config.

### Never

- Commit **API keys**, session secrets, or production URLs with credentials.
- Disable or remove **ESLint** rules repo-wide without team agreement.
- Delete or skip **auth/ownership checks** on the backend (frontend must not be sole security).

---

## Success Criteria

- [x] This document is **reviewed and approved** by the maintainer.
- [x] README or onboarding points to **`docs/PROJECT_SPEC.md`** as the living product/dev contract for the frontend.
- [x] `npm run lint` and `npm run build` succeed on `main` (or default branch) — *verify on each release / CI when added*.
- [x] `.env.example` documents required env vars for local dev.
- [x] Open Questions below are **resolved or explicitly deferred** with owners — *see [Open Questions (resolutions / deferrals)](#open-questions-resolutions--deferrals)*.

---

## Open Questions (resolutions / deferrals)

1. **Default backend URL** — **Resolved for spec:** `http://localhost:3333` per `.env.example` until the team standard changes; update `.env.example` + README if it does.
2. **Test runner** — **Deferred:** Adopt Vitest when the first feature explicitly requires automated tests; owner: team / next “testing” task.
3. **Minimum browsers (Web Speech)** — **Deferred:** Document in README or this spec when we add a formal matrix; until then, banner targets Chromium-class as implemented.
4. **Backend spec** — **Deferred:** Add `docs/PROJECT_SPEC.md` (or equivalent) under `ai-interview-coach-backend` and link from here; owner: backend maintainer.

---

## Phase 2 — Plan (technical)

### Major components & dependencies

| Area | Responsibility | Depends on |
|------|----------------|------------|
| `app/(auth)` | Login/register UI | `lib/auth-client.ts`, backend Better Auth routes |
| `app/(dashboard)/layout` | Shell, nav, session context | Auth session, React Query `Providers` |
| `lib/api.ts` + `lib/api-url.ts` | REST + cookie credentials | `NEXT_PUBLIC_API_URL`, backend CORS |
| `lib/hooks/useInterview.ts` (et al.) | Mutations/queries | API shape from Nest |
| Live interview page | Web Speech → transcript → submit | Browser API, `useSubmitAnswer` |
| Admin / analytics pages | CRUD & charts | Admin APIs, same origin rules |

**Data flow (interview):**  
`POST /sessions/start` → client stores `sessionId` → live page uses `GET /sessions/:id` → user speaks → `POST /sessions/:id/answer` per question → `POST /sessions/:id/complete` → result/history reads session again.

### Implementation order (for new work in this repo)

1. **Contract first:** Confirm DTO paths and types with backend (`lib/types.ts`).
2. **Hooks:** Add or extend `lib/hooks/*` + `api` methods before large UI changes.
3. **UI:** Page or component last; keep client boundary at leaves where possible.

### Risks & mitigation

| Risk | Mitigation |
|------|------------|
| CORS / cookies between :3000 and API origin | Backend config; document required cookie/CORS in backend spec |
| `useQuery` in Server Components | `"use client"` or child client wrapper |
| Web Speech unsupported | `useSyncExternalStore` + banner; keep manual/transcript fallback if product requires |
| Stale closures in speech `onend` | `useRef` for recording flag (pattern already used) |

### Parallel vs sequential

- **Parallel:** Independent pages (e.g. marketing vs admin styling) if they don’t share new types.
- **Sequential:** Any change to `lib/types.ts` ↔ backend should merge before dependent UI.

### Verification checkpoints

- After shared-type changes: `npx tsc --noEmit`.
- Before merge: `npm run lint` + `npm run build`.
- After interview/auth flows: manual smoke (Chrome) with local backend.

---

## Phase 3 — Tasks

Check off as completed. Each task is scoped for roughly one focused session.

- [x] **Task:** Resolve `react-hooks/set-state-in-effect`, `no-html-link-for-pages`, and related ESLint errors until `npm run lint` passes  
  - **Acceptance:** `npm run lint` exits 0.  
  - **Verify:** `npm run lint`  
  - **Files:** Various (see ESLint output)

- [x] **Task:** Add `npm run typecheck` → `tsc --noEmit` in `package.json`  
  - **Acceptance:** Script runs clean locally.  
  - **Verify:** `npm run typecheck`  
  - **Files:** `package.json`

- [ ] **Task:** Document deferred browser matrix in README (one short bullet: Web Speech = Chromium-first)  
  - **Acceptance:** README states supported expectation without over-claiming.  
  - **Verify:** Read README  
  - **Files:** `README.md`

- [ ] **Task:** Link backend spec from this doc when `ai-interview-coach-backend/docs/PROJECT_SPEC.md` exists  
  - **Acceptance:** Relative or absolute link from Open Questions #4.  
  - **Verify:** Link resolves  
  - **Files:** `docs/PROJECT_SPEC.md` (this file), optionally backend repo

- [x] **Task:** (Optional) Vitest + one smoke test for `lib/api-url.ts` or `backendOrigin`  
  - **Acceptance:** `npm test` runs in CI or locally with one passing test.  
  - **Verify:** `npm test`  
  - **Files:** `package.json`, `vitest.config.ts`, `lib/**/*.test.ts` (as needed)

---

## Phase 4 — Implement

Execute **Phase 3 tasks** one at a time. For **feature** work, add a short **Spec / Plan / Tasks** subsection under a new heading (e.g. `## Feature: …`) or a separate `docs/SPEC_<feature>.md`, then implement per task.

When scope changes, update **Objective**, **Success Criteria**, and **Phase 3** tasks first; then code.
