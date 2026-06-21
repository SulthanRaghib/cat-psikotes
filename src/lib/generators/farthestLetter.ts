const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_DIST = 5; // jarak maksimum tiap sisi dari huruf tengah (bisa disesuaikan)

export function generateFarthestLetterItem(): {
  leftLetter: string;
  middleLetter: string;
  rightLetter: string;
  leftDistance: number;
  rightDistance: number;
  correctSide: "left" | "right";
} {
  while (true) {
    const middlePos = Math.floor(Math.random() * 26) + 1; // 1..26
    const maxLeftDist = Math.min(MAX_DIST, middlePos - 1);
    const maxRightDist = Math.min(MAX_DIST, 26 - middlePos);
    if (maxLeftDist < 1 || maxRightDist < 1) continue;

    const leftDistance = Math.floor(Math.random() * maxLeftDist) + 1;
    const rightDistance = Math.floor(Math.random() * maxRightDist) + 1;
    if (leftDistance === rightDistance) continue; // hindari seri, harus ada satu jawaban unik

    const leftPos = middlePos - leftDistance;
    const rightPos = middlePos + rightDistance;

    return {
      leftLetter: ALPHABET[leftPos - 1],
      middleLetter: ALPHABET[middlePos - 1],
      rightLetter: ALPHABET[rightPos - 1],
      leftDistance,
      rightDistance,
      correctSide: rightDistance > leftDistance ? "right" : "left",
    };
  }
}
