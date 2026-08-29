/**
 * Path router for cognoweavesolution.com.
 *
 * Routes /blog and /blog/* to the blog Pages project, everything else to the
 * main site Pages project. Both targets are attached as service bindings:
 *
 *   BLOG -> blog Pages project (this repo, serves paths under /blog/)
 *   SITE -> main site Pages project
 *
 * Configure in wrangler.toml or the dashboard (Settings -> Bindings).
 */
export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === '/blog' || url.pathname.startsWith('/blog/')) {
			return env.BLOG.fetch(request);
		}

		return env.SITE.fetch(request);
	},
};
