import json

def create_response(status_code, body, headers=None):

    default_headers = {
        'Access-Control-Allow-Origin': '*',  # Permite el acceso desde cualquier origen
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',  # Métodos permitidos
        'Content-Type': 'application/json',  # Tipo de contenido
    }

    if headers:
        default_headers.update(headers)

    return {
        'statusCode': status_code,
        'headers': default_headers,
        'body': json.dumps(body)
    }
