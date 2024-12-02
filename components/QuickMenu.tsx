"use client";

import { downloadFile } from "@/utils/downloadFile";
import { togglePrintMode } from "@/utils/printMode";
import { AnimatePresence, motion } from "framer-motion";
import {
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
  MenuIcon,
  PrinterIcon,
} from "lucide-react";
import { useState } from "react";
import { FeedbackForm } from "./FeedbackForm";
import { Button } from "./ui/button";

export function QuickMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintToggle = () => {
    togglePrintMode();
    setIsPrinting(!isPrinting);
  };

  const handleDownload = () => {
    downloadFile("resume.pdf");
  };

  const handleProfileClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div className="fixed bottom-8 left-8 z-50 no-print">
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Button
          className="p-3 rounded-full bg-zinc-800 text-zinc-100 shadow-md hover:bg-zinc-700 hover:scale-110 active:scale-95 transition-all duration-200"
          size="icon"
        >
          <MenuIcon className="w-5 h-5" />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 left-0 bg-zinc-800/90 backdrop-blur-sm rounded-lg shadow-lg p-2 min-w-[140px] border border-zinc-700/50"
            >
              <div className="space-y-1">
                <Button
                  onClick={handlePrintToggle}
                  size="default"
                  variant="ghost"
                  aria-label={
                    isPrinting ? "Disable Print Mode" : "Enable Print Mode"
                  }
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span className="text-xs">
                    {isPrinting ? "Disable" : "Enable"} Print
                  </span>
                </Button>

                <Button
                  onClick={handleDownload}
                  size="default"
                  variant="ghost"
                  aria-label="Download Resume"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span className="text-xs">Download</span>
                </Button>

                <div className="h-px bg-zinc-700/50 my-1" />

                <FeedbackForm />

                <div className="h-px bg-zinc-700/50 my-1" />

                <Button
                  onClick={() =>
                    handleProfileClick("https://github.com/nick-neely")
                  }
                  size="default"
                  variant="ghost"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span className="text-xs">GitHub</span>
                </Button>

                <Button
                  onClick={() =>
                    handleProfileClick("https://linkedin.com/in/nick-neely")
                  }
                  size="default"
                  variant="ghost"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span className="text-xs">LinkedIn</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
