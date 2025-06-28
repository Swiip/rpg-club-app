import type {
	InteractionWebhook,
	MessageFlags,
	RESTPostAPIApplicationCommandsJSONBody
} from 'discord.js';

export type CommandData = RESTPostAPIApplicationCommandsJSONBody;

export type CommandExecuteUnpromised = {
	content: string;
	flags?: MessageFlags;
};

export type CommandExecuteResult = Promise<CommandExecuteUnpromised>;

export type CommandExecute = (data: { interaction: InteractionWebhook }) => CommandExecuteResult;
