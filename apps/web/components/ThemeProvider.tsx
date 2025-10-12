"use client";

import { useEffect } from "react";
import { useUIStore } from "@repo/store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    // Initialize theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'dark';
    setTheme(savedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (savedTheme === 'system') {
        setTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [setTheme]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
}
