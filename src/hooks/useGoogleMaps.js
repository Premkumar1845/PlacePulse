/**
 * useGoogleMaps Hook
 * Custom hook for Google Maps initialization and management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    loadGoogleMapsApi,
    isGoogleMapsLoaded,
    createMap,
    createMarker,
    createInfoWindow,
    createBounds
} from '../services/mapsLoader';
import { MAP_CONFIG } from '../utils/constants';

/**
 * Custom hook for Google Maps functionality
 * @param {Object} options - Hook options
 * @returns {Object} - Google Maps state and methods
 */
const useGoogleMaps = (options = {}) => {
    const {
        containerRef = null,
        initialCenter = MAP_CONFIG.DEFAULT_CENTER,
        initialZoom = MAP_CONFIG.DEFAULT_ZOOM,
        onMapClick = null,
        onMarkerClick = null
    } = options;

    const [isLoaded, setIsLoaded] = useState(isGoogleMapsLoaded());
    const [error, setError] = useState(null);
    const [map, setMap] = useState(null);
    const markersRef = useRef(new Map());
    const infoWindowRef = useRef(null);
    const userMarkerRef = useRef(null);

    /**
     * Load Google Maps API
     */
    const loadMaps = useCallback(async () => {
        if (isGoogleMapsLoaded()) {
            setIsLoaded(true);
            return;
        }

        try {
            await loadGoogleMapsApi();
            setIsLoaded(true);
            setError(null);
        } catch (err) {
            setError(err);
            setIsLoaded(false);
        }
    }, []);

    /**
     * Initialize map on container
     */
    const initializeMap = useCallback((container) => {
        if (!isLoaded || !container) {
            return null;
        }

        const mapInstance = createMap(container, {
            center: initialCenter,
            zoom: initialZoom
        });

        // Add click listener
        if (onMapClick) {
            mapInstance.addListener('click', (event) => {
                onMapClick({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                });
            });
        }

        setMap(mapInstance);
        return mapInstance;
    }, [isLoaded, initialCenter, initialZoom, onMapClick]);

    /**
     * Set map center
     */
    const setCenter = useCallback((location, animate = true) => {
        if (!map) return;

        if (animate) {
            map.panTo(location);
        } else {
            map.setCenter(location);
        }
    }, [map]);

    /**
     * Set map zoom
     */
    const setZoom = useCallback((zoom) => {
        if (!map) return;
        map.setZoom(zoom);
    }, [map]);

    /**
     * Fit map to bounds
     */
    const fitBounds = useCallback((bounds, padding = 50) => {
        if (!map || !bounds) return;

        const googleBounds = createBounds();

        if (bounds.north && bounds.south) {
            // It's a bounds object
            googleBounds.extend({ lat: bounds.north, lng: bounds.east });
            googleBounds.extend({ lat: bounds.south, lng: bounds.west });
        } else if (Array.isArray(bounds)) {
            // It's an array of locations
            bounds.forEach(loc => googleBounds.extend(loc));
        }

        map.fitBounds(googleBounds, padding);
    }, [map]);

    /**
     * Add user location marker
     */
    const setUserMarker = useCallback((location) => {
        if (!map || !isLoaded) return;

        // Remove existing user marker
        if (userMarkerRef.current) {
            userMarkerRef.current.setMap(null);
        }

        userMarkerRef.current = createMarker({
            position: location,
            map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
            },
            title: 'Your location',
            zIndex: 1000
        });
    }, [map, isLoaded]);

    /**
     * Add place markers to map
     */
    const setPlaceMarkers = useCallback((places, selectedPlaceId = null) => {
        if (!map || !isLoaded) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current.clear();

        places.forEach((place, index) => {
            const position = {
                lat: place.geometry?.location?.lat() || place.geometry?.location?.lat || place.lat,
                lng: place.geometry?.location?.lng() || place.geometry?.location?.lng || place.lng
            };

            const isSelected = place.place_id === selectedPlaceId;

            const marker = createMarker({
                position,
                map,
                title: place.name,
                label: {
                    text: String(index + 1),
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                },
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: isSelected ? 18 : 14,
                    fillColor: isSelected ? '#6366f1' : '#ef4444',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                },
                zIndex: isSelected ? 999 : index,
                animation: isSelected ? window.google.maps.Animation.BOUNCE : null
            });

            // Add click listener
            marker.addListener('click', () => {
                if (onMarkerClick) {
                    onMarkerClick(place);
                }
                showInfoWindow(place, marker);
            });

            markersRef.current.set(place.place_id, marker);
        });
    }, [map, isLoaded, onMarkerClick]);

    /**
     * Show info window for a place
     */
    const showInfoWindow = useCallback((place, marker) => {
        if (!map) return;

        // Close existing info window
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }

        const content = `
      <div style="padding: 8px; max-width: 200px;">
        <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">${place.name}</h3>
        ${place.rating ? `<p style="margin: 0 0 4px; font-size: 12px; color: #666;">⭐ ${place.rating} (${place.user_ratings_total || 0} reviews)</p>` : ''}
        ${place.vicinity ? `<p style="margin: 0; font-size: 11px; color: #888;">${place.vicinity}</p>` : ''}
      </div>
    `;

        infoWindowRef.current = createInfoWindow(content);
        infoWindowRef.current.open(map, marker);
    }, [map]);

    /**
     * Highlight a specific marker
     */
    const highlightMarker = useCallback((placeId) => {
        markersRef.current.forEach((marker, id) => {
            const isSelected = id === placeId;
            marker.setIcon({
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: isSelected ? 18 : 14,
                fillColor: isSelected ? '#6366f1' : '#ef4444',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            });
            marker.setZIndex(isSelected ? 999 : 0);
            marker.setAnimation(isSelected ? window.google.maps.Animation.BOUNCE : null);

            // Stop bounce after a moment
            if (isSelected) {
                setTimeout(() => {
                    marker.setAnimation(null);
                }, 1500);
            }
        });
    }, []);

    /**
     * Clear all markers
     */
    const clearMarkers = useCallback(() => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current.clear();

        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    }, []);

    // Load Google Maps API on mount
    useEffect(() => {
        loadMaps();
    }, [loadMaps]);

    // Initialize map when container is available
    useEffect(() => {
        if (isLoaded && containerRef?.current && !map) {
            initializeMap(containerRef.current);
        }
    }, [isLoaded, containerRef, map, initializeMap]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearMarkers();
            if (userMarkerRef.current) {
                userMarkerRef.current.setMap(null);
            }
        };
    }, [clearMarkers]);

    return {
        isLoaded,
        error,
        map,
        initializeMap,
        setCenter,
        setZoom,
        fitBounds,
        setUserMarker,
        setPlaceMarkers,
        highlightMarker,
        clearMarkers,
        showInfoWindow
    };
};

export default useGoogleMaps;
