const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

  for (let col = 0; col < 4; col++) {
    const baseLetter = randomLetter();
    rowA.push(randomCase(baseLetter));

    const shouldMatch = Math.random() < 0.5; // ~50% peluang kolom ini cocok
    if (shouldMatch) {
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
