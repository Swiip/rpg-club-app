use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
pub struct Game {
    pub id: usize,
    pub name: String,
    pub illustration: String,
}
