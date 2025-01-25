import React, { createContext, useContext, useState, ReactNode } from 'react';
import AssetModal from '../components/AssetModal';

interface Asset {
    symbol: string;
    icon: string;
    price: string;
    balance: string;
    deposited: string;
    depositAPR: string;
    borrowAPR: string;
}

interface ModalContextType {
    openAssetModal: (asset: Asset) => void;
    closeAssetModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const openAssetModal = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const closeAssetModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
    };

    return (
        <ModalContext.Provider value={{ openAssetModal, closeAssetModal }}>
            {children}
            {selectedAsset && (
                <AssetModal
                    isOpen={isModalOpen}
                    onClose={closeAssetModal}
                    asset={selectedAsset}
                />
            )}
        </ModalContext.Provider>
    );
}; 