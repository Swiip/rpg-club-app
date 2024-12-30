use rusqlite::Connection;

// Wrapper type for Connection
pub struct DbConnection(pub(crate) Connection);

// Implement Send and Sync once
unsafe impl Send for DbConnection {}
unsafe impl Sync for DbConnection {}

// Implement Deref to allow using DbConnection as Connection
impl std::ops::Deref for DbConnection {
    type Target = Connection;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl std::ops::DerefMut for DbConnection {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}
