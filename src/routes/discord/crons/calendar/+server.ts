import { sendMessage } from '$lib/discord/send';
import { createCalendarMessage } from '$lib/discord/messages/calendar';

export const GET = async ({ request }) => {
	if (
		process.env.NODE_ENV === 'production' &&
		request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	const message = await createCalendarMessage();

	await sendMessage('announcement', message);

	return new Response(`Sent message:\n\n${JSON.stringify(message, null, 2)}`);
};
