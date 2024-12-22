use rusqlite::{Connection, Result};
use std::fs;

fn init_db() -> Result<()> {
    // Connect to or create the database
    let conn = Connection::open("db/rpg_club.db")?;

    // Read the SQL initialization file
    let init_sql = fs::read_to_string("db/init.sql").expect("Failed to read init.sql file");

    // Execute all SQL statements in the file
    conn.execute_batch(&init_sql)?;

    println!("Database initialized successfully!");
    Ok(())
}

fn main() {
    match init_db() {
        Ok(_) => println!("Database initialization completed"),
        Err(e) => eprintln!("Error initializing database: {}", e),
    }
}
