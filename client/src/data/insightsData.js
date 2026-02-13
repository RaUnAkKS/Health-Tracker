import { Moon, Zap, Activity, Heart, Droplets, Flame, Brain, Coffee, Sun, Smile, Clock, Shield } from 'lucide-react';

export const INSIGHTS_DATA = [
    // --- SLEEP (20 items) ---
    {
        id: "sleep_001",
        category: "Sleep",
        title: "Sleep Stabilizes Cravings",
        summary: "Short sleep increases sugar cravings the next day.",
        content: "When sleep is reduced, hunger hormones shift. Ghrelin (hunger) spikes and leptin (fullness) drops, making high-sugar foods harder to resist.",
        icon: Moon,
        color: "from-indigo-500 to-purple-600",
        tags: { timeOfDay: ["evening", "morning"], general: true }
    },
    {
        id: "sleep_002",
        category: "Sleep",
        title: "Late Night Sugar Trap",
        summary: "Sugar before bed reduces deep sleep quality.",
        content: "High blood sugar at night can increase body temperature and restlessness, reducing the amount of restorative REM sleep you get.",
        icon: Moon,
        color: "from-indigo-500 to-purple-600",
        tags: { timeOfDay: ["evening"], general: true }
    },
    {
        id: "sleep_003",
        category: "Sleep",
        title: "Tired Brains Want Sugar",
        summary: "Fatigue makes the brain seek quick energy.",
        content: "A tired brain has lower executive function (willpower) and instinctively craves the fastest fuel source available: simple sugars.",
        icon: Brain,
        color: "from-indigo-500 to-purple-600",
        tags: { timeOfDay: ["afternoon", "evening"], general: true }
    },
    {
        id: "sleep_004",
        category: "Sleep",
        title: "The Nap Alternative",
        summary: "Try a 20-min nap instead of a sugar fix.",
        content: "If you're crashing in the afternoon, a short power nap is more effective for energy than a sugary snack, which leads to another crash.",
        icon: Moon,
        color: "from-indigo-500 to-purple-600",
        tags: { timeOfDay: ["afternoon"], general: true }
    },
    {
        id: "sleep_005",
        category: "Sleep",
        title: "Melatonin Disruption",
        summary: "Insulin spikes can delay sleep onset.",
        content: "Eating sweets late at night can interfere with melatonin production, confusing your circadian rhythm.",
        icon: Moon,
        color: "from-indigo-500 to-purple-600",
        tags: { timeOfDay: ["night"], general: true }
    },
    {
        id: "sleep_006",
        category: "Sleep",
        title: "Morning Cortisol",
        summary: "Bad sleep boosts stress hormones.",
        content: "Waking up tired often means elevated cortisol, which triggers the liver to release glucose, increasing blood sugar before you even eat.",
        icon: Sun,
        color: "from-indigo-500 to-purple-600",
        tags: { timeOfDay: ["morning"], general: true }
    },
    {
        id: "sleep_007",
        category: "Sleep",
        title: "Magnesium for Rest",
        summary: "Magnesium aids sleep and blood sugar.",
        content: "Foods high in magnesium (spinach, almonds) support better sleep and insulin sensitivity, unlike sugary evening snacks.",
        icon: Moon,
        color: "from-indigo-500 to-purple-600",
        tags: { general: true }
    },
    {
        id: "sleep_008",
        category: "Sleep",
        title: "Screens & Snacks",
        summary: "Blue light + Sugar is a double negative.",
        content: "Late-night scrolling while snacking triggers both dopamine (from content) and insulin (from sugar), keeping you wide awake.",
        icon: Zap,
        color: "from-indigo-500 to-purple-600",
        tags: { timeOfDay: ["night", "evening"], general: true }
    },
    {
        id: "sleep_009",
        category: "Sleep",
        title: "Recovery Mode",
        summary: "Deep sleep cleans the brain.",
        content: "During deep sleep, the glymphatic system cleans out toxins. High sugar intake can reduce the time spent in this critical recovery phase.",
        icon: Moon,
        color: "from-indigo-500 to-purple-600",
        tags: { general: true }
    },
    {
        id: "sleep_010",
        category: "Sleep",
        title: "Consistency is Key",
        summary: "Regular sleep times regulate metabolism.",
        content: "Going to bed at the same time helps stabilize your metabolic clock, making daily sugar processing more efficient.",
        icon: Clock,
        color: "from-indigo-500 to-purple-600",
        tags: { general: true }
    },

    // --- HYDRATION (15 items) ---
    {
        id: "hydro_001",
        category: "Hydration",
        title: "False Hunger",
        summary: "Thirst often masquerades as a sugar craving.",
        content: "The brain signals for thirst and hunger are weak and easily confused. Drink a large glass of water before deciding if you need that sweet treat.",
        icon: Droplets,
        color: "from-blue-400 to-cyan-500",
        tags: { general: true }
    },
    {
        id: "hydro_002",
        category: "Hydration",
        title: "Dilution Solution",
        summary: "Water helps kidneys flush excess sugar.",
        content: "When blood sugar is high, your kidneys work overtime to filter it. Staying hydrated helps them do this job efficiently.",
        icon: Droplets,
        color: "from-blue-400 to-cyan-500",
        tags: { general: true }
    },
    {
        id: "hydro_003",
        category: "Hydration",
        title: "Morning Kickstart",
        summary: "Hydrate before you caffeinate.",
        content: "Start the day with water to rehydrate the brain. It reduces the morning 'fog' that might tempt you to grab a sugary pastry.",
        icon: Sun,
        color: "from-blue-400 to-cyan-500",
        tags: { timeOfDay: ["morning"], general: true }
    },
    {
        id: "hydro_004",
        category: "Hydration",
        title: "The Soda Swap",
        summary: "Sparkling water tricks the brain.",
        content: "Craving the fizz of a soda? Sparkling water with a lime twist gives the sensory satisfaction without the glucose spike.",
        icon: Droplets,
        color: "from-blue-400 to-cyan-500",
        tags: { general: true }
    },
    {
        id: "hydro_005",
        category: "Hydration",
        title: "Metabolic Boost",
        summary: "Cold water creates a small calorie burn.",
        content: "Drinking cold water forces your body to expend energy to warm it, slightly boosting metabolism without any insulin response.",
        icon: Flame,
        color: "from-blue-400 to-cyan-500",
        tags: { general: true }
    },

    // --- ENERGY (15 items) ---
    {
        id: "energy_001",
        category: "Energy",
        title: "The Rollercoaster",
        summary: "Peaks always lead to valleys.",
        content: "The burst of energy from sugar lasts 30-60 minutes. The crash that follows can last for hours. Plan your fuel wisely.",
        icon: Zap,
        color: "from-yellow-400 to-orange-500",
        tags: { timeOfDay: ["afternoon"], general: true }
    },
    {
        id: "energy_002",
        category: "Energy",
        title: "Stable Fuel",
        summary: "Fats burn slower than sugar.",
        content: "Healthy fats (avocado, nuts) provide sustained energy for 3-4 hours, unlike the 45-minute burst from a cookie.",
        icon: Zap,
        color: "from-yellow-400 to-orange-500",
        tags: { general: true }
    },
    {
        id: "energy_003",
        category: "Energy",
        title: "Brain Fog Fix",
        summary: "Sugar doesn't clear the fog.",
        content: "Actually, high blood sugar can increase brain inflammation, worsening that groggy feeling. A short walk clears fog better.",
        icon: Brain,
        color: "from-yellow-400 to-orange-500",
        tags: { timeOfDay: ["afternoon"], general: true }
    },
    {
        id: "energy_004",
        category: "Energy",
        title: "The 3 PM Slump",
        summary: "It's natural, not a sugar signal.",
        content: "Circadian rhythms dip in the afternoon. It's a biological signal for rest or a light stretch, not necessarily for a donut.",
        icon: Clock,
        color: "from-yellow-400 to-orange-500",
        tags: { timeOfDay: ["afternoon"], general: true }
    },

    // --- ACTIVITY (15 items) ---
    {
        id: "active_001",
        category: "Activity",
        title: "The 10-Minute Walk",
        summary: "Flatten the curve instantly.",
        content: "Walking for just 10 minutes after a sweet treat can reduce the blood sugar spike by up to 20-30%.",
        icon: Activity,
        color: "from-green-400 to-emerald-600",
        tags: { general: true }
    },
    {
        id: "active_002",
        category: "Activity",
        title: "Muscle Sponges",
        summary: "Muscles love glucose.",
        content: "During exercise, muscles absorb glucose directly from the blood without needing as much insulin. It's the perfect disposal unit.",
        icon: Activity,
        color: "from-green-400 to-emerald-600",
        tags: { tags: ["active"], general: true }
    },
    {
        id: "active_003",
        category: "Activity",
        title: "Pre-Workout Carbs",
        summary: "Timing is everything.",
        content: "If you must have sugar (like fruit), having it 30 mins before a workout turns it into rocket fuel rather than fat storage.",
        icon: Flame,
        color: "from-green-400 to-emerald-600",
        tags: { tags: ["active"], general: true }
    },
    {
        id: "active_004",
        category: "Activity",
        title: "Standing Desk",
        summary: "Small movements add up.",
        content: "Standing after eating engages large leg muscles, helping to stabilize blood sugar levels compared to sitting.",
        icon: Activity,
        color: "from-green-400 to-emerald-600",
        tags: { general: true }
    },

    // --- PSYCHOLOGY & HABIT (20 items) ---
    {
        id: "psych_001",
        category: "Psychology",
        title: "Dopamine Hits",
        summary: "Sugar lights up the reward center.",
        content: "Sugar triggers the same brain pathways as addictive substances. Recognizing this 'high' helps you detach from the craving.",
        icon: Brain,
        color: "from-pink-500 to-rose-600",
        tags: { general: true }
    },
    {
        id: "psych_002",
        category: "Psychology",
        title: "Stress Eating",
        summary: "Cortisol creates cravings.",
        content: "Stress releases cortisol, which tells your body to refuel fast. Taking 5 deep breaths can lower cortisol and kill the craving.",
        icon: Smile,
        color: "from-pink-500 to-rose-600",
        tags: { general: true }
    },
    {
        id: "psych_003",
        category: "Psychology",
        title: "The 'Just One' Myth",
        summary: "Sugar opens the floodgates.",
        content: "For many, one cookie triggers a desire for ten. It's often easier to have none than to have just one.",
        icon: Shield,
        color: "from-pink-500 to-rose-600",
        tags: { general: true }
    },
    {
        id: "psych_004",
        category: "Psychology",
        title: "Visual Cues",
        summary: "Out of sight, out of mind.",
        content: "Moving treats to an opaque jar or inside a cupboard reduces visual cues that trigger unconscious cravings.",
        icon: Brain,
        color: "from-pink-500 to-rose-600",
        tags: { general: true }
    },
    {
        id: "psych_005",
        category: "Habit",
        title: "Environment Design",
        summary: "Design your win.",
        content: "If you don't buy it, you can't eat it. The most effective willpower is exercised at the grocery store, not the kitchen.",
        icon: Shield,
        color: "from-pink-500 to-rose-600",
        tags: { general: true }
    },

    // --- METABOLISM & NUTRITION (20 items) ---
    {
        id: "meta_001",
        category: "Metabolism",
        title: "Protein Anchor",
        summary: "Protein slows sugar absorption.",
        content: "Eating protein with sugar (e.g., yogurt with fruit) slows digestion, preventing the sharp insulin spike.",
        icon: Flame,
        color: "from-orange-500 to-red-500",
        tags: { general: true }
    },
    {
        id: "meta_002",
        category: "Metabolism",
        title: "Fiber Mesh",
        summary: "Fiber creates a sugar filter.",
        content: "Soluble fiber forms a gel in the gut, slowing down how fast sugar hits your bloodstream.",
        icon: Shield,
        color: "from-orange-500 to-red-500",
        tags: { general: true }
    },
    {
        id: "meta_003",
        category: "Metabolism",
        title: "Vinegar Hack",
        summary: "Acid slows gastric emptying.",
        content: "A tablespoon of vinegar in water before a high-carb meal can improve insulin sensitivity by 20-30%.",
        icon: Droplets,
        color: "from-orange-500 to-red-500",
        tags: { general: true }
    },
    {
        id: "meta_004",
        category: "Metabolism",
        title: "Cinnamon Spice",
        summary: "Flavor that fights sugar.",
        content: "Ceylon cinnamon has been shown to mimic insulin and help move sugar into cells more efficiently.",
        icon: Heart,
        color: "from-orange-500 to-red-500",
        tags: { general: true }
    },

    // --- RANDOM / FUN FACTS (10 items) ---
    {
        id: "fact_001",
        category: "Fact",
        title: "Hidden Names",
        summary: "Sugar has 60+ aliases.",
        content: "Dextrose, maltose, barley malt, agave nectar... strict labeling laws mean companies hide sugar under many names.",
        icon: Brain,
        color: "from-gray-500 to-slate-600",
        tags: { general: true }
    },
    {
        id: "fact_002",
        category: "Fact",
        title: "Taste Bud Turnover",
        summary: "Your palate changes fast.",
        content: "Taste buds regenerate every 10-14 days. If you cut sugar for 2 weeks, natural sweetness (items like strawberries) will taste explosive.",
        icon: Smile,
        color: "from-gray-500 to-slate-600",
        tags: { general: true }
    },
];
