import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchGames } from "../supabase/games";

export default {
    data: new SlashCommandBuilder().setName("listgames").setDescription("List all our games!"),

    async execute(data: { interaction: ChatInputCommandInteraction }) {
        try {
            const interaction = data.interaction;

            const result = await fetchGames();

            if (!result.data) {
                await interaction.reply("No games found!");
                return;
            }

            const reply = result.data.map((game) => `- ${game.name}`).join("\n");

            await interaction.reply(reply);
        } catch (error) {
            console.error(error);
        }
    },
};
