# AI Interview Coach — Frontend

Next.js web app for interview practice: marketing site, auth, mock interviews with voice capture, feedback, history, analytics, and admin tools. Talks to the [NestJS backend](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend) over HTTP with cookie-based sessions.

**Living product / dev contract:** [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md)

If you are in the **monorepo** (`ai-interview-coach-full-stack`), prefer the root [README](../README.md) for Docker Compose (Mongo + Redis + Nest + Next + Nginx).

---

## Features

| Area | Routes / pages |
|------|----------------|
| **Marketing** | Landing, checkout, privacy, terms |
| **Auth** | Login, registration, admin login |
| **Dashboard** | Overview, recent sessions, score trends |
| **Mock interviews** | Role/difficulty setup → live session → feedback → results |
| **History** | Past sessions and session detail |
| **Analytics** | Progress and score visualizations |
| **Admin** | Dashboard, question bank, users, roles, stats, settings |
| **User settings** | Account preferences + homepage testimonial |

**Voice / transcription:** Browser **Web Speech API**. Best in Chromium (Chrome, recent Edge).

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

- Node.js 20.x or 22.x (LTS recommended)
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

| Variable | Required | Where | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Browser + build | Backend **public** origin. Local: `http://localhost:3333`. Docker via Nginx: `http://localhost`. Production: `https://your-api.onrender.com` |
| `INTERNAL_API_URL` | Docker only | Server runtime | Nest URL **inside** the Docker network for RSC/SSR fetches (e.g. `http://backend:3333`). Not used by the browser. |

If the API is mounted at `/api`, you can set e.g. `https://api.example.com/api` — the client strips the suffix and routes REST vs auth correctly.

### 3. Start the backend

See the [backend README](https://github.com/Asif-Zaman-Suvo/ai-interview-coach-backend). Minimum:

```bash
# monorepo: infra
docker compose up mongo redis

# backend
cd ../ai-interview-coach-backend
cp .env.example .env   # MONGODB_URI, BETTER_AUTH_*, FRONTEND_URL=http://localhost:3000
npm run start:dev
```

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
docker compose up --build --scale backend=2
```

- UI + API: **http://localhost** (Nginx)
- Compose sets `NEXT_PUBLIC_API_URL=http://localhost` (browser) and `INTERNAL_API_URL=http://backend:3333` (Next SSR inside the frontend container)

Hot-reload:

```bash
docker compose -f docker-compose.dev.yml up
```

Frontend image: `ai-interview-coach/Dockerfile` (Next standalone).

### Why `INTERNAL_API_URL`?

In Docker, the Next **server** runs inside a container. `localhost` there is not Nginx/Nest on your laptop. Marketing pages (testimonials, dashboard preview) fetch the API at build/runtime on the server — they must use the Docker service name (`backend:3333`). The browser still uses `NEXT_PUBLIC_API_URL`.

Same split applies in production if Next SSR cannot reach the public API hostname from its private network (use an internal service URL). On Vercel → public Render API, one public URL is usually enough for both.

---

## How it talks to the backend

- **Browser REST:** `lib/api.ts` → `{NEXT_PUBLIC_API_URL}/api/...` with `credentials: 'include'`
- **Browser auth:** Better Auth client + `/auth/me`, `/auth/register`
- **Server (RSC):** `serverRestApiRoot()` → `INTERNAL_API_URL` if set, else `NEXT_PUBLIC_API_URL`
- **Types:** `lib/types.ts` should stay aligned with backend DTOs

Typical interview flow:

```
POST /api/sessions/start
  → GET /api/sessions/:id
  → POST /api/sessions/:id/answer
  → POST /api/sessions/:id/complete
```

---

## Production (Vercel + Render)

| Where | Variable | Value |
|-------|----------|--------|
| Vercel | `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com` |
| Render (backend) | `FRONTEND_URL` | `https://your-app.vercel.app` |
| Render | `BETTER_AUTH_URL` | same as public API URL |
| Render | `REDIS_URL` | unset until Redis is provisioned |

Redeploy frontend after changing `NEXT_PUBLIC_*` (baked at build time).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build (standalone output for Docker) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run test:watch` | Vitest watch |

---

## Project structure

```text
app/
  (marketing)/     Landing, checkout, privacy, terms
  (auth)/          Login / register
  (dashboard)/     Dashboard, interview, history, admin, analytics
components/
  ui/              Shared primitives
  layout/          Header, sidebar
  interview/       Live session flow
  admin/           Admin tools
  landing/         Marketing sections
lib/
  api.ts           REST client
  api-url.ts       /api vs /auth URL builder
  backend-origin.ts  Public + INTERNAL_API_URL helpers
  auth-client.ts   Better Auth client
  hooks/           TanStack Query hooks
  load-*.ts        Server-side marketing data loaders
  types.ts         Shared DTOs
Dockerfile         Production standalone image
docs/PROJECT_SPEC.md
```

---

## Browser support

| Feature | Support |
|---------|---------|
| Core app | Modern evergreen browsers |
| Live voice transcription | **Chromium-first** (Web Speech API) |

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
