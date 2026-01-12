/**
 * Filter and Sort Logic
 * Comprehensive filtering and sorting utilities for place results
 */

import { SORT_OPTIONS, RATING_THRESHOLDS } from './constants';
import { calculateRelevanceScore } from './moodMapping';

/**
 * Filter places based on multiple criteria
 * @param {Array} places - Array of place objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered array of places
 */
export const filterPlaces = (places, filters = {}) => {
    const {
        minRating = 0,
        maxDistance = Infinity,
        openNow = false,
        priceLevel = null,
        types = null,
        searchQuery = ''
    } = filters;

    return places.filter(place => {
        // Rating filter
        if (place.rating && place.rating < minRating) {
            return false;
        }

        // Distance filter
        if (place.distance && place.distance > maxDistance) {
            return false;
        }

        // Open now filter
        if (openNow && place.opening_hours && !place.opening_hours.open_now) {
            return false;
        }

        // Price level filter
        if (priceLevel !== null && place.price_level !== undefined) {
            if (Array.isArray(priceLevel)) {
                if (!priceLevel.includes(place.price_level)) {
                    return false;
                }
            } else if (place.price_level > priceLevel) {
                return false;
            }
        }

        // Type filter
        if (types && types.length > 0) {
            const placeTypes = place.types || [];
            const hasMatchingType = types.some(type => placeTypes.includes(type));
            if (!hasMatchingType) {
                return false;
            }
        }

        // Search query filter (name match)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const name = (place.name || '').toLowerCase();
            const vicinity = (place.vicinity || '').toLowerCase();
            if (!name.includes(query) && !vicinity.includes(query)) {
                return false;
            }
        }

        return true;
    });
};

/**
 * Sort places based on specified criteria
 * @param {Array} places - Array of place objects
 * @param {string} sortBy - Sort option from SORT_OPTIONS
 * @param {Object} moodMapping - Optional mood mapping for relevance scoring
 * @returns {Array} - Sorted array of places
 */
export const sortPlaces = (places, sortBy = SORT_OPTIONS.BEST_MATCH, moodMapping = null) => {
    const sortedPlaces = [...places];

    switch (sortBy) {
        case SORT_OPTIONS.NEAREST:
            return sortedPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));

        case SORT_OPTIONS.HIGHEST_RATED:
            return sortedPlaces.sort((a, b) => {
                // Sort by rating first, then by number of reviews
                const ratingDiff = (b.rating || 0) - (a.rating || 0);
                if (ratingDiff !== 0) return ratingDiff;
                return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
            });

        case SORT_OPTIONS.PRICE_LOW:
            return sortedPlaces.sort((a, b) => {
                const priceA = a.price_level ?? 5; // Put unknown prices at end
                const priceB = b.price_level ?? 5;
                return priceA - priceB;
            });

        case SORT_OPTIONS.PRICE_HIGH:
            return sortedPlaces.sort((a, b) => {
                const priceA = a.price_level ?? -1; // Put unknown prices at end
                const priceB = b.price_level ?? -1;
                return priceB - priceA;
            });

        case SORT_OPTIONS.BEST_MATCH:
        default:
            // Complex scoring based on multiple factors
            return sortedPlaces.sort((a, b) => {
                const scoreA = calculatePlaceScore(a, moodMapping);
                const scoreB = calculatePlaceScore(b, moodMapping);
                return scoreB - scoreA;
            });
    }
};

/**
 * Calculate overall score for a place (for best match sorting)
 * @param {Object} place - Place object
 * @param {Object} moodMapping - Optional mood mapping
 * @returns {number} - Calculated score
 */
const calculatePlaceScore = (place, moodMapping = null) => {
    let score = 0;

    // Mood relevance (if mood mapping provided)
    if (moodMapping) {
        score += calculateRelevanceScore(place, moodMapping) * 0.3;
    }

    // Rating component (0-25 points)
    if (place.rating) {
        score += (place.rating / 5) * 25;
    }

    // Popularity component based on review count (0-15 points)
    if (place.user_ratings_total) {
        const popularityScore = Math.min(place.user_ratings_total / 500, 1) * 15;
        score += popularityScore;
    }

    // Distance penalty (closer is better, 0-20 points)
    if (place.distance) {
        const distanceScore = Math.max(0, 20 - (place.distance / 500));
        score += distanceScore;
    }

    // Open now bonus (10 points)
    if (place.opening_hours?.open_now) {
        score += 10;
    }

    return score;
};

/**
 * Filter and sort places in one operation
 * @param {Array} places - Array of place objects
 * @param {Object} filters - Filter criteria
 * @param {string} sortBy - Sort option
 * @param {Object} moodMapping - Optional mood mapping
 * @returns {Array} - Filtered and sorted array
 */
export const filterAndSortPlaces = (places, filters, sortBy, moodMapping = null) => {
    const filtered = filterPlaces(places, filters);
    return sortPlaces(filtered, sortBy, moodMapping);
};

/**
 * Get filter summary text
 * @param {Object} filters - Active filters
 * @returns {string} - Human-readable filter summary
 */
export const getFilterSummary = (filters) => {
    const parts = [];

    if (filters.minRating > 0) {
        parts.push(`${filters.minRating}+ stars`);
    }

    if (filters.maxDistance && filters.maxDistance < Infinity) {
        const km = filters.maxDistance / 1000;
        parts.push(`within ${km}km`);
    }

    if (filters.openNow) {
        parts.push('open now');
    }

    if (filters.priceLevel !== null) {
        const priceLabels = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' };
        if (Array.isArray(filters.priceLevel)) {
            parts.push(filters.priceLevel.map(p => priceLabels[p]).join(', '));
        } else {
            parts.push(`up to ${priceLabels[filters.priceLevel]}`);
        }
    }

    return parts.length > 0 ? parts.join(' • ') : 'No filters applied';
};

/**
 * Get rating label
 * @param {number} rating - Rating value
 * @returns {string} - Rating label
 */
export const getRatingLabel = (rating) => {
    if (rating >= RATING_THRESHOLDS.EXCELLENT) return 'Excellent';
    if (rating >= RATING_THRESHOLDS.GOOD) return 'Good';
    if (rating >= RATING_THRESHOLDS.AVERAGE) return 'Average';
    if (rating >= RATING_THRESHOLDS.POOR) return 'Fair';
    return 'Poor';
};

/**
 * Group places by category
 * @param {Array} places - Array of place objects
 * @returns {Object} - Places grouped by primary type
 */
export const groupByCategory = (places) => {
    const groups = {};

    places.forEach(place => {
        const primaryType = place.types?.[0] || 'other';
        if (!groups[primaryType]) {
            groups[primaryType] = [];
        }
        groups[primaryType].push(place);
    });

    return groups;
};

/**
 * Get unique categories from places
 * @param {Array} places - Array of place objects
 * @returns {Array} - Unique category types
 */
export const getUniqueCategories = (places) => {
    const categories = new Set();

    places.forEach(place => {
        if (place.types) {
            place.types.forEach(type => categories.add(type));
        }
    });

    return Array.from(categories);
};
