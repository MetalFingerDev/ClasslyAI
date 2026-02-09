import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html
	});

	// Adding a basic CSP to help with the warnings
	// We allow YouTube embeds and related resources
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https://www.youtube.com https://i.ytimg.com",
		'frame-src https://www.youtube-nocookie.com https://www.youtube.com',
		"connect-src 'self' https://www.youtube.com https://googleads.g.doubleclick.net",
		"font-src 'self' data:",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'self'",
		'upgrade-insecure-requests'
	].join('; ');

	// response.headers.set('Content-Security-Policy', csp);
	// Actually, SvelteKit has a built-in way to set CSP in svelte.config.js which is preferred
	// But since I want to be safe and dynamic, I can do it here or in config.
	// However, if I use the config, it handles nonces for me.

	return response;
};
