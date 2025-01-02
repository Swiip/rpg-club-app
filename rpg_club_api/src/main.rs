#[macro_use]
extern crate rocket;

use rocket::{serde::json::Json, State};
use rocket_cors::{AllowedOrigins, CorsOptions};
use rpg_club_db::{get_games as db_get_games, new, DbConnection};
use rpg_club_model::Game;

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
    db_get_games(state)
        .map(Json)
        .map_err(|e| ApiError::Database(e.to_string()))
}

#[launch]
fn rocket() -> _ {
    let conn = new().expect("Failed to initialize database");

    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec!["Get", "Post", "Delete"]
                .into_iter()
                .map(|s| s.parse().unwrap())
                .collect(),
        )
        .allow_credentials(true)
        .to_cors()
        .unwrap();

    rocket::build()
        .configure(rocket::Config::figment().merge(("address", "0.0.0.0")))
        .manage(conn)
        .mount("/", routes![index])
        .mount("/api", routes![get_games])
        .attach(cors)
}
