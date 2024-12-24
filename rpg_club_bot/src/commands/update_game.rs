use crate::utils::games;
use serenity::builder::CreateCommand;
use serenity::model::application::ResolvedOption;

pub fn run(options: &[ResolvedOption]) -> String {
    let id = games::get_game_id(options);
    let name = games::get_game_name(options);
    let illustration = games::get_game_illustration(options);

    if id.is_none() || name.is_none() || illustration.is_none() {
        return "Error: All fields (id, name, and illustration) are required".to_string();
    }

    let result = rpg_club_db::update_game(id.unwrap(), name.unwrap(), illustration.unwrap());

    match result {
        Ok(game) => format!("Game updated successfully: {} (id: {})", game.name, game.id),
        Err(e) => format!("Failed to add game: {}", e),
    }
}

pub fn register() -> CreateCommand {
    CreateCommand::new("updategame")
        .description("Update an existing game")
        .add_option(games::get_game_id_option().required(true))
        .add_option(games::get_game_name_option().required(true))
        .add_option(games::get_game_illustration_option().required(true))
}
