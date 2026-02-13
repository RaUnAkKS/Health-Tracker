import { FOOD_ITEMS } from './foodData';

// Synonyms mapping to our internal FOOD_ITEMS IDs
const KEYWORD_MAP = {
    // CHAI (Id: CHAI, Sugar: 12)
    'chai': 'CHAI',
    'tea': 'CHAI',
    'coffee': 'CHAI', // Assuming sugary coffee is similar for now
    'milk tea': 'CHAI',

    // SWEETS (Id: SWEETS, Sugar: 20)
    'sweet': 'SWEETS',
    'mithai': 'SWEETS',
    'dessert': 'SWEETS',
    'cake': 'SWEETS',
    'chocolate': 'SWEETS',
    'ladoo': 'SWEETS',
    'barfi': 'SWEETS',
    'gulab jamun': 'SWEETS',
    'ice cream': 'SWEETS',
    'cookie': 'SWEETS',
    'biscuit': 'SWEETS',

    // COLD_DRINK (Id: COLD_DRINK, Sugar: 35)
    'coke': 'COLD_DRINK',
    'pepsi': 'COLD_DRINK',
    'soda': 'COLD_DRINK',
    'cold drink': 'COLD_DRINK',
    'soft drink': 'COLD_DRINK',
    'juice': 'COLD_DRINK', // Fruit juices often high sugar
    'sprite': 'COLD_DRINK',
    'thums up': 'COLD_DRINK',

    // PACKAGED_SNACK (Id: PACKAGED_SNACK, Sugar: 15)
    'chips': 'PACKAGED_SNACK',
    'biscuits': 'PACKAGED_SNACK',
    'snack': 'PACKAGED_SNACK',
    'namkeen': 'PACKAGED_SNACK',
    'maggie': 'PACKAGED_SNACK',
    'noodles': 'PACKAGED_SNACK',
    'burger': 'PACKAGED_SNACK',
    'pizza': 'PACKAGED_SNACK',
};

// Word to number mapper
const WORD_TO_NUM = {
    'one': 1, 'a': 1, 'an': 1,
    'two': 2, 'to': 2, 'too': 2,
    'three': 3,
    'four': 4, 'for': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10
};

export const parseVoiceInput = (transcript) => {
    if (!transcript) return null;

    const lowerText = transcript.toLowerCase();

    // 1. Identify Food Type
    let detectedType = null;
    let detectedKeyword = null;

    for (const [keyword, type] of Object.entries(KEYWORD_MAP)) {
        if (lowerText.includes(keyword)) {
            // Pick longest match? Or first match.
            // "ice cream" vs "cream". "Length" sort might be better but simple iteration works for now.
            detectedType = type;
            detectedKeyword = keyword;
            break; // Stop at first match for now
        }
    }

    // Default to 'CUSTOM' if sugar mentioned but not specific food
    if (!detectedType && (lowerText.includes('sugar') || lowerText.includes('meetha'))) {
        detectedType = 'CUSTOM';
        detectedKeyword = 'Sugar';
    }

    if (!detectedType) return null;

    // 2. Identify Quantity / Multiplier
    let quantity = 1;

    // Look for numbers (digits or words) BEFORE the keyword usually, or anywhere.
    // Regex for "2 cups", "two spoons", etc.

    // Replace word numbers with digits for easier regex
    let processedText = lowerText;
    for (const [word, num] of Object.entries(WORD_TO_NUM)) {
        // Replace whole word matches only
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        processedText = processedText.replace(regex, num);
    }

    // Extract number
    const numberMatch = processedText.match(/(\d+)/);
    if (numberMatch) {
        quantity = parseInt(numberMatch[1], 10);
    }

    // 3. Calculate Sugar
    // Base amounts from constants or foodData
    // We can import presets, but let's define base values here or use what we have.
    // Dashboard.jsx uses SUGAR_PRESETS implicitly via `getFoodItem`.
    // Let's grab `getFoodItem` or hardcode base values for simplicity/speed here.

    // Base estimates (g)
    const BASE_SUGAR = {
        'CHAI': 12,        // 1 cup
        'SWEETS': 20,      // 1 piece
        'COLD_DRINK': 35,  // 1 can/glass
        'PACKAGED_SNACK': 15, // 1 packet
        'CUSTOM': 5       // 1 spoon default
    };

    // Spoon detector for custom sugar
    if (detectedType === 'CUSTOM' && (lowerText.includes('spoon') || lowerText.includes('chamach'))) {
        // 1 spoon ~ 5g
        // If detected 'CUSTOM' via 'sugar' keyword, base is 5g per spoon.
        // If they said "20 grams sugar", we should handle that.
    }

    // Specific gram detection: "20 grams", "15 g"
    const gramMatch = processedText.match(/(\d+)\s*(g|gram|grams)/);
    if (gramMatch) {
        return {
            type: detectedType,
            foodName: detectedKeyword,
            sugarAmount: parseInt(gramMatch[1], 10),
            confidence: 0.9,
            quantity: 1,
            originalTranscript: transcript
        };
    }

    let calculatedSugar = (BASE_SUGAR[detectedType] || 20) * quantity;

    // Capitalize keyword for display
    const displayFood = detectedKeyword.charAt(0).toUpperCase() + detectedKeyword.slice(1);

    return {
        type: detectedType,
        foodName: displayFood,
        sugarAmount: calculatedSugar,
        confidence: 0.8,
        quantity: quantity,
        originalTranscript: transcript
    };
};
