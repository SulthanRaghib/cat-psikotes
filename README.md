# 🧠 CAT - Bank Soal Psikotes RTC

Aplikasi **Computer Assisted Test (CAT)** modern berbasis web untuk mengelola dan menjalankan simulasi ujian psikotes. Dibangun dengan fokus pada kecepatan, kenyamanan baca (*UI/UX Premium*), keandalan sistem, serta skalabilitas tinggi menggunakan arsitektur *Multi-Environment Database*.

---

## ✨ Fitur Utama

### 🎓 Modul Ujian (Test Module)
- **Kategori Dinamis**: Mendukung berbagai kategori tes (Numerik, Logika & Penalaran, Verbal, Situasional).
- **Mode Timer Tersedia**: Menyediakan batasan waktu ujian yang dihitung mundur secara *real-time* dengan visualisasi yang menarik.
- **Dukungan Matematika Kompleks**: Dapat memuat dan merender rumus matematika berat (pecahan, akar, kuadrat, dsb) dengan sempurna (*KaTeX/LaTeX Integration*).
- **Navigasi Cerdas**: Panel grid soal interaktif untuk menandai, meloncati, atau meninjau ulang soal dengan mudah.
- **Analisis & Rapor Ujian**: Skor otomatis, akurasi per kategori, dan umpan balik/pembahasan lengkap di akhir tes.

### 🛡️ Modul Admin (Management Module)
- **Keamanan Berlapis**: Proteksi sesi menggunakan JSON Web Tokens (JWT) & Bcrypt.
- **Profil Admin & Ganti Password**: Dilengkapi antarmuka eksklusif berkeamanan ganda untuk mengubah sandi kredensial admin tanpa perlu menyentuh database secara langsung.
- **Manajemen Bank Soal (CRUD)**: Antarmuka *dashboard* yang bersih untuk membuat, mengubah, atau menghapus soal.
- **Import & Export Cerdas**: Anda bisa mengunduh *template* beserta contohnya, dan mengunggah ratusan soal sekaligus dalam format **CSV** maupun **JSON**.
- **Mode Pratinjau**: Label berwarna untuk memudahkan pemilahan soal berdasarkan kategori secara visual.

### ⚙️ Logic & Architecture
- **Multi-Environment Database (DAL)**: 
  - 🖥️ **Lokal**: Menggunakan **SQLite** untuk kecepatan pengembangan.
  - ☁️ **Production**: Menggunakan **Supabase (PostgreSQL)** untuk *deployment* awan (seperti Vercel).
  - 🚑 **Fallback/Dummy**: Sistem pengaman yang secara otomatis mengambil alih (*takeover*) jika database utama gagal tersambung, mencegah aplikasi lumpuh (500 Error).
- **Otomatisasi Cloud (CLI Scripts)**: Kemampuan memompa data dari lokal ke *cloud* (Supabase) secara otomatis hanya dengan satu perintah eksekusi.
- **Dark/Light Mode**: Kustomisasi tema terintegrasi secara menyeluruh.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| **Framework** | Next.js (App Router), React |
| **Styling** | Tailwind CSS, Lucide React (Icons) |
| **Database (Lokal)** | Better-SQLite3 |
| **Database (Cloud)** | Supabase (PostgreSQL) |
| **Keamanan** | Jose (JWT), BcryptJS |
| **Parser & Renderer** | React-Markdown, KaTeX, PapaParse (CSV) |

---

## 🚀 Prasyarat Instalasi

Pastikan sistem Anda telah memasang:
- **Node.js** (Versi 18.17 atau lebih tinggi)
- **NPM** atau **Yarn** atau **PNPM**
- Terminal atau Command Prompt

---

## 📦 Panduan Instalasi & Penggunaan

### 1. Kloning Repositori & Instal Dependensi
```bash
git clone <url-repositori-anda>
cd cat-tes-psikotes-rtc-staff
npm install
```

### 2. Konfigurasi Lingkungan (Environment Variables)
Ubah nama file `.env.example` menjadi `.env` (atau buat file `.env` baru jika tidak ada), lalu sesuaikan nilainya:

```env
# Konfigurasi Database Utama Aplikasi
# Pilihan: sqlite | supabase | dummy
DB_PROVIDER="sqlite"

# Kredensial Default Admin (Digunakan oleh script seed)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# JWT Secret untuk Login
JWT_SECRET="super-secret-key-psikotes-rtc-2026"

# Konfigurasi Supabase (Wajib diisi jika DB_PROVIDER="supabase")
NEXT_PUBLIC_SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""

# (OPSIONAL) Untuk otomasi Terminal "npm run db:migrate:supabase" & "npm run db:push:supabase"
# Salin Connection String (Bukan REST API) dari Settings > Database > Connection String di Supabase
SUPABASE_DB_URL=""
```

### 3. Migrasi & Seeding Database (Lokal)
Jalankan perintah berikut untuk mengisi database SQLite lokal Anda dengan kredensial admin secara otomatis:
```bash
npm run db:seed
```

### 4. Menjalankan Aplikasi (Development)
```bash
npm run dev
```
Aplikasi kini berjalan di: **http://localhost:3000** 🚀

### 5. (Lanjutan) Sinkronisasi ke Supabase (Cloud)
Jika Anda sudah mengatur kredensial Supabase di `.env` dan siap meluncur ke *Production*:
1. Jalankan `npm run db:migrate:supabase` untuk merakit struktur tabel.
2. Jalankan `npm run db:push:supabase` untuk menyedot semua soal dari lokal dan memompanya ke Supabase!

---

## 📂 Susunan Proyek (Project Structure)

```text
├── /data                # Lokasi penyimpanan database SQLite lokal (.db)
├── /scripts             # Skrip otomatisasi (seeding admin)
├── /src
│   ├── /app             # Next.js App Router (Halaman & Rute API)
│   │   ├── /admin       # Halaman dashboard admin
│   │   ├── /api         # Endpoint REST API (auth, attempts, questions)
│   │   └── /test        # Halaman simulasi ujian pengguna
│   ├── /components      # Komponen UI React yang dapat digunakan ulang
│   ├── /lib             # Utilitas sistem inti
│   │   ├── /db          # Data Access Layer (DAL) & Providers (SQLite, Supabase, Dummy)
│   │   └── auth.ts      # Pengelola Autentikasi & Sesi (JWT)
│   └── /types           # Definisi TypeScript
└── package.json         # Konfigurasi dependensi proyek
```

---

## 💡 Contoh Penggunaan

### Mengakses Dashboard Admin
1. Buka browser dan arahkan ke `http://localhost:3000/admin`.
2. Jika diminta login, masukkan kredensial yang ada di `.env` (Default: `admin` / `admin123`).
3. Dari dashboard, Anda bisa menekan tombol **Import Data** untuk mengunggah soal dalam format CSV atau JSON.

### Memulai Ujian
1. Buka halaman utama `http://localhost:3000`.
2. Klik tombol **Mulai Latihan Sekarang**.
3. Centang kategori soal yang ingin diujikan, sesuaikan jumlah waktu, lalu klik **Mulai**.
4. Selesaikan ujian dan lihat rincian skor serta pembahasan di layar hasil!
