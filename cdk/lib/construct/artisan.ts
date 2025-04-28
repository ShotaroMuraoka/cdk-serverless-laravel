import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as efs from "aws-cdk-lib/aws-efs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { packagePhpCode } from "@bref.sh/constructs";
import { ConsoleFunction } from "@bref.sh/constructs";
export interface ArtisanProps {
  vpc: ec2.IVpc;
  accessPoint: efs.IAccessPoint;
}

export class Artisan extends Construct {
  constructor(scope: Construct, id: string, props: ArtisanProps) {
    super(scope, id);

    new ConsoleFunction(this, "BrefConsoleFunction", {
      handler: "artisan",
      code: packagePhpCode("../laravel/", {
        exclude: ["tests/**", "var/**"],
      }),
      timeout: cdk.Duration.seconds(28),
      memorySize: 512,
      vpc: props.vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(
        props.accessPoint,
        "/mnt/efs",
      ),
      environment: {
        APP_ENV: "production",
        LOG_CHANNEL: "stderr",
        DB_CONNECTION: "sqlite",
        DB_DATABASE: "/mnt/efs/database.sqlite",
      },
      phpVersion: "8.4",
    });
  }
}
