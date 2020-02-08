#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../lib/stacks/vpc-stack";
import { NextServerStack } from "../lib/stacks/next-server-stack";
import { SecurityGroupStack } from "../lib/stacks/security-group-stack";
import { StaticStack } from "../lib/stacks/static-stack";

const app = new cdk.App();
const vpcStack = new VpcStack(app, "VpcStack");
const securityGroupStack = new SecurityGroupStack(app, "SecurityGroupStack", {
  vpc: vpcStack.vpc
});
new NextServerStack(app, "NextServerStack", {
  vpc: vpcStack.vpc,
  nextServerAlbSg: securityGroupStack.nextServerAlbSg
});
new StaticStack(app, "StaticStack", {});
