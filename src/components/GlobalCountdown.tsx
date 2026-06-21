"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  endTime: number; // Unix timestamp in milliseconds
  onExpire: () => void;
}

export default function GlobalCountdown({ endTime, onExpire }: Props) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));
  const onExpireRef = useRef(onExpire);
  
  // Always keep ref pointing to the latest onExpire closure
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    let expired = false;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0 && !expired) {
        expired = true;
        clearInterval(timer);
        onExpireRef.current();
      }
    }, 200); // Check frequently for precision

    return () => clearInterval(timer);
  }, [endTime]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isDanger = timeLeft > 0 && timeLeft <= 30;

  return (
    <div className={`text-4xl md:text-5xl font-mono font-bold text-center ${isDanger ? 'text-red-600 animate-pulse' : 'text-[#0F2A43] dark:text-slate-100'}`}>
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </div>
  );
}
