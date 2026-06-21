export function generateTpaQuestions(subtestId: string, count: number = 100) {
  const questions = [];
  let currentNumber = 1;

  // Helper to shuffle options
  const shuffleOptions = (correct: string, wrongs: string[]) => {
    const all = [correct, ...wrongs];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const correctIndex = all.indexOf(correct);
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return {
      option_a: all[0],
      option_b: all[1],
      option_c: all[2],
      option_d: all[3],
      option_e: all[4] || null,
      correct_answer: letters[correctIndex]
    };
  };

  // 1. Deret Angka (Number Series) - 30 questions
  for (let i = 0; i < 30 && currentNumber <= count; i++) {
    const type = i % 5;
    let series: number[] = [];
    let nextNumber = 0;
    let explanation = "";
    
    if (type === 0) {
      // Arithmetic
      const start = Math.floor(Math.random() * 20) + 1;
      const step = Math.floor(Math.random() * 15) + 2;
      series = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
      nextNumber = start + step * 5;
      explanation = `Pola deret aritmatika ini adalah penambahan konstan +${step} pada setiap angka sebelumnya. Angka terakhir adalah ${start + step * 4}, ditambah ${step} menjadi ${nextNumber}.`;
    } else if (type === 1) {
      // Geometric
      const start = Math.floor(Math.random() * 5) + 2;
      const mult = Math.floor(Math.random() * 3) + 2;
      series = [start, start * mult, start * mult ** 2, start * mult ** 3, start * mult ** 4];
      nextNumber = start * mult ** 5;
      explanation = `Pola deret geometri ini adalah perkalian konstan x${mult} pada setiap angka sebelumnya. Angka terakhir dikali ${mult} menghasilkan ${nextNumber}.`;
    } else if (type === 2) {
      // Fibonacci-like
      let a = Math.floor(Math.random() * 5) + 1;
      let b = Math.floor(Math.random() * 5) + 1;
      series = [a, b];
      for (let j = 0; j < 4; j++) {
        const next = a + b;
        series.push(next);
        a = b;
        b = next;
      }
      nextNumber = a + b;
      explanation = `Ini adalah pola deret mirip Fibonacci dimana suatu angka adalah hasil penjumlahan dari dua angka sebelumnya (${a} + ${b} = ${nextNumber}).`;
    } else if (type === 3) {
      // Alternating series
      const start1 = Math.floor(Math.random() * 20) + 10;
      const start2 = Math.floor(Math.random() * 50) + 50;
      const step1 = Math.floor(Math.random() * 5) + 2;
      const step2 = -1 * (Math.floor(Math.random() * 5) + 2);
      series = [start1, start2, start1 + step1, start2 + step2, start1 + step1 * 2, start2 + step2 * 2];
      nextNumber = start1 + step1 * 3;
      explanation = `Ini adalah deret berselang (alternating). Sub-deret ganjil polanya +${step1}, sedangkan sub-deret genap polanya ${step2}. Angka selanjutnya meneruskan sub-deret ganjil.`;
    } else {
      // Squares/Cubes
      const start = Math.floor(Math.random() * 5) + 2;
      series = [start**2, (start+1)**2, (start+2)**2, (start+3)**2, (start+4)**2];
      nextNumber = (start+5)**2;
      explanation = `Pola deret ini adalah bilangan kuadrat berurutan dimulai dari ${start}². Angka selanjutnya adalah (${start+5})² = ${nextNumber}.`;
    }

    const wrongs = [
      (nextNumber + 1).toString(),
      (nextNumber - 1).toString(),
      (nextNumber + 2).toString(),
      (nextNumber - 2).toString()
    ];
    
    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Berapakah angka selanjutnya dari deret berikut: ${series.join(', ')}, ...`,
      image_url: null,
      explanation,
      ...shuffleOptions(nextNumber.toString(), wrongs)
    });
  }

  // 2. Aritmatika Sosial & Persentase (20 questions)
  for (let i = 0; i < 20 && currentNumber <= count; i++) {
    const basePrice = (Math.floor(Math.random() * 90) + 10) * 10000;
    const discount = (Math.floor(Math.random() * 5) + 1) * 10;
    const finalPrice = basePrice * (1 - discount / 100);
    
    const wrongs = [
      (finalPrice + 50000).toString(),
      (finalPrice - 10000).toString(),
      (basePrice * (1 - (discount-10)/100)).toString(),
      (basePrice * (1 - (discount+10)/100)).toString()
    ];

    const explanation = `Harga awal Rp${basePrice.toLocaleString('id-ID')}. Diskon ${discount}% = Rp${(basePrice * discount / 100).toLocaleString('id-ID')}. Maka harga akhir = Rp${basePrice.toLocaleString('id-ID')} - Rp${(basePrice * discount / 100).toLocaleString('id-ID')} = Rp${finalPrice.toLocaleString('id-ID')}.`;

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Sebuah barang seharga Rp${basePrice.toLocaleString('id-ID')} mendapat diskon ${discount}%. Berapakah harga akhir barang tersebut?`,
      image_url: null,
      explanation,
      ...shuffleOptions(finalPrice.toString(), wrongs)
    });
  }

  // 3. Kecepatan, Jarak, Waktu (20 questions)
  for (let i = 0; i < 20 && currentNumber <= count; i++) {
    const speed = (Math.floor(Math.random() * 6) + 4) * 10; // 40 to 90 km/h
    const timeHours = Math.floor(Math.random() * 4) + 2; // 2 to 5 hours
    const distance = speed * timeHours;
    
    const wrongs = [
      (distance + 20).toString(),
      (distance - 10).toString(),
      (speed * (timeHours + 1)).toString(),
      (speed * (timeHours - 1)).toString()
    ];

    const explanation = `Rumus Jarak = Kecepatan x Waktu. Jarak = ${speed} km/jam x ${timeHours} jam = ${distance} km.`;

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Sebuah mobil melaju dengan kecepatan rata-rata ${speed} km/jam. Jika mobil tersebut melaju selama ${timeHours} jam, berapakah jarak yang ditempuh?`,
      image_url: null,
      explanation,
      ...shuffleOptions(distance.toString() + ' km', wrongs.map(w => w + ' km'))
    });
  }

  // 4. Perbandingan & Pekerja (20 questions)
  for (let i = 0; i < 20 && currentNumber <= count; i++) {
    const workers1 = Math.floor(Math.random() * 10) + 5;
    const days1 = Math.floor(Math.random() * 20) + 10;
    const workers2 = workers1 + (Math.floor(Math.random() * 5) + 2);
    // w1 * d1 = w2 * d2 -> d2 = (w1 * d1) / w2
    const exactDays = (workers1 * days1) / workers2;
    const days2 = Math.round(exactDays * 10) / 10; // round to 1 decimal
    
    const wrongs = [
      Math.round((exactDays + 2) * 10) / 10,
      Math.round((exactDays - 1) * 10) / 10,
      Math.round((exactDays + 5) * 10) / 10,
      Math.round((exactDays * 1.5) * 10) / 10
    ];

    const explanation = `Ini adalah perbandingan berbalik nilai. (Pekerja 1 x Waktu 1) = (Pekerja 2 x Waktu 2). Sehingga: ${workers1} x ${days1} = ${workers2} x Waktu2. Waktu2 = ${workers1 * days1} / ${workers2} = ${days2} hari.`;

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Jika ${workers1} pekerja dapat menyelesaikan sebuah proyek dalam ${days1} hari. Berapa hari waktu yang dibutuhkan jika proyek dikerjakan oleh ${workers2} pekerja? (Bulatkan 1 angka di belakang koma)`,
      image_url: null,
      explanation,
      ...shuffleOptions(days2.toString() + ' hari', wrongs.map(w => w.toString() + ' hari'))
    });
  }

  // 5. Geometri Dasar (10 questions)
  for (let i = 0; i < 10 && currentNumber <= count; i++) {
    const length = Math.floor(Math.random() * 15) + 5;
    const width = Math.floor(Math.random() * 10) + 3;
    const area = length * width;
    
    const wrongs = [
      (area + 10).toString(),
      (area - 5).toString(),
      (length * 2 + width * 2).toString(), // perimeter trap
      (area + length).toString()
    ];

    const explanation = `Rumus luas persegi panjang adalah Panjang x Lebar. Luas = ${length} m x ${width} m = ${area} m².`;

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Sebuah kebun berbentuk persegi panjang dengan panjang ${length} meter dan lebar ${width} meter. Berapakah luas kebun tersebut?`,
      image_url: null,
      explanation,
      ...shuffleOptions(area.toString() + ' m²', wrongs.map(w => w + ' m²'))
    });
  }

  // Fill the rest if count > 100 with random generic math
  while (currentNumber <= count) {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const ans = a * b;
    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Berapakah hasil dari ${a} x ${b}?`,
      image_url: null,
      explanation: `Operasi perkalian dasar: ${a} dikali ${b} menghasilkan ${ans}.`,
      ...shuffleOptions(ans.toString(), [
        (ans + a).toString(),
        (ans - b).toString(),
        (ans + 10).toString(),
        (ans - 100).toString()
      ])
    });
  }

  return questions;
}

export function generateSyllogismQuestions(subtestId: string, count: number = 50) {
  const questions = [];
  let currentNumber = 1;

  const shuffleOptions = (correct: string, wrongs: string[]) => {
    const all = [correct, ...wrongs];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const correctIndex = all.indexOf(correct);
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return {
      option_a: all[0],
      option_b: all[1],
      option_c: all[2],
      option_d: all[3],
      option_e: all[4] || null,
      correct_answer: letters[correctIndex]
    };
  };

  const subjects = ['karyawan', 'mahasiswa', 'peserta ujian', 'teknisi', 'insinyur', 'pelamar', 'pekerja tambang', 'peneliti', 'dokter', 'guru'];
  const properties = ['memakai seragam', 'lulus tes', 'mendapat bonus', 'hadir tepat waktu', 'memiliki sertifikat', 'memahami prosedur', 'mendapat promosi', 'bekerja lembur', 'mengikuti pelatihan', 'mendapat cuti'];
  const conditions = ['hujan turun deras', 'cuaca cerah', 'mesin rusak', 'listrik padam', 'target tercapai', 'harga saham naik', 'proyek selesai', 'bos marah', 'jalan macet', 'alarm berbunyi'];
  const actions = ['rapat ditunda', 'karyawan libur', 'produksi dihentikan', 'semua orang panik', 'bonus dibagikan', 'investor senang', 'pelanggan komplain', 'kantor ditutup', 'jadwal diubah', 'pekerja dievakuasi'];
  const consequences = ['perusahaan rugi', 'gaji dipotong', 'suasana menjadi tegang', 'keuntungan menurun', 'media meliput', 'pekerjaan menumpuk', 'sistem di-restart', 'manajer dipanggil', 'semua orang pulang', 'kegiatan dibatalkan'];

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const getUnique = (arr: string[], c: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, c);
  };

  for (let i = 0; i < count; i++) {
    const type = i % 5;
    let question_text = '';
    let correct_answer = '';
    let explanation = '';
    let wrongs: string[] = [];

    if (type === 0) {
      const A = getRandom(conditions);
      const B = getRandom(actions);
      question_text = `Premis 1: Jika ${A}, maka ${B}.\nPremis 2: Hari ini ${A}.\n\nKesimpulan yang tepat adalah...`;
      correct_answer = `Hari ini ${B}.`;
      wrongs = [
        `Hari ini tidak ${B}.`,
        `Jika tidak ${A}, maka ${B}.`,
        `Hari ini tidak ${A} dan tidak ${B}.`,
        `Tidak dapat ditarik kesimpulan.`
      ];
      explanation = `Ini adalah bentuk Modus Ponens (P \u2192 Q, P terjadi, maka Q pasti terjadi). Karena premis 2 menyatakan "${A}" terjadi, maka kesimpulan mutlaknya adalah "${B}".`;
    } else if (type === 1) {
      const A = getRandom(conditions);
      const B = getRandom(actions);
      question_text = `Premis 1: Jika ${A}, maka ${B}.\nPremis 2: Ternyata tidak ${B}.\n\nKesimpulan yang tepat adalah...`;
      correct_answer = `Ternyata tidak ${A}.`;
      wrongs = [
        `Ternyata ${A}.`,
        `Mungkin ${A} dan mungkin ${B}.`,
        `Hari ini ${A} tetapi tidak ${B}.`,
        `Tidak dapat ditarik kesimpulan.`
      ];
      explanation = `Ini adalah bentuk Modus Tollens (P \u2192 Q, \u007EQ terjadi, maka \u007EP pasti terjadi). Karena akibatnya ("${B}") tidak terjadi, maka pasti sebabnya ("${A}") juga tidak terjadi.`;
    } else if (type === 2) {
      const [A, B, C] = getUnique([...conditions, ...actions, ...consequences], 3);
      question_text = `Premis 1: Jika ${A}, maka ${B}.\nPremis 2: Jika ${B}, maka ${C}.\n\nKesimpulan yang tepat adalah...`;
      correct_answer = `Jika ${A}, maka ${C}.`;
      wrongs = [
        `Jika ${C}, maka ${A}.`,
        `Jika tidak ${A}, maka ${C}.`,
        `Jika ${A}, maka tidak ${C}.`,
        `Semua jawaban salah.`
      ];
      explanation = `Ini adalah Silogisme Hipotesis berantai (P \u2192 Q dan Q \u2192 R, maka P \u2192 R). Rantai sebab akibat langsung menghubungkan P ("${A}") dengan R ("${C}").`;
    } else if (type === 3) {
      const subj = getRandom(subjects);
      const [prop1, prop2] = getUnique(properties, 2);
      question_text = `Premis 1: Semua ${subj} ${prop1}.\nPremis 2: Sebagian ${subj} ${prop2}.\n\nKesimpulan yang tepat adalah...`;
      correct_answer = `Sebagian ${subj} yang ${prop2} pasti ${prop1}.`;
      wrongs = [
        `Semua ${subj} ${prop2} dan ${prop1}.`,
        `Sebagian ${subj} tidak ${prop1} tetapi ${prop2}.`,
        `Semua yang ${prop2} pasti bukan ${subj}.`,
        `Tidak dapat ditarik kesimpulan.`
      ];
      explanation = `Hukum silogisme: Jika ada premis "sebagian" (partikular), maka kesimpulan juga harus "sebagian". Karena SEMUA ${subj} pasti ${prop1}, maka SEBAGIAN ${subj} yang ${prop2} sudah pasti juga ${prop1}.`;
    } else {
      const subjs = getUnique(subjects, 2);
      const prop = getRandom(properties);
      question_text = `Premis 1: Semua ${subjs[0]} adalah ${subjs[1]}.\nPremis 2: Semua ${subjs[1]} ${prop}.\n\nKesimpulan yang tepat adalah...`;
      correct_answer = `Semua ${subjs[0]} ${prop}.`;
      wrongs = [
        `Sebagian ${subjs[0]} ${prop}.`,
        `Semua yang ${prop} adalah ${subjs[0]}.`,
        `Semua ${subjs[1]} adalah ${subjs[0]}.`,
        `Semua jawaban salah.`
      ];
      explanation = `Hukum silogisme: Karena himpunan P (${subjs[0]}) berada di dalam Q (${subjs[1]}), dan Q memiliki sifat R (${prop}), maka P secara mutlak juga memiliki sifat R.`;
    }

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text,
      image_url: null,
      explanation,
      ...shuffleOptions(correct_answer, wrongs)
    });
  }
  return questions;
}

export function generateReadingQuestions(subtestId: string) {
  const questions = [];
  let currentNumber = 1;

  const shuffleOptions = (correct: string, wrongs: string[]) => {
    const all = [correct, ...wrongs];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const correctIndex = all.indexOf(correct);
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return {
      option_a: all[0],
      option_b: all[1],
      option_c: all[2],
      option_d: all[3],
      option_e: all[4] || null,
      correct_answer: letters[correctIndex]
    };
  };

  const passages = [
    {
      text: "Teks 1 untuk Soal 1-3\n\nDalam industri hulu migas, operasi pengeboran (drilling) merupakan salah satu tahapan dengan risiko tinggi, baik secara finansial maupun keselamatan. Faktor utama yang menyebabkan insiden selama pengeboran adalah hilangnya kendali terhadap tekanan sumur atau yang biasa dikenal dengan istilah 'blowout'. Untuk mencegah hal ini, setiap rig dilengkapi dengan Blowout Preventer (BOP). BOP bertindak sebagai katup penutup darurat yang sangat besar, dirancang untuk menyegel, mengendalikan, dan memonitor sumur minyak dan gas untuk mencegah pelepasan fluida yang tidak terkendali. Inspeksi dan pengujian BOP wajib dilakukan secara berkala sebelum dan selama proses pengeboran berlangsung. Kegagalan melakukan pengujian ini dapat berakibat fatal, tidak hanya menyebabkan kerugian alat miliaran rupiah, tetapi juga hilangnya nyawa pekerja serta kerusakan lingkungan yang parah akibat tumpahan minyak.",
      items: [
        {
          q: "Gagasan utama dari paragraf di atas adalah...",
          ans: "Pentingnya fungsi dan pengujian Blowout Preventer (BOP) dalam mencegah insiden pengeboran.",
          wrongs: [
            "Kerugian finansial dan lingkungan akibat tumpahan minyak di industri migas.",
            "Operasi pengeboran merupakan tahapan paling mahal dalam hulu migas.",
            "BOP adalah alat yang mahal namun sering mengalami kegagalan teknis.",
            "Hilangnya nyawa pekerja sering terjadi akibat kelalaian inspeksi sumur."
          ],
          exp: "Gagasan utama adalah ide pokok sebuah teks. Keseluruhan paragraf berfokus membahas peran krusial Blowout Preventer (BOP) untuk mencegah 'blowout' dan pentingnya pengujian alat tersebut demi mencegah berbagai risiko fatal."
        },
        {
          q: "Berdasarkan teks, pernyataan manakah yang TIDAK BENAR mengenai Blowout Preventer (BOP)?",
          ans: "BOP digunakan untuk meningkatkan laju aliran fluida dari dalam sumur gas.",
          wrongs: [
            "BOP bertindak sebagai katup penutup darurat yang besar.",
            "Inspeksi BOP wajib dilakukan secara berkala sebelum pengeboran.",
            "BOP dirancang untuk menyegel dan memonitor sumur minyak.",
            "Kegagalan fungsi BOP dapat berakibat pada kerusakan lingkungan."
          ],
          exp: "Pernyataan tersebut salah karena menurut teks, fungsi BOP adalah 'menyegel, mengendalikan, dan memonitor sumur... untuk MENCEGAH pelepasan fluida', bukan untuk meningkatkan laju alirannya."
        },
        {
          q: "Kata 'fatal' pada kalimat terakhir dalam teks tersebut memiliki makna yang paling dekat dengan...",
          ans: "Mematikan atau membawa akibat yang sangat buruk.",
          wrongs: [
            "Sulit untuk diperbaiki.",
            "Sangat memakan banyak biaya.",
            "Menimbulkan ketidaknyamanan jangka panjang.",
            "Menghentikan seluruh proses operasional secara tiba-tiba."
          ],
          exp: "Secara leksikal (kamus), fatal berarti membawa kematian atau kehancuran/akibat yang sangat buruk yang tidak bisa diubah lagi. Konteks kalimat ini merujuk pada hilangnya nyawa dan kerusakan parah."
        }
      ]
    },
    {
      text: "Teks 2 untuk Soal 4-6\n\nKecerdasan Buatan (AI) telah membawa revolusi signifikan dalam dunia analisis data. Dulu, para analis data menghabiskan 80% waktu mereka untuk membersihkan dan merapikan data, dan hanya 20% untuk mencari wawasan (insights) yang berguna. Dengan masuknya algoritma machine learning, proses pembersihan data kini dapat diotomatisasi. AI dapat mendeteksi anomali, mengisi data yang hilang (missing values), dan mengidentifikasi pola tersembunyi yang mungkin terlewatkan oleh mata manusia. Namun, ketergantungan yang berlebihan pada AI menimbulkan kekhawatiran baru: 'Black Box Problem'. Masalah ini muncul ketika sebuah model AI menghasilkan prediksi yang sangat akurat, tetapi para pembuatnya sendiri tidak bisa menjelaskan secara logis bagaimana AI tersebut bisa sampai pada kesimpulan itu. Dalam sektor medis atau hukum, ketidakmampuan menjelaskan dasar keputusan ini sangat berbahaya.",
      items: [
        {
          q: "Apa yang dimaksud dengan 'Black Box Problem' berdasarkan teks di atas?",
          ans: "Situasi di mana model AI memberikan prediksi akurat namun proses pengambilan keputusannya tidak dapat dijelaskan secara logis.",
          wrongs: [
            "Ketergantungan analis data pada algoritma machine learning untuk membersihkan data.",
            "Sebuah masalah di mana AI tidak dapat mengisi data yang hilang dengan benar.",
            "Ketidakmampuan AI dalam mendeteksi anomali tanpa bantuan dari manusia.",
            "Sistem keamanan kotak hitam yang digunakan untuk menyimpan data medis dan hukum."
          ],
          exp: "Paragraf menyebutkan secara eksplisit: 'Masalah ini muncul ketika sebuah model AI menghasilkan prediksi yang sangat akurat, tetapi para pembuatnya sendiri tidak bisa menjelaskan secara logis bagaimana AI tersebut bisa sampai pada kesimpulan itu.'"
        },
        {
          q: "Kesimpulan yang dapat ditarik dari teks di atas mengenai peran AI bagi analis data adalah...",
          ans: "AI meningkatkan efisiensi analis dengan mengotomatisasi pembersihan data, tetapi memunculkan tantangan baru terkait transparansi keputusan.",
          wrongs: [
            "AI telah sepenuhnya menggantikan peran analis data dalam mencari wawasan yang berguna.",
            "AI hanya berguna dalam sektor medis dan hukum untuk menghindari kesalahan fatal.",
            "Meskipun AI mempercepat proses kerja, analis data tetap menghabiskan 80% waktunya untuk memvalidasi algoritma.",
            "AI tidak bisa mendeteksi pola tersembunyi sebaik mata manusia yang terlatih."
          ],
          exp: "Kesimpulan harus merangkum ide awal (efisiensi berkat otomasi data cleaning) dan akhir (masalah black box / kurangnya transparansi). Opsi ini mencakup kedua gagasan tersebut secara seimbang."
        },
        {
          q: "Mengapa teks menyatakan bahwa 'Black Box Problem' sangat berbahaya dalam sektor medis atau hukum?",
          ans: "Karena dalam kedua sektor tersebut, setiap keputusan yang diambil harus memiliki dasar alasan logis dan dapat dipertanggungjawabkan.",
          wrongs: [
            "Karena AI belum diizinkan oleh undang-undang untuk memproses data hukum.",
            "Karena prediksi AI dalam medis sering kali terbukti tidak akurat secara fatal.",
            "Karena analis data di bidang medis tidak mengerti cara kerja algoritma machine learning.",
            "Karena algoritma AI dapat dengan mudah dimanipulasi oleh pihak yang tidak bertanggung jawab."
          ],
          exp: "Ini merupakan penalaran inferensial. Dalam hukum dan medis, nyawa dan nasib seseorang menjadi taruhan. Keputusan (misal: memvonis hukuman atau diagnosis penyakit) wajib memiliki dasar yang rasional untuk dipertanggungjawabkan (akuntabilitas), tidak bisa hanya mengandalkan hasil \"ajaib\" dari mesin."
        }
      ]
    },
    {
      text: "Teks 3 untuk Soal 7-10\n\nBerdasarkan studi dari Global Leadership Institute, Learning Agility atau ketangkasan belajar kini dianggap sebagai prediktor kesuksesan karier yang lebih valid daripada IQ. Seseorang yang memiliki Learning Agility tinggi memiliki kemampuan dan kemauan untuk belajar dari pengalaman, lalu mengaplikasikan pembelajaran tersebut untuk meraih kesuksesan dalam kondisi yang baru atau pertama kali dialami. Konsep ini mencakup empat dimensi utama: Mental Agility (berpikir kritis dan merasa nyaman dengan ambiguitas), People Agility (memahami orang lain dan mampu bekerja dengan beragam tipe individu), Change Agility (suka melakukan eksperimen dan tahan banting terhadap perubahan), serta Results Agility (mampu memberikan hasil dalam situasi pertama kali). Pemimpin dengan Learning Agility yang rendah biasanya terjebak pada cara-cara lama yang berhasil di masa lalu, yang sering kali justru menjadi penyebab utama kegagalan mereka saat menghadapi krisis modern.",
      items: [
        {
          q: "Berdasarkan teks, mengapa pemimpin dengan Learning Agility rendah berpotensi mengalami kegagalan saat krisis modern?",
          ans: "Karena mereka cenderung mengandalkan metode-metode usang yang pernah berhasil di masa lalu tanpa mau beradaptasi.",
          wrongs: [
            "Karena mereka memiliki tingkat IQ yang berada di bawah standar rata-rata pemimpin.",
            "Karena mereka gagal memahami orang lain dan tidak mampu bekerja dalam tim.",
            "Karena mereka tidak pernah dihadapkan pada situasi baru sebelumnya.",
            "Karena mereka selalu bereksperimen dengan cara baru namun sering gagal di tengah jalan."
          ],
          exp: "Dinyatakan di kalimat terakhir: 'Pemimpin dengan Learning Agility yang rendah biasanya terjebak pada cara-cara lama yang berhasil di masa lalu... penyebab utama kegagalan mereka saat menghadapi krisis modern.'"
        },
        {
          q: "Seorang manajer dipindahkan ke divisi baru yang belum pernah ia tangani. Ia langsung mampu menyusun strategi yang efektif dan membawa divisinya mencapai target. Kemampuan ini paling sesuai dengan dimensi...",
          ans: "Results Agility",
          wrongs: [
            "Mental Agility",
            "People Agility",
            "Change Agility",
            "Emotional Agility"
          ],
          exp: "Teks menjelaskan Results Agility sebagai 'mampu memberikan hasil (meraih target/menyusun strategi efektif) dalam situasi pertama kali (divisi baru yang belum pernah ditangani).'"
        },
        {
          q: "Pernyataan yang PALING TIDAK MENDUKUNG gagasan utama teks tersebut adalah...",
          ans: "Perekrutan karyawan sebaiknya didasarkan murni pada skor tes kecerdasan intelektual (IQ).",
          wrongs: [
            "Pelatihan karyawan di perusahaan harus fokus pada kemampuan adaptasi terhadap tantangan baru.",
            "Kandidat dengan pengalaman yang beragam lebih disukai daripada yang ahli namun kaku di satu bidang.",
            "Perusahaan sebaiknya mempromosikan staf yang berani mengambil risiko untuk mencoba hal baru.",
            "Pengalaman masa lalu harus dijadikan pelajaran, bukan cetak biru yang kaku."
          ],
          exp: "Teks secara jelas menyatakan bahwa Learning Agility 'kini dianggap sebagai prediktor kesuksesan karier yang LEBIH VALID daripada IQ'. Maka gagasan merekrut HANYA berdasarkan IQ bertentangan secara frontal dengan esensi teks."
        },
        {
          q: "Kata 'ambiguitas' dalam teks tersebut bersinonim dengan...",
          ans: "Ketidakpastian atau keadaan yang memiliki makna lebih dari satu.",
          wrongs: [
            "Ketegasan",
            "Kesesatan",
            "Kekakuan sistem",
            "Ketahanan mental"
          ],
          exp: "Ambiguitas merujuk pada situasi yang rancu, tidak jelas maknanya, memiliki banyak penafsiran, atau mengandung unsur ketidakpastian. Orang dengan Mental Agility tinggi merasa nyaman berada dalam situasi yang belum pasti."
        }
      ]
    }
  ];

  for (const passage of passages) {
    for (const item of passage.items) {
      questions.push({
        subtest_id: subtestId,
        number: currentNumber++,
        question_text: passage.text + '\n\n' + item.q,
        image_url: null,
        explanation: item.exp,
        ...shuffleOptions(item.ans, item.wrongs)
      });
    }
  }

  return questions;
}

export function generateAnalogyQuestions(subtestId: string, count: number = 30) {
  const questions = [];
  let currentNumber = 1;

  const shuffleOptions = (correct: string, wrongs: string[]) => {
    const all = [correct, ...wrongs];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const correctIndex = all.indexOf(correct);
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return {
      option_a: all[0],
      option_b: all[1],
      option_c: all[2],
      option_d: all[3],
      option_e: all[4] || null,
      correct_answer: letters[correctIndex]
    };
  };

  const analogyData = [
    {
      relation: "Sinonim (Persamaan Makna)",
      pairs: [
        ['Gembira', 'Senang'], ['Pintar', 'Cerdas'], ['Cepat', 'Kilat'], 
        ['Bohong', 'Dusta'], ['Kaya', 'Tajir'], ['Cantik', 'Jelita'], 
        ['Haus', 'Dahaga'], ['Pakaian', 'Baju'], ['Kawan', 'Teman'],
        ['Angin', 'Bayu'], ['Matahari', 'Mentari'], ['Bunga', 'Kembang']
      ]
    },
    {
      relation: "Antonim (Lawan Kata)",
      pairs: [
        ['Gelap', 'Terang'], ['Panjang', 'Pendek'], ['Besar', 'Kecil'], 
        ['Tinggi', 'Rendah'], ['Siang', 'Malam'], ['Asli', 'Palsu'], 
        ['Kaya', 'Miskin'], ['Berat', 'Ringan'], ['Lebar', 'Sempit'], 
        ['Cepat', 'Lambat'], ['Jauh', 'Dekat'], ['Atas', 'Bawah']
      ]
    },
    {
      relation: "Fungsi / Kegunaan",
      pairs: [
        ['Mata', 'Melihat'], ['Telinga', 'Mendengar'], ['Kaki', 'Berjalan'], 
        ['Hidung', 'Mencium'], ['Pisau', 'Memotong'], ['Gigi', 'Mengunyah'], 
        ['Sapu', 'Membersihkan'], ['Payung', 'Melindungi'], ['Lem', 'Merekatkan'],
        ['Gunting', 'Menggunting'], ['Kipas', 'Mendinginkan'], ['Rem', 'Menghentikan']
      ]
    },
    {
      relation: "Profesi dan Tempat Kerja",
      pairs: [
        ['Dokter', 'Rumah Sakit'], ['Guru', 'Sekolah'], ['Koki', 'Restoran'], 
        ['Masinis', 'Kereta Api'], ['Nakhoda', 'Kapal'], ['Pilot', 'Pesawat'], 
        ['Petani', 'Sawah'], ['Hakim', 'Pengadilan'], ['Polisi', 'Kantor Polisi'],
        ['Nelayan', 'Laut'], ['Pustakawan', 'Perpustakaan'], ['Buruh', 'Pabrik']
      ]
    },
    {
      relation: "Alat dan Penggunanya",
      pairs: [
        ['Cangkul', 'Petani'], ['Stetoskop', 'Dokter'], ['Kapur', 'Guru'], 
        ['Kamera', 'Fotografer'], ['Panci', 'Koki'], ['Kuas', 'Pelukis'], 
        ['Gunting', 'Tukang Cukur'], ['Palu', 'Tukang Kayu'], ['Pistol', 'Polisi'],
        ['Jaring', 'Nelayan'], ['Jarum', 'Penjahit'], ['Timbangan', 'Pedagang']
      ]
    },
    {
      relation: "Bagian dan Keseluruhan",
      pairs: [
        ['Daun', 'Pohon'], ['Roda', 'Mobil'], ['Layar', 'Televisi'], 
        ['Jari', 'Tangan'], ['Bulu', 'Burung'], ['Kaca', 'Jendela'], 
        ['Halaman', 'Buku'], ['Baling-baling', 'Helikopter'], ['Kelopak', 'Bunga'],
        ['Rambut', 'Kepala'], ['Atap', 'Rumah'], ['Mata Uang', 'Negara']
      ]
    }
  ];

  for (let i = 0; i < count; i++) {
    const catIndex = Math.floor(Math.random() * analogyData.length);
    const category = analogyData[catIndex];
    
    const shuffledPairs = [...category.pairs].sort(() => 0.5 - Math.random());
    const pair1 = shuffledPairs[0];
    const pair2 = shuffledPairs[1];
    
    const wrongs = [shuffledPairs[2][1], shuffledPairs[3][1], shuffledPairs[4][1], shuffledPairs[5][1]];
    
    const flip = Math.random() > 0.5;
    
    let questionText = "";
    let explanation = "";
    
    if (!flip) {
      questionText = `${pair1[0].toUpperCase()} : ${pair1[1].toUpperCase()} = ${pair2[0].toUpperCase()} : ...`;
      explanation = `Hubungan pada analogi ini adalah "${category.relation}". ${pair1[0]} memiliki hubungan "${category.relation}" dengan ${pair1[1]}, sebagaimana ${pair2[0]} memiliki hubungan dengan ${pair2[1]}.`;
    } else {
      questionText = `${pair1[1].toUpperCase()} : ${pair1[0].toUpperCase()} = ${pair2[1].toUpperCase()} : ...`;
      explanation = `Hubungan pada analogi ini adalah "${category.relation}" namun posisinya dibalik. ${pair1[1]} adalah pasangannya ${pair1[0]}, sebagaimana ${pair2[1]} adalah pasangannya ${pair2[0]}.`;
    }

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: questionText,
      image_url: null,
      explanation,
      ...shuffleOptions(!flip ? pair2[1].toUpperCase() : pair2[0].toUpperCase(), wrongs.map(w => w.toUpperCase()))
    });
  }

  return questions;
}
