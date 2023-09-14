# AWS IoT AVP Dashboard Demo
This code accompanies the blog post "Leveraging Amazon Verified Permissions for managing authorization for AWS IoT Smart Thermostat applications".

## Description:
This is an AWS Amplify application that deploys a demo IoT device dashboard. The frontend for this application has been
built using React JS and the backed is hosted on AWS using AWS Amplify.

Amplify deploys the following resources through AWS CloudFormation:
* Two AWS Lambda functions
  * `DeviceAPIHandlerFn` - Lambda handler for API to interact with an IoT Device
  * `ItemsAPIHandlerFn` - Lambda handler for API to get devices information
* AWS Lambda Layer - `awsiotavpwebappAVPPermissionsLayer` that contains the common functions for Amazon Verified Permissions policy checks
* One Amazon API Gateway Rest API with two paths  
  * /control/{deviceId} - Make API calls to access an IoT Device
  * /items - Mak API calls to fetch data from 
* One Amazon DynamoDB Table - used for storing user to IoT device mapping 
* One Amazon Cognito User Pool for Authentication

## Deployment Instructions
[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=[https://github.com/username/repository](https://github.com/aws-samples/amazon-verified-permissions-iot-amplify-smart-home-application))

## Development
This frontend for this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts for local development

In the project directory, you can run the following commands to develop the react application locally

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Clean Up
Delete the CloudFormation stack on AWS console in the selected region. 

## Security
See CONTRIBUTING for more information.

## License
This library is licensed under the MIT-0 License. See the LICENSE file.
