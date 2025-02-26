import { useWallet } from '../contexts/WalletContext';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import './Accounts.scss';
import { useAssets } from '../contexts/AssetsContext';

const Accounts = () => {
    const { connect, disconnect } = useWallet();
    const { isConnected } = useAccount();
    const { depositedAssets, borrowedAssets } = useAssets();
    
    // Calcul des totaux
    const totalDeposits = depositedAssets.reduce((acc, asset) => acc + parseFloat(asset.deposits.value), 0);
    const totalBorrows = borrowedAssets.reduce((acc, asset) => acc + parseFloat(asset.borrows.value), 0);
    const equity = totalDeposits - totalBorrows;
    const netApr = 12.5; // À remplacer par le vrai calcul

    // Valeurs de base
    const position = 10.0370; // USDS
    const price = 1.00; // Prix du USDS
    const openLTV = 0.70; // Open LTV (70%)
    const closeLTV = 0.77; // Close LTV (77%)
    const borrowWeight = 1; // Borrow Weight

    // Calcul des valeurs principales
    const weightedBorrows = 4.0387 * price * borrowWeight; // ≈ $4.04
    const borrowLimit = position * price * openLTV; // ≈ $7.02
    const liquidationThreshold = position * price * closeLTV; // ≈ $7.72

    // Calcul des pourcentages pour la barre de progression
    const maxPercentage = 70; // La barre utilise 70% de l'espace total
    const borrowPercentage = (weightedBorrows / borrowLimit) * maxPercentage; // ≈ 39%
    const utilizationPercentage = maxPercentage - borrowPercentage; // ≈ 31%
    const thresholdPercentage = ((closeLTV - openLTV) / openLTV) * maxPercentage; // ≈ 7%

    if (!isConnected) {
        return (
            <div className="accounts-panel">
                <h2>Account</h2>
                <div className="connect-message">
                    <p>Connect your wallet to view your balances and make transactions.</p>
                    <button className="connect-button" onClick={connect}>
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="accounts-panel">
            <h2>Account</h2>
            <div className="account-info">
                <div className="equity-values">
                    <div className="value-row">
                        <div className="value-item">
                            <span>Equity</span>
                            <span>${equity.toFixed(2)}</span>
                        </div>
                        <span>=</span>
                        <div className="value-item">
                            <span>Deposits</span>
                            <span>${totalDeposits.toFixed(2)}</span>
                        </div>
                        <span>-</span>
                        <div className="value-item">
                            <span>Borrows</span>
                            <span>${totalBorrows.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="net-apr">
                    <span>Net APR</span>
                    <span className={netApr >= 0 ? 'positive' : 'negative'}>
                        {netApr >= 0 ? '+' : ''}{netApr}%
                    </span>
                </div>
                <div className="account-metrics">
                    <div className="metric-row">
                        <div className="metric-item">
                            <span className="metric-label">Weighted borrows</span>
                            <span className="metric-value">${weightedBorrows.toFixed(2)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Borrow limit</span>
                            <span className="metric-value">${borrowLimit.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="borrow-progress">
                        <div className="progress-sections">
                            {/* Section weighted borrows (verte) */}
                            <div 
                                className="progress-section active"
                                style={{ width: `${borrowPercentage}%` }}
                            />
                            {/* Section utilization (grise) */}
                            <div 
                                className="progress-section warning"
                                style={{ width: `${utilizationPercentage}%` }}
                            />
                            {/* Section threshold (rouge) */}
                            <div 
                                className="progress-section danger"
                                style={{ width: `${thresholdPercentage}%` }}
                            />
                            {/* Section restante */}
                            <div 
                                className="progress-section"
                                style={{ width: `${100 - borrowPercentage - utilizationPercentage - thresholdPercentage}%` }}
                            />
                        </div>
                        <div className="progress-indicators">
                            <div 
                                className="limit-marker"
                                style={{ left: `${maxPercentage}%` }}
                            />
                            <div 
                                className="liquidation-marker"
                                style={{ left: `${maxPercentage + thresholdPercentage}%` }}
                            />
                        </div>
                    </div>
                    <div className="metric-row">
                        <div className="metric-item">
                            <span className="metric-label">Liquidation threshold</span>
                            <span className="metric-value">${liquidationThreshold.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <button 
                    className="disconnect-button"
                    onClick={disconnect}
                >
                    Disconnect
                </button>
            </div>
        </div>
    );
};

export default Accounts;