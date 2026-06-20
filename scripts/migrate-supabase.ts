import { config } from 'dotenv';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

config({ path: '.env' });
config({ path: '.env.local' });

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
    console.log('🔄 Menghapus tabel lama jika ada...');
    await sql`DROP TABLE IF EXISTS attempt_answers CASCADE`;
    await sql`DROP TABLE IF EXISTS attempts CASCADE`;
    await sql`DROP TABLE IF EXISTS questions CASCADE`;
    await sql`DROP TABLE IF EXISTS subtest_session_items CASCADE`;
    await sql`DROP TABLE IF EXISTS subtest_sessions CASCADE`;
    await sql`DROP TABLE IF EXISTS subtests CASCADE`;
    
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

    console.log('✅ Struktur tabel baru berhasil dibuat!');

    console.log('🔄 Menanamkan (Seeding) 11 Subtes...');
    await sql`
      INSERT INTO subtests (id, number, name, group_name, item_type, default_time_limit_seconds, is_active)
      VALUES 
      ('subtes_1', 1, 'Menghitung Huruf Sama', 'Learning Agility Index', 'letter_match_count', 360, 1),
      ('subtes_2', 2, 'Segera Hadir', 'Learning Agility Index', NULL, NULL, 0),
      ('subtes_3', 3, 'Selisih Huruf Terjauh', 'Learning Agility Index', NULL, NULL, 0),
      ('subtes_4', 4, 'Selisih Angka Terjauh', 'Learning Agility Index', NULL, NULL, 0),
      ('subtes_5', 5, 'Pasangan Huruf Diputar 90°', 'Learning Agility Index', NULL, NULL, 0),
      ('subtes_6', 6, 'Berhitung Angka', 'TIKI', NULL, NULL, 0),
      ('subtes_7', 7, 'Gabungan Bagian', 'TIKI', NULL, 420, 0),
      ('subtes_8', 8, 'Hubungan Kata', 'TIKI', NULL, 300, 0),
      ('subtes_9', 9, 'Abstraksi Non-Verbal', 'TIKI', NULL, NULL, 0),
      ('subtes_10', 10, 'Work Personality Analitik', 'Personality', NULL, NULL, 0),
      ('subtes_11', 11, 'Work Behavioral Assessment', 'Behavioral', NULL, NULL, 0)
      ON CONFLICT (id) DO UPDATE SET 
          number = EXCLUDED.number,
          name = EXCLUDED.name,
          group_name = EXCLUDED.group_name,
          item_type = EXCLUDED.item_type,
          default_time_limit_seconds = EXCLUDED.default_time_limit_seconds,
          is_active = EXCLUDED.is_active;
    `;
    console.log('✅ Seed 11 Subtes berhasil ditambahkan!');

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
