use crate::db;
use rusqlite::Result;

#[derive(Default, Debug)]
pub struct Game {
    pub id: usize,
    pub name: String,
    pub illustration: String,
}

pub fn get_games() -> Result<Vec<Game>> {
    let conn = db::new()?;

    let mut stmt = conn.prepare("SELECT id, name, illustration FROM games")?;

    let games: Result<Vec<Game>> = stmt
        .query_map([], |row| {
            Ok(Game {
                id: row.get(0)?,
                name: row.get(1)?,
                illustration: row.get(2)?,
            })
        })?
        .collect();

    games
}

pub fn add_game(name: &str, illustration: &str) -> Result<Game> {
    let conn = db::new()?;

    // Insérer le nouveau jeu
    conn.execute(
        "INSERT INTO games (name, illustration) VALUES (?1, ?2)",
        [name, illustration],
    )?;

    // Récupérer l'id du jeu qui vient d'être inséré
    let id = conn.last_insert_rowid() as usize;

    Ok(Game {
        id,
        name: name.to_string(),
        illustration: illustration.to_string(),
    })
}
