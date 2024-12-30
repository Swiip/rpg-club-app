#[macro_use]
extern crate rocket;

use rocket::{serde::json::Json, State};
use rpg_club_db::{get_games as db_get_games, new, DbConnection, Game};

#[derive(Debug, Responder)]
enum ApiError {
    #[response(status = 500)]
    Database(String),
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/games")]
fn get_games(state: &State<DbConnection>) -> Result<Json<Vec<Game>>, ApiError> {
    db_get_games(&state)
        .map(Json)
        .map_err(|e| ApiError::Database(e.to_string()))
}

#[launch]
fn rocket() -> _ {
    let conn = new().expect("Failed to initialize database");

    rocket::build()
        .manage(conn)
        .mount("/", routes![index])
        .mount("/api", routes![get_games])
}
