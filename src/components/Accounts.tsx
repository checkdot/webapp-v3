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

    console.log(borrowedAssets)

    // Calcul du Weighted Borrows (somme des emprunts * leur BW respectif)
    const weightedBorrows = borrowedAssets.reduce((total, asset) => {
        return total + (parseFloat(asset.borrows.value) * asset.borrowWeight);
    }, 0);

    // Calcul du Borrow Limit (somme des dépôts * leur Open LTV respectif)
    const borrowLimit = depositedAssets.reduce((total, asset) => {
        return total + (parseFloat(asset.deposits.value) * asset.openLTV);
    }, 0);

    // Calcul du Liquidation Threshold (somme des dépôts * leur Close LTV respectif)
    const liquidationThreshold = depositedAssets.reduce((total, asset) => {
        return total + (parseFloat(asset.deposits.value) * asset.closeLTV);
    }, 0);

    // Calcul des pourcentages pour la barre de progression
    const maxPercentage = 70; // La barre utilise 70% de l'espace total
    const borrowPercentage = (weightedBorrows / borrowLimit) * maxPercentage;
    const utilizationPercentage = maxPercentage - borrowPercentage;
    const thresholdPercentage = ((liquidationThreshold - borrowLimit) / borrowLimit) * maxPercentage;

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
                            <div className="metric-header">
                                <div className="color-indicator active"></div>
                                <span className="metric-label">Weighted borrows</span>
                            </div>
                            <span className="metric-value">${weightedBorrows.toFixed(2)}</span>
                        </div>
                        <div className="metric-item">
                            <div className="metric-header">
                                <div className="color-indicator warning"></div>
                                <span className="metric-label">Borrow limit</span>
                            </div>
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
                            <div className="metric-header">
                                <div className="color-indicator danger"></div>
                                <span className="metric-label">Liquidation threshold</span>
                            </div>
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