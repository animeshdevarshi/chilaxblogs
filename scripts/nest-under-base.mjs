// Astro's `base` option prefixes generated URLs (e.g. /blog/_astro/...) but it
// does NOT nest the physical build output. This script moves everything in
// dist/ into dist/blog/ so the deployed file layout matches the `base` path,
// letting Cloudflare Pages serve the site correctly at cognoweavesolution.com/blog/.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const base = 'blog'; // keep in sync with `base` in astro.config.mjs

if (!fs.existsSync(dist)) {
	console.error(`[nest-under-base] ${dist} does not exist — run "astro build" first.`);
	process.exit(1);
}

const entries = fs.readdirSync(dist);
if (entries.length === 1 && entries[0] === base) {
	console.log(`[nest-under-base] dist/ already nested under "${base}/", skipping.`);
	process.exit(0);
}

const staging = path.join(root, `.dist-nest-${Date.now()}`);
fs.mkdirSync(path.join(staging, base), { recursive: true });

for (const entry of entries) {
	fs.renameSync(path.join(dist, entry), path.join(staging, base, entry));
}

fs.rmSync(dist, { recursive: true, force: true });
fs.renameSync(staging, dist);

console.log(`[nest-under-base] moved dist/* -> dist/${base}/*`);
