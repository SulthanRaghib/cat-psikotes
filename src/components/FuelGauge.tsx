export default function FuelGauge({ current, total }: { current: number; total: number }) {
  const percentage = total === 0 ? 0 : current / total;
  // Map 0 to 180 degrees
  const angle = percentage * 180 - 90;

  return (
    <div className="flex flex-col items-center mb-4">
      <svg viewBox="0 0 200 120" width="220" className="max-w-full">
        {/* Red section */}
        <path d="M20 100 A80 80 0 0 1 60 30.7" stroke="#C0392B" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.18" />
        {/* Yellow section */}
        <path d="M60 30.7 A80 80 0 0 1 140 30.7" stroke="#E8821E" strokeWidth="14" fill="none" opacity="0.18" />
        {/* Green section */}
        <path d="M140 30.7 A80 80 0 0 1 180 100" stroke="#1B8A5A" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.18" />
        
        <text x="14" y="116" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="currentColor" className="text-slate-400 dark:text-slate-500">E</text>
        <text x="180" y="116" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="currentColor" className="text-slate-400 dark:text-slate-500">F</text>
        
        <g transform={`rotate(${angle} 100 100)`} className="transition-transform duration-500 ease-out">
          <line x1="100" y1="100" x2="100" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-ink dark:text-slate-300" />
        </g>
        <circle cx="100" cy="100" r="7" className="fill-ink dark:fill-slate-300" />
      </svg>
    </div>
  );
}
