"use client"
import { CalculationEngine } from "@/components/calculation-engine"
import { MealPlan } from "@/components/meal-plan"
import { WorkoutPlan } from "@/components/workout-plan"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ResultsDashboard() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meals">Meal Plan</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CalculationEngine />
        </TabsContent>

        <TabsContent value="meals" className="space-y-6">
          <MealPlan />
        </TabsContent>

        <TabsContent value="workouts" className="space-y-6">
          <WorkoutPlan />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
              <p className="text-muted-foreground mb-6">Track your weight, measurements, and achievements over time.</p>
              <Button>Start Tracking Progress</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
