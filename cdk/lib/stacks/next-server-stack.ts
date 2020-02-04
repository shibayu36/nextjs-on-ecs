import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";

export interface NextServerStackProps {
  readonly vpc: ec2.IVpc;
}

export class NextServerStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: NextServerStackProps & cdk.StackProps
  ) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, "nextjs-on-ecs-cluster", {
      clusterName: "nextjs-on-ecs-cluster",
      vpc: props.vpc
    });

    const repository = new ecr.Repository(this, "nextjs-on-ecs-server-ecr", {
      repositoryName: "nextjs-on-ecs-server"
    });
  }
}
