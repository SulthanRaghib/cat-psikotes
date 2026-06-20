'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // If we are on the login page, don't show the admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-[#090e17] flex flex-col">
      <header className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-ink dark:bg-slate-800 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M5 19h11M5 19V8.5L11 4l6 4.5V19M9 19v-6h4v6M16 11l2.5 2v3.5a1.5 1.5 0 0 1-3 0" stroke="#F2994A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-lg text-ink dark:text-slate-100 hidden sm:block">Admin Panel</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm font-medium text-slate-500 hover:text-ink dark:hover:text-slate-300 transition-colors mr-2 hidden sm:block">
              Buka Web Ujian ↗
            </Link>
            <ThemeToggle />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold text-danger dark:text-red-400 hover:text-red-700 transition-colors px-2 py-1 rounded-md hover:bg-dangerBg dark:hover:bg-danger/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
