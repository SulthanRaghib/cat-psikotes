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
    
    if (type === 0) {
      // Arithmetic
      const start = Math.floor(Math.random() * 20) + 1;
      const step = Math.floor(Math.random() * 15) + 2;
      series = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
      nextNumber = start + step * 5;
    } else if (type === 1) {
      // Geometric
      const start = Math.floor(Math.random() * 5) + 2;
      const mult = Math.floor(Math.random() * 3) + 2;
      series = [start, start * mult, start * mult ** 2, start * mult ** 3, start * mult ** 4];
      nextNumber = start * mult ** 5;
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
    } else if (type === 3) {
      // Alternating series
      const start1 = Math.floor(Math.random() * 20) + 10;
      const start2 = Math.floor(Math.random() * 50) + 50;
      const step1 = Math.floor(Math.random() * 5) + 2;
      const step2 = -1 * (Math.floor(Math.random() * 5) + 2);
      series = [start1, start2, start1 + step1, start2 + step2, start1 + step1 * 2, start2 + step2 * 2];
      nextNumber = start1 + step1 * 3;
    } else {
      // Squares/Cubes
      const start = Math.floor(Math.random() * 5) + 2;
      series = [start**2, (start+1)**2, (start+2)**2, (start+3)**2, (start+4)**2];
      nextNumber = (start+5)**2;
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

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Sebuah barang seharga Rp${basePrice.toLocaleString('id-ID')} mendapat diskon ${discount}%. Berapakah harga akhir barang tersebut?`,
      image_url: null,
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

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Sebuah mobil melaju dengan kecepatan rata-rata ${speed} km/jam. Jika mobil tersebut melaju selama ${timeHours} jam, berapakah jarak yang ditempuh?`,
      image_url: null,
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

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Jika ${workers1} pekerja dapat menyelesaikan sebuah proyek dalam ${days1} hari. Berapa hari waktu yang dibutuhkan jika proyek dikerjakan oleh ${workers2} pekerja? (Bulatkan 1 angka di belakang koma)`,
      image_url: null,
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

    questions.push({
      subtest_id: subtestId,
      number: currentNumber++,
      question_text: `Sebuah kebun berbentuk persegi panjang dengan panjang ${length} meter dan lebar ${width} meter. Berapakah luas kebun tersebut?`,
      image_url: null,
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
