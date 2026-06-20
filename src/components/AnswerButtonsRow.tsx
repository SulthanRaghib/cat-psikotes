"use client";

interface Props {
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function AnswerButtonsRow({ onAnswer, disabled }: Props) {
  const options = [1, 2, 3, 4];

  return (
    <div className="flex justify-center gap-4 md:gap-8 w-full mt-8">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onAnswer(opt)}
          disabled={disabled}
          className={`w-16 h-12 md:w-24 md:h-16 rounded-xl font-bold text-2xl flex-shrink-0 flex items-center justify-center transition-all ${
            disabled
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-white text-[#0F2A43] border-2 border-[#0F2A43] hover:bg-[#0F2A43] hover:text-white shadow-sm active:scale-95"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
