import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as efs from "aws-cdk-lib/aws-efs";

export interface DatastoreProps {
  vpc: ec2.IVpc;
}

export class Datastore extends Construct {
  public readonly fileSystem: efs.FileSystem;
  public readonly accessPoint: efs.IAccessPoint;

  constructor(scope: Construct, id: string, props: DatastoreProps) {
    super(scope, id);

    this.fileSystem = new efs.FileSystem(this, "BrefEfs", {
      vpc: props.vpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
      throughputMode: efs.ThroughputMode.BURSTING,
      oneZone: true,
    });

    this.accessPoint = this.fileSystem.addAccessPoint("BrefAccessPoint", {
      path: "/bref",
      createAcl: {
        ownerUid: "1001",
        ownerGid: "1001",
        permissions: "750",
      },
      posixUser: {
        uid: "1001",
        gid: "1001",
      },
    });
  }
}
