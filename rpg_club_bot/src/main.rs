mod commands;

use std::env;

use serenity::all::{
    Command, CreateInteractionResponse, CreateInteractionResponseMessage, Interaction, Ready,
};
use serenity::async_trait;
use serenity::model::channel::Message;
use serenity::prelude::*;

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    // Set a handler for the `message` event. This is called whenever a new message is received.
    //
    // Event handlers are dispatched through a threadpool, and so multiple events can be
    // dispatched simultaneously.
    async fn message(&self, ctx: Context, msg: Message) {
        println!("Messges received! {} {}", msg.content, msg.author.name);

        if msg.content == "!ping" {
            // Sending a message can fail, due to a network error, an authentication error, or lack
            // of permissions to post in the channel, so log to stdout when some error happens,
            // with a description of it.
            if let Err(why) = msg.channel_id.say(&ctx.http, "Pong!").await {
                println!("Error sending message: {why:?}");
            }
        }
    }

    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        if let Interaction::Command(command) = interaction {
            println!("Received command interaction: {command:#?}");

            let content = match command.data.name.as_str() {
                "ping" => Some(commands::ping::run(&command.data.options())),
                "addgame" => Some(commands::add_game::run(&command.data.options())),
                "listgames" => Some(commands::list_games::run(&command.data.options())),
                // "id" => Some(commands::id::run(&command.data.options())),
                // "attachmentinput" => Some(commands::attachmentinput::run(&command.data.options())),
                // "modal" => {
                //     commands::modal::run(&ctx, &command).await.unwrap();
                //     None
                // }
                _ => Some("not implemented :(".to_string()),
            };

            if let Some(content) = content {
                let data = CreateInteractionResponseMessage::new().content(content);
                let builder = CreateInteractionResponse::Message(data);
                if let Err(why) = command.create_response(&ctx.http, builder).await {
                    println!("Cannot respond to slash command: {why}");
                }
            }
        }
    }

    // Set a handler to be called on the `ready` event. This is called when a shard is booted, and
    // a READY payload is sent by Discord. This payload contains data like the current user's guild
    // Ids, current user data, private channels, and more.
    //
    // In this case, just print what the current user's username is.
    async fn ready(&self, ctx: Context, ready: Ready) {
        println!("{} is connected!", ready.user.name);
        println!("Bot ID: {}", ready.user.id);
        println!("Connected to {} guilds", ready.guilds.len());
        println!("Bot Display name {}", ready.user.display_name());
        for guild in &ready.guilds {
            println!("Connected to guild ID: {}", guild.id);
        }

        let commands = vec![
            commands::ping::register(),
            commands::add_game::register(),
            commands::list_games::register(),
        ];

        for command in &commands {
            let cmd = Command::create_global_command(&ctx.http, command.clone()).await;
            println!("Created command: {cmd:#?}");
        }

        println!("I created the following global slash command: {commands:#?}");
    }
}

#[tokio::main]
async fn main() {
    // Configure the client with your Discord bot token in the environment.
    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");
    // Set gateway intents, which decides what events the bot will be notified about
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;

    println!("Client created successfully {}", token);

    if let Err(why) = rpg_club_db::init() {
        println!("DB error: {why:?}");
    }

    // Create a new instance of the Client, logging in as a bot. This will automatically prepend
    // your bot token with "Bot ", which is a requirement by Discord for bot users.
    let mut client = Client::builder(&token, intents)
        .event_handler(Handler)
        .await
        .expect("Err creating client");

    // Finally, start a single shard, and start listening to events.
    //
    // Shards will automatically attempt to reconnect, and will perform exponential backoff until
    // it reconnects.
    if let Err(why) = client.start().await {
        println!("Client error: {why:?}");
    }
}
