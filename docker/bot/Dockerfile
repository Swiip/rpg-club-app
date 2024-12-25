# Builder stage
FROM rust:latest as builder

# Install necessary build dependencies
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/rpg-club-app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
COPY rpg_club_*/Cargo.toml ./
RUN for mod in rpg_club_*; do \
    mkdir -p "$mod/src"; \
    if echo "$mod" | grep -q "bot"; then \
    echo "fn main() {}" > "$mod/src/main.rs"; \
    else \
    echo "pub fn dummy() {}" > "$mod/src/lib.rs"; \
    fi; \
    done

# Build dependencies only
RUN cargo build --release

# Remove the dummy src directories
RUN rm -rf rpg_club_*/src

# Now copy the real source code
COPY . .

# Build the final application
RUN cargo build --release --bin rpg_club_bot

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y libssl-dev sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Create directory for database and set permissions
RUN mkdir -p /app/db && \
    chown -R 1001:root /app && \
    chmod -R 755 /app

# Copy only the bot binary and necessary files
COPY --from=builder /usr/src/rpg-club-app/target/release/rpg_club_bot /app/
COPY --from=builder /usr/src/rpg-club-app/rpg_club_db/db/init.sql /app/db/

WORKDIR /app

# Create non-root user
RUN useradd -r -u 1001 -g root bot
USER bot

ENV DISCORD_TOKEN=""
ENV DB_PATH=/app/db/rpg_club.db
ENV DB_CLUB_INIT_SCRIPT_PATH=/app/db/init.sql

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ps aux | grep rpg_club_bot || exit 1

CMD ["./rpg_club_bot"]
