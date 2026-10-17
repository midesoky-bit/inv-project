# Server deploy

Copy this folder to the server, or run it from a checkout of the repository. It starts Postgres, Directus, and the website. The website image is built by `.github/workflows/build-image.yml` and pulled from GitHub Container Registry. Database data stays in Docker volumes on the server.

The site reads content from Directus (`CMS_PROVIDER=directus` is set in `docker-compose.yml`). It does not use the mock file.

`NEXT_PUBLIC_SITE_URL` is baked into the website image when GitHub builds it. Set that repository variable to the public site address, for example `https://www.example.com`, before the workflow runs.

## 1. Configure

```bash
cd deploy
cp .env.example .env
```

Edit `.env` and replace every password and secret. `DIRECTUS_ADMIN_EMAIL` must be a normal email address. Directus rejects addresses such as `admin@inventure.local`.

`DIRECTUS_PUBLIC_URL` must be the address editors use to open Directus, for example `https://cms.example.com`.

## 2. Start the stack

```bash
docker login ghcr.io
docker compose up -d
docker compose ps
```

Wait until `directus` is healthy. The site listens on port 3000. Directus listens on port 8055. Postgres is not published to the host.

## 3. Load the content

This folder already includes `scripts/seed-directus.mjs` and `scripts/seed-data.json`. Copy the whole `deploy` folder to the server. You do not need the rest of the source tree.

From this folder, after Directus is healthy:

```bash
cd deploy
docker run --rm --network host \
  -v "$PWD":/app -w /app \
  -e DIRECTUS_URL=http://127.0.0.1:8055 \
  -e DIRECTUS_ADMIN_EMAIL=admin@inventure.com \
  -e DIRECTUS_ADMIN_PASSWORD='the-password-from-this-env' \
  node:22-alpine node scripts/seed-directus.mjs
```

Use the email and password from `.env`. The script creates the collections, public read access, and the English and Arabic records. It is safe to run again. When it finishes it prints `Seeded 7 services and 3 ESG commitments`.

Then drop any empty page cache:

```bash
docker compose restart web
```

## 4. Check

- English: `http://<server>:3000/en`
- Arabic: `http://<server>:3000/ar`
- Directus: the `DIRECTUS_PUBLIC_URL` you set

A service title such as "Digital Media & Platforms" in English and "الإعلام الرقمي والمنصات" in Arabic confirms the pages are reading the database.

Put a reverse proxy in front of ports 3000 and 8055 for public HTTPS.

## Update the website image

```bash
cd deploy
docker compose pull web
docker compose up -d
```

This replaces the Next.js container only. Postgres and Directus data are kept.
