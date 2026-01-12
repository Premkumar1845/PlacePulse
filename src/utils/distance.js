/**
 * Distance calculation utilities
 * Uses Haversine formula for accurate Earth-surface distance calculation
 */

// Earth's radius in different units
const EARTH_RADIUS = {
    km: 6371,
    miles: 3959,
    meters: 6371000
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {Object} point1 - First point {lat, lng}
 * @param {Object} point2 - Second point {lat, lng}
 * @param {string} unit - Unit of measurement ('km', 'miles', 'meters')
 * @returns {number} - Distance in specified unit
 */
export const calculateDistance = (point1, point2, unit = 'meters') => {
    const lat1 = toRadians(point1.lat);
    const lat2 = toRadians(point2.lat);
    const deltaLat = toRadians(point2.lat - point1.lat);
    const deltaLng = toRadians(point2.lng - point1.lng);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const radius = EARTH_RADIUS[unit] || EARTH_RADIUS.meters;
    return radius * c;
};

/**
 * Format distance for display
 * @param {number} distanceInMeters - Distance in meters
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distanceInMeters) => {
    if (distanceInMeters < 100) {
        return `${Math.round(distanceInMeters)} m`;
    } else if (distanceInMeters < 1000) {
        return `${Math.round(distanceInMeters / 10) * 10} m`;
    } else if (distanceInMeters < 10000) {
        return `${(distanceInMeters / 1000).toFixed(1)} km`;
    } else {
        return `${Math.round(distanceInMeters / 1000)} km`;
    }
};

/**
 * Get walking time estimate
 * Average walking speed: ~5 km/h = ~83 meters/minute
 * @param {number} distanceInMeters - Distance in meters
 * @returns {string} - Estimated walking time
 */
export const getWalkingTime = (distanceInMeters) => {
    const minutes = Math.round(distanceInMeters / 83);

    if (minutes < 1) {
        return '< 1 min walk';
    } else if (minutes === 1) {
        return '1 min walk';
    } else if (minutes < 60) {
        return `${minutes} min walk`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMins = minutes % 60;
        if (remainingMins === 0) {
            return `${hours} hr walk`;
        }
        return `${hours} hr ${remainingMins} min walk`;
    }
};

/**
 * Get driving time estimate
 * Average city driving speed: ~30 km/h = ~500 meters/minute
 * @param {number} distanceInMeters - Distance in meters
 * @returns {string} - Estimated driving time
 */
export const getDrivingTime = (distanceInMeters) => {
    const minutes = Math.round(distanceInMeters / 500);

    if (minutes < 1) {
        return '< 1 min drive';
    } else if (minutes === 1) {
        return '1 min drive';
    } else if (minutes < 60) {
        return `${minutes} min drive`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMins = minutes % 60;
        if (remainingMins === 0) {
            return `${hours} hr drive`;
        }
        return `${hours} hr ${remainingMins} min drive`;
    }
};

/**
 * Sort places by distance from a point
 * @param {Array} places - Array of place objects
 * @param {Object} fromPoint - Reference point {lat, lng}
 * @returns {Array} - Sorted array of places with distance property
 */
export const sortByDistance = (places, fromPoint) => {
    return places
        .map(place => {
            const placeLocation = {
                lat: place.geometry?.location?.lat() || place.geometry?.location?.lat || place.lat,
                lng: place.geometry?.location?.lng() || place.geometry?.location?.lng || place.lng
            };
            const distance = calculateDistance(fromPoint, placeLocation);
            return { ...place, distance };
        })
        .sort((a, b) => a.distance - b.distance);
};

/**
 * Check if a place is within a certain radius
 * @param {Object} place - Place object with location
 * @param {Object} center - Center point {lat, lng}
 * @param {number} radiusInMeters - Radius in meters
 * @returns {boolean} - True if place is within radius
 */
export const isWithinRadius = (place, center, radiusInMeters) => {
    const placeLocation = {
        lat: place.geometry?.location?.lat() || place.geometry?.location?.lat || place.lat,
        lng: place.geometry?.location?.lng() || place.geometry?.location?.lng || place.lng
    };
    const distance = calculateDistance(center, placeLocation);
    return distance <= radiusInMeters;
};

/**
 * Get bounds that contain all places
 * @param {Array} places - Array of place objects
 * @param {Object} center - Center point to include
 * @returns {Object} - Bounds object {north, south, east, west}
 */
export const getBoundsForPlaces = (places, center) => {
    if (!places || places.length === 0) {
        return null;
    }

    let north = center.lat;
    let south = center.lat;
    let east = center.lng;
    let west = center.lng;

    places.forEach(place => {
        const lat = place.geometry?.location?.lat() || place.geometry?.location?.lat || place.lat;
        const lng = place.geometry?.location?.lng() || place.geometry?.location?.lng || place.lng;

        if (lat > north) north = lat;
        if (lat < south) south = lat;
        if (lng > east) east = lng;
        if (lng < west) west = lng;
    });

    // Add padding
    const latPadding = (north - south) * 0.1;
    const lngPadding = (east - west) * 0.1;

    return {
        north: north + latPadding,
        south: south - latPadding,
        east: east + lngPadding,
        west: west - lngPadding
    };
};
