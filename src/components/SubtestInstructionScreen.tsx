"use client";

import Link from "next/link";
import { SubtestSession } from "@/types";

interface Props {
  subtestName: string;
  itemType?: string;
  onStart: (durationMins: number | '', feedbackMode: boolean) => void;
  recentSessions: SubtestSession[];
  selectedDuration: number | '';
  setSelectedDuration: (v: number | '') => void;
  feedbackMode: boolean;
  setFeedbackMode: (v: boolean) => void;
}

export default function SubtestInstructionScreen({ 
  subtestName, 
  itemType,
  onStart, 
  recentSessions,
  selectedDuration,
  setSelectedDuration,
  feedbackMode,
  setFeedbackMode
}: Props) {


  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-10 border-t-4 border-[#E8821E]">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F2A43] dark:text-slate-100 mb-6 border-b pb-4">
          {subtestName}
        </h2>
        
        <div className="mb-8 text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-lg mb-2">Instruksi Pengerjaan:</h3>
          {itemType === 'farthest_letter_distance' ? (
            <div className="mb-8">
              <p className="mb-4">
                Pada setiap soal terdapat <strong>3 kotak huruf</strong> berjejer ke samping. Huruf di kotak tengah adalah acuan. 
                Tugas Anda adalah menentukan kotak mana — <strong>kiri atau kanan</strong> — yang hurufnya memiliki <strong>selisih posisi alfabet paling jauh</strong> dari huruf tengah, lalu klik langsung pada kotak huruf jawabannya.
              </p>
              
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-sm text-slate-500 mb-2 uppercase tracking-wide">Contoh Soal</h4>
                <div className="flex gap-4 md:gap-8 justify-center mb-4 select-none">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-bold text-3xl border-2 border-[#0F2A43] rounded-xl bg-white text-[#0F2A43]">A</div>
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-bold text-3xl border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500">C</div>
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-bold text-3xl border-2 border-[#0F2A43] rounded-xl bg-white text-[#0F2A43]">G</div>
                </div>
                <p className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-3 rounded">
                  <strong>Penjelasan:</strong> Posisi alfabet: A=1, C=3, G=7. Selisih C ke A = 3−1 = <strong>2</strong>. Selisih G ke C = 7−3 = <strong>4</strong>. 
                  Karena 4 lebih besar dari 2, kotak kanan (G) punya selisih lebih jauh dari huruf tengah — jawaban yang benar adalah <strong>G</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <p className="mb-4">
                Pada setiap soal, Anda akan melihat 4 kotak sejajar yang masing-masing berisi satu huruf di bagian atas dan satu huruf di bagian bawah. 
                Tugas Anda adalah <strong>menghitung ada berapa pasang huruf yang identik</strong> (atas dan bawah sama persis, tanpa mempedulikan huruf besar atau kecilnya).
              </p>
              
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-sm text-slate-500 mb-2 uppercase tracking-wide">Contoh Soal</h4>
                <div className="flex gap-4 md:gap-8 justify-center mb-4">
                  <div className="flex flex-col border-2 border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">E</div>
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl">e</div>
                  </div>
                  <div className="flex flex-col border-2 border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">v</div>
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl">Y</div>
                  </div>
                  <div className="flex flex-col border-2 border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">k</div>
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl">k</div>
                  </div>
                  <div className="flex flex-col border-2 border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">v</div>
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl">V</div>
                  </div>
                </div>
                <p className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-3 rounded">
                  <strong>Penjelasan:</strong> Kotak ke-1 (E & e) sama. Kotak ke-2 (v & Y) beda. Kotak ke-3 (k & k) sama. Kotak ke-4 (v & V) sama.
                  Jadi ada <strong>3 pasang</strong> yang sama. Jawabannya adalah tombol <strong>3</strong>.
                </p>
              </div>
            </div>
          )}

          <ul className="list-disc pl-5 space-y-2">
            <li>Pilih jawaban Anda dengan menekan angka yang sesuai.</li>
            <li>Setelah yakin, tekan tombol <strong>&quot;Selanjutnya&quot;</strong> untuk berpindah ke soal berikutnya.</li>
            <li>Anda dapat kembali ke soal sebelumnya dengan menekan <strong>&quot;Sebelumnya&quot;</strong> jika ingin merubah jawaban.</li>
            <li>Kerjakan soal secepat dan setepat mungkin sebelum waktu habis!</li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Atur Durasi (Menit)</label>
            <input 
              type="number"
              min="1"
              value={selectedDuration}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDuration(val === '' ? '' : Number(val));
              }}
              className="w-full max-w-[200px] px-4 py-2 rounded-lg font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#E8821E] shadow-sm"
              placeholder="Contoh: 5"
            />
          </div>
          
          <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mode Latihan (Umpan Balik)</label>
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={feedbackMode}
                  onChange={(e) => setFeedbackMode(e.target.checked)}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${feedbackMode ? 'bg-[#1B8A5A]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${feedbackMode ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3">
                <div className="font-semibold text-slate-800 dark:text-slate-200">{feedbackMode ? 'ON (Menampilkan Benar/Salah)' : 'OFF (Simulasi Ujian Asli)'}</div>
              </div>
            </label>
          </div>
        </div>

        <button 
          onClick={() => onStart(selectedDuration, feedbackMode)}
          className="w-full bg-[#E8821E] hover:bg-[#d67618] text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 text-xl"
        >
          MULAI TES SEKARANG
        </button>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-500 hover:text-[#0F2A43] dark:hover:text-white font-semibold underline-offset-4 hover:underline">
            ← Kembali ke Menu
          </Link>
        </div>
      </div>

      {recentSessions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-[#0F2A43] dark:text-slate-100 mb-4">Riwayat Sesi Terakhir</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Durasi</th>
                  <th className="px-4 py-3">Dikerjakan</th>
                  <th className="px-4 py-3">Akurasi</th>
                  <th className="px-4 py-3 text-right">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentSessions.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(session.started_at).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">{session.time_limit_seconds / 60}m</td>
                    <td className="px-4 py-3">{session.items_attempted} soal</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded font-bold ${session.accuracy_percent && session.accuracy_percent >= 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {session.accuracy_percent}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-right text-lg text-[#0F2A43] dark:text-white">{session.correct_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
