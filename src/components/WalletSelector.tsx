import { useState, useRef, useEffect } from 'react';
import './WalletSelector.scss';

interface WalletSelectorProps {
  onSelect: (wallet: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const WalletSelector = ({ onSelect, onClose, isOpen }: WalletSelectorProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const wallets = [
    {
      name: 'MetaMask',
      icon: '/icons/metamask.svg',
      description: 'Connect to your MetaMask Wallet',
      installUrl: 'https://metamask.io/download'
    },
    {
      name: 'Pontem',
      icon: '/icons/pontem.svg',
      description: 'Connect to your Pontem Wallet',
      installUrl: 'https://chrome.google.com/webstore/detail/pontem-wallet/phkbamefinggmakgklpkljjmgibohnba'
    },
    {
      name: 'Phantom',
      icon: '/icons/phantom.svg',
      description: 'Connect to your Phantom Wallet',
      installUrl: 'https://phantom.app/download'
    },
    {
      name: 'WalletConnect',
      icon: '/icons/walletconnect.svg',
      description: 'Scan with WalletConnect to connect'
    }
  ];

  return isOpen ? (
    <div className="wallet-selector-overlay">
      <div className="wallet-selector-modal" ref={modalRef}>
        <div className="wallet-selector-header">
          <h3>Connect Wallet</h3>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="wallet-list">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="wallet-option"
              onClick={() => {
                if (wallet.name === 'Pontem' && !(window as any).pontem) {
                  window.open(wallet.installUrl, '_blank');
                  return;
                }
                if (wallet.name === 'MetaMask' && !(window as any).ethereum?.isMetaMask) {
                  window.open(wallet.installUrl, '_blank');
                  return;
                }
                if (wallet.name === 'Phantom' && !(window as any).phantom?.solana) {
                  window.open(wallet.installUrl, '_blank');
                  return;
                }
                onSelect(wallet.name.toLowerCase());
                onClose();
              }}
            >
              <img src={wallet.icon} alt={wallet.name} />
              <div className="wallet-info">
                <span className="wallet-name">{wallet.name}</span>
                <span className="wallet-description">
                  {((wallet.name === 'Pontem' && !(window as any).pontem) ||
                    (wallet.name === 'MetaMask' && !(window as any).ethereum?.isMetaMask) ||
                    (wallet.name === 'Phantom' && !(window as any).phantom?.solana)) ?
                    'Click to install' : wallet.description}
                </span>
              </div>
              <svg className="arrow-icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default WalletSelector; 