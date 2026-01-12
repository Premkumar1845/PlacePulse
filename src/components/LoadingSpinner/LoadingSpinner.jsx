/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary', text = '' }) => {
    return (
        <div className={`loading-spinner ${size} ${color}`}>
            <div className="spinner">
                <div className="spinner-ring" />
                <div className="spinner-ring" />
                <div className="spinner-ring" />
            </div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
