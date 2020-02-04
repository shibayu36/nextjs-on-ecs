#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../lib/stacks/vpc-stack";
import { NextServerStack } from "../lib/stacks/next-server-stack";

const app = new cdk.App();
const vpcStack = new VpcStack(app, "VpcStack");
new NextServerStack(app, "NextServerStack", {
  vpc: vpcStack.vpc
});
