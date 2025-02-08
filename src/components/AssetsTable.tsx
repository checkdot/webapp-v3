import React, { useState } from 'react';
import "./Table.scss";
import { useModal } from '../contexts/ModalContext';

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

    const toggleCategory = (categoryName: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    const handleAssetClick = async (row: React.ReactNode[]) => {
        try {
            if (!row || row.length < 6) return;

            const assetCell = row[0] as React.ReactElement;
            if (assetCell.props.children) {
                const symbol = assetCell.props.children[1].props.children[0].props.children;
                
                // Récupération depuis le backend
                const response = await fetch(`http://localhost:3000/api/tokens/${symbol}`);
                const assetInfo = await response.json();

                openAssetModal({
                    symbol: assetInfo.symbol,
                    icon: assetInfo.icon,
                    address: assetInfo.address,
                    price: assetInfo.price,
                    deposits: assetInfo.deposits,
                    borrows: assetInfo.borrows,
                    depositAPR: assetInfo.depositAPR,
                    borrowAPR: assetInfo.borrowAPR
                });
            }
        } catch (error) {
            console.error("Erreur de récupération des données:", error);
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