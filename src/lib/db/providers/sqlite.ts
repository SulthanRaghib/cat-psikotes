import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { IDatabaseProvider, ISubtestRepository, ISubtestSessionRepository, ISubtestSessionItemRepository, IAdminRepository } from "../types";
import { Subtest, SubtestSession, SubtestSessionItem, AdminRecord } from "@/types";
import bcrypt from "bcryptjs";

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Renaming the DB file to app_v3.db to ensure a clean slate for TPA module
const dbPath = path.join(dbDir, "app_v3.db");

let db: Database.Database;
let isReady = false;

try {
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS subtests (
      id TEXT PRIMARY KEY,
      number INTEGER NOT NULL,
      name TEXT NOT NULL,
      group_name TEXT NOT NULL,
      category TEXT DEFAULT 'PSIKOTES',
      item_type TEXT,
      default_time_limit_seconds INTEGER,
      is_active INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tpa_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subtest_id TEXT NOT NULL REFERENCES subtests(id) ON DELETE CASCADE,
      number INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      image_url TEXT,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      option_e TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS subtest_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subtest_id TEXT NOT NULL REFERENCES subtests(id),
      started_at TEXT NOT NULL,
      finished_at TEXT,
      time_limit_seconds INTEGER NOT NULL,
      items_attempted INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      accuracy_percent INTEGER,
      items_per_minute REAL
    );

    CREATE TABLE IF NOT EXISTS subtest_session_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL REFERENCES subtest_sessions(id) ON DELETE CASCADE,
      item_index INTEGER NOT NULL,
      stimulus_json TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      user_answer INTEGER,
      is_correct INTEGER NOT NULL,
      answered_at_ms INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  isReady = true;

  // Setup default admin if not exists
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
  if (adminCount.count === 0) {
    const defaultUser = process.env.ADMIN_USERNAME || "admin";
    const defaultPass = process.env.ADMIN_PASSWORD || "admin123";
    const hash = bcrypt.hashSync(defaultPass, 10);
    db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(defaultUser, hash);
  }
} catch (error) {
  console.error("Failed to initialize SQLite database:", error);
}

class SqliteSubtestRepository implements ISubtestRepository {
  async getAll(): Promise<Subtest[]> {
    return db.prepare("SELECT * FROM subtests ORDER BY number ASC").all() as Subtest[];
  }

  async getById(id: string): Promise<Subtest | null> {
    const row = db.prepare("SELECT * FROM subtests WHERE id = ?").get(id) as Subtest | undefined;
    return row || null;
  }

  async create(data: Subtest): Promise<void> {
    db.prepare(`
      INSERT OR REPLACE INTO subtests (id, number, name, group_name, category, item_type, default_time_limit_seconds, is_active)
      VALUES (@id, @number, @name, @group_name, @category, @item_type, @default_time_limit_seconds, @is_active)
    `).run({
      ...data,
      category: data.category || 'PSIKOTES'
    });
  }

  async bulkCreate(data: Subtest[]): Promise<void> {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO subtests (id, number, name, group_name, category, item_type, default_time_limit_seconds, is_active)
      VALUES (@id, @number, @name, @group_name, @category, @item_type, @default_time_limit_seconds, @is_active)
    `);
    const transaction = db.transaction((items: Subtest[]) => {
      for (const item of items) insert.run({
        ...item,
        category: item.category || 'PSIKOTES'
      });
    });
    transaction(data);
  }

  async deleteAll(): Promise<void> {
    db.prepare("DELETE FROM subtests").run();
  }
}

class SqliteSubtestSessionRepository implements ISubtestSessionRepository {
  async create(subtestId: string, timeLimitSeconds: number): Promise<number> {
    const startedAt = new Date().toISOString();
    const info = db.prepare(`
      INSERT INTO subtest_sessions (subtest_id, started_at, time_limit_seconds)
      VALUES (?, ?, ?)
    `).run(subtestId, startedAt, timeLimitSeconds);
    return info.lastInsertRowid as number;
  }

  async finish(sessionId: number, itemsAttempted: number, correctCount: number, accuracyPercent: number, itemsPerMinute: number): Promise<void> {
    const finishedAt = new Date().toISOString();
    db.prepare(`
      UPDATE subtest_sessions
      SET finished_at = ?, items_attempted = ?, correct_count = ?, accuracy_percent = ?, items_per_minute = ?
      WHERE id = ?
    `).run(finishedAt, itemsAttempted, correctCount, accuracyPercent, itemsPerMinute, sessionId);
  }

  async getRecent(subtestId: string, limit: number): Promise<SubtestSession[]> {
    return db.prepare("SELECT * FROM subtest_sessions WHERE subtest_id = ? AND finished_at IS NOT NULL ORDER BY id DESC LIMIT ?").all(subtestId, limit) as SubtestSession[];
  }

  async getById(id: number): Promise<SubtestSession | null> {
    const row = db.prepare("SELECT * FROM subtest_sessions WHERE id = ?").get(id) as SubtestSession | undefined;
    return row || null;
  }
}

class SqliteSubtestSessionItemRepository implements ISubtestSessionItemRepository {
  async bulkCreate(sessionId: number, items: Omit<SubtestSessionItem, 'id' | 'session_id'>[]): Promise<void> {
    const insert = db.prepare(`
      INSERT INTO subtest_session_items (session_id, item_index, stimulus_json, correct_answer, user_answer, is_correct, answered_at_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const transaction = db.transaction((ans: Omit<SubtestSessionItem, 'id' | 'session_id'>[]) => {
      for (const a of ans) {
        insert.run(sessionId, a.item_index, a.stimulus_json, a.correct_answer, a.user_answer, a.is_correct, a.answered_at_ms);
      }
    });
    transaction(items);
  }

  async getBySessionId(sessionId: number): Promise<SubtestSessionItem[]> {
    return db.prepare("SELECT * FROM subtest_session_items WHERE session_id = ? ORDER BY item_index ASC").all(sessionId) as SubtestSessionItem[];
  }
}

class SqliteAdminRepository implements IAdminRepository {
  async findByUsername(username: string): Promise<AdminRecord | null> {
    const row = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as AdminRecord | undefined;
    return row || null;
  }

  async create(username: string, passwordHash: string): Promise<void> {
    db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, passwordHash);
  }

  async updatePassword(username: string, newHash: string): Promise<void> {
    db.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").run(newHash, username);
  }
}

export const sqliteProvider: IDatabaseProvider = {
  name: "sqlite",
  isReady,
  subtests: new SqliteSubtestRepository(),
  sessions: new SqliteSubtestSessionRepository(),
  sessionItems: new SqliteSubtestSessionItemRepository(),
  admins: new SqliteAdminRepository(),
};
