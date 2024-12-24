use rpg_club_db::get_games;
use serenity::builder::CreateCommand;
use serenity::model::application::ResolvedOption;

pub fn run(_options: &[ResolvedOption]) -> String {
    match get_games() {
        Ok(games) => {
            if games.is_empty() {
                "No games found in database.".to_string()
            } else {
                let mut response = String::from("📚 **Games Library**\n\n");

                for game in games {
                    response.push_str(&format!("🎲 **{}**\n", game.name));
                    response.push_str(&format!("   ID: {}\n", game.id));
                    if !game.illustration.is_empty() {
                        response.push_str(&format!("   🖼️ {}\n", game.illustration));
                    }
                    response.push('\n');
                }
                response
            }
        }
        Err(e) => format!("Failed to fetch games: {}", e),
    }
}

pub fn register() -> CreateCommand {
    CreateCommand::new("listgames").description("List all games")
}
