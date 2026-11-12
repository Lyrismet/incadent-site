# incadent-site

Site for the Incadent app (Google Play listing): home, privacy policy and support, in Russian (root) and English (`/en/`). Astro, static output, deployed to GitHub Pages by `.github/workflows/deploy.yml` (Settings → Pages → Source: GitHub Actions).

## Commands

- `npm install`, `npm run dev` (local server), `npm run build` (type check + build into `dist/`).

## Where things are

- `src/i18n/ru.ts` is the source of all texts, `en.ts` must have exactly the same keys (typed as `Dict`), a missing key fails `npm run build`.
- `src/components/` are the page blocks written once (`Hero`, `Features`, `Contact`, `PrivacyPage`), `src/pages/**` are thin wrappers that pass `lang`. Russian lives in the root, English in `/en/`.
- `src/scripts/` is the small client code: the typing demo, the feature scroll, the contact form (builds a `mailto:` draft, no server) and the language choice.
- `src/config.ts` holds the contact email and `PLAY_URL`, set it to the store link when the app is published (null shows "coming soon").
- Screenshots live in `src/assets/screens/` and are turned into webp at build time, order matches `feat.items`.
- With a custom domain remove `base` and set `site` in `astro.config.mjs`.
- Design mockups (`*.dc.html`) stay out of git.
- The privacy policy must stay in line with the Data safety form in Play Console and with the app manifest.

## Adding a page or a language

- Page: add a `*Page.astro` component, its texts to `ru.ts` and `en.ts`, two wrappers in `src/pages/`, a value in `PagePath` (`src/i18n/index.ts`).
- Language: add `xx.ts` typed as `Dict`, register it in `src/i18n/index.ts`, add `src/pages/xx/`.
