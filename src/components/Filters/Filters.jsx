/**
 * Filters Component
 * Filter and sort controls for place results
 */

import React, { useState } from 'react';
import { SORT_OPTIONS, PRICE_LEVELS, SEARCH_RADIUS } from '../../utils/constants';
import './Filters.css';

const Filters = ({
    filters,
    sortBy,
    onFilterChange,
    onSortChange,
    onReset,
    resultsCount = 0,
    totalCount = 0
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleRatingChange = (e) => {
        onFilterChange({ minRating: parseFloat(e.target.value) });
    };

    const handleDistanceChange = (e) => {
        onFilterChange({ maxDistance: parseInt(e.target.value) });
    };

    const handleOpenNowChange = (e) => {
        onFilterChange({ openNow: e.target.checked });
    };

    const handlePriceChange = (level) => {
        const currentPrice = filters.priceLevel;
        let newPrice;

        if (Array.isArray(currentPrice)) {
            if (currentPrice.includes(level)) {
                newPrice = currentPrice.filter(p => p !== level);
                if (newPrice.length === 0) newPrice = null;
            } else {
                newPrice = [...currentPrice, level].sort();
            }
        } else if (currentPrice === level) {
            newPrice = null;
        } else if (currentPrice === null) {
            newPrice = [level];
        } else {
            newPrice = [currentPrice, level].sort();
        }

        onFilterChange({ priceLevel: newPrice });
    };

    const isPriceSelected = (level) => {
        const currentPrice = filters.priceLevel;
        if (Array.isArray(currentPrice)) {
            return currentPrice.includes(level);
        }
        return currentPrice === level;
    };

    const hasActiveFilters =
        filters.minRating > 0 ||
        filters.maxDistance < SEARCH_RADIUS.VERY_FAR ||
        filters.openNow ||
        filters.priceLevel !== null;

    return (
        <div className="filters-container">
            {/* Summary Bar */}
            <div className="filters-summary">
                <div className="results-info">
                    <span className="results-count">
                        {resultsCount} {resultsCount === 1 ? 'place' : 'places'}
                    </span>
                    {resultsCount !== totalCount && (
                        <span className="total-count">(of {totalCount} total)</span>
                    )}
                </div>

                <div className="filters-controls">
                    {/* Sort Dropdown */}
                    <div className="sort-control">
                        <label htmlFor="sort-select">Sort:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="sort-select"
                        >
                            <option value={SORT_OPTIONS.BEST_MATCH}>Best Match</option>
                            <option value={SORT_OPTIONS.NEAREST}>Nearest</option>
                            <option value={SORT_OPTIONS.HIGHEST_RATED}>Highest Rated</option>
                            <option value={SORT_OPTIONS.PRICE_LOW}>Price: Low to High</option>
                            <option value={SORT_OPTIONS.PRICE_HIGH}>Price: High to Low</option>
                        </select>
                    </div>

                    {/* Filter Toggle */}
                    <button
                        className={`filter-toggle-btn ${isExpanded ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <span className="filter-icon">⚙️</span>
                        <span className="filter-text">Filters</span>
                        {hasActiveFilters && <span className="filter-badge" />}
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            {isExpanded && (
                <div className="filters-expanded">
                    {/* Rating Filter */}
                    <div className="filter-group">
                        <label className="filter-label">
                            Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="4.5"
                            step="0.5"
                            value={filters.minRating}
                            onChange={handleRatingChange}
                            className="filter-slider"
                        />
                        <div className="filter-range-labels">
                            <span>Any</span>
                            <span>4.5+</span>
                        </div>
                    </div>

                    {/* Distance Filter */}
                    <div className="filter-group">
                        <label className="filter-label">
                            Max Distance: {filters.maxDistance >= SEARCH_RADIUS.VERY_FAR ? 'Any' : `${(filters.maxDistance / 1000).toFixed(1)} km`}
                        </label>
                        <input
                            type="range"
                            min={SEARCH_RADIUS.NEAR}
                            max={SEARCH_RADIUS.VERY_FAR}
                            step="500"
                            value={filters.maxDistance}
                            onChange={handleDistanceChange}
                            className="filter-slider"
                        />
                        <div className="filter-range-labels">
                            <span>1 km</span>
                            <span>10+ km</span>
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="filter-group">
                        <label className="filter-label">Price Level</label>
                        <div className="price-buttons">
                            {[1, 2, 3, 4].map((level) => (
                                <button
                                    key={level}
                                    className={`price-btn ${isPriceSelected(level) ? 'selected' : ''}`}
                                    onClick={() => handlePriceChange(level)}
                                >
                                    {PRICE_LEVELS[level]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Open Now Toggle */}
                    <div className="filter-group filter-toggle">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={filters.openNow}
                                onChange={handleOpenNowChange}
                                className="toggle-checkbox"
                            />
                            <span className="toggle-switch" />
                            <span className="toggle-text">Open Now Only</span>
                        </label>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <button className="reset-filters-btn" onClick={onReset}>
                            Reset Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Filters;
