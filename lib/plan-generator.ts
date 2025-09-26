import { foodDatabase, getFoodsByDietaryTags, getFoodsWithoutAllergens, type Food } from "./food-database"
import { getExercisesByDifficulty, getExercisesByCategory, type Exercise } from "./exercise-database"

export interface UserProfile {
  // Basic Info
  age: number
  gender: string
  height: number
  weight: number

  // Goals & Activity
  goal: string
  activityLevel: string

  // Dietary Preferences
  dietaryPreference: string
  allergies: string[]

  // Additional Info
  medicalConditions: string
  fitnessExperience: string
}

export interface NutritionTargets {
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
}

export interface MealPlanItem {
  food: Food
  quantity: number
  calories: number
  protein: number
  carbs: number
  fats: number
}

export interface DailyMealPlan {
  breakfast: MealPlanItem[]
  lunch: MealPlanItem[]
  dinner: MealPlanItem[]
  snacks: MealPlanItem[]
  totals: NutritionTargets
}

export interface WorkoutExercise {
  exercise: Exercise
  sets: number
  reps: string
  rest: string
  notes?: string
}

export interface WorkoutDay {
  day: string
  focus: string
  exercises: WorkoutExercise[]
  duration: string
  warmup: string[]
  cooldown: string[]
}

export interface WeeklyWorkoutPlan {
  days: WorkoutDay[]
  restDays: string[]
  notes: string[]
}

export interface ComprehensivePlan {
  user: UserProfile
  nutritionTargets: NutritionTargets
  mealPlan: DailyMealPlan
  workoutPlan: WeeklyWorkoutPlan
  recommendations: string[]
  createdAt: Date
  planId: string
}

export class PlanGenerator {
  static calculateNutritionTargets(user: UserProfile): NutritionTargets {
    // Calculate BMR using Mifflin-St Jeor equation
    let bmr: number
    if (user.gender === "male") {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    } else {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161
    }

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      "lightly-active": 1.375,
      active: 1.55,
      "very-active": 1.725,
    }
    const tdee = bmr * activityMultipliers[user.activityLevel as keyof typeof activityMultipliers]

    // Adjust calories based on goal
    let targetCalories = tdee
    switch (user.goal) {
      case "weight-loss":
        targetCalories = tdee - 500
        break
      case "weight-gain":
        targetCalories = tdee + 500
        break
      case "muscle-gain":
        targetCalories = tdee + 300
        break
      case "maintenance":
        targetCalories = tdee
        break
    }

    // Calculate macronutrient targets
    let proteinRatio = 0.25
    let carbRatio = 0.45
    let fatRatio = 0.3

    switch (user.goal) {
      case "weight-loss":
        proteinRatio = 0.35
        carbRatio = 0.35
        fatRatio = 0.3
        break
      case "muscle-gain":
        proteinRatio = 0.3
        carbRatio = 0.45
        fatRatio = 0.25
        break
      case "weight-gain":
        proteinRatio = 0.25
        carbRatio = 0.5
        fatRatio = 0.25
        break
    }

    // Adjust for dietary preferences
    if (user.dietaryPreference === "keto") {
      proteinRatio = 0.25
      carbRatio = 0.05
      fatRatio = 0.7
    } else if (user.dietaryPreference === "low-carb") {
      proteinRatio = 0.3
      carbRatio = 0.2
      fatRatio = 0.5
    }

    return {
      calories: Math.round(targetCalories),
      protein: Math.round((targetCalories * proteinRatio) / 4),
      carbs: Math.round((targetCalories * carbRatio) / 4),
      fats: Math.round((targetCalories * fatRatio) / 9),
      fiber: Math.round((targetCalories / 1000) * 14), // 14g per 1000 calories
    }
  }

  static generateMealPlan(user: UserProfile, targets: NutritionTargets): DailyMealPlan {
    // Get available foods based on dietary preferences and allergies
    let availableFoods = foodDatabase

    if (user.dietaryPreference && user.dietaryPreference !== "omnivore") {
      const dietaryTags = [user.dietaryPreference]
      if (user.dietaryPreference === "vegetarian") {
        dietaryTags.push("vegan")
      }
      availableFoods = getFoodsByDietaryTags(dietaryTags)
    }

    if (user.allergies.length > 0) {
      availableFoods = getFoodsWithoutAllergens(user.allergies)
    }

    // Distribute calories across meals
    const breakfastCals = Math.round(targets.calories * 0.25)
    const lunchCals = Math.round(targets.calories * 0.35)
    const dinnerCals = Math.round(targets.calories * 0.3)
    const snackCals = Math.round(targets.calories * 0.1)

    const breakfast = this.generateMealItems(availableFoods, breakfastCals, "breakfast", user)
    const lunch = this.generateMealItems(availableFoods, lunchCals, "lunch", user)
    const dinner = this.generateMealItems(availableFoods, dinnerCals, "dinner", user)
    const snacks = this.generateMealItems(availableFoods, snackCals, "snack", user)

    // Calculate totals
    const allItems = [...breakfast, ...lunch, ...dinner, ...snacks]
    const totals = {
      calories: allItems.reduce((sum, item) => sum + item.calories, 0),
      protein: allItems.reduce((sum, item) => sum + item.protein, 0),
      carbs: allItems.reduce((sum, item) => sum + item.carbs, 0),
      fats: allItems.reduce((sum, item) => sum + item.fats, 0),
      fiber: Math.round(
        allItems.reduce((sum, item) => sum + (item.food.fiber * item.quantity) / item.food.servingSize, 0),
      ),
    }

    return { breakfast, lunch, dinner, snacks, totals }
  }

  private static generateMealItems(
    foods: Food[],
    targetCalories: number,
    mealType: string,
    user: UserProfile,
  ): MealPlanItem[] {
    const mealItems: MealPlanItem[] = []
    let remainingCalories = targetCalories

    // Select appropriate foods for meal type and dietary preference
    let selectedFoods: Food[] = []

    if (mealType === "breakfast") {
      const proteinOptions = foods.filter((f) => f.category === "protein")
      const carbOptions = foods.filter((f) => f.category === "carbs" || f.id === "oats")
      const fruitOptions = foods.filter((f) => f.category === "fruits")

      selectedFoods = [
        proteinOptions[Math.floor(Math.random() * proteinOptions.length)],
        carbOptions[Math.floor(Math.random() * carbOptions.length)],
        fruitOptions[Math.floor(Math.random() * fruitOptions.length)],
      ].filter(Boolean)
    } else if (mealType === "lunch" || mealType === "dinner") {
      const proteinOptions = foods.filter((f) => f.category === "protein")
      const carbOptions = foods.filter((f) => f.category === "carbs")
      const vegOptions = foods.filter((f) => f.category === "vegetables")
      const fatOptions = foods.filter((f) => f.category === "fats")

      selectedFoods = [
        proteinOptions[Math.floor(Math.random() * proteinOptions.length)],
        carbOptions[Math.floor(Math.random() * carbOptions.length)],
        vegOptions[Math.floor(Math.random() * vegOptions.length)],
        fatOptions[Math.floor(Math.random() * fatOptions.length)],
      ].filter(Boolean)
    } else {
      // snack
      const proteinOptions = foods.filter((f) => f.category === "protein")
      const fruitOptions = foods.filter((f) => f.category === "fruits")

      selectedFoods = [
        proteinOptions[Math.floor(Math.random() * proteinOptions.length)],
        fruitOptions[Math.floor(Math.random() * fruitOptions.length)],
      ].filter(Boolean)
    }

    // Calculate quantities to meet calorie target
    selectedFoods.forEach((food, index) => {
      if (!food) return

      const calorieShare = remainingCalories / (selectedFoods.length - index)
      const quantity = Math.max(10, Math.round((calorieShare / food.calories) * food.servingSize))
      const actualCalories = Math.round((quantity / food.servingSize) * food.calories)

      mealItems.push({
        food,
        quantity,
        calories: actualCalories,
        protein: Math.round((quantity / food.servingSize) * food.protein),
        carbs: Math.round((quantity / food.servingSize) * food.carbs),
        fats: Math.round((quantity / food.servingSize) * food.fats),
      })

      remainingCalories -= actualCalories
    })

    return mealItems
  }

  static generateWorkoutPlan(user: UserProfile): WeeklyWorkoutPlan {
    const difficulty = user.fitnessExperience as "beginner" | "intermediate" | "advanced"
    const availableExercises = getExercisesByDifficulty(difficulty)

    let days: WorkoutDay[] = []
    let restDays: string[] = []
    let notes: string[] = []

    const warmup = [
      "5-10 minutes light cardio (walking, marching in place)",
      "Dynamic stretching (arm circles, leg swings)",
      "Joint mobility exercises",
    ]

    const cooldown = ["5-10 minutes light walking", "Static stretching for worked muscles", "Deep breathing exercises"]

    if (difficulty === "beginner") {
      days = [
        {
          day: "Monday",
          focus: "Full Body Strength",
          duration: "30-40 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "squats") || availableExercises[0],
              sets: 3,
              reps: "8-12",
              rest: "60s",
              notes: "Focus on proper form over speed",
            },
            {
              exercise: availableExercises.find((e) => e.id === "push-ups") || availableExercises[1],
              sets: 3,
              reps: "5-10",
              rest: "60s",
              notes: "Modify on knees if needed",
            },
            {
              exercise: availableExercises.find((e) => e.id === "plank") || availableExercises[2],
              sets: 3,
              reps: "20-30s",
              rest: "60s",
            },
          ],
        },
        {
          day: "Wednesday",
          focus: "Cardio & Flexibility",
          duration: "25-35 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "jumping-jacks") || availableExercises[0],
              sets: 3,
              reps: "30s",
              rest: "30s",
            },
            {
              exercise: availableExercises.find((e) => e.id === "mountain-climbers") || availableExercises[1],
              sets: 3,
              reps: "15s",
              rest: "45s",
            },
          ],
        },
        {
          day: "Friday",
          focus: "Functional Movement",
          duration: "30-40 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "lunges") || availableExercises[0],
              sets: 3,
              reps: "6-10 each leg",
              rest: "60s",
            },
          ],
        },
      ]
      restDays = ["Tuesday", "Thursday", "Saturday", "Sunday"]
      notes = [
        "Start with lighter intensity and focus on learning proper form",
        "Rest days are important for recovery - consider light walking or stretching",
        "Progress gradually by adding reps or time before adding weight",
      ]
    } else if (difficulty === "intermediate") {
      const dumbbellExercises = getExercisesByCategory("dumbbell")
      days = [
        {
          day: "Monday",
          focus: "Upper Body",
          duration: "45-60 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "push-ups") || availableExercises[0],
              sets: 4,
              reps: "12-15",
              rest: "60s",
            },
            {
              exercise: dumbbellExercises.find((e) => e.id === "dumbbell-rows") || dumbbellExercises[0],
              sets: 4,
              reps: "10-12",
              rest: "60s",
            },
            {
              exercise: dumbbellExercises.find((e) => e.id === "dumbbell-press") || dumbbellExercises[1],
              sets: 3,
              reps: "10-12",
              rest: "60s",
            },
          ],
        },
        {
          day: "Wednesday",
          focus: "Lower Body",
          duration: "45-60 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: dumbbellExercises.find((e) => e.id === "goblet-squats") || availableExercises[0],
              sets: 4,
              reps: "12-15",
              rest: "60s",
            },
            {
              exercise: availableExercises.find((e) => e.id === "lunges") || availableExercises[1],
              sets: 4,
              reps: "10-12 each leg",
              rest: "60s",
            },
          ],
        },
        {
          day: "Friday",
          focus: "HIIT & Core",
          duration: "30-40 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "burpees") || availableExercises[0],
              sets: 4,
              reps: "8-12",
              rest: "45s",
            },
            {
              exercise: availableExercises.find((e) => e.id === "mountain-climbers") || availableExercises[1],
              sets: 4,
              reps: "20s",
              rest: "40s",
            },
          ],
        },
      ]
      restDays = ["Tuesday", "Thursday", "Saturday", "Sunday"]
      notes = [
        "Focus on progressive overload - gradually increase weight or reps",
        "Active recovery on rest days with light cardio or yoga",
        "Track your workouts to monitor progress",
      ]
    } else {
      const barbellExercises = getExercisesByCategory("barbell")
      days = [
        {
          day: "Monday",
          focus: "Chest & Triceps",
          duration: "60-75 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: barbellExercises.find((e) => e.id === "bench-press") || barbellExercises[0],
              sets: 4,
              reps: "6-8",
              rest: "90s",
              notes: "Use a spotter for heavy sets",
            },
            {
              exercise: availableExercises.find((e) => e.id === "dumbbell-press") || availableExercises[0],
              sets: 4,
              reps: "8-10",
              rest: "75s",
            },
          ],
        },
        {
          day: "Tuesday",
          focus: "Back & Biceps",
          duration: "60-75 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "dumbbell-rows") || availableExercises[0],
              sets: 4,
              reps: "8-10",
              rest: "75s",
            },
          ],
        },
        {
          day: "Thursday",
          focus: "Legs & Glutes",
          duration: "60-75 minutes",
          warmup,
          cooldown,
          exercises: [
            {
              exercise: barbellExercises.find((e) => e.id === "barbell-squats") || barbellExercises[0],
              sets: 5,
              reps: "6-8",
              rest: "2-3 min",
              notes: "Focus on depth and control",
            },
            {
              exercise: barbellExercises.find((e) => e.id === "deadlifts") || barbellExercises[1],
              sets: 4,
              reps: "5-6",
              rest: "2-3 min",
              notes: "Maintain neutral spine throughout",
            },
          ],
        },
      ]
      restDays = ["Wednesday", "Friday", "Saturday", "Sunday"]
      notes = [
        "Periodize your training with deload weeks every 4-6 weeks",
        "Consider working with a trainer for form checks on compound movements",
        "Track all lifts and aim for progressive overload",
      ]
    }

    return { days, restDays, notes }
  }

  static generateRecommendations(user: UserProfile, nutritionTargets: NutritionTargets): string[] {
    const recommendations: string[] = []

    // Goal-specific recommendations
    if (user.goal === "weight-loss") {
      recommendations.push("Focus on creating a sustainable calorie deficit through diet and exercise")
      recommendations.push("Prioritize protein to maintain muscle mass during weight loss")
      recommendations.push("Include plenty of vegetables for satiety and micronutrients")
    } else if (user.goal === "muscle-gain") {
      recommendations.push("Eat in a slight calorie surplus to support muscle growth")
      recommendations.push("Consume protein throughout the day, especially post-workout")
      recommendations.push("Focus on progressive overload in your strength training")
    } else if (user.goal === "weight-gain") {
      recommendations.push("Eat frequent, nutrient-dense meals to reach your calorie goals")
      recommendations.push("Include healthy fats like nuts, avocados, and olive oil")
      recommendations.push("Consider liquid calories like smoothies if solid food is challenging")
    }

    // Dietary preference recommendations
    if (user.dietaryPreference === "vegan") {
      recommendations.push("Combine different plant proteins to ensure complete amino acid profiles")
      recommendations.push("Consider B12, iron, and omega-3 supplementation")
    } else if (user.dietaryPreference === "keto") {
      recommendations.push("Monitor ketone levels to ensure you're in ketosis")
      recommendations.push("Increase sodium intake to prevent keto flu symptoms")
    }

    // Fitness level recommendations
    if (user.fitnessExperience === "beginner") {
      recommendations.push("Start slowly and focus on learning proper form before increasing intensity")
      recommendations.push("Allow adequate rest between workouts for recovery")
    } else if (user.fitnessExperience === "advanced") {
      recommendations.push("Consider periodization and deload weeks to prevent overtraining")
      recommendations.push("Track your workouts meticulously to ensure progressive overload")
    }

    // General health recommendations
    recommendations.push("Stay hydrated by drinking at least 8-10 glasses of water daily")
    recommendations.push("Aim for 7-9 hours of quality sleep each night for optimal recovery")
    recommendations.push("Consider consulting with healthcare providers before making major changes")

    return recommendations
  }

  static generateComprehensivePlan(userData: any): ComprehensivePlan {
    const user: UserProfile = {
      age: Number.parseInt(userData.age),
      gender: userData.gender,
      height: Number.parseInt(userData.height),
      weight: Number.parseInt(userData.weight),
      goal: userData.goal,
      activityLevel: userData.activityLevel,
      dietaryPreference: userData.dietaryPreference,
      allergies: userData.allergies
        ? userData.allergies
            .toLowerCase()
            .split(",")
            .map((a: string) => a.trim())
        : [],
      medicalConditions: userData.medicalConditions || "",
      fitnessExperience: userData.fitnessExperience || "beginner",
    }

    const nutritionTargets = this.calculateNutritionTargets(user)
    const mealPlan = this.generateMealPlan(user, nutritionTargets)
    const workoutPlan = this.generateWorkoutPlan(user)
    const recommendations = this.generateRecommendations(user, nutritionTargets)

    return {
      user,
      nutritionTargets,
      mealPlan,
      workoutPlan,
      recommendations,
      createdAt: new Date(),
      planId: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  }
}
