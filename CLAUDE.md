# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, single-page online CV for Leon Azdajic. Built with Vite + TypeScript +
SCSS, no UI framework. It compiles to a plain static `dist/` folder that can be
deployed to any static host (Netlify, Vercel, GitHub Pages, S3, …).

## Commands

```bash
npm run dev      # dev server with HMR (http://localhost:5173)
npm run build    # tsc --noEmit type-check, then vite build → dist/
npm run preview  # serve the built dist/ (http://localhost:4173)
```

There is no test suite and no linter configured. `npm run build` is the gate:
it runs a strict TypeScript type-check (`tsconfig.json` has `strict`,
`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`) before bundling.

**Deployment:** `.github/workflows/deploy.yml` builds and publishes `dist/` to
GitHub Pages on every push to `main`. It is a user page
(`leonazdajic.github.io`) served from the root, so no `BASE_PATH` is needed.
For a project site on a sub-path, build with
`BASE_PATH=/<repo>/ npm run build` (wired through `vite.config.ts`).

The CSP `<meta>` is injected by a Vite plugin **only at build time**, so the dev
server does not enforce it. Use `npm run preview` to catch CSP violations.

## Architecture

- **Content lives in `index.html`**, not in JS. All CV copy is hand-authored
  semantic HTML (one `<section>` per area: hero, profile, experience,
  projects, education, skills, other, contact). The profile section holds the
  "What I do" capability tiles (each links to the result that proves it) and
  the selected-work cards that lead into the case studies. There is no CMS, data file or
  templating —
  to change CV content, edit the markup directly. The canonical source content
  is `leon_cv_data.md` (CV master file: Part A = CV-ready copy, with style
  rules at the top; Part B/C = private background and decision log). Keep the
  rendered text faithful to Part A.

- **Private files stay local.** `leon_cv_data.md`, `Leon_Azdajic_CV*.docx/pdf`
  and project theses (`PA_*.pdf`) are gitignored and contain personal or
  confidential notes. Never commit them, and never copy Part B/C or thesis
  details into the site.

- **`src/main.ts`** is the only entry. It imports `styles/main.scss` (so CSS is
  bundled through Vite) and boots the behaviour modules on DOM ready.

- **Behaviour modules (`src/modules/`)** are tiny, framework-free, and each owns
  one concern:
  - `nav.ts` — sticky-header scrolled state, IntersectionObserver scroll-spy
    that toggles `.is-active` on nav links, and the mobile hamburger menu
    (closes on link click, Esc — focus returns to the toggle — and outside click).
  - `progress.ts` — reading-progress hairline under the nav (`[data-progress]`).
  - `stations.ts` — each experience station (`article.station`) shows two key
    results; further ones sit in `<details class="station__more">` ("+ 2 more").
    It opens a station's extras when the station is the target of an in-page
    link (journey legend) and opens all of them before printing.
  - `demo.ts` — the interactive ApiCon demo (`[data-demo]`): a simulated
    validation run over **illustrative sample data only** ("Market A–F",
    "Service 07"). Never put real market codes, product names, prices or
    deviation counts in it. The demo is a collapsed `<details>`; opening it
    starts the first run. Completes instantly under reduced motion.
  - `modals.ts` — legal modals (Impressum / Datenschutz). Uses native `<dialog>`
    elements (`dialog.modal`) for free focus-trapping/Esc/inert. Open triggers
    are `[data-modal-open="<dialog id>"]`, close via `[data-modal-close]` or a
    backdrop click; it also scroll-locks the body and restores focus on close.
  - `slider.ts` — generic screenshot slider, set up for every `.slider`
    (currently `#apicon-slider` and `#rental-slider`). The track scrolls
    natively with CSS scroll-snap; JS adds arrows (`[data-slider-prev/next]`),
    dots (`[data-slider-dots]`), keyboard navigation and mouse dragging. Slide
    positions are measured relative to the first slide. Assets live in
    `public/apicon/` and `public/rental/`.
  Programmatic scrolling is instant under `prefers-reduced-motion`, and all
  CSS transitions are disabled there; preserve that behaviour when editing.

- **ApiCon screenshots are sanitized** (`public/apicon/apicon-0N-*.webp`):
  market codes, deviation counts, run dates and the reference filename are
  blurred (pixelated first, then softened — not recoverable). They were
  produced with `design/sanitize-apicon-screenshots.py` from the unredacted
  originals, which are NOT in the repo. Never publish an unredacted version;
  if a screenshot is regenerated, re-run the script and check every region.
  The schematic `public/apicon/validation-flow.svg` is slide 00 of the
  `#apicon-slider`.

- **Styles (`src/styles/`)** use modern Dart Sass `@use`. Every partial that
  references tokens/mixins must start with `@use "variables" as *;` — they do
  NOT inherit it from `main.scss`. Design tokens (colors, fonts, breakpoints,
  the `mobile`/`tablet` mixins) live in `_variables.scss`. Partials:
  `_base` (reset, links, layout primitives: `.container` 1200px, `.section`
  with hairline dividers, `.section__head--row` title-left/intro-right,
  `.card`; plus `.btn`,
  `.mono`, `.frame` window mock, `.tags`), `_nav`, `_hero` (ink hero, `.spec`
  sheet, "Selected work" cards), `_profile` (`.skillset` capability tiles, `.subhead`), `_resume` (journey timeline,
  experience stations, `.edu` degree cards, `.matrix` rows for skills and awards), `_project`
  (two-column case studies with sticky visual, demo, slider), `_contact` (ink
  contact band + footer), `_modal`, `_print`. Class naming is BEM-ish
  (`.block__element--modifier`). Spacing tokens (`$section-space`, `$gutter`,
  `$sticky-top`) live in `_variables.scss`; single-column grid fallbacks use
  `minmax(0, 1fr)` (plain `1fr` lets the image sliders overflow).

- **CV download:** every link to the public CV carries `data-cv` and points
  to `public/cv/leon-azdajic-cv.pdf`. A plugin in `vite.config.ts` strips
  those links (dev and build) while that file is missing, so the page never
  offers a broken download. Don't name it `Leon_Azdajic_CV*.pdf`, because that
  pattern is gitignored.

- **Portrait:** `public/photo/leon-azdajic-{192,384}.webp` (square crop,
  re-encoded without EXIF/GPS metadata) sits left of the name in the hero.
  The name's font size is tuned so photo + name stay on one line from 320px
  up; re-check that if either changes. The original photo is not in the repo.

- **Social preview:** `design/portfolio-preview.html` is the source for the
  checked-in `public/social/portfolio-preview-v4.png`. Render it at a
  1200×630 viewport with DPR 1 (see `design/README.md`). If you replace the
  image, give it a new filename and update both image meta tags in
  `index.html` so LinkedIn doesn't keep serving the old cached image.

- **Skills are a matrix, not a tag cloud:** each row is area · core skills ·
  links to where the skill is shown on the page. Only add a skill if it has
  such proof; `leon_cv_data.md` lists what was deliberately dropped (MS Office,
  Java, Git).

- **Anchor offsets:** `html { scroll-padding-top }` in `_base` is the only
  offset for in-page jumps. Don't add `scroll-margin-top` to targets, because
  the two add up.

- **Auto-translation:** names, figures, tool names, mono labels and tags carry
  `translate="no"` so browser translation can't distort them. Running text
  stays translatable.

- **CSP note:** the production build sets `style-src 'self'`, so inline
  `style="…"` attributes in the HTML are blocked. Position things with classes
  (e.g. the journey segments use `.journey__seg--<name>` grid-column rules);
  setting `element.style` from JS is fine.

## Design system (don't drift from this)

"Engineered": precise and technical, but never decorative. A light reading
surface (`#fafaf7`, near-black text `#14171c`, muted `#5d6672`, hairlines
`#e3e3dd`) framed by dark ink bands (`#0d1321`) for the hero and the contact
section. One dark-petrol accent (`#0f5c6b`; lifted to `#7cc6d2` on ink) for
links, focus, labels and highlights. Two typefaces, both **self-hosted via
Fontsource** (imported in `src/main.ts`) — no external Google Fonts request,
for GDPR reasons; do not reintroduce a CDN font link: Inter for text,
JetBrains Mono for metadata (dates, labels, figures, tags, eyebrows like
`03 / experience`). Signature elements: the static, edge-faded grid in the
hero, `.spec` sheets, window-framed visuals (`.frame`), the journey timeline
and the interactive demo. Do not bring back neon glow, animated canvas
backgrounds, pulsing dots or scroll-reveal on every element. Motion is limited
to short hover/focus transitions and the demo run. The page has a print
stylesheet so it prints as a text CV (~7 A4 pages: no screenshots, demo,
hero spec card or capability tiles); check it with Chrome's print-to-PDF.

## Mobile (≤600px)

Phones get a lighter page, not just a narrower one: the hero spec card hides
its detail rows (`.spec__row--extra`), selected-work cards drop their
screenshots, the journey legend becomes two compact columns, and case figures
become one row each. Figures like `~1–1.5 h` use word joiners / no-break spaces
so they never wrap mid-value. Check 320, 390 and 414 px after layout changes;
real Chrome windows can't go below ~600px, so use headless Chrome with an
iframe of the target width.

## Accessibility invariants

Semantic landmarks, a skip link, visible `:focus-visible` outlines, alt/aria on
non-text elements, and full `prefers-reduced-motion` support are intentional.
Maintain them when adding sections.
