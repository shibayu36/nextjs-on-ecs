import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ecr from "@aws-cdk/aws-ecr";
import * as logs from "@aws-cdk/aws-logs";
import { Duration } from "@aws-cdk/core";

export interface NextServerStackProps {
  readonly vpc: ec2.IVpc;
  readonly nextServerAlbSg: ec2.ISecurityGroup;
  readonly nextServerEcsSg: ec2.ISecurityGroup;
  readonly nextServerRepository: ecr.IRepository;
  readonly applicationVersion: string;
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

    const nextServerLogGroup = new logs.LogGroup(
      this,
      "nextjs-on-ecs-server-log-group",
      {
        logGroupName: "nextjs-on-ecs-server-log-group"
      }
    );

    const nextServerTaskDef = new ecs.FargateTaskDefinition(
      this,
      "nextjs-on-ecs-server-taskdef",
      {
        family: "nextjs-on-ecs-server-taskdef"
      }
    );
    const nextServerContainer = nextServerTaskDef.addContainer(
      "nextjs-on-ecs-server-container",
      {
        image: ecs.ContainerImage.fromEcrRepository(
          props.nextServerRepository,
          props.applicationVersion
        ),
        logging: new ecs.AwsLogDriver({
          logGroup: nextServerLogGroup,
          streamPrefix: "server"
        })
      }
    );
    nextServerContainer.addPortMappings({
      containerPort: 3000
    });

    const nextServerService = new ecs.FargateService(
      this,
      "nextjs-on-ecs-server-service",
      {
        serviceName: "nextjs-on-ecs-server-service",
        cluster: cluster,
        taskDefinition: nextServerTaskDef,
        desiredCount: 1,
        securityGroup: props.nextServerEcsSg,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC
        },
        assignPublicIp: true
      }
    );

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
    targetGroup.addTarget(nextServerService);

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
