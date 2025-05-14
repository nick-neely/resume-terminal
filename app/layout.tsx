import { Toaster } from '@/components/ui/sonner';
import { config } from '@/config';
import '@/styles/print.css';
import type { Metadata } from 'next';
import { Fira_Code, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

const title = config.name.full;
const shortTitle = config.name.short;
const url = config.seo.url;
const description = config.seo.description;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: `%s | ${shortTitle}`,
  },
  applicationName: title,
  description: description,
  category: config.seo.category,
  keywords: config.seo.keywords,
  authors: [{ name: config.seo.author.name }, { url: config.seo.author.url }],
  creator: config.seo.creator,
  publisher: config.seo.publisher,
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: title,
    images: [
      {
        url: `${url}api/og`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  manifest: `${url}manifest.json`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="min-h-screen bg-zinc-900 transition-all duration-300">
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 transition-all duration-300">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
