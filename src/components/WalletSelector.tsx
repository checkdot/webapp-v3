import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import './WalletSelector.scss';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (wallet: string) => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const { 
    isLoading, 
    isConnecting, 
    isPetraAvailable,
    isPontemAvailable,
    isMartianAvailable
  } = useWallet();

  const handleWalletSelection = async (wallet: string) => {
    await onSelect(wallet);
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="wallet-selector-overlay" onClick={handleClose}>
      <div className="wallet-selector-modal">
        <div className="wallet-selector-header">
          <h2>Connect Wallet</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="wallet-selector-content">
          <div className="wallet-list">
            {/* MetaMask */}
            <button
              className="wallet-option"
              onClick={() => handleWalletSelection('metaMask')}
              disabled={isLoading['wallet'] || isConnecting}
            >
              <img src="/wallets/metamask.svg" alt="MetaMask" />
              <span>MetaMask</span>
            </button>

            {/* WalletConnect */}
            <button
              className="wallet-option"
              onClick={() => handleWalletSelection('walletConnect')}
              disabled={isLoading['wallet'] || isConnecting}
            >
              <img src="/wallets/walletconnect.svg" alt="WalletConnect" />
              <span>WalletConnect</span>
            </button>

            {/* Pontem */}
            <button
              className="wallet-option"
              onClick={() => handleWalletSelection('pontem')}
              disabled={isLoading['wallet'] || isConnecting || !isPontemAvailable}
            >
              <img src="/wallets/pontem.svg" alt="Pontem" />
              <span>Pontem</span>
              {!isPontemAvailable && (
                <span className="not-available">Not Available</span>
              )}
            </button>

            {/* Martian */}
            <button
              className="wallet-option"
              onClick={() => handleWalletSelection('martian')}
              disabled={isLoading['wallet'] || isConnecting || !isMartianAvailable}
            >
              <img src="/wallets/martian.svg" alt="Martian" />
              <span>Martian</span>
              {!isMartianAvailable && (
                <span className="not-available">Not Available</span>
              )}
            </button>

            {/* Petra */}
            <button
              className="wallet-option"
              onClick={() => handleWalletSelection('petra')}
              disabled={isLoading['wallet'] || isConnecting || !isPetraAvailable}
            >
              <img src="/wallets/petra.svg" alt="Petra" />
              <span>Petra</span>
              {!isPetraAvailable && (
                <span className="not-available">Not Available</span>
              )}
            </button>

            {/* Phantom */}
            <button
              className="wallet-option"
              onClick={() => handleWalletSelection('phantom')}
              disabled={isLoading['wallet'] || isConnecting}
            >
              <img src="/wallets/phantom.svg" alt="Phantom" />
              <span>Phantom</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSelector; 