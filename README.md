# Peak-IA

Peak-IA is a personal project designed to deepen my understanding of AWS services through hands-on application. It simulates a personalized question trainer (like a study assistant) that adapts to user performance, using a serverless architecture.

---

## 🎯 Project Goals

- Practice and strengthen my skills with **AWS Lambda**, **API Gateway**, **S3**, and **DynamoDB**
- Understand and apply **serverless architecture** concepts
- Explore **user-personalized logic** and difficulty adaptation using DynamoDB
- Prepare the groundwork for scalable, event-driven systems

---

## 🧠 Reflections & Decisions

### Why Serverless?
From the beginning, I wanted to avoid managing servers and focus purely on cloud-native design. AWS Lambda was an obvious choice, paired with API Gateway for exposing endpoints.

### Why DynamoDB?
Speed and scalability were essential. I wanted to experiment with NoSQL design patterns, especially the **single-table design** using `PK` and `SK` for flexible querying.

### Frontend Stack
A lightweight React frontend was used, calling AWS Lambda functions directly via API Gateway endpoints. CORS issues taught me a lot about configuring APIs properly and safely.

### Authentication
While not implemented yet, the architecture is prepared for integration with **Amazon Cognito**, enabling secure user tracking.

---

## 🧱 Tech Stack

| Layer         | Tech                             |
|--------------|----------------------------------|
| Frontend      | React (Vite)                     |
| Backend       | AWS Lambda (Node.js)             |
| API Gateway   | REST API endpoints               |
| Database      | Amazon DynamoDB (single-table)   |
| Storage       | Amazon S3 (for static files)     |

---

## 🧪 Features

- ✅ Generate questions for a user based on a topic
- ✅ Store user answers and compute their correctness
- ✅ Adjust difficulty based on performance
- 🚧 Admin panel for uploading question datasets (soon)
- 🚧 Authentication and user sessions (coming)

---

## 💡 How It Works

1. **Question Retrieval**:
    - The frontend calls `/getQuestionsForUser?topic=...`
    - Lambda fetches questions from DynamoDB or S3 and returns them
2. **User Answer Tracking**:
    - Answers are POSTed to a Lambda endpoint, stored with a timestamp and a correctness flag
    - A basic correct-answer ratio adjusts the difficulty dynamically
3. **Frontend UI**:
    - Simple interface built in React, calls endpoints directly
    - Reset logic, topic selection, and answer state are handled via `useState` and `useEffect`

---

## 📚 Learning Outcomes

- ✅ Mastered deploying and debugging AWS Lambda functions
- ✅ Worked with API Gateway integrations and CORS configurations
- ✅ Built a practical single-table DynamoDB model
- ✅ Improved confidence working with IAM permissions and AWS service roles
- ✅ Understood the lifecycle of serverless API requests

---

## 🔜 Next Steps

- [ ] Add authentication with Cognito
- [ ] Store user progression in a more detailed model
- [ ] Implement question difficulty curves and tagging
- [ ] Cleanly deploy with AWS CDK or Terraform
- [ ] Add retry logic and better error handling

---

## 🧑‍💻 Author

Built by Danny Godet as a personal initiative to master AWS by building something useful and real.

---
---

## 📄 License

MIT License
