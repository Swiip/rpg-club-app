import { getMention, sendMessage } from '$lib/discord/send';
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

export const GET = async ({ request }) => {
	if (
		process.env.NODE_ENV === 'production' &&
		request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	const supabase = createPrivateClient();

	const event = await fetchEventsForReminder(supabase);

	if (!event.data || (event.data.os.length === 0 && event.data.session.length === 0)) {
		console.log('No events today, abort...');
		return new Response('No events today, abort');
	}

	const mentionsBuilder = new Set<string>();
	const messageBuilder = ['Ce soir on joue !'];

	event.data.os.forEach((os) =>
		messageBuilder.push(`- OS : ${os.game.name} / ${os.title}
	MJ : ${getMention(os.gm, mentionsBuilder)}
	PJs : ${players(os.registration, mentionsBuilder)}`)
	);

	event.data.session.forEach((session) =>
		messageBuilder.push(
			`- Campagne : ${session.campaign.game.name} / ${session.campaign.title}
	MJ : ${getMention(session.campaign.gm, mentionsBuilder)}
	PJs : ${players(session.campaign.registration, mentionsBuilder)}`
		)
	);

	const message = {
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};

	await sendMessage(message);

	return new Response(`Sent message:\n\n${JSON.stringify(message, null, 2)}`);
};
