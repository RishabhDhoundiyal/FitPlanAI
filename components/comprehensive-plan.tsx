"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanGenerator } from "@/lib/plan-generator"
import { Download, RefreshCw, Save, Share } from "lucide-react"

export function ComprehensivePlan() {
  const [plan, setPlan] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    generatePlan()
  }, [])

  const generatePlan = async () => {
    setIsLoading(true)
    const userData = localStorage.getItem("userData")

    if (userData) {
      const data = JSON.parse(userData)
      const comprehensivePlan = PlanGenerator.generateComprehensivePlan(data)
      setPlan(comprehensivePlan)

      // Store the generated plan
      localStorage.setItem("currentPlan", JSON.stringify(comprehensivePlan))
    }

    setIsLoading(false)
  }

  const regeneratePlan = async () => {
    setIsRegenerating(true)
    await generatePlan()
    setIsRegenerating(false)
  }

  const exportPlan = () => {
    if (!plan) return

    const planText = `
# Your Personalized Health & Fitness Plan
Generated on: ${plan.createdAt.toLocaleDateString()}

## Nutrition Targets
- Calories: ${plan.nutritionTargets.calories}/day
- Protein: ${plan.nutritionTargets.protein}g
- Carbs: ${plan.nutritionTargets.carbs}g
- Fats: ${plan.nutritionTargets.fats}g

## Daily Meal Plan
### Breakfast
${plan.mealPlan.breakfast.map((item) => `- ${item.food.name}: ${item.quantity}g (${item.calories} cal)`).join("\n")}

### Lunch
${plan.mealPlan.lunch.map((item) => `- ${item.food.name}: ${item.quantity}g (${item.calories} cal)`).join("\n")}

### Dinner
${plan.mealPlan.dinner.map((item) => `- ${item.food.name}: ${item.quantity}g (${item.calories} cal)`).join("\n")}

### Snacks
${plan.mealPlan.snacks.map((item) => `- ${item.food.name}: ${item.quantity}g (${item.calories} cal)`).join("\n")}

## Weekly Workout Plan
${plan.workoutPlan.days
  .map(
    (day) => `
### ${day.day} - ${day.focus}
Duration: ${day.duration}
${day.exercises.map((ex) => `- ${ex.exercise.name}: ${ex.sets} sets x ${ex.reps} reps (Rest: ${ex.rest})`).join("\n")}
`,
  )
  .join("\n")}

## Recommendations
${plan.recommendations.map((rec) => `- ${rec}`).join("\n")}
    `

    const blob = new Blob([planText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fitness-plan-${plan.planId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Generating your comprehensive plan...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Unable to generate plan. Please try again.</p>
          <Button onClick={generatePlan} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Your Comprehensive Health Plan</CardTitle>
              <CardDescription>
                Generated on {plan.createdAt.toLocaleDateString()} • Plan ID: {plan.planId.slice(-8)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={regeneratePlan} disabled={isRegenerating}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
                {isRegenerating ? "Generating..." : "Regenerate"}
              </Button>
              <Button variant="outline" size="sm" onClick={exportPlan}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{plan.nutritionTargets.calories}</div>
            <p className="text-xs text-muted-foreground">Daily Calories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{plan.nutritionTargets.protein}g</div>
            <p className="text-xs text-muted-foreground">Protein</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{plan.workoutPlan.days.length}</div>
            <p className="text-xs text-muted-foreground">Workout Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{plan.recommendations.length}</div>
            <p className="text-xs text-muted-foreground">Tips</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Plan Tabs */}
      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Nutrition Targets</CardTitle>
              <CardDescription>Based on your goals and activity level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{plan.nutritionTargets.calories}</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{plan.nutritionTargets.protein}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{plan.nutritionTargets.carbs}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{plan.nutritionTargets.fats}g</div>
                  <div className="text-sm text-muted-foreground">Fats</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Your Profile</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Goal: {plan.user.goal.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
                  <div>
                    Activity: {plan.user.activityLevel.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div>
                    Diet: {plan.user.dietaryPreference.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div>Experience: {plan.user.fitnessExperience.replace(/\b\w/g, (l) => l.toUpperCase())}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(["breakfast", "lunch", "dinner", "snacks"] as const).map((mealType) => (
              <Card key={mealType}>
                <CardHeader>
                  <CardTitle className="capitalize">{mealType}</CardTitle>
                  <CardDescription>
                    {plan.mealPlan[mealType].reduce((sum, item) => sum + item.calories, 0)} calories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.mealPlan[mealType].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium">{item.food.name}</div>
                        <div className="text-sm text-muted-foreground">{item.quantity}g</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{item.calories} cal</div>
                        <div className="text-muted-foreground">
                          P:{item.protein}g C:{item.carbs}g F:{item.fats}g
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {plan.workoutPlan.days.map((day, index) => (
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
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="border-l-2 border-primary/20 pl-4 space-y-1">
                      <div className="font-medium">{exercise.exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} • Rest: {exercise.rest}
                      </div>
                      {exercise.notes && (
                        <div className="text-xs text-muted-foreground italic">💡 {exercise.notes}</div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {plan.workoutPlan.restDays.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Rest Days</CardTitle>
                <CardDescription>Recovery is just as important as training</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.workoutPlan.restDays.map((day) => (
                    <Badge key={day} variant="secondary">
                      {day}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {plan.workoutPlan.notes.map((note, index) => (
                    <div key={index}>• {note}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Tips tailored to your goals and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plan.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <div className="text-sm">{recommendation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="flex justify-center gap-4 py-6">
          <Button size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>
          <Button variant="outline" size="lg">
            <Share className="w-4 h-4 mr-2" />
            Share Plan
          </Button>
          <Button variant="outline" size="lg" onClick={exportPlan}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
