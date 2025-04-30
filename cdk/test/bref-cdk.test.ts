import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BrefStack } from "../lib/bref-stack";

describe('Bref Stack Tests', () => {
  test('Snapshot Tests', () => {
    const app = new cdk.App();
    const stack = new BrefStack(app, 'BrefStack', {
      env: {
        region: "ap-northeast-1",
      },
    },);

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
