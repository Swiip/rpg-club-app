import type { SlashCommand } from '$lib/discord/command';
import { SlashCommandBuilder } from 'discord.js';

const ping: SlashCommand = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(message) {
		console.log('ping executed', message);
		return { content: 'Pong from sveltekit!' };
	}
};

export default ping;
