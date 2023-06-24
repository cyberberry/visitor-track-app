const dynamodb = require('../common/Dynamo');
const { ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    };

    try {

        const { Items } = await dynamodb.send(new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME }));
        response.body = JSON.stringify({
            message: "Succesfully retrieved all visitors.",
            data: Items.map((item) => unmarshall(item)),
            rawData: Items,
        });

    }

    catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve all visitors.",
            errMesagge: e.message,
            errStack: e.stack,
        });

    }

    return response;
}