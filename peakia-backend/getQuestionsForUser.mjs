// Lambda 1: getQuestionsForUser.js
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const userId = event.queryStringParameters.userId;

    // Récupérer les dernières réponses pour ajuster la difficulté
    const answers = await dynamoDb.query({
        TableName: "PeakIA",
        KeyConditionExpression: "PK = :pk and begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":skPrefix": "ANSWER#",
        },
    }).promise();

    // Logique simple : si trop de bonnes réponses -> augmenter difficulté
    const correctRate = answers.Items.filter((a) => a.correct).length / answers.Items.length;
    const difficulty = correctRate > 0.9 ? "hard" : correctRate > 0.5 ? "medium" : "easy";

    // Récupérer les questions
    const questions = await dynamoDb.scan({
        TableName: "PeakIA",
        FilterExpression: "#type = :type AND difficulty = :difficulty",
        ExpressionAttributeNames: { "#type": "type" },
        ExpressionAttributeValues: {
            ":type": "Question",
            ":difficulty": difficulty,
        },
        Limit: 5,
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(questions.Items),
    };
};