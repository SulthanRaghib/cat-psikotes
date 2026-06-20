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
import { SubtestSession } from "@/types";

export default function SubtestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [screen, setScreen] = useState<'instruction' | 'session' | 'result'>('instruction');
  const [subtestInfo, setSubtestInfo] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<SubtestSession[]>([]);
  
  // Settings state
  const [selectedDuration, setSelectedDuration] = useState<number>(6); // Default 6 minutes
  const [feedbackMode, setFeedbackMode] = useState<boolean>(true); // Default ON

  // Session state
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [itemIndex, setItemIndex] = useState(1);
  const [sessionItems, setSessionItems] = useState<any[]>([]);
  
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

  const handleStart = async (durationMins: number, fbMode: boolean) => {
    setSelectedDuration(durationMins);
    setFeedbackMode(fbMode);
    
    try {
      const res = await fetch(`/api/subtests/${id}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeLimitSeconds: durationMins * 60 })
      });
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        setSessionItems([]);
        setItemIndex(1);
        setEndTime(Date.now() + (durationMins * 60 * 1000));
        setCurrentItem(generateLetterMatchItem());
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
    const answeredAtMs = Date.now() - (endTime! - (selectedDuration * 60 * 1000));

    const itemRecord = {
      itemIndex,
      stimulus: { rowA: currentItem.rowA, rowB: currentItem.rowB },
      correctAnswer: currentItem.correctAnswer,
      userAnswer,
      isCorrect,
      answeredAtMs
    };

    setSessionItems(prev => [...prev, itemRecord]);

    if (feedbackMode) {
      // Flash feedback
      setFlashStatus(isCorrect ? 'correct' : 'incorrect');
      setIsInputLocked(true);
      setTimeout(() => {
        setFlashStatus(null);
        setIsInputLocked(false);
        advanceToNextItem();
      }, 350);
    } else {
      // Instant transition
      advanceToNextItem();
    }
  };

  const advanceToNextItem = () => {
    setItemIndex(prev => prev + 1);
    setCurrentItem(generateLetterMatchItem());
  };

  const handleExpire = async () => {
    setIsInputLocked(true); // Lock instantly
    
    // Fallback if they didn't answer the current item?
    // We just ignore the current item.
    
    const correctCount = sessionItems.filter(i => i.isCorrect).length;
    
    try {
      const res = await fetch(`/api/subtests/${id}/sessions/${sessionId}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemsAttempted: sessionItems.length,
          correctCount,
          items: sessionItems
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors">
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
          <LetterMatchStimulus rowA={currentItem.rowA} rowB={currentItem.rowB} />
        )}

        <div className="absolute bottom-16 w-full px-4">
          <AnswerButtonsRow onAnswer={handleAnswer} disabled={isInputLocked} />
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors px-4">
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
