import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(message: any) {
		console.log('ping executed', message);
		return { content: 'Pong from sveltekit!' };
	}
};
