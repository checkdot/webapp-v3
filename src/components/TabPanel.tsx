import React, { useState } from 'react';
import { useStats } from '../contexts/StatsContext';
import { useLoading } from '../contexts/LoadingContext';
import './TabPanel.scss';

interface Tab {
    name: string;
    content: React.ReactNode;
}

interface TabPanelProps {
    tabs: Tab[];
    rightHeaderContent?: React.ReactNode;
    className?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ 
    tabs, 
    rightHeaderContent,
    className = '' 
}) => {
    const [activeTab, setActiveTab] = useState(0);
    const { stats } = useStats();
    const { isLoading } = useLoading();

    return (
        <div className={`tab-panel ${className}`}>
            <div className="tab-header">
                <div className="tab-buttons">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`tab-button ${activeTab === index ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                            disabled={isLoading('tabs')}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                {rightHeaderContent && (
                    <div className="header-right">
                        {rightHeaderContent}
                    </div>
                )}
            </div>

            <div className="tab-content">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default TabPanel; 