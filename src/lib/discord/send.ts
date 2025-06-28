import { DISCORD_WEBHOOK_URL } from '$env/static/private';

export const sendMessage = async (content: string) => {
	try {
		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content })
		});

		if (!response.ok) throw new Error('Failed to send message to Discord.');

		console.log('Message sent successfully!');
	} catch (error) {
		console.error(error || 'Unknown error occurred.');
	}
};
