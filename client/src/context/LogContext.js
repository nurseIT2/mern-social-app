import React, { createContext, useState } from 'react';

export const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logging, setLogging] = useState(false);

  const toggleLogging = () => {
    setLogging(prev => !prev);
  };

  return (
    <LogContext.Provider value={{ logging, toggleLogging }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = React.useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};
