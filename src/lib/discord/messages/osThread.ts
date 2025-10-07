import { getMention, getMentions } from '$lib/discord/send';
import { formatDate } from '$lib/logic/dates';
import { capitalize } from '$lib/logic/strings';
import { fetchOsDetails } from '$lib/supabase/os';
import type { SupabaseClient } from '@supabase/supabase-js';

export const osThread = async (supabase: SupabaseClient, id: number) => {
	const result = await fetchOsDetails(supabase, id);

	if (!result.data) {
		return { content: "Rien en base données, ce n'est pas normal..." };
	}

	const os = result.data;

	const mentionsBuilder = new Set<string>();
	const messageBuilder: string[] = [];

	const date = os.event?.date ? `${capitalize(formatDate(os.event.date))} / ` : '';
	const threadName = `${date}${os.game.name} / ${os.title}`;

	messageBuilder.push(`Jeu : ${os.game.name}`, '');
	messageBuilder.push(`Scénario : ${os.title}`, '');
	messageBuilder.push(`MJ : ${getMention(os.gm, mentionsBuilder)}`, '');
	messageBuilder.push(
		`PJs : ${getMentions(
			os.registration.map(({ member }) => member),
			mentionsBuilder
		)}`,
		''
	);
	if (os.description) {
		messageBuilder.push(os.description);
	}

	return {
		thread_name: threadName,
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};
};
