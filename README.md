# Portfolio - M. Abu Amar Al Badawi

> Mobile & Full Stack Developer. Production projects, writing, and quotes in one editorial dossier.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![daisyUI](https://img.shields.io/badge/daisyUI-5.x-5A0EF8?style=flat&logo=daisyui&logoColor=white)](https://daisyui.com/)

## Overview

A prerendered, bilingual portfolio (Indonesian default, English fallback) that presents shipped work at a glance: case-study ledger, writing, and a quotes surface with auth-gated publishing.

**Live demo:** [abuamar.online](https://abuamar.online)

## Tech stack

- **Framework:** Vue 3 + TypeScript + Composition API, vue-router
- **Styling:** Tailwind CSS v4 + daisyUI v5 with two custom themes (`portfolio` light, `portfolio-dark`) and a light / dark / system toggle resolved before first paint. Type: Newsreader display, Source Serif 4 body, IBM Plex Sans chrome, IBM Plex Mono data.
- **Internationalization:** vue-i18n - Indonesian default locale, English fallback
- **Build:** Vite + vite-ssg - seven prerendered pages plus sitemap; `bun scripts/cv/generate.ts` refreshes `public/cv.pdf` before every build
- **Icons:** lucide-vue-next
- **Content:** experience / projects / skills / achievements from MongoDB Atlas through a separate Express backend ([backend.abuamar.online](https://backend.abuamar.online)); posts published from Payload CMS
- **CI/CD:** GitHub Actions over SSH to the VPS - `main` deploys production, `development` deploys dev.abuamar.online

## Quick start

```bash
git clone https://github.com/abuamar142/portfolio.git
cd portfolio
bun install
cp .env.example .env.local
# set VITE_BACKEND_URL in .env.local
bun run dev
```

### Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run build` | Type-check, regenerate CV, prerender production build |
| `bun run preview` | Preview the `dist` build |
| `bun run lint` | ESLint with autofix |
| `bun run type-check` | `vue-tsc` project check |
| `bun run format` | Prettier over `src/` |
| `bun run generate-cv` | Rebuild `public/cv.pdf` from portfolio data |

## Deployment

Every push to `main` or `development` triggers the **Deploy Portfolio to VPS** workflow: a `check` job runs `eslint` and `type-check` first; only on success does the SSH deploy job pull and rebuild on the VPS via `/opt/ops/bin/deploy-portfolio.sh <branch>`. Concurrent runs for the same ref cancel each other.

Environment variable for production:

```bash
VITE_BACKEND_URL=https://backend.abuamar.online
```

## Features

- Light / dark / system theme with an icon toggle in the masthead and mobile menu
- Editorial dossier layout: fixed numbered spine on desktop, numbered section strip on small screens, mobile menu
- Blog list with search and category filters, per-post detail pages
- Quotes with auth-gated CRUD and share links (OG preview for WhatsApp/Telegram)
- Link archive with tag filter, search, and owner-gated CRUD
- QR Maker (text/URL → PNG/SVG with brand colors, fully local-first)
- Background Remover (WebGPU, zero-pixels-to-server)
- Reveal and rise motion that fully yields to `prefers-reduced-motion`
- Every text token measured against its canvas (contrast budgets documented in `src/assets/main.css`)
- Toast notifications, loading skeletons, and retryable error states

## Structure

```
src/
├── assets/          # main.css: tokens, components layer, dark theme block
├── components/
│   ├── layout/      # AppHeader, MobileMenu, AppFooter
│   ├── sections/    # Hero, About, Experience, Projects, Skills, Contact
│   └── ui/          # SectionHeader, BaseButton, SearchInput, cards, states
├── composables/     # useAuth, usePortfolio, usePosts, useTheme, useToast, ...
├── components/      # AuthControls, AuthModal, modals, cards, layout, sections, ui
├── locales/         # en.ts, id.ts (243 keys each, parity-checked)
├── pages/           # HomePage, BlogsList, BlogDetail, ExplorePage, QuotesPage,
│                    # LinksPage, QrMakerPage, RemoveBgPage, QuoteDetailPage, NotFound
├── router/          # routes + SSG registration
├── services/        # client.ts (shared axios), portfolio.ts, quote.ts, link.ts
└── types/           # shared TypeScript contracts
scripts/cv/          # CV generator (PDF)
public/              # cv.pdf, og image, robots.txt
.github/workflows/   # deploy.yml - VPS deployment
```

## About

**Software Engineer** | **Mobile Developer** | **Full-Stack Enthusiast**

- Informatika student at Universitas Jenderal Achmad Yani Yogyakarta
- Full-Stack Software Engineer Intern at Refactory
- Bangkit Academy 2024 Graduate (Mobile Development)

### Core skills

- **Mobile:** Flutter, Dart, Kotlin, Android
- **Web:** React, Vue.js, TypeScript, JavaScript
- **Backend:** Supabase, REST APIs
- **Tools:** Git, GitHub Actions, Linux

## Connect

- **Email:** [abuamar.albadawi@gmail.com](mailto:abuamar.albadawi@gmail.com)
- **GitHub:** [@abuamar142](https://github.com/abuamar142)
- **Location:** Bantul, Indonesia
