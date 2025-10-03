
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizConfig {
  numQuestions: number;
  difficulty: string;
}

export enum AppState {
  FILE_UPLOAD,
  QUIZ_CONFIG,
  TAKING_QUIZ,
  RESULTS
}
