import json
from functions.example.hello_world import say_hello
from functions.utils.response import create_response

def hello(event, context):
    try:

        return say_hello(event, context)
    except Exception as e:
        return create_response(500, {"message": str(e)})