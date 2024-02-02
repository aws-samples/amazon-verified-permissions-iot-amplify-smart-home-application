import {
  VerifiedPermissions,
  VerifiedPermissionsClient,
  IsAuthorizedCommand,
} from "@aws-sdk/client-verifiedpermissions"; // ES Modules import
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const TABLE_NAME = "UserMappingTable-dev";
const REGION = "us-east-1";
const POLICY_STORE_ID = "P44TB9Z3rwaLp56D9WMJcP"; //process.env.POLICY_STORE_ID;

const dbClient = new DynamoDBClient({ region: REGION }); // Replace 'aws-region' with your AWS region

const client = new VerifiedPermissionsClient({ region: REGION });
const avp = new VerifiedPermissions(client);
const entity = (entityType, entityId) => ({
  entityType: `AwsIotAvpWebApp::${entityType}`,
  entityId: String(entityId),
});

const attributes = (args) => {
  const attrs = {};
  for (const [key, value] of Object.entries(args)) {
    attrs[key] = attributeValue(value);
  }
  return attrs;
};

const attributeValue = (value) => {
  if (typeof value === "string") {
    return { string: value };
  } else if (Array.isArray(value) || value instanceof Set) {
    return { set: Array.from(value).map(attributeValue) };
  } else if (typeof value === "object") {
    return { entityIdentifier: value };
  } else if (typeof value === "number") {
    return { long: value }; // 'long' or whatever key you use to represent long numbers
  } else {
    throw new Error(`Unknown attribute value type: ${typeof value}`);
  }
};

const permissionsCheck = async (avpPrincipal, action, resource) => {
  const args = {
    policyStoreId: POLICY_STORE_ID,
    principal: entity("User", avpPrincipal),
    action: { actionType: "AwsIotAvpWebApp::Action", actionId: action },
    resource: entity("Device", resource.deviceId),
  };

  console.log(`Resource: ${JSON.stringify(resource)}`);
  console.log(`Args: ${JSON.stringify(args)}`);

  //Get from the Db
  const device = await getItemById(resource.deviceId);
  console.log(`Device details from Db: ${JSON.stringify(device)}`);

  // Prepare the attributes object dynamically
  let dynamicAttributes = {
    primaryOwner: entity("User", device.primaryOwner),
  };

  // Initialize args.context with an empty contextMap
  args.context = { contextMap: {} };

  // Conditionally add desiredTemperature if it exists
  if (
    resource.state &&
    resource.state.desired &&
    resource.state.desired.temperature !== undefined
  ) {
    args.context.contextMap.desiredTemperature = {
      long: resource.state.desired.temperature,
    };
  }

  // Conditionally add time if it exists
  if (
    resource.state &&
    resource.state.desired &&
    resource.state.desired.time !== undefined
  ) {
    args.context.contextMap.time = { long: getElapsedMinutes(resource.state.desired.time) };
  }

  // Update args.entities
  args.entities = {
    entityList: [
      {
        identifier: entity("Device", resource.deviceId),
        attributes: attributes(dynamicAttributes),
      },
    ],
  };


  try {
    console.log(`Args before executing Verified Permissions: ${JSON.stringify(args)}`);
    const resp = await avp.isAuthorized(args);
    console.log(`Verified Permissions Output: ${JSON.stringify(resp)}`);
    return resp;
  } catch (error) {
    console.error("Error in permissionsCheck:", error);
    return false;
  }
};

function getElapsedMinutes(timeString) {
  // Extract hours and minutes from the time string
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');

  // Convert hours to numbers
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  // Convert to 24-hour format if PM
  if (modifier === 'PM' && hours !== 12) {
      hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
  }

  // Calculate total minutes from midnight
  return hours * 60 + minutes;
}

async function getItemById(id) {
  const params = {
    TableName: TABLE_NAME, // Replace with your table's name
    Key: {
      deviceId: { S: id }, // 'S' specifies the type to be a string; replace with 'N' for number, etc.
    },
  };

  try {
    const { Item } = await dbClient.send(new GetItemCommand(params));

    if (Item) {
      // Convert item from DynamoDB's format to a regular object
      const item = unmarshall(Item);
      return item;
    } else {
      return null;
    }
  } catch (err) {
    console.error(`An error occurred: ${err}`);
    return null;
  }
}

export { permissionsCheck, entity, attributes, attributeValue };
