const vision = require('@google-cloud/vision');

// Initialize Google Cloud Vision client
let visionClient = null;

const initializeVisionClient = () => {
    if (visionClient) return visionClient;

    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

    if (!apiKey) {
        console.warn('Google Cloud Vision API key not configured');
        return null;
    }

    visionClient = new vision.ImageAnnotatorClient({
        keyFilename: undefined, // We'll use API key instead
        apiKey: apiKey,
    });

    return visionClient;
};

/**
 * Analyze food photo and estimate sugar content
 * @param {Buffer} imageBuffer - Image buffer from multer
 * @returns {Promise<Object>} Food detection results
 */
const detectFood = async (imageBuffer) => {
    try {
        const client = initializeVisionClient();

        if (!client) {
            throw new Error('Google Cloud Vision not configured');
        }

        // Perform label detection and web detection
        const [labelResult] = await client.labelDetection({
            image: { content: imageBuffer },
        });

        const [webResult] = await client.webDetection({
            image: { content: imageBuffer },
        });

        // Extract labels
        const labels = labelResult.labelAnnotations || [];
        const webEntities = webResult.webDetection?.webEntities || [];

        // Check if image contains food
        const foodLabels = labels.filter(label =>
            ['food', 'dish', 'cuisine', 'snack', 'dessert', 'drink', 'beverage', 'ingredient']
                .some(keyword => label.description.toLowerCase().includes(keyword))
        );

        if (foodLabels.length === 0) {
            return {
                isFood: false,
                confidence: 0,
                message: 'No food detected in image',
            };
        }

        // Identify specific food items
        const foodItems = [];

        // From web entities (best for specific food identification)
        webEntities.forEach(entity => {
            if (entity.score > 0.5) {
                foodItems.push({
                    name: entity.description,
                    confidence: entity.score,
                });
            }
        });

        // From labels
        labels.forEach(label => {
            if (label.score > 0.7 && !foodItems.some(item =>
                item.name.toLowerCase() === label.description.toLowerCase()
            )) {
                foodItems.push({
                    name: label.description,
                    confidence: label.score,
                });
            }
        });

        // Estimate sugar content based on detected items
        const sugarEstimate = estimateSugarContent(foodItems, labels);

        return {
            isFood: true,
            foodItems: foodItems.slice(0, 3), // Top 3 items
            labels: labels.slice(0, 5).map(l => l.description),
            sugarEstimate: sugarEstimate.amount,
            confidence: sugarEstimate.confidence,
            reasoning: sugarEstimate.reasoning,
        };

    } catch (error) {
        console.error('Food detection error:', error);
        throw new Error(`Food detection failed: ${error.message}`);
    }
};

/**
 * Estimate sugar content based on detected food items
 */
const estimateSugarContent = (foodItems, labels) => {
    // Sugar content database (grams per typical serving)
    const sugarDatabase = {
        // Beverages
        'soda': 39, 'cola': 39, 'soft drink': 39, 'pop': 39,
        'juice': 24, 'orange juice': 21, 'apple juice': 24,
        'sports drink': 21, 'energy drink': 27,
        'milk': 12, 'chocolate milk': 25,
        'tea': 0, 'sweet tea': 32, 'iced tea': 25,
        'coffee': 0, 'latte': 14, 'mocha': 25,

        // Sweets & Desserts
        'candy': 25, 'chocolate': 24, 'chocolate bar': 24,
        'cookie': 10, 'cookies': 10, 'biscuit': 8,
        'cake': 30, 'cupcake': 25, 'pastry': 20,
        'ice cream': 21, 'frozen yogurt': 17,
        'donut': 12, 'doughnut': 12,
        'brownie': 25, 'muffin': 17,

        // Packaged Snacks
        'chips': 2, 'crackers': 2, 'pretzels': 1,
        'granola bar': 8, 'protein bar': 12,
        'cereal': 12, 'breakfast cereal': 12,

        // Fruits (natural sugars)
        'banana': 14, 'apple': 19, 'orange': 12,
        'grapes': 15, 'watermelon': 6, 'mango': 23,
        'strawberry': 7, 'berries': 7,

        // Condiments  
        'ketchup': 4, 'jam': 10, 'jelly': 10,
        'honey': 17, 'syrup': 12, 'maple syrup': 12,
    };

    let totalSugar = 0;
    let confidence = 0.5; // Default moderate confidence
    let matchedItems = [];

    // Check each detected food item against database
    foodItems.forEach(item => {
        const itemName = item.name.toLowerCase();

        for (const [food, sugar] of Object.entries(sugarDatabase)) {
            if (itemName.includes(food) || food.includes(itemName)) {
                totalSugar += sugar;
                matchedItems.push({ food, sugar });
                confidence = Math.max(confidence, item.confidence * 0.8); // Boost confidence
                break;
            }
        }
    });

    // Check labels for additional context
    labels.forEach(label => {
        const labelText = label.description.toLowerCase();

        // High sugar indicators
        if (['sweet', 'sugary', 'dessert', 'candy'].some(word => labelText.includes(word))) {
            if (totalSugar === 0) totalSugar = 20; // Default estimate
            confidence = Math.max(confidence, 0.6);
        }
    });

    // If no specific match, provide conservative estimate
    if (totalSugar === 0) {
        const hasSweet = labels.some(l =>
            ['dessert', 'sweet', 'candy', 'snack'].includes(l.description.toLowerCase())
        );

        if (hasSweet) {
            totalSugar = 15; // Conservative estimate
            confidence = 0.4; // Low confidence
        } else {
            totalSugar = 5; // Very conservative
            confidence = 0.3;
        }
    }

    // Build reasoning
    let reasoning = matchedItems.length > 0
        ? `Detected: ${matchedItems.map(m => m.food).join(', ')}`
        : 'Estimated based on food category';

    return {
        amount: Math.round(totalSugar),
        confidence: Math.min(confidence, 1),
        reasoning,
    };
};

module.exports = {
    detectFood,
};
