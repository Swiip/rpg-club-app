import type { SlashCommand } from '$lib/discord/command';
import { createCalendarMessage } from '$lib/discord/messages/calendar';
import { SlashCommandBuilder } from 'discord.js';

const calendar: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Affiche le calendrier pour le mois à venir'),

	async execute() {
		return createCalendarMessage();
	}
};

export default calendar;
