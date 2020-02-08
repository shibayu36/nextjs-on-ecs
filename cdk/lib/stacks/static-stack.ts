import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";

export class StaticStack extends cdk.Stack {
  public readonly staticBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.staticBucket = new s3.Bucket(this, "nextjs-on-ecs-static-bucket", {
      bucketName: "nextjs-on-ecs-static-bucket",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
