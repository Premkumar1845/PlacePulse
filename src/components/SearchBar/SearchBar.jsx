/**
 * SearchBar Component
 * Enhanced search with Google Places Autocomplete and mood suggestions
 * Fast-loading, no heavy animations
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MOOD_SUGGESTIONS } from '../../utils/constants';
import { getMoodSuggestions } from '../../utils/moodMapping';
import {
    createAutocompleteService,
    getPlacePredictions,
    createPlacesService,
    getPlaceByIdWithDetails
} from '../../services/placesApi';
import { isGoogleMapsLoaded } from '../../services/mapsLoader';
import './SearchBar.css';

const SearchBar = ({
    value,
    onChange,
    onSearch,
    onClear,
    onPlaceSelect,
    userLocation,
    loading = false,
    placeholder = "Search places or moods (coffee, restaurants, date night...)"
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [moodSuggestions, setMoodSuggestions] = useState([]);
    const [placePredictions, setPlacePredictions] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'moods', 'places'
    const [isSearching, setIsSearching] = useState(false);

    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const autocompleteServiceRef = useRef(null);
    const placesServiceRef = useRef(null);
    const debounceRef = useRef(null);

    // Initialize services when Google Maps is loaded
    useEffect(() => {
        const initServices = () => {
            if (isGoogleMapsLoaded()) {
                autocompleteServiceRef.current = createAutocompleteService();
                placesServiceRef.current = createPlacesService();
            }
        };

        initServices();

        // Check again after a short delay in case Maps loads later
        const timer = setTimeout(initServices, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Update suggestions based on input
    useEffect(() => {
        if (value.trim()) {
            // Get mood suggestions immediately
            const matches = getMoodSuggestions(value);
            setMoodSuggestions(matches);

            // Get place predictions with debounce
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(async () => {
                if (autocompleteServiceRef.current && value.trim().length >= 2) {
                    setIsSearching(true);
                    try {
                        const predictions = await getPlacePredictions(
                            autocompleteServiceRef.current,
                            {
                                input: value,
                                location: userLocation,
                                radius: 15000,
                                types: ['establishment', 'geocode']
                            }
                        );
                        setPlacePredictions(predictions);
                    } catch (err) {
                        console.warn('Autocomplete error:', err);
                        setPlacePredictions([]);
                    } finally {
                        setIsSearching(false);
                    }
                } else {
                    setPlacePredictions([]);
                }
            }, 300);
        } else {
            setMoodSuggestions([]);
            setPlacePredictions([]);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [value, userLocation]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown when loading starts (search triggered)
    useEffect(() => {
        if (loading) {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    }, [loading]);

    const handleInputChange = useCallback((e) => {
        onChange(e.target.value);
    }, [onChange]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (value.trim()) {
            setIsFocused(false);
            inputRef.current?.blur();
            onSearch(value.trim());
        }
    }, [value, onSearch]);

    const handleMoodClick = useCallback((mood) => {
        setIsFocused(false);
        inputRef.current?.blur();
        onChange(mood.value);
        onSearch(mood.value);
    }, [onChange, onSearch]);

    const handlePlacePredictionClick = useCallback(async (prediction) => {
        setIsFocused(false);
        inputRef.current?.blur();
        onChange(prediction.mainText);

        // Get full place details and pass to parent
        if (placesServiceRef.current && onPlaceSelect) {
            try {
                const placeDetails = await getPlaceByIdWithDetails(
                    placesServiceRef.current,
                    prediction.placeId,
                    userLocation
                );
                onPlaceSelect(placeDetails);
            } catch (err) {
                console.warn('Failed to get place details:', err);
                // Fall back to text search
                onSearch(prediction.mainText);
            }
        } else {
            onSearch(prediction.mainText);
        }
    }, [onChange, onSearch, onPlaceSelect, userLocation]);

    const handleQuickMoodClick = useCallback((mood) => {
        setIsFocused(false);
        inputRef.current?.blur();
        onChange(mood.value);
        onSearch(mood.value);
    }, [onChange, onSearch]);

    const handleClear = useCallback(() => {
        onChange('');
        onClear?.();
        setPlacePredictions([]);
        setMoodSuggestions([]);
        setIsFocused(false);
    }, [onChange, onClear]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    }, []);

    const hasSuggestions = moodSuggestions.length > 0 || placePredictions.length > 0;
    // Only show dropdown if focused AND not loading AND has suggestions
    const showDropdown = isFocused && !loading && (hasSuggestions || isSearching);

    // Filter suggestions based on active tab
    const getFilteredSuggestions = () => {
        if (activeTab === 'moods') return { moods: moodSuggestions, places: [] };
        if (activeTab === 'places') return { moods: [], places: placePredictions };
        return { moods: moodSuggestions, places: placePredictions };
    };

    const { moods: filteredMoods, places: filteredPlaces } = getFilteredSuggestions();

    return (
        <div className="search-bar-container">
            {/* Main Search Form */}
            <form className="search-form" onSubmit={handleSubmit}>
                <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
                    <span className="search-icon">🔍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={loading}
                        autoComplete="off"
                    />
                    {value && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={handleClear}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                    <button
                        type="submit"
                        className="search-btn"
                        disabled={!value.trim() || loading}
                    >
                        {loading ? (
                            <span className="loading-spinner" />
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>

                {/* Enhanced Autocomplete Dropdown */}
                {showDropdown && (
                    <div className="suggestions-dropdown" ref={suggestionsRef}>
                        {/* Tab Filters */}
                        {(moodSuggestions.length > 0 && placePredictions.length > 0) && (
                            <div className="suggestions-tabs">
                                <button
                                    type="button"
                                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    className={`tab-btn ${activeTab === 'places' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('places')}
                                >
                                    📍 Places
                                </button>
                                <button
                                    type="button"
                                    className={`tab-btn ${activeTab === 'moods' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('moods')}
                                >
                                    ✨ Moods
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isSearching && placePredictions.length === 0 && (
                            <div className="suggestions-loading">
                                <span className="loading-dot"></span>
                                <span className="loading-dot"></span>
                                <span className="loading-dot"></span>
                            </div>
                        )}

                        {/* Place Predictions */}
                        {filteredPlaces.length > 0 && (
                            <div className="suggestions-section">
                                <div className="suggestions-section-header">
                                    <span className="section-icon">📍</span>
                                    <span className="section-title">Places</span>
                                </div>
                                {filteredPlaces.slice(0, 5).map((prediction) => (
                                    <button
                                        key={prediction.placeId}
                                        type="button"
                                        className="suggestion-item place-suggestion"
                                        onClick={() => handlePlacePredictionClick(prediction)}
                                    >
                                        <span className="suggestion-icon">📍</span>
                                        <div className="suggestion-content">
                                            <span className="suggestion-main">{prediction.mainText}</span>
                                            {prediction.secondaryText && (
                                                <span className="suggestion-secondary">{prediction.secondaryText}</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Mood Suggestions */}
                        {filteredMoods.length > 0 && (
                            <div className="suggestions-section">
                                <div className="suggestions-section-header">
                                    <span className="section-icon">✨</span>
                                    <span className="section-title">Moods & Categories</span>
                                </div>
                                {filteredMoods.slice(0, 5).map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="suggestion-item mood-suggestion"
                                        onClick={() => handleMoodClick(suggestion)}
                                    >
                                        <span className="suggestion-icon">{suggestion.icon || '✨'}</span>
                                        <div className="suggestion-content">
                                            <span className="suggestion-main">{suggestion.value}</span>
                                            <span className="suggestion-secondary">{suggestion.description}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {!isSearching && !hasSuggestions && value.trim().length >= 2 && (
                            <div className="suggestions-empty">
                                <span>No suggestions found. Press Enter to search.</span>
                            </div>
                        )}
                    </div>
                )}
            </form>

            {/* Quick Mood Buttons */}
            <div className="quick-moods">
                <span className="quick-moods-label">Quick picks:</span>
                <div className="quick-moods-list">
                    {MOOD_SUGGESTIONS.map((mood) => (
                        <button
                            key={mood.value}
                            type="button"
                            className="quick-mood-btn"
                            style={{
                                '--mood-color': mood.color,
                                '--mood-gradient': mood.gradient
                            }}
                            onClick={() => handleQuickMoodClick(mood)}
                            disabled={loading}
                        >
                            <span className="mood-icon">{mood.icon}</span>
                            <span className="mood-label">{mood.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
