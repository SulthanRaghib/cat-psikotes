'use client';

import { useState, useEffect, useRef } from 'react';
import { Category, Question, Attempt, AttemptAnswer } from '@/types';
import FuelGauge from '@/components/FuelGauge';
import CategoryCard from '@/components/CategoryCard';
import CountSelector from '@/components/CountSelector';
import TimerToggle from '@/components/TimerToggle';
import QuestionCard from '@/components/QuestionCard';
import OptionButton from '@/components/OptionButton';
import FeedbackPanel from '@/components/FeedbackPanel';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import ReviewList from '@/components/ReviewList';
import HistoryList from '@/components/HistoryList';

const CATEGORIES: { id: Category; label: string; desc: string; colorClass: string; hex: string }[] = [
  { id: 'numerik', label: 'Numerik', desc: 'Deret angka, aritmetika dasar, soal hitung kontekstual (volume BBM, jarak/waktu, harga)', colorClass: 'text-catNumerik border-catNumerik bg-catNumerik/10', hex: '#2E6F95' },
  { id: 'logika', label: 'Logika & Penalaran', desc: 'Silogisme, modus tollens, deret huruf, analogi kata/hubungan, penalaran analitis, pengelompokan', colorClass: 'text-catLogika border-catLogika bg-catLogika/10', hex: '#6B4FA0' },
  { id: 'verbal', label: 'Verbal', desc: 'Sinonim, antonim, analogi kata, makna istilah', colorClass: 'text-catVerbal border-catVerbal bg-catVerbal/10', hex: '#117A73' },
  { id: 'situasional', label: 'Situasional', desc: 'Situational Judgement Test (SJT) — skenario kerja RTC: SOP, HSE, ketelitian, kerja tim', colorClass: 'text-catSituasional border-catSituasional bg-catSituasional/10', hex: '#C2660E' },
];

export default function App() {
  const [screen, setScreen] = useState<'setup' | 'quiz' | 'result'>('setup');
  
  // Setup State
  const [selectedCats, setSelectedCats] = useState<Category[]>(['numerik', 'logika', 'verbal', 'situasional']);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [timerMode, setTimerMode] = useState<boolean>(false);
  
  // History State
  const [histories, setHistories] = useState<Attempt[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Quiz State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AttemptAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isAnswered, setIsAnswered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Result Data
  const [attemptResult, setAttemptResult] = useState<Attempt | null>(null);

  // Load histories on mount
  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/attempts?limit=5');
      const data = await res.json();
      if (data.attempts) {
        setHistories(data.attempts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (screen === 'quiz' && timerMode && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, timerMode, isAnswered, currentIndex]);

  const handleTimeout = () => {
    setIsAnswered(true);
    const q = questions[currentIndex];
    setAnswers(prev => [...prev, {
      id: 0, attempt_id: 0,
      question_id: q.id,
      chosen_index: null,
      is_correct: false,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation
    }]);
  };

  const toggleCategory = (cat: Category) => {
    setSelectedCats(prev => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev; // Minimal 1
        return prev.filter(c => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const startQuiz = async () => {
    const res = await fetch(`/api/questions?categories=${selectedCats.join(',')}&count=${questionCount}`);
    const data = await res.json();
    if (data.questions && data.questions.length > 0) {
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers([]);
      setIsAnswered(false);
      setTimeLeft(45);
      setScreen('quiz');
    } else {
      alert("Gagal memuat soal atau bank soal kosong.");
    }
  };

  const selectOption = (index: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[currentIndex];
    const isCorrect = index === q.correct_index;

    setAnswers(prev => [...prev, {
      id: 0, attempt_id: 0,
      question_id: q.id,
      chosen_index: index,
      is_correct: isCorrect,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation
    }]);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setTimeLeft(45);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setScreen('result');
    const startedAt = new Date(Date.now() - (questions.length * 45 * 1000)).toISOString(); // Approx
    const finishedAt = new Date().toISOString();
    
    const payload = {
      startedAt,
      finishedAt,
      categories: selectedCats,
      timerMode,
      answers: answers.map(a => ({
        questionId: a.question_id,
        chosenIndex: a.chosen_index,
        isCorrect: a.is_correct
      }))
    };

    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAttemptResult({
        ...data,
        answers: answers
      });
      fetchHistories(); // refresh list
    } catch (e) {
      console.error(e);
    }
  };

  if (screen === 'setup') {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-3">Kategori Soal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.id}
                label={cat.label}
                desc={cat.desc}
                active={selectedCats.includes(cat.id)}
                colorClass={cat.colorClass}
                onClick={() => toggleCategory(cat.id)}
              />
            ))}
          </div>

          <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-3">Jumlah Soal Per Sesi</p>
          <div className="mb-6">
            <CountSelector 
              options={[10, 20, 30, 40]} 
              selected={questionCount} 
              onSelect={setQuestionCount} 
            />
          </div>

          <TimerToggle checked={timerMode} onChange={setTimerMode} />

          <button onClick={startQuiz} className="w-full bg-ink dark:bg-slate-200 text-white dark:text-[#090e17] font-['Space_Grotesk'] font-bold text-lg py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors focus:ring-4 ring-ink/20 outline-none">
            Mulai Latihan →
          </button>
        </div>

        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-2">Riwayat Latihan</p>
          <HistoryList attempts={histories} loading={loadingHistory} />
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const q = questions[currentIndex];
    const catMeta = CATEGORIES.find(c => c.id === q.category);
    const ans = answers.find(a => a.question_id === q.id);
    const letters = ['A', 'B', 'C', 'D'];

    return (
      <div className="animate-in fade-in slide-in-from-right-4">
        <FuelGauge current={currentIndex + (isAnswered ? 1 : 0)} total={questions.length} />
        
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-sm font-mono text-slate-500 dark:text-slate-400">
            Soal <strong className="text-ink dark:text-slate-200">{currentIndex + 1}</strong>/{questions.length}
          </div>
          {timerMode && (
            <div className={`font-mono text-sm px-3 py-1 rounded-full border ${timeLeft <= 10 && !isAnswered ? 'bg-dangerBg text-danger border-danger animate-pulse' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
              {timeLeft}s
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
          <QuestionCard 
            badgeLabel={catMeta?.label || q.category} 
            badgeColorClass={catMeta?.colorClass || 'bg-slate-100'} 
            questionText={q.question} 
          />

          <div className="flex flex-col gap-3">
            {q.options.map((opt, idx) => {
              let state: 'default' | 'correct' | 'wrong' | 'disabled' = 'default';
              if (isAnswered && ans) {
                if (idx === q.correct_index) state = 'correct';
                else if (ans.chosen_index === idx) state = 'wrong';
                else state = 'disabled';
              }

              return (
                <OptionButton 
                  key={idx}
                  letter={letters[idx]}
                  text={opt}
                  state={state}
                  onClick={() => selectOption(idx)}
                />
              );
            })}
          </div>

          {isAnswered && ans && (
            <FeedbackPanel 
              isCorrect={ans.chosen_index === null ? null : ans.is_correct} 
              explanation={q.explanation} 
            />
          )}
        </div>

        <div className="flex justify-end">
          {isAnswered && (
            <button onClick={nextQuestion} className="bg-ink dark:bg-slate-200 text-white dark:text-[#090e17] font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors animate-in slide-in-from-bottom-2">
              {currentIndex === questions.length - 1 ? 'Selesai & Lihat Hasil →' : 'Soal Berikutnya →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    const total = answers.length;
    const correct = answers.filter(a => a.is_correct).length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    const reviewItems = answers
      .filter(a => !a.is_correct)
      .map((a, i) => ({
        id: a.question_id + i,
        question: a.question!,
        options: a.options!,
        chosenIndex: a.chosen_index,
        correctIndex: a.correct_index!,
        explanation: a.explanation!
      }));

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 text-center">
          <div className="font-['Space_Grotesk'] text-[3rem] font-bold text-ink dark:text-slate-100 leading-none mb-1">
            {correct}/{total}
          </div>
          <div className="font-mono text-slate-500 dark:text-slate-400 mb-6">{percent}% Akurasi</div>
          
          <div className="text-left mt-6">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-3">Rincian per Kategori</p>
            <div className="flex flex-col gap-1">
              {CATEGORIES.filter(c => selectedCats.includes(c.id)).map(cat => {
                const catAnswers = answers.filter(a => questions.find(q => q.id === a.question_id)?.category === cat.id);
                if (catAnswers.length === 0) return null;
                const catCorrect = catAnswers.filter(a => a.is_correct).length;
                return (
                  <ScoreBreakdown 
                    key={cat.id} 
                    label={cat.label} 
                    correct={catCorrect} 
                    total={catAnswers.length} 
                    colorHex={cat.hex} 
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-1">Pembahasan Soal yang Terlewat</p>
          <ReviewList items={reviewItems} />
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={startQuiz} className="w-full bg-ink dark:bg-slate-200 text-white dark:text-[#090e17] font-['Space_Grotesk'] font-bold text-lg py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors">
            Coba Lagi (Acak Baru) →
          </button>
          <button onClick={() => setScreen('setup')} className="w-full bg-transparent text-ink dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 font-['Space_Grotesk'] font-bold text-base py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Ubah Pengaturan
          </button>
        </div>
      </div>
    );
  }

  return null;
}
