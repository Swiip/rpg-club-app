import { getMention } from '$lib/discord/send';
import { createPrivateClient } from '$lib/supabase/clients';
import { fetchOsDetails } from '$lib/supabase/os';

export const announceOs = async (id: number) => {
	const supabase = createPrivateClient();

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
