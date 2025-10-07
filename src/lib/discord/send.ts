import { DISCORD_WEBHOOK_URL, DISCORD_THREADS_WEBHOOK_URL } from '$env/static/private';

type SendMessageBody = {
	content: string;
	thread_name?: string;
	allowed_mentions?: {
		users: string[];
	};
};

export const getMention = (member: { discord_id: string }, mentions: Set<string>) => {
	mentions.add(member.discord_id);
	return `<@${member.discord_id}>`;
};

export const getMentions = (members: { discord_id: string }[], mentions: Set<string>) =>
	members
		.map((member) => {
			mentions.add(member.discord_id);
			return `<@${member.discord_id}>`;
		})
		.join(', ');

export const sendMessage = async (message: SendMessageBody) => {
	try {
		const url = message.thread_name ? DISCORD_THREADS_WEBHOOK_URL : DISCORD_WEBHOOK_URL;

		const response = await fetch(`${url}?wait=true`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message)
		});

		if (!response.ok) {
			console.error('Failed to send message to Discord.', response);
			throw new Error('Failed to send message to Discord.');
		}

		console.log('Message sent successfully!');

		return await response.json();
	} catch (error) {
		console.error(error || 'Unknown error occurred.');
	}
};

export const editMessage = async (
	messageId: string,
	threadId: string | undefined,
	message: SendMessageBody
) => {
	try {
		const url = message.thread_name ? DISCORD_THREADS_WEBHOOK_URL : DISCORD_WEBHOOK_URL;
		const queryParam = threadId ? `?thread_id=${threadId}` : '';

		const response = await fetch(`${url}/messages/${messageId}${queryParam}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message)
		});

		if (!response.ok) {
			console.error('Failed to edit message to Discord.', response);
			throw new Error('Failed to send message to Discord.');
		}

		console.log('Message edited successfully!');

		return await response.json();
	} catch (error) {
		console.error(error || 'Unknown error occurred.');
	}
};
