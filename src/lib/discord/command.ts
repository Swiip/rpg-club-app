import { InteractionType, verifyKey } from 'discord-interactions';
import { json } from '@sveltejs/kit';
import { InteractionResponseType, SlashCommandBuilder } from 'discord.js';
import ping from './commands/ping.js';
import { DISCORD_PUBLIC_KEY } from '$env/static/private';

export type SlashCommand = {
	data: SlashCommandBuilder;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	execute: (messsage: any) => Promise<{ content: string }>;
};

const commands: Record<string, SlashCommand> = { ping };

export const respond = async (request: Request) => {
	try {
		console.debug('Request received', { method: request.method, url: request.url });

		const signature = request.headers.get('x-signature-ed25519');
		const timestamp = request.headers.get('x-signature-timestamp');

		if (
			!signature ||
			!timestamp ||
			typeof signature !== 'string' ||
			typeof timestamp !== 'string'
		) {
			console.error('Invalid request headers', { signature, timestamp });
			return new Response('Invalid request headers', { status: 401 });
		}

		const body = await request.bytes();
		const isValidRequest = await verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY);

		if (!isValidRequest) {
			console.error('Invalid request signature', { signature, timestamp });
			return new Response('Invalid request signature', { status: 401 });
		}

		const message = JSON.parse(new TextDecoder().decode(body));
		console.debug('Parsed message', { message });

		if (message.type === InteractionType.PING) {
			console.debug('Handling Ping request');
			return json({ type: InteractionResponseType.Pong });
		} else if (message.type === InteractionType.APPLICATION_COMMAND) {
			const commandName = message.data.name.toLowerCase();
			console.debug('Handling application command', { commandName });
			const command = commands[commandName];
			if (command) {
				const data = await command.execute(message);
				return json({ type: InteractionResponseType.ChannelMessageWithSource, data });
			}
			console.warn('Unknown command', { commandName });
			return json({ error: 'Unknown Command' }, { status: 400 });
		} else {
			console.warn('Unknown Interaction Type', { type: message.type });
			return json({ error: 'Unknown Interaction Type' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error processing request', {
			error
		});
		return json(
			{
				error: 'Failed to process request',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
