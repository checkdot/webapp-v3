import { useAccount } from 'wagmi';
import { useAssets } from '../contexts/AssetsContext';

import './Accounts.scss';

const Borrowed = () => {
    const { isConnected } = useAccount();
    const { borrowedAssets } = useAssets();

    if (!isConnected) {
        return null;
    }

    return (
        <div className="accounts-panel">
            <h2>Borrowed assets</h2>
            <div className="account-info">
                <div className="accounts-list">
                    {borrowedAssets.map((asset) => (
                        <div key={asset.symbol} className="account-item">
                            <div className="account-item-left">
                                <img src={asset.icon} alt={asset.symbol} />
                                <span>{asset.symbol}</span>
                            </div>
                            <div className="account-item-right">
                                <div className="balance">{asset.borrows.amount} {asset.symbol}</div>
                                <div className="usd-value">${asset.borrows.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Borrowed;