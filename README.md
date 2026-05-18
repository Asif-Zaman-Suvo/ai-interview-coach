# AI Interview Coach

## Features we’re building

- **Marketing** — Landing, checkout, privacy, and terms.
- **Auth** — Login, registration, and admin login; sessions call a separate API with cookies.
- **Dashboard** — Overview and entry into practice flows.
- **Mock interviews** — Role/difficulty setup, live session (including voice capture in the browser), per-answer feedback, session feedback view, and results summary.
- **History** — List past sessions and open session detail.
- **Analytics** — Progress and score visualizations.
- **Admin** — Dashboard, question bank, users, roles, stats, app settings, and interview review listings.
- **User settings** — Account/settings area in the app shell.

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS v4**, **@base-ui/react**, **Lucide**, **next-themes**
- **TanStack Query** for server state
- **Better Auth** (client) against the backend
- **Recharts** for charts
- **Sonner** for toasts

Backend for auth and data is a **NestJS** API (not in this repo); this app talks to it over HTTP using `NEXT_PUBLIC_API_URL`.

## Local setup

1. Install **Node.js** (LTS 20.x or 22.x recommended).

2. Clone the repo and install dependencies:

   ```bash
   cd ai-interview-coach
   npm install
   ```

3. Configure the API origin:

   ```bash
   cp .env.example .env.local
   ```

   By default, `.env.example` sets `NEXT_PUBLIC_API_URL=http://localhost:3333`. Change it if your backend runs elsewhere.

4. Start the **Nest backend** so that URL responds (auth + REST). Without it, sign-in and API-backed pages will fail in the browser.

5. Start the Next app:

   ```bash
   npm run dev
   ```

6. Open **http://localhost:3000**.
