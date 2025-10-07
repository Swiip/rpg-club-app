import { getMention } from '$lib/discord/send';
import { fetchOsDetails } from '$lib/supabase/os';
import type { SupabaseClient } from '@supabase/supabase-js';

export const announceOs = async (supabase: SupabaseClient, id: number) => {
	const result = await fetchOsDetails(supabase, id);

	if (!result.data) {
		return { content: "Rien en base données, ce n'est pas normal..." };
	}

	const os = result.data;

	const mentionsBuilder = new Set<string>();
	const messageBuilder: string[] = [];

	messageBuilder.push(
		`Nouvel OS annoncé : ${os.title} / ${os.game.name} / MJ: ${getMention(os.gm, mentionsBuilder)}`
	);

	return {
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};
};
