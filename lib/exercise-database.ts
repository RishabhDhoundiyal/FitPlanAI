export interface Exercise {
  id: string
  name: string
  category: string
  muscleGroups: string[]
  equipment: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  instructions: string[]
  tips: string[]
  variations: string[]
}

export const exerciseDatabase: Exercise[] = [
  // Bodyweight Exercises
  {
    id: "push-ups",
    name: "Push-ups",
    category: "bodyweight",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: [],
    difficulty: "beginner",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulders",
      "Lower your chest to the ground while keeping your body straight",
      "Push back up to the starting position",
      "Keep your core engaged throughout the movement",
    ],
    tips: ["Keep your body in a straight line", "Don't let your hips sag", "Control the movement"],
    variations: ["Knee push-ups", "Incline push-ups", "Diamond push-ups"],
  },
  {
    id: "squats",
    name: "Bodyweight Squats",
    category: "bodyweight",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: [],
    difficulty: "beginner",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower down as if sitting back into a chair",
      "Keep your chest up and knees behind your toes",
      "Drive through your heels to return to standing",
    ],
    tips: ["Keep your weight on your heels", "Don't let knees cave inward", "Go as low as comfortable"],
    variations: ["Jump squats", "Single-leg squats", "Sumo squats"],
  },
  {
    id: "plank",
    name: "Plank",
    category: "bodyweight",
    muscleGroups: ["core", "shoulders"],
    equipment: [],
    difficulty: "beginner",
    instructions: [
      "Start in a push-up position",
      "Hold your body in a straight line from head to heels",
      "Keep your core tight and breathe normally",
      "Hold for the specified time",
    ],
    tips: ["Don't let hips sag or pike up", "Keep shoulders over wrists", "Engage your glutes"],
    variations: ["Side plank", "Plank with leg lifts", "Plank up-downs"],
  },
  {
    id: "lunges",
    name: "Lunges",
    category: "bodyweight",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: [],
    difficulty: "beginner",
    instructions: [
      "Step forward with one leg into a lunge position",
      "Lower your back knee toward the ground",
      "Keep your front knee over your ankle",
      "Push back to the starting position and repeat",
    ],
    tips: ["Keep your torso upright", "Don't let front knee go past toes", "Step far enough forward"],
    variations: ["Reverse lunges", "Walking lunges", "Jump lunges"],
  },
  {
    id: "burpees",
    name: "Burpees",
    category: "bodyweight",
    muscleGroups: ["full body"],
    equipment: [],
    difficulty: "intermediate",
    instructions: [
      "Start standing, then squat down and place hands on the ground",
      "Jump feet back into a plank position",
      "Do a push-up (optional)",
      "Jump feet back to squat position",
      "Jump up with arms overhead",
    ],
    tips: ["Land softly", "Keep core engaged", "Modify by stepping instead of jumping"],
    variations: ["Half burpees", "Burpee box jumps", "Single-arm burpees"],
  },

  // Dumbbell Exercises
  {
    id: "dumbbell-press",
    name: "Dumbbell Chest Press",
    category: "dumbbell",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["dumbbells", "bench"],
    difficulty: "intermediate",
    instructions: [
      "Lie on a bench with dumbbells in each hand",
      "Start with arms extended above your chest",
      "Lower the weights to chest level",
      "Press back up to starting position",
    ],
    tips: ["Keep your feet flat on the floor", "Don't arch your back excessively", "Control the weight"],
    variations: ["Incline press", "Decline press", "Single-arm press"],
  },
  {
    id: "dumbbell-rows",
    name: "Dumbbell Rows",
    category: "dumbbell",
    muscleGroups: ["back", "biceps"],
    equipment: ["dumbbells"],
    difficulty: "intermediate",
    instructions: [
      "Bend over with a dumbbell in each hand",
      "Keep your back straight and core engaged",
      "Pull the weights to your chest",
      "Squeeze your shoulder blades together",
      "Lower with control",
    ],
    tips: ["Don't round your back", "Pull with your back, not your arms", "Keep elbows close to body"],
    variations: ["Single-arm rows", "Chest-supported rows", "Renegade rows"],
  },
  {
    id: "goblet-squats",
    name: "Goblet Squats",
    category: "dumbbell",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["dumbbell"],
    difficulty: "intermediate",
    instructions: [
      "Hold a dumbbell at chest level with both hands",
      "Stand with feet shoulder-width apart",
      "Squat down keeping the weight at your chest",
      "Drive through your heels to stand up",
    ],
    tips: ["Keep your chest up", "The weight helps with balance", "Go as deep as comfortable"],
    variations: ["Goblet squat pulses", "Goblet squat to press", "Single-leg goblet squats"],
  },

  // Barbell Exercises
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    category: "barbell",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "bench"],
    difficulty: "advanced",
    instructions: [
      "Lie on bench with feet flat on floor",
      "Grip the bar slightly wider than shoulder-width",
      "Lower the bar to your chest with control",
      "Press the bar back up to full arm extension",
    ],
    tips: ["Keep your shoulder blades squeezed", "Don't bounce the bar off your chest", "Use a spotter"],
    variations: ["Incline bench press", "Close-grip bench press", "Pause bench press"],
  },
  {
    id: "deadlifts",
    name: "Deadlifts",
    category: "barbell",
    muscleGroups: ["hamstrings", "glutes", "back"],
    equipment: ["barbell"],
    difficulty: "advanced",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip the bar",
      "Keep your back straight and chest up",
      "Drive through your heels to lift the bar",
      "Stand tall, then lower with control",
    ],
    tips: ["Keep the bar close to your body", "Don't round your back", "Start with light weight"],
    variations: ["Romanian deadlifts", "Sumo deadlifts", "Trap bar deadlifts"],
  },
  {
    id: "barbell-squats",
    name: "Barbell Back Squats",
    category: "barbell",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["barbell", "squat rack"],
    difficulty: "advanced",
    instructions: [
      "Position the bar on your upper back",
      "Stand with feet shoulder-width apart",
      "Squat down by pushing hips back and bending knees",
      "Go down until thighs are parallel to floor",
      "Drive through heels to return to standing",
    ],
    tips: ["Keep your core tight", "Don't let knees cave in", "Use proper depth"],
    variations: ["Front squats", "Box squats", "Pause squats"],
  },

  // Cardio Exercises
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    category: "cardio",
    muscleGroups: ["full body"],
    equipment: [],
    difficulty: "beginner",
    instructions: [
      "Start standing with feet together and arms at sides",
      "Jump feet apart while raising arms overhead",
      "Jump back to starting position",
      "Repeat at a steady pace",
    ],
    tips: ["Land softly on the balls of your feet", "Keep a steady rhythm", "Modify by stepping if needed"],
    variations: ["Half jacks", "Cross jacks", "Squat jacks"],
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    category: "cardio",
    muscleGroups: ["core", "shoulders", "legs"],
    equipment: [],
    difficulty: "intermediate",
    instructions: [
      "Start in a plank position",
      "Bring one knee toward your chest",
      "Quickly switch legs, bringing the other knee forward",
      "Continue alternating at a fast pace",
    ],
    tips: ["Keep your core engaged", "Don't let hips bounce up and down", "Maintain plank position"],
    variations: ["Slow mountain climbers", "Cross-body mountain climbers", "Mountain climber twists"],
  },
]

export function getExercisesByCategory(category: string): Exercise[] {
  return exerciseDatabase.filter((exercise) => exercise.category === category)
}

export function getExercisesByDifficulty(difficulty: "beginner" | "intermediate" | "advanced"): Exercise[] {
  return exerciseDatabase.filter((exercise) => exercise.difficulty === difficulty)
}

export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  return exerciseDatabase.filter((exercise) => exercise.muscleGroups.includes(muscleGroup))
}

export function getExercisesByEquipment(equipment: string[]): Exercise[] {
  if (equipment.length === 0) {
    return exerciseDatabase.filter((exercise) => exercise.equipment.length === 0)
  }
  return exerciseDatabase.filter((exercise) => exercise.equipment.every((eq) => equipment.includes(eq)))
}
