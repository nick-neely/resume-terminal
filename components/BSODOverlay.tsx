import React from 'react';
import Image from 'next/image';

export const BSODOverlay: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-900/95 text-white font-mono select-none animate-fadein"
      tabIndex={-1}
      onClick={onDismiss}
      onKeyDown={onDismiss}
      style={{
        fontFamily: 'Consolas, Menlo, Monaco, monospace',
        fontSize: '1.15rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      }}
    >
      <div className="text-6xl mb-6">:(</div>
      <div className="max-w-xl text-center">
        <div className="mb-4">
          Your PC ran into a problem and needs to restart.<br />
          We&apos;re just collecting some error info, and then we&apos;ll restart for you.
        </div>
        <div className="mb-4">
          <span className="text-blue-200">For more information about this issue and possible fixes, visit</span><br />
          <span className="text-blue-300 underline">https://www.windows.com/stopcode</span>
        </div>
        <div className="mb-4 text-blue-200">If you call a support person, give them this info:<br />
          Stop code: <span className="text-white">TERMINAL_FAKE_MELTDOWN</span>
        </div>
        <div className="flex flex-col items-center mt-8">
          <div className="w-32 h-32 bg-white flex items-center justify-center rounded-sm mb-2 overflow-hidden">
            <Image src="/qr.png" alt="QR code" width={128} height={128} className="w-full h-full object-contain" />
          </div>
          <span className="text-blue-200 text-xs">Scan for more info</span>
        </div>
        <div className="mt-8 text-blue-200 text-xs">Press any key or click to continue...</div>
      </div>
      <style>{`
        .animate-fadein { animation: fadein-b 0.6s cubic-bezier(.4,0,.2,1); }
        @keyframes fadein-b { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
