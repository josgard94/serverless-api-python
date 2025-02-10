import json
from example.hello_world import say_hello

def hello(event, context):
    try:
        return say_hello(event, context)
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                'Access-Control-Allow-Origin': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            },
            'body': json.dumps({"message": str(e)})
        }