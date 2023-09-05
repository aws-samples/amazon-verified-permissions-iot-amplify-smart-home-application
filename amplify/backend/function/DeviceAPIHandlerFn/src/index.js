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
async function setTemperature(deviceId, temperature, deviceMode, power) {
    console.log("setTemperature");
    // update device shadow
    const shadowUpdate = {
        state: {
            desired: {
                temperature,
                mode: deviceMode,
                power
            }
        }
    };
    const payload = new TextEncoder().encode(JSON.stringify(shadowUpdate));
    const command = new UpdateThingShadowCommand({
        thingName: deviceId,
        payload: payload
    });
    try {
        const response = await client.send(command);
        const updatedShadow = JSON.parse(new TextDecoder().decode(response.payload));
        console.log(updatedShadow);
    } catch (error) {
        console.error("Error updating shadow:", error);
    }
};

async function getTemperature(deviceId) {
    console.log("getTemperature");

    // get data from device shadow
    const command = new GetThingShadowCommand({thingName: deviceId});
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
    const body = JSON.parse(event.body);
    const action = body.action;

    let resp;
    if (action === "SetTemperature") {
        const temperature = body.temperature;
        const deviceMode = body.mode;
        const power = body.power;
        console.log(temperature);
        console.log(deviceMode);
        console.log(power);

        // check if user has permission to set the temperature
        // const permission = await permissionsCheck(decoded.payload.sub, deviceId, "write");
        // if (permission) {
        //     let resp = await setTemperature(deviceId, temperature, deviceMode, power);
        // }

        resp = await setTemperature(deviceId,);
    } else if (action === "GetTemperature") {
        resp = await getTemperature(deviceId);
    }

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