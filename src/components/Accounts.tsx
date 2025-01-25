import { useWallet } from '../contexts/WalletContext';
import { useAccount } from 'wagmi';
import './Accounts.scss';

const Accounts = () => {
    const { connect, disconnect } = useWallet();
    const { address, isConnected } = useAccount();

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
                <p className="address">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
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