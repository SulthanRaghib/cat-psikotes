import SubtestMenu from "@/components/SubtestMenu";
import GlobalHeader from "@/components/GlobalHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <GlobalHeader />

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
