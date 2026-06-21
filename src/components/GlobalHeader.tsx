import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function GlobalHeader() {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0F2A43] to-[#2E6F95] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="font-bold text-xl text-[#0F2A43] dark:text-slate-100 hidden sm:block tracking-tight">
            ProAssess <span className="text-[#E8821E] font-normal">Center</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
