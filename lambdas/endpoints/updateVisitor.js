const dynamodb = require('../common/Dynamo');
const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    };

    try {
        const { name, surname } = JSON.parse(event.body);

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ visitorId: event.pathParameters.visitorId }),
            ExpressionAttributeNames: {
                '#n': 'name',
                '#s': 'surname',
            },
            ExpressionAttributeValues: marshall({ ':name': name, ':surname': surname }, { removeUndefinedValues: true }),
            UpdateExpression: 'SET #n = :name, #s = :surname',
            ReturnValues: 'ALL_NEW',
        };

        const updateResult = await dynamodb.send(new UpdateItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully updated the visitor.",
            updateResult,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update the visitor.",
            errMessage: e.message,
            errStack: e.stack,
        });
    }

    return response;
};
