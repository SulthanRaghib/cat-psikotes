import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
          <div className="font-semibold text-sm mb-2 text-ink dark:text-slate-200 prose dark:prose-invert prose-p:my-0 prose-p:inline-block max-w-none text-sm">
            <span className="mr-1">{idx + 1}.</span>
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {item.question}
            </ReactMarkdown>
          </div>
          <div className="text-xs space-y-1 mb-2">
            <div className="text-danger dark:text-red-400 flex items-start gap-1">
              <span className="shrink-0">Jawaban Anda:</span>
              <div className="prose dark:prose-invert prose-p:my-0 prose-p:inline-block max-w-none text-xs text-inherit">
                {item.chosenIndex !== null ? (
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {item.options[item.chosenIndex]}
                  </ReactMarkdown>
                ) : (
                  <span>Tidak dijawab (Waktu Habis)</span>
                )}
              </div>
            </div>
            <div className="text-success dark:text-green-400 font-medium flex items-start gap-1">
              <span className="shrink-0">Kunci Jawaban:</span>
              <div className="prose dark:prose-invert prose-p:my-0 prose-p:inline-block max-w-none text-xs text-inherit">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {item.options[item.correctIndex]}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 prose dark:prose-invert prose-p:my-0 prose-p:inline-block max-w-none text-xs">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {item.explanation}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
