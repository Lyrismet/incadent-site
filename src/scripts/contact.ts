// builds a mail draft from the form, so no server is needed
export function initContact(form: HTMLFormElement): void {
  const to = form.dataset.to ?? "";
  const topics = JSON.parse(form.dataset.topics ?? "{}") as Record<string, string>;
  const placeholders = JSON.parse(form.dataset.ph ?? "{}") as Record<string, string>;
  const text = JSON.parse(form.dataset.text ?? "{}") as Record<string, string>;
  const msg = form.querySelector<HTMLTextAreaElement>("textarea");
  const name = form.querySelector<HTMLInputElement>("input[name=name]");
  const send = form.querySelector<HTMLAnchorElement>("[data-send]");
  const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>("[data-topic]"));
  if (!msg || !name || !send) return;
  let topic = "idea";

  function refresh(): void {
    const ready = Boolean(msg?.value.trim());
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.topic === topic)));
    if (msg) msg.placeholder = placeholders[topic] ?? "";
    if (!send || !msg || !name) return;
    send.setAttribute("aria-disabled", String(!ready));
    send.textContent = ready ? text.send : text.sendEmpty;
    if (!ready) {
      send.removeAttribute("href");
      return;
    }
    const first = msg.value.trim().split("\n")[0].slice(0, 48);
    const subject = `Incadent · ${topics[topic]}${first ? `: ${first}` : ""}`;
    const sign = name.value.trim() ? `\n\n— ${name.value.trim()}` : "";
    send.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg.value.trim() + sign)}`;
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      topic = b.dataset.topic ?? "idea";
      refresh();
    }),
  );
  msg.addEventListener("input", refresh);
  name.addEventListener("input", refresh);
  send.addEventListener("click", () => {
    if (send.getAttribute("aria-disabled") === "true") return;
    send.textContent = text.sent;
  });
  refresh();
}
