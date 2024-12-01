"use client";

import { Card, CardContent } from "@/components/ui/card";
import { commands } from "@/types/commands";
import { executeCommand, parseCommand } from "@/utils/commandParser";
import { getCurrentDirectory, initialVFS } from "@/utils/virtualFileSystem";
import { welcomeMessage } from "@/utils/welcomeMessage";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([welcomeMessage]);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [vfs, setVfs] = useState(initialVFS);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[\u0000-\u001F]/g, "");
      setInput(value);
    },
    []
  );

  const handleInputSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedCommand = parseCommand(input);
    const { output: commandOutput, updatedVfs } = await executeCommand(
      parsedCommand,
      commands,
      vfs
    );

    if (commandOutput === "CLEAR_TERMINAL") {
      setOutput([]);
    } else {
      setOutput((prev) => [...prev, `$ ${input}`, commandOutput]);
    }

    setVfs(updatedVfs);
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(null);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const inputParts = input.split(" ");
      const isTrailingSpace = input.endsWith(" ");

      if (isTrailingSpace) {
        inputParts.push("");
      }

      const lastPart = inputParts[inputParts.length - 1];

      if (inputParts.length === 1 && lastPart !== "") {
        // Autocomplete command
        const matchingCommands = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(lastPart)
        );
        if (matchingCommands.length === 1) {
          inputParts[0] = matchingCommands[0];
          setInput(inputParts.join(" "));
        }
      } else {
        // Autocomplete file or directory
        try {
          const currentDir = getCurrentDirectory(vfs);
          const options = currentDir.children
            ? Object.keys(currentDir.children)
            : [];
          const matchingOptions = options.filter((name) =>
            name.startsWith(lastPart)
          );
          if (matchingOptions.length === 1) {
            inputParts[inputParts.length - 1] = matchingOptions[0];
            setInput(inputParts.join(" "));
          }
        } catch (error) {
          console.error("Error while autocompleting path:", error);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const newIndex =
          prev === null ? commandHistory.length - 1 : Math.max(prev - 1, 0);
        setInput(commandHistory[newIndex] || "");
        return newIndex;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const newIndex = Math.min(prev + 1, commandHistory.length);
        setInput(commandHistory[newIndex] || "");
        return newIndex === commandHistory.length ? null : newIndex;
      });
    } else if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "c":
          if (window.getSelection()?.toString()) {
            // Allow default copy if text is selected
            return;
          }
          e.preventDefault();
          setOutput((prev) => [...prev, `$ ${input}`, "^C"]);
          setInput("");
          break;
        case "v":
          // Allow default paste behavior
          return;
        case "l":
          e.preventDefault();
          setOutput([]);
          break;
        default:
          break;
      }
    }
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData
        .getData("text")
        .replace(/[\u0000-\u001F]/g, "")
        .trim();
      setInput((prev) => prev + pastedText);
    },
    []
  );

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
          <div className="flex items-center justify-start bg-zinc-800 px-4 py-2 border-b border-zinc-700 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div
            ref={outputRef}
            className="h-[60vh] p-4 overflow-auto whitespace-pre-wrap"
          >
            {output.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
          </div>
          <form
            onSubmit={handleInputSubmit}
            className="border-t border-zinc-700"
          >
            <div className="flex p-2">
              <span className="text-zinc-500 mr-2 shrink-0">$</span>
              <div className="relative flex-grow min-h-[24px]">
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
                  className="absolute w-full h-full bg-transparent border-none text-transparent focus:outline-none focus:ring-0"
                />
                <span className="whitespace-pre-wrap break-all">
                  {input}
                  <span className="animate-blink">▋</span>
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
