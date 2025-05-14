import React from 'react';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpeedDemonBadgeProps {
  wpm: number;
  isMobile: boolean;
}

export const SpeedDemonBadge: React.FC<SpeedDemonBadgeProps> = ({ wpm, isMobile }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-semibold shadow-md ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}
            aria-label="Speed Demon Badge"
          >
            <Flame className={`${isMobile ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}`} />
            <span>{wpm} WPM</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Speed Demon! You typed over 100 WPM</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
