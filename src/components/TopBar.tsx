import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useStats } from '../contexts/StatsContext';
import { useLoading } from '../contexts/LoadingContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAssets } from '../contexts/AssetsContext';
import './TopBar.scss';

const TopBar: React.FC = () => {
    const { connect, disconnect, isConnected, address } = useWallet();
    const { refreshStats } = useStats();
    const { isLoading, startLoading, stopLoading } = useLoading();
    const { theme, toggleTheme } = useTheme();
    const { updateAssetBalances } = useAssets();

    const handleRefresh = async () => {
        startLoading('refresh');
        await Promise.all([
            refreshStats(),
            updateAssetBalances()
        ]);
        stopLoading('refresh');
    };

    const handleConnect = async () => {
        try {
            startLoading('wallet');
            await connect();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        } finally {
            stopLoading('wallet');
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

    return (
        <div className="top-bar">
            <div className="top-bar-content">
                <div className="top-bar-left">
                    <img src="/logo.png" alt="Logo" className="nav-logo" />
                    <nav className="nav-links">
                        <a href="#dashboard">Dashboard</a>
                        <a href="#markets">Markets</a>
                        <a href="#stake">Stake</a>
                    </nav>
                </div>
                <div className="top-bar-right">
                    {/* <button 
                        className="theme-toggle-button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button> */}
                    <button 
                        className="refresh-button"
                        onClick={handleRefresh}
                        disabled={isLoading('refresh')}
                    >
                        <svg 
                            className={isLoading('refresh') ? 'spinning' : ''} 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.4 0 6.3 2.1 7.4 5M22 12c0 4.4-3.6 8-8 8-3.4 0-6.3-2.1-7.4-5"/>
                        </svg>
                    </button>
                    {isConnected ? (
                        <button 
                            className="connect-wallet-button connected"
                            onClick={handleDisconnect}
                        >
                            <span>{truncatedAddress}</span>
                        </button>
                    ) : (
                        <button
                            className="connect-wallet-button"
                            onClick={handleConnect}
                            disabled={isLoading('wallet')}
                        >
                            <span>Connect Wallet</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
