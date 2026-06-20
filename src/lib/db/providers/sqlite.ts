import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
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

let db: Database.Database | null = null;

try {
  const dbDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, "app.db");
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL CHECK (category IN ('numerik','logika','verbal','situasional')),
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT NOT NULL,
      finished_at TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      percent INTEGER NOT NULL,
      categories TEXT NOT NULL,
      timer_mode INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS attempt_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL REFERENCES questions(id),
      chosen_index INTEGER,
      is_correct INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);
} catch (e) {
  console.error("SQLite initialization failed:", e);
  db = null;
}

class SqliteQuestionRepository implements IQuestionRepository {
  async getAll(): Promise<QuestionRecord[]> {
    if (!db) throw new Error("SQLite not initialized");
    return db.prepare("SELECT * FROM questions").all() as QuestionRecord[];
  }
  async getById(id: string): Promise<QuestionRecord | null> {
    if (!db) throw new Error("SQLite not initialized");
    return db
      .prepare("SELECT * FROM questions WHERE id = ?")
      .get(id) as QuestionRecord | null;
  }
  async create(data: QuestionRecord): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    db.prepare(
      "INSERT INTO questions (id, category, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(
      data.id,
      data.category,
      data.question,
      data.options,
      data.correct_index,
      data.explanation,
    );
  }
  async update(id: string, data: Partial<QuestionRecord>): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    const sets: string[] = [];
    const values: unknown[] = [];
    for (const [k, v] of Object.entries(data)) {
      if (k !== "id") {
        sets.push(`${k} = ?`);
        values.push(v);
      }
    }
    if (sets.length === 0) return;
    values.push(id);
    db.prepare(`UPDATE questions SET ${sets.join(", ")} WHERE id = ?`).run(
      ...values,
    );
  }
  async delete(id: string): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    db.prepare("DELETE FROM questions WHERE id = ?").run(id);
  }
  async bulkCreate(data: QuestionRecord[]): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    const insert = db.prepare(
      "INSERT INTO questions (id, category, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const tx = db.transaction((items) => {
      for (const item of items) {
        insert.run(
          item.id,
          item.category,
          item.question,
          item.options,
          item.correct_index,
          item.explanation,
        );
      }
    });
    tx(data);
  }
  async deleteAll(): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    db.prepare("DELETE FROM questions").run();
  }
}

class SqliteAdminRepository implements IAdminRepository {
  async findByUsername(username: string): Promise<AdminRecord | null> {
    if (!db) throw new Error("SQLite not initialized");
    return db
      .prepare("SELECT * FROM admins WHERE username = ?")
      .get(username) as AdminRecord | null;
  }
  async create(username: string, passwordHash: string): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    db.prepare(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
    ).run(username, passwordHash);
  }
  async updatePassword(username: string, newHash: string): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    db.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").run(newHash, username);
  }
}

class SqliteAttemptRepository implements IAttemptRepository {
  async save(data: SaveAttemptData): Promise<{
    id: number;
    totalQuestions: number;
    correctCount: number;
    percent: number;
  }> {
    if (!db) throw new Error("SQLite not initialized");

    const insertAttempt = db.prepare(`
      INSERT INTO attempts (started_at, finished_at, total_questions, correct_count, percent, categories, timer_mode)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertAnswer = db.prepare(`
      INSERT INTO attempt_answers (attempt_id, question_id, chosen_index, is_correct)
      VALUES (?, ?, ?, ?)
    `);

    let attemptId = 0;
    const processAttempt = db.transaction(() => {
      const result = insertAttempt.run(
        data.startedAt,
        data.finishedAt,
        data.totalQuestions,
        data.correctCount,
        data.percent,
        JSON.stringify(data.categories),
        data.timerMode ? 1 : 0,
      );
      attemptId = result.lastInsertRowid as number;

      for (const ans of data.answers) {
        insertAnswer.run(
          attemptId,
          ans.questionId,
          ans.chosenIndex === null ? null : ans.chosenIndex,
          ans.isCorrect ? 1 : 0,
        );
      }
    });

    processAttempt();

    return {
      id: attemptId,
      totalQuestions: data.totalQuestions,
      correctCount: data.correctCount,
      percent: data.percent,
    };
  }
  async getRecent(limit: number): Promise<AttemptRecord[]> {
    if (!db) throw new Error("SQLite not initialized");
    return db
      .prepare("SELECT * FROM attempts ORDER BY finished_at DESC LIMIT ?")
      .all(limit) as AttemptRecord[];
  }
  async getById(id: number): Promise<{
    attempt: AttemptRecord;
    answers: AttemptAnswerRecord[];
  } | null> {
    if (!db) throw new Error("SQLite not initialized");
    const attempt = db
      .prepare("SELECT * FROM attempts WHERE id = ?")
      .get(id) as AttemptRecord;
    if (!attempt) return null;
    const answers = db
      .prepare("SELECT * FROM attempt_answers WHERE attempt_id = ?")
      .all(id) as AttemptAnswerRecord[];
    return { attempt, answers };
  }
  async deleteAll(): Promise<void> {
    if (!db) throw new Error("SQLite not initialized");
    db.prepare("DELETE FROM attempts").run();
  }
}

export const sqliteProvider: IDatabaseProvider = {
  name: "sqlite",
  isReady: db !== null,
  questions: new SqliteQuestionRepository(),
  admins: new SqliteAdminRepository(),
  attempts: new SqliteAttemptRepository(),
};
