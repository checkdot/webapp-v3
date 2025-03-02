import { AppKitProvider } from './providers/AppKitProvider';
import { ErrorProvider } from './contexts/ErrorContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WalletProvider } from './contexts/WalletContext';
import { StatsProvider, useStats } from './contexts/StatsContext';
import { AssetsProvider, useAssets } from './contexts/AssetsContext';
import { ModalProvider } from './contexts/ModalContext';
import TopBar from './components/TopBar';
import LoadingIndicator from './components/LoadingIndicator';
import Landing from './Landing';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import WalletSelector from './components/WalletSelector';

import './App.scss'
import AssetsTable from './components/AssetsTable';
import TabPanel from './components/TabPanel';
import Accounts from './components/Accounts';
import Borrowed from './components/Borrowed';
import Deposited from './components/Deposited';
import Balances from './components/Balances';

const MainContent = () => {
  const { mainAssets, isolatedAssets } = useAssets();
  const { stats, isLoading } = useStats();

  const tabs = [
    {
      name: 'Main Pool',
      content: (
        <>
          <div className="stats-panel">
            <div className="stat-item">
              <span className="stat-label">Total deposits</span>
              <span className="stat-value">{stats.mainPool.totalDeposits}</span>
            </div>
            <div className="stat-separator" />
            <div className="stat-item">
              <span className="stat-label">Total borrows</span>
              <span className="stat-value">{stats.mainPool.totalBorrows}</span>
            </div>
            <div className="stat-separator" />
            <div className="stat-item">
              <span className="stat-label">TVL</span>
              <span className="stat-value">{stats.mainPool.tvl}</span>
            </div>
          </div>
          <AssetsTable 
            data={{
              headers: [
                'Asset name',
                'Deposits',
                'Borrows',
                'LTV/BW',
                'Deposit APR',
                'Borrow APR'
              ],
              categories: [
                {
                  name: 'MAIN ASSETS',
                  rows: mainAssets.map(asset => [
                    <div className="asset-name">
                      <img src={asset.icon} alt={asset.symbol} />
                      <div>
                        <span className="symbol">{asset.symbol}</span>
                        <span className="price">${asset.price}</span>
                      </div>
                    </div>,
                    <div className="deposits">
                      <div className="amount">{asset.deposits.amount}</div>
                      <div className="value">${asset.deposits.value}</div>
                    </div>,
                    <div className="borrows">
                      <div className="amount">{asset.borrows.amount}</div>
                      <div className="value">${asset.borrows.value}</div>
                    </div>,
                    asset.ltv,
                    asset.depositAPR,
                    asset.borrowAPR
                  ])
                },
                {
                  name: 'ISOLATED ASSETS',
                  rows: isolatedAssets.map(asset => [
                    <div className="asset-name">
                      <img src={asset.icon} alt={asset.symbol} />
                      <div>
                        <span className="symbol">{asset.symbol}</span>
                        <span className="price">${asset.price}</span>
                      </div>
                    </div>,
                    <div className="deposits">
                      <div className="amount">{asset.deposits.amount}</div>
                      <div className="value">${asset.deposits.value}</div>
                    </div>,
                    <div className="borrows">
                      <div className="amount">{asset.borrows.amount}</div>
                      <div className="value">${asset.borrows.value}</div>
                    </div>,
                    asset.ltv,
                    asset.depositAPR,
                    asset.borrowAPR
                  ])
                }
              ]
            }}
          />
        </>
      )
    }
  ];

  return (
    <div className="container">
      <div className="main-layout">
        <TabPanel 
          tabs={tabs}
          rightHeaderContent={<a href="/all-pools" className="view-all">All pools →</a>}
        />
        <div className="accounts-layout">
          <Accounts />
          <Deposited />
          <Borrowed />
          {/* <Balances /> */}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  const handleWalletSelect = (wallet: string) => {
    console.log('Selected wallet:', wallet);
    // Ici, vous pouvez ajouter la logique de connexion au wallet
    switch (wallet) {
      case 'metamask':
        // Connecter à MetaMask
        break;
      case 'walletconnect':
        // Connecter à WalletConnect
        break;
      default:
        break;
    }
  };

  return (
    <AppKitProvider>
      <ErrorProvider>
        <LoadingProvider>
          <ThemeProvider>
            <WalletProvider>
              <StatsProvider>
                <AssetsProvider>
                  <ModalProvider>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/app" element={
                        <>
                          <div id="modal-root" />
                          <TopBar />
                          <LoadingIndicator />
                          <MainContent />
                          <WalletSelector
                            isOpen={isWalletSelectorOpen}
                            onClose={() => setIsWalletSelectorOpen(false)}
                            onSelect={handleWalletSelect}
                          />
                        </>
                      } />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ModalProvider>
                </AssetsProvider>
              </StatsProvider>
            </WalletProvider>
          </ThemeProvider>
        </LoadingProvider>
      </ErrorProvider>
    </AppKitProvider>
  );
}

export default App;
