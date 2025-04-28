// components/MathQuiz.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MathQuestion } from "./types/quiz"; // Adjust import path if needed
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui Progress
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming shadcn/ui Card
import { CheckCircle, XCircle, TimerIcon, RotateCcw } from "lucide-react"; // Using lucide-react for icons

interface MathQuizProps {
  questions: MathQuestion[];
  onQuizComplete?: (score: number, totalQuestions: number) => void; // Optional callback
}

// Animation variants
const questionVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const resultsVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export default function MathQuiz({ questions, onQuizComplete }: MathQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // --- Core Logic for Processing Answer and Advancing ---
  const processAnswerAndAdvance = useCallback(
    (answer: string | null) => {
      // Guard against running multiple times
      if (isAnswerRevealed) return;

      setIsAnswerRevealed(true);
      let isCorrect = false;
      // Only score if an answer was actually selected (not a timeout)
      if (answer !== null && answer === currentQuestion.correctAnswer) {
        setScore((prevScore) => prevScore + 1);
        isCorrect = true;
      }

      // Wait a bit to show feedback before moving on
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          // Reset state for the next question *after* advancing index
          // setSelectedAnswer(null); // Reset happens in useEffect
          // setIsAnswerRevealed(false); // Reset happens in useEffect
        } else {
          setShowResults(true);
          if (onQuizComplete) {
            // Pass final score (use state directly or recalculate based on last answer)
            const finalScore = isCorrect ? score + 1 : score; // Check if last answer was correct
            onQuizComplete(finalScore, totalQuestions);
          }
        }
      }, 1200); // Delay for showing feedback
    },
    [
      currentQuestionIndex,
      currentQuestion,
      totalQuestions,
      isAnswerRevealed,
      onQuizComplete,
      score,
    ]
  );

  // --- Timer Logic ---
  useEffect(() => {
    if (showResults || !currentQuestion) return;

    // Reset state for new question
    setTimeLeft(currentQuestion.timeLimit);
    setIsAnswerRevealed(false);
    setSelectedAnswer(null);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          processAnswerAndAdvance(null); // Timeout - pass null as no answer was selected
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    currentQuestionIndex,
    showResults,
    currentQuestion,
    processAnswerAndAdvance,
  ]); // Add processAnswerAndAdvance dependency

  // --- Handle Answer Selection (Now triggers advance) ---
  function handleAnswerSelection(answer: string) {
    if (isAnswerRevealed) return; // Don't allow action after reveal started
    setSelectedAnswer(answer); // Set the state first
    processAnswerAndAdvance(answer); // Immediately process and start advance timer
  }

  // --- Restart Logic ---
  function restartQuiz() {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    // Resetting other states happens in useEffect when index changes
    // setSelectedAnswer(null);
    // setIsAnswerRevealed(false);
  }

  // --- Helper to get button styling based on state ---
  const getOptionButtonStyle = (option: string) => {
    const isSelected = selectedAnswer === option;
    const isCorrect = option === currentQuestion.correctAnswer;

    if (isAnswerRevealed) {
      if (isCorrect) {
        return "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700 cursor-not-allowed"; // Correct
      } else if (isSelected && !isCorrect) {
        return "bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700 cursor-not-allowed"; // Selected but Incorrect
      } else {
        return "border bg-secondary/50 text-muted-foreground opacity-70 cursor-not-allowed"; // Not selected, revealed
      }
    }

    // Default state (not revealed)
    if (isSelected) {
      // Should not happen if advance is immediate, but keep for safety
      return "bg-accent text-accent-foreground border-primary ring-2 ring-ring"; // Selected
    } else {
      return "border bg-background text-foreground hover:bg-accent/90 hover:text-accent-foreground"; // Default interactive
    }
  };

  // --- Render Logic ---

  if (showResults) {
    return (
      <motion.div
        key="results"
        variants={resultsVariants}
        initial="initial"
        animate="animate"
        className="max-w-md mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl mb-4">
              You scored <span className="font-bold text-primary">{score}</span>{" "}
              out of <span className="font-bold">{totalQuestions}</span>
            </p>
            <p className="text-2xl font-bold mb-6">
              {score / totalQuestions >= 0.8
                ? "🎉 Excellent! 🎉"
                : score / totalQuestions >= 0.5
                ? "👍 Good Job! 👍"
                : "🤔 Keep Practicing! 🤔"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={restartQuiz}>
              <RotateCcw className="mr-2 h-4 w-4" /> Restart Quiz
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    // Handle case where questions might be empty or index is out of bounds
    return (
      <div className="text-center p-6">
        Loading question or quiz finished...
      </div>
    );
  }

  // Calculate progress for bars
  const timerProgress = (timeLeft / currentQuestion.timeLimit) * 100;
  const quizProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Card className="max-w-md mx-auto overflow-hidden">
      {" "}
      {/* Overflow hidden for animations */}
      <CardHeader className="pb-4">
        {/* Quiz Progress Bar */}
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground mb-1 block">
            Quiz Progress
          </span>
          <Progress value={quizProgress} className="w-full h-2" />
        </div>
        {/* Timer */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </span>
          <div className="flex items-center text-sm font-semibold bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
            <TimerIcon className="h-4 w-4 mr-1.5" />
            Time: {String(timeLeft).padStart(2, "0")}s
          </div>
        </div>
        {/* Timer Progress Bar */}
        <Progress value={timerProgress} className="w-full h-1 mt-2" />
      </CardHeader>
      {/* Use AnimatePresence to handle enter/exit animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex} // Key change triggers animation
          variants={questionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <CardContent className="pt-2">
            <h2 className="text-xl lg:text-2xl font-semibold mb-5 text-foreground min-h-[60px] flex items-center">
              {" "}
              {/* Min height for consistency */}
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline" // Use outline variant for options
                  onClick={() => handleAnswerSelection(option)}
                  // Disable button once an answer is revealed for this question
                  disabled={isAnswerRevealed}
                  className={`w-full h-auto justify-start p-3 text-left transition-all duration-300 relative ${getOptionButtonStyle(
                    option
                  )}`}
                >
                  <span className="flex-1">{option}</span>
                  {/* Icons for revealed answers */}
                  {isAnswerRevealed &&
                    option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 ml-2 flex-shrink-0" />
                    )}
                  {isAnswerRevealed &&
                    selectedAnswer === option &&
                    option !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 ml-2 flex-shrink-0" />
                    )}
                </Button>
              ))}
            </div>
          </CardContent>

          {/* Remove the CardFooter containing the explicit Next button */}
          {/*
          <CardFooter>
            <Button
              onClick={handleTimeoutOrNext} // Use the combined handler
              disabled={!selectedAnswer || isAnswerRevealed} // Disable if no selection or already revealed
              className="w-full"
            >
              {isAnswerRevealed
                ? "..." // Show loading/waiting state maybe
                : currentQuestionIndex < totalQuestions - 1
                ? "Submit & Next"
                : "Finish Quiz"}
            </Button>
          </CardFooter>
          */}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
