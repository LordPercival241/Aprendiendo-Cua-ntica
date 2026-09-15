'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle Theme"
      className="relative p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center cursor-pointer"
    >
      <span suppressHydrationWarning>
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
        )}
      </span>
    </button>
  );
}
