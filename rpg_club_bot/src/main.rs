mod commands;
mod utils;

use std::env;

use serenity::all::{
    Command, CreateInteractionResponse, CreateInteractionResponseMessage, Interaction, Ready,
};
use serenity::async_trait;
use serenity::prelude::*;

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        if let Interaction::Command(command) = interaction {
            println!("Received command interaction: {}", &command.data.name);

            let content = match command.data.name.as_str() {
                "ping" => Some(commands::ping::run(&command.data.options())),
                "addgame" => Some(commands::add_game::run(&command.data.options())),
                "listgames" => Some(commands::list_games::run(&command.data.options())),
                "updategame" => Some(commands::update_game::run(&command.data.options())),
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

    async fn ready(&self, ctx: Context, ready: Ready) {
        println!("{} is connected!", ready.user.name);
        println!("Bot ID: {}", ready.user.id);
        println!("Bot Display name {}", ready.user.display_name());
        println!("Connected to {} guilds", ready.guilds.len());
        for guild in &ready.guilds {
            println!("Connected to guild ID: {}", guild.id);
        }

        let commands = vec![
            commands::ping::register(),
            commands::add_game::register(),
            commands::list_games::register(),
            commands::update_game::register(),
        ];

        for command in &commands {
            let cmd = Command::create_global_command(&ctx.http, command.clone()).await;
            println!("Created command: {}", cmd.unwrap().name);
        }
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
