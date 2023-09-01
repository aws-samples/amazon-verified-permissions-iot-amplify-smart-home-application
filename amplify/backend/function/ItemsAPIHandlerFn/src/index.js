

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

// use dynamodb client
// import aws-sdk
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// create a DDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// pull data from dynamodb table

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
    // create params object
    const params = {
        TableName: 'devices',
        Key: {
            deviceId: deviceId
            // userId: decoded.payload.sub
        }
    }
    // get item from dynamodb
    // get item from table
    const result = await dynamodb.get(params).promise();
    console.log(`RESULT: ${JSON.stringify(result)}`);
    
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
