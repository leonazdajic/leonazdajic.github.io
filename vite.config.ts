import { defineConfig } from "vite";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'none'",
  "frame-src 'none'",
  "media-src 'none'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Deployment-agnostic build: outputs a fully static `dist/` folder that runs
// on any static host (Netlify, Vercel, GitHub Pages, S3, nginx, ...).
//
// NOTE on `base`: for GitHub Pages project sites served from a sub-path
// (e.g. https://user.github.io/repo/), set the env var when building:
//   BASE_PATH=/repo/ npm run build
// For Netlify / Vercel / custom domains the default "/" is correct.
export default defineConfig({
  plugins: [
    {
      name: "production-security-meta",
      apply: "build",
      transformIndexHtml: {
        order: "pre",
        handler: () => [
          {
            tag: "meta",
            attrs: {
              "http-equiv": "Content-Security-Policy",
              content: contentSecurityPolicy,
            },
            injectTo: "head-prepend",
          },
        ],
      },
    },
  ],
  base: process.env.BASE_PATH ?? "/",
  css: {
    preprocessorOptions: {
      scss: { api: "modern-compiler" },
    },
  },
  build: {
    target: "es2020",
    cssMinify: true,
    sourcemap: false,
  },
});
