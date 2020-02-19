# Next.js deployment sample using full CDN architecture (with CloudFront/S3/ECS/AWS CDK)

## Technologies

- AWS
- CloudFront
- S3
- ECR
- ECS
- AWS CDK

## Bootstrap

```
$ yarn workspace cdk run cdk bootstrap
$ yarn workspace cdk run cdk deploy VpcStack SecurityGroupStack RepositoryStack
$ ECR_BASE=<your ecr base> ./build-image-and-push.sh
$ yarn workspace cdk run cdk deploy --context application-version=$(git rev-parse --short HEAD) NextServerStack StaticStack
$ ECR_BASE=<your ecr base> ./deploy.sh
```

Then, visit your CloudFront URL.

## Deploy

```
$ export ECR_BASE=<your ecr base>; ./deploy.sh
```
