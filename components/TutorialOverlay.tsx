'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowRightToLine, ArrowUpDown, MonitorDown, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

const TUTORIAL_STEPS = [
  {
    icon: <Terminal className="w-8 h-8 mb-2 text-zinc-400" />,
    title: 'Welcome to ResumeTerminal',
    description: 'Navigate through my resume using simple terminal commands.',
  },
  {
    icon: <ArrowRightToLine className="w-8 h-8 mb-2 text-zinc-400" />,
    title: 'Command Completion',
    description: 'Press Tab to autocomplete commands and paths.',
  },
  {
    icon: <ArrowUpDown className="w-8 h-8 mb-2 text-zinc-400" />,
    title: 'Command History',
    description: 'Use Up/Down arrows to navigate through previous commands.',
  },
  {
    icon: <MonitorDown className="w-8 h-8 mb-2 text-zinc-400" />,
    title: 'Quick Access',
    description: "Use 'view' to open the visual resume or 'download' for PDF version.",
  },
];

export function TutorialOverlay() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep === TUTORIAL_STEPS.length - 1) {
      setOpen(false);
      localStorage.setItem('hasSeenTutorial', 'true');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {TUTORIAL_STEPS[currentStep].icon}
            <DialogTitle className="text-xl">{TUTORIAL_STEPS[currentStep].title}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {TUTORIAL_STEPS[currentStep].description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button
            variant="outline"
            onClick={handleNext}
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-100"
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
