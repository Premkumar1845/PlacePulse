/**
 * Google Maps Loader Service
 * Handles loading the Google Maps JavaScript API
 */

import { Loader } from '@googlemaps/js-api-loader';

// Singleton loader instance
let loaderInstance = null;
let googleInstance = null;
let loadPromise = null;

/**
 * Get or create the Google Maps API loader
 * @returns {Loader} - Google Maps API loader instance
 */
const getLoader = () => {
    if (!loaderInstance) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
            throw new Error(
                'Google Maps API key is not configured. ' +
                'Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.'
            );
        }

        loaderInstance = new Loader({
            apiKey,
            version: 'weekly',
            libraries: ['places', 'geometry', 'marker']
        });
    }
    return loaderInstance;
};

/**
 * Load the Google Maps API
 * Returns cached instance if already loaded
 * @returns {Promise<google>} - Google Maps API object
 */
export const loadGoogleMapsApi = async () => {
    // Return cached instance if available
    if (googleInstance) {
        return googleInstance;
    }

    // Return existing promise if loading is in progress
    if (loadPromise) {
        return loadPromise;
    }

    // Create new load promise
    loadPromise = (async () => {
        try {
            const loader = getLoader();
            googleInstance = await loader.load();
            return googleInstance;
        } catch (error) {
            loadPromise = null;
            console.error('Failed to load Google Maps API:', error);
            throw new Error('Failed to load Google Maps. Please check your API key and try again.');
        }
    })();

    return loadPromise;
};

/**
 * Check if Google Maps API is loaded
 * @returns {boolean} - True if API is loaded
 */
export const isGoogleMapsLoaded = () => {
    return googleInstance !== null;
};

/**
 * Get the Google Maps API instance
 * Throws if not loaded
 * @returns {google} - Google Maps API object
 */
export const getGoogleMapsApi = () => {
    if (!googleInstance) {
        throw new Error('Google Maps API not loaded. Call loadGoogleMapsApi() first.');
    }
    return googleInstance;
};

/**
 * Create a new Google Map instance
 * @param {HTMLElement} container - DOM element to render map into
 * @param {Object} options - Map options
 * @returns {google.maps.Map} - Map instance
 */
export const createMap = (container, options = {}) => {
    const google = getGoogleMapsApi();

    const defaultOptions = {
        zoom: 14,
        center: { lat: 40.7128, lng: -74.0060 },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: getMapStyles()
    };

    return new google.maps.Map(container, { ...defaultOptions, ...options });
};

/**
 * Get custom map styles for a clean, modern look
 * @returns {Array} - Map style configuration
 */
const getMapStyles = () => [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'simplified' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#c9e9f6' }]
    },
    {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [{ color: '#f5f5f5' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#e0e0e0' }]
    }
];

/**
 * Create an info window
 * @param {string} content - HTML content for info window
 * @returns {google.maps.InfoWindow} - Info window instance
 */
export const createInfoWindow = (content) => {
    const google = getGoogleMapsApi();
    return new google.maps.InfoWindow({ content });
};

/**
 * Create a marker
 * @param {Object} options - Marker options
 * @returns {google.maps.Marker} - Marker instance
 */
export const createMarker = (options) => {
    const google = getGoogleMapsApi();
    return new google.maps.Marker(options);
};

/**
 * Create bounds object
 * @returns {google.maps.LatLngBounds} - Bounds instance
 */
export const createBounds = () => {
    const google = getGoogleMapsApi();
    return new google.maps.LatLngBounds();
};

/**
 * Reverse geocode coordinates to get address
 * @param {Object} location - { lat, lng }
 * @returns {Promise<Object>} - Address information
 */
export const reverseGeocode = async (location) => {
    const google = getGoogleMapsApi();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const result = results[0];
                const addressComponents = result.address_components;

                // Extract address parts
                let street = '';
                let area = '';
                let city = '';
                let state = '';
                let country = '';
                let postalCode = '';

                addressComponents.forEach(component => {
                    const types = component.types;
                    if (types.includes('street_number')) {
                        street = component.long_name + ' ';
                    }
                    if (types.includes('route')) {
                        street += component.long_name;
                    }
                    if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
                        area = component.long_name;
                    }
                    if (types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        state = component.short_name;
                    }
                    if (types.includes('country')) {
                        country = component.long_name;
                    }
                    if (types.includes('postal_code')) {
                        postalCode = component.long_name;
                    }
                });

                resolve({
                    formatted: result.formatted_address,
                    street: street.trim(),
                    area,
                    city,
                    state,
                    country,
                    postalCode,
                    // Short display format
                    short: area || city || street || result.formatted_address.split(',')[0],
                    // Medium display format
                    medium: area ? `${area}, ${city}` : city || result.formatted_address.split(',').slice(0, 2).join(',')
                });
            } else {
                reject(new Error('Geocoding failed: ' + status));
            }
        });
    });
};

export default {
    loadGoogleMapsApi,
    isGoogleMapsLoaded,
    getGoogleMapsApi,
    createMap,
    createInfoWindow,
    createMarker,
    createBounds,
    reverseGeocode
};
