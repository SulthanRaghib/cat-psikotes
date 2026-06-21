const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ".split("");

function randomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

function randomCase(letter: string): string {
  return Math.random() < 0.5 ? letter.toUpperCase() : letter.toLowerCase();
}

export function generateLetterMatchItem(): {
  rowA: string[];
  rowB: string[];
  correctAnswer: number;
} {
  const rowA: string[] = [];
  const rowB: string[] = [];

  // Tentukan jumlah pasangan yang sama (1 sampai 4, tidak pernah 0)
  const targetMatches = Math.floor(Math.random() * 4) + 1;
  
  // Pilih kolom mana saja yang akan dibuat sama
  const matchIndices = new Set<number>();
  while (matchIndices.size < targetMatches) {
    matchIndices.add(Math.floor(Math.random() * 4));
  }

  for (let col = 0; col < 4; col++) {
    const baseLetter = randomLetter();
    rowA.push(randomCase(baseLetter));

    if (matchIndices.has(col)) {
      rowB.push(randomCase(baseLetter)); // huruf sama, kapitalisasi diacak ulang
    } else {
      let otherLetter = randomLetter();
      while (otherLetter === baseLetter) otherLetter = randomLetter();
      rowB.push(randomCase(otherLetter));
    }
  }

  const correctAnswer = rowA.filter(
    (letter, i) => letter.toUpperCase() === rowB[i].toUpperCase()
  ).length;

  return { rowA, rowB, correctAnswer };
}
