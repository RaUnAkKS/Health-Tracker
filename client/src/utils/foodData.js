export const FOOD_ITEMS = {
    CHAI: {
        id: 'CHAI',
        name: 'Chai',
        icon: '☕',
        defaultSugar: 10,
        category: 'liquid',
        description: 'Standard cup of generic chai'
    },
    SWEETS: {
        id: 'SWEETS',
        name: 'Sweets',
        icon: '🍰',
        defaultSugar: 20,
        category: 'dessert',
        description: 'A piece of mithai or cake'
    },
    COLD_DRINK: {
        id: 'COLD_DRINK',
        name: 'Cold Drink',
        icon: '🥤',
        defaultSugar: 35,
        category: 'soda',
        description: 'Can of soda or sugary juice'
    },
    PACKAGED_SNACK: {
        id: 'PACKAGED_SNACK',
        name: 'Packaged Snack',
        icon: '🍪',
        defaultSugar: 15,
        category: 'processed',
        description: 'Biscuits, chips, or chocolates'
    }
};

export const getFoodItem = (id) => FOOD_ITEMS[id] || null;
