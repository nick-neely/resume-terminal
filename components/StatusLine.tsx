'use client';

import { getFormattedTime } from '@/utils/statusUtils';
import {
  Activity,
  Clock,
  FolderIcon,
  Monitor,
  RefreshCcw,
  Smartphone,
  Terminal,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatWpm } from '../utils/statusUtils';

interface StatusLineProps {
  currentDirectory: string[];
  validCommandCount: number;
  isMobile: boolean;
  onHomeDirectory: () => void;
  onRefresh: () => void;
  wpm: number;
}

function truncatePath(segments: string[]) {
  if (segments.length <= 2) return segments.join('/');
  const first = segments[0];
  const last = segments[segments.length - 1];
  return `${first}/.../${last}`;
}

export function StatusLine({
  currentDirectory,
  validCommandCount,
  isMobile,
  onHomeDirectory,
  onRefresh,
  wpm,
}: StatusLineProps) {
  const [time, setTime] = useState(getFormattedTime());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex items-center justify-between px-4 py-1 text-sm border-t border-zinc-800 bg-zinc-900/50 text-zinc-400 pointer-events-none">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <FolderIcon
            className="w-4 h-4 hover:text-zinc-200 hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
            onClick={onHomeDirectory}
          />
          <span className="transition-colors max-w-[120px] md:max-w-none truncate block">
            {isMobile
              ? (currentDirectory.length === 0
                  ? '/'
                  : '/' + truncatePath(currentDirectory))
              : (currentDirectory.length === 0
                  ? '/'
                  : '/' + currentDirectory.join('/'))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>
            {validCommandCount} cmd{validCommandCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {wpm > 0 && !isMobile && (
          <span className="flex items-center gap-1 text-zinc-500">
            <Activity className="w-4 h-4" />
            {formatWpm(wpm)}
          </span>
        )}
        <RefreshCcw
          className={`w-4 h-4 hover:text-zinc-200 cursor-pointer pointer-events-auto transition-all ${
            isRefreshing ? 'animate-spin' : 'hover:scale-110 active:scale-95'
          }`}
          onClick={handleRefresh}
        />
        {isMobile ? (
          <Smartphone className="w-4 h-4 text-zinc-500" />
        ) : (
          <>
            <Monitor className="w-4 h-4 text-zinc-500" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span suppressHydrationWarning>{time}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
