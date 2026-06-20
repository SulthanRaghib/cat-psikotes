import SubtestMenu from "@/components/SubtestMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#E8821E] flex items-center justify-center font-bold text-white">E</div>
            <h1 className="font-bold text-xl text-[#0F2A43] dark:text-slate-100 hidden sm:block">Elnusa Petrofin - Psikotes</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-3xl mx-auto px-4 mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#0F2A43] dark:text-white mb-2">Baterai Tes Psikometri</h2>
          <p className="text-slate-600 dark:text-slate-400">Silakan pilih subtes yang tersedia di bawah ini untuk memulai latihan.</p>
        </div>
        <SubtestMenu />
      </main>
    </div>
  );
}
