import React, { createContext, useContext, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useLoading } from './LoadingContext';
import { useError } from './ErrorContext';
import { wagmiAdapter } from '../config/wagmi';

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { startLoading, stopLoading } = useLoading();
  const { addError } = useError();

  const connect = async () => {
    try {
      startLoading('wallet');
      const connector = connectors[0]; // Utilise le premier connecteur disponible
      if (!connector) {
        throw new Error('No connector available');
      }
      await connectAsync({ connector });
    } catch (error) {
      addError('Failed to connect wallet');
      console.error('Wallet connection error:', error);
    } finally {
      stopLoading('wallet');
    }
  };

  const disconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      addError('Failed to disconnect wallet');
      console.error('Wallet disconnection error:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 