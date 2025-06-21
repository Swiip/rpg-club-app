// index.ts
import { configDotenv as configDotenv2 } from "dotenv";

// commands/register.ts
import {
  Collection,
  REST,
  Routes,
  SlashCommandBuilder as SlashCommandBuilder2,
  ContextMenuCommandBuilder,
  MessageFlags
} from "discord.js";

// utils/logger.ts
import consola from "consola";

// commands/listgames.ts
import { SlashCommandBuilder } from "discord.js";

// supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import { configDotenv } from "dotenv";
configDotenv();
var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// supabase/games.ts
var fetchGames = async () => supabase.from("game").select(`id, name, illustration`).order("name", { ascending: true });

// commands/listgames.ts
var listgames_default = {
  data: new SlashCommandBuilder().setName("listgames").setDescription("List all our games!"),
  async execute(data) {
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
  }
};

// commands/register.ts
async function registerCommands(client2) {
  const commands = [];
  const commandMap = new Collection();
  const commandModules = [listgames_default];
  let errorCount = 0;
  let registeredCommands = 0;
  consola.info(`Registering ${commandModules.length} commands...`);
  for (const commandModuleUntyped of commandModules) {
    const commandModule = commandModuleUntyped;
    try {
      if (!commandModule || !commandModule.data || !commandModule.execute) {
        consola.warn(
          `Skipping invalid command "${commandModule?.data?.name ?? "unknown"}". Ensure it exports a default object with 'data' and 'execute' properties.`
        );
        errorCount++;
        continue;
      }
      const command = commandModule;
      if (command.data instanceof SlashCommandBuilder2) {
        commands.push(command.data.toJSON());
        commandMap.set(command.data.name, command);
        consola.verbose(`Registered slash command: ${command.data.name}`);
      } else if (command.data instanceof ContextMenuCommandBuilder) {
        commands.push(command.data.toJSON());
        commandMap.set(command.data.name, command);
        consola.verbose(`Registered context menu command: ${command.data.name}`);
      }
      registeredCommands++;
    } catch (error) {
      consola.error(`Failed to load command "${commandModule?.data?.name ?? "unknown"}"`);
      consola.verbose(error);
      errorCount++;
    }
  }
  if (client2.token) {
    const rest = new REST().setToken(client2.token);
    try {
      consola.info("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(client2.user?.id || "missing"), {
        body: commands
      });
      consola.success("Successfully reloaded application (/) commands.");
    } catch (error) {
      consola.error("Error registering commands.");
      consola.verbose(error);
      errorCount++;
    }
  } else {
    consola.warn("Client token not found. Skipping command registration.");
    errorCount++;
  }
  consola.success(
    `Registered ${registeredCommands} command${registeredCommands === 1 ? "" : "s"}, ${errorCount} errors.`
  );
  client2.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = commandMap.get(interaction.commandName);
      if (!command) {
        consola.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        await command.execute({ interaction });
      } catch (error) {
        consola.error(`Error executing command ${interaction.commandName}:`);
        consola.verbose(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error executing this command!",
            flags: MessageFlags.Ephemeral
          });
        } else {
          await interaction.reply({
            content: "There was an error executing this command!",
            flags: MessageFlags.Ephemeral
          });
        }
      }
    } else if (interaction.isUserContextMenuCommand()) {
      const command = commandMap.get(interaction.commandName);
      if (!command) {
        consola.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        await command.execute({ interaction });
      } catch (error) {
        consola.error(`Error executing user context menu command ${interaction.commandName}:`);
        consola.verbose(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error executing this command!",
            flags: MessageFlags.Ephemeral
          });
        } else {
          await interaction.reply({
            content: "There was an error executing this command!",
            flags: MessageFlags.Ephemeral
          });
        }
      }
    } else if (interaction.isMessageContextMenuCommand()) {
      const command = commandMap.get(interaction.commandName);
      if (!command) {
        consola.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        await command.execute({ interaction });
      } catch (error) {
        consola.error(`Error executing message context menu command ${interaction.commandName}:`);
        consola.verbose(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error executing this command!",
            flags: MessageFlags.Ephemeral
          });
        } else {
          await interaction.reply({
            content: "There was an error executing this command!",
            flags: MessageFlags.Ephemeral
          });
        }
      }
    }
  });
}

// events/register.ts
import "discord.js";

// events/ready.ts
import { ActivityType, Events } from "discord.js";
var ready_default = {
  event: Events.ClientReady,
  handler: (client2) => {
    try {
      if (!client2.user) {
        consola.error("Client user is not set.");
        return;
      }
      consola.info("Setting presence...");
      client2.user.setPresence({
        activities: [
          {
            name: "Discraft",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore Discord.js does not have this property, but it is valid
            state: "Created with Discraft",
            type: ActivityType.Custom
          }
        ],
        status: "online"
      });
    } catch (err) {
      consola.error("Error setting presence:", err);
    } finally {
      consola.success("Presence set.");
    }
  }
};

// events/messageCreate.ts
import {
  Events as Events2
} from "discord.js";
var messageCreate_default = {
  event: Events2.MessageCreate,
  handler: async (client2, message) => {
    if (message.author.bot) return;
    if (message.content === "Hi, Discraft") {
      try {
        await message.reply(`Hello, ${message.author.username}!`);
      } catch (error) {
        consola.error(`Error replying to message: ${error}`);
      }
    }
  }
};

// events/error.ts
import { Events as Events3 } from "discord.js";
var error_default = {
  event: Events3.Error,
  handler: (client2, error) => {
    consola.error("An error occurred:", error);
  }
};

// events/register.ts
var eventsToLoad = [ready_default, messageCreate_default, error_default];
async function registerEvents(client2) {
  let errorCount = 0;
  let registeredEvents = 0;
  consola.info(`Registering ${eventsToLoad.length} events...`);
  for (const eventModule of eventsToLoad) {
    try {
      if (!eventModule || typeof eventModule.event !== "string" || typeof eventModule.handler !== "function") {
        consola.warn(
          `Skipping invalid event module. Ensure it exports an object with 'event' and 'handler' properties.`
        );
        errorCount++;
        continue;
      }
      const { event, handler } = eventModule;
      client2.on(event, (...args) => {
        handler(client2, ...args);
      });
      consola.verbose(`Registered event: ${event}`);
      registeredEvents++;
    } catch (error) {
      consola.error(`Failed to load event.`);
      consola.verbose(error);
      errorCount++;
    }
  }
  consola.success(`Registered ${registeredEvents} event${registeredEvents === 1 ? "" : "s"}, ${errorCount} errors.`);
}

// clients/discord.ts
import { Client as Client6, GatewayIntentBits } from "discord.js";
var client = new Client6({
  /* Sensible defaults, you can add or remove intents as needed. */
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
var discord_default = client;

// index.ts
configDotenv2();
consola.start("Starting bot...");
registerEvents(discord_default).then(() => {
  consola.verbose("Events registered in main process.");
}).catch((err) => {
  consola.error("Error registering events.");
  consola.verbose(err);
}).finally(() => {
  discord_default.on("ready", async () => {
    consola.success("Client logged in.");
    try {
      await registerCommands(discord_default);
    } catch (err) {
      consola.error("Error registering commands.");
      consola.verbose(err);
    }
  });
  discord_default.login(process.env.DISCORD_TOKEN).catch((err) => {
    consola.error("Client login failed, make sure your token is set correctly.");
    consola.verbose(err);
  });
});
process.on("uncaughtException", (err) => {
  consola.error("Uncaught exception.");
  consola.verbose(err);
});
process.on("unhandledRejection", (err) => {
  consola.error("Unhandled rejection.");
  consola.verbose(err);
});
process.on("SIGINT", async () => {
  consola.info("Received SIGINT, Gracefully shutting down...");
  try {
    consola.info("Closing client...");
    await discord_default.destroy();
    consola.success("Client closed.");
  } catch (err) {
    consola.error("Error while shutting down client.");
    consola.verbose(err);
  }
  consola.info("Exiting...");
  process.exit(0);
});
