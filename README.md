# Leon Azdajic — Online CV

A high-end, single-page online CV. Static, fast-loading and deployment-agnostic
— it builds to a plain `dist/` folder that runs on any static host.

**Design:** dark anthracite theme with a Mercedes-inspired neon petrol-cyan
accent (`#00D7D2`), thin geometric lines, a subtle animated grid background,
quiet reveal-on-scroll motion, and a strong typographic hierarchy
(Space Grotesk + Inter). Fully responsive and mobile-first, with accessibility
in mind (semantic HTML, skip link, keyboard focus, reduced-motion support).

## Tech stack

- **Vite** — build tool & dev server (fast, zero-config static output)
- **TypeScript** — small, typed behaviour modules (nav, scroll reveal, background)
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
Profile, Experience, Education, Skills, Awards, Beyond Work, Contact). Update the
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
│   │   ├── animations.ts   # Reveal-on-scroll (IntersectionObserver)
│   │   └── background.ts   # Subtle animated grid background (canvas)
│   └── styles/
│       ├── main.scss       # Imports all partials
│       ├── _variables.scss # Design tokens (colors, fonts, breakpoints)
│       └── _*.scss         # One partial per section/component
├── vite.config.ts
├── tsconfig.json
└── package.json
```
