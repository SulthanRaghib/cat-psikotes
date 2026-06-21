"use client";

import LetterMatchStimulus from "./LetterMatchStimulus";
import AnswerButtonsRow from "./AnswerButtonsRow";
import LetterDistanceStimulus from "./LetterDistanceStimulus";

interface Props {
  itemType: string;
  stimulus: any;
  onAnswer: (value: number) => void;
  disabled: boolean;
  selectedValue: number | null;
}

export default function StimulusRenderer({ itemType, stimulus, onAnswer, disabled, selectedValue }: Props) {
  if (itemType === "letter_match_count") {
    return (
      <>
        <LetterMatchStimulus rowA={stimulus.rowA} rowB={stimulus.rowB} />
        <AnswerButtonsRow onAnswer={onAnswer} disabled={disabled} selectedValue={selectedValue} />
      </>
    );
  }

  if (itemType === "farthest_letter_distance") {
    return (
      <LetterDistanceStimulus
        leftLetter={stimulus.leftLetter}
        middleLetter={stimulus.middleLetter}
        rightLetter={stimulus.rightLetter}
        onAnswer={onAnswer}
        disabled={disabled}
        selectedValue={selectedValue}
      />
    );
  }

  return <div className="text-slate-500 py-12 text-center">Tipe soal belum didukung.</div>;
}
