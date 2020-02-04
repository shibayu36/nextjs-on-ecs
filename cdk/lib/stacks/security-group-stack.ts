import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

export interface SecurityGroupStackProps {
  readonly vpc: ec2.IVpc;
}
export class SecurityGroupStack extends cdk.Stack {
  public readonly nextServerAlbSg: ec2.SecurityGroup;
  public readonly nextServerEcsSg: ec2.SecurityGroup;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: SecurityGroupStackProps & cdk.StackProps
  ) {
    super(scope, id, props);

    // NextのサーバのコンテナにつながるALBのセキュリティグループ
    this.nextServerAlbSg = new ec2.SecurityGroup(this, "next-server-alb-sg", {
      vpc: props.vpc,
      securityGroupName: "next-server-alb-sg"
    });
    this.nextServerAlbSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    this.nextServerEcsSg = new ec2.SecurityGroup(this, "next-server-ecs-sg", {
      vpc: props.vpc,
      securityGroupName: "next-server-ecs-sg"
    });
    this.nextServerEcsSg.addIngressRule(
      ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
      ec2.Port.tcp(3000)
    );
  }
}
