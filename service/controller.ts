import { S3Client, PutObjectCommandInput, PutObjectCommand } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import { Readable } from 'stream';
import { PDFDocument, rgb } from 'pdf-lib';

const CHAT_GPT_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateReport = async (event: APIGatewayProxyEvent, s3: S3Client): Promise<APIGatewayProxyResult> => {
    const client = axios.create({
        headers: {
            Authorization: 'Bearer ' + process.env?.CHAT_GPT_API_KEY,
        },
    });
    console.log('API Key here', process.env?.CHAT_GPT_API_KEY);

    try {
        console.log('Report generation lambda');
        const requestBody = JSON.parse(event.body || '');

        const params = {
            messages: [{ role: 'user', content: requestBody.prompt }],
            model: 'gpt-3.5-turbo',
        };

        let chatGPTResponse = '';

        await client.post(CHAT_GPT_API_URL, params).then((result) => {
            chatGPTResponse = result.data.choices[0].message.content;
            console.log('GPT response received', chatGPTResponse);
        });

        const pdfReport: Uint8Array = await createPdfReport(chatGPTResponse);

        const objectKey = `reports/${Date.now()}.pdf`;

        const s3Params: PutObjectCommandInput = {
            Bucket: process.env?.S3_BUCKET_NAME ?? 'sam-gpt-reports',
            Key: objectKey,
            Body: pdfReport,
        };
        await s3.send(new PutObjectCommand(s3Params));

        // Formulate the response with the S3 URL
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Report created successfully',
                reportUrl: `https://${process.env?.S3_BUCKET_NAME ?? 'sam-gpt-reports'}.s3.amazonaws.com/${objectKey}`,
            }),
        };

        return createResponseWithCorsHeaders(response);
    } catch (error) {
        console.error('Error generating report:', error);

        const errorResponse = {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error generating report' }),
        };

        return createResponseWithCorsHeaders(errorResponse);
    }
};

export const createResponseWithCorsHeaders = (response: APIGatewayProxyResult): Promise<APIGatewayProxyResult> => {
    return Promise.resolve({
        ...response,
        headers: {
            ...response.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        },
    });
};

const createPdfReport = async (chatGptResponse: string): Promise<Uint8Array> => {
    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        const fontSize = 12;

        // Add content to the PDF
        page.drawText(chatGptResponse, {
            x: 50,
            y: page.getHeight() - 50,
            size: fontSize,
            color: rgb(0, 0, 0), // Text color (black)
        });

        // Serialize the PDF to a buffer
        const pdfBytes = await pdfDoc.save();

        return pdfBytes;
    } catch (error) {
        console.error('Error creating PDF report:', error);
        throw error;
    }
};
