import { Toaster } from "@/components/ui/sonner";
import "@/styles/print.css";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "ResumeTerminal",
  description: "A modern, command-line interface for your resume",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="min-h-screen bg-zinc-900">
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
