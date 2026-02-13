import { INSIGHTS_DATA } from '../data/insightsData';

const STORAGE_KEY = 'seen_insights_ids';
const MAX_HISTORY = 50;

/**
 * Shuffle array using Fisher-Yates
 */
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

/**
 * Get Personalized Feed
 */
export const getFeed = (user, logs, mode = 'personalized', page = 1, limit = 10) => {
    const seenIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const currentHour = new Date().getHours();

    let pool = [...INSIGHTS_DATA];

    // Mode Filtering
    if (mode === 'saved') {
        // Handled by UI mainly, but if we moved logic here:
        // return filtered by bookmarks
        return { data: [], hasMore: false }; // Placeholder as bookmarks are in userStore
    }

    if (mode === 'personalized') {
        // 1. Filter by Context (Time, Activity, etc.)
        const contextMatches = pool.filter(item => {
            if (!item.tags) return true;
            if (item.tags.timeOfDay) {
                if (currentHour < 11 && item.tags.timeOfDay.includes('morning')) return true;
                if (currentHour >= 11 && currentHour < 17 && item.tags.timeOfDay.includes('afternoon')) return true;
                if (currentHour >= 17 && item.tags.timeOfDay.includes('evening')) return true;
                if (currentHour >= 20 && item.tags.timeOfDay.includes('night')) return true;
                return false; // Wrong time of day
            }
            return true;
        });

        // 2. Prioritize unseen
        const unseen = contextMatches.filter(i => !seenIds.includes(i.id));
        const seen = contextMatches.filter(i => seenIds.includes(i.id));

        pool = [...shuffle(unseen), ...shuffle(seen)];
    } else {
        // General / Discover Mode: Pure Shuffle
        pool = shuffle(pool);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = pool.slice(startIndex, endIndex);

    // Mark as seen (side effect)
    markAsSeen(items.map(i => i.id));

    return {
        data: items,
        hasMore: endIndex < pool.length,
        total: pool.length
    };
};

/**
 * Mark IDs as seen in localStorage
 */
const markAsSeen = (ids) => {
    let seenIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newIds = ids.filter(id => !seenIds.includes(id));

    if (newIds.length > 0) {
        seenIds = [...seenIds, ...newIds];
        // Keep history limited
        if (seenIds.length > MAX_HISTORY) {
            seenIds = seenIds.slice(seenIds.length - MAX_HISTORY);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seenIds));
    }
};
