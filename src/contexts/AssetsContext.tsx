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

interface Pool {
  name: string;
  stats: {
    totalDeposits: string;
    totalBorrows: string;
    tvl: string;
  };
}

interface AssetsContextType {
  assets: Asset[];
  mainAssets: Asset[];
  isolatedAssets: Asset[];
  pools: Pool[];
  updateAsset: (symbol: string, updates: Partial<Asset>) => void;
  refreshAssets: () => Promise<void>;
  updateAssetBalances: () => Promise<void>;
  initialAssets: Asset[];
  borrowedAssets: Asset[];
  updateBorrowedAssets: (assets: Asset[]) => void;
  depositedAssets: Asset[];
}

const initialAssets: Asset[] = [
  {
    symbol: 'ETH',
    icon: '/icons/eth.svg',
    price: '3,500.00',
    balance: '0',
    deposited: '125k',
    depositAPR: '2.45%',
    borrowAPR: '3.12%',
    isIsolated: false,
    address: '0x2eaa73bd0db20c64f53febea7b5f5e5bccc7fb8b',
    deposits: {
      amount: '125k',
      value: '437.5m'
    },
    borrows: {
      amount: '45k',
      value: '157.5m'
    },
    ltv: '0.825 / 1'
  },
  {
    symbol: 'cBTC',
    icon: 'https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp?1726136727',
    price: '103,816.89',
    balance: '0',
    deposited: '30.3877',
    depositAPR: '0.07%',
    borrowAPR: '1.78%',
    isIsolated: false,
    address: '0x7c217C4C3A6e16dB92d45BE67d4642d2D7aC8703',
    deposits: {
      amount: '30.3877',
      value: '3.15m'
    },
    borrows: {
      amount: '1.5711',
      value: '163k'
    },
    ltv: '0.65 / 1'
  },
  {
    symbol: 'SLND',
    icon: 'https://save.finance/assets/tokens/slnd.svg',
    price: '0.98',
    balance: '0',
    deposited: '7.50m',
    depositAPR: '0.00%',
    borrowAPR: '12.24%',
    isIsolated: true,
    address: '0x8c8687fC965593DFb2F0b4EAeFD55E9D8df348df',
    deposits: {
      amount: '7.50m',
      value: '7.37m'
    },
    borrows: {
      amount: '1.91k',
      value: '1.87k'
    },
    ltv: '0 / 1.40'
  },
  {
    symbol: 'SOL',
    icon: '/sol-icon.png',
    price: '217.43',
    balance: '0',
    deposited: '446k',
    depositAPR: '1.68%',
    borrowAPR: '4.96%',
    isIsolated: false,
    address: '0xD31a59c85aE9D8edEFeC411D448f90841571b89c',
    deposits: {
      amount: '446k',
      value: '97.0m'
    },
    borrows: {
      amount: '189k',
      value: '41.1m'
    },
    ltv: '0.65 / 1'
  },
  {
    symbol: 'USDT',
    icon: '/usdt-icon.png',
    price: '1.00',
    balance: '0',
    deposited: '14.2m',
    depositAPR: '9.74%',
    borrowAPR: '14.54%',
    isIsolated: false,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    deposits: {
      amount: '14.2m',
      value: '14.2m'
    },
    borrows: {
      amount: '11.9m',
      value: '11.9m'
    },
    ltv: '0.70 / 1'
  }
];

const initialPools: Pool[] = [
  {
    name: 'Main Pool',
    stats: {
      totalDeposits: '$485m',
      totalBorrows: '$112m',
      tvl: '$373m'
    }
  }
];

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
};

export const AssetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [pools] = useState<Pool[]>(initialPools);
  const { address: userAddress, isConnected } = useAccount();
  const [borrowedAssets, setBorrowedAssets] = useState<Asset[]>([]);
  const [depositedAssets, setDepositedAssets] = useState<Asset[]>([]);

  // Balance ETH natif
  const { data: ethBalance } = useBalance({
    address: userAddress,
    enabled: isConnected && !!userAddress,
  });

  // Balances des tokens ERC20
  const tokenBalances = assets.map(asset => {
    if (asset.symbol === 'ETH') return null; // On skip l'ETH car on le gère séparément
    return useBalance({
      address: userAddress,
      token: asset.address as `0x${string}`,
      enabled: isConnected && !!userAddress,
    });
  });

  const tokenData = assets.map(asset => {
    const tokenAddress = getTokenAddress(asset.symbol) as `0x${string}`;
    return useToken({
      address: tokenAddress,
      enabled: isConnected && !!userAddress,
    });
  });

  const updateAssetBalances = async () => {
    if (!isConnected || !userAddress) return;

    const updatedAssets = assets.map((asset, index) => {
      try {
        if (asset.symbol === 'ETH') {
          // Gestion spéciale pour ETH
          if (ethBalance) {
            return {
              ...asset,
              balance: formatUnits(ethBalance.value, 18)
            };
          }
        } else {
          // Gestion des autres tokens
          const balance = tokenBalances[index]?.data;
          if (balance) {
            return {
              ...asset,
              balance: formatUnits(balance.value, balance.decimals)
            };
          }
        }
        return asset;
      } catch (error) {
        console.error(`Erreur lors de la récupération du solde pour ${asset.symbol}:`, error);
        return asset;
      }
    });

    setAssets(updatedAssets);
  };

  useEffect(() => {
    if (isConnected && userAddress) {
      updateAssetBalances();
    } else {
      setAssets(assets.map(asset => ({ ...asset, balance: '0' })));
    }
  }, [isConnected, userAddress, ethBalance]); // Ajout de ethBalance comme dépendance

  const updateAsset = (symbol: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.symbol === symbol ? { ...asset, ...updates } : asset
    ));
  };

  const refreshAssets = async () => {
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Pour l'instant, on réinitialise simplement avec les données initiales
      setAssets(initialAssets);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des assets:', error);
    }
  };

  // Filtrage des assets principaux (non isolés)
  const mainAssets = assets.filter(asset => !asset.isIsolated);
  
  // Filtrage des assets isolés
  const isolatedAssets = assets.filter(asset => asset.isIsolated);

  // Ajouter une méthode pour mettre à jour les borrowed assets
  const updateBorrowedAssets = (assets: Asset[]) => {
    setBorrowedAssets(assets);
  };

  useEffect(() => {
    const fetchBorrowedAssets = async () => {
      if (!userAddress) return;
      
      try {
        const response = await fetch(`http://localhost:3000/api/borrowed/${userAddress}`);
        const data = await response.json();
        setBorrowedAssets(data);
      } catch (error) {
        console.error('Error fetching borrowed assets:', error);
      }
    };

    fetchBorrowedAssets();
  }, [userAddress]);

  const fetchDepositedAssets = useCallback(async (walletAddress: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deposited/${walletAddress}`);
      const data = await response.json();
      setDepositedAssets(data);
    } catch (error) {
      console.error("Error fetching deposited assets:", error);
    }
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tokens');
        const data = await response.json();
        
        // ... existing asset processing code ...

        if (userAddress) {
          fetchDepositedAssets(userAddress);
          // Fetch borrowed assets ici si nécessaire
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, [userAddress, fetchDepositedAssets]);

  return (
    <AssetsContext.Provider value={{ 
      assets, 
      mainAssets, 
      isolatedAssets,
      pools, 
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

// Fonction utilitaire pour obtenir l'adresse du contrat du token
const getTokenAddress = (symbol: string): string => {
  const tokenAddresses: { [key: string]: string } = {
    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    // 'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    // 'ETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    // Ajoutez d'autres tokens selon vos besoins
  };
  
  return tokenAddresses[symbol] || '';
}; 