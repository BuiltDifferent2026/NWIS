'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nwis-theme') as 'light' | 'dark' | null;
    const isDark = saved === 'dark' || (!saved && document.documentElement.classList.contains('dark'));
    const initialTheme = isDark ? 'dark' : 'light';
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
      <div className={`h-7 px-2.5 rounded-xs border border-[#d1d5db] dark:border-[#232c3f] bg-white dark:bg-[#141b2a] flex items-center gap-1 text-xs font-mono text-[#6b7280] ${className}`}>
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Theme</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Click to switch to Control Room Dark Theme' : 'Click to switch to Daylight White Theme'}
      className={`h-7 px-2.5 rounded-xs border border-[#d1d5db] dark:border-[#232c3f] bg-white dark:bg-[#141b2a] text-[#0b0c0c] dark:text-[#f1f5f9] hover:bg-[#f3f4f6] dark:hover:bg-[#192336] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-2 focus:outline-[#ffdd00] ${className}`}
      aria-label="Toggle light/dark background theme"
    >
      {theme === 'light' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[11px]">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px]">Dark</span>
        </>
      )}
    </button>
  );
};
