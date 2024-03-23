# Challenge Solutions


This file contains the solutions for the offerred challenge in the blog post.

Scenario:

Customer `jane_doe` is the owner for device named `Thermostat2`. The policies created should be able to meet these three criteria:

1. Verify Jane Doe can perform all actions on Thermostat2.
2. John Doe cannot set temperature for the device between 4:00 PM and 6:00 PM and only if the temperature is between 68F and 72F
3. Power Company can only perform Get Temperature operation at all times.

## Policies

### Allow full access to principal

Note: this policy has already been implemented but is shown again

```
permit (principal, action, resource)
when { resource.primaryOwner == principal };
```

## Prevent a user from accessing device based on certain conditions

```
permit (
    principal == AwsIotAvpWebApp::User::"john_doe",
    action,
    resource == AwsIotAvpWebApp::Device::"Thermostat2"
)
when
{
    context.desiredTemperature >= 68 &&
    context.desiredTemperature <= 72 &&
    context.time <= 960 &&
    context.time >= 1080
};
```


### Allow Power Company to only GetTemperature

```
permit (
    principal == AwsIotAvpWebApp::User::"powercompany",
    action in [AwsIotAvpWebApp::Action::"GetTemperature"],
    resource == AwsIotAvpWebApp::Device::"Thermostat2"
)
when { true };
```