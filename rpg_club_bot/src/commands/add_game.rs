use rpg_club_db::add_game;
use serenity::all::{CommandOptionType, CreateCommandOption, ResolvedValue};
use serenity::builder::CreateCommand;
use serenity::model::application::ResolvedOption;

pub fn run(options: &[ResolvedOption]) -> String {
    // Extraire le nom du jeu
    let name = if let Some(ResolvedOption {
        value: ResolvedValue::String(name),
        ..
    }) = options.first()
    {
        name
    } else {
        return "Please provide a game name".to_string();
    };

    // Extraire l'illustration (optionnelle)
    let illustration = if let Some(ResolvedOption {
        value: ResolvedValue::String(illustration),
        ..
    }) = options.get(1)
    {
        illustration
    } else {
        "" // illustration par défaut vide
    };

    // Ajouter le jeu dans la DB
    match add_game(name, illustration) {
        Ok(game) => format!("Game added successfully: {} (id: {})", game.name, game.id),
        Err(e) => format!("Failed to add game: {}", e),
    }
}

pub fn register() -> CreateCommand {
    CreateCommand::new("addgame")
        .description("Add a new game")
        .add_option(
            CreateCommandOption::new(CommandOptionType::String, "name", "The name of the game")
                .required(true),
        )
        .add_option(
            CreateCommandOption::new(
                CommandOptionType::String,
                "illustration",
                "URL or path to game illustration",
            )
            .required(false),
        )
}
