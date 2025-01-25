import { useAccount } from 'wagmi';

import './Accounts.scss';

const Borrowed = () => {
    const { isConnected } = useAccount();

    if (!isConnected) {
        return (
            <></>
        );
    }

    return (
        <div className="accounts-panel">
            <h2>Borrowed Assets</h2>
            <div className="account-info">
                Borrowed
            </div>
        </div>
    );
};

export default Borrowed;