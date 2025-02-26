import { useWallet } from '../contexts/WalletContext';
import { useAccount } from 'wagmi';
import './Accounts.scss';
import { useAssets } from '../contexts/AssetsContext';
import { useState } from 'react';

const Accounts = () => {
    const { connect, disconnect } = useWallet();
    const { isConnected } = useAccount();
    const { depositedAssets, borrowedAssets } = useAssets();
    const [showBreakdown, setShowBreakdown] = useState(false);
    
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
                    
                    <div 
                        role="presentation" 
                        className="breakdown-toggle"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                    >
                        {showBreakdown ? (
                            <p>Hide breakdown</p>
                        ) : (
                            <p>Show breakdown</p>
                        )}
                        {/* <svg 
                            stroke="currentColor" 
                            fill="currentColor" 
                            strokeWidth="0" 
                            viewBox="0 0 512 512" 
                            color="#6670A3" 
                            height="1em" 
                            width="1em" 
                            xmlns="http://www.w3.org/2000/svg" 
                            style={{ color: 'rgb(102, 112, 163)' }}
                        >
                            {showBreakdown ? (
                                <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
                            ) : (
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            )}
                        </svg> */}
                    </div>

                    {showBreakdown && (
                        <div className="metrics-breakdown">
                            {/* Weighted Borrows Section */}
                            <div className="breakdown-section">
                                <div className="metric-header">
                                    <div className="color-indicator active"></div>
                                    <h3>Weighted borrows</h3>
                                </div>
                                <div className="calculation-grid">
                                    <div className="grid-header">
                                        <div>Position</div>
                                        <div className="operator">×</div>
                                        <div>Price</div>
                                        <div className="operator">×</div>
                                        <div>BW</div>
                                        <div className="operator">=</div>
                                        <div>Total</div>
                                    </div>
                                    {borrowedAssets.map((asset, index) => (
                                        <div key={asset.symbol} className="grid-row">
                                            <div>{asset.borrows.amount} {asset.symbol}</div>
                                            <div className="operator">×</div>
                                            <div>$1.00</div>
                                            <div className="operator">×</div>
                                            <div>{asset.borrowWeight}</div>
                                            <div className="operator">=</div>
                                            <div>${(parseFloat(asset.borrows.amount) * 1 * asset.borrowWeight).toFixed(2)}</div>
                                        </div>
                                    ))}
                                    <div className="grid-total">
                                        <div colSpan={5}></div>
                                        <div className="operator"></div>
                                        <div>${weightedBorrows.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Borrow Limit Section */}
                            <div className="breakdown-section">
                                <div className="metric-header">
                                    <div className="color-indicator warning"></div>
                                    <h3>Borrow limit</h3>
                                </div>
                                <div className="calculation-grid">
                                    <div className="grid-header">
                                        <div>Position</div>
                                        <div className="operator">×</div>
                                        <div>Price</div>
                                        <div className="operator">×</div>
                                        <div>Open LTV</div>
                                        <div className="operator">=</div>
                                        <div>Total</div>
                                    </div>
                                    {depositedAssets.map((asset, index) => (
                                        <div key={asset.symbol} className="grid-row">
                                            <div>{asset.deposits.amount} {asset.symbol}</div>
                                            <div className="operator">×</div>
                                            <div>$1.00</div>
                                            <div className="operator">×</div>
                                            <div>{asset.openLTV.toFixed(2)}</div>
                                            <div className="operator">=</div>
                                            <div>${(parseFloat(asset.deposits.amount) * 1 * asset.openLTV).toFixed(2)}</div>
                                        </div>
                                    ))}
                                    <div className="grid-total">
                                        <div colSpan={5}></div>
                                        <div className="operator"></div>
                                        <div>${borrowLimit.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Liquidation Threshold Section */}
                            <div className="breakdown-section">
                                <div className="metric-header">
                                    <div className="color-indicator danger"></div>
                                    <h3>Liquidation threshold</h3>
                                </div>
                                <div className="calculation-grid">
                                    <div className="grid-header">
                                        <div>Position</div>
                                        <div className="operator">×</div>
                                        <div>Price</div>
                                        <div className="operator">×</div>
                                        <div>Close LTV</div>
                                        <div className="operator">=</div>
                                        <div>Total</div>
                                    </div>
                                    {depositedAssets.map((asset, index) => (
                                        <div key={asset.symbol} className="grid-row">
                                            <div>{asset.deposits.amount} {asset.symbol}</div>
                                            <div className="operator">×</div>
                                            <div>$1.00</div>
                                            <div className="operator">×</div>
                                            <div>{asset.closeLTV.toFixed(4)}</div>
                                            <div className="operator">=</div>
                                            <div>${(parseFloat(asset.deposits.amount) * 1 * asset.closeLTV).toFixed(2)}</div>
                                        </div>
                                    ))}
                                    <div className="grid-total">
                                        <div colSpan={5}></div>
                                        <div className="operator"></div>
                                        <div>${liquidationThreshold.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Accounts;