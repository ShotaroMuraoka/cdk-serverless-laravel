import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as efs from "aws-cdk-lib/aws-efs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { packagePhpCode, PhpFpmFunction } from "@bref.sh/constructs";

export interface BackendProps {
  vpc: ec2.IVpc;
  fileSystem: efs.FileSystem;
  accessPoint: efs.IAccessPoint;
}
export class Backend extends Construct {
  public readonly backendFn: PhpFpmFunction;
  public readonly api: apigwv2.HttpApi;
  constructor(scope: Construct, id: string, props: BackendProps) {
    super(scope, id);
    this.backendFn = new PhpFpmFunction(this, "BrefApiFunction", {
      handler: "public/index.php",
      code: packagePhpCode("../laravel/", {
        exclude: ["tests/**", "var/**"],
      }),
      timeout: cdk.Duration.seconds(28),
      memorySize: 1024,
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

    this.api = new apigwv2.HttpApi(this, "BrefHttpApi", {
      defaultIntegration: new integrations.HttpLambdaIntegration(
        "Integration",
        this.backendFn,
      ),
    });
  }
}
