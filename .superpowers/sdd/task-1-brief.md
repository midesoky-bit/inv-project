### Task 1: Scaffold Next.js App Router project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/*` (via create-next-app)
- Preserve: `docs/superpowers/**`

**Interfaces:**
- Consumes: none
- Produces: runnable Next.js app with `src/`, TypeScript, Tailwind, `@/*` alias

- [ ] **Step 1: Scaffold in the repo root**

From `D:\Projects\inv-project` (non-empty because of `docs/` — use create-next-app; if it refuses a non-empty directory, scaffold into `_tmp` then move files up, keeping `docs/` and `.git`):

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```

If blocked by existing files:

```powershell
npx create-next-app@latest _scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
# Move scaffold contents into root, excluding overwriting docs/ and .git
Copy-Item -Path _scaffold\* -Destination . -Recurse -Force
Remove-Item -Recurse -Force _scaffold
```

- [ ] **Step 2: Enable TypeScript strict (verify `tsconfig.json`)**

Ensure `"strict": true` in `tsconfig.json`. If create-next-app left it true, leave as-is.

- [ ] **Step 3: Install Framer Motion**

```powershell
npm install framer-motion
```

- [ ] **Step 4: Add Vitest for CMS unit tests**

```powershell
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Smoke the scaffold**

```powershell
npm run build
```

Expected: build succeeds (default starter page).

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs vitest.config.ts src public
git commit -m "chore: scaffold Next.js App Router with Tailwind and Vitest"
```

---

