import {
    Footprints, Droplets, Moon, Wind, Dumbbell, StretchHorizontal, Timer, Bike, Activity,
    Coffee, Music, BookOpen, Smile, Zap, Heart, Utensils, Award, Shield, CheckCircle2, CloudFog,
    Brain, Flame, Sun, BatteryCharging
} from 'lucide-react';

export const TASKS_DATA = [
    // --- MOVEMENT (Dynamic Glucose Disposal) ---
    {
        id: "move_walk_10",
        category: "movement",
        title: "10-Min Power Walk",
        description: "Brisk walking activates muscles to soak up glucose.",
        duration: "10 min",
        icon: Footprints,
        color: "from-green-500 to-emerald-600",
        tags: { difficulty: "easy", sugarLevel: ["medium", "high"], timeOfDay: ["morning", "afternoon", "evening"] }
    },
    {
        id: "move_stairs_2",
        category: "movement",
        title: "Stair Climb",
        description: "Climb stairs for 2 minutes non-stop.",
        duration: "2 min",
        icon: Activity,
        color: "from-red-500 to-orange-600",
        tags: { difficulty: "medium", sugarLevel: ["high"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "move_jacks_30",
        category: "movement",
        title: "30 Jumping Jacks",
        description: "Quick cardio burst to spike heart rate.",
        duration: "1 min",
        icon: Zap,
        color: "from-yellow-500 to-orange-600",
        tags: { difficulty: "easy", sugarLevel: ["medium"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "move_knees_60",
        category: "movement",
        title: "High Knees",
        description: "March in place with high knees for 60s.",
        duration: "1 min",
        icon: Activity,
        color: "from-orange-500 to-red-500",
        tags: { difficulty: "medium", sugarLevel: ["high"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "move_dance_3",
        category: "movement",
        title: "Dance Break",
        description: "Play your favorite upbeat song and move!",
        duration: "3 min",
        icon: Music,
        color: "from-purple-500 to-pink-500",
        tags: { difficulty: "easy", sugarLevel: ["low", "medium"], timeOfDay: ["any"] }
    },
    {
        id: "move_clean_5",
        category: "movement",
        title: "Tidy Up",
        description: "Clean or organize a room for 5 minutes.",
        duration: "5 min",
        icon: Shield,
        color: "from-cyan-500 to-blue-500",
        tags: { difficulty: "easy", activity: "low", timeOfDay: ["any"] }
    },
    {
        id: "move_stand_10",
        category: "movement",
        title: "Stand Up",
        description: "Stand while working or watching TV.",
        duration: "10 min",
        icon: Activity,
        color: "from-blue-400 to-indigo-500",
        tags: { difficulty: "easy", activity: "sedentary", timeOfDay: ["any"] }
    },
    {
        id: "move_stretch_full",
        category: "movement",
        title: "Full Body Shake",
        description: "Shake out your arms and legs for 30s.",
        duration: "1 min",
        icon: Activity,
        color: "from-yellow-400 to-orange-500",
        tags: { difficulty: "easy", sugarLevel: ["low"], timeOfDay: ["any"] }
    },
    {
        id: "move_shadow_box",
        category: "movement",
        title: "Shadow Boxing",
        description: "Throw punches in the air for 2 minutes.",
        duration: "2 min",
        icon: Zap,
        color: "from-red-600 to-orange-600",
        tags: { difficulty: "medium", sugarLevel: ["high"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "move_bicycle_legs",
        category: "movement",
        title: "Air Cycling",
        description: "Lie on back and cycle legs for 1 min.",
        duration: "1 min",
        icon: Bike,
        color: "from-blue-500 to-cyan-500",
        tags: { difficulty: "medium", sugarLevel: ["medium"], timeOfDay: ["evening", "night"] }
    },

    // --- STRENGTH (Muscle Uptake) ---
    {
        id: "str_squats_20",
        category: "strength",
        title: "20 Air Squats",
        description: "Activate large leg muscles.",
        duration: "2 min",
        icon: Dumbbell,
        color: "from-orange-500 to-red-600",
        tags: { difficulty: "medium", sugarLevel: ["high"], timeOfDay: ["any"] }
    },
    {
        id: "str_wall_60",
        category: "strength",
        title: "Wall Sit",
        description: "Hold a wall sit for 45-60 seconds.",
        duration: "1 min",
        icon: Activity,
        color: "from-indigo-500 to-purple-600",
        tags: { difficulty: "hard", sugarLevel: ["high"], timeOfDay: ["any"] }
    },
    {
        id: "str_plank_60",
        category: "strength",
        title: "1-Minute Plank",
        description: "Engage core to burn stability energy.",
        duration: "1 min",
        icon: Timer,
        color: "from-yellow-500 to-orange-600",
        tags: { difficulty: "medium", sugarLevel: ["medium"], timeOfDay: ["any"] }
    },
    {
        id: "str_lunges_10",
        category: "strength",
        title: "10 Lunges (Per Leg)",
        description: "Focus on form and balance.",
        duration: "2 min",
        icon: Dumbbell,
        color: "from-emerald-500 to-teal-600",
        tags: { difficulty: "medium", sugarLevel: ["medium"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "str_pushups_10",
        category: "strength",
        title: "10 Pushups",
        description: "Wall, knee, or full pushups.",
        duration: "1 min",
        icon: Dumbbell,
        color: "from-red-500 to-pink-600",
        tags: { difficulty: "medium", sugarLevel: ["medium"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "str_calf_raises",
        category: "strength",
        title: "30 Calf Raises",
        description: "Simple pump for the lower legs.",
        duration: "2 min",
        icon: Footprints,
        color: "from-blue-400 to-indigo-500",
        tags: { difficulty: "easy", sugarLevel: ["low", "medium"], timeOfDay: ["any"] }
    },
    {
        id: "str_glute_bridge",
        category: "strength",
        title: "15 Glute Bridges",
        description: "Activate posterior chain.",
        duration: "2 min",
        icon: Activity,
        color: "from-pink-500 to-rose-500",
        tags: { difficulty: "easy", sugarLevel: ["medium"], timeOfDay: ["evening"] }
    },

    // --- HYDRATION (Flush & Dilute) ---
    {
        id: "hydro_glass_large",
        category: "hydration",
        title: "Big Glass of Water",
        description: "Drink 300ml of water immediately.",
        duration: "1 min",
        icon: Droplets,
        color: "from-blue-500 to-cyan-500",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["any"] }
    },
    {
        id: "hydro_tea_green",
        category: "hydration",
        title: "Green Tea",
        description: "Warm green tea supports metabolism.",
        duration: "5 min",
        icon: Coffee,
        color: "from-green-500 to-lime-600",
        tags: { difficulty: "easy", sugarLevel: ["medium"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "hydro_acv",
        category: "hydration",
        title: "ACV Tonic",
        description: "Water + 1 tbsp Apple Cider Vinegar.",
        duration: "2 min",
        icon: Droplets,
        color: "from-amber-500 to-orange-500",
        tags: { difficulty: "medium", sugarLevel: ["high"], timeOfDay: ["before_meal"] }
    },
    {
        id: "hydro_lemon",
        category: "hydration",
        title: "Lemon Water",
        description: "Squeeze half a lemon into water.",
        duration: "2 min",
        icon: Droplets,
        color: "from-yellow-400 to-yellow-600",
        tags: { difficulty: "easy", sugarLevel: ["low"], timeOfDay: ["morning"] }
    },
    {
        id: "hydro_sparkling",
        category: "hydration",
        title: "Sparkling Water",
        description: "Satisfy the fizz craving without sugar.",
        duration: "2 min",
        icon: Droplets,
        color: "from-cyan-400 to-blue-500",
        tags: { difficulty: "easy", sugarLevel: ["low"], timeOfDay: ["any"] }
    },

    // --- RECOVERY (Stress & Cortisol) ---
    {
        id: "rec_breathe_box",
        category: "recovery",
        title: "Box Breathing",
        description: "In 4s, Hold 4s, Out 4s, Hold 4s.",
        duration: "3 min",
        icon: Wind,
        color: "from-indigo-400 to-violet-500",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["evening", "night", "stress"] }
    },
    {
        id: "rec_stretch_ham",
        category: "recovery",
        title: "Hamstring Stretch",
        description: "Touch your toes, hold for 30s.",
        duration: "2 min",
        icon: StretchHorizontal,
        color: "from-teal-400 to-emerald-500",
        tags: { difficulty: "easy", sugarLevel: ["low", "medium"], timeOfDay: ["any"] }
    },
    {
        id: "rec_stretch_neck",
        category: "recovery",
        title: "Neck Release",
        description: "Gently roll neck side to side.",
        duration: "1 min",
        icon: Smile,
        color: "from-sky-400 to-blue-500",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["work"] }
    },
    {
        id: "rec_legs_wall",
        category: "recovery",
        title: "Legs Up Wall",
        description: "Lie down, legs up against wall.",
        duration: "5 min",
        icon: Moon,
        color: "from-violet-500 to-purple-600",
        tags: { difficulty: "easy", sugarLevel: ["medium"], timeOfDay: ["evening", "night"] }
    },
    {
        id: "rec_child_pose",
        category: "recovery",
        title: "Child's Pose",
        description: "Yoga pose for relaxation.",
        duration: "3 min",
        icon: Moon,
        color: "from-indigo-500 to-purple-500",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["evening", "night"] }
    },
    {
        id: "rec_nature_look",
        category: "recovery",
        title: "Nature Gaze",
        description: "Look at the sky or a plant for 2 mins.",
        duration: "2 min",
        icon: Sun,
        color: "from-green-400 to-blue-400",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["day"] }
    },

    // --- MINDSET (Craving Control) ---
    {
        id: "mind_read_page",
        category: "mindset",
        title: "Read 1 Page",
        description: "Distract your brain from cravings.",
        duration: "5 min",
        icon: BookOpen,
        color: "from-slate-500 to-gray-600",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["any"] }
    },
    {
        id: "mind_meditate_mini",
        category: "mindset",
        title: "Mini Meditation",
        description: "Close eyes, count 50 breaths.",
        duration: "5 min",
        icon: Brain,
        color: "from-violet-500 to-fuchsia-600",
        tags: { difficulty: "medium", sugarLevel: ["medium"], timeOfDay: ["any"] }
    },
    {
        id: "mind_journal",
        category: "mindset",
        title: "Write It Down",
        description: "Write down why you want sugar.",
        duration: "3 min",
        icon: BookOpen,
        color: "from-orange-400 to-amber-500",
        tags: { difficulty: "easy", sugarLevel: ["high"], timeOfDay: ["any"] }
    },
    {
        id: "mind_call_friend",
        category: "mindset",
        title: "Text a Friend",
        description: "Say hi to someone instead of eating.",
        duration: "2 min",
        icon: Smile,
        color: "from-pink-500 to-rose-500",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["any"] }
    },
    {
        id: "mind_plan_morrow",
        category: "mindset",
        title: "Plan Tomorrow",
        description: "List 3 goals for tomorrow.",
        duration: "3 min",
        icon: CheckCircle2,
        color: "from-blue-500 to-indigo-600",
        tags: { difficulty: "easy", sugarLevel: ["any"], timeOfDay: ["evening"] }
    },
    {
        id: "mind_brush_teeth",
        category: "mindset",
        title: "Brush Teeth",
        description: "Minty flavor signals 'eating done'.",
        duration: "2 min",
        icon: Shield,
        color: "from-cyan-500 to-teal-500",
        tags: { difficulty: "easy", sugarLevel: ["high"], timeOfDay: ["evening", "night"] }
    },

    // --- SWAP (Dietary) ---
    {
        id: "swap_veggie",
        category: "swap",
        title: "Eat a Veggie",
        description: "Fiber (carrot/cucumber) slows sugar.",
        duration: "5 min",
        icon: Utensils,
        color: "from-green-500 to-lime-600",
        tags: { difficulty: "easy", sugarLevel: ["high"], timeOfDay: ["meal"] }
    },
    {
        id: "swap_nuts",
        category: "swap",
        title: "Handful of Nuts",
        description: "Healthy fats stabilize energy.",
        duration: "1 min",
        icon: Utensils,
        color: "from-amber-600 to-orange-700",
        tags: { difficulty: "easy", sugarLevel: ["medium"], timeOfDay: ["snack"] }
    },
    {
        id: "swap_gum",
        category: "swap",
        title: "Chew Gum",
        description: "Sugar-free gum keeps mouth busy.",
        duration: "10 min",
        icon: Smile,
        color: "from-pink-400 to-rose-400",
        tags: { difficulty: "easy", sugarLevel: ["low"], timeOfDay: ["any"] }
    },

    // --- BONUS / STREAK (High Effort) ---
    {
        id: "bonus_run_15",
        category: "bonus",
        title: "15-Min Jog",
        description: "Serious glucose burning session.",
        duration: "15 min",
        icon: Footprints,
        color: "from-red-500 to-orange-500",
        isBonus: true,
        tags: { difficulty: "hard", sugarLevel: ["high"], timeOfDay: ["morning", "afternoon"] }
    },
    {
        id: "bonus_crunches_50",
        category: "bonus",
        title: "50 Crunches",
        description: "Core blast challenge.",
        duration: "3 min",
        icon: Flame,
        color: "from-orange-500 to-red-600",
        isBonus: true,
        tags: { difficulty: "hard", sugarLevel: ["medium"], timeOfDay: ["morning", "afternoon"] }
    }
];

export const DEFAULT_TASK = TASKS_DATA[0];

// Helper for History/Legacy matching (Simple string matching)
export const getTaskForAction = (actionText) => {
    if (!actionText) return DEFAULT_TASK;
    const lower = actionText.toLowerCase();

    // Find matching task by keywords
    const match = TASKS_DATA.find(t => {
        const titleMatch = t.title.toLowerCase().includes(lower);
        const catMatch = t.category.includes(lower);
        return titleMatch || catMatch;
    });

    return match || DEFAULT_TASK;
};
