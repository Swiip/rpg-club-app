import { createReminderMessage } from '$lib/discord/messages/reminder.js';
import { sendMessage } from '$lib/discord/send';

export const GET = async ({ request }) => {
	if (
		process.env.NODE_ENV === 'production' &&
		request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const message = await createReminderMessage();

		await sendMessage(message);

		return new Response(`Sent message:\n\n${JSON.stringify(message, null, 2)}`);
	} catch (error) {
		return new Response(error instanceof Error ? error.message : 'Unknown error');
	}
};
