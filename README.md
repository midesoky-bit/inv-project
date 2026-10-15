# Inventure Communications

Institutional corporate website (Next.js App Router) with a CMS-agnostic content layer.

## Stack

Next.js, TypeScript, Tailwind CSS, Framer Motion, native fetch ISR/SSG.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## CMS

Set `CMS_PROVIDER` to `mock` (default), `directus`, or `supabase`. Configure `CMS_URL` and `CMS_TOKEN` for remote providers.

Set `REVALIDATE_SECRET` for `POST /api/revalidate` (header `x-revalidate-secret`, body `{ "tags": ["services"] }`).

With the default `mock` provider, fetches do not register Next.js cache tags, so `POST /api/revalidate` may return success without changing mock-backed pages until a remote provider is used.

## Production

Set `NEXT_PUBLIC_SITE_URL` to your public site origin (for example `https://www.example.com`) **before** `npm run build`. The value is inlined at build time and drives canonical URLs, Open Graph URLs, `sitemap.xml`, and `robots.txt`. If it is missing or still `localhost` in a production build, the app logs a warning and SEO metadata will point at the wrong host.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm test` — unit tests
- `npm run typecheck` — TypeScript check
