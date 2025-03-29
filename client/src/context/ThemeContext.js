import React, { createContext, useState, useContext, useEffect } from 'react';

// Создаем контекст темы
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Провайдер контекста темы
export const ThemeProvider = ({ children }) => {
  // Получаем сохраненную тему из localStorage или используем светлую тему по умолчанию
  const [theme, setTheme] = useState('light');

  // Функция переключения темы
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Применяем тему к body при изменении
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
