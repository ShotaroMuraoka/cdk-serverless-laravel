import * as cdk from "aws-cdk-lib";
import { Template } from 'aws-cdk-lib/assertions';
import { BrefStack } from "../../lib/bref-stack";

describe('Networking VPC and Subnet', () => {
  let template: Template;
  beforeAll(() => {
    const app = new cdk.App();
    const stack: BrefStack = new BrefStack(app, 'BrefStack', {
      env: { region: "ap-northeast-1" },
    });
    template = Template.fromStack(stack);
  });

  test('Networking VPC and Subnet', () => {
    template.hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: "10.0.0.0/16",
    });
    template.hasResourceProperties('AWS::EC2::Subnet', {
      MapPublicIpOnLaunch: false,
    });
  });
});
