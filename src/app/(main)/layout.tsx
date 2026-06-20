import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="w-full max-w-[720px] p-4 md:p-8">
        <header className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-ink dark:bg-slate-800 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M5 19h11M5 19V8.5L11 4l6 4.5V19M9 19v-6h4v6M16 11l2.5 2v3.5a1.5 1.5 0 0 1-3 0" stroke="#F2994A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] text-lg md:text-xl font-bold leading-tight">Latihan Psikotes — RTC Staff</h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">PT Elnusa Petrofin · Road Traffic Control</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/admin/login" className="p-1.5 text-slate-400 hover:text-ink dark:hover:text-slate-200 transition-colors" title="Admin Login">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 11V8c0-1.657-1.343-3-3-3S6 6.343 6 8v3m-2 0h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        
        {children}
        
        <footer className="text-[0.76rem] text-slate-500 dark:text-slate-500 text-center mt-10">
          Latihan ini dibuat sebagai simulasi mandiri dan tidak berafiliasi resmi dengan PT Elnusa Petrofin.
        </footer>
      </main>
    </div>
  );
}
