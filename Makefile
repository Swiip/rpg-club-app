# Configuration
REGISTRY := ghcr.io
GITHUB_USER := swiip
PROJECT_NAME := rpg-club-app
IMAGE_NAME := rpg-club-app-bot
DOCKERFILE := docker/bot/Dockerfile
CACHE_DIR := /tmp/.buildx-cache
BUILD_DATE := $(shell date +%Y%m%d-%H%M%S)

# Get the short Git SHA for versioning
GIT_SHA := $(shell git rev-parse --short HEAD)

.PHONY: all check build docker clean

all: check build docker

# Development checks
check:
	@echo "🔍 Running checks..."
	cargo fmt --all -- --check
	cargo clippy -- -D warnings
	cargo test

# Build the Rust project
build:
	@echo "🏗️  Building Rust project..."
	cargo build

# Docker related tasks
docker-setup:
	@echo "🐳 Setting up Docker buildx..."
	docker buildx inspect local-builder >/dev/null 2>&1 || \
		docker buildx create --name local-builder --use

docker-login:
	@echo "🔑 Logging into GitHub Container Registry..."
	@echo "Please make sure GITHUB_TOKEN is set in your environment"
	@docker login $(REGISTRY) -u $(GITHUB_USER) -p $(GITHUB_TOKEN)

# Build and push Docker image
docker: docker-setup
	@echo "🏗️  Building and pushing Docker image..."
	docker buildx build \
	    --progress plain \
		--platform linux/arm64 \
		--build-arg BUILD_DATE=$(BUILD_DATE) \
		--tag $(REGISTRY)/$(GITHUB_USER)/$(IMAGE_NAME):latest \
		--tag $(REGISTRY)/$(GITHUB_USER)/$(IMAGE_NAME):$(GIT_SHA) \
		--cache-from type=local,src=$(CACHE_DIR) \
		--cache-to type=local,dest=$(CACHE_DIR)-new,mode=max \
		--label org.opencontainers.image.source=https://github.com/$(GITHUB_USER)/$(PROJECT_NAME) \
		--label org.opencontainers.image.description="RPG Club App Bot service" \
		--file $(DOCKERFILE) \
		--no-cache-filter=builder \
		--push \
		.
	@rm -rf $(CACHE_DIR)
	@mv $(CACHE_DIR)-new $(CACHE_DIR)

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	cargo clean
	rm -rf $(CACHE_DIR) $(CACHE_DIR)-new
