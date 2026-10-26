'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('dzitoe-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('dzitoe-theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          'h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400',
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      aria-label={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer',
        theme === 'dark'
          ? 'bg-slate-800 text-amber-300 ring-1 ring-slate-700 hover:bg-slate-700 shadow-sm'
          : 'bg-white text-slate-600 ring-1 ring-slate-200/90 hover:bg-slate-100 hover:text-slate-900 shadow-xs',
        className
      )}
    >
      {theme === 'dark' ? (
        <Sun className="h-4.5 w-4.5 transition-transform duration-200 rotate-0 scale-100 text-amber-400" />
      ) : (
        <Moon className="h-4.5 w-4.5 transition-transform duration-200 rotate-0 scale-100 text-slate-600" />
      )}
    </button>
  );
}
