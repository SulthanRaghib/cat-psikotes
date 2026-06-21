"use client";

import { useMemo } from "react";

const FONTS = [
  'Arial, Helvetica, sans-serif',
  '"Courier New", Courier, monospace',
  '"Lucida Console", Monaco, monospace',
  'Verdana, Geneva, sans-serif',
  'Tahoma, sans-serif',
  '"Trebuchet MS", sans-serif',
  'Impact, Charcoal, sans-serif'
];

interface Props {
  rowA: string[];
  rowB: string[];
}

export default function LetterMatchStimulus({ rowA, rowB }: Props) {
  // Generate random font for each character to make it confusing (nyaru)
  const fontsA = useMemo(() => rowA.map(() => FONTS[Math.floor(Math.random() * FONTS.length)]), [rowA]);
  const fontsB = useMemo(() => rowB.map(() => FONTS[Math.floor(Math.random() * FONTS.length)]), [rowB]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-2 select-none">
      <div className="flex gap-4 md:gap-8">
        {rowA.map((charA, i) => {
          const charB = rowB[i];
          return (
            <div key={`col-${i}`} className="flex flex-col border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 shadow-sm overflow-hidden transition-colors">
              <div className="text-5xl md:text-7xl text-[#0F2A43] dark:text-slate-100 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80" style={{ fontFamily: fontsA[i] }}>
                {charA}
              </div>
              <div className="text-5xl md:text-7xl text-[#0F2A43] dark:text-slate-100 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center" style={{ fontFamily: fontsB[i] }}>
                {charB}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
