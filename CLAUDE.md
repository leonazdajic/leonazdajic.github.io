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

For GitHub Pages project sites served from a sub-path, build with the base path:
`BASE_PATH=/<repo>/ npm run build` (wired through `vite.config.ts`).

## Architecture

- **Content lives in `index.html`**, not in JS. All CV copy is hand-authored
  semantic HTML (one `<section>` per area: hero, profile, experience, education,
  project, skills, awards, beyond, contact). There is no CMS, data file or
  templating —
  to change CV content, edit the markup directly. The canonical source content
  is the user's `Leon_Azdajic_CV.md`; keep the rendered text faithful to it.

- **`src/main.ts`** is the only entry. It imports `styles/main.scss` (so CSS is
  bundled through Vite) and boots three behaviour modules on DOM ready.

- **Behaviour modules (`src/modules/`)** are tiny, framework-free, and each owns
  one concern:
  - `nav.ts` — sticky-header scrolled state, IntersectionObserver scroll-spy
    that toggles `.is-active` on nav links, and the mobile hamburger menu.
  - `animations.ts` — reveal-on-scroll; adds `.is-visible` to every `.reveal`
    element as it enters the viewport.
  - `background.ts` — the animated canvas grid (`#bg-canvas`); pointer-parallax
    glow, capped DPR, pauses on tab-hidden.
  - `modals.ts` — legal modals (Impressum / Datenschutz). Uses native `<dialog>`
    elements (`dialog.modal`) for free focus-trapping/Esc/inert. Open triggers
    are `[data-modal-open="<dialog id>"]`, close via `[data-modal-close]` or a
    backdrop click; it also scroll-locks the body and restores focus on close.
  - `slider.ts` — screenshot slider in the featured-project section
    (`#project-slider`). The track scrolls natively with CSS scroll-snap; JS
    adds arrows, dots, keyboard navigation and mouse dragging. Slide positions
    are measured relative to the first slide (offsetLeft is relative to the
    positioned `.project` card). Screenshot assets live in `public/apicon/`
    (WebP, sensitive details pixelated at export time).
  All modules **no-op or render a static fallback under
  `prefers-reduced-motion`** (the slider scrolls instantly instead of
  smoothly); preserve that behaviour when editing.

- **Styles (`src/styles/`)** use modern Dart Sass `@use`. Every partial that
  references tokens/mixins must start with `@use "variables" as *;` — they do
  NOT inherit it from `main.scss`. Design tokens (colors, fonts, breakpoints,
  the `mobile`/`tablet` mixins) live in `_variables.scss`. One partial per
  section, mirroring the HTML structure. Class naming is BEM-ish
  (`.block__element--modifier`).

## Design system (don't drift from this)

Mercedes-inspired: deep anthracite background (`#0a0a0f`), a single neon
petrol-cyan accent (`#00D7D2`) used sparingly for lines/highlights/glow, thin
geometric lines, generous negative space. Fonts: Space Grotesk (display) +
Inter (body), **self-hosted via Fontsource** (imported in `src/main.ts`) — no
external Google Fonts request, for GDPR reasons; do not reintroduce a CDN font
link. Keep the accent restrained — it is an accent, not a fill.

## Accessibility invariants

Semantic landmarks, a skip link, visible `:focus-visible` outlines, alt/aria on
non-text elements, and full `prefers-reduced-motion` support are intentional.
Maintain them when adding sections.
