# Inventure Communications

Institutional corporate website (Next.js App Router) with a CMS-agnostic content layer.

## Stack

Next.js, TypeScript, Tailwind CSS, Framer Motion, native fetch ISR/SSG, `next-intl`, `next-themes`.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `/en` (default locale) or `/ar` for Arabic (RTL). Locale detection is enabled via `src/proxy.ts`.

## Internationalization

- Locales: `en`, `ar` under `src/app/[locale]/`
- UI strings: `messages/en.json`, `messages/ar.json` (key parity enforced in tests)
- Locale-aware navigation: `@/i18n/navigation` (`Link`, `useRouter`, etc.)
- CMS content: pass `locale` to `fetchServices`, `fetchServiceBySlug`, and related helpers in `@/services/cms`

## Theming

- Light / dark / system via `next-themes` (`ThemeSwitcher` in Header and mobile nav)
- Semantic tokens in `src/app/globals.css` with `@custom-variant dark`
- Optional **desert** palette: set `data-theme="desert"` on `<html>` (CSS is ready; no Header control). Useful for demos or one-off previews.

## CMS

Set `CMS_PROVIDER` to `mock` (default), `directus`, or `supabase`. Configure `CMS_URL` and `CMS_TOKEN` for remote providers.

Set `REVALIDATE_SECRET` for `POST /api/revalidate` (header `x-revalidate-secret`, body `{ "tags": ["services"] }`).

Cache tags are locale-scoped (`services:en`, `service:ar:slug`, etc.). The revalidate API **expands** bare tags such as `services`, `insights`, `esg`, and `case-studies` to both `en` and `ar` automatically.

With the default `mock` provider, fetches do not register Next.js cache tags, so `POST /api/revalidate` may return success without changing mock-backed pages until a remote provider is used.

## Docker

The Compose stack runs Postgres, Directus, and the Next.js site. Copy `.env.example` to `.env` and change the Directus admin password and secrets before starting it.

```bash
docker compose up -d --build
node scripts/seed-directus.mjs
```

- Site: http://localhost:3000/en and http://localhost:3000/ar
- Directus: http://localhost:8055 (admin email and password from `.env`)
- The web container calls Directus at `http://directus:8055` with `CMS_PROVIDER=directus`.

The seed creates `languages` (`en`, `ar`), `services` plus `services_translations`, and the ESG collections, then grants public read. It is safe to run again. It loads `scripts/seed-data.json`, the same bilingual records as the mock provider, including all seven services. The same two files are copied in `deploy/scripts` so a server only needs the deploy folder.

`NEXT_PUBLIC_SITE_URL` is baked in when the image is built. Set it in `.env` before `docker compose up --build` when the site will be served from a public host.

Pushing to `master` runs `.github/workflows/build-image.yml`, which builds this Dockerfile and publishes it to GitHub Container Registry as `ghcr.io/<owner>/<repo>:latest`. Set the repository variable `NEXT_PUBLIC_SITE_URL` before that workflow runs for a production image.

## Production

Set `NEXT_PUBLIC_SITE_URL` to your public site origin (for example `https://www.example.com`) **before** `npm run build`. The value is inlined at build time and drives canonical URLs, hreflang alternates, Open Graph URLs, Organization JSON-LD, `sitemap.xml`, and `robots.txt`. If it is missing or still `localhost` in a production build, the app logs a warning and SEO metadata will point at the wrong host.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm test` — unit tests
- `npm run typecheck` — TypeScript check (`npx tsc --noEmit`)
- `npm run lint` — ESLint
- `npm run lint:direction` — fail on physical direction utilities (RTL safety)
