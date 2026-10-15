const DURATION_MS = 700;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  if (prefersReducedMotion() || Math.abs(top - window.scrollY) < 2) {
    window.scrollTo(0, top);
    return true;
  }

  const start = window.scrollY;
  const distance = top - start;
  const started = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - started) / DURATION_MS);
    const eased = 1 - (1 - progress) ** 3;
    window.scrollTo(0, start + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
  return true;
}
