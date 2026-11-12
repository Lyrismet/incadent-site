// types the sample note letter by letter, the finished note stays in the markup for no-JS and reduced motion
export function initDemo(root: HTMLElement): void {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-part]"));
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
  const caret = root.querySelector<HTMLElement>("[data-caret]");
  const status = root.querySelector<HTMLElement>("[data-status]");
  const added = root.dataset.added ?? "";
  const full = parts.map((p) => p.textContent ?? "");
  const lengths = parts.map((p, i) => full[i].length + (p.dataset.chip ? 1 : 0));
  const total = lengths.reduce((a, b) => a + b, 0);
  const HOLD = 70;
  root.dataset.live = "";
  let step = 0;

  function render(p: number): void {
    let offset = 0;
    let last = "";
    const done = new Set<number>();
    parts.forEach((el, i) => {
      const len = lengths[i];
      const k = Math.max(0, Math.min(len, p - offset));
      offset += len;
      if (!el.dataset.chip) {
        el.textContent = full[i].slice(0, k);
        return;
      }
      const finished = k >= len;
      el.classList.toggle("chip", finished);
      el.classList.toggle("chip-" + el.dataset.chip, finished);
      el.classList.toggle("raw", !finished);
      el.textContent = finished ? full[i] : ("@" + full[i]).slice(0, k);
      el.hidden = k === 0;
      if (finished) {
        done.add(Number(el.dataset.part));
        last = full[i];
      }
    });
    cards.forEach((c) => c.classList.toggle("on", done.has(Number(c.dataset.card))));
    if (status) {
      status.textContent = last ? `${added}: ${last}` : "";
      status.classList.toggle("on", Boolean(last));
    }
    if (caret) caret.style.opacity = p < total || Math.floor(step / 12) % 2 ? "1" : "0";
  }

  render(0);
  setInterval(() => {
    step += 1;
    render(Math.min(step % (total + HOLD), total));
  }, 42);
}
