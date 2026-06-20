"use client";

import { useEffect, useState } from "react";

interface Props {
  endTime: number; // Unix timestamp in milliseconds
  onExpire: () => void;
}

export default function GlobalCountdown({ endTime, onExpire }: Props) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 200); // Check frequently for precision

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isDanger = timeLeft > 0 && timeLeft <= 30;

  return (
    <div className={`text-4xl md:text-5xl font-mono font-bold text-center ${isDanger ? 'text-red-600 animate-pulse' : 'text-[#0F2A43] dark:text-slate-100'}`}>
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </div>
  );
}
