# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiter / Hiring Manager:** Tech companies evaluating Abu Amar for developer positions. They scan for tech stack breadth, project quality, and real-world experience.
- **Client / Collaborator:** People looking to hire for freelance projects or collaboration. They check capability range and past delivery.
- **Developer Community:** Fellow developers exploring projects, tech stack choices, and implementation approaches.
- **Quote Contributor:** Site visitors who register and publish their own quotes to the community board, optionally anonymously.

## Product Purpose

Personal portfolio showcasing Abu Amar's work as a Mobile & Full Stack Developer, with writing and a community quotes board as living surfaces. Success means visitors understand the breadth of capability (frontend, backend, mobile, infrastructure) and reach out for opportunities.

## Positioning

Full Stack + Mobile Expertise — one person who can handle the entire stack from mobile apps to backend APIs to deployment infrastructure. Not a tutorial collector; real production projects.

## Operating Context

- Visitors arrive from LinkedIn, GitHub, or direct referral
- Quick scan: 5-10 seconds to form first impression
- Deep dive: read project case studies, check tech stack, view live demos
- Contact: email, LinkedIn, GitHub links, WhatsApp (wa.me link from CMS identity)
- Resume/CV PDF regenerated from portfolio data before every build (`public/cv.pdf`)
- Environments: `main` branch deploys production (abuamar.online); `development` branch deploys dev.abuamar.online

## Capabilities and Constraints

- Dynamic data from MongoDB via Payload CMS backend (experience, projects, skills, achievements); posts published from Payload CMS
- Blog section with search and category filtering; detail pages prerendered per published slug at build time
- Multiple deployed projects with live demos
- Bilingual: Indonesian default locale, English fallback (vue-i18n); every user-facing string lives in `src/locales/`
- Prerendered SSG build (vite-ssg) with build-time `sitemap.xml`; static routes plus every blog slug
- Quotes surface: community quote board with auth-gated CRUD and anonymous option, normalized tag filter, search and sort, and shareable `/quotes/:id` links whose OG preview is rendered server-side for WhatsApp/social crawlers
- `/explore` acts as the ledger directory of non-landing surfaces; each new surface ships as one more entry
- Auth is a separate service (auth.abuamar.online, JWT, login/register modal)
- Editorial dossier design system: Tailwind CSS v4 + daisyUI v5 custom themes (`portfolio` light default, `portfolio-dark` via `html[data-theme]`) — cream canvas (#F3F4EF) / charcoal dark canvas (#14161A), light·dark·system toggle (localStorage `portfolio-theme`, prepaint anti-FOUC), Source Serif 4 body, Newsreader display, IBM Plex Sans/Mono labels and data, single terracotta accent, numbered sections with a desktop spine rail, sharp (radius 0) shapes, dark colophon footer — normatively documented in `DESIGN.md` (+ `.impeccable/design.json` sidecar), which future pages and tools must follow
- Auto-renews SSL, CI/CD via GitHub Actions (SSH deploy script on the VPS)

## Brand Commitments

- Name: **M. Abu Amar Al Badawi** (formal, document titles); **Abu Amar** (masthead and site title suffix "… | Abu Amar")
- Bilingual commitment: Indonesian is the default locale, English the fallback — no surface ships in one language only
- Official channels: abuamar.albadawi@gmail.com · github.com/abuamar142 · linkedin.com/in/abu-amar · WhatsApp via CMS identity field
- Location identity: Bantul, Indonesia (Yogyakarta time zone shown in hero)

## Evidence on Hand

- 3+ deployed projects with live demos (abuamar.online, tambangan.abuamar.online, asyaikhoni.abuamar.online)
- Blog posts with real content (bilingual id/en per post)
- Work experience entries from MongoDB
- GitHub repos with commit history
- Community quotes with real content in PostgreSQL; `/quotes/:id` share links with crawler-routed OG previews live
- Generated CV PDF at `public/cv.pdf`, rebuilt from portfolio data each build

## Product Principles

1. **Show, don't tell** — Live demos and real projects over descriptions
2. **Breadth with depth** — Full Stack capability demonstrated through actual work
3. **Clean and fast** — Minimal design, fast loading, no unnecessary clutter

## Accessibility & Inclusion

- Responsive design (mobile-first)
- Dark mode support
- Keyboard navigation
- Skip-to-content link and visible `:focus-visible` rings on every interactive element
- WCAG AA contrast budgets measured for both themes (documented in `src/assets/main.css`)
- All motion neutralized under `prefers-reduced-motion`
