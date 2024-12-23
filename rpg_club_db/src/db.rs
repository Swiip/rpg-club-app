use std::fs;

use rusqlite::{Connection, Result};

const DB_PATH: &str = "../rpg_club_db/db/rpg_club.db";
const INIT_SCRIPT_PATH: &str = "../rpg_club_db/db/init.sql";

pub fn new() -> Result<Connection> {
    Connection::open(DB_PATH)
}

pub fn init() -> Result<()> {
    let conn = new()?;

    // Read and execute initialization SQL
    let init_sql = fs::read_to_string(INIT_SCRIPT_PATH).expect("Failed to read init.sql file");
    conn.execute_batch(&init_sql)?;

    println!("Database initialized successfully!");
    Ok(())
}
