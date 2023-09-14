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

There are three steps to deploying this backend to Amplify easily:
1. Fork this repository and change the following variables in the code.
2. Navigate to Line #3 on `amplify/backend/function/DeviceAPIHandlerFn/src/permissions.js` where `POLICY_STORE_ID` has been defined and change the value to your own Policy Store ID as mentioned in the blog.
3. Update your repository name in this README.md file below: Replace the username/repository link with your own forked repository's link

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/username/repository)

## Development

This repository contains the source for the Amplify project we will use to deploy the dashboard in our AWS account. This dashboard is the user-facing application that the manufacturer provides via a web or mobile interface. Through this dashboard, you’ll be able to see how different API calls can be authorized for different personas. You’ll also be able to tweak different variables like current time to see how different users can interact with different parts of the dashboard. Let’s go ahead and set it up.

Clone the repository by using this command:

`git clone https://github.com/aws-samples/amazon-verified-permissions-iot-amplify-smart-home-application.git`

Next, navigate to the root of the project directory (also referred to as the parent directory) and execute the command to initialize the Amplify application

`amplify init`

Follow the Amplify CLI instructions to give either an access token or choose relevant AWS profile to execute commands against your AWS account. This is a good checkpoint to make sure we’re deploying in the region of our choice. For this blog post we’re relying on us-east-2. No matter which region you end up choosing, we want to be consistent across all services.

Once the initialization is complete, simply run 

`amplify push`

This will provision the backed in the cloud and will publish the web hosting to Amazon CloudFront via AWS Amplify. Notice that it warns us about IAM permissions on all resources, we’re doing that for this solution. As mentioned before, in production we highly recommend following the principle of least privilege as mentioned in our security best practices.

Here’s a screenshot of the what the output may look like on your deployment

![Screenshot1]([https://github.com/[username]/[reponame]/blob/[main]/images/screenshot1.png](https://github.com/aws-samples/amazon-verified-permissions-iot-amplify-smart-home-application/blob/main/images/screenshot1.png)?raw=true)

Figure 1: Sample AWS Amplify CLI output of project initialization and provisioning

![Screenshot1]([[https://github.com/[username]/[reponame]/blob/[main]/images/screenshot1.png](https://github.com/aws-samples/amazon-verified-permissions-iot-amplify-smart-home-application/blob/main/images/screenshot1.png](https://github.com/aws-samples/amazon-verified-permissions-iot-amplify-smart-home-application/blob/main/images/screenshot2.png))?raw=true)

Figure 2: 


Once the provisioning process is complete. You’ll see the URL for the provisioned Rest API. Grab the Rest API URL and go to the root directory of the project. Here, we’ll modify the .env file (create the .env file if it doesn’t exist). Add the URL of our Rest API to this file with the variable `REACT_APP_API_URI`

`REACT_APP_API_URI=https://jqtd5xwfvf.execute-api.us-east-2.amazonaws.com/dev`

The .env file will be at the same level as the package.json file and amplify directory

Next, we need to install all the packages listed in package.json file. This will be as easy as running npm install in the root directory. Once the packages are installed, we can just go to the next step to publish the frontend.

The frontend gets published to Amplify Hosting via a separate command 

`amplify publish`

This will reveal the public hosting URL for the Amplify application

 Figure 3: AWS Amplify application deployment completion

Executing amplify hosting status will also give the deployed URL for the application if we need it later.


![Screenshot1](https://github.com/[username]/[reponame]/blob/[main]/images/screenshot2.png?raw=true)


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
