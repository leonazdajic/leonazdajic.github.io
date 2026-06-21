/**
 * Reveal-on-scroll using IntersectionObserver.
 * Adds `.is-visible` to every `.reveal` element once it enters the viewport.
 * Falls back to showing everything if IO or reduced-motion applies.
 */
export function initReveal(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
  if (items.length === 0) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  items.forEach((el) => observer.observe(el));
}
