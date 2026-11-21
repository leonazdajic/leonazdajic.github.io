/**
 * Experience stations: each shows two key results; further results sit in a
 * <details class="station__more"> ("+ 2 more").
 *  - links to a station (e.g. from the journey legend) also reveal its extras
 *  - all extras open before printing so the CV prints complete,
 *    and return to their previous state afterwards
 */
export function initStations(): void {
  const extras = Array.from(document.querySelectorAll<HTMLDetailsElement>("details.station__more"));
  if (extras.length === 0) return;

  // Reveal a station's extras when it is the target of an in-page link
  const openFromHash = () => {
    const id = window.location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    const more = target?.classList.contains("station") ? target.querySelector("details.station__more") : null;
    if (more instanceof HTMLDetailsElement) more.open = true;
  };
  window.addEventListener("hashchange", openFromHash);
  openFromHash();

  // Print the full CV
  let previous: boolean[] = [];
  window.addEventListener("beforeprint", () => {
    previous = extras.map((d) => d.open);
    extras.forEach((d) => (d.open = true));
  });
  window.addEventListener("afterprint", () => {
    extras.forEach((d, i) => (d.open = previous[i] ?? false));
  });
}
