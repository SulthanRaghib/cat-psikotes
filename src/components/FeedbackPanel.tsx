import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Props {
  isCorrect: boolean | null; // null if timeout
  explanation: string;
}

export default function FeedbackPanel({ isCorrect, explanation }: Props) {
  let title = "Waktu Habis";
  let bgClass = "bg-dangerBg dark:bg-danger/20 text-[#8c281c] dark:text-red-400";
  
  if (isCorrect === true) {
    title = "Benar";
    bgClass = "bg-successBg dark:bg-success/20 text-[#0e5c39] dark:text-green-400";
  } else if (isCorrect === false) {
    title = "Kurang Tepat";
  }

  return (
    <div className={`mt-4 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 ${bgClass}`}>
      <div className="font-bold font-['Space_Grotesk'] mb-1 text-base">{title}</div>
      <div className="opacity-90 prose dark:prose-invert prose-p:my-0 prose-p:inline-block max-w-none text-sm text-inherit">
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[rehypeKatex]}
        >
          {explanation}
        </ReactMarkdown>
      </div>
    </div>
  );
}
