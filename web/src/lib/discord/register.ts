import { REST, Routes } from 'discord.js';
import ping from './commands/ping';
import { DISCORD_TOKEN, DISCORD_APP_ID } from '$env/static/private';

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

const commandData = [ping.data];

export const register = async () => {
	try {
		console.log('Started refreshing', commandData.length, 'application (/) commands.');

		const data = await rest.put(Routes.applicationCommands(DISCORD_APP_ID), {
			body: commandData
		});

		console.log('Successfully reloaded', data, 'application (/) commands.');
	} catch (error) {
		console.error(error);
	}
};
