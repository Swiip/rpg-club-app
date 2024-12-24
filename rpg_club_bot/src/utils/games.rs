use serenity::all::{CommandOptionType, ResolvedOption, ResolvedValue};
use serenity::builder::CreateCommandOption;

pub fn get_game_id_option() -> CreateCommandOption {
    CreateCommandOption::new(CommandOptionType::Integer, "id", "The ID of the game")
}

pub fn get_game_name_option() -> CreateCommandOption {
    CreateCommandOption::new(CommandOptionType::String, "name", "The name of the game")
}

pub fn get_game_illustration_option() -> CreateCommandOption {
    CreateCommandOption::new(
        CommandOptionType::String,
        "illustration",
        "URL of the game illustration",
    )
}

pub fn get_game_id(options: &[ResolvedOption]) -> Option<usize> {
    options.iter().find(|opt| opt.name == "id").and_then(|opt| {
        if let ResolvedValue::Integer(id) = opt.value {
            Some(id as usize)
        } else {
            None
        }
    })
}

pub fn get_game_name<'a>(options: &'a [ResolvedOption]) -> Option<&'a str> {
    options
        .iter()
        .find(|opt| opt.name == "name")
        .and_then(|opt| {
            if let ResolvedValue::String(name) = &opt.value {
                Some(*name)
            } else {
                None
            }
        })
}

pub fn get_game_illustration<'a>(options: &'a [ResolvedOption]) -> Option<&'a str> {
    options
        .iter()
        .find(|opt| opt.name == "illustration")
        .and_then(|opt| {
            if let ResolvedValue::String(url) = &opt.value {
                Some(*url)
            } else {
                None
            }
        })
}
