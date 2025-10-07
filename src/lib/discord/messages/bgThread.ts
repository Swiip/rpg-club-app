import { getMentions } from '$lib/discord/send';
import { formatDate } from '$lib/logic/dates';
import { capitalize } from '$lib/logic/strings';
import { fetchBoardgameDetails } from '$lib/supabase/boardgames';
import type { SupabaseClient } from '@supabase/supabase-js';

export const bgThread = async (supabase: SupabaseClient, id: number) => {
	const result = await fetchBoardgameDetails(supabase, id);

	if (!result.data) {
		return { content: "Rien en base données, ce n'est pas normal..." };
	}

	const boardgame = result.data;
	const games = boardgame.boardgame_games.map(({ game }) => game);

	const mentionsBuilder = new Set<string>();
	const messageBuilder: string[] = [];

	const date = boardgame.event?.date ? `${capitalize(formatDate(boardgame.event.date))} / ` : '';
	const threadName = `${date}Jeu de société`;

	if (games.length > 0) {
		messageBuilder.push(`Jeu${games.length > 1 ? 'x' : ''} : ${games.map(({ name }) => name)}`, '');
	}
	messageBuilder.push(
		`Joueurs : ${getMentions(
			boardgame.registration.map(({ member }) => member),
			mentionsBuilder
		)}`,
		''
	);
	if (boardgame.description) {
		messageBuilder.push(boardgame.description);
	}

	return {
		thread_name: threadName,
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};
};
