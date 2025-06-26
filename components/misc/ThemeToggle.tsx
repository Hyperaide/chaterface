import React, { useEffect, useState } from 'react';
import { Sun, Moon } from '@phosphor-icons/react';
import { useTheme } from '../../providers/theme-provider';

const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    
    // store theme in local storage
    localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={`flex flex-row items-center gap-1 cursor-pointer ${className}`}
    >
      <div className={`flex flex-row items-center p-1 rounded-md ${theme === 'light' ? 'bg-gray-2' : ''}`}>
        <Sun size={12} weight="bold" className="text-gray-12" />
      </div>
      <div className={`flex flex-row items-center p-1 rounded-md ${theme === 'dark' ? 'bg-gray-2' : ''}`}>
        <Moon size={12} weight="bold" className="text-gray-12" />
      </div>
    </button>
  );
};

export default ThemeToggle; 