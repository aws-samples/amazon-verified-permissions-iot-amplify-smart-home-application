import json
import boto3
import typing
import logging

# create the iot dataplane client
client = boto3.client('iot-data', region_name='us-east-1')

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def setTemperature(device_id, device_state) -> dict:
    """
    Function sets values on the IoT device by setting values on the device shadow
    
    Args:
        temp (_type_): _description_
        device_id (_type_): _description_
    """
    logger.info(f"Setting temperature to {device_state['temperature']} on device {device_id}")
    
    # set the temperature on the device shadow
    response = client.update_thing_shadow(
        thingName=device_id,
        payload=json.dumps({
            "state": {
                "desired": {
                    "temperature": device_state['temperature'],
                    "mode": device_state['mode'],
                    "power": device_state['power']
                }
            }
        })
    )
    shadow = json.loads(response['payload'].read())
    logger.info(f"Response from IoT Shadow {shadow}")
    reported_state = shadow['state']['reported']
    return reported_state
    
    

def getTemperature(device_id) -> dict:
    """
    Function takes device ID and gets all sensor details by 
    consulting AWS IoT Shadow

    Args:
        device_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    response = client.get_thing_shadow(
        thingName=device_id,
    )
    shadow = json.loads(response['payload'].read())
    reported_state = shadow['state']['reported']
    logger.info(f"Data coming from AWS IoT Shadow {shadow}")
    return reported_state
    

def handler(event, context) -> dict:
    
    device_id = event['queryStringParameters']['device_id']
    logger.info(f'received event: {event}')    
    
    return {
        
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('Hello from your new Amplify Python lambda!')
    }