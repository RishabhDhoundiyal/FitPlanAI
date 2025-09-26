"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface UserData {
  age: string
  gender: string
  height: string
  weight: string
  goal: string
  activityLevel: string
  dietaryPreference: string
  allergies: string
  medicalConditions: string
  fitnessExperience: string
}

interface CalculationResults {
  bmr: number
  tdee: number
  targetCalories: number
  protein: number
  carbs: number
  fats: number
  bmi: number
  bmiCategory: string
}

export function CalculationEngine() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      const data = JSON.parse(storedData)
      setUserData(data)
      calculateResults(data)
    }
    setIsLoading(false)
  }, [])

  const calculateResults = (data: UserData) => {
    const age = Number.parseInt(data.age)
    const height = Number.parseInt(data.height)
    const weight = Number.parseInt(data.weight)

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr: number
    if (data.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      "lightly-active": 1.375,
      active: 1.55,
      "very-active": 1.725,
    }
    const tdee = bmr * activityMultipliers[data.activityLevel as keyof typeof activityMultipliers]

    // Adjust calories based on goal
    let targetCalories = tdee
    switch (data.goal) {
      case "weight-loss":
        targetCalories = tdee - 500 // 500 calorie deficit
        break
      case "weight-gain":
        targetCalories = tdee + 500 // 500 calorie surplus
        break
      case "muscle-gain":
        targetCalories = tdee + 300 // Moderate surplus for lean gains
        break
      case "maintenance":
        targetCalories = tdee
        break
    }

    // Calculate macronutrient split based on goal
    let proteinRatio = 0.25 // Default 25%
    let carbRatio = 0.45 // Default 45%
    let fatRatio = 0.3 // Default 30%

    switch (data.goal) {
      case "weight-loss":
        proteinRatio = 0.35 // Higher protein for muscle preservation
        carbRatio = 0.35
        fatRatio = 0.3
        break
      case "muscle-gain":
        proteinRatio = 0.3 // High protein for muscle building
        carbRatio = 0.45 // Adequate carbs for energy
        fatRatio = 0.25
        break
      case "weight-gain":
        proteinRatio = 0.25
        carbRatio = 0.5 // Higher carbs for weight gain
        fatRatio = 0.25
        break
    }

    // Adjust for dietary preferences
    if (data.dietaryPreference === "keto") {
      proteinRatio = 0.25
      carbRatio = 0.05 // Very low carbs
      fatRatio = 0.7 // High fat
    } else if (data.dietaryPreference === "low-carb") {
      proteinRatio = 0.3
      carbRatio = 0.2 // Low carbs
      fatRatio = 0.5
    }

    const protein = Math.round((targetCalories * proteinRatio) / 4) // 4 calories per gram
    const carbs = Math.round((targetCalories * carbRatio) / 4) // 4 calories per gram
    const fats = Math.round((targetCalories * fatRatio) / 9) // 9 calories per gram

    // Calculate BMI
    const bmi = weight / (height / 100) ** 2
    let bmiCategory = ""
    if (bmi < 18.5) bmiCategory = "Underweight"
    else if (bmi < 25) bmiCategory = "Normal"
    else if (bmi < 30) bmiCategory = "Overweight"
    else bmiCategory = "Obese"

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein,
      carbs,
      fats,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Calculating your personalized plan...</p>
        </div>
      </div>
    )
  }

  if (!userData || !results) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No user data found. Please complete the onboarding process.</p>
        </CardContent>
      </Card>
    )
  }

  const getBMIColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "bg-blue-500"
      case "Normal":
        return "bg-green-500"
      case "Overweight":
        return "bg-yellow-500"
      case "Obese":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case "weight-loss":
        return "500 calorie deficit for 1 lb/week loss"
      case "weight-gain":
        return "500 calorie surplus for 1 lb/week gain"
      case "muscle-gain":
        return "300 calorie surplus for lean muscle gain"
      case "maintenance":
        return "Maintain current weight"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">BMI</CardTitle>
            <CardDescription>Body Mass Index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="text-3xl font-bold">{results.bmi}</div>
              <Badge className={getBMIColor(results.bmiCategory)}>{results.bmiCategory}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">BMR</CardTitle>
            <CardDescription>Basal Metabolic Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.bmr}</div>
            <p className="text-sm text-muted-foreground">calories/day at rest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">TDEE</CardTitle>
            <CardDescription>Total Daily Energy Expenditure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.tdee}</div>
            <p className="text-sm text-muted-foreground">calories/day with activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Target Calories */}
      <Card>
        <CardHeader>
          <CardTitle>Your Daily Calorie Target</CardTitle>
          <CardDescription>{getGoalDescription(userData.goal)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary mb-4">{results.targetCalories} calories</div>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Goal: {userData.goal.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} • Activity:{" "}
              {userData.activityLevel.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macronutrient Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Macronutrient Breakdown</CardTitle>
          <CardDescription>Daily targets for optimal results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-600">Protein</span>
                <span className="font-bold">{results.protein}g</span>
              </div>
              <Progress value={((results.protein * 4) / results.targetCalories) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(((results.protein * 4) / results.targetCalories) * 100)}% of calories
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-600">Carbs</span>
                <span className="font-bold">{results.carbs}g</span>
              </div>
              <Progress value={((results.carbs * 4) / results.targetCalories) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(((results.carbs * 4) / results.targetCalories) * 100)}% of calories
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-yellow-600">Fats</span>
                <span className="font-bold">{results.fats}g</span>
              </div>
              <Progress value={((results.fats * 9) / results.targetCalories) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(((results.fats * 9) / results.targetCalories) * 100)}% of calories
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Dietary Considerations</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • Diet Type: {userData.dietaryPreference.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
              {userData.allergies && <p>• Allergies/Restrictions: {userData.allergies}</p>}
              <p>• Fitness Level: {userData.fitnessExperience.replace(/\b\w/g, (l) => l.toUpperCase())}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
