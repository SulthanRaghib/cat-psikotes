"use client";

interface Props {
  leftLetter: string;
  middleLetter: string;
  rightLetter: string;
  onAnswer: (value: number) => void; // 0 = kiri, 1 = kanan
  disabled: boolean;
  selectedValue: number | null;
}

export default function LetterDistanceStimulus({
  leftLetter,
  middleLetter,
  rightLetter,
  onAnswer,
  disabled,
  selectedValue,
}: Props) {
  const boxBase =
    "w-20 h-20 md:w-28 md:h-28 flex items-center justify-center text-5xl md:text-7xl font-bold rounded-xl border-2 transition-all flex-shrink-0";

  const outerBoxClass = (value: number) =>
    `${boxBase} ${
      disabled && selectedValue !== value
        ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
        : selectedValue === value
        ? "bg-[#E8821E] text-white border-[#E8821E] scale-105 shadow-md"
        : "bg-white text-[#0F2A43] border-[#0F2A43] hover:bg-[#0F2A43] hover:text-white shadow-sm active:scale-95"
    }`;

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-12 select-none">
      <button onClick={() => onAnswer(0)} disabled={disabled} className={outerBoxClass(0)}>
        {leftLetter}
      </button>

      <div
        className={`${boxBase} bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 cursor-default`}
      >
        {middleLetter}
      </div>

      <button onClick={() => onAnswer(1)} disabled={disabled} className={outerBoxClass(1)}>
        {rightLetter}
      </button>
    </div>
  );
}
