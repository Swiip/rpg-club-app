import { formatDate } from '$lib/logic/dates';
import { capitalize } from '$lib/logic/strings';
import { fetchBoardgameDetails } from '$lib/supabase/boardgames';
import type { SupabaseClient } from '@supabase/supabase-js';

export const announceBg = async (supabase: SupabaseClient, id: number) => {
	const result = await fetchBoardgameDetails(supabase, id);

	if (!result.data) {
		return { content: "Rien en base données, ce n'est pas normal..." };
	}

	const boardgame = result.data;

	const mentionsBuilder = new Set<string>();
	const messageBuilder: string[] = [];

	messageBuilder.push(`Jeu de société annoncé : ${capitalize(formatDate(boardgame.event.date))}`);

	return {
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};
};
