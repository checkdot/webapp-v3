import React, { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletSelector from './WalletSelector';
import { useStats } from '../contexts/StatsContext';
import { useLoading } from '../contexts/LoadingContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAssets } from '../contexts/AssetsContext';
import './TopBar.scss';

const TopBar = () => {
    const navigate = useNavigate();
    const { connect, disconnect, address, isConnected } = useWallet();
    const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);
    const { refreshStats } = useStats();
    const { startLoading, stopLoading } = useLoading();
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

    const handleWalletSelect = async (wallet: string) => {
        try {
            startLoading('wallet');
            let success = false;

            if (wallet === 'metamask') {
                await connect('metaMask');
                success = true;
            } else if (wallet === 'walletconnect') {
                await connect('walletConnect');
                success = true;
            } else if (wallet === 'coinbasewallet') {
                await connect('coinbaseWallet');
                success = true;
            } else if (wallet === 'pontem') {
                await connect('pontem');
                success = true;
            }

            if (success) {
                await handleRefresh();
                setIsWalletSelectorOpen(false);
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        } finally {
            stopLoading('wallet');
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    const handleCopyAddress = async () => {
        if (address) {
            try {
                await navigator.clipboard.writeText(address);
                setShowCopyConfirmation(true);
                setTimeout(() => setShowCopyConfirmation(false), 2000);
            } catch (error) {
                console.error('Failed to copy address:', error);
            }
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <>
            <div className="top-bar">
                <div className="top-bar-content">
                    <div className="top-bar-left">
                        <img 
                            src="/logo.png" 
                            alt="Logo" 
                            className="logo" 
                            onClick={() => navigate('/')}
                        />
                    </div>
                
                    <div className="top-bar-right">
                        {isConnected && address ? (
                            <div className="wallet-container" ref={dropdownRef}>
                                <button 
                                    className="connect-wallet-button connected"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className="address">{formatAddress(address)}</span>
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
                                            <span>Connected with {address && window.ethereum?.isMetaMask ? 'MetaMask' : 'WalletConnect'}</span>
                                            <span className="address">{formatAddress(address)}</span>
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
                            </div>
                        ) : (
                            <button 
                                className="connect-wallet-button"
                                onClick={() => setIsWalletSelectorOpen(true)}
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <WalletSelector
                isOpen={isWalletSelectorOpen}
                onClose={() => setIsWalletSelectorOpen(false)}
                onSelect={handleWalletSelect}
            />
        </>
    );
};

export default TopBar;
