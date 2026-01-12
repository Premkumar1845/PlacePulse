/**
 * Google Places API Service
 * Handles all interactions with Google Places API
 */

import { getGoogleMapsApi } from './mapsLoader';
import { calculateDistance } from '../utils/distance';

// Cache for place details to reduce API calls
const detailsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Create a PlacesService instance
 * @param {google.maps.Map} map - Map instance (optional)
 * @returns {google.maps.places.PlacesService} - Places service
 */
export const createPlacesService = (map = null) => {
    const google = getGoogleMapsApi();

    if (map) {
        return new google.maps.places.PlacesService(map);
    }

    // Create a dummy div for PlacesService when no map is available
    const dummyDiv = document.createElement('div');
    return new google.maps.places.PlacesService(dummyDiv);
};

/**
 * Search for nearby places
 * @param {google.maps.places.PlacesService} service - Places service instance
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of place results
 */
export const searchNearbyPlaces = (service, options) => {
    const {
        location,
        radius = 2000,
        type = null,
        types = [],
        keyword = null
    } = options;

    return new Promise((resolve, reject) => {
        const google = getGoogleMapsApi();

        const request = {
            location: new google.maps.LatLng(location.lat, location.lng),
            radius,
            // Use 'type' for single type or pick first from 'types' array
            ...(type ? { type } : types.length > 0 ? { type: types[0] } : {}),
            ...(keyword ? { keyword } : {})
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Add distance to each result
                const placesWithDistance = results.map(place => ({
                    ...place,
                    distance: calculateDistance(location, {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    })
                }));
                resolve(placesWithDistance);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                resolve([]);
            } else {
                reject(new Error(`Places search failed: ${status}`));
            }
        });
    });
};

/**
 * Search for places using text query
 * @param {google.maps.places.PlacesService} service - Places service instance
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of place results
 */
export const textSearchPlaces = (service, options) => {
    const {
        query,
        location,
        radius = 2000
    } = options;

    return new Promise((resolve, reject) => {
        const google = getGoogleMapsApi();

        const request = {
            query,
            location: new google.maps.LatLng(location.lat, location.lng),
            radius
        };

        service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const placesWithDistance = results.map(place => ({
                    ...place,
                    distance: calculateDistance(location, {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    })
                }));
                resolve(placesWithDistance);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                resolve([]);
            } else {
                reject(new Error(`Text search failed: ${status}`));
            }
        });
    });
};

/**
 * Get detailed information about a place
 * @param {google.maps.places.PlacesService} service - Places service instance
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} - Place details
 */
export const getPlaceDetails = (service, placeId) => {
    // Check cache first
    const cached = detailsCache.get(placeId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return Promise.resolve(cached.data);
    }

    return new Promise((resolve, reject) => {
        const google = getGoogleMapsApi();

        const request = {
            placeId,
            fields: [
                'place_id',
                'name',
                'formatted_address',
                'formatted_phone_number',
                'geometry',
                'opening_hours',
                'photos',
                'price_level',
                'rating',
                'reviews',
                'types',
                'url',
                'website',
                'user_ratings_total'
            ]
        };

        service.getDetails(request, (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Cache the result
                detailsCache.set(placeId, {
                    data: result,
                    timestamp: Date.now()
                });
                resolve(result);
            } else {
                reject(new Error(`Place details request failed: ${status}`));
            }
        });
    });
};

/**
 * Search for multiple place types and combine results
 * @param {google.maps.places.PlacesService} service - Places service instance
 * @param {Object} options - Search options with types array
 * @returns {Promise<Array>} - Combined and deduplicated results
 */
export const searchMultipleTypes = async (service, options) => {
    const { types, keywords = [], location, radius } = options;
    const allResults = new Map(); // Use Map to deduplicate by place_id

    // Search by types
    const typePromises = types.map(type =>
        searchNearbyPlaces(service, { location, radius, type })
            .catch(err => {
                console.warn(`Search for type "${type}" failed:`, err);
                return [];
            })
    );

    // Search by keywords
    const keywordPromises = keywords.map(keyword =>
        textSearchPlaces(service, { query: keyword, location, radius })
            .catch(err => {
                console.warn(`Search for keyword "${keyword}" failed:`, err);
                return [];
            })
    );

    const results = await Promise.all([...typePromises, ...keywordPromises]);

    // Combine and deduplicate results
    results.flat().forEach(place => {
        if (!allResults.has(place.place_id)) {
            allResults.set(place.place_id, place);
        }
    });

    return Array.from(allResults.values());
};

/**
 * Get photo URL for a place
 * @param {Object} photo - Photo object from place result
 * @param {number} maxWidth - Maximum width of the image
 * @returns {string|null} - Photo URL or null
 */
export const getPhotoUrl = (photo, maxWidth = 400) => {
    if (!photo || !photo.getUrl) {
        return null;
    }
    return photo.getUrl({ maxWidth });
};

/**
 * Get the first photo URL from a place
 * @param {Object} place - Place object
 * @param {number} maxWidth - Maximum width
 * @returns {string|null} - Photo URL or null
 */
export const getPlacePhotoUrl = (place, maxWidth = 400) => {
    if (!place.photos || place.photos.length === 0) {
        return null;
    }
    return getPhotoUrl(place.photos[0], maxWidth);
};

/**
 * Format opening hours for display
 * @param {Object} openingHours - Opening hours object
 * @returns {Object} - Formatted opening hours data
 */
export const formatOpeningHours = (openingHours) => {
    if (!openingHours) {
        return { isOpen: null, status: 'Hours not available', periods: [] };
    }

    const isOpen = openingHours.open_now;
    const status = isOpen ? 'Open now' : 'Closed';
    const periods = openingHours.weekday_text || [];

    return { isOpen, status, periods };
};

/**
 * Get place type label
 * @param {Array} types - Array of place types
 * @returns {string} - Human-readable type label
 */
export const getPlaceTypeLabel = (types) => {
    if (!types || types.length === 0) {
        return 'Place';
    }

    const typeLabels = {
        restaurant: 'Restaurant',
        cafe: 'Cafe',
        bar: 'Bar',
        bakery: 'Bakery',
        night_club: 'Night Club',
        gym: 'Gym',
        park: 'Park',
        library: 'Library',
        museum: 'Museum',
        movie_theater: 'Movie Theater',
        shopping_mall: 'Shopping Mall',
        spa: 'Spa',
        art_gallery: 'Art Gallery',
        bowling_alley: 'Bowling Alley',
        amusement_park: 'Amusement Park',
        zoo: 'Zoo',
        aquarium: 'Aquarium',
        gas_station: 'Gas Station',
        pharmacy: 'Pharmacy',
        supermarket: 'Supermarket',
        bank: 'Bank',
        atm: 'ATM'
    };

    // Find the first matching type label
    for (const type of types) {
        if (typeLabels[type]) {
            return typeLabels[type];
        }
    }

    // Fallback: format the first type
    return types[0]
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Clear the details cache
 */
export const clearDetailsCache = () => {
    detailsCache.clear();
};

/**
 * Create an AutocompleteService instance
 * @returns {google.maps.places.AutocompleteService} - Autocomplete service
 */
export const createAutocompleteService = () => {
    const google = getGoogleMapsApi();
    return new google.maps.places.AutocompleteService();
};

/**
 * Get place predictions (autocomplete suggestions)
 * @param {google.maps.places.AutocompleteService} service - Autocomplete service
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of predictions
 */
export const getPlacePredictions = (service, options) => {
    const {
        input,
        location,
        radius = 5000,
        types = ['establishment']
    } = options;

    return new Promise((resolve, reject) => {
        if (!input || input.trim().length < 2) {
            resolve([]);
            return;
        }

        const google = getGoogleMapsApi();

        const request = {
            input: input.trim(),
            types,
            ...(location ? {
                location: new google.maps.LatLng(location.lat, location.lng),
                radius
            } : {})
        };

        service.getPlacePredictions(request, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                resolve(predictions.map(p => ({
                    placeId: p.place_id,
                    description: p.description,
                    mainText: p.structured_formatting?.main_text || p.description,
                    secondaryText: p.structured_formatting?.secondary_text || '',
                    types: p.types || []
                })));
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                resolve([]);
            } else {
                // Don't reject on errors, just return empty
                console.warn('Autocomplete error:', status);
                resolve([]);
            }
        });
    });
};

/**
 * Get place details by place ID and add to results
 * @param {google.maps.places.PlacesService} service - Places service
 * @param {string} placeId - Place ID
 * @param {Object} userLocation - User's location for distance calculation
 * @returns {Promise<Object>} - Place with full details
 */
export const getPlaceByIdWithDetails = async (service, placeId, userLocation) => {
    const details = await getPlaceDetails(service, placeId);

    if (details && details.geometry) {
        const lat = details.geometry.location.lat();
        const lng = details.geometry.location.lng();

        return {
            ...details,
            distance: userLocation ? calculateDistance(userLocation, { lat, lng }) : null
        };
    }

    return details;
};

export default {
    createPlacesService,
    searchNearbyPlaces,
    textSearchPlaces,
    getPlaceDetails,
    searchMultipleTypes,
    getPhotoUrl,
    getPlacePhotoUrl,
    formatOpeningHours,
    getPlaceTypeLabel,
    clearDetailsCache,
    createAutocompleteService,
    getPlacePredictions,
    getPlaceByIdWithDetails
};
