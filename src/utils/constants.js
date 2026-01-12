/**
 * Application constants and configuration
 * Central place for all static values used throughout the app
 */

// Default map settings
export const MAP_CONFIG = {
    DEFAULT_CENTER: { lat: 40.7128, lng: -74.0060 }, // NYC as fallback
    DEFAULT_ZOOM: 14,
    SELECTED_ZOOM: 16,
    MARKER_ZOOM: 15
};

// Search radius options (in meters)
export const SEARCH_RADIUS = {
    NEAR: 1000,      // 1 km
    DEFAULT: 2000,   // 2 km
    FAR: 5000,       // 5 km
    VERY_FAR: 10000  // 10 km
};

// Price level labels
export const PRICE_LEVELS = {
    0: 'Free',
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$'
};

// Rating thresholds
export const RATING_THRESHOLDS = {
    EXCELLENT: 4.5,
    GOOD: 4.0,
    AVERAGE: 3.5,
    POOR: 3.0
};

// Sort options
export const SORT_OPTIONS = {
    NEAREST: 'nearest',
    HIGHEST_RATED: 'highest_rated',
    BEST_MATCH: 'best_match',
    PRICE_LOW: 'price_low',
    PRICE_HIGH: 'price_high'
};

// Filter defaults
export const DEFAULT_FILTERS = {
    minRating: 0,
    maxDistance: SEARCH_RADIUS.FAR,
    openNow: false,
    priceLevel: null
};

// UI Constants
export const UI = {
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 200,
    MAX_RESULTS: 20,
    PLACES_PER_PAGE: 10
};

// Category icons mapping
export const CATEGORY_ICONS = {
    cafe: '☕',
    restaurant: '🍽️',
    bar: '🍸',
    bakery: '🥐',
    park: '🌳',
    gym: '💪',
    library: '📚',
    movie_theater: '🎬',
    shopping_mall: '🛍️',
    museum: '🏛️',
    spa: '💆',
    hotel: '🏨',
    gas_station: '⛽',
    pharmacy: '💊',
    hospital: '🏥',
    bank: '🏦',
    atm: '🏧',
    default: '📍'
};

// Mood suggestions for search - Enhanced quick picks
export const MOOD_SUGGESTIONS = [
    { label: 'Work', icon: '💼', value: 'work', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
    { label: 'Date Night', icon: '💕', value: 'date', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' },
    { label: 'Quick Bite', icon: '🍔', value: 'quick bite', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
    { label: 'Budget', icon: '💰', value: 'budget', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
    { label: 'Chill', icon: '😌', value: 'chill', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    { label: 'Family', icon: '👨‍👩‍👧‍👦', value: 'family', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
    { label: 'Drinks', icon: '🍻', value: 'drinks', color: '#eab308', gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' },
    { label: 'Coffee', icon: '☕', value: 'coffee', color: '#78716c', gradient: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)' },
    { label: 'Outdoors', icon: '🌲', value: 'outdoors', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)' },
    { label: 'Shopping', icon: '🛒', value: 'shopping', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
    { label: 'Fitness', icon: '🏋️', value: 'fitness', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
    { label: 'Entertainment', icon: '🎭', value: 'entertainment', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' }
];
