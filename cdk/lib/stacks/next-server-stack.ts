import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import { Duration } from "@aws-cdk/core";

export interface NextServerStackProps {
  readonly vpc: ec2.IVpc;
  readonly nextServerAlbSg: ec2.SecurityGroup;
}

export class NextServerStack extends cdk.Stack {
  public readonly nextServerAlb: elb.IApplicationLoadBalancer;

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

    const targetGroup = new elb.ApplicationTargetGroup(
      this,
      "nextjs-on-ecs-server-target",
      {
        targetGroupName: "nextjs-on-ecs-server-target",
        targetType: elb.TargetType.IP,
        port: 80,
        vpc: props.vpc,
        healthCheck: {
          healthyThresholdCount: 5,
          interval: Duration.seconds(5),
          timeout: Duration.seconds(3)
        },
        deregistrationDelay: Duration.seconds(30)
      }
    );

    this.nextServerAlb = new elb.ApplicationLoadBalancer(
      this,
      "nextjs-on-ecs-server-alb",
      {
        loadBalancerName: "nextjs-on-ecs-server-alb",
        vpc: props.vpc,
        internetFacing: true,
        securityGroup: props.nextServerAlbSg
      }
    );
    const listener = this.nextServerAlb.addListener(
      "nextjs-on-ecs-server-alb-listener",
      {
        port: 80,
        open: true
      }
    );
    listener.addTargetGroups("nextjs-on-ecs-server-target-default", {
      targetGroups: [targetGroup]
    });
  }
}
