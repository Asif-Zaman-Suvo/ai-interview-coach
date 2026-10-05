# AI Interview Coach — Frontend

Next.js web app for interview practice: marketing site, auth, mock interviews with optional speech capture or typing, editable answer drafts, LLM feedback/session summaries, CV profile review, history, analytics, and admin tools. Talks to the [NestJS backend](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend) over HTTP with cookie-based sessions.

**Living product / dev contract:** [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md)

If you are in the **monorepo** (`ai-interview-coach-full-stack`), prefer the root [README](../README.md) for Docker Compose (Mongo + Redis + Nest + Next + Nginx).

---

## Features

| Area                | Routes / pages                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Marketing**       | Landing, checkout, privacy, terms                                                                                 |
| **Auth**            | Login, registration, admin login                                                                                  |
| **Dashboard**       | Overview, recent sessions, score trends                                                                           |
| **Mock interviews** | Optional CV upload → profile review → target role/difficulty → reviewed answer → feedback → results               |
| **Answer review**   | Editable finalized transcript, separate interim speech text, manual typing and explicit submission                |
| **LLM feedback**    | Backend-generated score, feedback, strengths/improvements, plus personalized session summary and top improvements |
| **Resume profile**  | PDF/DOCX analysis through the backend; correct detected information and independently confirm interview settings  |
| **History**         | Past sessions and session detail                                                                                  |
| **Analytics**       | Progress and score visualizations                                                                                 |
| **Admin**           | Dashboard, question bank, users, roles, stats, settings                                                           |
| **User settings**   | Account preferences + homepage testimonial                                                                        |

**Voice / transcription:** Browser **Web Speech API**, primarily supported by Chromium browsers. Microphone use is optional: answers can be fully typed. All LLM calls, document extraction and persistence happen in NestJS; no provider credentials are shipped to the browser.

---

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS v4**, **@base-ui/react**, **Lucide**, **next-themes**
- **TanStack Query** for server state
- **Better Auth** (client) against the Nest API
- **Recharts**, **Sonner**, **Vitest**
- **Docker** (optional) — `output: "standalone"` production image; see monorepo Compose

---

## Prerequisites

- Node.js 22 LTS recommended (matches the backend and Docker images)
- Backend API running (host, Docker Compose, or deployed Render/etc.)

---

## Local setup (host)

### 1. Install

```bash
cd ai-interview-coach   # or clone the frontend repo
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

| Variable              | Required    | Where           | Description                                                                                                                                  |
| --------------------- | ----------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Yes         | Browser + build | Backend **public** origin. Local: `http://localhost:3333`. Docker via Nginx: `http://localhost`. Production: `https://your-api.onrender.com` |
| `INTERNAL_API_URL`    | Docker only | Server runtime  | Nest URL **inside** the Docker network for RSC/SSR fetches (e.g. `http://backend:3333`). Not used by the browser.                            |

Do not add `GROQ_API_KEY`, `LLM_PROVIDER`, `LLM_MODEL` or other private provider settings to frontend environment variables. Configure them on the backend only.

If the API is mounted at `/api`, you can set e.g. `https://api.example.com/api` — the client strips the suffix and routes REST vs auth correctly.

### 3. Start the backend

See the [backend README](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend) for MongoDB/auth setup and server-side Groq configuration. Start Nest in a separate terminal from the backend repo:

```bash
npm install
cp .env.example .env  # only if .env does not already exist
# configure MongoDB/auth and GROQ_API_KEY; FRONTEND_URL=http://localhost:3000
npm run start:dev
```

Keep your frontend terminal in this frontend repo for the next step. For a full-stack Docker setup, use the section below instead of starting separate host processes.

Without a reachable API, auth and data pages fail.

### 4. Start the frontend

```bash
npm run dev
```

Open **http://localhost:3000**.

---

## Docker (full stack)

From the **monorepo root**:

```bash
cp .env.example .env
# configure database/auth values and GROQ_API_KEY in the root .env
docker compose up -d --build
```

- UI + API: **http://localhost** (Nginx)
- Compose sets `NEXT_PUBLIC_API_URL=http://localhost` (browser) and `INTERNAL_API_URL=http://backend:3333` (Next SSR inside the frontend container)

Hot-reload:

```bash
docker compose -f docker-compose.dev.yml up
```

Frontend image: `ai-interview-coach/Dockerfile` (Next standalone).

After pulling code or changing dependencies, rebuild and recreate **both** services:

```bash
docker compose up -d --build backend frontend
```

Building images alone does not update existing containers. Ensure Nginx routes to the recreated frontend; reload it with `docker compose exec nginx nginx -s reload` if necessary. A backend environment-only change uses `docker compose up -d --force-recreate backend`.

### Why `INTERNAL_API_URL`?

In Docker, the Next **server** runs inside a container. `localhost` there is not Nginx/Nest on your laptop. Marketing pages (testimonials, dashboard preview) fetch the API at build/runtime on the server — they must use the Docker service name (`backend:3333`). The browser still uses `NEXT_PUBLIC_API_URL`.

Same split applies in production if Next SSR cannot reach the public API hostname from its private network (use an internal service URL). On Vercel → public Render API, one public URL is usually enough for both.

---

## How it talks to the backend

- **Browser REST:** `lib/api.ts` → `{NEXT_PUBLIC_API_URL}/api/...` with `credentials: 'include'`
- **Browser auth:** Better Auth client + `/auth/me`, `/auth/register`
- **Server (RSC):** `serverRestApiRoot()` → `INTERNAL_API_URL` if set, else `NEXT_PUBLIC_API_URL`
- **Resume upload:** `lib/resumes.ts` uses authenticated multipart `FormData`; the browser does not read PDF/DOCX binaries as plain text
- **Types:** `lib/types.ts` and `lib/resumes.ts` stay aligned with backend contracts

Typical interview flow:

```text
Optional CV:
  POST /api/resumes (multipart file)
  → POST /api/resumes/:id/analyze
  → candidate reviews/edits detected profile
  → selects independent target role/difficulty
  → PATCH /api/resumes/:id/confirm

POST /api/sessions/start { roleId, difficulty, resumeId? }
  → GET /api/sessions/:id
  → candidate speaks or types, reviews and explicitly submits
  → POST /api/sessions/:id/answer { questionId, transcript }
  → POST /api/sessions/:id/complete
  → results render persisted summary/topImprovements
```

Questions currently come from the existing role/difficulty question bank. Attaching a CV does not generate personalized questions yet.

---

## Production (Vercel + Render)

| Where            | Variable              | Value                            |
| ---------------- | --------------------- | -------------------------------- |
| Vercel           | `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com`  |
| Render (backend) | `FRONTEND_URL`        | `https://your-app.vercel.app`    |
| Render           | `BETTER_AUTH_URL`     | same as public API URL           |
| Render           | `REDIS_URL`           | unset until Redis is provisioned |
| Render only      | `GROQ_API_KEY`        | private Groq API key             |
| Render only      | `LLM_PROVIDER`        | `groq`                           |
| Render only      | `LLM_MODEL`           | `openai/gpt-oss-20b`             |
| Render only      | `LLM_TIMEOUT_MS`      | `15000`                          |
| Render only      | `LLM_MAX_RETRIES`     | `1`                              |

Redeploy frontend after changing `NEXT_PUBLIC_*` (baked at build time). Deploy the latest backend source/package lockfile and apply its environment settings on Render separately; local `.env` files do not configure hosted services. No new frontend environment variables are required for the LLM features.

---

## Candidate experience

### Resume and profile review

1. Open **New interview** at `/interview/setup`.
2. Upload a PDF or DOCX up to 5 MiB, or Continue without a CV.
3. The backend extracts actual document text and performs structured LLM analysis. The browser displays the professional profile, not raw resume text or provider metadata.
4. Correct detected role, experience level/years, core/additional skills, and detected work/project fields. This is a focused profile review, not a full resume editor.
5. Select the existing job role you want to practice and choose Easy/Medium/Hard. A matching detected role may prefill a suggestion, but target role and difficulty remain editable.
6. Continue to persist the corrected profile and confirmed settings, then start the interview. The selected role/difficulty must have existing bank questions.

After extraction, an analysis failure retains the resume ID in the current setup flow. Continue retries analysis without uploading again. Useful errors distinguish unsupported/oversized files, unreadable content, provider failure, timeout and invalid output. Legacy DOC and scanned/image-only PDFs are unsupported; no OCR is implemented.

There is no separate **Resume** navigation item. CV upload lives inside New Interview; the legacy `/resume` URL redirects to setup. Refreshing the page currently resets setup state, even though already extracted records remain in the backend.

### Editable answers and optional speech recognition

- Start the microphone to speak, or type directly without it. Show interim recognized words separately from the finalized transcript.
- Stop recording before editing or submitting. The finalized field is read-only while listening; stopping does not automatically submit an answer.
- Review and correct the draft, then explicitly submit. Starting recording again appends new recognition to the current reviewed text; late events from stopped/previous recordings are ignored.
- Whitespace-only drafts and answers over 12,000 characters cannot be submitted. A counter communicates the limit; the backend enforces it too.
- The loading state is preserved during evaluation. Moving to the next question clears the draft/interim text and invalidates old recognition events.

### Feedback and results

The backend returns `score` (0–100), `feedback`, `strengths` and `improvements`. If LLM evaluation is unavailable, a basic heuristic result includes an explicit fallback notice. Ideal/reference answers are never part of learner question/session responses.

Completing an interview displays the persisted overall summary and prioritized top improvements. Session completion still succeeds using deterministic summary fallback when the provider fails. Repeating completion reuses an already saved result; duplicate answers cannot change scoring and completed sessions reject new submissions.

Evaluation source, summary source, provider/model identifiers and keys remain internal to the backend. Model feedback can be wrong; successful structured-output validation does not establish factual accuracy.

## Verification and manual testing

From this frontend repo:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Vitest covers transcript/manual-edit behavior, explicit submission and empty-answer prevention, resets/stale recognition, profile editing, independent target-role/difficulty selection, upload limits, retry and results rendering. Tests mock backend requests; they do not spend LLM credits. Next production builds need local subprocess/port access. Frontend lint currently has an existing unused-variable warning in the login form.

Manual smoke test:

1. Start the backend with Groq configuration and ensure the question bank has a role/difficulty to practice.
2. Log in, open New Interview and upload a readable PDF under 5 MiB. Review and edit detected information; select a different target role/difficulty and confirm. Repeat with DOCX, then test skipping the CV.
3. During the interview, speak an answer and stop. Correct the recognized text, submit and inspect Network: the `transcript` must contain the reviewed draft. Test a fully typed answer, whitespace prevention and the next-question reset.
4. Complete the session and verify summary/top improvements on the results page. Confirm Network responses contain no `idealAnswer`, extracted resume text or provider credentials.
5. For a local failure test, temporarily set the **backend** `LLM_TIMEOUT_MS=1` and restart/recreate it. A new answer should show fallback feedback; resume analysis should show a retryable error. Restore the timeout and retry analysis in the same setup tab without uploading again. Do not change production settings for this smoke test.
6. Optional backend confirmation: inspect MongoDB `answers.evaluationSource`, `sessions.summarySource`, and the resume record's original analysis versus reviewed profile. These metadata fields are intentionally not exposed in the learner UI.

Backend fixtures `test/fixtures/resume.pdf`, `resume.docx` and `empty.pdf` provide synthetic extraction cases. See the backend [resume guide](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend/blob/main/docs/RESUME_ANALYSIS.md) and [LLM guide](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend/blob/main/docs/LLM_EVALUATION.md) for detailed storage and API behavior.

Troubleshooting:

- `Cannot POST /api/resumes`: the backend may still run an older build. Deploy updated backend code/dependencies as well as the frontend.
- Fallback feedback: the provider request or structured validation failed. Backend logs contain safe error codes; a saved fallback answer does not automatically re-evaluate on duplicate submission.
- Speech recognition unavailable: use manual typing. Voice capture depends on browser support and microphone permission; it is not backend speech-to-text or Groq transcription.

## Current scope

Answer evaluation, session summaries and resume profile analysis use the backend's shared Groq/provider abstraction. Personalized CV-based questions and admin AI question generation are not implemented. Role selection still uses the existing backend Role model and question bank. Automatic resume retention cleanup and restoring setup after page refresh remain future work.

---

## Scripts

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Dev server on port 3000                         |
| `npm run build`      | Production build (standalone output for Docker) |
| `npm run start`      | Serve production build                          |
| `npm run lint`       | ESLint                                          |
| `npm run typecheck`  | `tsc --noEmit`                                  |
| `npm test`           | Vitest                                          |
| `npm run test:watch` | Vitest watch                                    |

---

## Project structure

```text
app/
  (marketing)/     Landing, checkout, privacy, terms
  (auth)/          Login / register
  (dashboard)/     Dashboard, resume-first interview setup, live session/results, history, admin, analytics
components/
  ui/              Shared primitives
  layout/          Header, sidebar
  interview/       Resume upload/profile review, editable transcript, feedback/results
  admin/           Admin tools
  landing/         Marketing sections
lib/
  api.ts           REST client
  api-url.ts       /api vs /auth URL builder
  backend-origin.ts  Public + INTERNAL_API_URL helpers
  auth-client.ts   Better Auth client
  resumes.ts       Typed upload/analyze/confirm API client and profile types
  interview-answer-draft.ts  Draft/interim state, recording IDs and submission rules
  hooks/           TanStack Query hooks
  load-*.ts        Server-side marketing data loaders
  types.ts         Shared DTOs
Dockerfile         Production standalone image
docs/PROJECT_SPEC.md
```

---

## Browser support

| Feature                  | Support                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| Core app                 | Modern evergreen browsers                                           |
| Live voice transcription | **Chromium-first** (Web Speech API); microphone permission required |
| Typed/reviewed answers   | Available without speech recognition or microphone access           |

---

## Development tips

- Run `npm run typecheck` before merging TS changes.
- After editing `lib/backend-origin.ts` or `lib/api-url.ts`, run `npm test`.
- Admin role: backend `npx ts-node src/seeds/admin.seed.ts you@example.com`
- Seed roles: `npx ts-node src/seeds/roles.seed.ts`

---

## Related

- **Backend:** [ai-interview-coach-backend](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend)
- **Monorepo Docker:** root `docker-compose.yml`, `docker-compose.dev.yml`, `nginx/nginx.conf`
