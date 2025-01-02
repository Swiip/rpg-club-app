use crate::DbConnection;
use rpg_club_model::Game;
use rusqlite::Result;

pub fn get_games(conn: &DbConnection) -> Result<Vec<Game>> {
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

pub fn add_game(conn: &DbConnection, name: &str, illustration: &str) -> Result<Game> {
    conn.execute(
        "INSERT INTO games (name, illustration) VALUES (?1, ?2)",
        [name, illustration],
    )?;

    let id = conn.last_insert_rowid() as usize;

    Ok(Game {
        id,
        name: name.to_string(),
        illustration: illustration.to_string(),
    })
}

pub fn update_game(conn: &DbConnection, id: usize, name: &str, illustration: &str) -> Result<Game> {
    conn.execute(
        "UPDATE games SET name = ?, illustration = ? WHERE id = ?",
        [name, illustration, &id.to_string()],
    )?;

    Ok(Game {
        id,
        name: name.to_string(),
        illustration: illustration.to_string(),
    })
}
