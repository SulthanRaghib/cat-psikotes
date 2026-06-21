# ⚡ ProAssess Center

Sebuah platform *Computer-Aided Test* (CAT) mutakhir yang dirancang khusus untuk asesmen kognitif, psikometri, dan Tes Potensi Akademik (TPA). ProAssess Center memberikan pengalaman tes yang sangat reaktif, aman, dan dapat digunakan baik secara *online* menggunakan *database cloud* maupun *offline* melalui *database* lokal.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Local-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)

</div>

---

## 🎯 Fitur Utama

### 🧠 1. Asesmen Psikometri Terpadu (11 Subtes Kognitif)
Engine tes khusus yang menantang berbagai aspek kecerdasan otak melalui tes interaktif secara *real-time*:
- **Menghitung Huruf Sama**: Mengukur fokus dan atensi terhadap pola teks.
- **Selisih Huruf Terjauh**: Mengukur pemetaan spasial-alfabetis di otak secara instan.
- *(Dan 9 modul psikotes standar industri lainnya yang akan segera hadir).*

### 📊 2. Tes Potensi Akademik (TPA) & Learning Management
Berbeda dengan sekadar alat tes, modul TPA dilengkapi dengan berbagai fitur pendukung edukasi:
- **Mode Latihan (Real-time Feedback)**: Jawaban yang dipilih akan langsung menampilkan **kotak penjelasan matematis** serta kebenaran logika. Ideal untuk simulasi belajar mandiri.
- **Post-Test Review**: Papan rekapitulasi setelah ujian selesai yang memungkinkan kandidat untuk melihat detail jawaban mereka dibandingkan dengan kunci jawaban asli.
- Generator algoritma pintar untuk menghasilkan soal (Angka, Logika, Aritmatika, dll) secara otomatis untuk menghindari kecurangan/hapalan soal.

### 🌓 3. UI/UX Profesional & Aksesibilitas
- **Light/Dark Mode Aktif**: Mendukung deteksi preferensi sistem pengguna demi kenyamanan mata.
- **Navigasi Soal Pintar**: Grid bernomor di sisi kanan layar untuk melompat antarsoal dengan indikator warna (sudah dijawab, aktif, benar/salah di mode latihan).
- Responsif penuh di Desktop maupun Mobile.

### 💾 4. Dual Database Architecture
- **Supabase (PostgreSQL)**: Digunakan ketika variabel `NEXT_PUBLIC_SUPABASE_URL` terdeteksi di *production*. Data sesi pengguna direkam ke Cloud secara sentralisasi.
- **SQLite (Lokal/Offline)**: *Fallback* yang langsung aktif saat koneksi Supabase tidak tersedia, sehingga tes tetap bisa berjalan pada ekosistem lokal tertutup (intranet).

---

## 🏗️ Struktur Proyek

Proyek ini menggunakan struktur standar **Next.js App Router**:

```text
📁 src/
 ├── 📁 app/
 │   ├── 📁 api/           # API Routes (Backend logic, integrasi Supabase/SQLite)
 │   ├── 📁 psikotes/      # Halaman Modul 11 Subtes Psikotes
 │   ├── 📁 tpa/           # Halaman Modul Tes Potensi Akademik (TPA) & Engine Review
 │   └── layout.tsx        # Root HTML & Global Provider (ThemeProvider)
 ├── 📁 components/        # UI Reusable (GlobalHeader, SubtestMenu, ThemeProvider)
 ├── 📁 lib/               # Utility functions & Database Providers (sqlite.ts)
 └── 📁 types/             # Definisi Interfaces & Type (TypeScript)
📁 scripts/                # Script Seeding & Migrasi Database
```

---

## 💻 Prasyarat Instalasi

Pastikan Anda telah menginstal perangkat keras dan lunak berikut sebelum memulai:

- **Node.js**: Minimal versi `18.x` (Disarankan `20.x`).
- **NPM** atau **Yarn**.
- Akun **Supabase** (Jika ingin menjalankan fungsionalitas sinkronisasi Cloud).

---

## 🚀 Cara Instalasi & Penggunaan

### 1. Kloning Repositori
```bash
git clone https://github.com/Username/cat-psikotes.git
cd cat-psikotes
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Gandakan file konfigurasi `.env.example` (jika ada) atau buat file `.env` dan `.env.local` baru:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DB_URL=your_postgres_transaction_connection_string

# Akun Admin Default
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Migrasi dan Seeding Database
Pilih salah satu sesuai kebutuhan Anda (Supabase atau Lokal):

**Opsi A: Menggunakan Supabase (Cloud)**
Script ini akan membaca `SUPABASE_DB_URL` dari `.env`, menghapus *schema* lama, membuat *schema* baru, dan memasukkan (*seed*) seluruh soal ke *Cloud*.
```bash
npm run db:migrate:supabase -- --seed
```

**Opsi B: Menggunakan SQLite (Lokal)**
Script ini akan membangun dan memasukkan soal langsung ke file `data/app_v3.db`.
```bash
npm run db:seed
```

### 5. Jalankan Server Development
```bash
npm run dev
```

Akses `http://localhost:3000` melalui *browser* Anda.

---

## 🧩 Penjelasan Logika & Modul

### 1. Modul SubtestMenu (`src/components/SubtestMenu.tsx`)
Komponen ini secara dinamis menarik seluruh modul ujian dari *database* (melalui endpoint `/api/subtests`) dan mengelompokkannya berdasarkan `group_name` (misalnya: *Learning Agility Index*, *Logika Kuantitatif*, dll). Jika modul bersatus `is_active = 0`, ia akan merender *Card* sebagai "Belum Tersedia/Segera Hadir".

### 2. TPA Engine (`src/app/tpa/[id]/page.tsx`)
Merupakan jantung dari modul TPA yang memiliki *state machine* rumit:
- **Status IDLE**: Menampilkan detail tes, pilihan pengaturan durasi, dan sakelar (*toggle*) **Mode Latihan**.
- **Status PLAYING**: Soal dan *timer* dirender. Menggunakan *state* `answers` lokal yang tidak memerlukan *trip* server per klik (meminimalisir *lag*).
- **Mode Latihan (Active)**: Menerapkan fungsi kunci langsung (*instant lock*) setiap menekan jawaban. Komponen akan seketika mengevaluasi validitas terhadap `correct_answer` dan mengeluarkan kotak *Alert* (komponen UI) yang membongkar nilai `explanation` dari *database*.
- **Status REVIEW**: Mode *Read-Only* pasca-tes dengan mekanisme validasi pewarnaan instan untuk refleksi pembelajaran.

### 3. Database Abstraction Layer (`src/lib/db/providers/sqlite.ts`)
Diimplementasikan menggunakan kelas (*Class*) abstrak yang menjamin bahwa baik fungsi yang memanggil Supabase maupun SQLite akan memiliki konvensi pemanggilan yang sama. 

---

<p align="center">
  <i>Dikembangkan dengan kebanggaan untuk asesmen kognitif berbasis presisi tinggi.</i>
</p>
