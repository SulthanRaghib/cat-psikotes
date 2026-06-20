# 🧠 CAT - Sistem Ujian Psikotes Kognitif (RTC Staff)

Aplikasi **Computer Assisted Test (CAT)** modern berbasis web yang dirancang khusus untuk menyimulasikan baterai ujian psikometri tingkat tinggi. Dibangun dengan fokus pada kecepatan, akurasi, antarmuka premium (UI/UX yang sangat responsif), dan pembuatan soal secara algoritmik tanpa batas (Infinite Power Test).

---

## ✨ Fitur Utama

### 🎯 Arsitektur 11 Subtes Kognitif
Sistem dirancang untuk mendukung 11 jenis subtes kognitif dan kepribadian, dengan mekanisme ujian yang berbeda-beda.
- **Letter Match (Menghitung Huruf Sama)**: Mengukur ketelitian tingkat tinggi dengan membandingkan deretan huruf.
- *(Subtes lainnya sedang dalam tahap pengembangan aktif)*

### 🤖 Generator Algoritmik (Infinite Questions)
Berbeda dengan sistem ujian tradisional, aplikasi ini **tidak menggunakan bank soal statis**. Setiap soal di-generate secara otomatis secara matematis dan logis sesaat sebelum ditampilkan kepada peserta, menjamin tidak ada soal yang habis atau berulang.

### ⚙️ Sistem Navigasi Pintar
- **Manual Navigation**: Peserta dapat memilih jawaban, menekan tombol *Selanjutnya*, dan kembali ke soal sebelumnya (*Sebelumnya*) untuk mengoreksi jawaban.
- **Mode Latihan (Umpan Balik)**: Fitur opsional untuk memunculkan kilatan warna (hijau/merah) secara instan ketika peserta memilih jawaban.

### 🎨 Desain Premium & Mode Gelap (Dark Mode)
- **Tema Terintegrasi**: Pilihan *Light Mode*, *Dark Mode*, dan *System Preference*.
- **Desain Modern**: Memanfaatkan palet warna yang memanjakan mata, tipografi modern, kotak soal presisi, dan animasi mulus.

### 💾 Multi-Environment Database (DAL)
- 🖥️ **Lokal (Development)**: Berjalan secara *plug-and-play* menggunakan **SQLite**.
- ☁️ **Production (Cloud)**: Siap di-deploy menggunakan database skala besar **Supabase (PostgreSQL)** (ideal untuk Vercel).
- 🔄 **Otomasi Migrasi**: Tersedia perintah `migrate:fresh --seed` bawaan layaknya framework Laravel untuk menghapus bersih dan memutar ulang database Supabase Anda hanya lewat satu perintah NPM.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi Utama |
| :--- | :--- |
| **Framework Web** | Next.js 15 (App Router), React 19 |
| **Styling & UI** | Tailwind CSS, Lucide React (Ikonografi) |
| **Database Lokal** | Better-SQLite3 |
| **Database Cloud** | @supabase/supabase-js, postgres (Driver SQL) |
| **State Management** | React Hooks (useState, useEffect, dll) |
| **Penyandian & Keamanan** | BcryptJS (Enkripsi Hash) |

---

## 🚀 Prasyarat Instalasi

Sebelum memulai, pastikan sistem Anda telah terpasang:
- **Node.js** (Versi 18.x atau lebih tinggi)
- **NPM** (atau Yarn/PNPM)
- Akses ke Terminal atau Command Prompt

---

## 📦 Panduan Instalasi & Penggunaan

### 1. Kloning Repositori
Langkah pertama, unduh repositori ini ke komputer Anda dan masuk ke direktorinya.
```bash
git clone <url-repositori-anda>
cd cat-tes-psikotes-rtc-staff
npm install
```

### 2. Konfigurasi Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env` (atau buat file `.env` baru) dan sesuaikan pengaturannya:

```env
# Pilihan Database: sqlite | supabase
DB_PROVIDER="sqlite"

# === Konfigurasi Supabase (Bila Menggunakan Cloud) ===
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJh..."
SUPABASE_SERVICE_ROLE_KEY="eyJh..."

# Connection String untuk otomasi Migrasi
SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres"
```

### 3. Migrasi & Seeding Database

**Jika menggunakan SQLite (Lokal):**
Anda cukup menjalankan skrip bawaan untuk menginisialisasi 11 daftar subtes ke dalam file lokal `app_v2.db`.
```bash
npm run db:seed
```

**Jika menggunakan Supabase (Cloud):**
Aplikasi menyediakan *tools* khusus untuk menyapu bersih skema publik dan merakit ulang tabel dari awal beserta datanya (mirip `migrate:fresh --seed`).
```bash
npm run db:migrate:supabase -- --seed
```

### 4. Menjalankan Aplikasi
Mulai peladen (*server*) lokal Anda.
```bash
npm run dev
```
Buka peramban (*browser*) Anda dan arahkan ke **http://localhost:3000**.

---

## 📂 Susunan Proyek (Project Structure)

Pemahaman akan struktur map akan mempermudah navigasi Anda:

```text
├── /data                # Penyimpanan database SQLite lokal (.db)
├── /scripts             # Kumpulan skrip CLI (seeding, migrasi Supabase)
├── /src
│   ├── /app             # Struktur *App Router* Next.js
│   │   ├── /api         # Endpoint sistem REST API
│   │   └── /subtes      # Modul antarmuka utama ujian (dynamic routes)
│   ├── /components      # Komponen Visual React (UI Reusable)
│   │   ├── AnswerButtonsRow.tsx
│   │   ├── LetterMatchStimulus.tsx
│   │   └── ThemeToggle.tsx
│   ├── /lib             # Logic dan Generator Internal
│   │   ├── /db          # Data Access Layer (SQLite & Supabase Providers)
│   │   └── /generators  # Pusat Algoritma Pencetak Soal Otomatis
│   └── /types           # Definisi struktur tipe TypeScript
└── supabase_schema.sql  # Berkas panduan skema SQL manual
```

---

## 💡 Dokumentasi Fungsional & Alur Logika

Agar lebih mudah dipahami saat melakukan pengembangan, berikut adalah rincian cara kerja sistem utama:

### A. Generator Algoritmik (Contoh: Menghitung Huruf Sama)
Terletak di `/src/lib/generators/letterMatch.ts`.
- **Logic**: Algoritma akan menghasilkan dua baris *array* (Row A dan Row B).
- Ia menjamin bahwa *selalu ada* minimal 1 pasang huruf yang identik pada kolom yang sejajar, hingga maksimal 4 huruf (jadi jawabannya selalu berkisar antara 1, 2, 3, atau 4).
- Algoritma juga dirancang untuk mengacak kapitalisasi huruf dengan probabilitas tertentu untuk meningkatkan tingkat kesulitan visual (nyaru).

### B. Siklus Pengerjaan (Subtes Page)
Terletak di `/src/app/subtes/[id]/page.tsx`.
- **Bank Soal Dinamis**: Sistem menyimpan soal yang sudah digenerate ke dalam `sessionItems`.
- **Manual Navigation**: Saat peserta mengklik "Selanjutnya", sistem mengecek apakah peserta berada di ujung array soal. Jika iya, algoritma dipanggil untuk mencetak soal *baru* secara seketika (*on-the-fly*). Jika peserta sedang meninjau mundur, aplikasi hanya menaikkan indeks baca tanpa melakukan pembuatan ulang.
- **Payload Akhir**: Begitu batas waktu habis atau sesi diakhiri, seluruh log jawaban akan dibungkus rapat dan dikirim ke REST API `/api/subtests/[id]/sessions/[sessionId]/finish` untuk dikalkulasi nilai akhirnya.
