"use client";

import { getFormattedTime } from "@/utils/statusUtils";
import { Clock, FolderIcon, Monitor, Smartphone, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

interface StatusLineProps {
  currentDirectory: string[];
  totalCommands: number;
  isMobile: boolean;
  onHomeDirectory: () => void;
}

export function StatusLine({
  currentDirectory,
  totalCommands,
  isMobile,
  onHomeDirectory,
}: StatusLineProps) {
  const [time, setTime] = useState(getFormattedTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-1 text-sm border-t border-zinc-800 bg-zinc-900/50 text-zinc-400 pointer-events-none">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <FolderIcon
            className="w-4 h-4 hover:text-zinc-200 transition-colors cursor-pointer pointer-events-auto"
            onClick={onHomeDirectory}
          />
          <span>
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
