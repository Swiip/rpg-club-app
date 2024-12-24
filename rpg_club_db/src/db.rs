use std::env;
use std::fs;

use rusqlite::{Connection, Result};

const DEFAULT_PATH: &str = "../rpg_club_db/db/rpg_club.db";
const DEFAULT_INIT_SCRIPT_PATH: &str = "../rpg_club_db/db/init.sql";

fn get_db_path() -> String {
    env::var("DB_PATH").unwrap_or_else(|_| DEFAULT_PATH.to_string())
}

fn get_init_script_path() -> String {
    env::var("DB_INIT_SCRIPT_PATH").unwrap_or_else(|_| DEFAULT_INIT_SCRIPT_PATH.to_string())
}

pub fn new() -> Result<Connection> {
    Connection::open(get_db_path())
}

pub fn init() -> Result<()> {
    let conn = new()?;

    let init_sql =
        fs::read_to_string(get_init_script_path()).expect("Failed to read init.sql file");
    conn.execute_batch(&init_sql)?;

    println!("Database initialized successfully!");
    Ok(())
}
