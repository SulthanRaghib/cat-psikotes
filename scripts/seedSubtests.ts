import { sqliteProvider } from "../src/lib/db/providers/sqlite";
import { Subtest } from "../src/types";

async function main() {
  console.log("Preparing to seed subtests...");
  
  if (!sqliteProvider.isReady) {
    console.error("Database is not ready!");
    return;
  }

  const subtests: Subtest[] = [
    {
      id: "subtes_1",
      number: 1,
      name: "Menghitung Huruf Sama",
      group_name: "Learning Agility Index",
      item_type: "letter_match_count",
      default_time_limit_seconds: 360, // 6 minutes default
      is_active: 1
    },
    {
      id: "subtes_2",
      number: 2,
      name: "Segera Hadir",
      group_name: "Learning Agility Index",
      item_type: null,
      default_time_limit_seconds: null,
      is_active: 0
    },
    {
      id: "subtes_3",
      number: 3,
      name: "Selisih Huruf Terjauh",
      group_name: "Learning Agility Index",
      item_type: "farthest_letter_distance",
      default_time_limit_seconds: 360,
      is_active: 1
    },
    {
      id: "subtes_4",
      number: 4,
      name: "Selisih Angka Terjauh",
      group_name: "Learning Agility Index",
      item_type: null,
      default_time_limit_seconds: null,
      is_active: 0
    },
    {
      id: "subtes_5",
      number: 5,
      name: "Pasangan Huruf Diputar 90°",
      group_name: "Learning Agility Index",
      item_type: null,
      default_time_limit_seconds: null,
      is_active: 0
    },
    {
      id: "subtes_6",
      number: 6,
      name: "Berhitung Angka",
      group_name: "TIKI",
      item_type: null,
      default_time_limit_seconds: null,
      is_active: 0
    },
    {
      id: "subtes_7",
      number: 7,
      name: "Gabungan Bagian",
      group_name: "TIKI",
      item_type: null,
      default_time_limit_seconds: 420, // 7 minutes
      is_active: 0
    },
    {
      id: "subtes_8",
      number: 8,
      name: "Hubungan Kata",
      group_name: "TIKI",
      item_type: null,
      default_time_limit_seconds: 300, // 5 minutes
      is_active: 0
    },
    {
      id: "subtes_9",
      number: 9,
      name: "Abstraksi Non-Verbal",
      group_name: "TIKI",
      item_type: null,
      default_time_limit_seconds: null,
      is_active: 0
    },
    {
      id: "subtes_10",
      number: 10,
      name: "Work Personality Analitik",
      group_name: "Personality",
      item_type: null,
      default_time_limit_seconds: null,
      is_active: 0
    },
    {
      id: "subtes_11",
      number: 11,
      name: "Work Behavioral Assessment",
      group_name: "Behavioral",
      item_type: null,
      default_time_limit_seconds: null,
      is_active: 0
    }
  ];

  try {
    await sqliteProvider.subtests.deleteAll();
    await sqliteProvider.subtests.bulkCreate(subtests);
    console.log("Successfully seeded 11 subtests.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

main();
