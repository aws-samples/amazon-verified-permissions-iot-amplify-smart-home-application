export type AmplifyDependentResourcesAttributes = {
  "api": {
    "awsiotavpapi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "awsiotavpauth": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "DeviceAPIHandlerFn": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "ItemsAPIHandlerFn": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "awsiotavpwebappAVPPermissionsLayer": {
      "Arn": "string"
    }
  },
  "storage": {
    "AWSIoTAVPDb": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "StreamArn": "string"
    }
  }
}