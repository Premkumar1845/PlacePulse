/**
 * PlaceCard Component
 * Individual place card display - optimized
 */

import React, { useMemo } from 'react';
import { formatDistance, getWalkingTime } from '../../utils/distance';
import { PRICE_LEVELS, CATEGORY_ICONS } from '../../utils/constants';
import { getPlaceTypeLabel, getPlacePhotoUrl } from '../../services/placesApi';
import './PlaceCard.css';

const PlaceCard = ({
    place,
    index,
    isSelected = false,
    onClick,
    onViewDetails
}) => {
    // Get photo URL
    const photoUrl = useMemo(() => {
        return getPlacePhotoUrl(place, 300);
    }, [place]);

    // Get category icon
    const categoryIcon = useMemo(() => {
        const types = place.types || [];
        for (const type of types) {
            if (CATEGORY_ICONS[type]) {
                return CATEGORY_ICONS[type];
            }
        }
        return CATEGORY_ICONS.default;
    }, [place.types]);

    // Format type label
    const typeLabel = useMemo(() => {
        return getPlaceTypeLabel(place.types);
    }, [place.types]);

    // Check if open
    const isOpen = place.opening_hours?.open_now;
    const hasOpeningHours = place.opening_hours !== undefined;

    return (
        <div
            className={`place-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick?.(place)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onClick?.(place)}
        >
            {/* Card Number Badge */}
            <div className="place-number">
                {index + 1}
            </div>

            {/* Photo Section */}
            <div className="place-photo">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={place.name}
                        loading="lazy"
                    />
                ) : (
                    <div className="place-photo-placeholder">
                        <span>{categoryIcon}</span>
                    </div>
                )}
                {/* Price Badge */}
                {place.price_level !== undefined && (
                    <div className="price-badge">
                        {PRICE_LEVELS[place.price_level]}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="place-content">
                {/* Header */}
                <div className="place-header">
                    <h3 className="place-name" title={place.name}>
                        {place.name}
                    </h3>
                    <span className="place-category">
                        <span className="category-icon">{categoryIcon}</span>
                        {typeLabel}
                    </span>
                </div>

                {/* Rating */}
                {place.rating && (
                    <div className="place-rating">
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= Math.round(place.rating) ? 'filled' : ''}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="rating-value">{place.rating.toFixed(1)}</span>
                        {place.user_ratings_total && (
                            <span className="rating-count">
                                ({place.user_ratings_total.toLocaleString()})
                            </span>
                        )}
                    </div>
                )}

                {/* Distance & Status */}
                <div className="place-info">
                    {place.distance && (
                        <div className="place-distance">
                            <span className="info-icon">📍</span>
                            <span>{formatDistance(place.distance)}</span>
                            <span className="walking-time">• {getWalkingTime(place.distance)}</span>
                        </div>
                    )}

                    {hasOpeningHours && (
                        <div className={`place-status ${isOpen ? 'open' : 'closed'}`}>
                            <span className="status-dot" />
                            <span>{isOpen ? 'Open now' : 'Closed'}</span>
                        </div>
                    )}
                </div>

                {/* Address */}
                {place.vicinity && (
                    <p className="place-address" title={place.vicinity}>
                        {place.vicinity}
                    </p>
                )}

                {/* Actions */}
                <div className="place-actions">
                    <button
                        className="action-btn primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails?.(place);
                        }}
                    >
                        View Details
                    </button>
                    <button
                        className="action-btn secondary"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Open in Google Maps
                            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;
                            window.open(url, '_blank');
                        }}
                    >
                        Directions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceCard;
