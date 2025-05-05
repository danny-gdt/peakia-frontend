// Lambda 1: getQuestionsForUser.js
exports.handler = async (event) => {
    const AWS = require("aws-sdk");
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    console.log("event", event);
    const userId = event.userId;

    // Récupérer les dernières réponses pour ajuster la difficulté
    const answers = await dynamoDb.query({
        TableName: "PeakIA",
        KeyConditionExpression: "PK = :pk and begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#user-${userId}`,
            ":skPrefix": "ANSWER#",
        },
    }).promise();

    // Logique simple : si trop de bonnes réponses -> augmenter difficulté
    // const correctRate = answers.Items.filter((a) => a.correct).length / answers.Items.length;
    const questions = await dynamoDb.scan({
        TableName: "PeakIA",
        FilterExpression: "#type = :type",
        ExpressionAttributeNames: { "#type": "type" },
        ExpressionAttributeValues: {
            ":type": "Question",
        },
        Limit: 5,
    }).promise();

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        },
        body: JSON.stringify({"questions" :questions.Items}),
    };
};