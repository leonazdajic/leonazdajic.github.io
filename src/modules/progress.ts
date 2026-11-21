/**
 * Reading-progress hairline under the nav bar ([data-progress]).
 * Purely informational; scales with scroll position, no animation of its own.
 */
export function initProgress(): void {
  const bar = document.querySelector<HTMLElement>("[data-progress]");
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
