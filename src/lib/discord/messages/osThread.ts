import { getMention } from '$lib/discord/send';
import { formatDate } from '$lib/logic/dates';
import { createPrivateClient } from '$lib/supabase/clients';
import { fetchOsDetails } from '$lib/supabase/os';

export const osThread = async (id: number) => {
	const supabase = createPrivateClient();

	const result = await fetchOsDetails(supabase, id);

	if (!result.data) {
		return { content: "Rien en base données, ce n'est pas normal..." };
	}

	const os = result.data;

	const mentionsBuilder = new Set<string>();
	const messageBuilder: string[] = [];

	const date = os.event?.date ? `${formatDate(os.event.date)} / ` : '';
	const threadName = `${date}${os.game.name} / ${os.title}`;

	messageBuilder.push(`Jeu : ${os.game.name}`, '');
	messageBuilder.push(`Scénario : ${os.title}`, '');
	messageBuilder.push(`MJ : ${getMention(os.gm, mentionsBuilder)}`, '');
	if (os.description) {
		messageBuilder.push(os.description);
	}

	return {
		thread_name: threadName,
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};
};
