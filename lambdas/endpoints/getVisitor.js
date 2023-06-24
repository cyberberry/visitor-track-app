const dynamodb = require('../common/Dynamo');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

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

        const { Item } = await dynamodb.send(new GetItemCommand(params));
        console.log({ Item });
        response.body = JSON.stringify({
            message: "Succesfully retrieved a visitor.",
            data: (Item) ? unmarshall(Item) : {},
            rawData: (Item),
        });

    }

    catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get a visitor.",
            errMesagge: e.message,
            errStack: e.stack,
        });

    }

    return response;
}
