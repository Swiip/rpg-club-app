import {
	DISCORD_WEBHOOK_URL,
	DISCORD_RPG_WEBHOOK_URL,
	DISCORD_BG_WEBHOOK_URL
} from '$env/static/private';

export type DiscordChannel = 'announcement' | 'rpg' | 'bg';

type SendMessageBody = {
	content: string;
	thread_name?: string;
	allowed_mentions?: {
		users: string[];
	};
};

export const channelMap: Record<DiscordChannel, string> = {
	announcement: DISCORD_WEBHOOK_URL,
	rpg: DISCORD_RPG_WEBHOOK_URL,
	bg: DISCORD_BG_WEBHOOK_URL
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

export const sendMessage = async (channel: DiscordChannel, message: SendMessageBody) => {
	try {
		const response = await fetch(`${channelMap[channel]}?wait=true`, {
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
	channel: DiscordChannel,
	messageId: string,
	threadId: string | undefined,
	message: SendMessageBody
) => {
	try {
		const queryParam = threadId ? `?thread_id=${threadId}` : '';

		const response = await fetch(`${channelMap[channel]}/messages/${messageId}${queryParam}`, {
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
