export DOCKER_BUILDKIT=1

.PHONY: build
build:
	docker build --file Dockerfile.server --target nextjs-on-ecs-server --tag nextjs-on-ecs-server:latest --progress plain .
