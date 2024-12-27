use rusqlite::{Connection, Result};
use std::env;
use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::Path;

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

    // Vérifier le dossier parent
    if let Some(parent) = Path::new(&db_path).parent() {
        println!("Parent directory: {}", parent.display());
        if !parent.exists() {
            println!("Creating parent directory");
            let _ = fs::create_dir_all(parent);
        }

        // Vérifier les permissions
        if let Ok(metadata) = fs::metadata(parent) {
            println!(
                "Parent directory permissions: {:o}",
                metadata.permissions().mode()
            );
        }
    }

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

    // Vérifier que le script d'init existe
    if !Path::new(&init_script_path).exists() {
        println!("Init script not found at: {}", init_script_path);
        return Err(rusqlite::Error::SqliteFailure(
            rusqlite::ffi::Error::new(1),
            Some("Init script not found".to_string()),
        ));
    }

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

    // Test d'écriture
    println!("Testing write permissions...");
    match conn.execute(
        "CREATE TABLE IF NOT EXISTS _test (id INTEGER PRIMARY KEY)",
        [],
    ) {
        Ok(_) => println!("Write test successfullllll"),
        Err(e) => println!("Write test failed: {}", e),
    }

    Ok(())
}
