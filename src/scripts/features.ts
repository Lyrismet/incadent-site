// the chapter closest to the middle of the screen becomes the active one, the phone and the numbers follow it
export function initFeatures(root: HTMLElement): void {
  const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-ch]"));
  const set = (i: number): void => {
    root.dataset.active = String(i);
  };
  set(0);
  function update(): void {
    const mid = innerHeight * 0.5;
    let best = 0;
    let bestDist = Infinity;
    chapters.forEach((el, i) => {
      const b = el.getBoundingClientRect();
      const d = Math.abs(b.top + b.height / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    set(best);
  }
  let queued = false;
  addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    },
    { passive: true },
  );
  addEventListener("resize", update);
  update();
}
