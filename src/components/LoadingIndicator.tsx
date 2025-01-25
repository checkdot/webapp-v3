import React from 'react';
import { useLoading } from '../contexts/LoadingContext';
import './LoadingIndicator.scss';

const LoadingIndicator: React.FC = () => {
    const { isLoading } = useLoading();

    const isAnyLoading = [
        'refresh',
        'wallet',
        'assets',
        'stats'
    ].some(key => isLoading(key));

    if (!isAnyLoading) return null;

    return (
        <div className="loading-indicator">
            <div className="loading-spinner">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.4 0 6.3 2.1 7.4 5M22 12c0 4.4-3.6 8-8 8-3.4 0-6.3-2.1-7.4-5"/>
                </svg>
            </div>
            <span className="loading-text">Loading...</span>
        </div>
    );
};

export default LoadingIndicator; 