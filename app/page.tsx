"use client";

import Terminal from "@/components/Terminal";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { PageTransition } from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Terminal />
        <TutorialOverlay />
      </main>
    </PageTransition>
  );
}
