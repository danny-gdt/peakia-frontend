const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { userId, answers } = JSON.parse(event.body);

    const writes = answers.map((a) => ({
        PutRequest: {
            Item: {
                PK: `USER#${userId}`,
                SK: `ANSWER#${a.questionId}-${userId}`,
                type: "Answer",
                correct: a.correct,
                topics: a.topics,
                createdAt: new Date().toISOString(),
            },
        },
    }));

    await dynamoDb.batchWrite({
        RequestItems: {
            PeakIA: writes,
        },
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, count: answers.length }),
    };
};