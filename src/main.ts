/**
 * Entry point — wires up styles and behaviour modules.
 */

// Self-hosted fonts (Fontsource) — no external Google Fonts request, GDPR-friendly.
// Variable fonts: one file per family covering all weights we use.
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";

import "./styles/main.scss";

import { initNav } from "./modules/nav";
import { initReveal } from "./modules/animations";
import { initBackground } from "./modules/background";
import { initModals } from "./modules/modals";
import { initSlider } from "./modules/slider";

const start = () => {
  initNav();
  initReveal();
  initBackground();
  initModals();
  initSlider();

  // Current year in the footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
