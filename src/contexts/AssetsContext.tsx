import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAccount, useBalance, useToken } from 'wagmi';
import { formatUnits } from 'viem';
import { erc20Abi } from 'viem'

interface Asset {
  symbol: string;
  icon: string;
  price: string;
  balance: string;
  deposited: string;
  depositAPR: string;
  borrowAPR: string;
  isIsolated?: boolean;
  address: string;
  deposits: {
    amount: string;
    value: string;
  };
  borrows: {
    amount: string;
    value: string;
  };
  ltv: string;
}

interface AssetsContextType {
  assets: Asset[];
  mainAssets: Asset[];
  isolatedAssets: Asset[];
  updateAsset: (symbol: string, updates: Partial<Asset>) => void;
  refreshAssets: () => Promise<void>;
  updateAssetBalances: () => Promise<void>;
  initialAssets: Asset[];
  borrowedAssets: Asset[];
  updateBorrowedAssets: (assets: Asset[]) => void;
  depositedAssets: Asset[];
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
};

export const AssetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mainAssets, setMainAssets] = useState<Asset[]>([]);
  const [isolatedAssets, setIsolatedAssets] = useState<Asset[]>([]);
  const [depositedAssets, setDepositedAssets] = useState<Asset[]>([]);
  const [borrowedAssets, setBorrowedAssets] = useState<Asset[]>([]);
  const { address } = useAccount();

  const fetchAssets = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tokens');
      const data = await response.json();
      
      const processAssets = (assets: any[]) => assets.map(asset => ({
        symbol: asset.symbol,
        icon: asset.icon,
        price: asset.price,
        deposits: asset.deposits,
        borrows: asset.borrows,
        ltv: asset.ltv,
        depositAPR: asset.depositAPR,
        borrowAPR: asset.borrowAPR,
        address: asset.address,
        isIsolated: asset.isIsolated
      }));

      setMainAssets(processAssets(data.categories[0].rows));
      setIsolatedAssets(processAssets(data.categories[1].rows));
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  }, []);

  const updateAssetBalances = useCallback(async () => {
    if (!address) return;

    try {
      const [depositedRes, borrowedRes] = await Promise.all([
        fetch(`http://localhost:3000/api/deposited/${address}`),
        fetch(`http://localhost:3000/api/borrowed/${address}`)
      ]);

      const deposited = await depositedRes.json();
      const borrowed = await borrowedRes.json();

      setDepositedAssets(deposited);
      setBorrowedAssets(borrowed);
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  }, [address]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances]);

  const updateAsset = (symbol: string, updates: Partial<Asset>) => {
    setMainAssets(prev => prev.map(asset => 
      asset.symbol === symbol ? { ...asset, ...updates } : asset
    ));
    setIsolatedAssets(prev => prev.map(asset => 
      asset.symbol === symbol ? { ...asset, ...updates } : asset
    ));
  };

  const refreshAssets = async () => {
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Pour l'instant, on réinitialise simplement avec les données initiales
      fetchAssets();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des assets:', error);
    }
  };

  // Ajouter une méthode pour mettre à jour les borrowed assets
  const updateBorrowedAssets = (assets: Asset[]) => {
    setBorrowedAssets(assets);
  };

  return (
    <AssetsContext.Provider value={{ 
      assets: [...mainAssets, ...isolatedAssets],
      mainAssets, 
      isolatedAssets,
      updateAsset, 
      refreshAssets,
      updateAssetBalances,
      initialAssets: [...mainAssets, ...isolatedAssets],
      borrowedAssets,
      updateBorrowedAssets,
      depositedAssets
    }}>
      {children}
    </AssetsContext.Provider>
  );
};