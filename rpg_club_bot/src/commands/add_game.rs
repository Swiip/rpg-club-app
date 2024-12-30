use std::sync::Arc;

use crate::utils::games;
use rpg_club_db::DbConnection;
use serenity::builder::CreateCommand;
use serenity::model::application::ResolvedOption;

pub fn run(conn: &Arc<DbConnection>, options: &[ResolvedOption]) -> String {
    let name = games::get_game_name(options);
    let illustration = games::get_game_illustration(options);

    if name.is_none() || illustration.is_none() {
        return "Error: All fields (name, and illustration) are required".to_string();
    }

    let result = rpg_club_db::add_game(conn, name.unwrap(), illustration.unwrap());

    match result {
        Ok(game) => format!("Game added successfully: {} (id: {})", game.name, game.id),
        Err(e) => format!("Failed to add game: {}", e),
    }
}

pub fn register() -> CreateCommand {
    CreateCommand::new("addgame")
        .description("Add a new game")
        .add_option(games::get_game_name_option().required(true))
        .add_option(games::get_game_illustration_option().required(true))
}
