import { useEffect, useRef, useState } from "react";

// How long (ms) after last keypress before WPM resets
const IDLE_TIMEOUT = 2000;
// How often to update the displayed WPM (ms)
const WPM_UPDATE_INTERVAL = 200;

function countWords(text: string) {
  // Split by whitespace, ignore empty
  return text.trim().split(/\s+/).filter(Boolean).length;
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
  const lastTextRef = useRef("");
  const decayTimeout = useRef<NodeJS.Timeout | null>(null);
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
        const elapsed = startTimeRef.current ? (now - startTimeRef.current) / 60000 : 0;
        const baselineWords = wordCountRef.current;
        const currentWords = countWords(lastTextRef.current);
        const deltaWords = currentWords - baselineWords;
        if (elapsed > 0.008 && deltaWords > 0) {
          const calculatedWpm = Math.round(deltaWords / elapsed);
          if (calculatedWpm !== wpm) setWpm(calculatedWpm);
        } else if (wpm !== 0) {
          setWpm(0);
        }
      }, WPM_UPDATE_INTERVAL);
    } else if (wpm > 0) {
      // Decay WPM to zero when idle
      interval = setInterval(() => {
        setWpm(prev => (prev > 2 ? prev - 2 : 0));
      }, WPM_UPDATE_INTERVAL);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping, wpm]);


  // Cleanup
  useEffect(() => () => {
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    if (decayTimeout.current) clearInterval(decayTimeout.current);
  }, []);

  return [wpm, onInput] as const;
}
