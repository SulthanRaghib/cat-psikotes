export interface AdminRecord {
  id: number;
  username: string;
  password_hash: string;
}

export interface QuestionRecord {
  id: string;
  category: string;
  question: string;
  options: string; // JSON string
  correct_index: number;
  explanation: string;
  created_at?: string;
}

export interface AttemptRecord {
  id: number;
  started_at: string;
  finished_at: string;
  total_questions: number;
  correct_count: number;
  percent: number;
  categories: string; // JSON string
  timer_mode: number;
}

export interface AttemptAnswerRecord {
  id: number;
  attempt_id: number;
  question_id: string;
  chosen_index: number | null;
  is_correct: number;
}

// Sub-interfaces for saving attempt data easily
export interface SaveAttemptData {
  startedAt: string;
  finishedAt: string;
  totalQuestions: number;
  correctCount: number;
  percent: number;
  categories: string[];
  timerMode: boolean;
  answers: {
    questionId: string;
    chosenIndex: number | null;
    isCorrect: boolean;
  }[];
}

export interface IQuestionRepository {
  getAll(): Promise<QuestionRecord[]>;
  getById(id: string): Promise<QuestionRecord | null>;
  create(data: QuestionRecord): Promise<void>;
  update(id: string, data: Partial<QuestionRecord>): Promise<void>;
  delete(id: string): Promise<void>;
  bulkCreate(data: QuestionRecord[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IAdminRepository {
  findByUsername(username: string): Promise<AdminRecord | null>;
  create(username: string, passwordHash: string): Promise<void>;
  updatePassword(username: string, newHash: string): Promise<void>;
}

export interface IAttemptRepository {
  save(data: SaveAttemptData): Promise<{ id: number; totalQuestions: number; correctCount: number; percent: number }>;
  getRecent(limit: number): Promise<AttemptRecord[]>;
  getById(id: number): Promise<{ attempt: AttemptRecord, answers: AttemptAnswerRecord[] } | null>;
  deleteAll(): Promise<void>;
}

export interface IDatabaseProvider {
  name: string;
  isReady: boolean;
  questions: IQuestionRepository;
  admins: IAdminRepository;
  attempts: IAttemptRepository;
}
