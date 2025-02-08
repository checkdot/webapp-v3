import { useAccount } from 'wagmi';
import './Accounts.scss';

const depositedAssets = [
    {
        symbol: 'USDS',
        icon: '/icons/usds.png',
        price: '1.00',
        deposits: {
            amount: '10.0180',
            value: '10.03'
        }
    }
];

const Deposited = () => {
    const { isConnected } = useAccount();

    if (!isConnected) {
        return null;
    }

    return (
        <div className="accounts-panel">
            <h2>Deposited assets</h2>
            <div className="account-info">
                <div className="accounts-list">
                    {depositedAssets.map((asset) => (
                        <div key={asset.symbol} className="account-item">
                            <div className="account-item-left">
                                <img src={asset.icon} alt={asset.symbol} />
                                <span>{asset.symbol}</span>
                            </div>
                            <div className="account-item-right">
                                <div className="balance">{asset.deposits.amount} {asset.symbol}</div>
                                <div className="usd-value">${asset.deposits.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Deposited;