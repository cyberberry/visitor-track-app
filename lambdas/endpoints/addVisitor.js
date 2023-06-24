const dynamodb = require('../common/Dynamo');
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
moment.locale('uk');

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
        const visitorId = uuidv4();
        const time = moment.tz('Europe/Kiev').format('HH:mm:ss');

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall({ visitorId, name, surname, time }),

        };

        const addResult = await dynamodb.send(new PutItemCommand(params));

        response.body = JSON.stringify({
            message: "Succesfully added a visitor.",
            addResult,
        });

    }

    catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to add a visitor.",
            errMesagge: e.message,
            errStack: e.stack,
        });

    }

    return response;
}