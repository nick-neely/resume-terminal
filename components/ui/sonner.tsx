'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'group flex items-center gap-3 w-full p-4 rounded-lg bg-zinc-800/90 text-zinc-100 border border-zinc-700/50 shadow-lg backdrop-blur-sm',
          title: 'text-zinc-100 text-sm font-medium',
          description: 'text-zinc-400 text-sm',
          actionButton:
            'bg-zinc-700 text-zinc-100 text-xs px-2 py-1 rounded-md hover:bg-zinc-600 transition-colors',
          cancelButton:
            'text-zinc-400 text-xs px-2 py-1 rounded-md hover:bg-zinc-700/50 transition-colors',
          success: 'border-l-4 border-l-green-500',
          error: 'border-l-4 border-l-red-500',
          info: 'border-l-4 border-l-blue-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
