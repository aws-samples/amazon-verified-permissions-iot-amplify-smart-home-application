import {VerifiedPermissions, VerifiedPermissionsClient, IsAuthorizedCommand} from "@aws-sdk/client-verifiedpermissions"; // ES Modules import
import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const TABLE_NAME = "UserMappingTable-dev";
const REGION = "us-east-1"

const dbClient = new DynamoDBClient({ region: REGION }); // Replace 'aws-region' with your AWS region

const POLICY_STORE_ID = "P44TB9Z3rwaLp56D9WMJcP" //process.env.POLICY_STORE_ID;
const client = new VerifiedPermissionsClient({ region: REGION });
const avp = new VerifiedPermissions(client);
const entity = (entityType, entityId) => ({
  entityType: entityType,
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
  if (typeof value === 'string') {
    return { string: value };
  } else if (Array.isArray(value) || value instanceof Set) {
    return { set: Array.from(value).map(attributeValue) };
  } else if (typeof value === 'object') {
    return { entityIdentifier: value };
  } else if (typeof value === 'number') {
    return { long: value }; // 'long' or whatever key you use to represent long numbers
  }  else {
    throw new Error(`Unknown attribute value type: ${typeof value}`);
  }
};

const permissionsCheck = async (avpPrincipal, action, resource) => {


  const args = {
    policyStoreId: POLICY_STORE_ID,
    principal: entity('User', avpPrincipal),
    action: { actionType: 'Action', actionId: action},
    resource: entity('Device', resource.deviceId),
  };

  console.log(`Args: ${JSON.stringify(args)}`);

  //Get from the Db
  const device = await getItemById(resource.deviceId);
  console.log(`Device details from Db: ${JSON.stringify(device)}`);

    // Prepare the attributes object dynamically
    let dynamicAttributes = {
        primaryOwner: entity('User', device.primaryOwner),
    };
    
    // Conditionally add desiredTemperature if it exists
    if (resource.state && resource.state.desired && resource.state.desired.temperature !== undefined) {
        dynamicAttributes.desiredTemperature = resource.state.desired.temperature;
    }
    
    // Update args.entities
    args.entities = {
        entityList: [
        {
            identifier: entity('Device', resource.deviceId),
            attributes: attributes(dynamicAttributes),
        },
        ],
    };
    

  try {
    const resp = await avp.isAuthorized(args);
    console.log(`Verified Permissions Output: ${JSON.stringify(resp)}`)
    return resp.decision;
  } catch (error) {
    console.error('Error in permissionsCheck:', error);
    return false;
  }
};

async function getItemById(id) {
  const params = {
    TableName: TABLE_NAME, // Replace with your table's name
    Key: {
        deviceId: { S: id },  // 'S' specifies the type to be a string; replace with 'N' for number, etc.
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
