.PHONY: install run

SERVERLESS_ACCESS_KEY='YOUR SERVERLESS KEY HERE'

install:
	cd serverless && npm install serverless-offline --save-dev
	cd serverless && npm run configure

run:
	@echo "Running serverless offline"
	 
	cd serverless && export SERVERLESS_ACCESS_KEY=$(SERVERLESS_ACCESS_KEY) && npm run start