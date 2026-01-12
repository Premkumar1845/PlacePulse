/**
 * App Component
 * Main application component orchestrating all features
 * Map-centric layout - optimized for fast loading
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import SearchBar from '../SearchBar/SearchBar';
import Filters from '../Filters/Filters';
import Map from '../Map/Map';
import PlacesList from '../PlacesList/PlacesList';
import PlaceDetails from '../PlaceDetails/PlaceDetails';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import useGeolocation from '../../hooks/useGeolocation';
import usePlaces from '../../hooks/usePlaces';
import { loadGoogleMapsApi } from '../../services/mapsLoader';
import '../../styles/tokens.css';
import './App.css';

const App = () => {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [mapsError, setMapsError] = useState(null);
    const [isMobileMapView, setIsMobileMapView] = useState(false);

    const mapRef = useRef(null);

    // Geolocation hook
    const {
        location: userLocation,
        address: userAddress,
        error: locationError,
        loading: locationLoading,
        refresh: refreshLocation
    } = useGeolocation();

    // Places hook
    const {
        places,
        filteredPlaces,
        selectedPlace,
        placeDetails,
        loading: placesLoading,
        error: placesError,
        currentMood,
        filters,
        sortBy,
        searchByMood,
        selectPlace,
        clearSelection,
        updateFilters,
        resetFilters,
        updateSort,
        clearResults,
        totalResults,
        displayedResults
    } = usePlaces({
        map: mapRef.current,
        userLocation
    });

    // Load Google Maps API on mount
    useEffect(() => {
        const initMaps = async () => {
            try {
                await loadGoogleMapsApi();
                setMapsLoaded(true);
            } catch (err) {
                setMapsError(err);
            }
        };
        initMaps();
    }, []);

    // Handle search
    const handleSearch = useCallback((query) => {
        if (query.trim() && userLocation) {
            searchByMood(query, userLocation);
        }
    }, [searchByMood, userLocation]);

    // Handle clear search
    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
        clearResults();
    }, [clearResults]);

    // Handle direct place selection from autocomplete
    const handlePlaceSelectFromSearch = useCallback((placeDetails) => {
        if (placeDetails) {
            // Normalize the place object to match Google Places API format
            const normalizedPlace = {
                ...placeDetails,
                place_id: placeDetails.placeId || placeDetails.place_id,
                name: placeDetails.name,
                formatted_address: placeDetails.address || placeDetails.formatted_address,
                geometry: placeDetails.geometry || {
                    location: {
                        lat: () => placeDetails.location?.lat || 0,
                        lng: () => placeDetails.location?.lng || 0
                    }
                },
                rating: placeDetails.rating,
                user_ratings_total: placeDetails.userRatingsTotal || placeDetails.user_ratings_total,
                price_level: placeDetails.priceLevel || placeDetails.price_level,
                types: placeDetails.types || [],
                opening_hours: placeDetails.openingHours || placeDetails.opening_hours,
                photos: placeDetails.photos || [],
                distance: placeDetails.distance
            };

            // Select the place to show on map
            selectPlace(normalizedPlace);

            // Also search for similar places nearby for context
            if (normalizedPlace.types && normalizedPlace.types.length > 0) {
                // Use the place type to find similar nearby places
                const searchType = normalizedPlace.types.find(t =>
                    !['point_of_interest', 'establishment'].includes(t)
                ) || normalizedPlace.types[0];
                const searchTerm = searchType.replace(/_/g, ' ');
                searchByMood(searchTerm, userLocation);
            }
        }
    }, [selectPlace, searchByMood, userLocation]);

    // Handle place click
    const handlePlaceClick = useCallback((place) => {
        selectPlace(place);
    }, [selectPlace]);

    // Handle view details
    const handleViewDetails = useCallback((place) => {
        selectPlace(place);
        setShowDetails(true);
    }, [selectPlace]);

    // Handle close details
    const handleCloseDetails = useCallback(() => {
        setShowDetails(false);
    }, []);

    // Handle map ready
    const handleMapReady = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Toggle mobile view
    const toggleMobileView = useCallback(() => {
        setIsMobileMapView(prev => !prev);
    }, []);

    // Initial loading state - Simple fast loader
    if (!mapsLoaded && !mapsError) {
        return (
            <div className="app-loading">
                <div className="app-loading__spinner"></div>
                <p className="app-loading__text">Loading PlacePulse...</p>
            </div>
        );
    }

    // Maps error state
    if (mapsError) {
        return (
            <div className="app-error">
                <div className="error-container">
                    <h1>⚠️ Unable to Load Maps</h1>
                    <ErrorMessage
                        message={mapsError.message}
                        details="Please check your Google Maps API key configuration in the .env file."
                        type="error"
                    />
                    <div className="error-instructions">
                        <h3>Setup Instructions:</h3>
                        <ol>
                            <li>Create a <code>.env</code> file in the project root</li>
                            <li>Add your API key: <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
                            <li>Enable Maps JavaScript API and Places API in Google Cloud Console</li>
                            <li>Restart the development server</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            {/* Header */}
            <Header
                location={userLocation}
                address={userAddress}
                locationError={locationError}
                onRefreshLocation={refreshLocation}
            />

            {/* Search Bar */}
            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                onPlaceSelect={handlePlaceSelectFromSearch}
                userLocation={userLocation}
                loading={placesLoading}
            />

            {/* Main Content */}
            <main className="main-content">
                {/* Mobile View Toggle */}
                <div className="mobile-view-toggle">
                    <button
                        className={`toggle-btn ${!isMobileMapView ? 'active' : ''}`}
                        onClick={() => setIsMobileMapView(false)}
                    >
                        <span>📋</span>
                        List
                    </button>
                    <button
                        className={`toggle-btn ${isMobileMapView ? 'active' : ''}`}
                        onClick={() => setIsMobileMapView(true)}
                    >
                        <span>🗺️</span>
                        Map
                    </button>
                </div>

                {/* Left Panel - List */}
                <section
                    className={`panel list-panel ${isMobileMapView ? 'hidden-mobile' : ''}`}
                >
                    {/* Filters (only show when we have results) */}
                    {(filteredPlaces.length > 0 || totalResults > 0) && (
                        <Filters
                            filters={filters}
                            sortBy={sortBy}
                            onFilterChange={updateFilters}
                            onSortChange={updateSort}
                            onReset={resetFilters}
                            resultsCount={displayedResults}
                            totalCount={totalResults}
                        />
                    )}

                    {/* Places List */}
                    <PlacesList
                        places={filteredPlaces}
                        selectedPlace={selectedPlace}
                        loading={placesLoading}
                        error={placesError}
                        onPlaceClick={handlePlaceClick}
                        onViewDetails={handleViewDetails}
                        emptyMessage={
                            currentMood
                                ? `No places found for "${currentMood}". Try adjusting your filters or search for something else.`
                                : "Enter a mood or intent above to discover nearby places!"
                        }
                    />
                </section>

                {/* Right Panel - Map */}
                <section
                    className={`panel map-panel ${!isMobileMapView ? 'hidden-mobile' : ''}`}
                >
                    <Map
                        userLocation={userLocation}
                        places={filteredPlaces}
                        selectedPlace={selectedPlace}
                        onPlaceSelect={handlePlaceClick}
                        onMapReady={handleMapReady}
                    />
                </section>
            </main>

            {/* Place Details Modal */}
            {showDetails && selectedPlace && (
                <PlaceDetails
                    place={selectedPlace}
                    details={placeDetails}
                    onClose={handleCloseDetails}
                    isOpen={showDetails}
                />
            )}

            {/* Location Loading Overlay */}
            {locationLoading && (
                <div className="location-overlay">
                    <div className="location-overlay-content">
                        <LoadingSpinner size="medium" />
                        <p>Getting your location...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;