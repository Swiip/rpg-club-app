# Rust builder stage
FROM ghcr.io/swiip/rpg-club-app-rust-builder:latest AS rust-builder

WORKDIR /usr/src/rust-build

COPY . .

RUN cp -rf /usr/src/rust-builder/target /usr/src/rust-build/target

RUN cd rpg_club_types && cargo build --release

RUN cd rpg_club_core && wasm-pack build --target web

# Build stage
FROM node:22-slim AS node-builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/node-build

COPY . .

COPY --from=rust-builder /usr/src/rust-build/rpg_club_types/generated rpg_club_types/generated
COPY --from=rust-builder /usr/src/rust-build/rpg_club_core/pkg rpg_club_core/pkg


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
COPY --from=node-builder /usr/src/node-build/rpg_club_web/package.json ./
COPY --from=node-builder /usr/src/node-build/rpg_club_web/build ./build
COPY --from=node-builder /usr/src/node-build/rpg_club_web/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Switch to non-root user
USER nodejs

EXPOSE 3000

CMD ["node", "build"]
