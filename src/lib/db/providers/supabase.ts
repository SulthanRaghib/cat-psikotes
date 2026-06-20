import { createClient } from "@supabase/supabase-js";
import { IDatabaseProvider, ISubtestRepository, ISubtestSessionRepository, ISubtestSessionItemRepository, IAdminRepository } from "../types";
import { Subtest, SubtestSession, SubtestSessionItem, AdminRecord } from "@/types";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let isReady = false;
let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  isReady = true;
} else {
  console.warn("Supabase credentials not found. Supabase provider will not be ready.");
}

class SupabaseSubtestRepository implements ISubtestRepository {
  async getAll(): Promise<Subtest[]> {
    if (!isReady) return [];
    const { data, error } = await supabase.from("subtests").select("*").order("number", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Subtest | null> {
    if (!isReady) return null;
    const { data, error } = await supabase.from("subtests").select("*").eq("id", id).single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 is not found
    return data || null;
  }

  async create(data: Subtest): Promise<void> {
    if (!isReady) return;
    const { error } = await supabase.from("subtests").insert(data);
    if (error) throw error;
  }

  async bulkCreate(data: Subtest[]): Promise<void> {
    if (!isReady) return;
    const { error } = await supabase.from("subtests").insert(data);
    if (error) throw error;
  }

  async deleteAll(): Promise<void> {
    if (!isReady) return;
    const { error } = await supabase.from("subtests").delete().neq('id', 'dummy_value_to_delete_all');
    if (error) throw error;
  }
}

class SupabaseSubtestSessionRepository implements ISubtestSessionRepository {
  async create(subtestId: string, timeLimitSeconds: number): Promise<number> {
    if (!isReady) throw new Error("Supabase is not ready");
    const startedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("subtest_sessions")
      .insert({ subtest_id: subtestId, started_at: startedAt, time_limit_seconds: timeLimitSeconds })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }

  async finish(sessionId: number, itemsAttempted: number, correctCount: number, accuracyPercent: number, itemsPerMinute: number): Promise<void> {
    if (!isReady) return;
    const finishedAt = new Date().toISOString();
    const { error } = await supabase
      .from("subtest_sessions")
      .update({
        finished_at: finishedAt,
        items_attempted: itemsAttempted,
        correct_count: correctCount,
        accuracy_percent: accuracyPercent,
        items_per_minute: itemsPerMinute
      })
      .eq("id", sessionId);
    if (error) throw error;
  }

  async getRecent(subtestId: string, limit: number): Promise<SubtestSession[]> {
    if (!isReady) return [];
    const { data, error } = await supabase
      .from("subtest_sessions")
      .select("*")
      .eq("subtest_id", subtestId)
      .not("finished_at", "is", null)
      .order("id", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<SubtestSession | null> {
    if (!isReady) return null;
    const { data, error } = await supabase.from("subtest_sessions").select("*").eq("id", id).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  }
}

class SupabaseSubtestSessionItemRepository implements ISubtestSessionItemRepository {
  async bulkCreate(sessionId: number, items: Omit<SubtestSessionItem, 'id' | 'session_id'>[]): Promise<void> {
    if (!isReady) return;
    const payload = items.map(i => ({ session_id: sessionId, ...i }));
    const { error } = await supabase.from("subtest_session_items").insert(payload);
    if (error) throw error;
  }

  async getBySessionId(sessionId: number): Promise<SubtestSessionItem[]> {
    if (!isReady) return [];
    const { data, error } = await supabase.from("subtest_session_items").select("*").eq("session_id", sessionId).order("item_index", { ascending: true });
    if (error) throw error;
    return data || [];
  }
}

class SupabaseAdminRepository implements IAdminRepository {
  async findByUsername(username: string): Promise<AdminRecord | null> {
    if (!isReady) return null;
    const { data, error } = await supabase.from("admins").select("*").eq("username", username).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  }

  async create(username: string, passwordHash: string): Promise<void> {
    if (!isReady) return;
    const { error } = await supabase.from("admins").insert({ username, password_hash: passwordHash });
    if (error) throw error;
  }

  async updatePassword(username: string, newHash: string): Promise<void> {
    if (!isReady) return;
    const { error } = await supabase.from("admins").update({ password_hash: newHash }).eq("username", username);
    if (error) throw error;
  }
}

export const supabaseProvider: IDatabaseProvider = {
  name: "supabase",
  isReady,
  subtests: new SupabaseSubtestRepository(),
  sessions: new SupabaseSubtestSessionRepository(),
  sessionItems: new SupabaseSubtestSessionItemRepository(),
  admins: new SupabaseAdminRepository(),
};
