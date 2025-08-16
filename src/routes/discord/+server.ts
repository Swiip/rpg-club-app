import { building } from '$app/environment';
import { register } from '$lib/discord/register';
import { respond } from '$lib/discord/command.js';

if (building) {
	await register();
}

export const POST = async ({ request }) => respond(request);
