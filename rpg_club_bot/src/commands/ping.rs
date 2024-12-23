use serenity::all::{CommandOptionType, CreateCommandOption, ResolvedValue};
use serenity::builder::CreateCommand;
use serenity::model::application::ResolvedOption;

pub fn run(options: &[ResolvedOption]) -> String {
    let message = if let Some(ResolvedOption {
        value: ResolvedValue::String(message),
        ..
    }) = options.first()
    {
        format!("ping with {}", message)
    } else {
        "Please provide a valid message".to_string()
    };

    format!("Hey, I'm alive! You pinged me with {}", message)
}

pub fn register() -> CreateCommand {
    CreateCommand::new("ping")
        .description("A ping command")
        .add_option(
            CreateCommandOption::new(CommandOptionType::String, "message", "The message to send")
                .required(true),
        )
}
