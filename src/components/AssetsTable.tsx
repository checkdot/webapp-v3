import React, { useState } from 'react';
import "./Table.scss";
import { useModal } from '../contexts/ModalContext';
import { useAssets } from '../contexts/AssetsContext';

interface TableProps {
    data: {
        headers: React.ReactNode[];
        categories: {
            name: string;
            rows: React.ReactNode[][];
        }[];
    }
}

const Table: React.FC<TableProps> = ({ data }) => {
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
        'MAIN ASSETS': true,
        'ISOLATED ASSETS': false
    });
    const { openAssetModal } = useModal();
    const { initialAssets } = useAssets();

    const toggleCategory = (categoryName: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    const handleAssetClick = (row: React.ReactNode[]) => {
        try {
            if (!row || row.length < 6) {
                console.error("Données de ligne invalides");
                return;
            }

            const assetCell = row[0] as React.ReactElement;
            const depositCell = row[1] as React.ReactElement;
            const depositAPR = row[4];
            const borrowAPR = row[5];

            if (assetCell?.props?.className === 'asset-name') {
                const symbol = assetCell.props.children[1].props.children[0].props.children;
                const assetData = initialAssets.find(a => a.symbol === symbol);
                
                if (!assetData) {
                    console.error("Asset non trouvé dans initialAssets");
                    return;
                }

                const assetInfo = {
                    symbol: symbol,
                    icon: assetCell.props.children[0].props.src,
                    price: assetCell.props.children[1].props.children[1].props.children,
                    balance: "0",
                    deposited: depositCell.props.children[0].props.children,
                    depositAPR: typeof depositAPR === 'string' ? depositAPR : '0%',
                    borrowAPR: typeof borrowAPR === 'string' ? borrowAPR : '0%',
                    address: assetData.address
                };
                openAssetModal(assetInfo);
            } else {
                console.error("Structure de cellule asset invalide");
            }
        } catch (error) {
            console.error("Erreur lors de l'extraction des données de l'asset:", error);
            console.log("Row data:", row);
        }
    };

    return (
        <div className="table-container">
            <div className="table-header">
                {data.headers.map((header, index) => (
                    <div key={index} className="table-cell">
                        {header}
                    </div>
                ))}
            </div>
            <div className="table-body">
                {data.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="category-section">
                        <div 
                            className="category-header" 
                            onClick={() => toggleCategory(category.name)}
                        >
                            <div className="category-name">
                                <span className={`arrow ${openCategories[category.name] ? 'open' : ''}`}>
                                    ›
                                </span>
                                {category.name}
                                <span className="count">{category.rows.length}</span>
                            </div>
                        </div>
                        {openCategories[category.name] && (
                            <div className="category-content">
                                {category.rows.map((row, rowIndex) => (
                                    <div 
                                        key={rowIndex} 
                                        className="table-row"
                                        onClick={() => handleAssetClick(row)}
                                    >
                                        {row.map((cell, cellIndex) => (
                                            <div key={cellIndex} className="table-cell">
                                                {cell}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Table; 