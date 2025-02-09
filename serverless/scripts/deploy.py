from subprocess import call
import os
import platform
import sys

isNt = True

if platform.system() == 'Linux' or platform.system() == 'Darwin':
    isNt = False

try:
    code = call(['serverless', 'deploy'], shell=isNt, cwd='.')

    if code > 0:
        raise Exception('Serverless error')

    services = next(os.walk('./services'))[1]

    for service in services:
        code = call(['serverless', 'deploy'], shell=isNt,
                    cwd=f'./services/{service}')
        if code > 0:
            raise Exception('Serverless error')
except Exception as err:
    print(err)
    sys.exit(1)
