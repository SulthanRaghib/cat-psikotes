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

export default function SessionReviewList({ items }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-4">
      <h3 className="text-xl font-bold text-[#0F2A43] dark:text-slate-100 mb-2">Review Jawaban</h3>
      {items.map((item, i) => (
        <div key={i} className={`p-4 rounded-xl border ${item.isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'} flex flex-col md:flex-row gap-6 items-center`}>
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-100 rounded-full font-bold text-slate-500">
            {item.index}
          </div>
          
          <div className="flex-1 overflow-x-auto p-4 bg-white dark:bg-slate-800 rounded shadow-sm">
            {/* Render stimulus specifically for letter match */}
            {item.stimulus && item.stimulus.rowA && item.stimulus.rowB ? (
              <div className="flex flex-col items-center select-none font-mono font-bold text-2xl md:text-3xl text-[#0F2A43] dark:text-slate-100">
                <div className="flex gap-4 md:gap-8">
                  {item.stimulus.rowA.map((char: string, cIdx: number) => {
                    const match = char.toUpperCase() === item.stimulus.rowB[cIdx].toUpperCase();
                    return (
                      <div key={`a-${cIdx}`} className={`w-8 md:w-12 text-center pb-2 ${match ? 'text-green-600 border-b-4 border-green-500' : 'text-slate-400'}`}>
                        {char}
                      </div>
                    );
                  })}
                </div>
                <div className="h-2"></div>
                <div className="flex gap-4 md:gap-8">
                  {item.stimulus.rowB.map((char: string, cIdx: number) => {
                    const match = item.stimulus.rowA[cIdx].toUpperCase() === char.toUpperCase();
                    return (
                      <div key={`b-${cIdx}`} className={`w-8 md:w-12 text-center pt-2 ${match ? 'text-green-600 border-t-4 border-green-500' : 'text-slate-400'}`}>
                        {char}
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
                {item.userAnswer !== null ? item.userAnswer : '-'}
              </div>
            </div>
            
            {!item.isCorrect && (
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Kunci Benar</div>
                <div className="text-2xl font-bold text-green-600">
                  {item.correctAnswer}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
