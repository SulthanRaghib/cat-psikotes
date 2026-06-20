import { IDatabaseProvider, ISubtestRepository, ISubtestSessionRepository, ISubtestSessionItemRepository, IAdminRepository } from "../types";
import { Subtest, SubtestSession, SubtestSessionItem, AdminRecord } from "@/types";
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DEFAULT_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

class DummySubtestRepository implements ISubtestRepository {
  private subtests: Subtest[] = [];

  async getAll(): Promise<Subtest[]> {
    return this.subtests.sort((a, b) => a.number - b.number);
  }

  async getById(id: string): Promise<Subtest | null> {
    return this.subtests.find((s) => s.id === id) || null;
  }

  async create(data: Subtest): Promise<void> {
    this.subtests.push(data);
  }

  async bulkCreate(data: Subtest[]): Promise<void> {
    this.subtests.push(...data);
  }

  async deleteAll(): Promise<void> {
    this.subtests = [];
  }
}

class DummySubtestSessionRepository implements ISubtestSessionRepository {
  private sessions: SubtestSession[] = [];

  async create(subtestId: string, timeLimitSeconds: number): Promise<number> {
    const id = Date.now();
    this.sessions.push({
      id,
      subtest_id: subtestId,
      started_at: new Date().toISOString(),
      finished_at: null,
      time_limit_seconds: timeLimitSeconds,
      items_attempted: 0,
      correct_count: 0,
      accuracy_percent: null,
      items_per_minute: null,
    });
    return id;
  }

  async finish(sessionId: number, itemsAttempted: number, correctCount: number, accuracyPercent: number, itemsPerMinute: number): Promise<void> {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.finished_at = new Date().toISOString();
      session.items_attempted = itemsAttempted;
      session.correct_count = correctCount;
      session.accuracy_percent = accuracyPercent;
      session.items_per_minute = itemsPerMinute;
    }
  }

  async getRecent(subtestId: string, limit: number): Promise<SubtestSession[]> {
    return this.sessions
      .filter(s => s.subtest_id === subtestId && s.finished_at !== null)
      .slice(-limit)
      .reverse();
  }

  async getById(id: number): Promise<SubtestSession | null> {
    return this.sessions.find(s => s.id === id) || null;
  }
}

class DummySubtestSessionItemRepository implements ISubtestSessionItemRepository {
  private items: SubtestSessionItem[] = [];

  async bulkCreate(sessionId: number, ans: Omit<SubtestSessionItem, 'id' | 'session_id'>[]): Promise<void> {
    ans.forEach(a => {
      this.items.push({
        id: Date.now() + Math.random(),
        session_id: sessionId,
        ...a
      });
    });
  }

  async getBySessionId(sessionId: number): Promise<SubtestSessionItem[]> {
    return this.items.filter(i => i.session_id === sessionId).sort((a, b) => a.item_index - b.item_index);
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

export const dummyProvider: IDatabaseProvider = {
  name: "dummy",
  isReady: true,
  subtests: new DummySubtestRepository(),
  sessions: new DummySubtestSessionRepository(),
  sessionItems: new DummySubtestSessionItemRepository(),
  admins: new DummyAdminRepository(),
};
