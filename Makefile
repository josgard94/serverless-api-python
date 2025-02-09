.PHONY: install run

install:
	cd serverless && npm install serverless-offline --save-dev
	cd serverless && npm run configure

run:
	@echo "Running serverless offline"
	cd serverless && npm run start