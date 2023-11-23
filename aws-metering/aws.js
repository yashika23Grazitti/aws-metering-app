const axios = require('axios');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const accessKeyId = 'AKIASEL5QTLSGARKT5MM';
const secretAccessKey = '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';
const region = 'us-east-1';
const tableName = 'AWSMarketplaceMeteringRecordssep';

const dynamoDBClient = new DynamoDBClient({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
});

const getAccessToken = async () => {
  try {
    const response = await axios.post('https://pen285poc.searchunify.ai/oauth/token', {
      grant_type: 'password',
      username: 'ghost@searchunify.com',
      password: 'PocSEarchunify@345r654%3'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Q2NiODgzN2EyYWQyMTg5NTYzZDNmMTBlZTAzYmY4MTdmOlM4ZGIwY2NhNDVmMmVkNDJiZTkwMTJiYmZjZDkzMDM1Yw=='
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

const updateApiUsage = async (accessToken) => {
  try {
    const response = await axios.post('https://pen285poc.searchunify.ai/api/v2/api-logs/updatApiUsageInAws', {
      uid: 'd5f80fc2-77db-11ee-be67-0242ac12000a',
      to: '2023-11-01',
      from: '2023-11-01',
      internalUser: 'all'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Response 2:', JSON.stringify(response.data));
    console.log('API Response:', JSON.stringify(response.data.data.searchCount[0].count));
    return (response.data.data.searchCount[0].count?response.data.data.searchCount[0].count:0);//+response2.data.data.searches;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const insertItemToDynamoDB = async (item) => {
  try {
    const now = Date.now().toString();
    const item1 = {
  customerIdentifier: { S: "XGVTe9n4fQK"},
  quantity: {N: item.toString()},
  dimension: {S: "API Usage Per Hour"},
  create_timestamp: { N: now }
};

    const command = new PutItemCommand({
      TableName: tableName,
      Item: item1
    });

    const response = await dynamoDBClient.send(command);
    console.log('Item inserted successfully:', response);
  } catch (error) {
    console.error('Error inserting item:', error);
    throw error;
  }
};

const main = async () => {
  try {
    const accessToken = await getAccessToken();
    const apiResponse = await updateApiUsage(accessToken);//console.log("apiResponse",apiResponse.data.searchCount[0  ].sum); 
    
   await insertItemToDynamoDB(apiResponse);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
