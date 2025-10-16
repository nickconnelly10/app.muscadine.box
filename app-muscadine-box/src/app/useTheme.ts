'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  // Default to 'light' to avoid SSR issues, will be updated on client-side
  const [theme, setTheme] = useState('light');

  // This effect runs once on the client to determine the initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      // Use the theme saved in localStorage
      setTheme(savedTheme);
    } else if (prefersDark) {
      // If no saved theme, use the system preference
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Save the user's explicit choice to localStorage
    localStorage.setItem('theme', newTheme);
  };

  // This effect applies the theme to the <html> tag whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, toggleTheme };
}