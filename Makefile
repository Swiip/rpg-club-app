# Configuration
REGISTRY := ghcr.io
GITHUB_USER := swiip
PROJECT_NAME := rpg-club-app

IMAGE_NAME_BOT := rpg-club-app-bot
DOCKERFILE_BOT := docker/bot/Dockerfile

IMAGE_NAME_API := rpg-club-app-api
DOCKERFILE_API := docker/api/Dockerfile

# Get the short Git SHA for versioning
SOURCE_SHA := $(shell find . -type f \( -name '*.rs' -o -name 'Cargo.toml' -o -name 'Cargo.lock' \) -not -path "./target/*" -exec sha256sum {} \; | sort | sha256sum | cut -d' ' -f1 | cut -c1-8)

.PHONY: all check build docker clean

all: check build docker

check:
	@echo "🔍 Running checks..."
	cargo fmt --all -- --check
	cargo clippy -- -D warnings
	cargo test

build:
	@echo "🏗️  Building Rust project..."
	cargo build

docker-login:
	@echo "🔑 Logging into GitHub Container Registry..."
	@echo "Please make sure GITHUB_TOKEN is set in your environment"
	@docker login $(REGISTRY) -u $(GITHUB_USER) -p $(GITHUB_TOKEN)

# Docker related tasks
docker-setup:
	@echo "🐳 Setting up Docker buildx..."
	docker buildx inspect local-builder >/dev/null 2>&1 || \
		docker buildx create --name local-builder --use

# Build and push Docker image
docker: docker-setup
	@echo "🏗️  Building and pushing Docker image..."
	docker buildx build \
		--platform linux/arm64 \
		--progress plain \
		--tag $(REGISTRY)/$(GITHUB_USER)/$(IMAGE_NAME_BOT):latest \
		--tag $(REGISTRY)/$(GITHUB_USER)/$(IMAGE_NAME_BOT):$(SOURCE_SHA) \
		--label org.opencontainers.image.source=https://github.com/$(GITHUB_USER)/$(PROJECT_NAME) \
		--label org.opencontainers.image.description="RPG Club App Bot service" \
		--file $(DOCKERFILE_BOT) \
		--push \
		.
	docker buildx build \
		--platform linux/arm64 \
		--progress plain \
		--tag $(REGISTRY)/$(GITHUB_USER)/$(IMAGE_NAME_API):latest \
		--tag $(REGISTRY)/$(GITHUB_USER)/$(IMAGE_NAME_API):$(SOURCE_SHA) \
		--label org.opencontainers.image.source=https://github.com/$(GITHUB_USER)/$(PROJECT_NAME) \
		--label org.opencontainers.image.description="RPG Club App API service" \
		--file $(DOCKERFILE_API) \
		--push \
		.
