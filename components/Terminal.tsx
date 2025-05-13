'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { commands } from '@/types/commands';
import { executeCommand, parseCommand } from '@/utils/commandParser';
import { downloadFile } from '@/utils/downloadFile';
import { isValidCommand } from '@/utils/statusUtils';
import {
  filterAutocompleteMatches,
  getNextAutocompleteIndex,
  shouldResetAutocomplete,
  updateInputWithMatch,
  handleAutocomplete,
} from '@/utils/terminalUtils';
import { getCurrentDirectory, initialVFS } from '@/utils/virtualFileSystem';
import { desktopWelcomeMessage, mobileWelcomeMessage } from '@/utils/welcomeMessage';
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLiveWPM } from '../utils/wpmUtils';
import { StatusLine } from './StatusLine';
import TerminalHistory from './TerminalHistory';
import TerminalInput from './TerminalInput';
import { SpeedDemonBadge } from './SpeedDemonBadge';

// Local storage key for the speed demon badge
const SPEED_DEMON_KEY = 'resume-terminal-speed-demon';
// WPM threshold for the speed demon badge
const SPEED_DEMON_THRESHOLD = 100;
// Minimum typing duration in ms (10 seconds)
const MIN_TYPING_DURATION = 10000;

export default function Terminal() {
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState('');
  const [wpm, onWpmInput] = useLiveWPM();
  const [output, setOutput] = useState<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState<number | null>(null);
  const [vfs, setVfs] = useState(initialVFS);
  const [hasUsedTab, setHasUsedTab] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number | null>(null);
  const [autocompletePrefix, setAutocompletePrefix] = useState<string | null>(null);
  const [speedDemonWpm, setSpeedDemonWpm] = useState<number | null>(null);
  const typingStartTimeRef = useRef<number | null>(null);
  const highWpmRef = useRef<number>(0);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkWidth();
    setOutput([window.innerWidth < 768 ? mobileWelcomeMessage : desktopWelcomeMessage]);

    // Load speed demon badge from localStorage if it exists
    try {
      const savedSpeedDemon = localStorage.getItem(SPEED_DEMON_KEY);
      if (savedSpeedDemon) {
        setSpeedDemonWpm(parseInt(savedSpeedDemon, 10));
      }
    } catch (e) {
      console.error('Error loading speed demon badge from localStorage', e);
    }

    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Track high WPM and check for speed demon achievement
  useEffect(() => {
    // Only track when actively typing
    if (wpm > 0) {
      // Start tracking typing duration
      if (typingStartTimeRef.current === null) {
        typingStartTimeRef.current = Date.now();
      }
      
      // Track highest WPM
      if (wpm > highWpmRef.current) {
        highWpmRef.current = wpm;
      }
      
      // Check if typing duration exceeds minimum and WPM exceeds threshold
      const typingDuration = Date.now() - (typingStartTimeRef.current || 0);
      if (typingDuration >= MIN_TYPING_DURATION && highWpmRef.current >= SPEED_DEMON_THRESHOLD) {
        // Award speed demon badge if it's a new record
        if (!speedDemonWpm || highWpmRef.current > speedDemonWpm) {
          setSpeedDemonWpm(highWpmRef.current);
          try {
            localStorage.setItem(SPEED_DEMON_KEY, highWpmRef.current.toString());
          } catch (e) {
            console.error('Error saving speed demon badge to localStorage', e);
          }
        }
      }
    } else {
      // Reset tracking when not typing
      typingStartTimeRef.current = null;
      highWpmRef.current = 0;
    }
  }, [wpm, speedDemonWpm]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[\u0000-\u001F]/g, '');
      setInput(value);
      onWpmInput(value);
      setHasUsedTab(false);
      setAutocompleteOptions([]);
      setAutocompletePrefix(null);
      setAutocompleteIndex(0);
    },
    [onWpmInput]
  );

  const handleInputSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedCommand = parseCommand(input);
    const { output: commandOutput, updatedVfs } = await executeCommand(
      parsedCommand,
      commands,
      vfs
    );

    if (commandOutput === 'CLEAR_TERMINAL') {
      setOutput([]);
    } else {
      setOutput((prev) => [...prev, `$ ${input}`, commandOutput]);
    }

    setVfs(updatedVfs);
    if (isValidCommand(input, commands)) {
      setCommandHistory((prev) => [...prev, input]);
    }
    setHistoryIndex(null);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const inputParts = input.split(' ');
      const isTrailingSpace = input.endsWith(' ');
      if (isTrailingSpace) inputParts.push('');

      const cyclingPrefix = autocompletePrefix ?? inputParts[inputParts.length - 1];

      if (inputParts.length === 1 && cyclingPrefix !== '') {
        // Command autocomplete
        handleAutocomplete({
          cyclingPrefix,
          options: Object.keys(commands),
          inputParts,
          autocompleteOptions,
          autocompletePrefix,
          autocompleteIndex,
          setAutocompleteOptions,
          setAutocompleteIndex,
          setAutocompletePrefix,
          setInput,
          setHasUsedTab,
        });
      } else {
        // Directory/file autocomplete
        try {
          const currentDir = getCurrentDirectory(vfs);
          const options = currentDir.children ? Object.keys(currentDir.children) : [];
          handleAutocomplete({
            cyclingPrefix,
            options,
            inputParts,
            autocompleteOptions,
            autocompletePrefix,
            autocompleteIndex,
            setAutocompleteOptions,
            setAutocompleteIndex,
            setAutocompletePrefix,
            setInput,
            setHasUsedTab,
          });
        } catch (error) {
          console.error('Error while autocompleting path:', error);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const newIndex = prev === null ? commandHistory.length - 1 : Math.max(prev - 1, 0);
        setInput(commandHistory[newIndex] || '');
        return newIndex;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const newIndex = Math.min(prev + 1, commandHistory.length);
        setInput(commandHistory[newIndex] || '');
        return newIndex === commandHistory.length ? null : newIndex;
      });
    } else if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          if (window.getSelection()?.toString()) {
            // Allow default copy if text is selected
            return;
          }
          e.preventDefault();
          setOutput((prev) => {
            // Check if last output is a matrix-output
            if (prev.length > 0) {
              try {
                const lastIdx = prev.length - 1;
                const last = prev[lastIdx];
                const parsed = JSON.parse(last);
                if (parsed.type === 'matrix-output' && !parsed.cancelled) {
                  parsed.cancelled = true;
                  const updated = [...prev];
                  updated[lastIdx] = JSON.stringify(parsed);
                  return [...updated, `$ ${input}`, '^C'];
                }
              } catch {}
            }
            return [...prev, `$ ${input}`, '^C'];
          });
          setInput('');
          break;
        case 'v':
          // Allow default paste behavior
          return;
        case 'l':
          e.preventDefault();
          setOutput([]);
          break;
        default:
          break;
      }
    }
  };

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData('text')
      .replace(/[\u0000-\u001F]/g, '')
      .trim();
    setInput((prev) => prev + pastedText);
  }, []);

  const handleDownload = () => {
    downloadFile('resume.pdf');
  };

  const handleRefresh = useCallback(() => {
    setInput('');
    setOutput([window.innerWidth < 768 ? mobileWelcomeMessage : desktopWelcomeMessage]);
    setCommandHistory([]);
    setVfs(initialVFS);
    setHasUsedTab(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Card className="w-full max-w-3xl bg-zinc-900 text-zinc-100 font-mono shadow-lg border border-zinc-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 border-b border-zinc-700 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className={`flex items-center gap-2 ${isMobile ? 'mt-2 mb-2' : ''}`}>
              {!isMobile ? (
                <TooltipProvider>
                  {speedDemonWpm && (
                    <div className="mr-2">
                      <SpeedDemonBadge wpm={speedDemonWpm} isMobile={isMobile} />
                    </div>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/resume"
                        tabIndex={0}
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors rounded-md hover:bg-zinc-700/50"
                        aria-label="View Resume"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Resume</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleDownload}
                        tabIndex={0}
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors rounded-md hover:bg-zinc-700/50"
                        aria-label="Download Resume"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download Resume</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  {speedDemonWpm && (
                    <div className="mr-2">
                      <SpeedDemonBadge wpm={speedDemonWpm} isMobile={isMobile} />
                    </div>
                  )}
                  <Link
                    href="/resume"
                    tabIndex={0}
                    className="p-3 text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-700/50 min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label="View Resume"
                  >
                    <ExternalLinkIcon className="w-7 h-7" />
                  </Link>
                  <button
                    onClick={handleDownload}
                    tabIndex={0}
                    className="p-3 text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-700/50 min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label="Download Resume"
                  >
                    <DownloadIcon className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>
          </div>
          <div
            className="flex flex-col h-[60vh] p-4 overflow-auto whitespace-pre-wrap"
            ref={outputRef}
          >
            <TerminalHistory output={output} />
          </div>
          <form onSubmit={handleInputSubmit} className="border-t border-zinc-700">
            <div className="flex flex-col">
              <div className={`flex p-2 relative group ${isMobile ? 'min-h-[56px]' : ''}`}>
                <span
                  className={
                    `text-zinc-500 mr-2 shrink-0 group-focus-within:text-blue-400 transition-colors ` +
                    (isMobile ? 'text-lg pt-2' : '')
                  }
                  style={isMobile ? { minWidth: 32 } : {}}
                >
                  $
                </span>
                <div className={`relative flex-grow ${isMobile ? 'pt-1 pb-1' : ''}`}>
                  {!hasUsedTab && !isMobile && (
                    <span
                      className={
                        `absolute right-2 top-0 text-xs text-zinc-600 pointer-events-none animate-pulse ` +
                        (isMobile ? 'top-2 right-3' : '')
                      }
                    >
                      Press Tab to autocomplete
                    </span>
                  )}
                  <TerminalInput
                    input={input}
                    setInput={setInput}
                    handleKeyDown={handleKeyDown}
                    handleInputChange={handleInputChange}
                    handlePaste={handlePaste}
                    inputRef={inputRef}
                    isMobile={isMobile}
                  />
                </div>
              </div>
              <StatusLine
                currentDirectory={vfs.currentPath}
                validCommandCount={commandHistory.length}
                isMobile={isMobile}
                onHomeDirectory={() => {
                  setVfs((prev) => ({ ...prev, currentPath: [] }));
                }}
                onRefresh={handleRefresh}
                wpm={wpm}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
