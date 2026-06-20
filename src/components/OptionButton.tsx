interface Props {
  letter: string;
  text: string;
  state: 'default' | 'correct' | 'wrong' | 'disabled';
  onClick: () => void;
}

export default function OptionButton({ letter, text, state, onClick }: Props) {
  let baseClass = "w-full text-left border-2 p-3 rounded-xl text-sm flex items-center gap-3 transition-colors duration-200 ";
  let letterClass = "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[0.75rem] font-bold font-mono shrink-0 transition-colors duration-200 ";

  if (state === 'correct') {
    baseClass += "border-success bg-successBg dark:bg-success/20 text-ink dark:text-success";
    letterClass += "border-success bg-success text-white";
  } else if (state === 'wrong') {
    baseClass += "border-danger bg-dangerBg dark:bg-danger/20 text-ink dark:text-danger";
    letterClass += "border-danger bg-danger text-white";
  } else if (state === 'disabled') {
    baseClass += "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-slate-500 opacity-70 cursor-not-allowed";
    letterClass += "border-slate-200 dark:border-slate-700";
  } else {
    // default
    baseClass += "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-slate-200 hover:border-ink dark:hover:border-slate-400 cursor-pointer";
    letterClass += "border-slate-200 dark:border-slate-600";
  }

  return (
    <button 
      className={baseClass} 
      onClick={onClick}
      disabled={state !== 'default'}
    >
      <div className={letterClass}>{letter}</div>
      <span>{text}</span>
    </button>
  );
}
