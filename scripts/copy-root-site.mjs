// The blog lives under /blog/ (see nest-under-base.mjs). This copies the
// company homepage in site/ to the root of dist/, so the same static-assets
// Worker serves cognoweavesolution.com/ as well as /blog/.
//
// Refuses to build while site/ still holds a {{PLACEHOLDER}}: this page is the
// company's public identity (Meta business verification reads it), and a
// half-filled address is worse than no page.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'site');
const dist = path.join(root, 'dist');

for (const name of fs.readdirSync(src)) {
	const from = path.join(src, name);
	if (name.endsWith('.html')) {
		const left = fs.readFileSync(from, 'utf8').match(/\{\{[A-Z_]+\}\}/g);
		if (left) {
			console.error(`[copy-root-site] site/${name} still has placeholders: ${[...new Set(left)].join(', ')}`);
			process.exit(1);
		}
	}
	fs.copyFileSync(from, path.join(dist, name));
}

console.log('[copy-root-site] copied site/* -> dist/');
