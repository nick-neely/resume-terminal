"use client";

import { getFormattedTime } from "@/utils/statusUtils";
import { Clock, FolderIcon, Monitor, RefreshCcw, Smartphone, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

interface StatusLineProps {
  currentDirectory: string[];
  totalCommands: number;
  isMobile: boolean;
  onHomeDirectory: () => void;
  onRefresh: () => void;
}

export function StatusLine({
  currentDirectory,
  totalCommands,
  isMobile,
  onHomeDirectory,
  onRefresh,
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
          <span className="transition-colors">
            {currentDirectory.length === 0
              ? "/"
              : "/" + currentDirectory.join("/")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>
            {totalCommands} cmd{totalCommands !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <RefreshCcw
          className={`w-4 h-4 hover:text-zinc-200 cursor-pointer pointer-events-auto transition-all ${
            isRefreshing ? 'animate-spin' : 'hover:scale-110 active:scale-95'
          }`}
          onClick={handleRefresh}
        />
        {isMobile ? (
          <Smartphone className="w-4 h-4 text-zinc-500" />
        ) : (
          <Monitor className="w-4 h-4 text-zinc-500" />
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span suppressHydrationWarning>{time}</span>
        </div>
      </div>
    </div>
  );
}
