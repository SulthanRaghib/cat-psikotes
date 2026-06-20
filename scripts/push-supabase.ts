import { config } from 'dotenv';
config({ path: '.env' });

// Setup environment before importing providers
process.env.DB_PROVIDER = 'sqlite'; // Force sqlite for local reading

async function pushData() {
  const { sqliteProvider } = await import('../src/lib/db/providers/sqlite');
  const { supabaseProvider } = await import('../src/lib/db/providers/supabase');

  if (!sqliteProvider.isReady) {
    console.error('❌ Error: Database SQLite lokal tidak siap.');
    process.exit(1);
  }

  if (!supabaseProvider.isReady) {
    console.error('❌ Error: Kredensial Supabase tidak valid. Periksa NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env');
    process.exit(1);
  }

  console.log('🔄 Memulai sinkronisasi data dari Lokal (SQLite) ke Cloud (Supabase)...');

  try {
    // 1. Migrasi Admin
    console.log('🔄 Menyalin data Admin...');
    // We only create the default admin via migrate-supabase.ts usually, but let's sync local admin if needed.
    // For safety, we skip admin if it exists in Supabase.
    const localAdmin = await sqliteProvider.admins.findByUsername(process.env.ADMIN_USERNAME || 'admin');
    if (localAdmin) {
      const remoteAdmin = await supabaseProvider.admins.findByUsername(localAdmin.username);
      if (!remoteAdmin) {
        await supabaseProvider.admins.create(localAdmin.username, localAdmin.password_hash);
        console.log(`✅ Admin '${localAdmin.username}' berhasil diunggah.`);
      } else {
        // If password was updated locally, sync it
        await supabaseProvider.admins.updatePassword(localAdmin.username, localAdmin.password_hash);
        console.log(`✅ Password Admin '${localAdmin.username}' berhasil disinkronkan.`);
      }
    }

    // 2. Migrasi Soal (Questions)
    console.log('🔄 Membaca soal dari database lokal...');
    const questions = await sqliteProvider.questions.getAll();
    
    if (questions.length === 0) {
      console.log('⚠️ Tidak ada soal di lokal untuk disalin.');
    } else {
      console.log(`🔄 Ditemukan ${questions.length} soal. Menghapus soal lama di Supabase (jika ada)...`);
      await supabaseProvider.questions.deleteAll();

      console.log('🔄 Mengunggah soal ke Supabase...');
      // Supabase bulk insert limit is typically large enough, but we can do it directly.
      await supabaseProvider.questions.bulkCreate(questions);
      console.log(`✅ Berhasil mengunggah ${questions.length} soal ke Supabase!`);
    }

    // Note: We deliberately do not sync 'attempts' (riwayat ujian) because local test history 
    // is usually not meant for production cloud, and migrating relational auto-increment IDs is risky.

    console.log('🎉 PUSH DATA SELESAI!');
  } catch (err: any) {
    console.error('❌ Gagal melakukan push data:', err.message || err);
  }
}

pushData();
