#!/bin/bash

set -e

export DOCKER_BUILDKIT=1

rm -rf ./dist/
mkdir ./dist/

REVISION="$(git rev-parse --short HEAD)"

docker build --file Dockerfile.server --target nextjs-on-ecs-server --tag "nextjs-on-ecs-server:$REVISION" --progress plain .

$(aws ecr get-login --no-include-email --region ap-northeast-1)
docker tag "nextjs-on-ecs-server:$REVISION" "648803025740.dkr.ecr.ap-northeast-1.amazonaws.com/nextjs-on-ecs-server:$REVISION"
docker push "648803025740.dkr.ecr.ap-northeast-1.amazonaws.com/nextjs-on-ecs-server:$REVISION"
echo "648803025740.dkr.ecr.ap-northeast-1.amazonaws.com/nextjs-on-ecs-server:$REVISION"

CONTAINER_ID="$(docker create "nextjs-on-ecs-server:$REVISION")"
docker cp ${CONTAINER_ID}:/app/.next ./dist/
docker rm -v ${CONTAINER_ID}
