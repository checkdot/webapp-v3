import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Stats {
  mainPool: {
    totalDeposits: string;
    totalBorrows: string;
    tvl: string;
  };
  globalStats: {
    totalUsers: string;
    totalVolume: string;
    apr: string;
  };
}

interface StatsContextType {
  stats: Stats;
  isLoading: boolean;
  refreshStats: () => Promise<void>;
}

const initialStats: Stats = {
  mainPool: {
    totalDeposits: '$484m',
    totalBorrows: '$112m',
    tvl: '$373m'
  },
  globalStats: {
    totalUsers: '15.2k',
    totalVolume: '$1.2B',
    apr: '12.4%'
  }
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStats = async () => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(initialStats); // Pour l'instant, on réinitialise avec les données initiales
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StatsContext.Provider value={{ stats, isLoading, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}; 