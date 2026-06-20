"use client";

interface Props {
  attempted: number;
  correct: number;
  accuracy: number;
  ipm: number;
}

export default function SessionResultSummary({ attempted, correct, accuracy, ipm }: Props) {
  const incorrect = attempted - correct;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 max-w-2xl mx-auto w-full border border-slate-100 dark:border-slate-700">
      <h3 className="text-xl font-bold text-center mb-6 text-[#0F2A43] dark:text-slate-100">Ringkasan Hasil Sesi</h3>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Dikerjakan</div>
          <div className="text-3xl font-bold text-[#0F2A43] dark:text-slate-100">{attempted}</div>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-emerald-900/30 rounded-xl border border-green-100 dark:border-emerald-800/50 shadow-sm">
          <div className="text-sm text-green-600 dark:text-emerald-400 mb-1 font-medium">Benar</div>
          <div className="text-3xl font-bold text-green-700 dark:text-emerald-300">{correct}</div>
        </div>
        
        <div className="p-4 bg-red-50 dark:bg-rose-900/30 rounded-xl border border-red-100 dark:border-rose-800/50 shadow-sm">
          <div className="text-sm text-red-600 dark:text-rose-400 mb-1 font-medium">Salah</div>
          <div className="text-3xl font-bold text-red-700 dark:text-rose-300">{incorrect}</div>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-sky-900/30 rounded-xl border border-blue-100 dark:border-sky-800/50 shadow-sm">
          <div className="text-sm text-blue-600 dark:text-sky-400 mb-1 font-medium">Akurasi</div>
          <div className="text-3xl font-bold text-blue-700 dark:text-sky-300">{accuracy}%</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center p-6 bg-[#0F2A43]/5 dark:bg-slate-900/50 rounded-xl border border-[#0F2A43]/10 dark:border-slate-700/50">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Kecepatan Rata-rata</div>
        <div className="text-5xl font-black text-[#E8821E] dark:text-[#F39C12] drop-shadow-sm">{ipm.toFixed(1)}</div>
        <div className="text-sm text-slate-400 dark:text-slate-500 mt-2 font-medium">soal per menit</div>
      </div>
    </div>
  );
}
