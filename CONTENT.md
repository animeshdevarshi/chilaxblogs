# Writing & publishing content

This repo is the **blog** served at `cognoweavesolution.com/blog/`.
The main site (`cognoweavesolution.com/`) is a **separate project** and not in this repo.

## Publish flow (all content)

```
git add -A
git commit -m "post: <what changed>"
git push
```

Push to `main` → Cloudflare rebuilds and deploys automatically (~1 min).
Check progress: Cloudflare dashboard → Workers & Pages → `chilaxblogs` → Deployments.

## Preview locally before pushing

```
npm run dev        # http://localhost:4321/blog/
```

`npm run build` runs the production build (also nests output under `blog/`).

---

## New blog post

Create `src/content/blog/<url-slug>.md`. The filename becomes the URL:
`src/content/blog/my-post.md` → `/blog/my-post/`.

```markdown
---
title: 'Your title'
description: 'One or two sentences. Shows in previews, search results, and the RSS feed.'
pubDate: 'Sep 05 2026'
---

Write in Markdown. First paragraph, then

## A heading

More text.
```

Frontmatter fields:

| Field | Required | Notes |
|---|---|---|
| `title` | yes | |
| `description` | yes | plain text, no Markdown |
| `pubDate` | yes | `'Mon DD YYYY'` — controls sort order (newest first) |
| `updatedDate` | no | shows "Last updated on ..." |
| `heroImage` | no | `'../../assets/file.jpg'` — see Images below |

## Edit an existing post

Edit the `.md` file in `src/content/blog/`. To change a post's URL, rename the file
(old URL will 404 — avoid once a post has traffic).

## Delete a post

`git rm src/content/blog/<slug>.md`

---

## Images

1. Put the file in `src/assets/` (e.g. `src/assets/kitchen.jpg`).
2. Reference it:
   - **Hero:** add `heroImage: '../../assets/kitchen.jpg'` to frontmatter.
   - **In body:** `![alt text](../../assets/kitchen.jpg)`

Astro optimises and resizes them at build time. Prefer `.jpg`/`.png`/`.webp`,
roughly 1600px wide or less.

---

## Static pages (About, etc.)

These are `.astro` files in `src/pages/`, not Markdown:

- `src/pages/about.astro` → `/blog/about/`
- `src/pages/index.astro` → `/blog/` (the post list — edit layout here, not content)

To add another static page, create `src/pages/<name>.astro`. Simplest starting point —
copy `about.astro`, which just wraps Markdown-like content in the `BlogPost` layout.

Internal links in `.astro` files must include the base path. Use
`import.meta.env.BASE_URL` rather than hardcoding `/blog/`.

---

## Site-wide settings

| What | Where |
|---|---|
| Blog title / description | `src/consts.ts` |
| Header nav + logo text | `src/components/Header.astro` |
| Footer | `src/components/Footer.astro` |
| Favicon | `public/favicon.svg`, `public/favicon.ico` |
| Domain / base path | `astro.config.mjs` (`site`, `base`) — don't change without redoing routing |

---

## Publishing to the ROOT website (`cognoweavesolution.com/`)

Not part of this repo. When the main site exists it will be its own Cloudflare
project; a Worker route (`deploy/worker-router.js`) sends `/blog/*` here and
everything else there. See `DEPLOY.md`.
