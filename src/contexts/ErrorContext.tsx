import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Error {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
}

interface ErrorContextType {
  errors: Error[];
  addError: (message: string, type?: 'error' | 'warning' | 'info') => void;
  clearError: (timestamp: number) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<Error[]>([]);

  const addError = (message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setErrors(prev => [...prev, { message, type, timestamp: Date.now() }]);
  };

  const clearError = (timestamp: number) => {
    setErrors(prev => prev.filter(error => error.timestamp !== timestamp));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, clearError, clearAllErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}; 