interface Props {
  label: string;
  desc: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  colorClass: string; 
}

export default function CategoryCard({ label, desc, count, active, onClick, colorClass }: Props) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 w-full relative overflow-hidden flex flex-col h-full ${
        active 
          ? colorClass + " shadow-sm"
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
      }`}
    >
      <div className="flex items-start gap-3 w-full">
        {/* check icon */}
        <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border-2 shrink-0 transition-colors ${active ? 'bg-current border-current' : 'border-slate-300 dark:border-slate-600'}`}>
          {active && (
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-white">
              <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-[0.95rem] mb-1.5 ${active ? '' : 'text-ink dark:text-slate-200'}`}>
            {label} {count !== undefined && `(${count})`}
          </h3>
          <p className={`text-[0.75rem] leading-relaxed ${active ? 'opacity-90 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
            {desc}
          </p>
        </div>
      </div>
    </button>
  );
}
