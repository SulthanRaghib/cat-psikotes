import GlobalHeader from "@/components/GlobalHeader";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
      <GlobalHeader />

      <main className="flex-1 py-12 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#0F2A43] dark:text-white mb-4 tracking-tight">
              Selamat Datang di ProAssess
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Platform asesmen kognitif dan psikometri yang komprehensif. Silakan pilih kategori tes yang ingin Anda jalani hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* TPA Card */}
            <Link href="/tpa" className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-[#2E6F95] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E6F95]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-[#2E6F95]/10 text-[#2E6F95] dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0F2A43] dark:text-white mb-3">Tes Potensi Akademik</h3>
                <p className="text-slate-600 dark:text-slate-400 flex-1">
                  Uji kemampuan logika verbal, kuantitatif, dan penalaran analitis Anda melalui soal-soal pilihan ganda yang komprehensif.
                </p>
                <div className="mt-6 flex items-center text-[#2E6F95] font-semibold">
                  Mulai TPA 
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Psikotes Card */}
            <Link href="/psikotes" className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-[#E8821E] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8821E]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-[#E8821E]/10 text-[#E8821E] dark:text-orange-400 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0F2A43] dark:text-white mb-3">Baterai Psikotes</h3>
                <p className="text-slate-600 dark:text-slate-400 flex-1">
                  Latih kecepatan, ketelitian, dan daya tahan kerja Anda melalui simulasi tes berwaktu yang dinamis.
                </p>
                <div className="mt-6 flex items-center text-[#E8821E] font-semibold">
                  Mulai Psikotes 
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}
