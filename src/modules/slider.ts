/**
 * Screenshot slider for the featured project:
 *  - the track scrolls natively with CSS scroll-snap (smooth on touch/trackpad)
 *  - JS adds arrows, dots, keyboard navigation and mouse dragging
 *  - under `prefers-reduced-motion` all programmatic scrolling is instant
 */
export function initSlider(): void {
  const root = document.getElementById("project-slider");
  if (!root) return;

  const viewport = root.querySelector<HTMLElement>(".slider__viewport");
  const slides = Array.from(root.querySelectorAll<HTMLElement>(".slider__slide"));
  const prev = root.querySelector<HTMLButtonElement>("[data-slider-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-slider-next]");
  const dotsWrap = root.querySelector<HTMLElement>("[data-slider-dots]");
  if (!viewport || slides.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(slides.length - 1, i));
    // offsetLeft is relative to the positioned ancestor (the project card),
    // so measure against the first slide to get the track-local position
    viewport.scrollTo({
      left: slides[target].offsetLeft - slides[0].offsetLeft,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  };

  // --- Dots (one per slide) ---
  const dots: HTMLButtonElement[] = [];
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider__dot";
      dot.setAttribute("aria-label", `Go to screenshot ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  const setActive = (i: number) => {
    index = i;
    dots.forEach((dot, d) => dot.classList.toggle("is-active", d === i));
    slides.forEach((slide, d) => slide.classList.toggle("is-active", d === i));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
  };
  setActive(0);

  prev?.addEventListener("click", () => goTo(index - 1));
  next?.addEventListener("click", () => goTo(index + 1));

  // --- Track the slide closest to the viewport center while scrolling ---
  const onScroll = () => {
    const mid = viewport.scrollLeft + viewport.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== index) setActive(best);
  };
  viewport.addEventListener("scroll", onScroll, { passive: true });

  // --- Keyboard navigation on the focusable viewport ---
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  });

  // --- Mouse dragging (touch already scrolls natively) ---
  // Snap is disabled via `.is-dragging` while the pointer is down, then the
  // track glides to the nearest slide on release.
  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") return;
    dragging = true;
    dragStartX = event.clientX;
    dragStartScroll = viewport.scrollLeft;
    viewport.classList.add("is-dragging");
  });

  window.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    viewport.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    goTo(index); // settle on the nearest slide
  };
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
}
