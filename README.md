# AI Interview Coach

Web app for **AI-assisted mock interviews**: setup flows, practice sessions, feedback views, and a marketing landing page. Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, **shadcn-style UI** (Base UI primitives + shared components), and **next-themes** for light/dark mode.

## Requirements

- **Node.js** 20+ (see `package.json` / CI if you pin a version)

## Setup

```bash
npm install
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Dev server (Turbopack)   |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
| `npm run lint` | ESLint                   |

## App structure

- **`app/layout.tsx`** — Root HTML/body, global CSS, **`ThemeProvider`** (no chrome).
- **`app/(marketing)/`** — Public site: landing `/`, stub legal pages `/privacy`, `/terms`. Layout includes **Navbar** + **Footer**.
- **`app/(dashboard)/`** — Signed-in style shell: **Sidebar**, mobile top bar + **BottomNav**, main content. Routes: **`/dashboard`**, **`/analytics`**, **`/interview/*`**.
- **`app/(auth)/`** — **`/login`**, **`/register`** (no dashboard shell).

## Styling & theme

- Tokens and Tailwind v4 wiring live in **`app/globals.css`** (`@theme inline`, semantic colors, `@custom-variant dark` for class-based dark mode).
- UI primitives live under **`components/ui/`**; feature UI under **`components/interview/`**, **`components/dashboard/`**, **`components/landing/`**, etc.

## Environment

Add a **`.env.local`** (gitignored) when you wire APIs, auth, or analytics. There is no committed env template yet.

## Publishing to GitHub (first push)

Prerequisites: SSH config with a **`personal`** or **`office`** host alias pointing at `github.com` (see [GitHub docs on multiple accounts](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)). Create an **empty** repository on GitHub (no README) named e.g. `ai-interview-coach`.

Replace **`GITHUB_USERNAME`**, **`REPO_NAME`**, and pick the host that matches your SSH config:

```bash
git remote add origin git@personal:GITHUB_USERNAME/REPO_NAME.git
# or: git remote add origin git@office:GITHUB_USERNAME/REPO_NAME.git

git push -u origin main
```

If `origin` already exists, use `git remote set-url origin <url>` instead.

## Git: ignoring Cursor IDE files

**`.cursor/`** is listed in **`.gitignore`** so local Cursor config is not committed.

If `.cursor` was already tracked, remove it from the index once (does not delete your local folder):

```bash
git rm -r --cached .cursor
```

Then commit the `.gitignore` change.

## License

Private project (`"private": true` in `package.json`); add a license file if you open-source it.
