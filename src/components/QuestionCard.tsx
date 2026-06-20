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
      <h2 className="text-lg font-semibold text-ink dark:text-slate-100 leading-snug">
        {questionText}
      </h2>
    </div>
  );
}
