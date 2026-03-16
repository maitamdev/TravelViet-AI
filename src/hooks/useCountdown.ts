import { useState, useEffect, useCallback, useRef } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isFinished: boolean;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * Hook for countdown timer - useful for trip countdowns
 */
export function useCountdown(targetDate: string | Date): CountdownResult {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetRef = useRef(new Date(targetDate).getTime());

  const calculate = useCallback(() => {
    const now = Date.now();
    const diff = Math.max(0, Math.floor((targetRef.current - now) / 1000));
    setTotalSeconds(diff);
    return diff;
  }, []);

  useEffect(() => {
    targetRef.current = new Date(targetDate).getTime();
    calculate();
  }, [targetDate, calculate]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      const remaining = calculate();
      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, calculate]);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isFinished: totalSeconds <= 0,
    isPaused,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
    reset: () => { setIsPaused(false); calculate(); },
  };
}