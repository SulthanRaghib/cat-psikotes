import {
  IDatabaseProvider,
  IQuestionRepository,
  IAdminRepository,
  IAttemptRepository,
  QuestionRecord,
  AdminRecord,
  AttemptRecord,
  SaveAttemptData,
  AttemptAnswerRecord,
} from "../types";
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DEFAULT_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

class DummyQuestionRepository implements IQuestionRepository {
  private questions: QuestionRecord[] = [
    {
      id: "dummy_1",
      category: "numerik",
      question: "Berapakah 1 + 1? (Mode Dummy)",
      options: JSON.stringify(["1", "2", "3", "4"]),
      correct_index: 1,
      explanation:
        "Sistem sedang berjalan dalam Mode Dummy (Fallback) karena database utama gagal terhubung.",
      created_at: new Date().toISOString(),
    },
  ];

  async getAll(): Promise<QuestionRecord[]> {
    return this.questions;
  }

  async getById(id: string): Promise<QuestionRecord | null> {
    return this.questions.find((q) => q.id === id) || null;
  }

  async create(data: QuestionRecord): Promise<void> {
    this.questions.push(data);
  }

  async update(id: string, data: Partial<QuestionRecord>): Promise<void> {
    const idx = this.questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      this.questions[idx] = { ...this.questions[idx], ...data };
    }
  }

  async delete(id: string): Promise<void> {
    this.questions = this.questions.filter((q) => q.id !== id);
  }

  async bulkCreate(data: QuestionRecord[]): Promise<void> {
    this.questions.push(...data);
  }

  async deleteAll(): Promise<void> {
    this.questions = [];
  }
}

class DummyAdminRepository implements IAdminRepository {
  private admins: AdminRecord[] = [
    {
      id: 1,
      username: ADMIN_USERNAME,
      password_hash: DEFAULT_HASH,
    },
  ];

  async findByUsername(username: string): Promise<AdminRecord | null> {
    return this.admins.find((a) => a.username === username) || null;
  }

  async create(username: string, passwordHash: string): Promise<void> {
    this.admins.push({
      id: Date.now(),
      username,
      password_hash: passwordHash,
    });
  }

  async updatePassword(username: string, newHash: string): Promise<void> {
    const admin = this.admins.find(a => a.username === username);
    if (admin) {
      admin.password_hash = newHash;
    }
  }
}

class DummyAttemptRepository implements IAttemptRepository {
  private attempts: AttemptRecord[] = [];
  private answers: AttemptAnswerRecord[] = [];

  async save(
    data: SaveAttemptData,
  ): Promise<{
    id: number;
    totalQuestions: number;
    correctCount: number;
    percent: number;
  }> {
    const attemptId = Date.now();
    this.attempts.push({
      id: attemptId,
      started_at: data.startedAt,
      finished_at: data.finishedAt,
      total_questions: data.totalQuestions,
      correct_count: data.correctCount,
      percent: data.percent,
      categories: JSON.stringify(data.categories),
      timer_mode: data.timerMode ? 1 : 0,
    });

    data.answers.forEach((ans) => {
      this.answers.push({
        id: Date.now() + Math.random(),
        attempt_id: attemptId,
        question_id: ans.questionId,
        chosen_index: ans.chosenIndex,
        is_correct: ans.isCorrect ? 1 : 0,
      });
    });

    return {
      id: attemptId,
      totalQuestions: data.totalQuestions,
      correctCount: data.correctCount,
      percent: data.percent,
    };
  }

  async getRecent(limit: number): Promise<AttemptRecord[]> {
    return this.attempts.slice(-limit).reverse();
  }

  async getById(
    id: number,
  ): Promise<{
    attempt: AttemptRecord;
    answers: AttemptAnswerRecord[];
  } | null> {
    const attempt = this.attempts.find((a) => a.id === id);
    if (!attempt) return null;
    const ans = this.answers.filter((a) => a.attempt_id === id);
    return { attempt, answers: ans };
  }

  async delete(id: number): Promise<void> {
    this.attempts = this.attempts.filter((a) => a.id !== id);
    this.answers = this.answers.filter((a) => a.attempt_id !== id);
  }

  async deleteAll(): Promise<void> {
    this.attempts = [];
    this.answers = [];
  }
}

export const dummyProvider: IDatabaseProvider = {
  name: "dummy",
  isReady: true,
  questions: new DummyQuestionRepository(),
  admins: new DummyAdminRepository(),
  attempts: new DummyAttemptRepository(),
};
