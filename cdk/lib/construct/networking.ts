import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface NetworkingProps {}

export class Networking extends Construct {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: NetworkingProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, "BrefVpc", {
      maxAzs: 1,
      natGateways: 0,
      restrictDefaultSecurityGroup: true,
      subnetConfiguration: [
        {
          name: "BrefPrivate",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }
}
