import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import Cdk = require("../lib/stacks/vpc-stack");

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Cdk.VpcStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {}
      },
      MatchStyle.EXACT
    )
  );
});
