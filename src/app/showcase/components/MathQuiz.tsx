// components/MathQuiz.tsx
"use client";

import { useState, useEffect } from "react";
import { MathQuestion } from "./types/quiz";

interface MathQuizProps {
  questions: MathQuestion[];
}

export default function MathQuiz({ questions }: MathQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // Set timer when question changes
  useEffect(() => {
    if (showResults) return;

    setTimeLeft(currentQuestion.timeLimit);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  function handleAnswerSelection(answer: string) {
    setSelectedAnswer(answer);
  }

  function handleNextQuestion() {
    // Check if answer is correct
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  }

  function restartQuiz() {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  }

  function addLeadingZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  if (showResults) {
    return (
      <div className="max-w-md mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Results</h2>
        <p className="text-xl text-center mb-4">
          You scored {score} out of {questions.length}
        </p>
        <div className="text-center">
          <button
            onClick={restartQuiz}
            className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1}/{questions.length}
        </span>
        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
          Time: {addLeadingZero(timeLeft)}s
        </span>
      </div>

      <h2 className="text-xl font-bold mb-4 text-foreground">
        {currentQuestion.question}
      </h2>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelection(option)}
            className={`w-full text-left p-3 rounded-md border transition-colors ${
              selectedAnswer === option
                ? "bg-accent text-accent-foreground border-primary ring-2 ring-ring"
                : "border bg-background text-foreground hover:bg-accent/80 hover:text-accent-foreground"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNextQuestion}
        disabled={!selectedAnswer}
        className={`w-full py-2 rounded-md transition-colors ${
          selectedAnswer
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {currentQuestionIndex < questions.length - 1
          ? "Next Question"
          : "Finish Quiz"}
      </button>
    </div>
  );
}
