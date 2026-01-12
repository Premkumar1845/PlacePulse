/**
 * Map Component
 * Google Maps integration component
 */

import React, { useRef, useEffect, useCallback } from 'react';
import useGoogleMaps from '../../hooks/useGoogleMaps';
import { getBoundsForPlaces } from '../../utils/distance';
import { MAP_CONFIG } from '../../utils/constants';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Map.css';

const Map = ({
    userLocation,
    places = [],
    selectedPlace,
    onPlaceSelect,
    onMapReady
}) => {
    const containerRef = useRef(null);

    const {
        isLoaded,
        error,
        map,
        initializeMap,
        setCenter,
        setZoom,
        fitBounds,
        setUserMarker,
        setPlaceMarkers,
        highlightMarker
    } = useGoogleMaps({
        containerRef,
        initialCenter: userLocation || MAP_CONFIG.DEFAULT_CENTER,
        initialZoom: MAP_CONFIG.DEFAULT_ZOOM,
        onMarkerClick: (place) => {
            onPlaceSelect?.(place);
        }
    });

    // Initialize map when container is ready
    useEffect(() => {
        if (isLoaded && containerRef.current && !map) {
            const mapInstance = initializeMap(containerRef.current);
            if (mapInstance && onMapReady) {
                onMapReady(mapInstance);
            }
        }
    }, [isLoaded, map, initializeMap, onMapReady]);

    // Update user marker when location changes
    useEffect(() => {
        if (map && userLocation) {
            setUserMarker(userLocation);
            setCenter(userLocation);
        }
    }, [map, userLocation, setUserMarker, setCenter]);

    // Update place markers when places change
    useEffect(() => {
        if (map && places.length > 0) {
            setPlaceMarkers(places, selectedPlace?.place_id);

            // Fit bounds to show all places
            if (userLocation) {
                const bounds = getBoundsForPlaces(places, userLocation);
                if (bounds) {
                    fitBounds(bounds);
                }
            }
        }
    }, [map, places, selectedPlace, userLocation, setPlaceMarkers, fitBounds]);

    // Highlight selected marker
    useEffect(() => {
        if (map && selectedPlace) {
            highlightMarker(selectedPlace.place_id);

            // Pan to selected place
            const location = {
                lat: selectedPlace.geometry?.location?.lat() || selectedPlace.geometry?.location?.lat || selectedPlace.lat,
                lng: selectedPlace.geometry?.location?.lng() || selectedPlace.geometry?.location?.lng || selectedPlace.lng
            };
            setCenter(location);
            setZoom(MAP_CONFIG.SELECTED_ZOOM);
        }
    }, [map, selectedPlace, highlightMarker, setCenter, setZoom]);

    // Handle recenter to user
    const handleRecenter = useCallback(() => {
        if (map && userLocation) {
            setCenter(userLocation);
            setZoom(MAP_CONFIG.DEFAULT_ZOOM);
        }
    }, [map, userLocation, setCenter, setZoom]);

    // Loading state
    if (!isLoaded) {
        return (
            <div className="map-container">
                <div className="map-loading">
                    <LoadingSpinner size="large" />
                    <p>Loading map...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="map-container">
                <div className="map-error">
                    <span className="error-icon">🗺️</span>
                    <h3>Map unavailable</h3>
                    <p>{error.message || 'Unable to load Google Maps'}</p>
                    <div className="error-help">
                        <p><strong>To fix this:</strong></p>
                        <ol>
                            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                            <li>Enable "Maps JavaScript API" and "Places API"</li>
                            <li>Create or update your API key</li>
                            <li>Add it to your .env file as VITE_GOOGLE_MAPS_API_KEY</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="map-container">
            <div ref={containerRef} className="map-canvas" />

            {/* Map Controls */}
            <div className="map-controls">
                <button
                    className="map-control-btn recenter"
                    onClick={handleRecenter}
                    title="Center on my location"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                    </svg>
                </button>
            </div>

            {/* Legend */}
            <div className="map-legend">
                <div className="legend-item">
                    <span className="legend-marker user" />
                    <span className="legend-label">Your location</span>
                </div>
                <div className="legend-item">
                    <span className="legend-marker place" />
                    <span className="legend-label">Places</span>
                </div>
                <div className="legend-item">
                    <span className="legend-marker selected" />
                    <span className="legend-label">Selected</span>
                </div>
            </div>
        </div>
    );
};

export default Map;
