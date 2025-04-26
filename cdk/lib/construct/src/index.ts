import * as fs from 'fs';
import { Handler } from 'aws-cdk-lib/aws-lambda';
export interface ResourceProperties {
}

export const handler: Handler = async (event: any) => {
  console.log('Receive event: ', JSON.stringify(event));

  const properties: ResourceProperties = {};

  switch (event.RequestType) {
    case "Create":
      onCreate(properties);
      return {};
    case "Update":
      onUpdate(properties);
      return {};
    case "Delete":
      onDelete(properties);
      return {};
    default:
      throw new Error('Failed');
  }
}


function onCreate(
  props: ResourceProperties
): void {
  console.log('onCreate call');

  const dbPath = `/mnt/efs/sqlite/database.sqlite`;
  try {
    if (!fs.existsSync('/mnt/efs/sqlite')) {
      fs.mkdirSync('/mnt/efs/sqlite', { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '');
      console.log('Created database.sqlite');
    } else {
      console.log('database.sqlite already exists');
    }
  } catch (err) {
    console.error('Error initializing EFS: ', err);
  }
}

function onUpdate(
  props: ResourceProperties
): void {
  console.log('onUpdate called');
  return;
}

function onDelete(
  props: ResourceProperties
): void {
  console.log('onDelete called');
  return;
}
