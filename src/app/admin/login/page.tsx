'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = '/admin'; // Force reload to trigger middleware and layout
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal login');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-[#090e17] flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-ink dark:hover:text-white transition-colors bg-white dark:bg-[#111827] px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Kembali ke Ujian
        </Link>
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <div className="bg-white dark:bg-[#111827] p-1.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <ThemeToggle />
        </div>
      </div>
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-ink dark:bg-slate-800 flex items-center justify-center shrink-0 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M12 11V8c0-1.657-1.343-3-3-3S6 6.343 6 8v3m-2 0h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" stroke="#F2994A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-ink dark:text-slate-100">Admin Login</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola Bank Soal Psikotes RTC</p>
        </div>

        {error && (
          <div className="bg-dangerBg dark:bg-danger/20 text-danger dark:text-red-400 p-3 rounded-lg text-sm mb-4 border border-danger/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-ink dark:focus:ring-slate-400"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-ink dark:focus:ring-slate-400"
              placeholder="Masukkan password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink dark:bg-slate-200 text-white dark:text-[#090e17] font-['Space_Grotesk'] font-bold text-lg py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
