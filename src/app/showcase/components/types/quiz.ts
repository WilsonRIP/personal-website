// Define the type (e.g., in ./types/quiz.ts)
export interface MathQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number; // Time limit in seconds
}
