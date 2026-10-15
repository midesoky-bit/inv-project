### Task 6: Final verification (Amendment E)

**Files:**
- Modify: `README.md` (brief run instructions only)
- Optionally modify: `package.json` (`"typecheck": "tsc --noEmit"`)

**Interfaces:**
- Consumes: full app
- Produces: verified build + documented bootstrap commands

- [ ] **Step 1: Run unit tests**

```powershell
npm test
```

Expected: PASS.

- [ ] **Step 2: Typecheck and lint** (Amendment E)

```powershell
npx tsc --noEmit
npm run lint
```

Expected: both clean. Optionally add `"typecheck": "tsc --noEmit"` to `package.json` scripts.

- [ ] **Step 3: Production build**

```powershell
npm run build
```

Expected: PASS with homepage + service routes + sitemap/robots.

- [ ] **Step 4: Crawl surface check** (Amendment E)

```powershell
npm run start
curl.exe http://localhost:3000/sitemap.xml
curl.exe http://localhost:3000/robots.txt
```

Expected: sitemap lists `/` plus four `/services/*` URLs; robots allows `/`, disallows `/api/`, references sitemap.

- [ ] **Step 5: Canonical and nav spot-check** (Amendment E)

View source of `/services/events` and confirm a self-referencing canonical. Open at mobile width and confirm the menu works from a service page; Contact scrolls to the footer.

- [ ] **Step 6: Write concise README**

Replace or create `README.md`:

```md
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
- `npm run typecheck` — TypeScript check (if script added)
```

- [ ] **Step 7: Commit**

```powershell
git add README.md package.json
git commit -m "docs: add bootstrap README and verify build"
```

---

## Plan self-review

1. **Spec coverage:** Scaffold, CMS abstraction + mock/directus/supabase stubs, tokens/fonts, layout SEO, Header/Footer/mobile nav, Hero, ServiceGrid, `services/[slug]` SSG/metadata, sitemap/robots, ISR revalidate API, env example, build verification — all mapped. Insights/ESG pages correctly omitted.
2. **Amendments A–E:** Integrated into Tasks 3–6 and new Tasks 7–8. Execution order: 1→2→3→4→5→7→8→6.
3. **Placeholders:** None remaining; `fetchServices` switch pattern made explicit; `revalidateTag` arity noted for Next 15 vs 16.
4. **Type consistency:** `Service` fields consistent across mock, CMS API, ServiceGrid, and detail page.

