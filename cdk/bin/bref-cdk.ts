#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BrefStack } from "../lib/bref-stack";

const app = new cdk.App();
new BrefStack(app, "BrefStack", {
  env: {
    region: "ap-northeast-1",
  },
});
