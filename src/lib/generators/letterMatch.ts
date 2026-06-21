const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ".split("");

const CONFUSING_PAIRS: Record<string, string[]> = {
  'A': ['R', 'H', 'M'],
  'B': ['P', 'R', 'D'],
  'C': ['G', 'Q'],
  'D': ['B', 'P'],
  'E': ['F'],
  'F': ['E', 'P'],
  'G': ['C', 'Q'],
  'H': ['M', 'N', 'A'],
  'J': ['U', 'T'],
  'K': ['X', 'Y'],
  'M': ['N', 'W', 'H'],
  'N': ['M', 'Z', 'H'],
  'P': ['R', 'F', 'B'],
  'Q': ['G', 'C'],
  'R': ['P', 'B', 'A'],
  'S': ['Z', 'C'],
  'T': ['J', 'Y'],
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

  for (let col = 0; col < 4; col++) {
    const baseLetter = randomLetter();
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
