import './globals.css'
import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })

export const metadata: Metadata = {
  title: 'ResumeTerminal',
  description: 'A modern, command-line interface for your resume',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="min-h-screen bg-zinc-900">
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800">
          {children}
        </div>
      </body>
    </html>
  )
}

