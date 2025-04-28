import { MathQuestion } from "../showcase/components/types/quiz"; // Import the type

// Define and export the sample math questions
export const sampleMathQuestions: MathQuestion[] = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    timeLimit: 10,
  },
  {
    question: "What is 10 - 3?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "7",
    timeLimit: 10,
  },
  {
    question: "What is 5 * 4?",
    options: ["15", "20", "25", "30"],
    correctAnswer: "20",
    timeLimit: 15,
  },
  {
    question: "What is 12 / 3?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
    timeLimit: 15,
  },
];
