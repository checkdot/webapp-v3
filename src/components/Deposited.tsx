import { useAccount } from 'wagmi';

import './Accounts.scss';

const Deposited = () => {
    const { isConnected } = useAccount();

    if (!isConnected) {
        return (
            <></>
        );
    }

    return (
        <div className="accounts-panel">
            <h2>Deposited Assets</h2>
            <div className="account-info">
                Deposited
            </div>
        </div>
    );
};

export default Deposited;