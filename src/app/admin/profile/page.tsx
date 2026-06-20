'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password baru minimal harus 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Password berhasil diperbarui!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Gagal memperbarui password');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show, toggle }: { show: boolean, toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
      aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
    >
      {show ? (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-ink dark:bg-slate-800 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4" stroke="#F2994A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
            </svg>
          </div>
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-ink dark:text-slate-100">Profil Admin</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Perbarui kata sandi untuk keamanan akun Anda.</p>
          </div>
        </div>

        {error && (
          <div className="bg-dangerBg dark:bg-danger/20 text-danger dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-danger/20 flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        {message && (
          <div className="bg-success/10 text-success dark:text-green-400 p-4 rounded-xl text-sm mb-6 border border-success/20 flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-2">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-ink dark:focus:ring-slate-400 pr-12 transition-all"
                placeholder="Masukkan password saat ini"
                required
              />
              <EyeIcon show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50 my-6"></div>

          <div>
            <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-2">Password Baru</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-ink dark:focus:ring-slate-400 pr-12 transition-all"
                placeholder="Masukkan password baru"
                required
                minLength={6}
              />
              <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-2">Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-ink dark:focus:ring-slate-400 pr-12 transition-all"
                placeholder="Ulangi password baru"
                required
                minLength={6}
              />
              <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="bg-ink dark:bg-slate-200 text-white dark:text-[#090e17] font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
