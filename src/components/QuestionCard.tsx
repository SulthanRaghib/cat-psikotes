import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Props {
  badgeLabel: string;
  badgeColorClass: string;
  questionText: string;
}

export default function QuestionCard({ badgeLabel, badgeColorClass, questionText }: Props) {
  return (
    <div className="mb-5">
      <span className={`inline-block text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3 ${badgeColorClass}`}>
        {badgeLabel}
      </span>
      <div className="text-lg font-semibold text-ink dark:text-slate-100 leading-snug prose dark:prose-invert prose-p:my-0 prose-p:inline-block max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[rehypeKatex]}
        >
          {questionText}
        </ReactMarkdown>
      </div>
    </div>
  );
}
