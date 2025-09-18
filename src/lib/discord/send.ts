import { DISCORD_WEBHOOK_URL } from '$env/static/private';

type SendMessageBody = {
	content: string;
	allowed_mentions?: {
		users: string[];
	};
};

export const getMention = (member: { discord_id: string }, mentions: Set<string>) => {
	mentions.add(member.discord_id);
	return `<@${member.discord_id}>`;
};

export const sendMessage = async (message: SendMessageBody) => {
	try {
		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message)
		});

		if (!response.ok) {
			console.error('Failed to send message to Discord.', response);
			throw new Error('Failed to send message to Discord.');
		}

		console.log('Message sent successfully!');
	} catch (error) {
		console.error(error || 'Unknown error occurred.');
	}
};
