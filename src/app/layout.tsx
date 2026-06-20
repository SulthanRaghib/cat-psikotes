import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ibmPlexMono = IBM_Plex_Mono({ weight: ['500', '600', '700'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Latihan Psikotes — RTC Staff',
  description: 'Simulasi latihan psikotes untuk kandidat RTC Staff PT Elnusa Petrofin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-canvas text-ink dark:bg-[#090e17] dark:text-slate-200 min-h-screen flex flex-col items-center">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
              <ThemeToggle />
            </header>
            {children}
            <footer className="text-[0.76rem] text-slate-500 dark:text-slate-500 text-center mt-10">
              Latihan ini dibuat sebagai simulasi mandiri dan tidak berafiliasi resmi dengan PT Elnusa Petrofin.
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
