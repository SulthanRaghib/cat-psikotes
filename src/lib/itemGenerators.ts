import { generateLetterMatchItem } from "./generators/letterMatch";
import { generateFarthestLetterItem } from "./generators/farthestLetter";

export interface GeneratedItem {
  stimulus: Record<string, unknown>;
  correctAnswer: number;
}

export const ITEM_GENERATORS: Record<string, () => GeneratedItem> = {
  letter_match_count: () => {
    const item = generateLetterMatchItem();
    return {
      stimulus: { rowA: item.rowA, rowB: item.rowB },
      correctAnswer: item.correctAnswer,
    };
  },
  farthest_letter_distance: () => {
    const item = generateFarthestLetterItem();
    return {
      stimulus: {
        leftLetter: item.leftLetter,
        middleLetter: item.middleLetter,
        rightLetter: item.rightLetter,
      },
      correctAnswer: item.correctSide === "left" ? 0 : 1,
    };
  },
};
