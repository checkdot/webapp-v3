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
                <div className="equity-formula">
                    <div className="equity">
                        <span>Equity</span>
                        <span>${equity.toFixed(0)}</span>
                    </div>
                    <span>=</span>
                    <div className="deposits">
                        <span>Deposits</span>
                        <span>${totalDeposits.toFixed(0)}</span>
                    </div>
                    <span>-</span>
                    <div className="borrows">
                        <span>Borrows</span>
                        <span>${totalBorrows.toFixed(0)}</span>
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