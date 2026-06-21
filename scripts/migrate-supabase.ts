import { config } from 'dotenv';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { generateTpaQuestions, generateSyllogismQuestions, generateReadingQuestions, generateAnalogyQuestions } from './tpaDataGenerator';

config({ path: '.env' });
config({ path: '.env.local' });

const args = process.argv.slice(2);
const shouldSeed = args.includes('--seed');

async function migrate() {
  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error('❌ Error: SUPABASE_DB_URL tidak ditemukan di .env');
    console.log('Silakan copy Transaction Connection String dari Settings > Database > Connection String di Supabase.');
    process.exit(1);
  }

  console.log('🔄 Menghubungkan ke Supabase (PostgreSQL)...');
  const sql = postgres(url, { ssl: 'require' });

  try {
    console.log('🔄 Menghapus seluruh tabel di skema public (migrate:fresh)...');
    await sql`
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `;
    
    console.log('🔄 Membangun struktur tabel baru...');

    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS subtests (
        id VARCHAR(50) PRIMARY KEY,
        number INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        group_name VARCHAR(100),
        category VARCHAR(50) DEFAULT 'PSIKOTES',
        item_type VARCHAR(50),
        default_time_limit_seconds INTEGER,
        is_active INTEGER DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS subtest_sessions (
        id SERIAL PRIMARY KEY,
        subtest_id VARCHAR(50) REFERENCES subtests(id),
        started_at TIMESTAMP WITH TIME ZONE NOT NULL,
        finished_at TIMESTAMP WITH TIME ZONE,
        time_limit_seconds INTEGER,
        items_attempted INTEGER DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        accuracy_percent REAL,
        items_per_minute REAL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS subtest_session_items (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES subtest_sessions(id) ON DELETE CASCADE,
        item_index INTEGER NOT NULL,
        stimulus JSONB NOT NULL,
        correct_answer INTEGER,
        user_answer INTEGER,
        is_correct BOOLEAN,
        answered_at_ms INTEGER
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tpa_questions (
        id SERIAL PRIMARY KEY,
        subtest_id VARCHAR(50) REFERENCES subtests(id) ON DELETE CASCADE,
        number INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        image_url TEXT,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        option_e TEXT,
        correct_answer VARCHAR(5) NOT NULL,
        explanation TEXT
      )
    `;

    console.log('✅ Struktur tabel baru berhasil dibuat!');

    if (shouldSeed) {
      console.log('🔄 Menanamkan (Seeding) 12 Subtes...');
      await sql`
        INSERT INTO subtests (id, number, name, group_name, category, item_type, default_time_limit_seconds, is_active)
        VALUES 
        ('subtes_1', 1, 'Menghitung Huruf Sama', 'Learning Agility Index', 'PSIKOTES', 'letter_match_count', 360, 1),
        ('subtes_2', 2, 'Segera Hadir', 'Learning Agility Index', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_3', 3, 'Selisih Huruf Terjauh', 'Learning Agility Index', 'PSIKOTES', 'farthest_letter_distance', 120, 1),
        ('subtes_4', 4, 'Selisih Angka Terjauh', 'Learning Agility Index', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_5', 5, 'Pasangan Huruf Diputar 90°', 'Learning Agility Index', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_6', 6, 'Perhitungan Dasar', 'TIKI', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_7', 7, 'Gabungan Bagian', 'TIKI', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_8', 8, 'Eksklusi Gambar', 'TIKI', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_9', 9, 'Hubungan Kata', 'TIKI', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_10', 10, 'Membandingkan Gambar', 'TIKI', 'PSIKOTES', NULL, NULL, 0),
        ('subtes_11', 11, 'Labirin', 'TIKI', 'PSIKOTES', NULL, NULL, 0),
        ('tpa_1', 1, 'Kuantitatif & Deret Angka', 'Logika Kuantitatif', 'TPA', 'tpa_multiple_choice', 3600, 1),
        ('tpa_2', 2, 'Interpretasi Data & Tabel', 'Logika Kuantitatif', 'TPA', NULL, NULL, 0),
        ('tpa_3', 3, 'Analogi Kata & Korelasi Makna', 'Kemampuan Verbal', 'TPA', 'tpa_multiple_choice', 1200, 1),
        ('tpa_4', 4, 'Sinonim & Antonim', 'Kemampuan Verbal', 'TPA', NULL, NULL, 0),
        ('tpa_5', 5, 'Pemahaman Wacana', 'Kemampuan Verbal', 'TPA', 'tpa_multiple_choice', 1200, 1),
        ('tpa_6', 6, 'Silogisme & Penarikan Kesimpulan', 'Penalaran Logika & Analitis', 'TPA', 'tpa_multiple_choice', 1800, 1),
        ('tpa_7', 7, 'Penalaran Analitis', 'Penalaran Logika & Analitis', 'TPA', NULL, NULL, 0),
        ('tpa_8', 8, 'Rotasi Gambar & Jaring-jaring 3D', 'Kemampuan Figural & Spasial', 'TPA', NULL, NULL, 0),
        ('tpa_9', 9, 'Logika Pola Serial Gambar', 'Kemampuan Figural & Spasial', 'TPA', NULL, NULL, 0)
        ON CONFLICT (id) DO UPDATE SET 
            number = EXCLUDED.number,
            name = EXCLUDED.name,
            group_name = EXCLUDED.group_name,
            category = EXCLUDED.category,
            item_type = EXCLUDED.item_type,
            default_time_limit_seconds = EXCLUDED.default_time_limit_seconds,
            is_active = EXCLUDED.is_active;
      `;
      
      console.log('🔄 Menanamkan (Seeding) TPA Questions...');
      const questions = generateTpaQuestions('tpa_1', 100);
      const tpa3Questions = generateAnalogyQuestions('tpa_3', 30);
      const tpa5Questions = generateReadingQuestions('tpa_5');
      const tpa6Questions = generateSyllogismQuestions('tpa_6', 50);
      
      const allQuestions = [...questions, ...tpa3Questions, ...tpa5Questions, ...tpa6Questions];
      
      // Batch insert because postgres library handles arrays of objects naturally
      await sql`
        INSERT INTO tpa_questions ${sql(allQuestions)}
      `;
      
      console.log('✅ Seed 12 Subtes dan TPA berhasil ditambahkan!');
    } else {
      console.log('⏭️ Melewati proses seeding (--seed tidak diberikan).');
    }

    // Cek apakah admin sudah ada
    const existingAdmin = await sql`SELECT * FROM admins WHERE username = ${process.env.ADMIN_USERNAME || 'admin'}`;
    if (existingAdmin.length === 0) {
      console.log('🔄 Membuat akun admin default...');
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      await sql`INSERT INTO admins (username, password_hash) VALUES (${username}, ${hash})`;
      console.log(`✅ Admin '${username}' berhasil dibuat!`);
    } else {
      console.log(`✅ Admin sudah ada, melewati pembuatan admin.`);
    }

    console.log('🎉 MIGRASI DAN SEEDING SUPABASE SELESAI!');

  } catch (err: any) {
    console.error('❌ Gagal melakukan migrasi:', err.message || err);
  } finally {
    await sql.end();
  }
}

migrate();
