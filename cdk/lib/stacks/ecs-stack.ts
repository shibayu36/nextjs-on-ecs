import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";

export interface EcsStackProps {
  readonly vpc: ec2.IVpc;
}

export class EcsStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: EcsStackProps & cdk.StackProps
  ) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, "MyCluster", {
      clusterName: "MyCluster",
      vpc: props.vpc
    });
  }
}
