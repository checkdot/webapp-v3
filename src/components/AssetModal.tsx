import React, { useState } from 'react';
import Modal from './Modal';
import './AssetModal.scss';
import AssetInput from './AssetInput';
import { useWallet } from '../contexts/WalletContext';
import { useLoading } from '../contexts/LoadingContext';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

interface AssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        symbol: string;
        icon: string;
        price: string;
        balance: string;
        deposited: string;
        depositAPR: string;
        borrowAPR: string;
        address: string;
    };
}

const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, asset }) => {
    const { isConnected, connect } = useWallet();
    const { isLoading, startLoading, stopLoading } = useLoading();
    const [activeTab, setActiveTab] = useState('Deposit');
    const tabs = ['Deposit', 'Borrow', 'Withdraw', 'Repay'];
    const [inputValue, setInputValue] = useState('');
    const { address: userAddress } = useAccount();
    
    // Récupération de la balance du token
    const { data: tokenBalance } = useBalance({
        address: userAddress,
        token: asset.address as `0x${string}`,
        enabled: isConnected && !!userAddress && asset.symbol !== 'ETH',
        watch: true,
    });

    // Récupération de la balance ETH
    const { data: ethBalance } = useBalance({
        address: userAddress,
        enabled: isConnected && !!userAddress && asset.symbol === 'ETH',
        watch: true,
    });

    // Vérifier si le solde est à 0
    const hasBalance = isConnected && (
        asset.symbol === 'ETH' 
            ? ethBalance && ethBalance.value > 0n
            : tokenBalance && tokenBalance.value > 0n
    );

    // Vérifier si l'input a une valeur valide
    const hasValidInput = inputValue !== '' && parseFloat(inputValue) > 0;

    const formatBalance = (balance: bigint, decimals: number) => {
        const num = Number(formatUnits(balance, decimals));
        if (num === 0) return '0.00';
        
        if (num < 0.0001) {
            return num.toFixed(8).replace(/\.?0+$/, '');
        }
        
        if (num < 0.01) {
            return num.toFixed(6).replace(/\.?0+$/, '');
        }
        
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        });
    };

    // Obtenir la balance courante
    const currentBalance = isConnected ? 
        asset.symbol === 'ETH' 
            ? ethBalance 
                ? formatBalance(ethBalance.value, 18)
                : '0.00'
            : tokenBalance 
                ? formatBalance(tokenBalance.value, tokenBalance.decimals)
                : '0.00'
        : '0.00';

    const handleAction = async () => {
        if (!isConnected) {
            await connect();
            return;
        }

        startLoading('transaction');
        try {
            // Envoyer la transaction d'emprunt à l'API
            await fetch(`http://localhost:3000/api/tokens/${asset.symbol}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    borrower: {
                        address: userAddress,
                        amount: inputValue
                    }
                })
            });

            // Simulation d'une transaction
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Logique de transaction ici
            onClose();
        } catch (error) {
            console.error('Transaction failed:', error);
        } finally {
            stopLoading('transaction');
        }
    };

    const handleMaxClick = () => {
        if (!isConnected) return;
        
        const balance = asset.symbol === 'ETH' ? ethBalance : tokenBalance;
        if (balance) {
            setInputValue(formatUnits(balance.value, balance.decimals));
        }
    };

    const modalHeader = (
        <div className="asset-modal-header">
            <div className="left-content">
                <img src={asset.icon} alt={asset.symbol} />
                <span className="asset-name">{asset.symbol}</span>
                {/* <span className="price-info">${asset.price}</span> */}
            </div>
            <button className="close-button" onClick={onClose}>×</button>
        </div>
    );

    const renderTabContent = () => {
        const commonInput = (
            <>
                <div className="input-section">
                    <AssetInput 
                        value={inputValue}
                        onChange={setInputValue}
                        assetSymbol={asset.symbol}
                        assetPrice={parseFloat(asset.price)}
                        showMaxButton={true}
                        onMaxClick={handleMaxClick}
                        className="asset-modal-input"
                    />
                    <div className="input-info">
                        <div className="info-item">
                            <span className="label">Balance</span>
                            <span className="value">{currentBalance}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Deposited</span>
                            <span className="value">{asset.deposited} {asset.symbol}</span>
                        </div>
                    </div>
                </div>
            </>
        );
        switch (activeTab) {
            case 'Deposit':
                return (
                    <>
                        {commonInput}
                        <div className="asset-stats">
                            <div className="stat-row">
                                <span>Deposit APR</span>
                                <span>{asset.depositAPR}</span>
                            </div>
                            <div className="stat-row">
                                <span>Your borrow limit</span>
                                <span>$0.00</span>
                            </div>
                            <div className="stat-row">
                                <span>Your utilization</span>
                                <span>0%</span>
                            </div>
                        </div>
                        <button 
                            className="action-button"
                            onClick={handleAction}
                            disabled={
                                isLoading('transaction') || 
                                (activeTab === 'Deposit' && !hasBalance) || 
                                !hasValidInput
                            }
                        >
                            {isLoading('transaction') ? (
                                <div className="loading-spinner">
                                    <svg 
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
                                </div>
                            ) : !isConnected ? (
                                'Connect Wallet'
                            ) : !hasBalance && activeTab === 'Deposit' ? (
                                'Insufficient Balance'
                            ) : !hasValidInput ? (
                                'Enter an amount'
                            ) : (
                                activeTab
                            )}
                        </button>
                    </>
                );

            case 'Borrow':
                return (
                    <>
                        {commonInput}
                        <div className="asset-stats">
                            <div className="stat-row">
                                <span>Available to borrow</span>
                                <span>0 {asset.symbol}</span>
                            </div>
                            <div className="stat-row">
                                <span>Borrow APR</span>
                                <span>{asset.borrowAPR}</span>
                            </div>
                            <div className="stat-row">
                                <span>Your borrow limit</span>
                                <span>$0.00</span>
                            </div>
                            <div className="stat-row">
                                <span>Your utilization</span>
                                <span>0%</span>
                            </div>
                        </div>
                        <button 
                            className="action-button"
                            onClick={handleAction}
                            disabled={isLoading('transaction')}
                        >
                            {isLoading('transaction') ? (
                                <div className="loading-spinner">
                                    <svg 
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
                                </div>
                            ) : isConnected ? activeTab : 'Connect Wallet'}
                        </button>
                    </>
                );

            case 'Withdraw':
                return (
                    <>
                        {commonInput}
                        <div className="asset-stats">
                            <div className="stat-row">
                                <span>Available to withdraw</span>
                                <span>{asset.deposited} {asset.symbol}</span>
                            </div>
                            <div className="stat-row">
                                <span>Your borrow limit</span>
                                <span>$0.00</span>
                            </div>
                            <div className="stat-row">
                                <span>Your utilization</span>
                                <span>0%</span>
                            </div>
                        </div>
                        <button 
                            className="action-button"
                            onClick={handleAction}
                            disabled={isLoading('transaction')}
                        >
                            {isLoading('transaction') ? (
                                <div className="loading-spinner">
                                    <svg 
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
                                </div>
                            ) : isConnected ? activeTab : 'Connect Wallet'}
                        </button>
                    </>
                );

            case 'Repay':
                return (
                    <>
                        {commonInput}
                        <div className="asset-stats">
                            <div className="stat-row">
                                <span>Borrowed</span>
                                <span>0 {asset.symbol}</span>
                            </div>
                            <div className="stat-row">
                                <span>Available wallet balance</span>
                                <span>{currentBalance} {asset.symbol}</span>
                            </div>
                            <div className="stat-row">
                                <span>Your borrow limit</span>
                                <span>$0.00</span>
                            </div>
                            <div className="stat-row">
                                <span>Your utilization</span>
                                <span>0%</span>
                            </div>
                        </div>
                        <button 
                            className="action-button"
                            onClick={handleAction}
                            disabled={isLoading('transaction')}
                        >
                            {isLoading('transaction') ? (
                                <div className="loading-spinner">
                                    <svg 
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
                                </div>
                            ) : isConnected ? activeTab : 'Connect Wallet'}
                        </button>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} customHeader={modalHeader}>
            <div className="asset-modal">
                <div className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="asset-content">
                    {renderTabContent()}
                </div>
            </div>
        </Modal>
    );
};

export default AssetModal; 