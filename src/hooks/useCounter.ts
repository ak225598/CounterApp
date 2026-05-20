import { useCallback, useEffect, useRef, useState } from 'react';

const INACTIVITY_DELAY_MS = 3000;
const AUTO_DECREMENT_INTERVAL_MS = 800;
const GRADUAL_RESET_INTERVAL_MS = 80;
const HISTORY_LIMIT = 10;

export interface CounterState {
  value: number;
  incrementCount: number;
  isResetting: boolean;
  history: number[];
}

export interface CounterActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  notifyInteraction: () => void;
}

export function useCounter(): CounterState & CounterActions {
  const [value, setValue] = useState<number>(0);
  const [incrementCount, setIncrementCount] = useState<number>(0);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([0]);

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoDecrementRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pushHistory = useCallback((newValue: number) => {
    setHistory(prev => {
      const next = [...prev, newValue];
      return next.length > HISTORY_LIMIT ? next.slice(-HISTORY_LIMIT) : next;
    });
  }, []);

  const stopAutoDecrement = useCallback(() => {
    if (autoDecrementRef.current !== null) {
      clearInterval(autoDecrementRef.current);
      autoDecrementRef.current = null;
    }
  }, []);

  const startAutoDecrement = useCallback(() => {
    stopAutoDecrement();
    autoDecrementRef.current = setInterval(() => {
      setValue(prev => {
        if (prev <= 0) {
          stopAutoDecrement();
          return 0;
        }
        const next = prev - 1;
        pushHistory(next);
        return next;
      });
    }, AUTO_DECREMENT_INTERVAL_MS);
  }, [stopAutoDecrement, pushHistory]);

  const resetInactivityTimer = useCallback(() => {
    stopAutoDecrement();
    
    if (inactivityTimerRef.current !== null) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Start a fresh countdown
    inactivityTimerRef.current = setTimeout(() => {
      startAutoDecrement();
    }, INACTIVITY_DELAY_MS);
  }, [stopAutoDecrement, startAutoDecrement]);

  const stopGradualReset = useCallback(() => {
    if (resetIntervalRef.current !== null) {
      clearInterval(resetIntervalRef.current);
      resetIntervalRef.current = null;
    }
  }, []);

  const increment = useCallback(() => {
    stopGradualReset();
    setIsResetting(false);

    setIncrementCount(prev => {
      const nextCount = prev + 1;
      const delta = nextCount % 5 === 0 ? 5 : 1;

      setValue(current => {
        const next = current + delta;
        pushHistory(next);
        return next;
      });

      return nextCount;
    });

    resetInactivityTimer();
  }, [stopGradualReset, pushHistory, resetInactivityTimer]);

  const decrement = useCallback(() => {
    stopGradualReset();
    setIsResetting(false);

    setValue(prev => {
      if (prev <= 0) return 0;
      const next = prev - 1;
      pushHistory(next);
      return next;
    });

    resetInactivityTimer();
  }, [stopGradualReset, pushHistory, resetInactivityTimer]);

  const reset = useCallback(() => {
    stopGradualReset();
    stopAutoDecrement();

    setIsResetting(true);

    resetIntervalRef.current = setInterval(() => {
      setValue(prev => {
        if (prev <= 0) {
          stopGradualReset();
          setIsResetting(false);
          return 0;
        }
        const next = prev - 1;
        pushHistory(next);
        return next;
      });
    }, GRADUAL_RESET_INTERVAL_MS);

    resetInactivityTimer();
  }, [stopGradualReset, stopAutoDecrement, pushHistory, resetInactivityTimer]);

  const notifyInteraction = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      stopAutoDecrement();
      stopGradualReset();
    };
  }, []);

  return {
    value,
    incrementCount,
    isResetting,
    history,
    increment,
    decrement,
    reset,
    notifyInteraction,
  };
}
