#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../lib/stacks/vpc-stack";
import { NextServerStack } from "../lib/stacks/next-server-stack";
import { SecurityGroupStack } from "../lib/stacks/security-group-stack";
import { StaticStack } from "../lib/stacks/static-stack";
import { RepositoryStack } from "../lib/stacks/repository-stack";

const app = new cdk.App();

const applicationVersion = app.node.tryGetContext("application-version");
if (applicationVersion === undefined) {
  throw new Error(`no application-version found`);
}

const vpcStack = new VpcStack(app, "VpcStack");
const securityGroupStack = new SecurityGroupStack(app, "SecurityGroupStack", {
  vpc: vpcStack.vpc
});
const repositoryStack = new RepositoryStack(app, "RepositoryStack", {});
const nextServerStack = new NextServerStack(app, "NextServerStack", {
  vpc: vpcStack.vpc,
  nextServerAlbSg: securityGroupStack.nextServerAlbSg,
  nextServerEcsSg: securityGroupStack.nextServerEcsSg,
  nextServerRepository: repositoryStack.nextServerRepository,
  applicationVersion: applicationVersion
});
const staticStack = new StaticStack(app, "StaticStack", {
  nextServerAlb: nextServerStack.nextServerAlb
});
