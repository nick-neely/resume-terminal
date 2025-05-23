import React from 'react';
import { TerminalOutputType } from '@/types/terminalOutput';
import { GrepOutput as GrepOutputComponent } from './GrepOutput';
import { MatrixOutput } from './MatrixOutput';
import { CoffeeOutput } from './CoffeeOutput';
import { SystemMeltdownOutput, meltdownLines } from './SystemMeltdownOutput';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import TicTacToe from './games/TicTacToe';
import Snake from './games/Snake';
import Hangman from './games/Hangman';

interface TerminalOutputProps {
  output: string;
  index: number;
  onMeltdownComplete?: (index: number) => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  output,
  index,
  onMeltdownComplete,
}) => {
  // Track if meltdown output has finished for this command instance
  const [meltdownComplete, setMeltdownComplete] = useState(false);
  // Try to parse as structured output
  try {
    const data = JSON.parse(output) as TerminalOutputType;

    switch (data.type) {
      case 'grep-output':
        return (
          <div className="mb-2">
            <GrepOutputComponent matches={data.matches} />
          </div>
        );

      case 'grid-output':
        return (
          <div className="mb-2 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            {data.items.map((item, i) => {
              const displayName = item.name + (item.type === 'directory' ? '/' : '');
              const shouldTruncate = displayName.length > 30;
              return (
                <div
                  key={i}
                  className={cn(
                    shouldTruncate ? 'truncate' : '',
                    item.type === 'directory' ? 'text-blue-400' : 'text-zinc-200',
                    'whitespace-nowrap'
                  )}
                  title={shouldTruncate ? displayName : undefined}
                >
                  {displayName}
                </div>
              );
            })}
          </div>
        );

      case 'list-output':
        return (
          <ul className="mb-2 flex flex-col gap-2">
            {data.items.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 inline-block flex-shrink-0"></span>
                <span className="text-zinc-200 whitespace-pre-line">{item}</span>
              </li>
            ))}
          </ul>
        );

      case 'command-output':
        return <div className="mb-2 text-zinc-500">$ {data.command}</div>;

      case 'matrix-output':
        return (
          <div className="mb-2">
            <MatrixOutput
              lines={data.lines ?? 12}
              columns={data.columns ?? 32}
              cancelled={data.cancelled}
            />
          </div>
        );

      case 'coffee-output':
        return (
          <div className="mb-2">
            <CoffeeOutput duration={data.duration ?? 2200} />
          </div>
        );

      case 'system-meltdown-output':
        if (data.static) {
          return (
            <div className="font-mono text-sm text-zinc-200 mb-2">
              {meltdownLines.map((line, i) => (
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
            </div>
          );
        }
        return (
          <div className="mb-2">
            <SystemMeltdownOutput
              onComplete={() => onMeltdownComplete && onMeltdownComplete(index)}
            />
          </div>
        );

      case 'text-output':
        return <div className="mb-2 text-zinc-200">{data.content}</div>;

      case 'game-output':
        switch (data.game) {
          case 'tictactoe':
            return <TicTacToe />;
          case 'snake':
            return <Snake />;
          case 'hangman':
            return <Hangman />;
          default:
            return <div className="mb-2 text-zinc-200">Unknown game type</div>;
        }
    }
  } catch {
    // Default text rendering for non-structured output
    return (
      <div
        className={cn(
          'mb-2',
          output.startsWith('$') && 'text-zinc-500',
          index === 0 && 'animate-slide-in'
        )}
      >
        {output}
      </div>
    );
  }
};
