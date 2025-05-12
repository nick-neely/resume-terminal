import React, { useEffect, useState } from 'react';

interface MatrixOutputProps {
  lines?: number;
  columns?: number;
  cancelled?: boolean;
}

// Generates random matrix rain lines
function generateMatrixLines(lines = 12, columns = 32) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  return Array.from({ length: lines }).map(() =>
    Array.from({ length: columns })
      .map(() => charset[Math.floor(Math.random() * charset.length)])
      .join('')
  );
}


export const MatrixOutput: React.FC<MatrixOutputProps> = ({ lines = 12, columns = 32, cancelled = false }) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  const [revealed, setRevealed] = useState(0);
  const [matrixLines] = useState(() => generateMatrixLines(lines, columns));

  // Animation state: for each character, track { current, landed, landTime }
  const [charStates, setCharStates] = useState(() => {
    const now = Date.now();
    // Each character gets a random land time between 800ms and 1800ms from now
    return matrixLines.map(line =>
      line.split('').map(final => ({
        final,
        current: charset[Math.floor(Math.random() * charset.length)],
        landed: false,
        landTime: now + 800 + Math.random() * 1000,
      }))
    );
  });

  // Reveal lines one by one as before, unless cancelled
  useEffect(() => {
    if (cancelled) {
      setRevealed(matrixLines.length);
      return;
    }
    if (revealed < matrixLines.length) {
      const timeout = setTimeout(() => setRevealed(revealed + 1), 60);
      return () => clearTimeout(timeout);
    }
  }, [revealed, matrixLines.length, cancelled]);

  // Animate characters in revealed lines, unless cancelled
  useEffect(() => {
    if (cancelled) {
      setCharStates(prev =>
        prev.map((line, i) =>
          line.map(char => ({ ...char, current: char.final, landed: true }))
        )
      );
      return;
    }
    if (revealed === 0) return;
    const interval = setInterval(() => {
      setCharStates(prev => {
        const now = Date.now();
        return prev.map((line, i) => {
          if (i >= revealed) return line;
          return line.map(char => {
            if (char.landed) return char;
            if (now >= char.landTime) {
              return { ...char, current: char.final, landed: true };
            }
            return { ...char, current: charset[Math.floor(Math.random() * charset.length)] };
          });
        });
      });
    }, 40);
    return () => clearInterval(interval);
  }, [revealed, cancelled]);

  const lastLineRef = React.useRef<HTMLDivElement>(null);
  // Only scroll while animation is in progress
  const animationInProgress = React.useMemo(() => {
    // Animation is in progress if not all revealed characters are landed
    return charStates.slice(0, revealed).some(line => line.some(char => !char.landed));
  }, [charStates, revealed]);

  useEffect(() => {
    if (animationInProgress && lastLineRef.current) {
      lastLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [revealed, charStates, animationInProgress]);

  return (
    <pre className="matrix-output text-green-400 font-mono text-sm leading-tight select-none bg-transparent">
      {charStates.slice(0, revealed).map((line, idx) => (
        <div key={idx} ref={idx === revealed - 1 ? lastLineRef : undefined}>
          {line.map((char, cidx) => (
            <span key={cidx} style={{ opacity: char.landed ? 1 : 0.8 }}>{char.current}</span>
          ))}
        </div>
      ))}
    </pre>
  );
};
