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
        keywords: ['coworking', 'workspace', 'study cafe', 'wifi cafe', 'coffee shop work'],
        description: 'Places to work or study',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    study: {
        types: ['library', 'cafe'],
        keywords: ['study', 'quiet', 'library', 'reading room'],
        description: 'Quiet places to focus',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    meeting: {
        types: ['cafe', 'restaurant'],
        keywords: ['business', 'meeting', 'conference cafe', 'professional'],
        description: 'Places for business meetings',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },

    // Social & Dating
    date: {
        types: ['restaurant', 'bar', 'cafe'],
        keywords: ['romantic', 'dinner', 'lounge', 'cocktail', 'candlelit', 'intimate', 'wine bar', 'rooftop'],
        description: 'Romantic spots for dates',
        preferredPrice: [2, 3, 4],
        prioritizeRating: true
    },
    drinks: {
        types: ['bar', 'night_club', 'cafe'],
        keywords: ['pub', 'cocktail', 'wine bar', 'brewery', 'beer', 'happy hour', 'sports bar'],
        description: 'Places for drinks',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },
    nightlife: {
        types: ['night_club', 'bar'],
        keywords: ['club', 'dance', 'nightlife', 'dj', 'party', 'lounge'],
        description: 'Night entertainment venues',
        preferredPrice: [2, 3, 4],
        prioritizeRating: false
    },

    // Food & Dining
    'quick bite': {
        types: ['restaurant', 'meal_takeaway', 'bakery', 'cafe'],
        keywords: ['fast food', 'quick', 'takeaway', 'grab and go', 'snack', 'sandwich', 'burger', 'pizza'],
        description: 'Fast and convenient food',
        preferredPrice: [1, 2],
        prioritizeRating: false
    },
    breakfast: {
        types: ['cafe', 'bakery', 'restaurant'],
        keywords: ['breakfast', 'brunch', 'pancakes', 'eggs', 'morning', 'diner'],
        description: 'Morning meals',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    brunch: {
        types: ['restaurant', 'cafe'],
        keywords: ['brunch', 'breakfast', 'mimosa', 'sunday brunch', 'eggs benedict'],
        description: 'Brunch spots',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },
    lunch: {
        types: ['restaurant', 'cafe', 'meal_takeaway'],
        keywords: ['lunch', 'midday', 'lunch special', 'salad', 'soup'],
        description: 'Lunch options',
        preferredPrice: [1, 2, 3],
        prioritizeRating: true
    },
    dinner: {
        types: ['restaurant'],
        keywords: ['dinner', 'fine dining', 'evening', 'gourmet', 'steakhouse', 'seafood'],
        description: 'Dinner restaurants',
        preferredPrice: [2, 3, 4],
        prioritizeRating: true
    },
    coffee: {
        types: ['cafe'],
        keywords: ['coffee', 'espresso', 'latte', 'cappuccino', 'coffee shop', 'specialty coffee', 'barista'],
        description: 'Coffee shops',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    dessert: {
        types: ['bakery', 'cafe'],
        keywords: ['dessert', 'ice cream', 'cake', 'pastry', 'sweet', 'gelato', 'cupcake', 'chocolate'],
        description: 'Sweet treats',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },

    // Budget & Value
    budget: {
        types: ['restaurant', 'cafe', 'meal_takeaway'],
        keywords: ['cheap', 'affordable', 'budget', 'value', 'deals', 'happy hour', 'lunch special'],
        description: 'Budget-friendly options',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    fancy: {
        types: ['restaurant', 'bar'],
        keywords: ['upscale', 'fine dining', 'luxury', 'gourmet', 'michelin', 'elegant', 'exclusive'],
        description: 'Upscale experiences',
        preferredPrice: [3, 4],
        prioritizeRating: true
    },

    // Relaxation & Leisure
    chill: {
        types: ['cafe', 'park', 'bar'],
        keywords: ['relax', 'chill', 'cozy', 'lounge', 'quiet', 'peaceful', 'laid back'],
        description: 'Relaxed atmosphere',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    spa: {
        types: ['spa', 'beauty_salon'],
        keywords: ['massage', 'wellness', 'relaxation', 'facial', 'sauna', 'day spa'],
        description: 'Spa and wellness',
        preferredPrice: [2, 3, 4],
        prioritizeRating: true
    },

    // Family & Kids
    family: {
        types: ['restaurant', 'park', 'amusement_park', 'zoo', 'aquarium'],
        keywords: ['family friendly', 'kids', 'children', 'family restaurant', 'playground', 'kid menu'],
        description: 'Family-friendly places',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    kids: {
        types: ['park', 'amusement_park', 'zoo', 'aquarium'],
        keywords: ['playground', 'kids', 'family', 'children', 'play area', 'arcade'],
        description: 'Kid-friendly activities',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },

    // Outdoor & Nature
    outdoors: {
        types: ['park', 'campground', 'natural_feature'],
        keywords: ['outdoor', 'nature', 'hiking', 'trail', 'garden', 'scenic', 'walking path'],
        description: 'Outdoor activities',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    nature: {
        types: ['park', 'campground'],
        keywords: ['nature', 'garden', 'botanical', 'wildlife', 'scenic', 'green space'],
        description: 'Natural spaces',
        preferredPrice: [0, 1],
        prioritizeRating: false
    },
    picnic: {
        types: ['park'],
        keywords: ['picnic', 'garden', 'outdoor', 'lawn', 'green space', 'public park'],
        description: 'Picnic spots',
        preferredPrice: [0],
        prioritizeRating: false
    },

    // Health & Fitness
    fitness: {
        types: ['gym', 'park'],
        keywords: ['fitness', 'workout', 'exercise', 'training', 'crossfit', 'gym near me'],
        description: 'Fitness facilities',
        preferredPrice: [1, 2, 3],
        prioritizeRating: true
    },
    gym: {
        types: ['gym'],
        keywords: ['gym', 'fitness center', 'workout', 'health club', '24 hour gym'],
        description: 'Gyms and fitness centers',
        preferredPrice: [1, 2, 3],
        prioritizeRating: true
    },
    yoga: {
        types: ['gym', 'spa'],
        keywords: ['yoga', 'pilates', 'meditation', 'yoga studio', 'wellness'],
        description: 'Yoga and wellness studios',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },

    // Entertainment & Culture
    entertainment: {
        types: ['movie_theater', 'bowling_alley', 'amusement_park', 'casino'],
        keywords: ['entertainment', 'fun', 'games', 'arcade', 'bowling', 'escape room', 'karaoke'],
        description: 'Entertainment venues',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },
    movies: {
        types: ['movie_theater'],
        keywords: ['cinema', 'movie', 'film', 'theater', 'imax', 'movie theatre'],
        description: 'Movie theaters',
        preferredPrice: [2],
        prioritizeRating: true
    },
    culture: {
        types: ['museum', 'art_gallery', 'library'],
        keywords: ['museum', 'art', 'culture', 'history', 'exhibition', 'gallery'],
        description: 'Cultural attractions',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    art: {
        types: ['art_gallery', 'museum'],
        keywords: ['art', 'gallery', 'exhibition', 'contemporary art', 'art museum'],
        description: 'Art venues',
        preferredPrice: [1, 2],
        prioritizeRating: true
    },
    music: {
        types: ['bar', 'night_club'],
        keywords: ['live music', 'concert', 'jazz', 'music venue', 'live band', 'open mic'],
        description: 'Live music venues',
        preferredPrice: [2, 3],
        prioritizeRating: true
    },

    // Shopping
    shopping: {
        types: ['shopping_mall', 'department_store', 'clothing_store'],
        keywords: ['shopping', 'mall', 'retail', 'boutique', 'shopping center', 'stores'],
        description: 'Shopping destinations',
        preferredPrice: [1, 2, 3],
        prioritizeRating: false
    },
    groceries: {
        types: ['supermarket', 'grocery_or_supermarket'],
        keywords: ['grocery', 'supermarket', 'food store', 'organic', 'market'],
        description: 'Grocery stores',
        preferredPrice: [1, 2],
        prioritizeRating: false
    },

    // Services & Utilities
    gas: {
        types: ['gas_station'],
        keywords: ['gas', 'fuel', 'petrol', 'gas station', 'fuel station'],
        description: 'Gas stations',
        preferredPrice: [1],
        prioritizeRating: false
    },
    atm: {
        types: ['atm', 'bank'],
        keywords: ['atm', 'bank', 'cash', 'withdrawal'],
        description: 'ATMs and banks',
        preferredPrice: [0],
        prioritizeRating: false
    },
    pharmacy: {
        types: ['pharmacy', 'drugstore'],
        keywords: ['pharmacy', 'drugstore', 'medicine', 'prescription'],
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
    // Normalize: lowercase, trim, and convert hyphens to spaces
    const normalizedMood = mood.toLowerCase().trim().replace(/-/g, ' ');

    // Direct match
    if (moodMappings[normalizedMood]) {
        return moodMappings[normalizedMood];
    }

    // Try with hyphens converted to spaces in keys too
    const normalizedKeys = Object.keys(moodMappings).map(k => k.replace(/-/g, ' '));
    const directIndex = normalizedKeys.indexOf(normalizedMood);
    if (directIndex !== -1) {
        return Object.values(moodMappings)[directIndex];
    }

    // Partial match - find moods that contain the search term
    const partialMatch = Object.keys(moodMappings).find(key => {
        const normalizedKey = key.replace(/-/g, ' ');
        return normalizedKey.includes(normalizedMood) || normalizedMood.includes(normalizedKey);
    });

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
    let score = 40; // Base score

    // Type match bonus - higher weight for primary type match
    const placeTypes = place.types || [];
    const matchingTypes = placeTypes.filter(type =>
        moodMapping.types.includes(type)
    );
    
    // Primary type (first in moodMapping.types) gets extra bonus
    if (matchingTypes.length > 0) {
        const primaryType = moodMapping.types[0];
        if (placeTypes.includes(primaryType)) {
            score += 20; // Primary type match
        }
        score += matchingTypes.length * 10; // Additional type matches
    }

    // Price level match - better scoring
    if (place.price_level !== undefined && moodMapping.preferredPrice) {
        if (moodMapping.preferredPrice.includes(place.price_level)) {
            score += 12;
        } else {
            // Slight penalty for price mismatch if mood has price preference
            score -= 5;
        }
    }

    // Rating bonus - more nuanced scoring
    if (place.rating) {
        if (moodMapping.prioritizeRating) {
            // Higher weight for moods that prioritize rating
            if (place.rating >= 4.5) score += 20;
            else if (place.rating >= 4.0) score += 15;
            else if (place.rating >= 3.5) score += 10;
            else score += 5;
        } else {
            // Still give some weight to rating
            score += (place.rating / 5) * 10;
        }
    }

    // User ratings count bonus (popularity/trust indicator)
    if (place.user_ratings_total) {
        if (place.user_ratings_total >= 500) score += 12;
        else if (place.user_ratings_total >= 100) score += 8;
        else if (place.user_ratings_total >= 50) score += 5;
        else score += 2;
    }

    // Open now bonus - more significant
    if (place.opening_hours?.open_now) {
        score += 8;
    }

    // Distance penalty for far places (if distance is available)
    if (place.distance) {
        if (place.distance > 3000) score -= 5; // More than 3km
        else if (place.distance < 500) score += 5; // Very close bonus
    }

    // Ensure score is within bounds
    return Math.max(0, Math.min(Math.round(score), 100));
};

export default moodMappings;
