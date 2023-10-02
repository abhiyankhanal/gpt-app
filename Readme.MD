# Lambda Function Documentation

## Overview

This Lambda function, implemented in TypeScript, is designed to generate reports by utilizing the GPT-3.5 Turbo model from OpenAI. It listens for HTTP POST requests on an API Gateway endpoint and triggers report generation based on the provided input prompt. The generated report is then stored in an Amazon S3 bucket. This documentation will explain how to set up and use this Lambda function.

## Prerequisites

Before deploying and using this Lambda function, ensure the following prerequisites are met:

1. **AWS Account**: You need an AWS account with appropriate permissions to create and manage Lambda functions, API Gateway, and S3 buckets.

2. **Environment Variables**: Certain environment variables must be set to configure and operate the Lambda function:

   - `CHAT_GPT_API_KEY`: An API key for OpenAI's GPT-3.5 Turbo model.
   - `S3_BUCKET_NAME`: The name of the Amazon S3 bucket where generated reports will be stored.

   Ensure that you've set these environment variables in your Lambda environment with the necessary values.

3. **Amazon S3 Bucket**: Create an Amazon S3 bucket where the generated reports will be stored. Make sure to configure appropriate permissions to allow the Lambda function to write to this bucket.

## Functionality

The Lambda function consists of two main files: `index.ts` and `controller.ts`.

### `index.ts`

- Imports the necessary AWS SDK and libraries.
- Defines an AWS S3 client, `s3`, used for interacting with the S3 bucket.
- Exports a Lambda handler function named `lambdaHandler`.

### `controller.ts`

- Imports the required AWS SDK, libraries, and dependencies.
- Defines the `generateReport` function, responsible for generating reports using the GPT-3.5 Turbo model.
- Implements the `createResponseWithCorsHeaders` function to add CORS headers to API responses.
- Contains a `createPdfReport` function for creating PDF reports based on GPT-3.5 Turbo model responses.

### Lambda Handler (`lambdaHandler`)

The `lambdaHandler` function is the entry point for this Lambda. It processes incoming API Gateway requests and responds as follows:

- For HTTP POST requests to the `/reports` endpoint, it triggers report generation using the GPT-3.5 Turbo model.
- For other requests, it returns a "Not Found" response.

## Amazon S3

Amazon S3 (Simple Storage Service) is a scalable object storage service provided by AWS. In this Lambda function, S3 is used to store the generated PDF reports. The `S3_BUCKET_NAME` environment variable specifies the target S3 bucket where reports will be uploaded.

## API Gateway

Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. In this Lambda function, API Gateway serves as the interface for triggering report generation by exposing an HTTP endpoint at `/reports`. When a POST request is made to this endpoint, the Lambda function is invoked.

## Usage

1. **Deploy the Lambda Function**: Deploy the Lambda function to your AWS account. Ensure that the necessary environment variables (`CHAT_GPT_API_KEY` and `S3_BUCKET_NAME`) are configured in your Lambda environment.

2. **Create an API Gateway**: Create an API Gateway and define an HTTP POST method at the `/reports` endpoint. Configure this method to invoke the Lambda function.

3. **Configure CORS**: Ensure that CORS (Cross-Origin Resource Sharing) settings are properly configured on your API Gateway to allow web applications to make requests to your API.

4. **Generate Reports**: To generate a report, make a POST request to the `/reports` endpoint with a JSON body containing a "prompt" field. The Lambda function will use the GPT-3.5 Turbo model to generate a report based on the provided prompt.

5. **Access Generated Reports**: The Lambda function will respond with a URL to the generated PDF report stored in the specified S3 bucket. You can access the reports via this URL.

## Conclusion

This Lambda function serves as a bridge between API Gateway, GPT-3.5 Turbo, and Amazon S3, allowing you to generate reports dynamically based on user prompts and store them in a secure and scalable manner. Make sure to configure the necessary environment variables and permissions to use it effectively in your AWS environment.