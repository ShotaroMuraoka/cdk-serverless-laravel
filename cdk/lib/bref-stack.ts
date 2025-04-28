import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import { Networking } from "./construct/networking";
import { Datastore } from "./construct/datastore";
import { Backend } from "./construct/backend";
import { Artisan } from "./construct/artisan";

export class BrefStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const networking = new Networking(this, "BrefNetworking", {});
    const datastore = new Datastore(this, "BrefDatastore", {
      vpc: networking.vpc,
    });
    const backend = new Backend(this, "BrefBackend", {
      vpc: networking.vpc,
      fileSystem: datastore.fileSystem,
      accessPoint: datastore.accessPoint,
    });

    new Artisan(this, "BrefConsole", {
      vpc: networking.vpc,
      accessPoint: datastore.accessPoint,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: backend.api.url!,
    });
  }
}
