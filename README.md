# AI Interview Coach — Frontend

Next.js web app for interview practice: marketing site, auth, mock interviews with voice capture, feedback, history, analytics, and admin tools. Talks to the [NestJS backend](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend) over HTTP with cookie-based sessions.

**Living product / dev contract:** [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md)

---

## Features

| Area | Routes / pages |
|------|----------------|
| **Marketing** | Landing, checkout, privacy, terms |
| **Auth** | Login, registration, admin login |
| **Dashboard** | Overview, recent sessions, score trends |
| **Mock interviews** | Role/difficulty setup → live session → per-answer feedback → results |
| **History** | Past sessions and session detail |
| **Analytics** | Progress and score visualizations |
| **Admin** | Dashboard, question bank, users, roles, stats, settings, interview review |
| **User settings** | Account preferences in the app shell |

**Voice / transcription:** Uses the browser **Web Speech API**. Best supported in Chromium (Chrome, recent Edge). Other browsers may lack support or behave differently.

---

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS v4**, **@base-ui/react**, **Lucide**, **next-themes**
- **TanStack Query** for server state
- **Better Auth** (client) against the backend
- **Recharts** for charts
- **Sonner** for toasts
- **Vitest** for unit tests

---

## Prerequisites

- Node.js 20.x or 22.x (LTS recommended)
- [Backend API](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend) running locally (or a deployed instance)

---

## Local setup

### 1. Clone and install

```bash
git clone git@github.com:Asif-Zaman-Suvo/ai-interview-coach.git
cd ai-interview-coach
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend origin (default `http://localhost:3333`) |

If your deployment mounts the API at `/api`, you can set e.g. `https://api.example.com/api` — the client strips the suffix and routes REST vs auth paths correctly.

### 3. Start the backend

From the backend repo:

```bash
npm install
cp .env.example .env   # set MONGODB_URI, BETTER_AUTH_*, FRONTEND_URL=http://localhost:3000
npm run start:dev
```

Without a running backend, sign-in and all API-backed pages will fail.

### 4. Start the frontend

```bash
npm run dev
```

Open **http://localhost:3000**.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Turbopack) on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm test` | Vitest unit tests |
| `npm run test:watch` | Vitest watch mode |

---

## Project structure

```text
app/
  (marketing)/     Public pages: landing, checkout, privacy, terms
  (auth)/          Login and register (no dashboard chrome)
  (dashboard)/     Authenticated shell: dashboard, interview, history, admin, analytics
components/
  ui/              Shared UI primitives
  layout/          Header, sidebar, dashboard chrome
  interview/       Live session, feedback, setup flow
  admin/           Admin tables and tools
  landing/         Marketing sections
lib/
  api.ts           REST client (cookie credentials)
  api-url.ts       URL builder for /api vs /auth routes
  auth-client.ts   Better Auth client
  hooks/           TanStack Query hooks per domain
  types.ts         Shared DTO types (keep in sync with backend)
docs/
  PROJECT_SPEC.md  Living product / dev contract
public/            Static assets
```

---

## How it talks to the backend

- **REST:** `lib/api.ts` → `{NEXT_PUBLIC_API_URL}/api/...` with `credentials: 'include'`
- **Auth:** Better Auth client + legacy paths `/auth/me`, `/auth/register` (unprefixed on the Nest host)
- **Types:** Domain shapes in `lib/types.ts` should match backend DTOs — update both repos when the contract changes

Typical interview flow:

```
POST /api/sessions/start
  → GET /api/sessions/:id
  → POST /api/sessions/:id/answer (per question)
  → POST /api/sessions/:id/complete
  → result / history views
```

---

## Browser support

| Feature | Support |
|---------|---------|
| Core app (auth, dashboard, admin) | Modern evergreen browsers |
| Live voice transcription | **Chromium-first** (Chrome, Edge) via Web Speech API |

For voice interviews, use Chrome or a Chromium-based browser. The app should degrade gracefully where speech is unavailable (check browser console if mic/transcript fails).

---

## Development tips

- Run `npm run typecheck` before merging TS changes.
- After editing `lib/backend-origin.ts` or `lib/api-url.ts`, run `npm test`.
- Admin pages require a user with the `admin` role — promote via backend seed: `npx ts-node src/seeds/admin.seed.ts you@example.com`
- Seed job roles on the backend before starting interviews: `npx ts-node src/seeds/roles.seed.ts`

---

## Related repos

- **Backend:** [ai-interview-coach-backend](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend)
- **Backend spec:** [ai-interview-coach-backend/docs/PROJECT_SPEC.md](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend/blob/main/docs/PROJECT_SPEC.md)
