"use client";

interface ReviewItem {
  index: number;
  stimulus: any;
  userAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
}

interface Props {
  items: ReviewItem[];
}

function formatAnswerValue(item: ReviewItem, value: number | null): string {
  if (value === null) return '-';
  if (item.stimulus?.leftLetter !== undefined) {
    return value === 0 ? item.stimulus.leftLetter : value === 1 ? item.stimulus.rightLetter : '-';
  }
  return String(value);
}

export default function SessionReviewList({ items }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-4">
      <h3 className="text-xl font-bold text-[#0F2A43] dark:text-slate-100 mb-2">Review Jawaban</h3>
      {items.map((item, i) => (
        <div key={i} className={`p-4 rounded-xl border ${item.isCorrect ? 'border-green-200 dark:border-emerald-800 bg-green-50/50 dark:bg-emerald-900/20' : 'border-red-200 dark:border-rose-800 bg-red-50/50 dark:bg-rose-900/20'} flex flex-col md:flex-row gap-6 items-center shadow-sm`}>
          <div className="flex flex-col items-center justify-center gap-1 min-w-[3rem]">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">#{item.index}</span>
            <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white shadow-sm ${item.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
              {item.isCorrect ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto p-4 bg-white dark:bg-slate-800 rounded shadow-sm">
            {/* Render stimulus specifically for letter match */}
            {item.stimulus && item.stimulus.leftLetter !== undefined ? (
              <div className="flex items-center gap-2 md:gap-4 select-none font-bold text-xl md:text-2xl text-[#0F2A43] dark:text-slate-100 justify-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-2 ${item.userAnswer === 0 ? (item.isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-slate-200'}`}>
                  {item.stimulus.leftLetter}
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500">
                  {item.stimulus.middleLetter}
                </div>
                <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl border-2 ${item.userAnswer === 1 ? (item.isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-slate-200'}`}>
                  {item.stimulus.rightLetter}
                </div>
              </div>
            ) : item.stimulus && item.stimulus.rowA && item.stimulus.rowB ? (
              <div className="flex flex-col items-center select-none font-bold text-xl md:text-2xl text-[#0F2A43] dark:text-slate-100">
                <div className="flex gap-2 md:gap-4">
                  {item.stimulus.rowA.map((charA: string, cIdx: number) => {
                    const charB = item.stimulus.rowB[cIdx];
                    const match = charA.toUpperCase() === charB.toUpperCase();
                    return (
                      <div key={`col-${cIdx}`} className={`flex flex-col border-2 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm ${match ? 'border-green-400 dark:border-emerald-600 shadow-green-100 dark:shadow-emerald-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                        <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-b-2 bg-slate-50 dark:bg-slate-800/80 ${match ? 'text-green-600 border-green-200 dark:border-emerald-800/50' : 'text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'}`}>
                          {charA}
                        </div>
                        <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center ${match ? 'text-green-600' : 'text-slate-500 dark:text-slate-400'}`}>
                          {charB}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-slate-500">Tipe soal tidak dikenali</div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center min-w-[200px]">
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Jawaban Anda</div>
              <div className={`text-2xl font-bold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {formatAnswerValue(item, item.userAnswer)}
              </div>
            </div>
            
            {!item.isCorrect && (
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Kunci Benar</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatAnswerValue(item, item.correctAnswer)}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
