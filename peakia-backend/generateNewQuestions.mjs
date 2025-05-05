// Lambda 2: generateNewQuestions.js
import AWS from 'aws-sdk';
import {OpenAI} from "openai";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
    const topic = event.queryStringParameters.topic;

    const questions = await generateQuestionsFromAssistant(topic);
    console.log(questions)

    if (!questions.length) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "No questions generated." })
        };
    }

    const writes = questions.map((q) => ({
        PutRequest: {
            Item: {
                PK: `QUESTION#${q.id}`,
                SK: "METADATA",
                type: "Question",
                text: q.text,
                proposals: q.proposals,
                answers: q.answers,
                difficulty: q.difficulty,
                topics: q.topics,
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
        body: JSON.stringify({ success: true, count: questions.length }),
    };
};

async function generateQuestionsFromAssistant(topic) {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Generate 5 training questions related to: ${topic}`
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_aI6U2RiEbsuaFGwmOUNf3x6Z",
    });

    let runStatus;
    do {
        await new Promise((r) => setTimeout(r, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    } while (runStatus.status !== "completed" && runStatus.status !== "failed");

    if (runStatus.status === "failed") {
        console.error("Run failed:", runStatus);
        return [];
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const latest = messages.data.find(m => m.role === "assistant");

    if (!latest || !latest.content || !latest.content[0].text?.value) {
        console.error("No valid assistant message found:", messages);
        return [];
    }

    const raw = latest.content[0].text.value;
    try {
        const parsed = JSON.parse(raw);
        return parsed.questions || [];
    } catch (e) {
        console.error("JSON parsing error:", raw);
        return [];
    }
}
