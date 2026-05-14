# AI Interview Coach

Front-end for a full-stack **mock interview** product: configure a session by role and difficulty, practice with a guided flow, then review **scores**, **per-question feedback**, **history**, and **analytics**. Built as a production-style **Next.js App Router** app with a separate **NestJS** API and **Better Auth**.

---

## Features

- **Marketing** — Landing, privacy, and terms routes under a dedicated layout.
- **Authentication** — Email registration and sign-in via [Better Auth](https://www.better-auth.com/) against the backend (`credentials: 'include'` for session cookies).
- **Dashboard** — At-a-glance stats and entry points into practice flows.
- **Interview** — Setup (`/interview/setup`), live session (`/interview/[sessionId]`), post-session feedback, and a detailed **results** page (`/interview/result/[sessionId]`).
- **History** — Paginated session list and session detail views.
- **Analytics** — Charts and summaries built with **Recharts**.
- **Admin** (role-gated in product terms) — Dashboard metrics, question bank, users, roles, and stats surfaces.
- **Settings** — Account-oriented screens in the dashboard shell.
- **Theming** — Light / dark via **next-themes**, with a cohesive UI kit (**Tailwind v4**, **@base-ui/react**, **Lucide**).

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 16** (App Router, Turbopack in dev) |
| UI | **React 19**, **TypeScript** |
| Data fetching | **TanStack Query v5** (+ devtools in development) |
| Auth client | **better-auth** (`createAuthClient`) |
| Styling | **Tailwind CSS v4**, **tailwind-merge**, **CVA** |
| Charts | **Recharts** |
| Notifications | **Sonner** |

REST calls target the Nest API under `{API_ORIGIN}/api/...`. Legacy auth paths may resolve to `{API_ORIGIN}/auth/...` when applicable—see `lib/api-url.ts`.

---

## Prerequisites

- **Node.js** — Use an LTS release in the **20** or **22** line (or **24+**) for best compatibility with the toolchain. Avoid odd major versions in production if your dependencies declare narrow engine ranges.
- **Backend** — The companion **NestJS** service (`ai-interview-coach-backend` in a typical monorepo layout) must be running and exposing Better Auth + REST at the origin you configure below.

---

## Getting started

```bash
git clone <your-fork-or-remote>
cd ai-interview-coach
npm install
cp .env.example .env.local
# Edit .env.local if your API is not on localhost:3333
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Ensure the API is up (e.g. `http://localhost:3333`) before using login, registration, or any data-backed routes—otherwise the browser will show network / `Failed to fetch` errors.

---

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes (for real auth & API) | Backend **origin** (no trailing slash), e.g. `http://localhost:3333`. If your host already uses a path suffix like `/api`, the client normalizes it—see `lib/backend-origin.ts`. |

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

After changing env files, restart `next dev`.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js config) |

---

## Repository layout

```text
ai-interview-coach/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── (marketing)/          # /, /privacy, /terms
│   ├── (auth)/               # /login, /register, /login/admin
│   └── (dashboard)/          # Shell: sidebar, /dashboard, /analytics, /history, …
│       ├── admin/            # /admin/dashboard, questions, users, roles, stats
│       ├── analytics/
│       ├── history/
│       ├── interview/        # setup, [sessionId], result/[sessionId]
│       └── settings/
├── components/
│   ├── ui/                   # Shared primitives
│   ├── layout/               # Navigation, theme
│   ├── landing/
│   ├── dashboard/
│   ├── interview/
│   ├── analytics/
│   └── admin/
├── lib/
│   ├── api.ts                # fetch wrapper (cookies + JSON)
│   ├── api-url.ts            # Resolves REST vs legacy auth paths
│   ├── backend-origin.ts     # Normalizes NEXT_PUBLIC_API_URL
│   ├── auth-client.ts        # Better Auth client
│   ├── providers.tsx         # React Query + Toaster
│   ├── hooks/                # useSessionById, dashboard, admin, …
│   ├── types.ts
│   └── …
├── public/
├── next.config.ts
├── postcss.config.mjs
├── components.json
├── package.json
└── tsconfig.json
```

---

## Architecture notes

- **No BFF in this repo** — Session and `/api/*` traffic go to the Nest host. Configure CORS and cookie domains on the backend so the browser can send credentials from `localhost:3000` to `localhost:3333` during development.
- **Client data hooks** — Pages that call `useQuery` must be **Client Components** (`"use client"`) or wrap hooks in a client child (see interview result and history detail pages).

---

## Contributing & quality

- Run `npm run lint` before opening a PR.
- Internal code-structure graphs (optional): see `graphify-out/GRAPH_REPORT.md` if present; refresh with `graphify update .` when using the project’s Graphify tooling.

---

## License

Private project (`"private": true` in `package.json`). Add a `LICENSE` file if you open-source the repository.
