import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className="theme-toggle">
      <button 
        className={`theme-toggle__button ${theme === 'dark' ? 'theme-toggle__button--active' : ''}`} 
        onClick={toggleTheme}
        title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default ThemeToggle; 