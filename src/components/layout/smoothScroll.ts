const DURATION_MS = 700;

export const SECTION_TARGET_EVENT = "inv:section-target";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function notifySectionTarget() {
  window.dispatchEvent(new Event(SECTION_TARGET_EVENT));
}

export function smoothScrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return false;

  const padding = Number.parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop || "0",
  );
  const top =
    target.getBoundingClientRect().top + window.scrollY - (Number.isNaN(padding) ? 0 : padding);

  const nextHash = `#${id}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, "", nextHash);
  }
  notifySectionTarget();

  if (prefersReducedMotion() || Math.abs(top - window.scrollY) < 2) {
    window.scrollTo({ top, behavior: "auto" });
    return true;
  }

  const start = window.scrollY;
  const distance = top - start;
  const started = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - started) / DURATION_MS);
    const eased = 1 - (1 - progress) ** 3;
    window.scrollTo({ top: start + distance * eased, behavior: "auto" });
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
  return true;
}
