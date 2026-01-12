/**
 * usePlaces Hook
 * Custom hook for searching and managing places data
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    createPlacesService,
    searchNearbyPlaces,
    searchMultipleTypes,
    getPlaceDetails
} from '../services/placesApi';
import { getMoodMapping, calculateRelevanceScore } from '../utils/moodMapping';
import { filterAndSortPlaces } from '../utils/filterSort';
import { SEARCH_RADIUS, SORT_OPTIONS, DEFAULT_FILTERS, UI } from '../utils/constants';

/**
 * Custom hook for places search and management
 * @param {Object} options - Hook options
 * @returns {Object} - Places state and methods
 */
const usePlaces = (options = {}) => {
    const {
        map = null,
        userLocation = null
    } = options;

    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentMood, setCurrentMood] = useState(null);
    const [currentMoodMapping, setCurrentMoodMapping] = useState(null);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.BEST_MATCH);

    const serviceRef = useRef(null);
    const searchAbortRef = useRef(null);

    /**
     * Initialize places service
     */
    const initService = useCallback(() => {
        if (serviceRef.current) return serviceRef.current;

        try {
            serviceRef.current = createPlacesService(map);
            return serviceRef.current;
        } catch (err) {
            setError(err);
            return null;
        }
    }, [map]);

    /**
     * Search places by mood/intent
     */
    const searchByMood = useCallback(async (mood, location = userLocation) => {
        if (!location) {
            setError(new Error('Location is required for search'));
            return;
        }

        // Cancel any ongoing search
        if (searchAbortRef.current) {
            searchAbortRef.current.abort = true;
        }
        searchAbortRef.current = { abort: false };
        const currentSearch = searchAbortRef.current;

        setLoading(true);
        setError(null);
        setCurrentMood(mood);
        setSelectedPlace(null);
        setPlaceDetails(null);

        try {
            const service = initService();
            if (!service) {
                throw new Error('Places service not initialized');
            }

            // Get mood mapping
            const moodMapping = getMoodMapping(mood);
            setCurrentMoodMapping(moodMapping);

            // Search for places
            const results = await searchMultipleTypes(service, {
                types: moodMapping.types,
                keywords: moodMapping.keywords,
                location,
                radius: SEARCH_RADIUS.DEFAULT
            });

            // Check if search was aborted
            if (currentSearch.abort) return;

            // Calculate relevance scores
            const placesWithScores = results.map(place => ({
                ...place,
                relevanceScore: calculateRelevanceScore(place, moodMapping)
            }));

            // Limit results
            const limitedResults = placesWithScores.slice(0, UI.MAX_RESULTS);

            setPlaces(limitedResults);

            // Apply filters and sorting
            const processed = filterAndSortPlaces(limitedResults, filters, sortBy, moodMapping);
            setFilteredPlaces(processed);

        } catch (err) {
            if (!currentSearch.abort) {
                setError(err);
                setPlaces([]);
                setFilteredPlaces([]);
            }
        } finally {
            if (!currentSearch.abort) {
                setLoading(false);
            }
        }
    }, [userLocation, initService, filters, sortBy]);

    /**
     * Search places by type
     */
    const searchByType = useCallback(async (type, location = userLocation) => {
        if (!location) {
            setError(new Error('Location is required for search'));
            return;
        }

        setLoading(true);
        setError(null);
        setCurrentMood(null);
        setCurrentMoodMapping(null);
        setSelectedPlace(null);
        setPlaceDetails(null);

        try {
            const service = initService();
            if (!service) {
                throw new Error('Places service not initialized');
            }

            const results = await searchNearbyPlaces(service, {
                location,
                radius: SEARCH_RADIUS.DEFAULT,
                type
            });

            const limitedResults = results.slice(0, UI.MAX_RESULTS);
            setPlaces(limitedResults);

            const processed = filterAndSortPlaces(limitedResults, filters, sortBy);
            setFilteredPlaces(processed);

        } catch (err) {
            setError(err);
            setPlaces([]);
            setFilteredPlaces([]);
        } finally {
            setLoading(false);
        }
    }, [userLocation, initService, filters, sortBy]);

    /**
     * Load details for a place
     */
    const loadPlaceDetails = useCallback(async (placeId) => {
        if (!placeId) return;

        try {
            const service = initService();
            if (!service) {
                throw new Error('Places service not initialized');
            }

            const details = await getPlaceDetails(service, placeId);
            setPlaceDetails(details);
            return details;
        } catch (err) {
            console.error('Failed to load place details:', err);
            return null;
        }
    }, [initService]);

    /**
     * Select a place
     */
    const selectPlace = useCallback(async (place) => {
        setSelectedPlace(place);
        if (place?.place_id) {
            await loadPlaceDetails(place.place_id);
        } else {
            setPlaceDetails(null);
        }
    }, [loadPlaceDetails]);

    /**
     * Clear selection
     */
    const clearSelection = useCallback(() => {
        setSelectedPlace(null);
        setPlaceDetails(null);
    }, []);

    /**
     * Update filters
     */
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    /**
     * Reset filters
     */
    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    /**
     * Update sort option
     */
    const updateSort = useCallback((newSortBy) => {
        setSortBy(newSortBy);
    }, []);

    /**
     * Clear all results
     */
    const clearResults = useCallback(() => {
        setPlaces([]);
        setFilteredPlaces([]);
        setSelectedPlace(null);
        setPlaceDetails(null);
        setCurrentMood(null);
        setCurrentMoodMapping(null);
        setError(null);
    }, []);

    // Re-filter and sort when filters or sortBy change
    useEffect(() => {
        if (places.length > 0) {
            const processed = filterAndSortPlaces(places, filters, sortBy, currentMoodMapping);
            setFilteredPlaces(processed);
        }
    }, [places, filters, sortBy, currentMoodMapping]);

    return {
        // Data
        places,
        filteredPlaces,
        selectedPlace,
        placeDetails,
        currentMood,
        currentMoodMapping,

        // State
        loading,
        error,
        filters,
        sortBy,

        // Methods
        searchByMood,
        searchByType,
        selectPlace,
        clearSelection,
        loadPlaceDetails,
        updateFilters,
        resetFilters,
        updateSort,
        clearResults,

        // Computed
        hasResults: filteredPlaces.length > 0,
        totalResults: places.length,
        displayedResults: filteredPlaces.length
    };
};

export default usePlaces;
