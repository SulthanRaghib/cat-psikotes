"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { generateLetterMatchItem } from "@/lib/generators/letterMatch";
import SubtestInstructionScreen from "@/components/SubtestInstructionScreen";
import LetterMatchStimulus from "@/components/LetterMatchStimulus";
import AnswerButtonsRow from "@/components/AnswerButtonsRow";
import GlobalCountdown from "@/components/GlobalCountdown";
import SessionResultSummary from "@/components/SessionResultSummary";
import SessionReviewList from "@/components/SessionReviewList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SubtestSession } from "@/types";

export default function SubtestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [screen, setScreen] = useState<'instruction' | 'session' | 'result'>('instruction');
  const [subtestInfo, setSubtestInfo] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<SubtestSession[]>([]);
  
  // Settings state
  const [selectedDuration, setSelectedDuration] = useState<number | ''>(5); // Default 5 minutes
  const [feedbackMode, setFeedbackMode] = useState<boolean>(false); // Default OFF

  // Session state
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [itemIndex, setItemIndex] = useState(1);
  const [sessionItems, setSessionItems] = useState<any[]>([]);
  
  const currentItem = sessionItems[itemIndex - 1] || null;
  
  // Flash feedback state
  const [flashStatus, setFlashStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [isInputLocked, setIsInputLocked] = useState(false);

  // Result state
  const [resultMetrics, setResultMetrics] = useState<any>(null);

  useEffect(() => {
    // Load subtests to get the name, and recent sessions
    fetch('/api/subtests').then(res => res.json()).then(data => {
      const info = data.subtests?.find((s: any) => s.id === id);
      if (info) {
        setSubtestInfo(info);
        if (info.default_time_limit_seconds) {
          setSelectedDuration(Math.floor(info.default_time_limit_seconds / 60));
        }
      }
    });
    fetchRecentSessions();
  }, [id]);

  const fetchRecentSessions = () => {
    fetch(`/api/subtests/${id}/sessions?limit=5`).then(res => res.json()).then(data => {
      if (data.sessions) setRecentSessions(data.sessions);
    });
  };

  const handleStart = async (durationMins: number | '', fbMode: boolean) => {
    const finalDuration = typeof durationMins === 'number' && durationMins > 0 ? durationMins : 5;
    setSelectedDuration(finalDuration);
    setFeedbackMode(fbMode);
    
    try {
      const res = await fetch(`/api/subtests/${id}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeLimitSeconds: finalDuration * 60 })
      });
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        const firstItem = generateLetterMatchItem();
        setSessionItems([{
          itemIndex: 1,
          stimulus: { rowA: firstItem.rowA, rowB: firstItem.rowB },
          correctAnswer: firstItem.correctAnswer,
          userAnswer: null,
          isCorrect: false,
          answeredAtMs: null
        }]);
        setItemIndex(1);
        setEndTime(Date.now() + (finalDuration * 60 * 1000));
        setScreen('session');
      }
    } catch (e) {
      console.error(e);
      alert("Gagal memulai sesi");
    }
  };

  const handleAnswer = (userAnswer: number) => {
    if (isInputLocked) return;

    const isCorrect = userAnswer === currentItem.correctAnswer;
    const answeredAtMs = Date.now() - (endTime! - ((typeof selectedDuration === 'number' ? selectedDuration : 5) * 60 * 1000));

    setSessionItems(prev => {
      const newItems = [...prev];
      newItems[itemIndex - 1] = {
        ...newItems[itemIndex - 1],
        userAnswer,
        isCorrect,
        answeredAtMs
      };
      return newItems;
    });

    if (feedbackMode) {
      setFlashStatus(isCorrect ? 'correct' : 'incorrect');
      setTimeout(() => setFlashStatus(null), 350);
    }
  };

  const handleNext = () => {
    if (!currentItem || currentItem.userAnswer === null) {
      return; // Do nothing if answer not selected
    }

    if (itemIndex === sessionItems.length) {
      // Generate new item
      const nextItem = generateLetterMatchItem();
      setSessionItems(prev => [
        ...prev,
        {
          itemIndex: prev.length + 1,
          stimulus: { rowA: nextItem.rowA, rowB: nextItem.rowB },
          correctAnswer: nextItem.correctAnswer,
          userAnswer: null,
          isCorrect: false,
          answeredAtMs: null
        }
      ]);
    }
    setItemIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (itemIndex > 1) {
      setItemIndex(prev => prev - 1);
    }
  };

  const handleExpire = async () => {
    setIsInputLocked(true); // Lock instantly
    
    // Fallback if they didn't answer the current item?
    // We just ignore the current item.
    
    // Only score answered items
    const answeredItems = sessionItems.filter(i => i.userAnswer !== null);
    const correctCount = answeredItems.filter(i => i.isCorrect).length;
    
    try {
      const res = await fetch(`/api/subtests/${id}/sessions/${sessionId}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemsAttempted: answeredItems.length,
          correctCount,
          items: answeredItems
        })
      });
      const data = await res.json();
      if (data.ok) {
        setResultMetrics({
          attempted: sessionItems.length,
          correct: correctCount,
          accuracy: data.accuracyPercent,
          ipm: data.itemsPerMinute
        });
        setScreen('result');
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan hasil sesi");
    }
  };

  if (screen === 'instruction') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors relative">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <SubtestInstructionScreen 
          subtestName={subtestInfo?.name || "Memuat..."}
          onStart={handleStart}
          recentSessions={recentSessions}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          feedbackMode={feedbackMode}
          setFeedbackMode={setFeedbackMode}
        />
      </div>
    );
  }

  if (screen === 'session') {
    return (
      <div className={`min-h-screen transition-colors duration-300 flex flex-col items-center justify-center relative ${
        flashStatus === 'correct' ? 'bg-green-100 dark:bg-green-900' : 
        flashStatus === 'incorrect' ? 'bg-red-100 dark:bg-red-900' : 
        'bg-white dark:bg-slate-900'
      }`}>
        <div className="absolute top-8 w-full">
          <GlobalCountdown endTime={endTime!} onExpire={handleExpire} />
          <div className="text-center mt-2 text-slate-500 font-semibold tracking-widest uppercase">Soal ke-{itemIndex}</div>
        </div>

        {currentItem && (
          <LetterMatchStimulus rowA={currentItem.stimulus.rowA} rowB={currentItem.stimulus.rowB} />
        )}

        <div className="absolute bottom-8 w-full px-4 flex flex-col items-center">
          <AnswerButtonsRow onAnswer={handleAnswer} disabled={isInputLocked} selectedValue={currentItem?.userAnswer} />
          
          <div className="mt-8 w-full max-w-xl flex justify-between">
            <button 
              onClick={handlePrev}
              disabled={itemIndex === 1}
              className={`px-6 py-3 rounded font-bold transition-colors ${itemIndex > 1 ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}
            >
              ← Sebelumnya
            </button>
            <button 
              onClick={handleNext}
              disabled={currentItem?.userAnswer === null}
              className={`px-6 py-3 rounded font-bold transition-colors ${currentItem?.userAnswer !== null ? 'bg-[#0F2A43] hover:bg-[#E8821E] text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'}`}
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors px-4 relative">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {resultMetrics && (
          <SessionResultSummary 
            attempted={resultMetrics.attempted}
            correct={resultMetrics.correct}
            accuracy={resultMetrics.accuracy}
            ipm={resultMetrics.ipm}
          />
        )}
        
        <SessionReviewList items={sessionItems} />

        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => {
              setScreen('instruction');
              fetchRecentSessions();
              setIsInputLocked(false);
              setFlashStatus(null);
            }}
            className="bg-[#0F2A43] hover:bg-[#E8821E] text-white font-bold py-3 px-6 rounded shadow transition-colors"
          >
            Ulangi Subtes Ini
          </button>
          <Link href="/" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold py-3 px-6 rounded shadow transition-colors">
            Kembali ke Daftar Subtes
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
