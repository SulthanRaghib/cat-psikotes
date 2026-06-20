import db from '../src/lib/db';

try {
  db.exec('ALTER TABLE questions ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
  console.log('Kolom created_at berhasil ditambahkan ke tabel questions.');
} catch (e: any) {
  console.log('Migrasi diabaikan (mungkin kolom sudah ada):', e.message);
}
