import { sendMessage } from '$lib/discord/send';
import calendarCommand from '$lib/discord/commands/calendar';

export const GET = async ({ request }) => {
	if (
		process.env.NODE_ENV === 'production' &&
		request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	const message = await calendarCommand.execute('');

	await sendMessage(message);

	return new Response(`Sent message:\n\n${JSON.stringify(message, null, 2)}`);
};
