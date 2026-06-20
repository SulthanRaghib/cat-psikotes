import { Attempt } from '@/types';

interface Props {
  attempts: Attempt[];
  loading: boolean;
  onPreview?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClearAll?: () => void;
}

export default function HistoryList({ attempts, loading, onPreview, onDelete, onClearAll }: Props) {
  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 italic py-2">Memuat riwayat...</p>;
  }

  if (attempts.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 italic py-2">Belum ada riwayat latihan.</p>;
  }

  return (
    <div className="flex flex-col mt-2 relative">
      {onClearAll && (
        <div className="absolute -top-10 right-0">
          <button 
            onClick={onClearAll} 
            className="text-xs font-semibold text-danger hover:text-red-700 dark:text-red-400 flex items-center gap-1 bg-dangerBg dark:bg-danger/10 px-2 py-1 rounded-md transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Bersihkan Semua
          </button>
        </div>
      )}
      {attempts.map((a, idx) => {
        const date = new Date(a.finishedAt).toLocaleString('id-ID', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        
        return (
          <div key={a.id} className={`flex justify-between items-center py-3 group ${idx !== attempts.length - 1 ? 'border-b border-slate-200 dark:border-slate-800' : ''}`}>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {date} {a.timerMode && '⏱️'}
              </span>
              <span className="text-[0.8rem] text-ink dark:text-slate-200 font-medium line-clamp-1">
                {a.categories.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="font-mono font-bold text-ink dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm">
                {a.correctCount}/{a.totalQuestions}
              </div>
              <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                {onPreview && (
                  <button onClick={() => onPreview(a.id)} className="p-1.5 text-slate-400 hover:text-accent bg-slate-100 dark:bg-slate-800 rounded-md transition-colors" title="Lihat Detail">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(a.id)} className="p-1.5 text-slate-400 hover:text-danger bg-slate-100 dark:bg-slate-800 rounded-md transition-colors" title="Hapus Riwayat">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
