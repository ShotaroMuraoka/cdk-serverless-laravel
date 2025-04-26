import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as nodejsLambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from "aws-cdk-lib/custom-resources";
import * as path from 'path';

export interface EfsInitConstructProps {
  accessPoint: cdk.aws_efs.AccessPoint;
  vpc: Vpc;
}

export class EfsInitConstruct extends Construct {
  constructor(scope: Construct, id: string, props: EfsInitConstructProps) {
    super(scope, id);

    const lambdaFunction = new nodejsLambda.NodejsFunction(
      this,
      'OnEventHandler',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, './src/index.ts'),
        handler: 'handler',
        vpc: props.vpc,
        filesystem: lambda.FileSystem.fromEfsAccessPoint(props.accessPoint, '/mnt/efs'),
      },
    );

    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['elasticfilesystem:ClientMount', 'elasticfilesystem:ClientWrite'],
      resources: ['*'],
    }));

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: lambdaFunction,
    });

    new cdk.CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      properties: {
        accessPointId: props.accessPoint.accessPointId,
        vpcId: props.vpc.vpcId,
      },
    });
  }
}
