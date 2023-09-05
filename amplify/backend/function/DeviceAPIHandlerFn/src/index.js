/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import * as jwt from 'jsonwebtoken';
import {IoTDataPlaneClient, UpdateThingShadowCommand, GetThingShadowCommand} from "@aws-sdk/client-iot-data-plane";
import {permissionsCheck} from '/opt/nodejs/permissions.mjs';  // This comes from custom code in the layer

const REGION = "us-east-2";
const client = new IoTDataPlaneClient({
    region: REGION,
});

// this function gets data from device shadow using the deviceId
const setTemperature = (deviceId, temperature, deviceMode, power) => {
    console.log("setTemperature");
    // update device shadow
    const input = { // UpdateThingShadowRequest
        thingName: deviceId, // required
        payload: JSON.stringify({
            "state": {
                "desired": {
                    "temperature": temperature,
                    "mode": deviceMode,
                    "power": power
                }
            }
        })
    };

    const command = new UpdateThingShadowCommand(input);
    client.send(command)
        .then(response => {
            response.json()
                .then(
                    res => {
                        return res;
                    }
                )
                .catch(e => {
                    console.log("Unable to decode JSON coming from Shadow Update call");
                })
        })
        .catch(e => console.log(e));
    // return data;
};

async function getTemperature(deviceId) {
    console.log("getTemperature");

    // get data from device shadow
    const command = new GetThingShadowCommand({ thingName: deviceId });
    try {
        const response = await client.send(command);
        const shadow = JSON.parse(new TextDecoder().decode(response.payload));  // Convert Uint8Array payload to string, then to JSON
        console.log(shadow);
    } catch (error) {
        console.error("Error fetching shadow:", error);
    }
}

export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    // get bearer token from event headers
    const token = event.headers.Authorization.split(' ')[1];
    console.log(`TOKEN: ${token}`);
    // decode jwt
    const decoded = jwt.decode(token, {complete: true});
    console.log(`DECODED: ${JSON.stringify(decoded)}`);
    // get deviceId from path parameters
    const deviceId = event.pathParameters.deviceId;
    // get action from post body
    const action = event.body.action;
    console.log(`ACTION: ${JSON.stringify(action)}`);
    console.log(deviceId);
    let resp = await getTemperature(deviceId);
    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(resp),
    };
};