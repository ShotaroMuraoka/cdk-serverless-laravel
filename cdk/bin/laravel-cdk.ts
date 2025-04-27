#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LaravelCdkStack } from "../lib/laravel-cdk-stack";

const app = new cdk.App();
new LaravelCdkStack(app, "LaravelCdkStack", {
  env: {
    region: "ap-northeast-1",
  },
});
