'use client';

import { downloadFile } from '@/utils/downloadFile';
import { togglePrintMode } from '@/utils/printMode';
import { AnimatePresence, motion } from 'framer-motion';
import { DownloadIcon, GithubIcon, LinkedinIcon, MenuIcon, PrinterIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

export function QuickMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handlePrintToggle = () => {
    togglePrintMode();
    setIsPrinting(!isPrinting);
  };

  const handleDownload = () => {
    downloadFile('resume.pdf');
  };

  const handleProfileClick = (url: string) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const MenuItems = () => (
    <div className="space-y-1">
      <Button
        onClick={handlePrintToggle}
        size="default"
        variant="ghost"
        className="w-full justify-start"
        aria-label={isPrinting ? 'Disable Print Mode' : 'Enable Print Mode'}
      >
        <PrinterIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">{isPrinting ? 'Disable' : 'Enable'} Print</span>
      </Button>

      <Button
        onClick={handleDownload}
        size="default"
        variant="ghost"
        className="w-full justify-start"
        aria-label="Download Resume"
      >
        <DownloadIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">Download</span>
      </Button>

      <div className="h-px bg-zinc-700/50 my-1" />

      <FeedbackForm />

      <div className="h-px bg-zinc-700/50 my-1" />

      <Button
        onClick={() => handleProfileClick('https://github.com/nick-neely')}
        size="default"
        variant="ghost"
        className="w-full justify-start"
      >
        <GithubIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">GitHub</span>
      </Button>

      <Button
        onClick={() => handleProfileClick('https://linkedin.com/in/nick-neely')}
        size="default"
        variant="ghost"
        className="w-full justify-start"
      >
        <LinkedinIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">LinkedIn</span>
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Version */}
      <motion.div className="fixed bottom-8 left-8 z-50 no-print hidden md:block">
        <div className="relative" ref={menuRef}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
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
                className="absolute bottom-full mb-2 left-0 bg-zinc-800/90 backdrop-blur-sm rounded-lg shadow-lg p-2 min-w-[180px] border border-zinc-700/50"
              >
                <MenuItems />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile Version */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 no-print">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              className="w-full py-6 rounded-none border-t border-zinc-700/50 
              bg-zinc-900/95 backdrop-blur-md text-zinc-100 
              hover:bg-zinc-800/90 hover:text-zinc-50 
              active:bg-zinc-800 
              flex items-center justify-center gap-2"
            >
              <MenuIcon className="w-5 h-5" />
              <span className="font-medium">Quick Menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm p-4">
              <MenuItems />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
