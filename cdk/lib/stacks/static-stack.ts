import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import { Duration } from "@aws-cdk/core";

interface StaticStackProps {
  nextServerAlb: elb.IApplicationLoadBalancer;
}
export class StaticStack extends cdk.Stack {
  public readonly staticBucket: s3.Bucket;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & StaticStackProps
  ) {
    super(scope, id, props);

    this.staticBucket = new s3.Bucket(this, "nextjs-on-ecs-static-bucket", {
      bucketName: "nextjs-on-ecs-static-bucket",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // CloudFront で設定する オリジンアクセスアイデンティティ を作成する
    const oai = new cloudfront.OriginAccessIdentity(
      this,
      "nextjs-on-ecs-cloudfront-oai",
      {
        comment: "s3 access."
      }
    );

    // CloudFront -> staticBucketへのアクセス許可
    this.staticBucket.grantRead(oai);

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "nextjs-on-ecs-cloudfront",
      {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: this.staticBucket,
              originAccessIdentity: oai
            },
            behaviors: [
              {
                pathPattern: "/_next/static/*",
                compress: true
              }
            ]
          },
          {
            customOriginSource: {
              domainName: props.nextServerAlb.loadBalancerDnsName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
                forwardedValues: {
                  queryString: true,
                  cookies: {
                    forward: "all"
                  }
                },
                maxTtl: Duration.seconds(0),
                minTtl: Duration.seconds(0),
                defaultTtl: Duration.seconds(0)
              }
            ]
          }
        ]
      }
    );
  }
}
