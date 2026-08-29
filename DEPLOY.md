# Deploying the Cognoweave blog to Cloudflare

The blog is a **static** Astro site configured to live at
`https://cognoweavesolution.com/blog/` (`base: '/blog'` in `astro.config.mjs`).

`npm run build` produces `dist/blog/**` — the output is pre-nested under `blog/`
by `scripts/nest-under-base.mjs` so the file layout matches the URL path.

---

## 1. Create the Cloudflare Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick the `animeshdevarshi/chilaxblogs` repo, branch `main`.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** set env var `NODE_VERSION=22` (package.json requires >=22.12)
4. Deploy. You'll get `https://<project>.pages.dev` — because of `base`, the blog
   is served at `https://<project>.pages.dev/blog/` (the bare root 404s, expected).

Every push to `main` now redeploys automatically.

---

## 2. Serve it at cognoweavesolution.com/blog/

Cloudflare Pages attaches to a whole hostname, not a path, so a small Worker on
the `cognoweavesolution.com` zone routes `/blog/*` to this project and everything
else to the main site.

### Interim (main site not built yet)

Add `cognoweavesolution.com` as a **custom domain** on the blog Pages project
(Pages project → Custom domains). The blog immediately works at
`cognoweavesolution.com/blog/`; other paths 404 until the main site exists.

### Final (main site + blog)

1. Deploy the main site as its own Pages project (e.g. `cognoweave-site`).
2. Create a Worker from `deploy/worker-router.js`.
3. In the Worker's settings add **Service bindings**:
   - `BLOG` → the blog Pages project
   - `SITE` → the main site Pages project
4. Add a **Route**: `cognoweavesolution.com/*` → this Worker (zone must be on Cloudflare).
5. Remove the custom domain from the individual Pages projects so only the Worker owns the hostname.

Deploy the Worker with Wrangler (`deploy/` has a `wrangler.toml`) or paste it in the dashboard.

---

## 3. Before going live — content cleanup

- Replace the starter posts in `src/content/blog/` (`first-post`, `second-post`,
  `third-post`, `markdown-style-guide`, `using-mdx`).
- Rewrite `src/pages/about.astro` (currently lorem ipsum).
- Swap the Astro social icons in `src/components/Header.astro` / `Footer.astro`
  for Cognoweave's.
- Update `src/consts.ts` title/description if needed.
- Replace `public/favicon.svg` / `favicon.ico`.
