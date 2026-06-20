import { Subtest, SubtestSession, SubtestSessionItem, AdminRecord } from '@/types';

export interface ISubtestRepository {
  getAll(): Promise<Subtest[]>;
  getById(id: string): Promise<Subtest | null>;
  create(data: Subtest): Promise<void>;
  bulkCreate(data: Subtest[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface ISubtestSessionRepository {
  create(subtestId: string, timeLimitSeconds: number): Promise<number>; // returns sessionId
  finish(sessionId: number, itemsAttempted: number, correctCount: number, accuracyPercent: number, itemsPerMinute: number): Promise<void>;
  getRecent(subtestId: string, limit: number): Promise<SubtestSession[]>;
  getById(id: number): Promise<SubtestSession | null>;
}

export interface ISubtestSessionItemRepository {
  bulkCreate(sessionId: number, items: Omit<SubtestSessionItem, 'id' | 'session_id'>[]): Promise<void>;
  getBySessionId(sessionId: number): Promise<SubtestSessionItem[]>;
}

export interface IAdminRepository {
  findByUsername(username: string): Promise<AdminRecord | null>;
  create(username: string, passwordHash: string): Promise<void>;
  updatePassword(username: string, newHash: string): Promise<void>;
}

export interface IDatabaseProvider {
  name: string;
  isReady: boolean;
  subtests: ISubtestRepository;
  sessions: ISubtestSessionRepository;
  sessionItems: ISubtestSessionItemRepository;
  admins: IAdminRepository;
}
