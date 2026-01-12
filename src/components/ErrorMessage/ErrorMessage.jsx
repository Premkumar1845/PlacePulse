/**
 * ErrorMessage Component
 * Reusable error display component
 */

import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({
    message,
    details = null,
    onRetry = null,
    type = 'error' // 'error', 'warning', 'info'
}) => {
    const icons = {
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div className={`error-message ${type}`}>
            <span className="error-icon">{icons[type]}</span>
            <div className="error-content">
                <p className="error-text">{message}</p>
                {details && <p className="error-details">{details}</p>}
            </div>
            {onRetry && (
                <button className="error-retry-btn" onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
