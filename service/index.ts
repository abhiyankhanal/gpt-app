import { S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createResponseWithCorsHeaders, generateReport } from './controller';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const s3 = new S3Client({});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('lambda called');
    let response: Promise<APIGatewayProxyResult>;
    const notFound = {
        statusCode: 400,
        body: JSON.stringify({ message: 'The requested path is not available or not found' }),
    };

    const notFoundeResponse = notFound;

    //generate reports
    if (event.httpMethod === 'POST' && event.path === '/reports') {
        console.log('inside event');
        response = generateReport(event, s3);
        return response;
    }
    return createResponseWithCorsHeaders(notFoundeResponse);
};
