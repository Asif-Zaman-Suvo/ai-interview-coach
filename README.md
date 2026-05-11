# AI Interview Coach

## Purpose

Web app for **mock interviews**: pick role and difficulty, run a practice session (UI + mock transcript flow), then review **feedback**, **scores**, and **analytics-style** summaries. Includes a **marketing** landing area and **auth** screens as scaffolding for a full product.

## Technologies

| Area | Stack |
|------|--------|
| Framework | **Next.js** 16 (App Router), **React** 19 |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** v4 (`@tailwindcss/postcss`), design tokens in `app/globals.css` |
| UI | **@base-ui/react**, **Radix Icons**, **Lucide**, **class-variance-authority**, **tailwind-merge** |
| Charts | **Recharts** |
| Theme | **next-themes** (light / dark) |
| Tooling | **ESLint** (`eslint-config-next`) |

## Project structure

```text
ai-interview-coach/
├── app/
│   ├── layout.tsx              # Root layout, fonts, ThemeProvider
│   ├── globals.css             # Tailwind import, @theme tokens, base styles
│   ├── (marketing)/            # Public site (route group, no URL segment)
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing (/)
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── (dashboard)/            # App shell: sidebar, mobile nav
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx  # /dashboard
│   │   ├── analytics/page.tsx  # /analytics
│   │   └── interview/
│   │       ├── setup/page.tsx
│   │       └── [sessionId]/
│   │           ├── page.tsx
│   │           └── feedback/page.tsx
│   └── (auth)/                 # Auth without dashboard chrome
│       ├── login/page.tsx      # /login
│       └── register/page.tsx   # /register
├── components/
│   ├── ui/                     # Buttons, cards, inputs, dialogs, etc.
│   ├── layout/                 # Sidebar, bottom nav, theme toggle
│   ├── landing/                # Marketing sections
│   ├── dashboard/              # Dashboard widgets
│   ├── interview/              # Session / setup / feedback UI
│   └── analytics/              # Charts for analytics page
├── lib/
│   ├── types.ts
│   ├── mock-data.ts
│   └── utils.ts
├── public/                     # Static assets
├── components.json             # shadcn-style component paths
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── tailwind.config.ts
```
