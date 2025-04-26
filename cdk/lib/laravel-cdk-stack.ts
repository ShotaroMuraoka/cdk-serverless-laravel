import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { packagePhpCode, PhpFpmFunction, ConsoleFunction } from '@bref.sh/constructs';
import { EfsInitConstruct } from './construct/efs-init-construct';

export class LaravelCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'LaravelVpc', {
      maxAzs: 2,
      natGateways: 0,
        subnetConfiguration: [
            {
            name: 'LaravelPrivate',
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        ],
    });

    const fileSystem = new efs.FileSystem(this, 'LaravelEfs', {
      vpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
      throughputMode: efs.ThroughputMode.BURSTING,
    });

    const accessPoint = fileSystem.addAccessPoint('LaravelAccessPoint', {
      path: '/sqlite',
      createAcl: {
        ownerUid: '1000',
        ownerGid: '1000',
        permissions: '750',
      },
      posixUser: {
        uid: '1000',
        gid: '1000',
      },
    });

    const laravelFn = new PhpFpmFunction(this, 'LaravelFunction', {
      handler: 'public/index.php',
      code: packagePhpCode('../laravel/', {
        exclude: [
          'tests/**',
          'var/**',
        ],
      }),
      timeout: cdk.Duration.seconds(28),
      memorySize: 1024,
      vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/efs'),
      environment: {
        APP_ENV: 'production',
        APP_STORAGE: '/mnt/efs/storage',
        LOG_CHANNEL: 'stderr',
        DB_CONNECTION: 'sqlite',
        DB_DATABASE: '/mnt/efs/sqlite/database.sqlite',
      },
      phpVersion: "8.2",
    });

    const httpApi = new apigwv2.HttpApi(this, 'LaravelHttpApi', {
      defaultIntegration: new integrations.HttpLambdaIntegration(
        'Integration',
        laravelFn,
      ),
    });

    new ConsoleFunction(this, 'LaravelArtisanFunction', {
      handler: 'artisan',
      code: packagePhpCode('../laravel/', {
        exclude: [
          'tests/**',
          'var/**',
        ],
      }),
      timeout: cdk.Duration.seconds(28),
      memorySize: 512,
      vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/efs'),
      environment: {
          APP_ENV: 'production',
          APP_STORAGE: '/mnt/efs/storage',
          LOG_CHANNEL: 'stderr',
          DB_CONNECTION: 'sqlite',
          DB_DATABASE: '/mnt/efs/sqlite/database.sqlite',
      },
      phpVersion: "8.2",
    });

    new EfsInitConstruct(this, 'EfsInitConstruct', {
      accessPoint: accessPoint,
      vpc: vpc,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.url!,
    });
  }
}
