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
