/**
 * Entry point — wires up styles and behaviour modules.
 */

// Self-hosted fonts (Fontsource) — no external Google Fonts request, GDPR-friendly.
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";

import "./styles/main.scss";

import { initNav } from "./modules/nav";
import { initProgress } from "./modules/progress";
import { initStations } from "./modules/stations";
import { initDemo } from "./modules/demo";
import { initModals } from "./modules/modals";
import { initSlider } from "./modules/slider";

const start = () => {
  initNav();
  initProgress();
  initStations();
  initDemo();
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
