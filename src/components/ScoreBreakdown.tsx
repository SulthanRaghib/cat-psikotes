interface Props {
  label: string;
  correct: number;
  total: number;
  colorHex: string;
}

export default function ScoreBreakdown({ label, correct, total, colorHex }: Props) {
  const percent = total === 0 ? 0 : (correct / total) * 100;

  return (
    <div className="flex items-center gap-3 text-sm my-2">
      <div className="w-32 shrink-0 font-semibold text-ink dark:text-slate-200">{label}</div>
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000" 
          style={{ width: `${percent}%`, backgroundColor: colorHex }}
        />
      </div>
      <div className="font-mono w-10 text-right shrink-0 text-slate-500 dark:text-slate-400">
        {correct}/{total}
      </div>
    </div>
  );
}
