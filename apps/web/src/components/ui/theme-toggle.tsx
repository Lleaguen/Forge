'use client';

import { useTheme } from 'next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⛔ NO renderizar nada hasta estar montado
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="
        p-2 rounded-lg
        border border-brand-border
        hover:bg-brand-primary/80
        dark:text-brand-text
        transition
        fixed
        z-40
        inset-y-0
        block
        w-10
        h-10
        ml-3
        mb-3
        self-end
        rounded-lg
      "
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FiSun size={20} className='m-auto'/> : <FiMoon size={20} className='m-auto'/>}
    </button>
  );
}
