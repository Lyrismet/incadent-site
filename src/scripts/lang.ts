const KEY = "incadent-site-lang";

function stored(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function preferred(): "ru" | "en" {
  const s = stored();
  if (s === "ru" || s === "en") return s;
  return /^(ru|uk|be|kk)/i.test(navigator.language) ? "ru" : "en";
}

// only the default russian home page redirects, an explicit /en/ link always stays where it is
export function redirectToPreferred(current: string): void {
  if (current !== "ru" || preferred() !== "en") return;
  const target = document.querySelector<HTMLAnchorElement>('a[data-lang="en"]');
  if (target) location.replace(target.href);
}

export function rememberChoice(): void {
  document.querySelectorAll<HTMLAnchorElement>("a[data-lang]").forEach((a) => {
    a.addEventListener("click", () => {
      try {
        localStorage.setItem(KEY, a.dataset.lang ?? "");
      } catch {
        // storage can be blocked, the switch still works by the link
      }
    });
  });
}
