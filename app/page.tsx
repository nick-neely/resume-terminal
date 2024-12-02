import Terminal from "@/components/Terminal";
import { TutorialOverlay } from "@/components/TutorialOverlay";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800">
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Terminal />
        <TutorialOverlay />
      </main>
    </div>
  );
}
