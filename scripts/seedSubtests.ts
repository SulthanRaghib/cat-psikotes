import { sqliteProvider } from "../src/lib/db/providers/sqlite";
import path from "path";
import { generateTpaQuestions } from "./tpaDataGenerator";
import { Subtest } from "../src/types";

async function main() {
  console.log("Preparing to seed subtests...");
  
  if (!sqliteProvider.isReady) {
    console.error("Database is not ready!");
    return;
  }

  const initialSubtests: Subtest[] = [
    { id: "subtes_1", number: 1, name: "Menghitung Huruf Sama", group_name: "Learning Agility Index", category: "PSIKOTES", item_type: "letter_match_count", default_time_limit_seconds: 360, is_active: 1 },
    { id: "subtes_2", number: 2, name: "Segera Hadir", group_name: "Learning Agility Index", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_3", number: 3, name: "Selisih Huruf Terjauh", group_name: "Learning Agility Index", category: "PSIKOTES", item_type: "farthest_letter_distance", default_time_limit_seconds: 120, is_active: 1 },
    { id: "subtes_4", number: 4, name: "Selisih Angka Terjauh", group_name: "Learning Agility Index", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_5", number: 5, name: "Pasangan Huruf Diputar 90°", group_name: "Learning Agility Index", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_6", number: 6, name: "Perhitungan Dasar", group_name: "TIKI", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_7", number: 7, name: "Gabungan Bagian", group_name: "TIKI", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_8", number: 8, name: "Eksklusi Gambar", group_name: "TIKI", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_9", number: 9, name: "Hubungan Kata", group_name: "TIKI", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_10", number: 10, name: "Membandingkan Gambar", group_name: "TIKI", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "subtes_11", number: 11, name: "Labirin", group_name: "TIKI", category: "PSIKOTES", item_type: null, default_time_limit_seconds: null, is_active: 0 },
    { id: "tpa_1", number: 1, name: "Kuantitatif & Deret Angka", group_name: "Logika Kuantitatif", category: "TPA", item_type: "tpa_multiple_choice", default_time_limit_seconds: 3600, is_active: 1 }
  ];

  try {
    console.log("Menanamkan (seeding) subtes ke SQLite app_v3.db...");
    await sqliteProvider.subtests.bulkCreate(initialSubtests);

    // Seed sample TPA questions directly into SQLite
    const dbPath = path.join(process.cwd(), "data", "app_v3.db");
    const Database = require("better-sqlite3");
    const db = new Database(dbPath);
    
    try {
      db.exec("ALTER TABLE tpa_questions ADD COLUMN explanation TEXT;");
    } catch (e) {
      // Column might already exist
    }
    
    const tpaQuestions = generateTpaQuestions('tpa_1', 100);

    const insertQ = db.prepare("INSERT OR REPLACE INTO tpa_questions (subtest_id, number, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const q of tpaQuestions) {
      insertQ.run(q.subtest_id, q.number, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.option_e, q.correct_answer, q.explanation);
    }

    console.log("Selesai menanamkan subtes & bank soal TPA.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

main();
