import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  isLoading: (key: string) => boolean;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  clearAll: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    refresh: false,
    wallet: false,
    assets: false,
    stats: false
  });

  const isLoading = (key: string) => !!loadingStates[key];

  const startLoading = (key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  };

  const stopLoading = (key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  };

  const clearAll = () => {
    setLoadingStates({
      refresh: false,
      wallet: false,
      assets: false,
      stats: false
    });
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, clearAll }}>
      {children}
    </LoadingContext.Provider>
  );
}; 