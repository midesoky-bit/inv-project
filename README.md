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

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm test` — unit tests
- `npm run typecheck` — TypeScript check
