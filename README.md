# AWS IoT Amazon Verified Permissions Dashboard Demo

This code accompanies the blog post "Leveraging Amazon Verified Permissions for managing authorization for AWS IoT Smart
Thermostat applications".

## Description:


> [!IMPORTANT]
> Deploying the Thermostat application in your AWS account will incur costs. When you are finished examining the example, follow the steps in the Clean Up section to delete the infrastructure and stop incurring charges.

This is an AWS Amplify application that deploys a demo IoT device dashboard. The frontend for this application has been
built using React JS and the backed is hosted on AWS using AWS Amplify.

Amplify deploys the following resources through AWS CloudFormation:

* Two AWS Lambda functions
    * `DeviceAPIHandlerFn` - Lambda handler for API to interact with an IoT Device
    * `ItemsAPIHandlerFn` - Lambda handler for API to get devices information
* AWS Lambda Layer - `awsiotavpwebappAVPPermissionsLayer` that contains the common functions for Amazon Verified
  Permissions policy checks
* One Amazon API Gateway Rest API with two paths
    * /control/{deviceId} - Make API calls to access an IoT Device
    * /items - Mak API calls to fetch data from
* One Amazon DynamoDB Table - used for storing user to IoT device mapping
* One Amazon Cognito User Pool for Authentication

## Deployment Instructions

This repository contains the source for the Amplify project we will use to deploy the dashboard in our AWS account. This
dashboard is the user-facing application that the manufacturer provides via a web or mobile interface. Through this
dashboard, you’ll be able to see how different API calls can be authorized for different personas. You’ll also be able
to tweak different variables like current time to see how different users can interact with different parts of the
dashboard.

> [!IMPORTANT]
> Please create the policies in Amazon Verified Permissions before proceeding to deployment.

Clone the repository by using this command:

`git clone https://github.com/aws-samples/amazon-verified-permissions-iot-amplify-smart-home-application.git`


## 1. Amplify Application Deployment

### Quick Deployment

To make deployment easier, we've provided you with a helper deployment script which will setup the Amplify application.

`Usage: ./deploy.sh <region> <Amazon Verified Permissions PolicyID>`

If you're using AWS profile as your authentication mechanism, please make sure the region provided to deploy.sh matches the default region of the profile. 



### Manual Deployment 

You don't need to follow this step if you're already using Quick Deployment

Next, navigate to the root of the project directory (also referred to as the parent directory) and execute the command
to initialize the Amplify application


`amplify init`

Follow the Amplify CLI instructions to give either an access token or choose relevant AWS profile to execute commands
against your AWS account. This is a good checkpoint to make sure we’re deploying in the region of our choice. For this
blog post we’re relying on us-east-2. No matter which region you end up choosing, we want to be consistent across all
services.

![amplify-init.png](images%2Famplify-init.png)

At this point we want to update all variables and makes sure our application knows where to go for the resources it needs. Update the following:
1. Navigate to `amplify/backend/function/awsiotavpwebappAVPPermissionsLayer/lib/nodejs/permissions.mjs` and update variables `POLICY_STORE_ID`. Also update `REGION` (if changed)
2. Navigate to `amplify/backend/function/ItemsAPIHandlerFn/src/index.js` and update variable `REGION` (if changed)
3. Navigate to `amplify/backend/function/DeviceAPIHandlerFn/src/index.js` and update variable `REGION` (if changed)

Once the initialization is complete, simply run

`amplify push`

This will provision the backed in the cloud and will publish the web hosting to Amazon CloudFront via AWS Amplify.
Notice that it warns us about IAM permissions on all resources, we’re doing that for this solution. For production
use-cases we highly recommend following the principle of least privileges as mentioned in our [security best
practices](https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_permissions_least_privileges.html).


Next, we need to install all the packages listed in package.json file. This will be as easy as running `npm install` in
the root directory. Once the packages are installed, we can just go to the next step to publish the frontend.

The frontend gets published to Amplify Hosting via a separate command

`amplify publish`

This will reveal the public hosting URL for the Amplify application

Executing amplify hosting status will also give the deployed URL for the application if we need it later.

At this point, we’re going to add all three users and their device mappings into our DynamoDB table. Navigate to the
root of your project and check users.json file which should have the following code in there. Notice the first key in
this JSON file is the name of the DynamoDB table we’re pushing this data to. Modify that based on changes you make to
your code. For the purpose of this demo, we’re naming our table UserMappingTable. Amplify adds the “dev” suffix based on
the Amplify environment we’re operating in. For more information on this topic consult this documentation

```json
{
  "UserMappingTable-dev": [
    {
      "PutRequest": {
        "Item": {
          "deviceId": {
            "S": "Thermostat1"
          },
          "primaryOwner": {
            "S": "john_doe"
          },
          "additionalUsers": {
            "SS": [
              "jane_doe",
              "powercompany"
            ]
          }
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "deviceId": {
            "S": "Thermostat2"
          },
          "primaryOwner": {
            "S": "jane_doe"
          },
          "additionalUsers": {
            "SS": [
              "powercompany"
            ]
          }
        }
      }
    }
  ]
}
```

Insert this data into your provisioned table by executing the following command in the root of your project directory.
This command assumes you have a default region set in your profile or environment variables.

`aws dynamodb batch-write-item --request-items file://users.json --region <region> `

In practice, this process will be automated through the invite and sign-up system. After a device owner claims a device,
they can invite a person to join their home or application and choose the role at invitation. So, when a new user clicks
on a link to sign-up their role information is supplied either through the URL or through an internal “invitation code
to role mapping table”. Upon sign-up and confirmation, a new record is created in the table which has a mapping of user
to device.

## 2. Setup API url in the .env file

Finally, once the provisioning process is complete, you’ll see the URL for the provisioned Rest API. Grab the Rest API endpoint
URL and go to the root directory of the project. Here, we’ll modify the .env file (create the .env file if it does not exist). Add
the URL of our Rest API to this file with the variable `REACT_APP_API_URI`. You can get this Rest API URL by issuing the command `amplify status`

![restapi-url.jpg](images%2Frestapi-url.jpg)

`REACT_APP_API_URI=https://<custom url here>.execute-api.us-east-2.amazonaws.com/dev`

The .env file will be at the same level as the package.json file and amplify directory.

Finally, after updating .env file, re-publish the REACT app

`amplify publish`


## 3. User management

At this point our application is published and provisioned in the cloud. We're now going to add users to our
application for which we've already created relationships in your DynamoDB table.

Navigate to the Amplify console in your chosen region. You should see the project is already published.

![amplify-apps.png](images%2Famplify-apps.png)

Click on the awsiotavpwebapp and navigate to the Backend environment and click lick on the button that says Set up
Amplify Studio

![amplify-backend.png](images%2Famplify-backend.png)

This will take you to the Amplify Studio Settings page as shown below. Enable Amplify Studio using the sliding button
from Off to On.

![amplify-studio.png](images%2Famplify-studio.png)

Note: You’ll see “Invite Users” on the same page after you turn on Studio. This screen lets you invite users to access
Amplify Studio. This is not where you add users for your application. We will do that in the next step.

Navigate back to the Backend environments as shown in the screenshot below. You’ll now see the highlighted button
“Launch Studio”. This will open a new tab/pop-up. (Check your browser pop-up preferences if a new window doesn’t open)

![launch-studio-button.png](images%2Flaunch-studio-button.png)

Next head to “User Management” as shown in the screenshot below. Here we’ll add three new users. This action for
creating three users - the device owner will have username “john_doe” and a unique email.

![amplify-user-management.png](images%2Famplify-user-management.png)

We'll add the following three users with the usernames.

| Resource    | Username     | 
|-------------|--------------|
| Thermostat1 | john_doe     |
| Thermostat1 | jane_doe     |
| Thermostat1 | powercompany |
| Thermostat2 | jane_doe     |
| Thermostat2 | powercompany |

Here's a screenshot showing how you can do that in the "User Management" section of the Amplify Dashboard

![create-user.png](images%2Fcreate-user.png)


## 4. Simulating IoT Device in a AWS Cloud 9 Environment

Once you've created an IoT device and have the connection kit (that includes the certificates and other quick start scripts), head to Cloud 9 and spin up a new environment. This environment will be used to simulate the IoT device. You can also choose to do this on your local machine. 

As we are creating AWS Cloud9 environment to represent a virtual IoT device: 

### Enter name of your environment, select New EC2 instance for Environment type and select t2.micro for instance type
![cloud-9-1](images%2Fcloud9-1.png)

### Select AWS Systems Manager as Network settings and click create
![cloud-9-2](images%2Fcloud9-2.png)

### Once the environment is ready, click on open
![cloud-9-3](images%2Fcloud9-3.png)


### Simulate the IoT device 
1. Upload connect_device_package.zip to your Cloud9 environment. Run the following commands in the Cloud9 CLI. 
2. unzip connect_device_package.zip
3. chmod +x start.sh
4. ./start.sh (to run the start script) 

![cloud-9-iot-1](images%2Fcloud9-iot-1.png)

This will start sending data to the AWS Iot Core service. This is a quick and easy way to test that your device is sending data via MQTT.


Once the start script runs, it starts to publish “Hello World!” message to sdk/test/python MQTT Topic. This is a successful test of communication.

We will now update the certificates of the IoT device to allow all Shadow operations. Head to the AWS IoT Core dashboard and select the IoT thing you've created under Manage > All Devices > Things. Head to the Certificates tab and click on the active certificate.

![iot-cert](images%2Fiot-cert.png)


Click on the policy and edit the version and update it in JSON format to reflect the following


```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:*",
      "Resource": "*"
    }
  ]
}
```

This policy will allow us broad permissions on the device. For the sake of showcasing the capability we are permitting all operations. In production, please scope down the policy as needed based on [this documentation](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policy-actions.html)

Once the policy is updated don't forget to mark the new policy version as active. This will now allow us to update the shadow for the device. 

We have already provided the code for the AWS IoT Shadow update in this repository. Move the file `shadow.py` from this respository into the cloned samples repository on the Cloud9 instance. The folder path is `aws-iot-device-sdk-python-v2/samples/shadow.py`. 

Now modify the start.sh script so that it can invoke the shadow.py script we just updated. Keep track of the endpoint already in the script as it is specific to your account.

```
python3 aws-iot-device-sdk-python-v2/samples/shadow.py --endpoint <use your existing endpoint in the script> --ca_file root-CA.crt --cert Thermostat1.cert.pem --key Thermostat1.private.key --thing_name Thermostat1 --shadow_property temperature
```

This will simulate the device which will respond once it receives a shadow update. When the device is started, the default temperature is set to 82. 


## Clean Up

Delete the CloudFormation stack created by Amplify and Cloud9 on AWS console in the selected region. 

## Security

See CONTRIBUTING for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
