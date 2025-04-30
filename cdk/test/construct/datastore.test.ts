import * as cdk from "aws-cdk-lib";
import { Template } from 'aws-cdk-lib/assertions';
import { BrefStack } from "../../lib/bref-stack";

describe('Datastore EFS FileSystem and AccessPoint', () => {
  let template: Template;
  beforeAll(() => {
    const app = new cdk.App();
    const stack: BrefStack = new BrefStack(app, 'BrefStack', {
      env: { region: "ap-northeast-1" },
    });
    template = Template.fromStack(stack);
  });

  test('EFS FileSystem properties', () => {
    template.hasResourceProperties('AWS::EFS::FileSystem', {
      PerformanceMode: "generalPurpose",
      ThroughputMode: "bursting",
    });
  });

  test('EFS AccessPoint properties', () => {
    template.hasResourceProperties('AWS::EFS::AccessPoint', {
      PosixUser: {
        Uid: "1001",
        Gid: "1001",
      },
      RootDirectory: {
        CreationInfo: {
          OwnerUid: "1001",
          OwnerGid: "1001",
          Permissions: "750",
        },
        Path: "/bref",
      },
    });
  });
});
