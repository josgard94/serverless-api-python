import json

from functions.utils.response import create_response


def say_hello(event, context):
    
    try:
        body = {
            "message": "Hello world!"
        }
        return create_response(200, body)
    except Exception as e:
        return create_response(500, {"message": str(e)})