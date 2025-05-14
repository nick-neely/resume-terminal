import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BSODOverlay } from './BSODOverlay';

const meltdownLines = [
  '/bin/bash: line 1: warning: removing root filesystem',
  'deleting /bin/bash',
  'deleting /etc/passwd',
  'deleting /usr/bin/python3',
  'deleting /lib/x86_64-linux-gnu/libc.so.6',
  'deleting /boot/vmlinuz',
  'deleting /home/user/.bashrc',
  'deleting /sbin/init',
  'deleting /var/log/syslog',
  'deleting /tmp/.X11-unix',
  'deleting /root/.ssh/authorized_keys',
  'error: failed to remove /dev/null: Input/output error',
  'error: failed to remove /proc/kcore: Operation not permitted',
  'CRITICAL: systemd terminated unexpectedly',
  'Segmentation fault (core dumped)',
  'KERNEL PANIC - not syncing: Attempted to kill init!',
  '[  0.000000] --- SYSTEM FAILURE ---',
  '',
  'Just kidding! 😅',
  'No files were harmed in this simulation',
  '',
];

// Generate a random delay between min and max (in milliseconds)
const getRandomDelay = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const SystemMeltdownOutput: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showBSOD, setShowBSOD] = useState(false);
  const [bsodDismissed, setBsodDismissed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  // Process lines with random delays
  useEffect(() => {
    if (bsodDismissed) return; // Never show BSOD again after dismissed
    if (showBSOD) return;
    if (currentLine >= meltdownLines.length - 3) {
      // After the last error message, show BSOD after a delay
      const bsodTimeout = setTimeout(() => setShowBSOD(true), 900);
      return () => clearTimeout(bsodTimeout);
    }

    const processLine = () => {
      setLines((prev) => [...prev, meltdownLines[currentLine]]);
      setCurrentLine((prev) => prev + 1);
    };

    // Use a base delay and add some randomness
    const baseDelay = 250;
    const randomDelay = getRandomDelay(50, 350);
    let delay = baseDelay + randomDelay;

    // Special case: much longer delay before the BSOD
    if (currentLine === meltdownLines.length - 3) {
      delay = 1200;
    }

    timerRef.current = setTimeout(processLine, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentLine, showBSOD, bsodDismissed]);

  // Dismiss BSOD on key or click
  const handleDismissBSOD = useCallback(() => {
    setShowBSOD(false);
    setBsodDismissed(true);
  }, []);

  useEffect(() => {
    if (!showBSOD) return;
    const onKey = (e: KeyboardEvent) => handleDismissBSOD();
    const onClick = (e: MouseEvent) => handleDismissBSOD();
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [showBSOD, handleDismissBSOD]);

  return (
    <>
      <div className="font-mono text-sm text-zinc-200">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {i < meltdownLines.length - 3 ? (
              <span className="text-red-400">{line}</span>
            ) : i === meltdownLines.length - 3 ? (
              <span className="text-yellow-300">{line}</span>
            ) : (
              <span className="text-zinc-400">{line}</span>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {showBSOD && <BSODOverlay onDismiss={handleDismissBSOD} />}
    </>
  );
};
