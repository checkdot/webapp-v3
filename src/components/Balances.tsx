import { useAccount } from 'wagmi';

import './Accounts.scss';

const Balances = () => {
    const { isConnected } = useAccount();

    if (!isConnected) {
        return (
            <></>
        );
    }

    return (
        <div className="accounts-panel">
            <h2>Wallet Balances</h2>
            <div className="account-info">
                Balances
            </div>
        </div>
    );
};

export default Balances;