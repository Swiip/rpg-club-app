# Builder stage
FROM ghcr.io/swiip/rpg-club-app-rust-builder:latest AS builder

COPY . .

RUN cargo build --release --bin rpg_club_api

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y libssl-dev sqlite3 procps && \
    rm -rf /var/lib/apt/lists/*

# Create directory for database and set permissions
RUN mkdir -p /app/db && \
    chown -R 1001:root /app && \
    chmod -R 755 /app

# Copy only the bot binary and necessary files
COPY --from=builder /usr/src/rust-builder/target/release/rpg_club_api /app/
COPY --from=builder /usr/src/rust-builder/rpg_club_db/db/init.sql /app/db/

RUN chown -R 1001:root /app/db && \
    chown 1001:root /app/db/init.sql && \
    chmod 644 /app/db/init.sql

WORKDIR /app

# Create non-root user
RUN useradd -r -u 1001 -g root api
USER api

ENV DISCORD_TOKEN=""
ENV DB_PATH=/app/db/rpg_club.db
ENV DB_INIT_SCRIPT_PATH=/app/db/init.sql

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ps aux | grep rpg_club_api || exit 1

CMD ["./rpg_club_api"]
