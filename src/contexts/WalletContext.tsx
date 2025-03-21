import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useLoading } from './LoadingContext';
import { useError } from './ErrorContext';
import { wagmiAdapter } from '../config/wagmi';
import { usePetraWallet } from '../config/petra';
import { pontemWallet, martianWallet } from '../config/customWallets';

interface WalletContextType {
  isWalletSelectorOpen: boolean;
  setIsWalletSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: { [key: string]: boolean };
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  selectedWallet: string | null;
  setSelectedWallet: React.Dispatch<React.SetStateAction<string | null>>;
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  handleWalletSelect: (wallet: string) => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleNetworkSwitch: (chainId: number) => Promise<void>;
  isConnecting: boolean;
  connectors: any[];
  isPetraAvailable: boolean;
  isPontemAvailable: boolean;
  isMartianAvailable: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isPetraConnected, setIsPetraConnected] = useState(false);
  const [petraAddress, setPetraAddress] = useState<string | null>(null);
  const [isPontemConnected, setIsPontemConnected] = useState(false);
  const [pontemAddress, setPontemAddress] = useState<string | null>(null);
  const [isMartianConnected, setIsMartianConnected] = useState(false);
  const [martianAddress, setMartianAddress] = useState<string | null>(null);

  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainIdValue = useChainId();
  const { switchChain } = useSwitchChain();
  const { connect: connectPetra, disconnect: disconnectPetra, getAccount, isAvailable: isPetraAvailable } = usePetraWallet();
  const { startLoading, stopLoading } = useLoading();
  const { addError } = useError();

  useEffect(() => {
    if (wagmiConnected) {
      setIsConnected(true);
      setAddress(wagmiAddress || null);
      setChainId(chainIdValue || null);
    } else {
      setIsConnected(false);
      setAddress(null);
      setChainId(null);
    }
  }, [wagmiConnected, wagmiAddress, chainIdValue]);

  const handleWalletSelect = async (wallet: string) => {
    try {
      startLoading('wallet');
      let success = false;

      if (wallet === 'petra') {
        if (!isPetraAvailable) {
          throw new Error('Petra wallet not found');
        }
        await connectPetra();
        const account = await getAccount();
        if (account) {
          setPetraAddress(account.address);
          setIsPetraConnected(true);
          success = true;
        }
      } else if (wallet === 'pontem') {
        if (!pontemWallet.isAvailable()) {
          throw new Error('Pontem wallet not found');
        }
        await pontemWallet.connect();
        const account = await pontemWallet.getAccount();
        if (account) {
          setPontemAddress(account);
          setIsPontemConnected(true);
          success = true;
        }
      } else if (wallet === 'martian') {
        if (!martianWallet.isAvailable()) {
          throw new Error('Martian wallet not found');
        }
        await martianWallet.connect();
        const account = await martianWallet.getAccount();
        if (account) {
          setMartianAddress(account);
          setIsMartianConnected(true);
          success = true;
        }
      } else {
        const normalizedWallet = wallet.toLowerCase();
        const connector = connectors.find(c => {
          const connectorId = c.id.toLowerCase();
          return connectorId === normalizedWallet || 
                 connectorId === `injected-${normalizedWallet}` ||
                 connectorId === `metaMask-${normalizedWallet}`;
        });
        
        if (!connector) {
          throw new Error(`Connector not found: ${wallet}`);
        }

        await connectAsync({ connector });
        success = true;
      }

      if (success) {
        setSelectedWallet(wallet);
        await handleRefresh();
        setIsWalletSelectorOpen(false);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      if (error instanceof Error) {
        addError(error.message);
      }
    } finally {
      stopLoading('wallet');
    }
  };

  const handleDisconnect = async () => {
    try {
      if (selectedWallet === 'petra') {
        await disconnectPetra();
        setIsPetraConnected(false);
        setPetraAddress(null);
      } else if (selectedWallet === 'pontem') {
        await pontemWallet.disconnect();
        setIsPontemConnected(false);
        setPontemAddress(null);
      } else if (selectedWallet === 'martian') {
        await martianWallet.disconnect();
        setIsMartianConnected(false);
        setMartianAddress(null);
      } else {
        await disconnect();
      }
      setSelectedWallet(null);
      setIsConnected(false);
      setAddress(null);
      setChainId(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      startLoading('refresh');
      if (selectedWallet === 'petra') {
        const account = await getAccount();
        if (account) {
          setPetraAddress(account.address);
          setIsPetraConnected(true);
        }
      } else if (selectedWallet === 'pontem') {
        const account = await pontemWallet.getAccount();
        if (account) {
          setPontemAddress(account);
          setIsPontemConnected(true);
        }
      } else if (selectedWallet === 'martian') {
        const account = await martianWallet.getAccount();
        if (account) {
          setMartianAddress(account);
          setIsMartianConnected(true);
        }
      }
      stopLoading('refresh');
    } catch (error) {
      console.error('Failed to refresh wallet state:', error);
      stopLoading('refresh');
    }
  };

  const handleNetworkSwitch = async (newChainId: number) => {
    try {
      startLoading('network');
      if (switchChain) {
        await switchChain({ chainId: newChainId });
      }
      stopLoading('network');
    } catch (error) {
      console.error('Failed to switch network:', error);
      stopLoading('network');
    }
  };

  return (
    <WalletContext.Provider value={{
      isWalletSelectorOpen,
      setIsWalletSelectorOpen,
      isLoading,
      startLoading,
      stopLoading,
      selectedWallet,
      setSelectedWallet,
      isConnected: isConnected || isPetraConnected || isPontemConnected || isMartianConnected,
      address: address || petraAddress || pontemAddress || martianAddress,
      chainId,
      handleWalletSelect,
      handleDisconnect,
      handleRefresh,
      handleNetworkSwitch,
      isConnecting,
      connectors: [...connectors],
      isPetraAvailable,
      isPontemAvailable: pontemWallet.isAvailable(),
      isMartianAvailable: martianWallet.isAvailable()
    }}>
      {children}
    </WalletContext.Provider>
  );
}; 