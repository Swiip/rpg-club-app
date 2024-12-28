use rusqlite::{Connection, Result};
use std::env;
use std::fs;
use std::os::unix::fs::PermissionsExt;

const DEFAULT_PATH: &str = "../rpg_club_db/db/rpg_club.db";
const DEFAULT_INIT_SCRIPT_PATH: &str = "../rpg_club_db/db/init.sql";

fn get_db_path() -> String {
    env::var("DB_PATH").unwrap_or_else(|_| DEFAULT_PATH.to_string())
}

fn get_init_script_path() -> String {
    env::var("DB_INIT_SCRIPT_PATH").unwrap_or_else(|_| DEFAULT_INIT_SCRIPT_PATH.to_string())
}

pub fn new() -> Result<Connection> {
    let db_path = get_db_path();
    println!("Attempting to connect to DB at: {}", db_path);

    match Connection::open(&db_path) {
        Ok(conn) => {
            println!("Successfully opened DB connection");
            Ok(conn)
        }
        Err(e) => {
            println!("Failed to open DB: {}", e);
            println!("Error code: {:?}", e);
            if let Ok(metadata) = fs::metadata(&db_path) {
                println!("DB file permissions: {:o}", metadata.permissions().mode());
            }
            Err(e)
        }
    }
}

pub fn init() -> Result<()> {
    println!("Starting DB initialization...");
    let db_path = get_db_path();
    let init_script_path = get_init_script_path();

    println!("DB Path: {}", db_path);
    println!("Init Script Path: {}", init_script_path);

    let conn = new()?;
    println!("Connection created");

    // Lire le script d'initialisation
    match fs::read_to_string(&init_script_path) {
        Ok(init_sql) => {
            println!("Successfully read init script ({} bytes)", init_sql.len());
            match conn.execute_batch(&init_sql) {
                Ok(_) => println!("Successfully executed init script"),
                Err(e) => println!("Failed to execute init script: {}", e),
            }
        }
        Err(e) => println!("Failed to read init script: {}", e),
    }

    Ok(())
}
