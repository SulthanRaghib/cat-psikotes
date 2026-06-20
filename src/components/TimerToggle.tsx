interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  duration: number;
  onDurationChange: (duration: number) => void;
}

export default function TimerToggle({ checked, onChange, duration, onDurationChange }: Props) {
  return (
    <div className="flex flex-col mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all">
      <div className="flex items-center justify-between p-3.5">
        <span className="text-sm font-medium dark:text-slate-200">Mode Waktu (Timer)</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={checked} 
            onChange={(e) => onChange(e.target.checked)} 
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
        </label>
      </div>
      {checked && (
        <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between animate-in slide-in-from-top-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durasi per Soal</span>
          <select 
            value={duration} 
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="text-sm font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-ink dark:text-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-accent outline-none cursor-pointer"
          >
            <option value={15}>15 Detik</option>
            <option value={30}>30 Detik</option>
            <option value={45}>45 Detik</option>
            <option value={60}>60 Detik</option>
            <option value={90}>90 Detik</option>
            <option value={120}>120 Detik</option>
          </select>
        </div>
      )}
    </div>
  );
}
