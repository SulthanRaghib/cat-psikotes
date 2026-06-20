export type Category = 'numerik' | 'logika' | 'verbal' | 'situasional';

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[]; // Decoded JSON
  correct_index: number;
  explanation: string;
}

export interface Attempt {
  id: number;
  startedAt: string;
  finishedAt: string;
  totalQuestions: number;
  correctCount: number;
  percent: number;
  categories: Category[]; // Decoded JSON
  timerMode: boolean; // 0/1 mapped to boolean
}

export interface AttemptAnswer {
  id: number;
  attempt_id: number;
  question_id: string;
  chosen_index: number | null;
  is_correct: boolean; // 0/1 mapped to boolean
  // Extended fields for review (joined from questions)
  question?: string;
  options?: string[];
  correct_index?: number;
  explanation?: string;
  category?: Category;
}
