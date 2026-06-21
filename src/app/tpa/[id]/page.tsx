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
  const [timeLimit, setTimeLimit] = useState(600); // default 10 minutes
  const [questions, setQuestions] = useState<TpaQuestion[]>([]);
  
  const [status, setStatus] = useState<"IDLE" | "PLAYING" | "FINISHED">("IDLE");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // question.id -> 'A', 'B', etc.
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);

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
    if (status !== "PLAYING") return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft]);

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
    setAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleFinish = async () => {
    setStatus("FINISHED");
    // Format answers for submission
    const submissionItems = questions.map((q, idx) => ({
      item_index: idx,
      stimulus_json: JSON.stringify({ question: q.question_text, type: 'tpa_multiple_choice' }),
      correct_answer: q.correct_answer, // We actually shouldn't have correct_answer on client, but for simplicity here we assume API ignores it and checks DB, or we pass it temporarily.
      user_answer: answers[q.id] || null,
      answered_at_ms: Date.now()
    }));

    try {
      // In a real robust system, we create a specific TPA finish endpoint to score properly.
      // For now we'll use a new endpoint we will build next.
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

    alert("Ujian Selesai! Jawaban Anda telah disimpan.");
    router.push("/tpa");
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
            
            <div className="text-left bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl mb-8 border border-slate-200 dark:border-slate-700">
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

            <div className="mb-8 max-w-sm mx-auto text-left">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Atur Waktu Ujian:</label>
              <select 
                value={timeLimit} 
                onChange={e => setTimeLimit(Number(e.target.value))}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-[#0F2A43] dark:text-white font-medium focus:ring-2 focus:ring-[#2E6F95] outline-none transition-all"
              >
                <option value={600}>10 Menit (Latihan Kilat)</option>
                <option value={1800}>30 Menit (Setengah Sesi)</option>
                <option value={3600}>60 Menit (Sesi Penuh - Standar)</option>
                <option value={5400}>90 Menit (Sesi Ekstensif)</option>
                <option value={7200}>120 Menit (Simulasi Asli)</option>
              </select>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Mengirim Jawaban...</h2>
          <p>Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-800 shadow-sm px-4 py-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <div className="font-bold text-[#0F2A43] dark:text-slate-100">{subtestName}</div>
        <div className={`font-mono text-2xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-[#2E6F95]'}`}>
          {formatTime(timeLeft)}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col md:flex-row gap-6 items-start">
        {/* Left Area: Question */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow p-6 w-full">
          <div className="mb-6 pb-4 border-b dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4">Soal No. {currentIndex + 1}</h3>
            {currentQ?.image_url && (
              <img src={currentQ.image_url} alt="Question" className="mb-4 max-w-full rounded" />
            )}
            <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {currentQ?.question_text}
            </p>
          </div>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D', 'E'].map(optKey => {
              const optVal = currentQ?.[`option_${optKey.toLowerCase()}` as keyof TpaQuestion];
              if (!optVal) return null;
              const isSelected = answers[currentQ.id] === optKey;
              
              return (
                <button
                  key={optKey}
                  onClick={() => handleAnswer(currentQ.id, optKey)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center ${
                    isSelected 
                    ? 'border-[#2E6F95] bg-[#2E6F95]/10 font-semibold text-[#0F2A43] dark:text-white' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-[#2E6F95]/50'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 shrink-0 ${isSelected ? 'bg-[#2E6F95] text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {optKey}
                  </span>
                  <span>{String(optVal)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded disabled:opacity-50 font-semibold"
            >
              Sebelumnya
            </button>
            <button 
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded disabled:opacity-50 font-semibold"
            >
              Selanjutnya
            </button>
          </div>
        </div>

        {/* Right Area: Navigation Grid */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h3 className="font-bold mb-4 text-center border-b pb-2 dark:border-slate-700">Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`aspect-square rounded flex items-center justify-center font-bold text-sm transition-all border
                      ${isCurrent ? 'ring-2 ring-offset-2 ring-[#2E6F95]' : ''}
                      ${isAnswered 
                        ? 'bg-[#2E6F95] text-white border-[#2E6F95]' 
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t dark:border-slate-700 flex justify-center">
              <button 
                onClick={() => {
                  if (confirm("Apakah Anda yakin ingin menyelesaikan ujian sekarang?")) {
                    handleFinish();
                  }
                }}
                className="w-full py-3 bg-[#E8821E] hover:bg-[#d67315] text-white font-bold rounded-lg transition-colors"
              >
                Selesai Ujian
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
