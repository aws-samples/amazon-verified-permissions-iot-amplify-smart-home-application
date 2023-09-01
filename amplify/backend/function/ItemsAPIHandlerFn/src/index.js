/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
import * as jwt from "jsonwebtoken";
import {IoTDataPlaneClient, UpdateThingShadowCommand, GetThingShadowCommand} from "@aws-sdk/client-iot-data-plane";
import {permissionsCheck} from '/opt/nodejs/permissions.mjs';  // This comes from custom code in the layer

const TABLE_NAME = "UserMappingTable-dev";
const REGION = "us-east-2"

// replace with your region
const dynamodbClient = new DynamoDBClient({region: REGION});

// pull data from dynamodb table
export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // get bearer token from event headers
    const token = event.headers.Authorization.split(' ')[1];
    console.log(`TOKEN: ${token}`);
    // decode jwt
    const decoded = jwt.decode(token, {complete: true});
    console.log(`DECODED: ${JSON.stringify(decoded)}`);
    // get deviceId from path parameters
    // const deviceId = event.pathParameters.deviceId;
    // get action from post body
    // const action = event.body.action;

    // get username from jwt
    const username = decoded.payload.username;
    console.log(`USERNAME: ${username}`);

    try {
        const params = {
            TableName: TABLE_NAME, // Replace with your table name
            ProjectionExpression: "deviceId, primaryOwner, additionalUsers",
        };

        const command = new ScanCommand(params);
        const response = await dynamodbClient.send(command);
        const items = response.Items;

        // Filter out devices where the username is either the primaryOwner or in the 'users' list.
        const filteredItems = items.filter(item => {
            const primaryOwner = item.primaryOwner.S;
            const additionalUsers = item.additionalUsers.SS;
            return primaryOwner === username || (additionalUsers && additionalUsers.includes(username));
        });

        // Extract 'deviceId's from the filtered items.
        const deviceInfo = filteredItems.map(item => ({
            deviceId: item.deviceId.S,
            primaryOwner: item.primaryOwner.S
        }));

        console.log("deviceInfo:")
        console.log(deviceInfo)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(deviceInfo),
        };
        // return deviceInfo;

    } catch (error) {
        console.error("An error occurred:", error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify([]),
        };
    }
};

