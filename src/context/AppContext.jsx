/**
 * App Context
 * Global state management for PlacePulse application
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { DEFAULT_FILTERS, SORT_OPTIONS } from '../utils/constants';

// Initial state
const initialState = {
    // User location
    userLocation: null,
    locationLoading: true,
    locationError: null,

    // Search state
    searchQuery: '',
    currentMood: null,

    // Places data
    places: [],
    selectedPlace: null,
    placeDetails: null,

    // UI state
    isLoading: false,
    error: null,
    filters: DEFAULT_FILTERS,
    sortBy: SORT_OPTIONS.BEST_MATCH,
    isFilterPanelOpen: false,
    isMobileListView: false,

    // Map state
    mapCenter: null,
    mapZoom: 14
};

// Action types
const ActionTypes = {
    SET_USER_LOCATION: 'SET_USER_LOCATION',
    SET_LOCATION_LOADING: 'SET_LOCATION_LOADING',
    SET_LOCATION_ERROR: 'SET_LOCATION_ERROR',
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
    SET_CURRENT_MOOD: 'SET_CURRENT_MOOD',
    SET_PLACES: 'SET_PLACES',
    SET_SELECTED_PLACE: 'SET_SELECTED_PLACE',
    SET_PLACE_DETAILS: 'SET_PLACE_DETAILS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_FILTERS: 'SET_FILTERS',
    RESET_FILTERS: 'RESET_FILTERS',
    SET_SORT_BY: 'SET_SORT_BY',
    TOGGLE_FILTER_PANEL: 'TOGGLE_FILTER_PANEL',
    SET_MOBILE_LIST_VIEW: 'SET_MOBILE_LIST_VIEW',
    SET_MAP_CENTER: 'SET_MAP_CENTER',
    SET_MAP_ZOOM: 'SET_MAP_ZOOM',
    CLEAR_SEARCH: 'CLEAR_SEARCH',
    RESET_STATE: 'RESET_STATE'
};

// Reducer function
const appReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_USER_LOCATION:
            return {
                ...state,
                userLocation: action.payload,
                locationLoading: false,
                locationError: null,
                mapCenter: action.payload
            };

        case ActionTypes.SET_LOCATION_LOADING:
            return { ...state, locationLoading: action.payload };

        case ActionTypes.SET_LOCATION_ERROR:
            return {
                ...state,
                locationError: action.payload,
                locationLoading: false
            };

        case ActionTypes.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload };

        case ActionTypes.SET_CURRENT_MOOD:
            return { ...state, currentMood: action.payload };

        case ActionTypes.SET_PLACES:
            return { ...state, places: action.payload };

        case ActionTypes.SET_SELECTED_PLACE:
            return { ...state, selectedPlace: action.payload };

        case ActionTypes.SET_PLACE_DETAILS:
            return { ...state, placeDetails: action.payload };

        case ActionTypes.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case ActionTypes.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };

        case ActionTypes.SET_FILTERS:
            return { ...state, filters: { ...state.filters, ...action.payload } };

        case ActionTypes.RESET_FILTERS:
            return { ...state, filters: DEFAULT_FILTERS };

        case ActionTypes.SET_SORT_BY:
            return { ...state, sortBy: action.payload };

        case ActionTypes.TOGGLE_FILTER_PANEL:
            return { ...state, isFilterPanelOpen: !state.isFilterPanelOpen };

        case ActionTypes.SET_MOBILE_LIST_VIEW:
            return { ...state, isMobileListView: action.payload };

        case ActionTypes.SET_MAP_CENTER:
            return { ...state, mapCenter: action.payload };

        case ActionTypes.SET_MAP_ZOOM:
            return { ...state, mapZoom: action.payload };

        case ActionTypes.CLEAR_SEARCH:
            return {
                ...state,
                searchQuery: '',
                currentMood: null,
                places: [],
                selectedPlace: null,
                placeDetails: null,
                error: null
            };

        case ActionTypes.RESET_STATE:
            return { ...initialState, userLocation: state.userLocation };

        default:
            return state;
    }
};

// Create context
const AppContext = createContext(null);

/**
 * App Provider Component
 */
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Action creators
    const actions = useMemo(() => ({
        setUserLocation: (location) =>
            dispatch({ type: ActionTypes.SET_USER_LOCATION, payload: location }),

        setLocationLoading: (loading) =>
            dispatch({ type: ActionTypes.SET_LOCATION_LOADING, payload: loading }),

        setLocationError: (error) =>
            dispatch({ type: ActionTypes.SET_LOCATION_ERROR, payload: error }),

        setSearchQuery: (query) =>
            dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query }),

        setCurrentMood: (mood) =>
            dispatch({ type: ActionTypes.SET_CURRENT_MOOD, payload: mood }),

        setPlaces: (places) =>
            dispatch({ type: ActionTypes.SET_PLACES, payload: places }),

        setSelectedPlace: (place) =>
            dispatch({ type: ActionTypes.SET_SELECTED_PLACE, payload: place }),

        setPlaceDetails: (details) =>
            dispatch({ type: ActionTypes.SET_PLACE_DETAILS, payload: details }),

        setLoading: (loading) =>
            dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),

        setError: (error) =>
            dispatch({ type: ActionTypes.SET_ERROR, payload: error }),

        setFilters: (filters) =>
            dispatch({ type: ActionTypes.SET_FILTERS, payload: filters }),

        resetFilters: () =>
            dispatch({ type: ActionTypes.RESET_FILTERS }),

        setSortBy: (sortBy) =>
            dispatch({ type: ActionTypes.SET_SORT_BY, payload: sortBy }),

        toggleFilterPanel: () =>
            dispatch({ type: ActionTypes.TOGGLE_FILTER_PANEL }),

        setMobileListView: (isListView) =>
            dispatch({ type: ActionTypes.SET_MOBILE_LIST_VIEW, payload: isListView }),

        setMapCenter: (center) =>
            dispatch({ type: ActionTypes.SET_MAP_CENTER, payload: center }),

        setMapZoom: (zoom) =>
            dispatch({ type: ActionTypes.SET_MAP_ZOOM, payload: zoom }),

        clearSearch: () =>
            dispatch({ type: ActionTypes.CLEAR_SEARCH }),

        resetState: () =>
            dispatch({ type: ActionTypes.RESET_STATE })
    }), []);

    // Memoize context value
    const value = useMemo(() => ({
        state,
        actions,
        dispatch
    }), [state, actions]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

/**
 * Custom hook to use App context
 */
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

/**
 * Custom hook for just the state
 */
export const useAppState = () => {
    const { state } = useAppContext();
    return state;
};

/**
 * Custom hook for just the actions
 */
export const useAppActions = () => {
    const { actions } = useAppContext();
    return actions;
};

export default AppContext;
