# AWS IoT Amazon Verified Permissions Dashboard Demo

This code accompanies the blog post "Leveraging Amazon Verified Permissions for managing authorization for AWS IoT Smart
Thermostat applications".

## Description:

Note: You will need the policy store ID from Amazon Verified Permissions to successfully call the permissions function.
Please follow the instructions on the blog before attempting to deploy this dashboard.

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

Clone the repository by using this command:

`git clone https://github.com/aws-samples/amazon-verified-permissions-iot-amplify-smart-home-application.git`

Next, navigate to the root of the project directory (also referred to as the parent directory) and execute the command
to initialize the Amplify application

`amplify init`

Follow the Amplify CLI instructions to give either an access token or choose relevant AWS profile to execute commands
against your AWS account. This is a good checkpoint to make sure we’re deploying in the region of our choice. For this
blog post we’re relying on us-east-2. No matter which region you end up choosing, we want to be consistent across all
services.

![amplify-init.png](images%2Famplify-init.png)

Once the initialization is complete, simply run

`amplify push`

This will provision the backed in the cloud and will publish the web hosting to Amazon CloudFront via AWS Amplify.
Notice that it warns us about IAM permissions on all resources, we’re doing that for this solution. For production
use-cases we highly recommend following the principle of least privileges as mentioned in our [security best
practices](https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_permissions_least_privileges.html).

Once the provisioning process is complete. You’ll see the URL for the provisioned Rest API. Grab the Rest API endpoint
URL and go
to the root directory of the project. Here, we’ll modify the .env file (create the .env file if it does not exist). Add
the URL of our Rest API to this file with the variable `REACT_APP_API_URI`

![restapi-url.jpg](images%2Frestapi-url.jpg)

`REACT_APP_API_URI=https://<custom url here>.execute-api.us-east-2.amazonaws.com/dev`

The .env file will be at the same level as the package.json file and amplify directory

Next, we need to install all the packages listed in package.json file. This will be as easy as running `npm install` in
the root directory. Once the packages are installed, we can just go to the next step to publish the frontend.

The frontend gets published to Amplify Hosting via a separate command

`amplify publish`

This will reveal the public hosting URL for the Amplify application

Executing amplify hosting status will also give the deployed URL for the application if we need it later.

## User management

At this point our application is published and provisioned in the cloud. We're now going to add users to our
application.

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

We'll add the following three users with the usernames and add the mapping to our DynamoDB table.

| Resource    | Username     | 
|-------------|--------------|
| Thermostat1 | john_doe     |
| Thermostat1 | jane_doe     |
| Thermostat1 | powercompany |
| Thermostat2 | jane_doe     |
| Thermostat2 | powercompany |

Here's a screenshot showing how you can do that in the "User Management" section of the Amplify Dashboard

![create-user.png](images%2Fcreate-user.png)

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

`aws dynamodb batch-write-item --request-items file://users.json --region us-east-2 `

In practice, this process will be automated through the invite and sign-up system. After a device owner claims a device,
they can invite a person to join their home or application and choose the role at invitation. So, when a new user clicks
on a link to sign-up their role information is supplied either through the URL or through an internal “invitation code
to role mapping table”. Upon sign-up and confirmation, a new record is created in the table which has a mapping of user
to device.

## Clean Up

Delete the CloudFormation stack on AWS console in the selected region.

## Security

See CONTRIBUTING for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
