// sends the form to the Apps Script endpoint, without an endpoint it falls back to a mail draft
export function initContact(form: HTMLFormElement): void {
  const endpoint = form.dataset.endpoint ?? "";
  const to = form.dataset.to ?? "";
  const lang = document.documentElement.lang;
  const topics = JSON.parse(form.dataset.topics ?? "{}") as Record<string, string>;
  const placeholders = JSON.parse(form.dataset.ph ?? "{}") as Record<string, string>;
  const text = JSON.parse(form.dataset.text ?? "{}") as Record<string, string>;
  const msg = form.querySelector<HTMLTextAreaElement>("textarea[name=message]");
  const name = form.querySelector<HTMLInputElement>("input[name=name]");
  const email = form.querySelector<HTMLInputElement>("input[name=email]");
  const trap = form.querySelector<HTMLInputElement>("input[name=website]");
  const send = form.querySelector<HTMLButtonElement>("[data-send]");
  const status = form.querySelector<HTMLElement>("[data-status]");
  const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>("[data-topic]"));
  if (!msg || !name || !email || !trap || !send || !status) return;
  let topic = "idea";
  let sending = false;

  function refresh(): void {
    const ready = Boolean(msg?.value.trim());
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.topic === topic)));
    if (msg) msg.placeholder = placeholders[topic] ?? "";
    if (!send) return;
    send.disabled = !ready || sending;
    send.textContent = sending ? text.sending : ready ? text.send : text.sendEmpty;
  }

  function showStatus(kind: "sent" | "error"): void {
    if (!status) return;
    status.textContent = text[kind] ?? "";
    status.dataset.kind = kind;
  }

  function openDraft(message: string, author: string): void {
    const first = message.split("\n")[0].slice(0, 48);
    const subject = `Incadent · ${topics[topic]}${first ? `: ${first}` : ""}`;
    const sign = author ? `\n\n— ${author}` : "";
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + sign)}`;
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      topic = b.dataset.topic ?? "idea";
      refresh();
    }),
  );
  form.addEventListener("input", () => {
    status.textContent = "";
    refresh();
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = msg.value.trim();
    if (!message || sending) return;
    if (!endpoint) {
      openDraft(message, name.value.trim());
      return;
    }
    sending = true;
    status.textContent = "";
    refresh();
    const body = new URLSearchParams({
      topic: topics[topic] ?? topic,
      name: name.value.trim(),
      email: email.value.trim(),
      message,
      lang,
      website: trap.value,
    });
    try {
      // the script answers without cors headers, so the reply is opaque and a finished request counts as sent
      await fetch(endpoint, { method: "POST", mode: "no-cors", body });
      msg.value = "";
      showStatus("sent");
    } catch {
      showStatus("error");
    } finally {
      sending = false;
      refresh();
    }
  });
  refresh();
}
