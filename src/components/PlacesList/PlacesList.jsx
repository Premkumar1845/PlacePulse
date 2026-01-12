/**
 * PlacesList Component
 * Scrollable list of place cards - optimized for fast rendering
 */

import React from 'react';
import PlaceCard from '../PlaceCard/PlaceCard';
import { PlaceCardsSkeletonList } from '../Skeleton/Skeleton';
import './PlacesList.css';

const PlacesList = ({
    places = [],
    selectedPlace,
    loading = false,
    error = null,
    onPlaceClick,
    onViewDetails,
    onRetry,
    emptyMessage = "No places found. Try a different search or adjust your filters."
}) => {
    // Loading state with skeleton
    if (loading) {
        return (
            <div className="places-list-state loading">
                <PlaceCardsSkeletonList count={4} />
                <p className="state-message">
                    <span>Discovering places for you...</span>
                </p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="places-list-state error">
                <span className="state-icon">⚠️</span>
                <p className="state-message">
                    {error.message || 'Something went wrong'}
                </p>
                {onRetry && (
                    <button className="retry-btn" onClick={onRetry}>
                        <span>🔄</span> Try Again
                    </button>
                )}
            </div>
        );
    }

    // Empty state
    if (places.length === 0) {
        return (
            <div className="places-list-state empty">
                <span className="state-icon">🔍</span>
                <p className="state-message">{emptyMessage}</p>
                <div className="empty-suggestions">
                    <p className="suggestion-text">Try searching for:</p>
                    <div className="suggestion-tags">
                        {['coffee', 'lunch', 'chill', 'work'].map((tag) => (
                            <span key={tag} className="suggestion-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="places-list">
            {/* Results header */}
            <div className="places-list-header">
                <span className="results-count">
                    {places.length} place{places.length !== 1 ? 's' : ''} found
                </span>
            </div>

            {/* Places grid */}
            <div className="places-list-content">
                {places.map((place, index) => (
                    <PlaceCard
                        key={place.place_id}
                        place={place}
                        index={index}
                        isSelected={selectedPlace?.place_id === place.place_id}
                        onClick={onPlaceClick}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>
        </div>
    );
};

export default PlacesList;