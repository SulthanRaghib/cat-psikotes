"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import GlobalHeader from "@/components/GlobalHeader";
import { TpaQuestion } from "@/types";

export default function TpaExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const subtestId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [subtestName, setSubtestName] = useState("");
  const [timeLimit, setTimeLimit] = useState(3600); // default 60 minutes
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [status, setStatus] = useState<"IDLE" | "PLAYING" | "FINISHED" | "REVIEW">("IDLE");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // question.id -> 'A', 'B', etc.
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);

  // New Practice Mode State
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [scoreData, setScoreData] = useState<{ correct: number; total: number; accuracy: number } | null>(null);

  useEffect(() => {
    // Fetch subtest info
    fetch('/api/subtests')
      .then(res => res.json())
      .then(data => {
        const found = data.subtests?.find((s: any) => s.id === subtestId);
        if (found) {
          setSubtestName(found.name);
          if (found.default_time_limit_seconds) {
            setTimeLimit(found.default_time_limit_seconds);
          }
        }
      });

    // Fetch questions
    fetch(`/api/tpa/${subtestId}/questions`)
      .then(res => res.json())
      .then(data => {
        if (data.questions) setQuestions(data.questions);
        setLoading(false);
      });
  }, [subtestId]);

  // Timer logic
  useEffect(() => {
    if (status !== "PLAYING" || isPracticeMode) return; // No strict timer in practice mode, but let's keep it ticking visually or just pause it? Let's keep it ticking unless we want infinite time. Let's keep it ticking.
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft, isPracticeMode]);

  const handleStart = async () => {
    try {
      const res = await fetch(`/api/subtests/${subtestId}/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeLimitSeconds: timeLimit })
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
    } catch (e) {
      console.error(e);
    }

    setTimeLeft(timeLimit);
    setStatus("PLAYING");
  };

  const handleAnswer = (qId: number, answer: string) => {
    // In practice mode or review mode, if already answered, lock it.
    if ((isPracticeMode || status === "REVIEW") && answers[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleFinish = async () => {
    setStatus("FINISHED");
    let correctCount = 0;
    
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) correctCount++;
    });

    setScoreData({
      correct: correctCount,
      total: questions.length,
      accuracy: Math.round((correctCount / questions.length) * 100)
    });

    try {
      await fetch(`/api/tpa/${subtestId}/sessions/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          answers,
          timeSpent: timeLimit - timeLeft
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  if (status === "IDLE") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <GlobalHeader />
        <main className="max-w-3xl mx-auto py-12 px-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow text-center border-t-4 border-[#2E6F95]">
            <h1 className="text-3xl font-bold mb-4 text-[#0F2A43] dark:text-white">{subtestName || "Tes Potensi Akademik"}</h1>
            
            <div className="text-left bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl mb-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-2 text-[#0F2A43] dark:text-slate-200">Tentang Tes Ini:</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Tes ini dirancang untuk mengukur kapasitas kecerdasan logika dan daya tangkap analitis kuantitatif Anda secara presisi. Keterampilan ini sangat esensial untuk peran teknis dan manajerial, termasuk <i>Development & Drilling</i>.
              </p>
              
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Cakupan Topik Soal:</h4>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mb-4">
                <li>Deret Angka (Aritmatika, Geometri, Fibonacci, Deret Tingkat)</li>
                <li>Aritmatika Sosial (Diskon, Keuntungan, Harga Jual/Beli)</li>
                <li>Kecepatan, Jarak, dan Waktu Tempuh</li>
                <li>Perbandingan Berbalik Nilai (Estimasi Waktu Pekerja)</li>
                <li>Logika Geometri Dasar (Luas, Keliling, Volume)</li>
              </ul>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
                <strong>Informasi:</strong> Terdapat total <strong>{questions.length} soal</strong> pilihan ganda. Sistem akan mengunci otomatis ketika waktu habis. Anda dapat melompat ke soal manapun menggunakan panel navigasi di sebelah kanan.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-left w-full sm:w-auto flex-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Atur Waktu Ujian:</label>
                <select 
                  value={timeLimit} 
                  onChange={e => setTimeLimit(Number(e.target.value))}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-[#0F2A43] dark:text-white font-medium focus:ring-2 focus:ring-[#2E6F95] outline-none transition-all"
                >
                  <option value={600}>10 Menit (Latihan Kilat)</option>
                  <option value={1800}>30 Menit (Setengah Sesi)</option>
                  <option value={3600}>60 Menit (Sesi Penuh - Standar)</option>
                  <option value={5400}>90 Menit (Sesi Ekstensif)</option>
                  <option value={7200}>120 Menit (Simulasi Asli)</option>
                </select>
              </div>

              <div className="text-left w-full sm:w-auto flex-1 border-t sm:border-t-0 sm:border-l border-slate-300 dark:border-slate-600 pt-4 sm:pt-0 sm:pl-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isPracticeMode} onChange={(e) => setIsPracticeMode(e.target.checked)} />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${isPracticeMode ? 'bg-[#2E6F95]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isPracticeMode ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3">
                    <span className="block font-bold text-slate-700 dark:text-slate-300">Mode Latihan</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Umpan balik & penjelasan seketika saat menjawab</span>
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="px-10 py-4 bg-[#2E6F95] hover:bg-[#1f4e6b] text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
            >
              Mulai Ujian Sekarang
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (status === "FINISHED") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4">
        <GlobalHeader />
        <main className="max-w-xl mx-auto py-12">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center border-t-8 border-[#2E6F95]">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-[#0F2A43] dark:text-white mb-2">Ujian Selesai!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Jawaban Anda telah berhasil disimpan di sistem.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <div className="text-3xl font-black text-[#2E6F95] mb-1">{scoreData?.correct}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Benar</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <div className="text-3xl font-black text-red-500 mb-1">{scoreData!.total - scoreData!.correct}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salah/Kosong</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <div className="text-3xl font-black text-[#E8821E] mb-1">{scoreData?.accuracy}%</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akurasi</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => { setCurrentIndex(0); setStatus("REVIEW"); }}
                className="px-6 py-3 bg-[#E8821E] hover:bg-[#d67315] text-white font-bold rounded-xl transition-all"
              >
                Review Jawaban & Penjelasan
              </button>
              <button 
                onClick={() => router.push("/tpa")}
                className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isQuestionAnswered = !!answers[currentQ?.id];
  const showFeedback = (isPracticeMode && isQuestionAnswered) || status === "REVIEW";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-800 shadow-sm px-4 py-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 z-10 sticky top-0">
        <div className="font-bold text-[#0F2A43] dark:text-slate-100 flex items-center gap-4">
          <span>{subtestName}</span>
          {status === "REVIEW" && <span className="bg-[#E8821E] text-white text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">Mode Review</span>}
          {isPracticeMode && status === "PLAYING" && <span className="bg-[#2E6F95] text-white text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">Mode Latihan</span>}
        </div>
        {status === "PLAYING" && (
          <div className={`font-mono text-xl font-bold bg-slate-100 dark:bg-slate-700 px-4 py-1 rounded-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-[#2E6F95] dark:text-blue-300'}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col md:flex-row gap-6 items-start">
        {/* Left Area: Question */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border-t-4 border-[#0F2A43]">
            <div className="mb-6 pb-4 border-b dark:border-slate-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-[#0F2A43] text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">{currentIndex + 1}</span>
                Soal Nomor {currentIndex + 1}
              </h3>
              {currentQ?.image_url && (
                <img src={currentQ.image_url} alt="Question" className="mb-4 max-w-full rounded" />
              )}
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                {currentQ?.question_text}
              </p>
            </div>

            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'E'].map(optKey => {
                const optVal = currentQ?.[`option_${optKey.toLowerCase()}`];
                if (!optVal) return null;
                
                const isSelected = answers[currentQ.id] === optKey;
                const isCorrectOption = optKey === currentQ.correct_answer;
                
                let optionStyle = 'border-slate-200 dark:border-slate-700 hover:border-[#2E6F95]/50 hover:bg-slate-50 dark:hover:bg-slate-700/50';
                let circleStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
                
                if (showFeedback) {
                  if (isCorrectOption) {
                    optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 font-bold';
                    circleStyle = 'bg-green-500 text-white shadow-md';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 font-medium';
                    circleStyle = 'bg-red-500 text-white shadow-md';
                  } else {
                    optionStyle = 'border-slate-200 dark:border-slate-700 opacity-60';
                    circleStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-400';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-[#2E6F95] bg-[#2E6F95]/10 font-bold text-[#0F2A43] dark:text-white ring-1 ring-[#2E6F95]';
                  circleStyle = 'bg-[#2E6F95] text-white shadow-md';
                }
                
                return (
                  <button
                    key={optKey}
                    onClick={() => handleAnswer(currentQ.id, optKey)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center ${optionStyle} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className={`w-10 h-10 flex items-center justify-center rounded-full mr-4 shrink-0 font-bold text-lg transition-colors ${circleStyle}`}>
                      {optKey}
                    </span>
                    <span className="text-lg">{String(optVal)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box */}
          {showFeedback && (
            <div className={`p-6 rounded-xl shadow-sm border-l-4 ${answers[currentQ.id] === currentQ.correct_answer ? 'bg-green-50 dark:bg-green-900/10 border-green-500' : 'bg-red-50 dark:bg-red-900/10 border-red-500'}`}>
              <div className="flex items-center gap-2 mb-2">
                {answers[currentQ.id] === currentQ.correct_answer ? (
                  <span className="font-bold text-green-700 dark:text-green-400 flex items-center gap-1">✅ Jawaban Anda Benar</span>
                ) : (
                  <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1">❌ Jawaban Anda Salah</span>
                )}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 mt-4">Penjelasan:</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentQ.explanation || "Tidak ada penjelasan tambahan untuk soal ini."}
              </p>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl disabled:opacity-50 font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              ← Sebelumnya
            </button>
            <button 
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-8 py-3 bg-[#0F2A43] text-white rounded-xl disabled:opacity-50 font-bold hover:bg-[#1a3f61] transition-colors shadow-sm"
            >
              Selanjutnya →
            </button>
          </div>
        </div>

        {/* Right Area: Navigation Grid */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border-t-4 border-slate-200 dark:border-slate-700">
            <h3 className="font-bold mb-4 text-center border-b pb-3 dark:border-slate-700 text-[#0F2A43] dark:text-slate-200 uppercase tracking-wider text-sm">Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto p-1 scrollbar-thin">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;
                const isCorrect = answers[q.id] === q.correct_answer;
                
                let btnStyle = 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50';
                
                if (status === "REVIEW" || isPracticeMode) {
                  if (isAnswered) {
                    btnStyle = isCorrect 
                      ? 'bg-green-500 text-white border-green-600 shadow-sm' 
                      : 'bg-red-500 text-white border-red-600 shadow-sm';
                  }
                } else if (isAnswered) {
                  btnStyle = 'bg-[#2E6F95] text-white border-[#2E6F95] shadow-sm';
                }
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all border
                      ${isCurrent ? 'ring-4 ring-offset-1 ring-[#E8821E] z-10 scale-110' : ''}
                      ${btnStyle}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t dark:border-slate-700 flex justify-center">
              {status === "PLAYING" ? (
                <button 
                  onClick={() => {
                    if (confirm("Apakah Anda yakin ingin menyelesaikan ujian sekarang?")) {
                      handleFinish();
                    }
                  }}
                  className="w-full py-4 bg-[#E8821E] hover:bg-[#d67315] text-white font-black rounded-xl transition-all shadow-md uppercase tracking-wider"
                >
                  Selesai Ujian
                </button>
              ) : (
                <button 
                  onClick={() => router.push("/tpa")}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Tutup Review
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
