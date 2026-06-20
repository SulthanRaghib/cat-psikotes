interface ReviewItem {
  id: string;
  question: string;
  options: string[];
  chosenIndex: number | null;
  correctIndex: number;
  explanation: string;
}

export default function ReviewList({ items }: { items: ReviewItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-2">
        Semua jawaban benar — mantap!
      </p>
    );
  }

  return (
    <div className="flex flex-col mt-4">
      {items.map((item, idx) => (
        <div key={item.id} className={`py-4 ${idx !== 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''}`}>
          <div className="font-semibold text-sm mb-2 text-ink dark:text-slate-200">
            {idx + 1}. {item.question}
          </div>
          <div className="text-xs space-y-1 mb-2">
            <div className="text-danger dark:text-red-400">
              Jawaban Anda: {item.chosenIndex !== null ? item.options[item.chosenIndex] : 'Tidak dijawab (Waktu Habis)'}
            </div>
            <div className="text-success dark:text-green-400 font-medium">
              Kunci Jawaban: {item.options[item.correctIndex]}
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {item.explanation}
          </div>
        </div>
      ))}
    </div>
  );
}
