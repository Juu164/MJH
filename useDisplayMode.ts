import { useState, useEffect } from 'react';

export type DisplayMode = 'list' | 'grid';

export function useDisplayMode(key = 'concerts-display-mode'): [DisplayMode, (m: DisplayMode) => void] {
  const [mode, setMode] = useState<DisplayMode>(() => {
    const stored = localStorage.getItem(key);
    return stored === 'grid' || stored === 'list' ? (stored as DisplayMode) : 'list';
  });

  useEffect(() => {
    localStorage.setItem(key, mode);
  }, [key, mode]);

  return [mode, setMode];
}
