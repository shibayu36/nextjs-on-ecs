import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
  SynthUtils
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import Cdk = require("../../lib/stacks/vpc-stack");

test("Vpc Stack", () => {
  const app = new cdk.App();
  const stack = new Cdk.VpcStack(app, "MyTestVpcStack");
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
