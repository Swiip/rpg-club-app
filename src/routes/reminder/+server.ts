import { sendMessage } from '$lib/discord/send.js';
import { fetchGames } from '$lib/supabase/games';
import { createPrivateClient } from '$lib/supabase/clients';

export const GET = async ({ request }) => {
	if (
		process.env.NODE_ENV === 'production' &&
		request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	const supabase = createPrivateClient();

	const games = await fetchGames(supabase);

	if (!games.data) {
		return new Response('No games found', { status: 404 });
	}

	const message = games.data.map((game) => `- ${game.name}`).join('\n');

	await sendMessage(message);

	return new Response('Ok');
};
