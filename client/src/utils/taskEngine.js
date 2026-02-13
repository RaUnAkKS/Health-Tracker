import { TASKS_DATA, DEFAULT_TASK } from '../data/tasksData';

const STORAGE_KEY_RECENT_TASKS = 'sugar_app_recent_tasks';
const HISTORY_LIMIT = 10;

/**
 * Selects the best task based on user context
 * @param {Object} context - { sugarAmount, timeOfDay, currentStreak, healthContext } 
 * @returns {Object} Selected Task
 */
export const selectCorrectiveTask = (context = {}) => {
    const {
        sugarAmount = 0,
        currentStreak = 0,
        timeOfDay = 'afternoon'  // morning, afternoon, evening, night
    } = context;

    // 1. Determine Sugar Level Tag
    let sugarLevel = 'low';
    if (sugarAmount > 40) sugarLevel = 'high';
    else if (sugarAmount > 15) sugarLevel = 'medium';

    // 2. Determine Allowed Difficulty (Streak Progression)
    // Streak < 3: Easy only
    // Streak 3-7: Easy, Medium
    // Streak > 7: Easy, Medium, Hard
    const allowedDifficulty = ['easy'];
    if (currentStreak >= 3) allowedDifficulty.push('medium');
    if (currentStreak >= 7) allowedDifficulty.push('hard');

    // 3. Get Recent History
    let recentIds = [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY_RECENT_TASKS);
        if (stored) recentIds = JSON.parse(stored);
    } catch (e) {
        console.error('Failed to read recent tasks', e);
    }

    // 4. Filter Candidates
    let candidates = TASKS_DATA.filter(task => {
        // Exclude recent
        if (recentIds.includes(task.id)) return false;

        // Check Difficulty
        if (!allowedDifficulty.includes(task.tags.difficulty)) return false;

        // Check Sugar Level Match (loosely)
        // If task specifies sugarLevel, we favor matches, but don't strictly exclude if pool is small
        // For now, let's just default to include all if tags match OR if task has 'any'
        const taskSugar = task.tags.sugarLevel || [];
        const taskTime = task.tags.timeOfDay || [];

        const sugarMatch = taskSugar.includes('any') || taskSugar.includes(sugarLevel);
        const timeMatch = taskTime.includes('any') || taskTime.includes(timeOfDay);

        return sugarMatch && timeMatch;
    });

    // 5. Fallback if candidates are empty (too strict filtering)
    if (candidates.length === 0) {
        // Relax filtering: Ignore recent, keep context
        candidates = TASKS_DATA.filter(task => {
            const taskSugar = task.tags.sugarLevel || [];
            const taskTime = task.tags.timeOfDay || [];
            return (taskSugar.includes('any') || taskSugar.includes(sugarLevel)) &&
                (taskTime.includes('any') || taskTime.includes(timeOfDay));
        });
    }

    // Still empty? Just use all non-recent
    if (candidates.length === 0) {
        candidates = TASKS_DATA.filter(t => !recentIds.includes(t.id));
    }

    // Still empty? All tasks
    if (candidates.length === 0) {
        candidates = [...TASKS_DATA];
    }

    // 6. Bonus Chance (10%)
    // If not triggered, exclude 'bonus' category tasks unless they are the only ones left
    const roll = Math.random();
    const isBonus = roll < 0.1;

    let finalPool = candidates;
    if (isBonus) {
        const bonusTasks = TASKS_DATA.filter(t => t.category === 'bonus');
        if (bonusTasks.length > 0) finalPool = bonusTasks;
    } else {
        // Exclude bonus tasks from normal rotation to keep them special
        const nonBonus = candidates.filter(t => t.category !== 'bonus');
        if (nonBonus.length > 0) finalPool = nonBonus;
    }

    // 7. Random Select
    const selected = finalPool[Math.floor(Math.random() * finalPool.length)] || DEFAULT_TASK;

    return selected;
};


/**
 * Saves the task ID to history to avoid repetition
 * @param {string} taskId 
 */
export const markTaskAsSeen = (taskId) => {
    if (!taskId) return;

    try {
        let recentIds = [];
        const stored = localStorage.getItem(STORAGE_KEY_RECENT_TASKS);
        if (stored) recentIds = JSON.parse(stored);

        // Add new ID to front
        recentIds = [taskId, ...recentIds.filter(id => id !== taskId)];

        // Trim to limit
        if (recentIds.length > HISTORY_LIMIT) {
            recentIds = recentIds.slice(0, HISTORY_LIMIT);
        }

        localStorage.setItem(STORAGE_KEY_RECENT_TASKS, JSON.stringify(recentIds));
    } catch (e) {
        console.error('Failed to save recent task', e);
    }
};
