const dynamodb = require('../common/Dynamo');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const getToken = {
  async get(tokenId, TableName) {
    const params = {
      TableName,
      Key: marshall({ tokenId }),
    };

    try {
      const data = await dynamodb.send(new GetItemCommand(params));

      if (!data || !data.Item) {
        throw Error(`There was an error fetching the data for tokenId of ${tokenId} from ${TableName}`);
      }

      const unmarshalledItem = unmarshall(data.Item);

      if (!unmarshalledItem || Object.keys(unmarshalledItem).length === 0) {
        throw Error(`The retrieved item for tokenId ${tokenId} from ${TableName} is empty or missing required properties`);
      }

      return unmarshalledItem;
    } catch (error) {
      console.log('Error retrieving item:', error);
      throw error;
    }
  },
};

module.exports = getToken;
