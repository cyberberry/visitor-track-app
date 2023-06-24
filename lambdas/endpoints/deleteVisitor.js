const dynamodb = require('../common/Dynamo');
const { DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
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
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ visitorId: event.pathParameters.visitorId }),
        };

        const deleteResult = await dynamodb.send(new DeleteItemCommand(params));
        response.body = JSON.stringify({
            message: "Succesfully deleted a visitor.",
            deleteResult,
        });

    }

    catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete a visitor.",
            errMesagge: e.message,
            errStack: e.stack,
        });

    }

    return response;
}