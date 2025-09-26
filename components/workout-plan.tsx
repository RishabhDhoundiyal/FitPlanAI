"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getExercisesByDifficulty, getExercisesByCategory, type Exercise } from "@/lib/exercise-database"

interface UserData {
  goal: string
  fitnessExperience: string
  activityLevel: string
}

interface WorkoutExercise {
  exercise: Exercise
  sets: number
  reps: string
  rest: string
}

interface WorkoutDay {
  day: string
  focus: string
  exercises: WorkoutExercise[]
  duration: string
}

export function WorkoutPlan() {
  const [userData, setUserData] = useState<any>(null)
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      const data = JSON.parse(storedData)
      setUserData(data)
      generateWorkoutPlan(data)
    }
    setIsLoading(false)
  }, [])

  const generateWorkoutPlan = (data: any) => {
    const difficulty = data.fitnessExperience || "beginner"
    const goal = data.goal || "maintenance"

    // Get exercises based on difficulty level
    const availableExercises = getExercisesByDifficulty(difficulty as "beginner" | "intermediate" | "advanced")

    let plan: WorkoutDay[] = []

    if (difficulty === "beginner") {
      plan = [
        {
          day: "Monday",
          focus: "Full Body",
          duration: "30-40 minutes",
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "squats") || availableExercises[0],
              sets: 3,
              reps: "8-12",
              rest: "60s",
            },
            {
              exercise: availableExercises.find((e) => e.id === "push-ups") || availableExercises[1],
              sets: 3,
              reps: "5-10",
              rest: "60s",
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
          focus: "Cardio & Core",
          duration: "25-35 minutes",
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
              reps: "10-15",
              rest: "45s",
            },
          ],
        },
        {
          day: "Friday",
          focus: "Strength",
          duration: "30-40 minutes",
          exercises: [
            {
              exercise: availableExercises.find((e) => e.id === "lunges") || availableExercises[0],
              sets: 3,
              reps: "6-10 each leg",
              rest: "60s",
            },
            {
              exercise: availableExercises.find((e) => e.id === "plank") || availableExercises[1],
              sets: 3,
              reps: "15-30s",
              rest: "60s",
            },
          ],
        },
      ]
    } else if (difficulty === "intermediate") {
      const dumbbellExercises = getExercisesByCategory("dumbbell")
      plan = [
        {
          day: "Monday",
          focus: "Upper Body",
          duration: "45-60 minutes",
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
          focus: "Full Body HIIT",
          duration: "30-40 minutes",
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
    } else {
      const barbellExercises = getExercisesByCategory("barbell")
      plan = [
        {
          day: "Monday",
          focus: "Chest & Triceps",
          duration: "60-75 minutes",
          exercises: [
            {
              exercise: barbellExercises.find((e) => e.id === "bench-press") || barbellExercises[0],
              sets: 4,
              reps: "6-8",
              rest: "90s",
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
          focus: "Legs",
          duration: "60-75 minutes",
          exercises: [
            {
              exercise: barbellExercises.find((e) => e.id === "barbell-squats") || barbellExercises[0],
              sets: 5,
              reps: "6-8",
              rest: "2-3 min",
            },
            {
              exercise: barbellExercises.find((e) => e.id === "deadlifts") || barbellExercises[1],
              sets: 4,
              reps: "5-6",
              rest: "2-3 min",
            },
          ],
        },
      ]
    }

    setWorkoutPlan(plan)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Creating your workout plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Workout Plan</CardTitle>
          <CardDescription>
            Designed for {userData?.fitnessExperience} level • Goal: {userData?.goal?.replace("-", " ")}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workoutPlan.map((day, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{day.day}</CardTitle>
                  <CardDescription>{day.focus}</CardDescription>
                </div>
                <Badge variant="outline">{day.duration}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {day.exercises.map((workoutExercise, exerciseIndex) => (
                <div key={exerciseIndex} className="border-l-2 border-primary/20 pl-4 space-y-2">
                  <div className="font-medium">{workoutExercise.exercise.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {workoutExercise.sets} sets × {workoutExercise.reps} reps • Rest: {workoutExercise.rest}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium mb-1">Targets: {workoutExercise.exercise.muscleGroups.join(", ")}</div>
                    {workoutExercise.exercise.equipment.length > 0 && (
                      <div>Equipment: {workoutExercise.exercise.equipment.join(", ")}</div>
                    )}
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {workoutExercise.exercise.instructions.slice(0, 2).map((instruction, instrIndex) => (
                      <li key={instrIndex}>• {instruction}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="text-center py-6">
          <Button className="mr-4">Save Workout Plan</Button>
          <Button variant="outline" onClick={() => generateWorkoutPlan(userData)}>
            Generate New Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
