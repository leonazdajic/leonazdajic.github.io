/**
 * Legal modals (Impressum / Datenschutz).
 *
 * Uses the native <dialog> element so we get focus-trapping, Esc-to-close,
 * background `inert` and an accessible role for free. We add:
 *  - open triggers ([data-modal-open="<dialog id>"])
 *  - close buttons ([data-modal-close])
 *  - backdrop click to dismiss
 *  - body scroll-lock while a dialog is open
 *  - focus restoration to the trigger that opened the dialog
 */

export const initModals = (): void => {
  const dialogs = Array.from(
    document.querySelectorAll<HTMLDialogElement>("dialog.modal"),
  );
  if (dialogs.length === 0) return;

  let lastTrigger: HTMLElement | null = null;

  const lockScroll = (): void => {
    document.body.style.overflow = "hidden";
  };
  const unlockScroll = (): void => {
    // Only release once every dialog is closed.
    if (!dialogs.some((d) => d.open)) document.body.style.overflow = "";
  };

  const open = (dialog: HTMLDialogElement, trigger: HTMLElement): void => {
    lastTrigger = trigger;
    dialog.showModal();
    lockScroll();
  };

  // Open triggers
  document
    .querySelectorAll<HTMLElement>("[data-modal-open]")
    .forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const id = trigger.dataset.modalOpen;
        if (!id) return;
        const dialog = document.getElementById(id);
        if (dialog instanceof HTMLDialogElement) open(dialog, trigger);
      });
    });

  dialogs.forEach((dialog) => {
    // Close buttons inside the dialog
    dialog
      .querySelectorAll<HTMLElement>("[data-modal-close]")
      .forEach((btn) => btn.addEventListener("click", () => dialog.close()));

    // Click on the backdrop area (the dialog itself, outside the panel)
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    // Restore scroll + focus whenever it closes (button, Esc or backdrop)
    dialog.addEventListener("close", () => {
      unlockScroll();
      lastTrigger?.focus();
      lastTrigger = null;
    });
  });
};
