use crux_core::{macros::Effect, render::Render, App};
use crux_http::{Http, Response, Result};
use rpg_club_model::Game;
use serde::{Deserialize, Serialize};

const API_URL: &str = "http://localhost:8000";

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Event {
    // events from the shell
    Get,

    // events local to the core
    #[serde(skip)]
    Set(Result<Response<Vec<Game>>>),
}

#[derive(Default)]
pub struct Model {
    games: Vec<Game>,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct ViewModel {
    pub games: Vec<Game>,
}

#[cfg_attr(feature = "typegen", derive(crux_core::macros::Export))]
#[derive(Effect)]
pub struct Capabilities {
    render: Render<Event>,
    http: Http<Event>,
}

// #[cfg_attr(feature = "typegen", derive(crux_core::macros::Export))]
#[derive(Default, Debug)]
pub struct RpgClubCore;

impl App for RpgClubCore {
    type Event = Event;
    type Model = Model;
    type ViewModel = ViewModel;
    type Capabilities = Capabilities;

    fn update(&self, event: Self::Event, model: &mut Self::Model, caps: &Self::Capabilities) {
        match event {
            Event::Get => {
                let url = format!("{}/api/games", API_URL);
                println!("Event::Get {}", url);
                caps.http.get(url).expect_json().send(Event::Set);
            }
            Event::Set(Ok(mut response)) => {
                model.games = response.take_body().unwrap();
                println!("Event::Set {:#?}", model.games);
                caps.render.render();
            }
            Event::Set(Err(e)) => {
                panic!("Oh no something went wrong: {e:?}");
            }
        };

        caps.render.render();
    }

    fn view(&self, model: &Self::Model) -> Self::ViewModel {
        ViewModel {
            games: model.games.clone(),
        }
    }
}
