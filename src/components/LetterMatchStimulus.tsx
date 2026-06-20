"use client";

interface Props {
  rowA: string[];
  rowB: string[];
}

export default function LetterMatchStimulus({ rowA, rowB }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-2 select-none">
      <div className="font-mono text-5xl md:text-7xl font-bold text-[#0F2A43] dark:text-slate-100 flex gap-6 md:gap-16">
        {rowA.map((char, i) => (
          <div key={`a-${i}`} className="w-10 md:w-16 flex items-center justify-center">{char}</div>
        ))}
      </div>
      <div className="h-6 md:h-10"></div>
      <div className="font-mono text-5xl md:text-7xl font-bold text-[#0F2A43] dark:text-slate-100 flex gap-6 md:gap-16">
        {rowB.map((char, i) => (
          <div key={`b-${i}`} className="w-10 md:w-16 flex items-center justify-center">{char}</div>
        ))}
      </div>
    </div>
  );
}
