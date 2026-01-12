/**
 * useGeolocation Hook
 * Custom hook for handling browser geolocation with reverse geocoding
 */

import { useState, useEffect, useCallback } from 'react';
import {
    isGeolocationSupported,
    getCurrentCoordinates,
    watchPosition,
    clearWatch,
    getPermissionState
} from '../services/geolocation';
import { loadGoogleMapsApi, reverseGeocode, isGoogleMapsLoaded } from '../services/mapsLoader';
import { MAP_CONFIG } from '../utils/constants';

/**
 * Custom hook for geolocation functionality
 * @param {Object} options - Hook options
 * @returns {Object} - Geolocation state and methods
 */
const useGeolocation = (options = {}) => {
    const {
        enableWatch = false,
        fallbackLocation = MAP_CONFIG.DEFAULT_CENTER
    } = options;

    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [permissionState, setPermissionState] = useState('prompt');
    const [watchId, setWatchId] = useState(null);

    /**
     * Get address from coordinates
     */
    const fetchAddress = useCallback(async (coords) => {
        try {
            // Make sure Google Maps is loaded
            if (!isGoogleMapsLoaded()) {
                await loadGoogleMapsApi();
            }
            const addressData = await reverseGeocode(coords);
            setAddress(addressData);
        } catch (err) {
            console.warn('Reverse geocoding failed:', err);
            // Don't set error, just keep address null
            setAddress(null);
        }
    }, []);

    /**
     * Check and update permission state
     */
    const checkPermission = useCallback(async () => {
        const state = await getPermissionState();
        setPermissionState(state);
        return state;
    }, []);

    /**
     * Fetch current location
     */
    const fetchLocation = useCallback(async () => {
        if (!isGeolocationSupported()) {
            setError(new Error('Geolocation is not supported by your browser.'));
            setLocation(fallbackLocation);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const coords = await getCurrentCoordinates();
            setLocation(coords);
            setError(null);
            // Fetch address after getting coordinates
            fetchAddress(coords);
        } catch (err) {
            setError(err);
            setLocation(fallbackLocation);
        } finally {
            setLoading(false);
        }
    }, [fallbackLocation, fetchAddress]);

    /**
     * Start watching position
     */
    const startWatching = useCallback(() => {
        if (!isGeolocationSupported() || watchId !== null) {
            return;
        }

        const id = watchPosition(
            (coords) => {
                setLocation(coords);
                setError(null);
            },
            (err) => {
                setError(err);
            }
        );

        setWatchId(id);
    }, [watchId]);

    /**
     * Stop watching position
     */
    const stopWatching = useCallback(() => {
        if (watchId !== null) {
            clearWatch(watchId);
            setWatchId(null);
        }
    }, [watchId]);

    /**
     * Refresh location
     */
    const refresh = useCallback(() => {
        return fetchLocation();
    }, [fetchLocation]);

    // Initial location fetch
    useEffect(() => {
        checkPermission();
        fetchLocation();
    }, [checkPermission, fetchLocation]);

    // Handle watching
    useEffect(() => {
        if (enableWatch && location) {
            startWatching();
        }

        return () => {
            stopWatching();
        };
    }, [enableWatch, location, startWatching, stopWatching]);

    return {
        location,
        address,
        error,
        loading,
        permissionState,
        isSupported: isGeolocationSupported(),
        isWatching: watchId !== null,
        refresh,
        startWatching,
        stopWatching
    };
};

export default useGeolocation;
