

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


const jwt = require('jose');
// import iot data plane client from aws-sdk
const { IoTDataPlaneClient, UpdateThingShadowCommand, GetThingShadowCommand } = require("@aws-sdk/client-iot-data-plane");

const REGION = "us-east-2";
const IOTENDPOINT = "a2g7by657gx6jd-ats.iot.us-east-2.amazonaws.com"
const client = new IoTDataPlaneClient({ region: REGION });


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


const getTemperature = (deviceId) => {
    console.log("getTemperature");
    
    // get data from device shadow
    const input = {
        thingName: deviceId,
        payload: JSON.stringify({})
    }
    const command = new GetThingShadowCommand(input);
    client.send(command).then(response => {
        response.json()
            .then(
                res => {
                    console.log(res);
                    return res;
                }
            )
            .catch(e => {
                console.log("Unable to decode JSON coming from Shadow Read call");
            })
    
    }).catch(e => console.log(e));
    
}


exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    // get bearer token from event headers
    const token = event.headers.Authorization.split(' ')[1];
    console.log(`TOKEN: ${token}`);
    // decode jwt
    const decoded = jwt.decode(token, { complete: true });
    console.log(`DECODED: ${JSON.stringify(decoded)}`);
    // get deviceId from path parameters
    const deviceId = event.pathParameters.deviceId;
    // get action from post body
    const action = event.body.action;
    console.log(`ACTION: ${JSON.stringify(action)}`);

    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  },
        body: JSON.stringify('Hello from Lambda!'),
    };
};