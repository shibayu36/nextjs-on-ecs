#!/bin/bash

set -ex

export DOCKER_BUILDKIT=1

: ${REVISION:="$(git rev-parse --short HEAD)"}
: ${ECR_BASE:=648803025740.dkr.ecr.ap-northeast-1.amazonaws.com}

docker build --file Dockerfile.server --target nextjs-on-ecs-server --tag "nextjs-on-ecs-server:$REVISION" --progress plain .

$(aws ecr get-login --no-include-email --region ap-northeast-1)
docker tag "nextjs-on-ecs-server:$REVISION" "$ECR_BASE/nextjs-on-ecs-server:$REVISION"
docker push "$ECR_BASE/nextjs-on-ecs-server:$REVISION"
echo "$ECR_BASE/nextjs-on-ecs-server:$REVISION"
