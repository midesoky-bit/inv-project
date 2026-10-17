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

Copy the `scripts` folder onto the server next to your project folder. The script reads `scripts/seed-data.json` and creates the collections, public read access, and the English and Arabic records. Run it from the folder that contains `scripts/`.

```bash
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_ADMIN_EMAIL=admin@inventure.com \
DIRECTUS_ADMIN_PASSWORD=the-password-from-deploy-env \
node scripts/seed-directus.mjs
```

Use the email and password from `deploy/.env`. The script is safe to run again.

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
