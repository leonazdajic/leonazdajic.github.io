import { defineConfig } from "vite";

// Deployment-agnostic build: outputs a fully static `dist/` folder that runs
// on any static host (Netlify, Vercel, GitHub Pages, S3, nginx, ...).
//
// NOTE on `base`: for GitHub Pages project sites served from a sub-path
// (e.g. https://user.github.io/repo/), set the env var when building:
//   BASE_PATH=/repo/ npm run build
// For Netlify / Vercel / custom domains the default "/" is correct.
export default defineConfig({
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
