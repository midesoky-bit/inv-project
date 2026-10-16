# Server deploy

This folder is what the server needs. The site image is built by `.github/workflows/build-image.yml` and pulled from GitHub Container Registry. Postgres and Directus data stay in Docker volumes on the server.

`NEXT_PUBLIC_SITE_URL` is baked into the image at build time. Set that repository variable before the workflow runs.

## First start

```bash
cp .env.example .env
docker login ghcr.io
docker compose up -d
```

From a checkout of this repository (the seed reads `src/lib/cms/providers/mock.ts`):

```bash
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_ADMIN_EMAIL=admin@inventure.com \
DIRECTUS_ADMIN_PASSWORD=the-password-from-env \
node scripts/seed-directus.mjs
```

- Site: port 3000
- Directus: port 8055

Put a reverse proxy in front of both ports and point `DIRECTUS_PUBLIC_URL` at the public Directus address.

## Update

```bash
docker compose pull web
docker compose up -d
```
