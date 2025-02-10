import json

def say_hello(event, context):
    return {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Origin': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
        },
        'body': json.dumps({"message": "Hello World!"})
    }