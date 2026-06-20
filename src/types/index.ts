export interface Subtest {
  id: string;
  number: number;
  name: string;
  group_name: string;
  item_type: string | null;
  default_time_limit_seconds: number | null;
  is_active: number; // 0 or 1
}

export interface SubtestSession {
  id: number;
  subtest_id: string;
  started_at: string;
  finished_at: string | null;
  time_limit_seconds: number;
  items_attempted: number;
  correct_count: number;
  accuracy_percent: number | null;
  items_per_minute: number | null;
}

export interface SubtestSessionItem {
  id?: number;
  session_id?: number;
  item_index: number;
  stimulus_json: string;
  correct_answer: number;
  user_answer: number | null;
  is_correct: number; // 0 or 1
  answered_at_ms: number;
}

export interface AdminRecord {
  id: number;
  username: string;
  password_hash: string;
}
