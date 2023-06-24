const { stringify } = require('uuid');
const getToken = require('../endpoints/getToken');
const tokenTableName = process.env.TOKENS_TABLE_NAME;
exports.handler = async event => {
    console.log('event', event);

    const tokenId =
        (event.headers &&
            (event.headers['X-Amz-Security-Token'] || event.headers['x-amz-security-token'])) ||
        event.authoizationToken;

    if (!tokenId) {
        console.log('could not find a token on the event');
        return generatePolicy({ allow: false });
    }
    try {
        const token = await getToken.get(tokenId, tokenTableName);

        if (token.tokenId !== tokenId) {
            console.log(`token is not correct`);
            return generatePolicy({ allow: false });
        }

        if (!token) {
            console.log(`no token for token ID of ${tokenId}`);
            return generatePolicy({ allow: false });
        }

        if (token.expiryDate && token.expiryDate < Date.now()) {
            console.log('after expiry date');
            return generatePolicy({ allow: false });
        }

        return generatePolicy({ allow: true });
    } catch (error) {
        console.log('error ', error);
        return generatePolicy({ allow: false });
    }
};

const generatePolicy = ({ allow }) => {
    return {
        principalId: 'token',
        policyDocument: {
            Version: '2012-10-17',
            Statement: {
                Action: 'execute-api:Invoke',
                Effect: allow ? 'Allow' : 'Deny',
                Resource: '*',
            },
        },
    };
};