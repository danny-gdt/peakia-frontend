import React, { useState } from 'react';
import type {Answer, Proposal, Question} from "~/interfaces/interfaces";
import {Button} from "~/components/ui/button";

export default function TrainingApp() {
  const [topic] = useState('SAA-C03');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedIds([]);
    setShowResult(false);
    setIsLastQuestion(false);
  }

  const fetchQuestions = async () => {
    const res = await fetch(`https://hgk0bvggme.execute-api.eu-west-3.amazonaws.com/dev/getQuestionsForUser?topic=${topic}`);
    const data = await res.json();
    setQuestions(data.questions);
    setCurrentIndex(0);
    setSelectedIds([]);
    setShowResult(false);
  };

  const submitAnswers = async () => {
    const res = await fetch(`https://hgk0bvggme.execute-api.eu-west-3.amazonaws.com/dev/submitAnswers`, {
      method: "POST",
      body: JSON.stringify(answers),
    });
    setQuestions([]);
  }

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x :number) => x !== id) : [...prev, id]
    );
  };

  const currentQuestion :Question = questions[currentIndex];
  const isCorrect = () => {
    const correct = currentQuestion.answers;
    return (
        selectedIds.length === correct.length &&
        selectedIds.every((id) => correct.includes(id))
    );
  };

  const saveQuestionResult = async () => {
    const currentAnswer: Answer = {
      userId: 1,
      questionId: currentIndex,
      correct: isCorrect(),
    }
    setShowResult(true);
    setAnswers([...answers, currentAnswer]);
    setIsLastQuestion(answers.length === questions.length);

    if(isLastQuestion) {
      await submitAnswers();
      resetQuiz();
    }
  }

  const changeQuestion = async () => {
    setCurrentIndex(currentIndex+1)
    setSelectedIds([]);
    setShowResult(false);
  }

  return (
      <div className="flex h-screen text-black bg-white">
        <div className="w-1/4 border-r p-4">
          <h2 className="text-xl font-semibold mb-4">Topics</h2>
          <div className="mb-4">{topic}</div>
          <Button onClick={fetchQuestions}>Start Training →</Button>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          {currentQuestion && (
              <div>
                <h2 className="text-lg font-bold mb-4">{currentQuestion.text}</h2>
                <ul className="mb-4 space-y-2">
                  {currentQuestion.proposals.map((p :Proposal) => (
                      <li
                          key={p.id}
                          className={`p-2 border rounded cursor-pointer ${
                              selectedIds.includes(p.id) ? 'bg-black text-white' : 'bg-white'
                          }`}
                          onClick={() => handleSelect(p.id)}
                      >
                        {p.text}
                      </li>
                  ))}
                </ul>
                {!showResult ? (
                    <Button onClick={async() => await saveQuestionResult()}>Validate</Button>
                    ) :(
                    <Button onClick={async() => changeQuestion()}>Next</Button>
                  )
                }
                {showResult && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-md mb-2">
                        {isCorrect() ? '✅ Correct' : '❌ Incorrect'}
                      </h3>
                      <ul className="space-y-2">
                        {currentQuestion.proposals.map((p) => (
                            <li key={p.id} className="text-sm">
                              <strong>{p.text}</strong>: {p.reason} {currentQuestion.answers.includes(p.id) ? '(Correct)' : ''}
                            </li>
                        ))}
                      </ul>
                    </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
}
