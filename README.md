# Leon Azdajic — Online CV

A high-end, single-page online CV. Static, fast-loading and deployment-agnostic
— it builds to a plain `dist/` folder that runs on any static host.

**Design:** "Engineered" — a light reading surface framed by dark ink bands
(hero, contact), Inter for text and JetBrains Mono for metadata (both
self-hosted), window-framed project visuals, a journey timeline, collapsible
experience stations and an interactive ApiCon demo with sample data. A print
stylesheet makes the page print as a CV. Fully responsive, with accessibility
in mind (semantic HTML, skip link, keyboard focus, reduced-motion support).

## Tech stack

- **Vite** — build tool & dev server (fast, zero-config static output)
- **TypeScript** — small, typed behaviour modules (nav, progress, stations, demo, slider, modals)
- **SCSS** — component-scoped styles with shared design tokens
- No UI framework and no runtime dependencies → tiny payload (~3.6 kB CSS +
  1.6 kB JS gzipped).

## Getting started

Requires **Node.js 18+**.

```bash
npm install      # install dependencies
npm run dev      # start dev server with hot reload → http://localhost:5173
```

## Build

```bash
npm run build    # type-checks, then outputs a static site to dist/
npm run preview  # serve the production build locally → http://localhost:4173
```

The entire site is the contents of `dist/`. Nothing server-side is required.

## Deployment

Deploy the `dist/` folder to any static host:

- **Netlify** — build command `npm run build`, publish directory `dist`.
- **Vercel** — framework preset “Vite”; output directory `dist`.
- **GitHub Pages** — for a project page served from a sub-path, build with the
  base path set:
  ```bash
  BASE_PATH=/<repo-name>/ npm run build
  ```
  then publish `dist/` (e.g. via the `gh-pages` branch or an Actions workflow).
  For a user/organization page or a custom domain at the root, the default
  `npm run build` is correct.
- **Any web server / S3 / Cloudflare Pages** — upload the contents of `dist/`.

## Editing content

All CV content lives directly in `index.html` as semantic markup (sections for
Selected work, Profile, Experience, Projects, Education, Skills, Awards &
Activities, Contact). Update the
text there; styling and behaviour adjust automatically.

## Project structure

```
leon-cv/
├── index.html              # All content + page markup (semantic)
├── public/favicon.svg      # "LA" monogram favicon
├── src/
│   ├── main.ts             # Entry: imports styles, boots modules
│   ├── modules/
│   │   ├── nav.ts          # Sticky nav, scroll-spy, mobile menu
│   │   ├── progress.ts     # Reading-progress hairline
│   │   ├── stations.ts     # Collapsible experience stations
│   │   ├── demo.ts         # Interactive ApiCon demo (sample data)
│   │   ├── slider.ts       # Screenshot slider (rental case study)
│   │   └── modals.ts       # Impressum / Datenschutz dialogs
│   └── styles/
│       ├── main.scss       # Imports all partials
│       ├── _variables.scss # Design tokens (colors, fonts, breakpoints)
│       └── _*.scss         # Partials per area (+ _print.scss)
├── vite.config.ts
├── tsconfig.json
└── package.json
```
