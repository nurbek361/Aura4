/**
 * Daily (24h) auto-resetting persisted state.
 *
 * Any counter/value stored with this hook is automatically reset back to its
 * default value once 24 hours have passed since it was last reset — no
 * manual "new day" button needed. Used for things like the water tracker,
 * the daily health checklist, and any other "per-day" widget.
 */
import { useEffect, useState } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

interface StoredValue<T> {
  value: T;
  resetAt: number; // epoch ms of the last reset
}

function readStored<T>(key: string, defaultValue: T): StoredValue<T> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { value: defaultValue, resetAt: Date.now() };
    const parsed = JSON.parse(raw) as StoredValue<T>;
    if (typeof parsed?.resetAt !== 'number') {
      return { value: defaultValue, resetAt: Date.now() };
    }
    return parsed;
  } catch {
    return { value: defaultValue, resetAt: Date.now() };
  }
}

function writeStored<T>(key: string, stored: StoredValue<T>) {
  try {
    localStorage.setItem(key, JSON.stringify(stored));
  } catch {
    // storage unavailable — fail silently, state stays in-memory only
  }
}

/**
 * Behaves like useState, but the value automatically reverts to
 * `defaultValue` once 24 hours have elapsed since the last time it changed
 * (or since the app first ran on this device).
 */
export function useDailyCounter<T>(key: string, defaultValue: T): [T, (v: T) => void, number] {
  const storageKey = `aura_daily_${key}`;
  const [state, setState] = useState<StoredValue<T>>(() => {
    const stored = readStored(storageKey, defaultValue);
    const age = Date.now() - stored.resetAt;
    if (age >= DAY_MS) {
      return { value: defaultValue, resetAt: Date.now() };
    }
    return stored;
  });

  // Re-check on an interval in case the tab stays open across midnight/24h boundary
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        if (Date.now() - prev.resetAt >= DAY_MS) {
          const reset = { value: defaultValue, resetAt: Date.now() };
          writeStored(storageKey, reset);
          return reset;
        }
        return prev;
      });
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const setValue = (v: T) => {
    const next = { value: v, resetAt: state.resetAt };
    setState(next);
    writeStored(storageKey, next);
  };

  const msUntilReset = Math.max(0, DAY_MS - (Date.now() - state.resetAt));

  return [state.value, setValue, msUntilReset];
}
