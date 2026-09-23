---
name: Abu Amar Portfolio
description: Editorial dossier system — Burnt Terracotta on Archive Cream, serif prose, numbered sections, sharp shapes, flat depth.
colors:
  # Light theme (default, daisyUI `portfolio`)
  archive-cream: "#f3f4ef"
  paper-white: "#ffffff"
  hairline-sage: "#aab8b1"
  ink: "#1c2422"
  ink-2: "#39443f"
  ink-3: "#4e5a56"
  ink-4: "#66716d"
  burnt-terracotta: "#b8442a"
  voltage: "#d65a3a"
  surface-green: "#e2e8e2"
  colophon-green-black: "#1d2826"
  info-slate-teal: "#416b63"
  success-pine: "#157a5f"
  error-rust: "#a33b26"
  # Dark theme (daisyUI `portfolio-dark`, via html[data-theme])
  newsprint-charcoal: "#14161a"
  charcoal-paper: "#1b1f1d"
  charcoal-rule: "#2c322e"
  ink-on-dark: "#f0f2f4"
  ink-2-on-dark: "#c9cfcc"
  ink-3-on-dark: "#a4aba8"
  ink-4-on-dark: "#8b928e"
  ember: "#e27a5f"
  hairline-dark: "#262c28"
  surface-green-dark: "#1f2421"
  error-ember: "#d9634a"
typography:
  display:
    fontFamily: "Newsreader, ui-serif, Georgia, serif"
    fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Newsreader, ui-serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Source Serif 4', ui-serif, Georgia, serif"
    fontSize: "clamp(1.875rem, 3vw, 2.625rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Source Serif 4', ui-serif, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
  button:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
  caption:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
  data:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.35
rounded:
  none: "0rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "clamp(3.5rem, 6vw, 5rem)"
  rail: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.burnt-terracotta}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "0 1.25rem"
    height: "2.75rem"
    typography: "{typography.button}"
  button-primary-hover:
    backgroundColor: "color-mix(in oklab, #b8442a 86%, #000)"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    typography: "{typography.button}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1.25rem"
    height: "2.75rem"
    typography: "{typography.button}"
  button-outline-hover:
    backgroundColor: "transparent"
    textColor: "{colors.burnt-terracotta}"
    rounded: "{rounded.none}"
    typography: "{typography.button}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    typography: "{typography.button}"
  chip:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.5rem"
    typography: "{typography.caption}"
  chip-accent:
    backgroundColor: "color-mix(in oklab, #b8442a 8%, #ffffff)"
    textColor: "{colors.burnt-terracotta}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.5rem"
    typography: "{typography.caption}"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.5rem 1.25rem"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "2.75rem"
---

# Design System: Abu Amar Portfolio

## Overview

**Creative North Star: "The Editorial Dossier"**

The site reads like a curated case file: every section is numbered (`01`–`07`),
each number paired with an uppercase kicker and a hairline rule that runs to the
edge. A fixed vertical spine rail annotates the left margin on desktop; a dark
colophon footer closes the file. Nothing floats without a rule, nothing is
rounded, nothing decorates for its own sake.

The voice is calm and scientific. Serif prose carries the argument (`Source Serif
4` at 1.125rem/1.6, measures capped at 54–68ch), evidence arrives as mono data
ladders, and `Newsreader` display type does the hero-scale statements. Chrome —
nav, labels, buttons — is small, uppercase, tracked `IBM Plex Sans`. One accent,
Burnt Terracotta, signals action and current state; its scarcity is the point.

Density is editorial, not airy-for-its-own-sake: sections divide with a single
1px rule and `clamp(3.5rem, 6vw, 5rem)` of breathing room; components pack tight
inside (chips at 4px/8px, metric rows at 18px block). Depth is tonal — a white
card on cream, framed by hairlines — never a resting shadow. Rejected outright:
rounded corners, gradients, gloss, and any second accent color.

**Key Characteristics:**
- Numbered sections (`01 / KICKER ——— title`) with a desktop spine rail
- Sharp geometry everywhere: `border-radius: 0` is absolute
- Single terracotta accent; voltage marks vs. text accent are different values
- Flat & tonal: 1px hairlines + tonal steps, shadows only for overlays and the quote cards
- Four-family type system: Newsreader display · Source Serif 4 prose · IBM Plex Sans chrome · IBM Plex Mono data
- Light `Archive Cream` default with a full `Newsprint Charcoal` dark twin (`html[data-theme]`)

## Colors

One warm neutral paper, one terracotta signal — nothing else competes.

### Primary
- **Burnt Terracotta** (#B8442A / token `burnt-terracotta`): the interactive accent —
  primary buttons, active/selected states, focus rings, links in prose, action
  text. 5.0:1 on cream (white on it: 5.5:1) → safe for text and fills. In dark
  theme the fill value is unchanged; text usage moves to **Ember**.
- **Voltage Mark** (#D65A3A / token `voltage`): the identity mark — 3×14px
  markers, spine progress, pulse dot, selection tint. Only 3.5:1 on cream, so it
  is **marks, dots and rules ONLY, never small text** on light.
- **Ember** (#E27A5F / token `ember`): Burnt Terracotta's dark-theme text form
  (6.2:1 on charcoal) — links, actions, focus, hover in dark. Also the colophon's
  text accent on dark (5.2:1 on `colophon-green-black`).

### Neutral
- **Archive Cream** (#F3F4EF / `archive-cream`): page canvas, light theme.
- **Paper White** (#FFFFFF / `paper-white`): raised surface — cards, figure
  blocks, inputs, chips. The tonal step from cream to white is the light theme's
  only "elevation".
- **Hairline Sage** (#AAB8B1 / `hairline-sage`): the structural rule — section
  borders, card borders, masthead border, rules in section heads.
- **Ink scale** (#1C2422 `ink` → #39443F `ink-2` → #4E5A56 `ink-3` → #66716D `ink-4`):
  body text → secondary prose → descriptions → labels/meta. Contrast budget on
  cream: 14.4 / 9.1 / 6.5 / 4.6 : 1 (all WCAG AA).
- **Surface Green** (#E2E8E2 / `surface-green`): the hover fill for ledger rows
  and mobile menu items. Deliberately the **same value as `.hairline-light`** —
  light rule and hover fill are one token by design.
- **Colophon Green-Black** (#1D2826 / `colophon-green-black`): footer background
  in both themes (`bg-neutral`); its content color is Archive Cream (13.7:1).
- **Semantic:** Info Slate Teal #416B63, Success Pine #157A5F, Error Rust
  #A33B26 (light) → Error Ember #D9634A (dark; light value scores 2.8:1 there).

### Dark theme (`portfolio-dark`)
Applied unlayered via `<html data-theme="portfolio-dark">` — prepaint script in
`index.html` + `useTheme.ts`, stored under `localStorage['portfolio-theme']`
(light · dark · system).

- **Newsprint Charcoal** (#14161A `newsprint-charcoal`): canvas.
- **Charcoal Paper** (#1B1F1D `charcoal-paper`) / **Charcoal Rule** (#2C322E
  `charcoal-rule`): surface / border — the same tonal ladder as cream/white/sage.
- **Ink on dark:** #F0F2F4 → #C9CFCC → #A4ABA8 → #8B928E (16.1 / 11.5 / 7.7 / 5.7 : 1).
- Hairline dark #262C28, surface green dark #1F2421 — dark twins of the light pair.

### Named Rules
**The Voltage Rule.** #D65A3A marks; #B8442A speaks (light); #E27A5F speaks
(dark). Never put voltage on cream as text — it is a 3.5:1 mark by law.

**The Same-Value Rule.** Light `.hairline-light` and `.surface-green` are both
#E2E8E2 on purpose: the line you rest on is the line you hover onto. Don't split them.

## Typography

**Display Font:** Newsreader (fallback `ui-serif, Georgia, 'Times New Roman', serif`)
**Body Font:** Source Serif 4 (fallback `Source Serif Pro, ui-serif, Georgia`)
**Chrome Font:** IBM Plex Sans (fallback `ui-sans-serif, system-ui`)
**Data Font:** IBM Plex Mono (fallback `ui-monospace, SFMono-Regular, Menlo`)

**Character:** Scholarly serif prose anchored by engineering-grade sans/mono
chrome — the pairing says "published paper with instrument readings".

### Hierarchy
- **Display / hero** (Newsreader 400, `clamp(2.75rem, 6.5vw, 5.5rem)`, lh 0.98,
  ls −0.015em): hero greeting only (`.display-hero`).
- **Headline** (Newsreader 400, `clamp(2.25rem, 5vw, 3.75rem)`, lh 1, ls −0.01em):
  pull statements, outlined monogram sibling (`.display-1`, `.figure-monogram` at
  `clamp(4rem, 7vw, 6.5rem)` with 1.5px transparent-fill stroke).
- **Title** (Source Serif 4 500, `clamp(1.875rem, 3vw, 2.625rem)`, lh 1.1,
  ls −0.01em): page and section titles (`.display-2`); `heading-sm`
  `clamp(1.5rem, 2.2vw, 2rem)` for sub-titles.
- **Row title** (Source Serif 4 500, `clamp(1.25rem, 1.8vw, 1.625rem)`, lh 1.2):
  list/ledger item titles (`.row-title`).
- **Body** (Source Serif 4 400, 1.125rem, lh 1.6): default prose; `.lead`
  `clamp(1.125rem, 1.4vw, 1.375rem)`/lh 1.5 in `ink-2`, max **54ch**; blog prose
  max **68ch** at lh 1.75.
- **Label** (IBM Plex Sans 600, 0.6875rem, ls 0.12em, UPPERCASE, `ink-4`):
  kickers, section heads, metric names (`.label`; `.label-ink` = `ink`,
  `.label-voltage` = `burnt-terracotta`).
- **Button** (IBM Plex Sans 600, 0.8125rem, ls 0.08em, UPPERCASE): `.btn`.
- **Data** (IBM Plex Mono 500, 0.875rem, lh 1.35, `ink-4`): dates, counts,
  values, meta (`.data`; metric values at 1.375rem with terracotta `em` suffix).
- **Caption** (IBM Plex Mono 400, 0.75rem): chips, mono row places
  (`.chip`, `.row-place` at 500/lh 1.4/ls 0.04em uppercase).

### Named Rules
**The Role Rule.** Prose = serif, chrome = sans, data = mono, statements =
Newsreader. Never cross a role; never set prose in mono or labels in serif.

**The Track-and-Cap Rule.** Every sans label and button is uppercase with
positive tracking (≥0.08em). Serif never goes uppercase.

## Layout

- **Container `.wrap`:** max-width `90rem`, centered. Inline gutter 1.25rem →
  2rem ≥768px → `padding-left: 5rem` (the spine rail) + `3rem` right ≥1100px.
- **Header:** sticky masthead, height `--header-h` 3.5rem (`min-h-14`), bottom
  hairline; `scroll-padding-top: calc(header-h + 1.5rem)`.
- **Sections `.section`:** `border-top: 1px hairline-sage` +
  `padding-block: clamp(3.5rem, 6vw, 5rem)`. Standalone pages start at
  `.page-top` (`padding-top: clamp(2.5rem, 5vw, 4.5rem)`).
- **Numbering:** `sectionNav` drives everything — spine, mobile strip, menu and
  heads: `01 about / 02 experiences / 03 projects / 04 skills / 05 education /
  06 achievements / 07 contact`.
- **Spine rail (≥1100px):** fixed left, `3.5rem` wide at `left: 1.5rem`; 1px
  track, 2px terracotta progress via `animation-timeline: scroll()` (hidden
  without support); vertical labels (`writing-mode: vertical-rl`, 0.5625rem/600/
  ls 0.14em), active = terracotta text.
- **Numbered strip (<1100px):** sticky row under the header, horizontal scroll,
  cells split by `.hairline-light` right borders, active cell shows the 3×14
  marker.
- **Masthead nav ≥1200px** (below that: `MobileMenu` under a top hairline).
  Hero grid: `1fr minmax(240px, 32%)` ≥lg. About: `1 / 1.6` columns ≥lg.
  Footer colophon grid: `1.4fr 1fr 1fr 1fr` ≥lg. Quotes: CSS masonry
  `columns-1 sm:2 lg:3`.
- **Rhythm:** stack gaps 1rem; component padding 16–24px; metric rows 18px
  block; section-head gap 14px.

## Elevation & Depth

**Flat & tonal.** The theme ships `--depth: 0; --noise: 0`. Separation comes
from the 1px Hairline Sage frame plus the tonal step Archive Cream → Paper
White. Shadows are not a resting state anywhere on content surfaces.

### Shadow Vocabulary
- **Quote card rest / hover** (`2px 3px 8px rgb(0 0 0 / 0.15)` →
  `4px 6px 16px rgb(0 0 0 / 0.25)`): the sticky-note motif on QuotesPage —
  the only component allowed to lift, paired with its ±3° deterministic rotation.
- **Overlay** (Tailwind `shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1),
  0 4px 6px -4px rgb(0 0 0 / 0.1)`): toast, dropdown, modal only — depth that
  means "above the page".

### Named Rules
**The Flat-by-Default Rule.** Cards, panels and figure blocks never carry a
shadow. Lift (−2px) and tonal fill communicate hover; shadow is reserved for
overlays and the quote cards.

## Shapes

`border-radius: 0` is absolute — the theme zeroes `--radius-selector`,
`--radius-field` and `--radius-box`, and the design note in `main.css` says it
outright: *the only curves on this site are in the letterforms*. Buttons, chips,
cards, inputs, modals, images: sharp rectangles. (Browser chrome — the thin
scrollbar thumb — is the sole rounded pixel.)

Borders are the form language: 1px Hairline Sage for structure (section tops,
cards, masthead), 1px `hairline-light` for internal divisions (figure head/foot,
metric rows, mobile strip). Recurring silhouettes: the 3px×36px / 3×14px
terracotta marker bars, the outlined display monogram (1.5px text-stroke, no
fill), and hairline-framed figure blocks.

## Components

### Buttons
Uppercase sans, sharp, 44px-tall touch targets (`min-height: 2.75rem`).
- **Primary:** `#B8442A` fill, white text; hover `color-mix(in oklab, #B8442A
  86%, #000)`; `active: translateY(1px)`.
- **Outline:** transparent with 1px `ink` border → hover border+text
  `burnt-terracotta`. `outline × primary` variant: terracotta border/text →
  hover fills solid.
- **Ghost:** transparent, `ink` text, hover `surface-green` fill.
- **Sizes:** sm `2.25rem`/0.75rem, md `2.75rem`/0.8125rem, lg `3rem`/0.875rem;
  disabled `opacity .5`. Icons 16px (`size-4`), gap 0.5rem.
- **`BaseButton`** maps `primary | secondary | outline | ghost` → these classes
  and renders `button` / `a` / `router-link` by prop.

### Chips
Mono caption, 1px `hairline-sage` border, Paper White fill, `ink-3` text,
padding 4px/8px. Selected/active = `chip-accent`: terracotta text, border
`color-mix(#B8442A 35%, transparent)`, fill `color-mix(#B8442A 8%, white)`.

### Cards / Containers
- **Figure block** (projects): Paper White, 1px sage frame; head = label eyebrow
  (terracotta) + hairline-light rule, 16px/20px; body 24px/20px; foot
  hairline-light + mono uppercase links.
- **Panel:** 1px sage frame, Paper White — error/empty states, generic containers.
- **Ledger row:** bottom hairline; hover → `surface-green` fill + `translateY(-2px)`
  + arrow shifts 5px and turns terracotta.
- **Metric ladder:** label/value rows, 18px block padding, hairline-light
  dividers, mono values with terracotta `em` suffix.

### Inputs / Fields
daisyUI `.input`, 2.75rem tall, Paper White fill, 1px sage border, sharp;
focus → `border-primary/50` (plus the global 2px `burnt-terracotta` outline,
3px offset, on `:focus-visible`). Search: leading icon at 12px, clear button
`ink-3` → hover ink. Errors: `error` semantic text; submit buttons disable while
loading.

### Navigation
- **Masthead:** sticky, hairline bottom, name in label style (uppercase sans
  0.6875rem); links sans 0.8125rem `ink-4` → hover terracotta → active `ink`
  with a 3×14 voltage marker at −12px.
- **Spine / numbered strip:** as documented in Layout; active state is always
  terracotta + marker, never a pill or background.
- **Mobile menu:** numbered rows (`row-place` number + label), min-h-11, hover
  `surface-green`, ArrowUpRight affordance; utility row = language + theme +
  Resume button.
- **Footer colophon:** `bg-neutral` (Green-Black), Archive Cream content,
  columns divided by `border-neutral-content/15`, closing rule row.

### Section header (signature)
`marker-sm (3×14 terracotta)` + `NN / KICKER` label + flex hairline rule →
`display-2` title → optional `lead`. Left-aligned by default; `align="center"`
only for hero-adjacent moments. Pages pass `level="h1"`, in-page sections stay `h2`.

### Action link (signature)
Sans 0.8125rem/500 terracotta text with transparent bottom border → hover draws
the underline while the `→` arrow slides +6px.

### Quote card (signature)
Sticky-note motif: ±3° rotation from id hash, quote-card shadow (see Elevation),
italic serif quote, mono tag chips; only elevated content card in the system.

### Feedback
Toast: daisyUI bottom-end stack, `alert` semantic fills + overlay shadow.
Spinner: `text-primary`. Empty states: large `ink-4` icon + `display-2` line +
primary CTA. Modal: daisyUI `.modal-box` with ghost close (btn-sm btn-circle),
serif/sans headings, stacked inputs, full-width primary submit.

## Do's and Don'ts

### Do:
- **Do** divide content with 1px hairlines (sage for structure,
  `hairline-light` for internals) and `clamp(3.5rem, 6vw, 5rem)` section rhythm.
- **Do** number every page/section head `NN / KICKER` + marker + rule via
  `SectionHeader`; keep one `h1` per page.
- **Do** assign type by role: serif prose (≤54–68ch), mono for all data/dates/
  counts, uppercase tracked sans for labels/nav/buttons, Newsreader for
  hero-scale statements.
- **Do** use Burnt Terracotta #B8442A for text/interactive and #D65A3A only for
  marks; switch text accent to #E27A5F in dark.
- **Do** build depth tonally: Paper White on Archive Cream inside a 1px frame;
  reserve `shadow-lg` for overlays.
- **Do** keep targets ≥44px (buttons `min-h-11`/2.75rem) and honor
  `prefers-reduced-motion` (reveal/rise/lift already neutralized globally).

### Don't:
- **Don't** round anything — no radius on buttons, cards, inputs, images,
  avatars or badges (`rounded-full`, `rounded-lg` are banned).
- **Don't** use gradients, glassmorphism, blur or decorative gloss.
- **Don't** add a second accent color; terracotta is the only signal (info/
  success/error appear strictly as semantic states).
- **Don't** put #D65A3A voltage on cream as text, or any accent text below AA
  contrast.
- **Don't** shadow content cards at rest, or lift them more than −2px on hover.
- **Don't** set prose in sans/mono, labels in serif, or uppercase the serif.
- **Don't** leave uncapped measures — leads 54ch, blog prose 68ch, pull quotes 36ch.
