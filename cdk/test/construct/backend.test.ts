import * as cdk from "aws-cdk-lib";
import { Template } from 'aws-cdk-lib/assertions';
import { BrefStack } from "../../lib/bref-stack";

describe('Backend Lambda and API Gateway', () => {
  let template: Template;
  beforeAll(() => {
    const app = new cdk.App();
    const stack: BrefStack = new BrefStack(app, 'BrefStack', {
      env: { region: "ap-northeast-1" },
    });
    template = Template.fromStack(stack);
  });

  test('Lambda Function properties', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: "public/index.php",
      MemorySize: 1024,
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

  test('API Gateway HTTP API', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      ProtocolType: "HTTP",
    });
  });
});
