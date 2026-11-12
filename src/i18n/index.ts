import { en } from "./en";
import { ru, type ChipKind, type Dict } from "./ru";

export type Lang = "ru" | "en";
export type PagePath = "" | "privacy/";
export type { ChipKind, Dict };

const dicts: Record<Lang, Dict> = { ru, en };

export const langs: Lang[] = ["ru", "en"];

export function dict(lang: Lang): Dict {
  return dicts[lang];
}

export function siteBase(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

// url of a page in a language, the same page in the other language comes from the same call
export function pageUrl(lang: Lang, path: PagePath): string {
  return `${siteBase()}/${lang === "en" ? "en/" : ""}${path}`;
}
