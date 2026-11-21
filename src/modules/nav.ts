/**
 * Navigation behaviour:
 *  - adds `.is-scrolled` to the header once the page is scrolled
 *  - scroll-spy: highlights the nav link of the section in view
 *  - mobile hamburger menu toggle (with a11y attributes)
 */
export function initNav(): void {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector<HTMLButtonElement>(".nav__toggle");
  const links = document.querySelector<HTMLElement>(".nav__links");
  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".nav__link"),
  );
  if (!nav) return;

  // --- Scrolled state ---
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Mobile menu toggle ---
  if (toggle && links) {
    const isOpen = () => links.classList.contains("is-open");
    const closeMenu = () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close after navigating on mobile (section links and the CV download)
    links.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    // Esc closes and hands focus back to the toggle
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !isOpen()) return;
      closeMenu();
      toggle.focus();
    });
    // A click outside the bar closes the menu
    document.addEventListener("click", (e) => {
      if (isOpen() && !nav.contains(e.target as Node)) closeMenu();
    });
  }

  // --- Scroll-spy ---
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href")?.replace("#", "");
      return id ? document.getElementById(id) : null;
    })
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length === 0 || !("IntersectionObserver" in window)) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) =>
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${id}`,
          ),
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );

  sections.forEach((section) => spy.observe(section));
}
