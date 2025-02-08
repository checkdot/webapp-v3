import { useWallet } from '../contexts/WalletContext';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import './Accounts.scss';

const Accounts = () => {
    const { connect, disconnect } = useWallet();
    const { isConnected } = useAccount();
    
    const [accountStats] = useState({
        equity: '6.00',
        deposits: '10.02',
        borrows: '4.02'
    });

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
                        <span>${accountStats.equity}</span>
                    </div>
                    <span>=</span>
                    <div className="deposits">
                        <span>Deposits</span>
                        <span>${accountStats.deposits}</span>
                    </div>
                    <span>-</span>
                    <div className="borrows">
                        <span>Borrows</span>
                        <span>${accountStats.borrows}</span>
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