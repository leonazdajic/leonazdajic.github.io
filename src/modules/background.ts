/**
 * Subtle futuristic tech background drawn on a <canvas>.
 *
 * A faint perspective grid of dots with a soft petrol glow that drifts
 * gently with the pointer (parallax). Intentionally low-contrast and quiet
 * so it reads as "tech texture", not decoration.
 *
 * Performance / a11y:
 *  - capped device-pixel-ratio, throttled to animation frames
 *  - pauses when the tab is hidden
 *  - disabled entirely under prefers-reduced-motion (static grid is drawn once)
 */
export function initBackground(): void {
  const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const ACCENT = "0, 215, 210";
  const GAP = 38; // px between grid dots
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  const pointer = { x: 0.5, y: 0.4 }; // normalized, eased target
  const eased = { x: 0.5, y: 0.4 };
  let rafId = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = () => {
    // ease pointer toward target for smooth parallax
    eased.x += (pointer.x - eased.x) * 0.05;
    eased.y += (pointer.y - eased.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    const offX = (eased.x - 0.5) * 26;
    const offY = (eased.y - 0.5) * 26;

    // glow centre follows the pointer subtly
    const gx = eased.x * width;
    const gy = eased.y * height * 0.9;
    const glowRadius = Math.max(width, height) * 0.55;

    for (let y = -GAP; y < height + GAP; y += GAP) {
      for (let x = -GAP; x < width + GAP; x += GAP) {
        const px = x + offX;
        const py = y + offY;
        const dist = Math.hypot(px - gx, py - gy);
        const t = Math.max(0, 1 - dist / glowRadius);
        // base faint dots + brighter near the glow centre
        const alpha = 0.03 + t * t * 0.32;
        const size = 0.7 + t * 1.1;
        ctx.fillStyle = `rgba(${ACCENT}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const loop = () => {
    draw();
    rafId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (!rafId) rafId = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  if (prefersReduced) {
    draw(); // single static render
    return;
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX / width;
      pointer.y = e.clientY / height;
    },
    { passive: true },
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  start();
}
