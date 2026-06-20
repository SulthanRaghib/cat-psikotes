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
    console.log('🔄 Membangun struktur tabel (questions, attempts, attempt_answers, admins)...');

    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_index INTEGER NOT NULL,
        explanation TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS attempts (
        id SERIAL PRIMARY KEY,
        started_at TEXT NOT NULL,
        finished_at TEXT NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_count INTEGER NOT NULL,
        percent INTEGER NOT NULL,
        categories TEXT NOT NULL,
        timer_mode INTEGER DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS attempt_answers (
        id SERIAL PRIMARY KEY,
        attempt_id INTEGER REFERENCES attempts(id) ON DELETE CASCADE,
        question_id TEXT REFERENCES questions(id),
        chosen_index INTEGER,
        is_correct INTEGER NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `;

    console.log('✅ Struktur tabel berhasil dibuat!');

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

    console.log('🎉 MIGRASI SELESAI!');

  } catch (err: any) {
    console.error('❌ Gagal melakukan migrasi:', err.message || err);
  } finally {
    await sql.end();
  }
}

migrate();
