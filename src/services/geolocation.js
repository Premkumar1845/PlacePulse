/**
 * Geolocation Service
 * Handles browser geolocation API interactions
 */

/**
 * Default geolocation options
 */
const DEFAULT_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutes cache
};

/**
 * Error messages for geolocation failures
 */
const ERROR_MESSAGES = {
    1: 'Location access denied. Please enable location permissions in your browser settings.',
    2: 'Unable to determine your location. Please try again.',
    3: 'Location request timed out. Please try again.',
    default: 'An error occurred while getting your location.'
};

/**
 * Check if geolocation is supported by the browser
 * @returns {boolean} - True if geolocation is supported
 */
export const isGeolocationSupported = () => {
    return 'geolocation' in navigator;
};

/**
 * Get the current user position
 * @param {Object} options - Geolocation options
 * @returns {Promise<GeolocationPosition>} - Position object
 */
export const getCurrentPosition = (options = {}) => {
    return new Promise((resolve, reject) => {
        if (!isGeolocationSupported()) {
            reject(new Error('Geolocation is not supported by your browser.'));
            return;
        }

        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position);
            },
            (error) => {
                const message = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.default;
                reject(new Error(message));
            },
            mergedOptions
        );
    });
};

/**
 * Get coordinates from position object
 * @param {GeolocationPosition} position - Position object
 * @returns {Object} - Coordinates {lat, lng}
 */
export const getCoordinates = (position) => {
    return {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
};

/**
 * Get current coordinates directly
 * @param {Object} options - Geolocation options
 * @returns {Promise<Object>} - Coordinates {lat, lng}
 */
export const getCurrentCoordinates = async (options = {}) => {
    const position = await getCurrentPosition(options);
    return getCoordinates(position);
};

/**
 * Watch position changes
 * @param {Function} onSuccess - Callback for position updates
 * @param {Function} onError - Callback for errors
 * @param {Object} options - Geolocation options
 * @returns {number} - Watch ID for clearing the watch
 */
export const watchPosition = (onSuccess, onError, options = {}) => {
    if (!isGeolocationSupported()) {
        onError(new Error('Geolocation is not supported by your browser.'));
        return null;
    }

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    return navigator.geolocation.watchPosition(
        (position) => {
            onSuccess(getCoordinates(position));
        },
        (error) => {
            const message = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.default;
            onError(new Error(message));
        },
        mergedOptions
    );
};

/**
 * Clear position watch
 * @param {number} watchId - Watch ID to clear
 */
export const clearWatch = (watchId) => {
    if (watchId !== null && isGeolocationSupported()) {
        navigator.geolocation.clearWatch(watchId);
    }
};

/**
 * Get permission state for geolocation
 * @returns {Promise<string>} - Permission state ('granted', 'denied', 'prompt')
 */
export const getPermissionState = async () => {
    if (!('permissions' in navigator)) {
        // Fallback for browsers that don't support Permissions API
        return 'prompt';
    }

    try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state;
    } catch (error) {
        console.warn('Error checking geolocation permission:', error);
        return 'prompt';
    }
};

/**
 * Request location permission explicitly
 * @returns {Promise<boolean>} - True if permission granted
 */
export const requestLocationPermission = async () => {
    try {
        await getCurrentPosition({ timeout: 5000 });
        return true;
    } catch (error) {
        console.warn('Location permission request failed:', error);
        return false;
    }
};

export default {
    isGeolocationSupported,
    getCurrentPosition,
    getCoordinates,
    getCurrentCoordinates,
    watchPosition,
    clearWatch,
    getPermissionState,
    requestLocationPermission
};
