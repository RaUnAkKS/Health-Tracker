import { Moon, Zap, Activity, Heart, Droplets, Flame, Brain } from 'lucide-react';

export const insights = [
    // Sleep Category
    {
        id: 'sleep-1',
        title: 'Evening Sugar & Sleep Rhythm',
        summary: 'Sugar consumed late in the day can affect sleep stability.',
        content: 'When sugar enters your system at night, your body stays active longer to process the glucose spike. This may delay the release of melatonin, your natural sleep hormone, leading to restless sleep or difficulty falling asleep. Try to avoid high-sugar foods 3 hours before bed.',
        category: 'Sleep',
        icon: Moon,
        color: 'from-indigo-500 to-purple-600',
        tags: ['evening', 'recovery'],
        trigger: (user, logs, time) => time >= 18 // Evening trigger
    },
    {
        id: 'sleep-2',
        title: 'Better Rest, Better Control',
        summary: 'Quality sleep helps regulate sugar cravings the next day.',
        content: 'Sleep deprivation increases ghrelin (hunger hormone) and decreases leptin (fullness hormone). This imbalance often leads to intense sugar cravings the following day as your brain seeks quick energy. Prioritize 7-8 hours of sleep to naturally curb cravings.',
        category: 'Sleep',
        icon: Moon,
        color: 'from-indigo-500 to-purple-600',
        tags: ['morning', 'general'],
        trigger: () => true
    },

    // Energy Category
    {
        id: 'energy-1',
        title: 'The Sugar Crash Cycle',
        summary: 'Why you feel tired 2 hours after a sweet treat.',
        content: 'High-sugar foods cause a rapid spike in blood glucose, followed by a sharp drop as insulin rushes in. This "crash" leaves you feeling tired, irritable, and craving more sugar. Pair sweets with protein or fiber to smooth out the curve.',
        category: 'Energy',
        icon: Zap,
        color: 'from-yellow-400 to-orange-500',
        tags: ['high_sugar', 'afternoon'],
        trigger: (user, logs) => logs.some(l => l.sugarAmount > 30) // Trigger if recent high sugar
    },
    {
        id: 'energy-2',
        title: 'Hydration Reduces Crashes',
        summary: 'Water helps regulate energy dips after sugar intake.',
        content: 'Dehydration can mimic hunger and worsen the fatigue from a sugar crash. Drinking a glass of water before and after a treat helps your body process glucose more efficiently and maintains alert levels.',
        category: 'Hydration',
        icon: Droplets,
        color: 'from-blue-400 to-cyan-500',
        tags: ['general', 'hydration'],
        trigger: () => true
    },

    // Activity Category
    {
        id: 'activity-1',
        title: 'Movement & Metabolism',
        summary: 'Active days help your body process sugar more efficiently.',
        content: 'Muscles act as a "glucose sink," soaking up excess sugar from your bloodstream for energy. Even a 10-minute walk after a meal can significantly reduce the blood sugar spike compared to sitting still.',
        category: 'Activity',
        icon: Activity,
        color: 'from-green-400 to-emerald-600',
        tags: ['low_activity', 'general'],
        trigger: () => true
    },
    {
        id: 'activity-2',
        title: 'Fueling Your Workout',
        summary: 'Timing your carbs can boost performance.',
        content: 'Unlike sedentary times, consuming natural sugars (like fruit) 30-60 minutes before a workout gives your muscles readily available fuel. This is the one time a "spike" is actually useful!',
        category: 'Activity',
        icon: Flame,
        color: 'from-orange-500 to-red-600',
        tags: ['active', 'morning'],
        trigger: () => true
    },

    // Smart Swaps
    {
        id: 'swap-1',
        title: 'Dark Chocolate Benefits',
        summary: 'Why swapping milk for dark chocolate matters.',
        content: 'Dark chocolate (70%+) contains less sugar and more fiber/antioxidants than milk chocolate. The bitterness also naturally limits how much you eat, making it a satisfying but self-limiting treat.',
        category: 'Smart Swaps',
        icon: Heart,
        color: 'from-pink-500 to-rose-600',
        tags: ['general', 'tips'],
        trigger: () => true
    },
    {
        id: 'swap-2',
        title: 'Fiber is Your Friend',
        summary: 'Fiber slows down sugar absorption.',
        content: 'Eating a whole orange is better than drinking orange juice because the fiber mesh slows down digestion. This prevents the rapid sugar spike that comes from liquid calories.',
        category: 'Smart Swaps',
        icon: Brain,
        color: 'from-teal-400 to-emerald-500',
        tags: ['general', 'tips'],
        trigger: () => true
    }
];
