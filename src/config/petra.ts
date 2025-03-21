import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Configuration du réseau Aptos
const config = new AptosConfig({ network: Network.MAINNET });
const client = new Aptos(config);

// Interface pour le wallet Petra
interface PetraWallet {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  account(): Promise<{ address: string } | null>;
  signAndSubmitTransaction(transaction: any): Promise<{ hash: string }>;
}

// Fonction pour obtenir le wallet Petra
export const getPetraWallet = (): PetraWallet | null => {
  if (typeof window !== 'undefined' && (window as any).petra) {
    return (window as any).petra;
  }
  return null;
};

// Hook personnalisé pour utiliser Petra
export const usePetraWallet = () => {
  const wallet = getPetraWallet();
  
  const connect = async () => {
    if (!wallet) {
      throw new Error('Petra wallet not found');
    }
    await wallet.connect();
  };

  const disconnect = async () => {
    if (!wallet) {
      throw new Error('Petra wallet not found');
    }
    await wallet.disconnect();
  };

  const getAccount = async () => {
    if (!wallet) {
      throw new Error('Petra wallet not found');
    }
    return await wallet.account();
  };

  const signAndSubmitTransaction = async (transaction: any) => {
    if (!wallet) {
      throw new Error('Petra wallet not found');
    }
    return await wallet.signAndSubmitTransaction(transaction);
  };

  return {
    connect,
    disconnect,
    getAccount,
    signAndSubmitTransaction,
    isAvailable: !!wallet
  };
}; 