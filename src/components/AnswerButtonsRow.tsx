"use client";

interface Props {
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function AnswerButtonsRow({ onAnswer, disabled }: Props) {
  const options = [0, 1, 2, 3, 4];

  return (
    <div className="flex justify-center gap-3 md:gap-6 w-full max-w-xl mx-auto mt-8 px-4">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onAnswer(opt)}
          disabled={disabled}
          className={`flex-1 aspect-square md:aspect-auto md:h-16 rounded-xl font-bold text-2xl flex items-center justify-center transition-all ${
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
