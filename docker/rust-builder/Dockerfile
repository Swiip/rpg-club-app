FROM rust:latest

# Install necessary build dependencies
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev curl && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Copy Cargo.toml files
WORKDIR /usr/src/rust-builder

COPY Cargo.toml Cargo.lock ./
COPY rpg_club_api/Cargo.toml rpg_club_api/
COPY rpg_club_bot/Cargo.toml rpg_club_bot/
COPY rpg_club_db/Cargo.toml rpg_club_db/
COPY rpg_club_types/Cargo.toml rpg_club_types/
COPY rpg_club_core/Cargo.toml rpg_club_core/
COPY rpg_club_model/Cargo.toml rpg_club_model/

# Create dummy source files
RUN mkdir -p rpg_club_api/src && \
    echo "fn main() {}" > rpg_club_api/src/main.rs && \
    mkdir -p rpg_club_bot/src && \
    echo "fn main() {}" > rpg_club_bot/src/main.rs && \
    mkdir -p rpg_club_db/src && \
    echo "pub fn dummy() {}" > rpg_club_db/src/lib.rs && \
    mkdir -p rpg_club_types/src && \
    echo "pub fn dummy() {}" > rpg_club_types/src/lib.rs && \
    mkdir -p rpg_club_core/src && \
    echo "pub fn dummy() {}" > rpg_club_core/src/lib.rs && \
    mkdir -p rpg_club_model/src && \
    echo "pub fn dummy() {}" > rpg_club_model/src/lib.rs

# Build dependencies
RUN cargo build --release

# Build wasm
RUN cd rpg_club_core && wasm-pack build --target web

# Clean up dummy files
RUN rm -rf rpg_club_*/src

# Clean up compiled libs
RUN rm -f target/release/deps/librpg_club_* && \
    rm -f target/release/deps/rpg_club_* && \
    rm -rf rpg_club_types/generated && \
    rm -rf rpg_club_core/pkg

# Cache cargo registry
RUN mkdir -p /usr/local/cargo/registry && chmod -R 777 /usr/local/cargo/registry

# Set up cache directories
VOLUME ["/usr/local/cargo/registry"]
