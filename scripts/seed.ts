import db from "../src/lib/db";

const rawQuestions = [
  {
    id: "n1",
    category: "numerik",
    question: "Lanjutkan deret berikut: 2, 6, 12, 20, 30, ...",
    options: ["38", "40", "42", "44"],
    correctIndex: 2,
    explanation:
      "Selisih antar suku bertambah 2 setiap kali: +4, +6, +8, +10, +12. Maka 30 + 12 = 42.",
  },
  {
    id: "n2",
    category: "numerik",
    question: "Lanjutkan deret berikut: 5, 10, 8, 16, 14, 28, ...",
    options: ["24", "26", "30", "32"],
    correctIndex: 1,
    explanation:
      "Pola berulang: kali 2, lalu kurang 2, secara bergantian. Setelah 28 (hasil kali 2), langkah berikutnya adalah kurang 2: 28 − 2 = 26.",
  },
  {
    id: "n3",
    category: "numerik",
    question:
      "Sebuah truk tangki BBM berkapasitas 16.000 liter saat ini terisi 65%. Berapa liter yang sudah terisi?",
    options: ["9.600 liter", "10.400 liter", "10.800 liter", "11.200 liter"],
    correctIndex: 1,
    explanation: "65% × 16.000 = 10.400 liter.",
  },
  {
    id: "n4",
    category: "numerik",
    question:
      "Jarak Depot A ke SPBU B adalah 180 km. Truk melaju rata-rata 45 km/jam dan berangkat pukul 07.00 tanpa berhenti. Pukul berapa truk tiba?",
    options: ["10.00", "11.00", "11.30", "12.00"],
    correctIndex: 1,
    explanation: "Waktu tempuh = 180 ÷ 45 = 4 jam. 07.00 + 4 jam = 11.00.",
  },
  {
    id: "n5",
    category: "numerik",
    question:
      "Harga BBM Solar Rp6.800/liter. Sebuah SPBU membeli 12.000 liter. Berapa total biayanya?",
    options: ["Rp78.600.000", "Rp79.200.000", "Rp81.600.000", "Rp84.000.000"],
    correctIndex: 2,
    explanation: "6.800 × 12.000 = Rp81.600.000.",
  },
  {
    id: "n6",
    category: "numerik",
    question:
      "Perbandingan jumlah truk tangki kecil : besar di suatu depot adalah 3 : 5. Jika jumlah truk besar ada 40 unit, berapa jumlah truk kecil?",
    options: ["20", "24", "28", "30"],
    correctIndex: 1,
    explanation: "3/5 × 40 = 24 unit.",
  },
  {
    id: "n7",
    category: "numerik",
    question: "Lanjutkan deret huruf: A, C, F, J, O, ...",
    options: ["S", "T", "U", "V"],
    correctIndex: 2,
    explanation:
      "Posisi huruf: A(1), C(3, +2), F(6, +3), J(10, +4), O(15, +5), berikutnya +6 = 21, yaitu huruf U.",
  },
  {
    id: "n8",
    category: "numerik",
    question:
      "Satu pompa di SPBU dapat melayani 6 mobil per jam. Jika 2 pompa beroperasi bersamaan selama 3,5 jam, berapa mobil yang terlayani?",
    options: ["36", "40", "42", "45"],
    correctIndex: 2,
    explanation:
      "2 pompa × 6 mobil/jam = 12 mobil/jam. 12 × 3,5 jam = 42 mobil.",
  },
  {
    id: "n9",
    category: "numerik",
    question:
      "Tangki timbun berkapasitas 50.000 liter saat ini berisi 18.000 liter. Jika pemakaian rata-rata 3.000 liter/hari tanpa pengisian ulang, dalam berapa hari tangki akan kosong?",
    options: ["5 hari", "6 hari", "7 hari", "8 hari"],
    correctIndex: 1,
    explanation: "18.000 ÷ 3.000 = 6 hari.",
  },
  {
    id: "n10",
    category: "numerik",
    question: "15% dari 240, kemudian dikurangi 8, hasilnya adalah...",
    options: ["26", "28", "30", "32"],
    correctIndex: 1,
    explanation: "15% × 240 = 36. 36 − 8 = 28.",
  },
  {
    id: "l1",
    category: "logika",
    question:
      "Semua sopir truk tangki wajib memiliki SIM B2. Budi adalah sopir truk tangki. Kesimpulan yang tepat adalah...",
    options: [
      "Budi wajib memiliki SIM B2",
      "Budi tidak perlu SIM B2",
      "Semua sopir adalah Budi",
      "Tidak dapat disimpulkan",
    ],
    correctIndex: 0,
    explanation:
      "Ini adalah silogisme valid: semua anggota kelompok (sopir truk tangki) memenuhi syarat tertentu, dan Budi adalah anggota kelompok itu, sehingga syarat itu pasti berlaku padanya.",
  },
  {
    id: "l2",
    category: "logika",
    question:
      "Jika hari hujan, maka jalan menjadi licin. Hari ini jalan tidak licin. Kesimpulan yang tepat adalah...",
    options: [
      "Hari ini hujan",
      "Hari ini tidak hujan",
      "Tidak dapat disimpulkan",
      "Jalan basah",
    ],
    correctIndex: 1,
    explanation:
      "Ini pola modus tollens: jika konsekuen (jalan licin) terbukti salah, maka anteseden (hujan) juga pasti salah.",
  },
  {
    id: "l3",
    category: "logika",
    question: "SPBU : BBM = Apotek : ...",
    options: ["Obat", "Dokter", "Resep", "Pasien"],
    correctIndex: 0,
    explanation:
      "SPBU adalah tempat menjual/menyalurkan BBM, sebagaimana apotek adalah tempat menjual/menyalurkan obat.",
  },
  {
    id: "l4",
    category: "logika",
    question:
      "Semua A adalah B. Sebagian B adalah C. Kesimpulan yang pasti benar adalah...",
    options: [
      "Semua A adalah C",
      "Sebagian A adalah C",
      "Tidak dapat dipastikan hubungan antara A dan C",
      "Tidak ada A yang merupakan C",
    ],
    correctIndex: 2,
    explanation:
      "Karena hanya sebagian B yang berstatus C, kita tidak tahu apakah anggota A jatuh pada bagian B yang itu atau bukan — hubungan A dan C tidak dapat dipastikan dari premis ini.",
  },
  {
    id: "l5",
    category: "logika",
    question: "Lanjutkan deret: 3, 9, 27, 81, ...",
    options: ["162", "216", "243", "324"],
    correctIndex: 2,
    explanation: "Setiap suku dikalikan 3: 81 × 3 = 243.",
  },
  {
    id: "l6",
    category: "logika",
    question:
      "Manakah yang tidak sekelompok dengan yang lain: Solar, Pertalite, Pertamax, Oli, Minyak Tanah?",
    options: ["Solar", "Pertamax", "Oli", "Minyak Tanah"],
    correctIndex: 2,
    explanation:
      "Solar, Pertalite, Pertamax, dan Minyak Tanah adalah jenis bahan bakar (BBM), sedangkan Oli adalah pelumas, bukan bahan bakar.",
  },
  {
    id: "l7",
    category: "logika",
    question:
      "Semua RTC Staff bekerja dengan sistem shift. Andi bukan RTC Staff. Kesimpulan yang tepat adalah...",
    options: [
      "Andi tidak bekerja shift",
      "Andi bekerja shift",
      "Tidak dapat disimpulkan apakah Andi bekerja shift",
      "Andi adalah RTC Staff",
    ],
    correctIndex: 2,
    explanation:
      "Pernyataan awal hanya menjamin RTC Staff bekerja shift; tidak menjelaskan pekerjaan lain yang juga shift. Menyimpulkan Andi pasti tidak shift adalah kesalahan logika (penyangkalan anteseden).",
  },
  {
    id: "l8",
    category: "logika",
    question: "Lengkapi alur distribusi BBM: Depot → ... → SPBU → Konsumen",
    options: [
      "Transportasi/Pengangkutan BBM",
      "Produksi BBM",
      "Penambangan minyak mentah",
      "Ekspor",
    ],
    correctIndex: 0,
    explanation:
      "Setelah BBM keluar dari depot, tahap berikutnya sebelum sampai ke SPBU adalah proses pengangkutan/transportasi menggunakan truk tangki — inilah area yang dipantau oleh RTC Staff.",
  },
  {
    id: "l9",
    category: "logika",
    question:
      "Jika A lebih cepat dari B, dan B lebih cepat dari C, maka C ... dibanding A.",
    options: [
      "lebih lambat",
      "lebih cepat",
      "sama cepat",
      "tidak dapat ditentukan",
    ],
    correctIndex: 0,
    explanation:
      "Hubungan transitif: A > B > C dalam kecepatan, sehingga C pasti lebih lambat dari A.",
  },
  {
    id: "l10",
    category: "logika",
    question:
      "Jika SOP keselamatan dipatuhi, maka risiko kecelakaan berkurang. Pada kenyataannya risiko kecelakaan di suatu depot tidak berkurang. Kesimpulan yang tepat adalah...",
    options: [
      "SOP keselamatan dipatuhi",
      "SOP keselamatan tidak dipatuhi",
      "Risiko kecelakaan selalu ada",
      "Tidak dapat disimpulkan",
    ],
    correctIndex: 1,
    explanation:
      "Modus tollens: karena akibat yang diharapkan (risiko berkurang) tidak terjadi, maka syaratnya (SOP dipatuhi) pasti tidak terpenuhi.",
  },
  {
    id: "v1",
    category: "verbal",
    question: "Sinonim kata KOORDINASI adalah...",
    options: ["Penyelarasan", "Perselisihan", "Pemisahan", "Pengabaian"],
    correctIndex: 0,
    explanation:
      "Koordinasi berarti mengatur/menyelaraskan kegiatan agar berjalan selaras, sehingga sinonimnya adalah penyelarasan.",
  },
  {
    id: "v2",
    category: "verbal",
    question: "Antonim kata EFISIEN adalah...",
    options: ["Boros", "Hemat", "Cepat", "Tepat"],
    correctIndex: 0,
    explanation:
      "Efisien berarti hemat dalam penggunaan sumber daya; lawan katanya adalah boros.",
  },
  {
    id: "v3",
    category: "verbal",
    question: "Sinonim kata MONITORING adalah...",
    options: ["Pengawasan", "Pengabaian", "Perbaikan", "Produksi"],
    correctIndex: 0,
    explanation:
      "Monitoring berarti memantau atau mengawasi suatu proses secara berkelanjutan.",
  },
  {
    id: "v4",
    category: "verbal",
    question: "Antonim kata KELALAIAN adalah...",
    options: ["Kecermatan", "Kecerobohan", "Kelambatan", "Kerusakan"],
    correctIndex: 0,
    explanation:
      "Kelalaian berarti sikap kurang hati-hati; lawan katanya adalah kecermatan atau kehati-hatian.",
  },
  {
    id: "v5",
    category: "verbal",
    question: "PILOT : PESAWAT = SOPIR : ...",
    options: ["Kendaraan", "Jalan raya", "SIM", "Bahan bakar"],
    correctIndex: 0,
    explanation:
      "Pilot mengoperasikan pesawat, sebagaimana sopir mengoperasikan kendaraan.",
  },
  {
    id: "v6",
    category: "verbal",
    question: "Sinonim kata DISTRIBUSI adalah...",
    options: ["Penyaluran", "Penyimpanan", "Pengumpulan", "Produksi"],
    correctIndex: 0,
    explanation:
      "Distribusi berarti proses penyaluran barang dari satu pihak ke pihak lain.",
  },
  {
    id: "v7",
    category: "verbal",
    question: "Antonim kata PROAKTIF adalah...",
    options: ["Reaktif", "Aktif", "Dinamis", "Responsif"],
    correctIndex: 0,
    explanation:
      "Proaktif berarti bertindak lebih dulu mengantisipasi masalah; lawan katanya adalah reaktif, yaitu baru bertindak setelah masalah terjadi.",
  },
  {
    id: "v8",
    category: "verbal",
    question: "Makna kata EVAKUASI yang paling tepat adalah...",
    options: [
      "Pemindahan orang/barang ke tempat aman saat kondisi bahaya",
      "Perbaikan kendaraan yang rusak",
      "Pengisian ulang bahan bakar",
      "Pelaporan kegiatan rutin harian",
    ],
    correctIndex: 0,
    explanation:
      "Evakuasi adalah proses memindahkan orang atau barang dari lokasi berbahaya ke tempat yang lebih aman.",
  },
  {
    id: "v9",
    category: "verbal",
    question: "DOKTER : PASIEN = RTC STAFF : ...",
    options: [
      "Armada/truk tangki yang dipantau",
      "Pasien",
      "Resep obat",
      "Rumah sakit",
    ],
    correctIndex: 0,
    explanation:
      "Dokter menangani/memantau kondisi pasien, sebagaimana RTC Staff memantau kondisi dan pergerakan armada truk tangki.",
  },
  {
    id: "v10",
    category: "verbal",
    question: "Sinonim kata KOMPETEN adalah...",
    options: ["Cakap", "Lemah", "Ragu", "Baru"],
    correctIndex: 0,
    explanation:
      "Kompeten berarti memiliki kemampuan/kecakapan yang memadai untuk suatu tugas.",
  },
  {
    id: "s1",
    category: "situasional",
    question:
      "Saat memantau GPS armada, Anda melihat satu truk tangki keluar dari rute yang ditentukan tanpa pemberitahuan. Apa langkah pertama yang paling tepat?",
    options: [
      "Membiarkannya karena mungkin ada alasan tertentu",
      "Segera menghubungi sopir untuk konfirmasi dan mencatat sesuai prosedur",
      "Langsung melaporkan ke media sosial perusahaan",
      "Menunggu sampai truk kembali ke rute dengan sendirinya",
    ],
    correctIndex: 1,
    explanation:
      "Sebagai pemantau lalu lintas armada, respons proaktif berupa klarifikasi langsung dan pencatatan sesuai SOP adalah sikap yang menunjukkan tanggung jawab dan kepedulian terhadap keselamatan.",
  },
  {
    id: "s2",
    category: "situasional",
    question:
      "Anda menemukan data laporan pengiriman yang tidak sesuai dengan catatan GPS. Apa yang sebaiknya dilakukan?",
    options: [
      "Mengabaikannya karena selisihnya kecil",
      "Memperbaiki data sendiri agar terlihat rapi",
      "Memverifikasi ulang lalu melaporkan ketidaksesuaian kepada pihak terkait",
      "Menunggu ditegur atasan baru bertindak",
    ],
    correctIndex: 2,
    explanation:
      "Ketelitian dan integritas data sangat penting dalam operasi distribusi BBM. Verifikasi dan pelaporan sesuai jalur resmi mencegah kesalahan data tersembunyi yang bisa berdampak besar.",
  },
  {
    id: "s3",
    category: "situasional",
    question:
      "Rekan kerja Anda kewalahan memantau banyak armada sekaligus saat shift sibuk. Sikap terbaik Anda adalah...",
    options: [
      "Membantu sesuai kapasitas dan berkoordinasi dengannya",
      "Membiarkan karena bukan tugas Anda",
      "Melaporkan kelambanannya ke atasan tanpa membantu",
      "Fokus pada pekerjaan sendiri sepenuhnya",
    ],
    correctIndex: 0,
    explanation:
      "Kerja sama tim adalah nilai penting di lingkungan kerja yang padat dan berisiko tinggi seperti pemantauan distribusi BBM; saling membantu menjaga kelancaran operasi secara keseluruhan.",
  },
  {
    id: "s4",
    category: "situasional",
    question:
      "Anda mendapat tekanan waktu untuk segera menyelesaikan laporan, namun ada data yang masih meragukan. Apa yang Anda lakukan?",
    options: [
      "Tetap mengirim laporan apa adanya agar tidak terlambat",
      "Memastikan keakuratan data lebih dulu meski perlu waktu tambahan",
      "Mengisi data meragukan dengan perkiraan sendiri",
      "Meminta rekan lain menyelesaikan laporan tanpa pengecekan",
    ],
    correctIndex: 1,
    explanation:
      "Akurasi data terkait operasional BBM lebih diutamakan daripada kecepatan semata, karena kesalahan data dapat berdampak pada keselamatan dan pengambilan keputusan.",
  },
  {
    id: "s5",
    category: "situasional",
    question:
      "Anda menyadari ada indikasi truk tangki melebihi batas kecepatan secara berulang. Tindakan paling tepat adalah...",
    options: [
      "Mengabaikan karena truk belum pernah mengalami insiden",
      "Mendokumentasikan kejadian dan melaporkannya ke pihak berwenang sesuai SOP",
      "Menegur sopir secara pribadi tanpa pencatatan",
      "Menunggu insiden benar-benar terjadi baru bertindak",
    ],
    correctIndex: 1,
    explanation:
      "Pendokumentasian dan pelaporan sesuai SOP keselamatan (HSE) adalah langkah preventif yang tepat untuk mencegah potensi kecelakaan sebelum terjadi.",
  },
  {
    id: "s6",
    category: "situasional",
    question:
      "Atasan memberi tugas baru di luar deskripsi kerja biasa secara mendadak. Sikap yang mencerminkan profesionalisme adalah...",
    options: [
      "Menolak karena bukan tanggung jawab utama",
      "Menerima dengan terbuka, mengonfirmasi prioritas, dan mengerjakannya secara bertanggung jawab",
      "Mengerjakan asal-asalan karena bukan tugas rutin",
      "Menunda tanpa memberi kabar",
    ],
    correctIndex: 1,
    explanation:
      "Fleksibilitas dan komunikasi yang baik terhadap perubahan prioritas kerja adalah sikap profesional yang dicari dalam lingkungan kerja operasional yang dinamis.",
  },
  {
    id: "s7",
    category: "situasional",
    question:
      "Terjadi insiden kecil (nearmiss) tanpa kerusakan atau cedera. Apakah perlu dilaporkan?",
    options: [
      "Tidak perlu, karena tidak ada kerugian",
      "Ya, tetap dilaporkan sesuai budaya HSE karena nearmiss adalah indikator dini risiko",
      "Cukup dibicarakan secara informal",
      "Hanya dilaporkan jika ditanya atasan",
    ],
    correctIndex: 1,
    explanation:
      "Pelaporan nearmiss adalah bagian penting dari budaya keselamatan (HSE) untuk mencegah insiden serupa terjadi dengan dampak yang lebih besar di kemudian hari.",
  },
  {
    id: "s8",
    category: "situasional",
    question:
      "Anda menerima dua instruksi berbeda dari dua atasan terkait prioritas pekerjaan hari itu. Tindakan terbaik adalah...",
    options: [
      "Memilih salah satu sesuai penilaian sendiri tanpa konfirmasi",
      "Mengerjakan keduanya secara bersamaan tanpa klarifikasi",
      "Mengklarifikasi langsung kepada kedua pihak untuk menyamakan prioritas",
      "Mengabaikan keduanya sampai ada instruksi tunggal",
    ],
    correctIndex: 2,
    explanation:
      "Klarifikasi langsung mencegah miskomunikasi dan memastikan pekerjaan dikerjakan sesuai prioritas yang disepakati bersama.",
  },
  {
    id: "s9",
    category: "situasional",
    question:
      "Anda harus memantau data dalam jumlah besar secara berulang dalam waktu lama. Sikap yang mendukung kinerja optimal adalah...",
    options: [
      "Bekerja secepat mungkin tanpa jeda agar cepat selesai",
      "Menjaga fokus dan konsistensi, mengambil jeda sewajarnya, serta menggunakan checklist",
      "Mengurangi cakupan pemantauan agar tidak lelah",
      "Mendelegasikan seluruh tugas ke rekan lain",
    ],
    correctIndex: 1,
    explanation:
      "Pekerjaan pemantauan yang repetitif memerlukan strategi menjaga fokus jangka panjang, seperti penggunaan checklist dan jeda sewajarnya, agar ketelitian tetap terjaga.",
  },
  {
    id: "s10",
    category: "situasional",
    question:
      "Anda melihat pelanggaran SOP dilakukan oleh rekan kerja yang lebih senior. Sikap yang tepat adalah...",
    options: [
      "Diam saja karena dia lebih senior",
      "Tetap menyampaikan/melaporkan sesuai prosedur, karena SOP berlaku untuk semua",
      "Membicarakannya ke rekan lain tanpa melapor resmi",
      "Menunggu pelanggaran terjadi berulang baru bertindak",
    ],
    correctIndex: 1,
    explanation:
      "Kepatuhan terhadap SOP keselamatan berlaku untuk semua pihak tanpa terkecuali; melaporkan pelanggaran sesuai prosedur mencerminkan integritas, bukan ketidaksopanan.",
  },
];

function seed() {
  console.log("Seeding data to database...");
  const insert = db.prepare(`
    INSERT OR REPLACE INTO questions (id, category, question, options, correct_index, explanation)
    VALUES (@id, @category, @question, @options, @correct_index, @explanation)
  `);

  const insertMany = db.transaction((questions: any[]) => {
    for (const q of questions) {
      insert.run({
        id: q.id,
        category: q.category,
        question: q.question,
        options: JSON.stringify(q.options),
        correct_index: q.correctIndex,
        explanation: q.explanation,
      });
    }
  });

  insertMany(rawQuestions);
  console.log(`Seeded ${rawQuestions.length} questions successfully!`);
}

seed();
