const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CONFUSING_PAIRS: Record<string, string[]> = {
  'A': ['R', 'H', 'M'],
  'B': ['P', 'R', 'D'],
  'C': ['G', 'Q', 'O'],
  'D': ['B', 'P', 'O'],
  'E': ['F'],
  'F': ['E', 'P'],
  'G': ['C', 'Q', 'O'],
  'H': ['M', 'N', 'A'],
  'I': ['L', 'T', 'J'],
  'J': ['U', 'T', 'I'],
  'K': ['X', 'Y'],
  'L': ['I', 'T'],
  'M': ['N', 'W', 'H'],
  'N': ['M', 'Z', 'H'],
  'O': ['Q', 'C', 'G', 'D'],
  'P': ['R', 'F', 'B'],
  'Q': ['G', 'C', 'O'],
  'R': ['P', 'B', 'A'],
  'S': ['Z', 'C'],
  'T': ['J', 'Y', 'I', 'L'],
  'U': ['V', 'J'],
  'V': ['U', 'W', 'Y'],
  'W': ['V', 'M'],
  'X': ['K', 'Y'],
  'Y': ['V', 'X', 'T'],
  'Z': ['S', 'N']
};

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

  // Ambil 4 huruf unik untuk base rowA agar tidak ada kolom yang hurufnya kembar
  const baseLetters: string[] = [];
  while (baseLetters.length < 4) {
    const l = randomLetter();
    if (!baseLetters.includes(l)) {
      baseLetters.push(l);
    }
  }

  for (let col = 0; col < 4; col++) {
    const baseLetter = baseLetters[col];
    const baseLetterA = randomCase(baseLetter);
    rowA.push(baseLetterA);

    if (matchIndices.has(col)) {
      // Match: purely random case so it can't be used as a cue
      rowB.push(randomCase(baseLetter));
    } else {
      // Non-match: pick visually confusing letters
      let otherLetter = randomLetter();
      if (Math.random() < 0.8 && CONFUSING_PAIRS[baseLetter]) {
        const pool = CONFUSING_PAIRS[baseLetter];
        otherLetter = pool[Math.floor(Math.random() * pool.length)];
      } else {
        while (otherLetter === baseLetter) otherLetter = randomLetter();
      }
      
      // Purely random case
      rowB.push(randomCase(otherLetter));
    }
  }

  const correctAnswer = rowA.filter(
    (letter, i) => letter.toUpperCase() === rowB[i].toUpperCase()
  ).length;

  return { rowA, rowB, correctAnswer };
}
