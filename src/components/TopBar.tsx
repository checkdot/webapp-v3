import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useStats } from '../contexts/StatsContext';
import { useLoading } from '../contexts/LoadingContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAssets } from '../contexts/AssetsContext';
import './TopBar.scss';
import { Link } from 'react-router-dom';

const TopBar: React.FC = () => {
    const { connect, disconnect, isConnected, address } = useWallet();
    const { refreshStats } = useStats();
    const { isLoading, startLoading, stopLoading } = useLoading();
    const { theme, toggleTheme } = useTheme();
    const { updateAssetBalances } = useAssets();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const handleCopyAddress = async () => {
        await navigator.clipboard.writeText(address || '');
        setShowCopyConfirmation(true);
        setTimeout(() => setShowCopyConfirmation(false), 2000);
    };

    return (
        <div className="top-bar">
            <div className="top-bar-content">
                <div className="top-bar-left">
                    <img src="/logo.png" alt="Logo" className="nav-logo" />
                    <nav className="nav-links">
                        <a href="#dashboard">Dashboard</a>
                    </nav>
                </div>
                <div className="top-bar-right">
                    {/* <button 
                        className="theme-toggle" 
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '🌞' : '🌙'}
                    </button> */}
                    {/* <button 
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
                    </button> */}
                    <div className="wallet-container" ref={dropdownRef}>
                        {!isConnected ? (
                            <button className="connect-wallet-button" onClick={handleConnect}>
                                Connect Wallet
                            </button>
                        ) : (
                            <>
                                <button 
                                    className="connect-wallet-button connected"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className="address">{formatAddress(address || '')}</span>
                                    <svg 
                                        className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                                        width="12" 
                                        height="8" 
                                        viewBox="0 0 12 8"
                                    >
                                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="wallet-dropdown">
                                        <div className="dropdown-address">
                                            <span>Net worth</span>
                                            <span className="net-worth">$6.00</span>
                                        </div>
                                        <div className="dropdown-actions">
                                            <button 
                                                className={`copy-button ${showCopyConfirmation ? 'copied' : ''}`} 
                                                onClick={handleCopyAddress}
                                            >
                                                {showCopyConfirmation ? (
                                                    <>
                                                        <svg width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M6.5 12.5L3 9l1.5-1.5L6.5 9.5 11.5 4.5 13 6l-6.5 6.5z" fill="currentColor"/>
                                                        </svg>
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M13 3H7V2c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1h-1V4c0-.6-.4-1-1-1z" fill="currentColor"/>
                                                            <path d="M3 13V4c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1z" fill="currentColor"/>
                                                        </svg>
                                                        Copy Address
                                                    </>
                                                )}
                                            </button>
                                            <button className="disconnect-button" onClick={handleDisconnect}>
                                                <svg width="16" height="16" viewBox="0 0 16 16">
                                                    <path d="M12 8.7V10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v1.3l2-2V6c0-2.2-1.8-4-4-4H4C1.8 2 0 3.8 0 6v4c0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4V6.7l-2 2z" fill="currentColor"/>
                                                    <path d="M16 8l-4-4v3H5v2h7v3l4-4z" fill="currentColor"/>
                                                </svg>
                                                Disconnect
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
