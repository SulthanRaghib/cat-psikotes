import { Attempt } from '@/types';

interface Props {
  attempts: Attempt[];
  loading: boolean;
}

export default function HistoryList({ attempts, loading }: Props) {
  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 italic py-2">Memuat riwayat...</p>;
  }

  if (attempts.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 italic py-2">Belum ada riwayat latihan.</p>;
  }

  return (
    <div className="flex flex-col mt-2">
      {attempts.map((a, idx) => {
        const date = new Date(a.finishedAt).toLocaleString('id-ID', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        
        return (
          <div key={a.id} className={`flex justify-between items-center py-3 ${idx !== attempts.length - 1 ? 'border-b border-slate-200 dark:border-slate-800' : ''}`}>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {date} {a.timerMode && '⏱️'}
              </span>
              <span className="text-[0.8rem] text-ink dark:text-slate-200 font-medium">
                {a.categories.join(', ')}
              </span>
            </div>
            <div className="font-mono font-bold text-ink dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm">
              {a.correctCount}/{a.totalQuestions}
            </div>
          </div>
        );
      })}
    </div>
  );
}
