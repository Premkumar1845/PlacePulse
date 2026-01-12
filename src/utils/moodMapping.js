/**
 * Mood to Place Type Mapping
 * Maps user intents/moods to Google Places API place types
 * 
 * Reference: https://developers.google.com/maps/documentation/places/web-service/supported_types
 */

// Comprehensive mood → place types mapping
const moodMappings = {
    // Work & Productivity
    work: {
        types: ['cafe', 'library'],
        keywords: ['coworking', 'workspace', 'study'],
        description: 'Places to work or study',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    study: {
        types: ['library', 'cafe'],
        keywords: ['study', 'quiet'],
        description: 'Quiet places to focus',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    meeting: {
        types: ['cafe', 'restaurant'],
        keywords: ['business', 'meeting'],
        description: 'Places for business meetings',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },

    // Social & Dating
    date: {
        types: ['restaurant', 'bar'],
        keywords: ['romantic', 'dinner', 'lounge', 'cocktail'],
        description: 'Romantic spots for dates',
        preferredPrice: [2, 3, 4],
        prioritizeRating: true
    },
    drinks: {
        types: ['bar', 'night_club'],
        keywords: ['pub', 'cocktail', 'wine bar', 'brewery'],
        description: 'Places for drinks',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },
    nightlife: {
        types: ['night_club', 'bar'],
        keywords: ['club', 'dance', 'nightlife'],
        description: 'Night entertainment venues',
        preferredPrice: [2, 3, 4],
        prioritizeRating: false
    },

    // Food & Dining
    'quick bite': {
        types: ['restaurant', 'bakery', 'meal_takeaway'],
        keywords: ['fast food', 'quick', 'takeaway', 'grab and go'],
        description: 'Fast and convenient food',
        preferredPrice: [1, 2],
        prioritizeRating: false
    },
    breakfast: {
        types: ['cafe', 'bakery', 'restaurant'],
        keywords: ['breakfast', 'brunch', 'pancakes'],
        description: 'Morning meals',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    brunch: {
        types: ['restaurant', 'cafe'],
        keywords: ['brunch', 'breakfast', 'mimosa'],
        description: 'Brunch spots',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },
    lunch: {
        types: ['restaurant', 'cafe', 'meal_takeaway'],
        keywords: ['lunch', 'midday'],
        description: 'Lunch options',
        preferredPrice: [1, 2, 3],
        prioritizeRating: true
    },
    dinner: {
        types: ['restaurant'],
        keywords: ['dinner', 'fine dining'],
        description: 'Dinner restaurants',
        preferredPrice: [2, 3, 4],
        prioritizeRating: true
    },
    coffee: {
        types: ['cafe'],
        keywords: ['coffee', 'espresso', 'latte'],
        description: 'Coffee shops',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    dessert: {
        types: ['bakery', 'cafe'],
        keywords: ['dessert', 'ice cream', 'cake', 'pastry'],
        description: 'Sweet treats',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },

    // Budget & Value
    budget: {
        types: ['restaurant', 'cafe', 'meal_takeaway'],
        keywords: ['cheap', 'affordable', 'budget'],
        description: 'Budget-friendly options',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    fancy: {
        types: ['restaurant', 'bar'],
        keywords: ['upscale', 'fine dining', 'luxury'],
        description: 'Upscale experiences',
        preferredPrice: [3, 4],
        prioritizeRating: true
    },

    // Relaxation & Leisure
    chill: {
        types: ['cafe', 'park'],
        keywords: ['relax', 'chill', 'cozy', 'lounge'],
        description: 'Relaxed atmosphere',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    spa: {
        types: ['spa', 'beauty_salon'],
        keywords: ['massage', 'wellness', 'relaxation'],
        description: 'Spa and wellness',
        preferredPrice: [2, 3, 4],
        prioritizeRating: true
    },

    // Family & Kids
    family: {
        types: ['restaurant', 'park', 'amusement_park', 'zoo'],
        keywords: ['family friendly', 'kids', 'children'],
        description: 'Family-friendly places',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    kids: {
        types: ['park', 'amusement_park', 'zoo', 'aquarium'],
        keywords: ['playground', 'kids', 'family'],
        description: 'Kid-friendly activities',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },

    // Outdoor & Nature
    outdoors: {
        types: ['park', 'campground'],
        keywords: ['outdoor', 'nature', 'hiking', 'trail'],
        description: 'Outdoor activities',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    nature: {
        types: ['park', 'campground'],
        keywords: ['nature', 'garden', 'botanical'],
        description: 'Natural spaces',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    picnic: {
        types: ['park'],
        keywords: ['picnic', 'garden', 'outdoor'],
        description: 'Picnic spots',
        preferredPrice: [0],
        prioritizeRating: false
    },

    // Health & Fitness
    fitness: {
        types: ['gym'],
        keywords: ['fitness', 'workout', 'exercise'],
        description: 'Fitness facilities',
        preferredPrice: [1, 2, 3],
        prioritizeRating: true
    },
    gym: {
        types: ['gym'],
        keywords: ['gym', 'fitness center', 'workout'],
        description: 'Gyms and fitness centers',
        preferredPrice: [1, 2, 3],
        prioritizeRating: true
    },
    yoga: {
        types: ['gym'],
        keywords: ['yoga', 'pilates', 'meditation'],
        description: 'Yoga and wellness studios',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },

    // Entertainment & Culture
    entertainment: {
        types: ['movie_theater', 'bowling_alley', 'amusement_park'],
        keywords: ['entertainment', 'fun', 'games'],
        description: 'Entertainment venues',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },
    movies: {
        types: ['movie_theater'],
        keywords: ['cinema', 'movie', 'film'],
        description: 'Movie theaters',
        preferredPrice: [2],
        prioritizeRating: true
    },
    culture: {
        types: ['museum', 'art_gallery'],
        keywords: ['museum', 'art', 'culture', 'history'],
        description: 'Cultural attractions',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    art: {
        types: ['art_gallery', 'museum'],
        keywords: ['art', 'gallery', 'exhibition'],
        description: 'Art venues',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    music: {
        types: ['bar', 'night_club'],
        keywords: ['live music', 'concert', 'jazz'],
        description: 'Live music venues',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },

    // Shopping
    shopping: {
        types: ['shopping_mall', 'department_store', 'clothing_store'],
        keywords: ['shopping', 'mall', 'retail'],
        description: 'Shopping destinations',
        preferredPrice: [1, 2, 3],
        prioritizeRating: false
    },
    groceries: {
        types: ['supermarket', 'grocery_or_supermarket'],
        keywords: ['grocery', 'supermarket', 'food store'],
        description: 'Grocery stores',
        preferredPrice: [1, 2],
        prioritizeRating: false
    },

    // Services & Utilities
    gas: {
        types: ['gas_station'],
        keywords: ['gas', 'fuel', 'petrol'],
        description: 'Gas stations',
        preferredPrice: [1],
        prioritizeRating: false
    },
    atm: {
        types: ['atm', 'bank'],
        keywords: ['atm', 'bank', 'cash'],
        description: 'ATMs and banks',
        preferredPrice: [0],
        prioritizeRating: false
    },
    pharmacy: {
        types: ['pharmacy'],
        keywords: ['pharmacy', 'drugstore', 'medicine'],
        description: 'Pharmacies',
        preferredPrice: [1, 2],
        prioritizeRating: false
    }
};

/**
 * Get place types and keywords for a given mood/intent
 * @param {string} mood - User's mood or intent
 * @returns {Object} - Mapping object with types, keywords, etc.
 */
export const getMoodMapping = (mood) => {
    const normalizedMood = mood.toLowerCase().trim();

    // Direct match
    if (moodMappings[normalizedMood]) {
        return moodMappings[normalizedMood];
    }

    // Partial match - find moods that contain the search term
    const partialMatch = Object.keys(moodMappings).find(key =>
        key.includes(normalizedMood) || normalizedMood.includes(key)
    );

    if (partialMatch) {
        return moodMappings[partialMatch];
    }

    // Keyword match - search in keywords
    for (const [key, mapping] of Object.entries(moodMappings)) {
        if (mapping.keywords.some(keyword =>
            keyword.includes(normalizedMood) || normalizedMood.includes(keyword)
        )) {
            return mapping;
        }
    }

    // Default fallback - general search
    return {
        types: ['restaurant', 'cafe'],
        keywords: [normalizedMood],
        description: 'General search',
        preferredPrice: [1, 2, 3],
        prioritizeRating: true
    };
};

/**
 * Get all available mood categories
 * @returns {Array} - Array of mood options
 */
export const getAllMoods = () => {
    return Object.keys(moodMappings).map(key => ({
        value: key,
        ...moodMappings[key]
    }));
};

/**
 * Get mood suggestions based on partial input
 * @param {string} input - Partial user input
 * @returns {Array} - Array of suggested moods
 */
export const getMoodSuggestions = (input) => {
    const normalizedInput = input.toLowerCase().trim();

    if (!normalizedInput) {
        // Return popular moods when no input
        return ['work', 'date', 'quick bite', 'coffee', 'chill', 'family']
            .map(key => ({ value: key, ...moodMappings[key] }));
    }

    const suggestions = [];

    for (const [key, mapping] of Object.entries(moodMappings)) {
        // Match by key
        if (key.includes(normalizedInput)) {
            suggestions.push({ value: key, ...mapping, matchType: 'name' });
            continue;
        }

        // Match by keywords
        if (mapping.keywords.some(kw => kw.includes(normalizedInput))) {
            suggestions.push({ value: key, ...mapping, matchType: 'keyword' });
        }
    }

    // Sort by match type (name matches first) and limit results
    return suggestions
        .sort((a, b) => (a.matchType === 'name' ? -1 : 1))
        .slice(0, 6);
};

/**
 * Calculate relevance score for a place based on mood
 * @param {Object} place - Place object from API
 * @param {Object} moodMapping - Mood mapping object
 * @returns {number} - Relevance score (0-100)
 */
export const calculateRelevanceScore = (place, moodMapping) => {
    let score = 50; // Base score

    // Type match bonus
    const placeTypes = place.types || [];
    const matchingTypes = placeTypes.filter(type =>
        moodMapping.types.includes(type)
    );
    score += matchingTypes.length * 15;

    // Price level match
    if (place.price_level !== undefined && moodMapping.preferredPrice) {
        if (moodMapping.preferredPrice.includes(place.price_level)) {
            score += 10;
        }
    }

    // Rating bonus (if mood prioritizes rating)
    if (moodMapping.prioritizeRating && place.rating) {
        score += (place.rating / 5) * 20;
    }

    // User ratings count bonus (popularity indicator)
    if (place.user_ratings_total) {
        const popularityBonus = Math.min(place.user_ratings_total / 100, 10);
        score += popularityBonus;
    }

    // Open now bonus
    if (place.opening_hours?.open_now) {
        score += 5;
    }

    // Cap score at 100
    return Math.min(Math.round(score), 100);
};

export default moodMappings;
