import { useEffect, useRef, useState } from 'react';

// How long (ms) after last keypress before WPM resets
const IDLE_TIMEOUT = 2000;
// How often to update the displayed WPM (ms)
const WPM_UPDATE_INTERVAL = 200;
// Minimum ms typing before calculating WPM to avoid huge spikes from initial words
const MIN_TIME_FOR_WPM_MS = 3000;

// A quick heuristic: a “real” word is at least 3 letters long and contains a vowel
const REAL_WORD_REGEX = /^(?=.{3,}$)[a-z]+[aeiou][a-z]*$/i;

function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => REAL_WORD_REGEX.test(w)).length;
}

/**
 * useLiveWPM
 * Tracks live words-per-minute as the user types.
 * Resets after a period of inactivity.
 * Returns: [wpm, onInput]
 */
export function useLiveWPM() {
  const [wpm, setWpm] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const lastInputRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const wordCountRef = useRef(0);
  const lastTextRef = useRef('');
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  // Call this on every input change
  // Track if a typing session is active
  const sessionActiveRef = useRef(false);

  function onInput(text: string) {
    const now = Date.now();
    const words = countWords(text);
    // Only set baseline when a new typing session truly starts
    if (!sessionActiveRef.current) {
      sessionActiveRef.current = true;
      setIsTyping(true);
      startTimeRef.current = now;
      wordCountRef.current = words;
    }
    lastInputRef.current = now;
    lastTextRef.current = text;
    // Reset idle timer
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(() => {
      setIsTyping(false);
      sessionActiveRef.current = false;
      // Reset baseline for next session
      startTimeRef.current = null;
      wordCountRef.current = 0;
    }, IDLE_TIMEOUT);
  }

  // WPM calculation effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTyping) {
      interval = setInterval(() => {
        const now = Date.now();
        const start = startTimeRef.current || now;
        const elapsedMs = now - start;
        const elapsedMinutes = elapsedMs / 60000;
        const baselineWords = wordCountRef.current;
        const currentWords = countWords(lastTextRef.current);
        const deltaWords = currentWords - baselineWords;
        // Only calculate after a minimum typing time
        if (elapsedMs >= MIN_TIME_FOR_WPM_MS && deltaWords > 0) {
          const calculatedWpm = Math.round(deltaWords / elapsedMinutes);
          if (calculatedWpm !== wpm) setWpm(calculatedWpm);
        } else if (wpm !== 0) {
          setWpm(0);
        }
      }, WPM_UPDATE_INTERVAL);
    } else if (wpm > 0) {
      // Decay WPM to zero when idle
      interval = setInterval(() => {
        setWpm((prev) => (prev > 2 ? prev - 2 : 0));
      }, WPM_UPDATE_INTERVAL);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping, wpm]);

  // Cleanup
  useEffect(
    () => () => {
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    },
    []
  );

  return [wpm, onInput] as const;
}
