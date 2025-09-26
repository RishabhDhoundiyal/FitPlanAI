"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { foodDatabase, getFoodsByDietaryTags, getFoodsWithoutAllergens, type Food } from "@/lib/food-database"

interface UserData {
  goal: string
  dietaryPreference: string
  allergies: string
  targetCalories: number
  protein: number
  carbs: number
  fats: number
}

interface Meal {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: string[]
  instructions: string[]
}

interface MealPlan {
  breakfast: MealItem[]
  lunch: MealItem[]
  dinner: MealItem[]
  snacks: MealItem[]
}

interface MealItem {
  food: Food
  quantity: number
  calories: number
  protein: number
  carbs: number
  fats: number
}

export function MealPlan() {
  const [userData, setUserData] = useState<any>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      const data = JSON.parse(storedData)
      setUserData(data)
      generateMealPlan(data)
    }
    setIsLoading(false)
  }, [])

  const generateMealPlan = (data: any) => {
    // Get available foods based on dietary preferences and allergies
    let availableFoods = foodDatabase

    // Filter by dietary preferences
    if (data.dietaryPreference && data.dietaryPreference !== "omnivore") {
      const dietaryTags = [data.dietaryPreference]
      if (data.dietaryPreference === "vegetarian") {
        dietaryTags.push("vegan") // Vegetarians can eat vegan food
      }
      availableFoods = getFoodsByDietaryTags(dietaryTags)
    }

    // Filter out allergens
    if (data.allergies) {
      const allergenList = data.allergies
        .toLowerCase()
        .split(",")
        .map((a: string) => a.trim())
      availableFoods = getFoodsWithoutAllergens(allergenList)
    }

    const targetCalories = data.targetCalories || 2000
    const targetProtein = data.protein || 150
    const targetCarbs = data.carbs || 200
    const targetFats = data.fats || 65

    // Distribute calories across meals
    const breakfastCals = Math.round(targetCalories * 0.25)
    const lunchCals = Math.round(targetCalories * 0.35)
    const dinnerCals = Math.round(targetCalories * 0.3)
    const snackCals = Math.round(targetCalories * 0.1)

    // Generate meals using available foods
    const breakfast = generateMealItems(availableFoods, breakfastCals, "breakfast")
    const lunch = generateMealItems(availableFoods, lunchCals, "lunch")
    const dinner = generateMealItems(availableFoods, dinnerCals, "dinner")
    const snacks = generateMealItems(availableFoods, snackCals, "snack")

    setMealPlan({ breakfast, lunch, dinner, snacks })
  }

  const generateMealItems = (foods: Food[], targetCalories: number, mealType: string): MealItem[] => {
    const mealItems: MealItem[] = []
    let remainingCalories = targetCalories

    // Select appropriate foods for meal type
    let selectedFoods: Food[] = []

    if (mealType === "breakfast") {
      selectedFoods = [
        foods.find((f) => f.id === "eggs") || foods.find((f) => f.category === "protein"),
        foods.find((f) => f.id === "oats") || foods.find((f) => f.category === "carbs"),
        foods.find((f) => f.id === "berries") || foods.find((f) => f.category === "fruits"),
      ].filter(Boolean) as Food[]
    } else if (mealType === "lunch" || mealType === "dinner") {
      selectedFoods = [
        foods.find((f) => f.category === "protein"),
        foods.find((f) => f.category === "carbs"),
        foods.find((f) => f.category === "vegetables"),
        foods.find((f) => f.category === "fats"),
      ].filter(Boolean) as Food[]
    } else {
      // snack
      selectedFoods = [
        foods.find((f) => f.id === "greek-yogurt") || foods.find((f) => f.category === "protein"),
        foods.find((f) => f.category === "fruits"),
      ].filter(Boolean) as Food[]
    }

    // Calculate quantities to meet calorie target
    selectedFoods.forEach((food, index) => {
      const calorieShare = remainingCalories / (selectedFoods.length - index)
      const quantity = Math.round((calorieShare / food.calories) * food.servingSize)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Generating your meal plan...</p>
        </div>
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Unable to generate meal plan. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  const MealCard = ({ items, mealType }: { items: MealItem[]; mealType: string }) => {
    const totalCalories = items.reduce((sum, item) => sum + item.calories, 0)
    const totalProtein = items.reduce((sum, item) => sum + item.protein, 0)
    const totalCarbs = items.reduce((sum, item) => sum + item.carbs, 0)
    const totalFats = items.reduce((sum, item) => sum + item.fats, 0)

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg capitalize">{mealType}</CardTitle>
              <CardDescription>{items.length} items</CardDescription>
            </div>
            <Badge variant="secondary">{totalCalories} cal</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-red-600">{totalProtein}g</div>
              <div className="text-muted-foreground">Protein</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{totalCarbs}g</div>
              <div className="text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{totalFats}g</div>
              <div className="text-muted-foreground">Fats</div>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.food.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity}g • {item.calories} cal
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>P: {item.protein}g</div>
                    <div>C: {item.carbs}g</div>
                    <div>F: {item.fats}g</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Meal Plan</CardTitle>
          <CardDescription>
            Customized for your {userData?.dietaryPreference?.replace("-", " ")} diet and{" "}
            {userData?.goal?.replace("-", " ")} goal
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MealCard items={mealPlan.breakfast} mealType="breakfast" />
        <MealCard items={mealPlan.lunch} mealType="lunch" />
        <MealCard items={mealPlan.dinner} mealType="dinner" />
        <MealCard items={mealPlan.snacks} mealType="snacks" />
      </div>

      <Card>
        <CardContent className="text-center py-6">
          <Button className="mr-4">Save Meal Plan</Button>
          <Button variant="outline" onClick={() => generateMealPlan(userData)}>
            Generate New Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
