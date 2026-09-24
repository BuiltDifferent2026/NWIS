'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nwis-theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('nwis-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Control Room Dark Theme' : 'Switch to Daylight Light Theme'}
      className={`relative p-2 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white hover:bg-[#F5F7F8] dark:hover:bg-[#2D3747] transition-all shadow-2xs ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-[#34435A] hover:text-[#3FC3B6] transition-colors" />
      ) : (
        <Sun className="w-4 h-4 text-[#3FC3B6] hover:text-[#26A69A] transition-colors" />
      )}
    </button>
  );
};
