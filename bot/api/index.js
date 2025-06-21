// index.ts
import axios from "axios";
import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { InteractionType as InteractionType2, verifyKey } from "discord-interactions";
import getRawBody from "raw-body";

// commands/ping.ts
var ping_default = {
  data: {
    name: "ping",
    // The name of the command
    description: "Check if the bot is online"
    // The description of the command
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(data) {
    return {
      content: "Pong from Vercel!"
      // The message content
    };
  }
};

// .discraft/commands/index.ts
var commands_default = {
  ping: ping_default
};

// utils/logger.ts
import consola from "consola";

// utils/types.ts
import "discord-interactions";

// index.ts
async function handler(req, res) {
  try {
    consola.debug("Request received", { method: req.method, url: req.url });
    if (req.method !== "POST") {
      consola.warn("Method not allowed", { method: req.method });
      return res.status(405).send({ error: "Method Not Allowed" });
    }
    const signature = req.headers["x-signature-ed25519"];
    const timestamp = req.headers["x-signature-timestamp"];
    if (!signature || !timestamp || typeof signature !== "string" || typeof timestamp !== "string") {
      consola.error("Invalid request headers", { signature, timestamp });
      return res.status(401).send({ error: "Invalid request headers" });
    }
    if (!process.env.DISCORD_PUBLIC_KEY) {
      consola.error("DISCORD_PUBLIC_KEY environment variable not set");
      return res.status(500).send({ error: "Internal server configuration error" });
    }
    const rawBody = await getRawBody(req);
    if (!rawBody) {
      consola.error("Missing request body");
      return res.status(400).send({ error: "Missing request body" });
    }
    let isValidRequest = false;
    try {
      isValidRequest = await verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
    } catch (err) {
      consola.error("Signature verification failed", {
        error: err,
        signature,
        timestamp
      });
      return res.status(401).send({ error: "Invalid request signature" });
    }
    if (!isValidRequest) {
      consola.error("Invalid request signature", { signature, timestamp });
      return res.status(401).send({ error: "Invalid request signature" });
    }
    const message = JSON.parse(rawBody.toString());
    consola.debug("Parsed message", { message });
    if (message.type === InteractionType2.PING) {
      consola.debug("Handling Ping request");
      return res.status(200).json({ type: InteractionResponseType.Pong });
    } else if (message.type === InteractionType2.APPLICATION_COMMAND) {
      const commandName = message.data.name.toLowerCase();
      consola.debug("Handling application command", { commandName });
      const command = commands_default[commandName];
      if (command) {
        try {
          await axios.post(
            `https://discord.com/api/v10/interactions/${message.id}/${message.token}/callback`,
            {
              type: InteractionResponseType.DeferredChannelMessageWithSource,
              data: {
                flags: command.data.initialEphemeral ? MessageFlags.Ephemeral : 0
              }
            },
            {
              headers: { "Content-Type": "application/json" }
            }
          );
        } catch (deferError) {
          consola.error("Failed to defer command", { deferError });
          return res.status(500).json({ error: "Failed to defer command" });
        }
        let commandResult;
        try {
          commandResult = await command.execute({ interaction: message });
          consola.debug("Command executed successfully", { commandName });
        } catch (error) {
          consola.error("Error executing command", {
            commandName,
            error
          });
          commandResult = {
            content: "An error occurred while processing your request.",
            flags: MessageFlags.Ephemeral
          };
        }
        try {
          await axios.patch(
            `https://discord.com/api/v10/webhooks/${message.application_id}/${message.token}/messages/@original`,
            {
              content: commandResult.content ?? "",
              flags: commandResult.flags
            },
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          consola.debug("Original response edited successfully");
          return res.status(200).end();
        } catch (patchError) {
          consola.error("Failed to edit original response", {
            patchError
          });
          return res.status(500).json({ error: "Failed to update the message." });
        }
      }
      consola.warn("Unknown command", { commandName });
      return res.status(400).json({ error: "Unknown Command" });
    } else {
      consola.warn("Unknown Interaction Type", { type: message.type });
      return res.status(400).json({ error: "Unknown Interaction Type" });
    }
  } catch (error) {
    consola.error("Error processing request", {
      error
    });
    return res.status(500).json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
export {
  handler as default
};
