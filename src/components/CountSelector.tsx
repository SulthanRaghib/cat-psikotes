interface Props {
  options: number[];
  selected: number;
  onSelect: (val: number) => void;
}

export default function CountSelector({ options, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`flex-1 py-2.5 rounded-xl font-mono font-semibold border-2 transition-colors duration-200 ${
            selected === opt
              ? 'bg-accent border-accent text-white'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-ink dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
