import React from 'react';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className={`h-4 w-4 transition-all ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
      <Moon className={`absolute h-4 w-4 transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
    </Button>
  );
};

export default ThemeToggle;
