import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";

export class RepositoryStack extends cdk.Stack {
  public readonly nextServerRepository: ecr.IRepository;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.nextServerRepository = new ecr.Repository(
      this,
      "nextjs-on-ecs-server-ecr",
      {
        repositoryName: "nextjs-on-ecs-server"
      }
    );
  }
}
