// types/quiz.ts
export interface MathQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number; // in seconds
}

// Sample data conforming to the MathQuestion interface
export const sampleMathQuestions: MathQuestion[] = [
  {
    id: 1,
    question: "What is 5 + 3?",
    options: ["7", "8", "9", "10"],
    correctAnswer: "8",
    timeLimit: 15,
  },
  {
    id: 2,
    question: "What is 10 - 4?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "6",
    timeLimit: 10,
  },
  {
    id: 3,
    question: "What is 3 * 7?",
    options: ["18", "21", "24", "27"],
    correctAnswer: "21",
    timeLimit: 20,
  },
];
