import { createClient, SupabaseClient } from "@supabase/supabase-js";
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

let supabase: SupabaseClient | null = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("Supabase credentials not found in environment variables.");
}

class SupabaseQuestionRepository implements IQuestionRepository {
  async getAll(): Promise<QuestionRecord[]> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { data, error } = await supabase.from("questions").select("*");
    if (error) throw new Error(error.message);
    return data as QuestionRecord[];
  }
  async getById(id: string): Promise<QuestionRecord | null> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }
  async create(data: QuestionRecord): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { error } = await supabase.from("questions").insert([data]);
    if (error) throw new Error(error.message);
  }
  async update(id: string, data: Partial<QuestionRecord>): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { error } = await supabase
      .from("questions")
      .update(data)
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
  async bulkCreate(data: QuestionRecord[]): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { error } = await supabase.from("questions").insert(data);
    if (error) throw new Error(error.message);
  }
  async deleteAll(): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    // Supabase needs explicit filter or RPC to delete all rows easily. We'll match all ids.
    const { error } = await supabase
      .from("questions")
      .delete()
      .neq("id", "dummy_never_match");
    if (error) throw new Error(error.message);
  }
}

class SupabaseAdminRepository implements IAdminRepository {
  async findByUsername(username: string): Promise<AdminRecord | null> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();
    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data || null;
  }
  async create(username: string, passwordHash: string): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { error } = await supabase
      .from("admins")
      .insert([{ username, password_hash: passwordHash }]);
    if (error) throw new Error(error.message);
  }
  async updatePassword(username: string, newHash: string): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { error } = await supabase.from('admins').update({ password_hash: newHash }).eq('username', username);
    if (error) throw new Error(error.message);
  }
}

class SupabaseAttemptRepository implements IAttemptRepository {
  async save(data: SaveAttemptData): Promise<{
    id: number;
    totalQuestions: number;
    correctCount: number;
    percent: number;
  }> {
    if (!supabase) throw new Error("Supabase not initialized");

    // Insert attempt
    const attemptPayload = {
      started_at: data.startedAt,
      finished_at: data.finishedAt,
      total_questions: data.totalQuestions,
      correct_count: data.correctCount,
      percent: data.percent,
      categories: JSON.stringify(data.categories),
      timer_mode: data.timerMode ? 1 : 0,
    };

    const { data: attemptRows, error: attemptError } = await supabase
      .from("attempts")
      .insert([attemptPayload])
      .select("id");

    if (attemptError) throw new Error(attemptError.message);
    const attemptId = attemptRows[0].id;

    // Insert answers
    const answersPayload = data.answers.map((ans) => ({
      attempt_id: attemptId,
      question_id: ans.questionId,
      chosen_index: ans.chosenIndex,
      is_correct: ans.isCorrect ? 1 : 0,
    }));

    if (answersPayload.length > 0) {
      const { error: answersError } = await supabase
        .from("attempt_answers")
        .insert(answersPayload);
      if (answersError) throw new Error(answersError.message);
    }

    return {
      id: attemptId,
      totalQuestions: data.totalQuestions,
      correctCount: data.correctCount,
      percent: data.percent,
    };
  }

  async getRecent(limit: number): Promise<AttemptRecord[]> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { data, error } = await supabase
      .from("attempts")
      .select("*")
      .order("finished_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data as AttemptRecord[];
  }

  async getById(id: number): Promise<{
    attempt: AttemptRecord;
    answers: AttemptAnswerRecord[];
  } | null> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { data: attempt, error: attemptError } = await supabase
      .from("attempts")
      .select("*")
      .eq("id", id)
      .single();
    if (attemptError && attemptError.code !== "PGRST116")
      throw new Error(attemptError.message);
    if (!attempt) return null;

    const { data: answers, error: answersError } = await supabase
      .from("attempt_answers")
      .select("*")
      .eq("attempt_id", id);
    if (answersError) throw new Error(answersError.message);

    return {
      attempt: attempt as AttemptRecord,
      answers: answers as AttemptAnswerRecord[],
    };
  }

  async deleteAll(): Promise<void> {
    if (!supabase) throw new Error("Supabase not initialized");
    const { error } = await supabase.from("attempts").delete().neq("id", 0);
    if (error) throw new Error(error.message);
  }
}

export const supabaseProvider: IDatabaseProvider = {
  name: "supabase",
  isReady: supabase !== null,
  questions: new SupabaseQuestionRepository(),
  admins: new SupabaseAdminRepository(),
  attempts: new SupabaseAttemptRepository(),
};
