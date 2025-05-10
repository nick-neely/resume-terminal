import { Send } from "lucide-react";
import React, { useRef, useEffect } from "react";

interface TerminalInputProps {
  input: string;
  setInput: (input: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isMobile: boolean;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  input,
  setInput,
  handleKeyDown,
  handleInputChange,
  handlePaste,
  inputRef,
  isMobile,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        spellCheck={false}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        className={
          isMobile
            ? "absolute w-full h-12 bg-transparent border-none text-transparent focus:outline-none focus:ring-0 caret-transparent touch-manipulation"
            : "absolute w-full h-6 bg-transparent border-none text-transparent focus:outline-none focus:ring-0 caret-transparent"
        }
        style={isMobile ? { minHeight: 48, fontSize: 18, paddingLeft: 2 } : {}}
        inputMode={isMobile ? "text" : undefined}
        aria-label="Command input"
      />
      <span
        className={
          `whitespace-pre-wrap break-all pointer-events-none select-none absolute left-0 top-0 w-full h-full px-0 ` +
          (isMobile ? "text-lg min-h-[48px] pt-2" : "")
        }
        style={isMobile ? { minHeight: 48 } : {}}
      >
        {input}
        <span className="animate-blink">▋</span>
      </span>
      {/* Mobile submit button */}
      {isMobile && (
        <button
          type="submit"
          aria-label="Send command"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-700 text-zinc-200 rounded-full p-2 flex items-center justify-center shadow-md active:bg-zinc-800 focus:outline-none w-10 h-10"
        >
          <Send className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default TerminalInput;
