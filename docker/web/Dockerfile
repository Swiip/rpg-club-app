# Rust builder stage
FROM ghcr.io/swiip/rpg-club-app-rust-builder:latest AS rust-builder

# # Install necessary build dependencies
# RUN apt-get update && \
#     apt-get install -y pkg-config libssl-dev curl && \
#     rm -rf /var/lib/apt/lists/* && \
#     curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
#     apt-get install -y nodejs

# # Install pnpm
# RUN corepack enable && corepack prepare pnpm@latest --activate

# # Install wasm-pack
# RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# WORKDIR /app

# Copy all files
COPY . .

# Build types
RUN cd rpg_club_types && cargo build --release

# Build wasm core
RUN cd rpg_club_core && wasm-pack build --target web

# Build stage
FROM node:22-slim AS node-builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Copy Rust build from previous stage
COPY --from=rust-builder /usr/src/rpg-club-app/rpg_club_types/generated rpg_club_types/generated
COPY --from=rust-builder /usr/src/rpg-club-app/rpg_club_core/pkg rpg_club_core/pkg

RUN ls -la
RUN ls -la rpg_club_types
RUN ls -la rpg_club_core/pkg

# Build web app
RUN cd rpg_club_web && \
    pnpm install && \
    pnpm build

# Runtime stage
FROM node:22-slim

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built application
COPY --from=node-builder /app/rpg_club_web/package.json ./
COPY --from=node-builder /app/rpg_club_web/build ./build
COPY --from=node-builder /app/rpg_club_web/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Switch to non-root user
USER nodejs

EXPOSE 3000

CMD ["node", "build"]
