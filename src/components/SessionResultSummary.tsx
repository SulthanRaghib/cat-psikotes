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
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Dikerjakan</div>
          <div className="text-3xl font-bold text-[#0F2A43] dark:text-white">{attempted}</div>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50">
          <div className="text-sm text-green-600 dark:text-green-400 mb-1">Benar</div>
          <div className="text-3xl font-bold text-green-700 dark:text-green-300">{correct}</div>
        </div>
        
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50">
          <div className="text-sm text-red-600 dark:text-red-400 mb-1">Salah</div>
          <div className="text-3xl font-bold text-red-700 dark:text-red-300">{incorrect}</div>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Akurasi</div>
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{accuracy}%</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center p-4 bg-[#0F2A43]/5 rounded-lg border border-[#0F2A43]/10">
        <div className="text-sm text-slate-500 mb-1 uppercase tracking-wider font-semibold">Kecepatan Rata-rata</div>
        <div className="text-4xl font-black text-[#E8821E]">{ipm.toFixed(1)}</div>
        <div className="text-xs text-slate-400 mt-1">soal per menit</div>
      </div>
    </div>
  );
}
