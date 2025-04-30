import * as cdk from "aws-cdk-lib";
import { Template } from 'aws-cdk-lib/assertions';
import { BrefStack } from "../../lib/bref-stack";

describe('Artisan Console Lambda', () => {
  let template: Template;
  beforeAll(() => {
    const app = new cdk.App();
    const stack: BrefStack = new BrefStack(app, 'BrefStack', {
      env: { region: "ap-northeast-1" },
    });
    template = Template.fromStack(stack);
  });

  test('Console Lambda Function properties', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: "artisan",
      MemorySize: 512,
      Timeout: 28,
      Environment: {
        Variables: {
          APP_ENV: "production",
          LOG_CHANNEL: "stderr",
          DB_CONNECTION: "sqlite",
          DB_DATABASE: "/mnt/efs/database.sqlite",
        },
      },
    });
  });
});
