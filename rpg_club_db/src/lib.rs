mod db; // private car c'est une implémentation interne
mod games; // public car on veut que les utilisateurs y accèdent

// On réexporte spécifiquement ce qu'on veut rendre public
pub use db::init; // la fonction d'initialisation
pub use games::{add_game, get_games, Game}; // les types et fonctions pour les jeux
