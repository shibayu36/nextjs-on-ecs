#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../lib/stacks/vpc-stack";
import { EcsStack } from "../lib/stacks/ecs-stack";

const app = new cdk.App();
const vpcStack = new VpcStack(app, "VpcStack");
new EcsStack(app, "EcsStack", {
  vpc: vpcStack.vpc
});
