import React, { createContext, useContext, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useLoading } from './LoadingContext';
import { useError } from './ErrorContext';
import { wagmiAdapter } from '../config/wagmi';

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  connect: (connectorType?: 'metaMask' | 'walletConnect' | 'coinbaseWallet' | 'pontem' | 'phantom') => Promise<void>;
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

  const connect = async (connectorType?: 'metaMask' | 'walletConnect' | 'coinbaseWallet' | 'pontem' | 'phantom') => {
    try {
      startLoading('wallet');
      let connector;
      
      if (connectorType) {
        if (connectorType === 'pontem' && !(window as any).pontem) {
          addError('Pontem wallet is not installed. Please install it from the Chrome Web Store.');
          return;
        }
        if (connectorType === 'phantom' && !(window as any).phantom?.solana) {
          addError('Phantom wallet is not installed. Please install it from phantom.app');
          return;
        }

        connector = connectors.find(c => c.id === connectorType);
        if (!connector) {
          if (connectorType === 'metaMask' && !(window as any).ethereum?.isMetaMask) {
            addError('MetaMask is not installed. Please install it from metamask.io');
          } else {
            addError(`${connectorType} wallet is not installed. Please install it first.`);
          }
          return;
        }
      } else {
        connector = connectors[0];
      }

      if (!connector) {
        addError('No wallet connector available');
        return;
      }

      await connectAsync({ connector });
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message);
      } else {
        addError('Failed to connect wallet');
      }
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