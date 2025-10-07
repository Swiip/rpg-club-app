import { getMention } from '$lib/discord/send';
import { createPrivateClient } from '$lib/supabase/clients';
import { fetchEventsForReminder } from '$lib/supabase/events';

const players = (
	registrations: { confirmation: boolean; member: { discord_id: string } }[],
	mentionsBuilder: Set<string>
) =>
	registrations
		.filter(({ confirmation }) => confirmation)
		.map((registration) => getMention(registration.member, mentionsBuilder))
		.join(', ');

export const createReminderMessage = async () => {
	const supabase = createPrivateClient();

	const eventsResult = await fetchEventsForReminder(supabase);

	const tablesCount =
		eventsResult.data?.flatMap((event) => [...event.os, ...event.session]).length ?? 0;

	if (!eventsResult.data || tablesCount === 0) {
		throw new Error('No events today, abort');
	}

	const mentionsBuilder = new Set<string>();
	const messageBuilder = ['Ce soir on joue !'];

	eventsResult.data.forEach((event) => {
		messageBuilder.push('', `__**${event.location}**__`);

		event.os.forEach((os) =>
			messageBuilder.push(`- OS : ${os.game.name} / ${os.title}
	MJ : ${getMention(os.gm, mentionsBuilder)}
	PJs : ${players(os.registration, mentionsBuilder)}`)
		);

		event.session.forEach((session) =>
			messageBuilder.push(
				`- Campagne : ${session.campaign.game.name} / ${session.campaign.title}
	MJ : ${getMention(session.campaign.gm, mentionsBuilder)}
	PJs : ${players(session.campaign.registration, mentionsBuilder)}`
			)
		);

		event.boardgame.forEach((boardgame) => {
			messageBuilder.push(`- Jeu de société : ${players(boardgame.registration, mentionsBuilder)}`);
		});
	});

	return {
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};
};
