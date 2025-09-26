"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UserData {
  // Basic Info
  age: string
  gender: string
  height: string
  weight: string

  // Goals & Activity
  goal: string
  activityLevel: string

  // Dietary Preferences
  dietaryPreference: string
  allergies: string

  // Additional Info
  medicalConditions: string
  fitnessExperience: string
}

export function UserInputForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
    dietaryPreference: "",
    allergies: "",
    medicalConditions: "",
    fitnessExperience: "",
  })

  const updateUserData = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Store user data and redirect to results
    localStorage.setItem("userData", JSON.stringify(userData))

    setTimeout(() => {
      setIsLoading(false)
      router.push("/results")
    }, 2000)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return userData.age && userData.gender && userData.height && userData.weight
      case 2:
        return userData.goal && userData.activityLevel
      case 3:
        return userData.dietaryPreference
      case 4:
        return true // Optional step
      default:
        return false
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Step {currentStep} of 4</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Goals & Activity Level"}
              {currentStep === 3 && "Dietary Preferences"}
              {currentStep === 4 && "Additional Information"}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`w-3 h-3 rounded-full ${step <= currentStep ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={userData.age}
                  onChange={(e) => updateUserData("age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={userData.gender} onValueChange={(value) => updateUserData("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={userData.height}
                  onChange={(e) => updateUserData("height", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={userData.weight}
                  onChange={(e) => updateUserData("weight", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goals & Activity Level */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>What's your primary goal?</Label>
              <RadioGroup value={userData.goal} onValueChange={(value) => updateUserData("goal", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight-loss" id="weight-loss" />
                  <Label htmlFor="weight-loss">Weight Loss</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight-gain" id="weight-gain" />
                  <Label htmlFor="weight-gain">Weight Gain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="muscle-gain" id="muscle-gain" />
                  <Label htmlFor="muscle-gain">Muscle Gain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintenance" id="maintenance" />
                  <Label htmlFor="maintenance">Maintain Current Weight</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Activity Level</Label>
              <RadioGroup
                value={userData.activityLevel}
                onValueChange={(value) => updateUserData("activityLevel", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sedentary" id="sedentary" />
                  <Label htmlFor="sedentary">Sedentary (little to no exercise)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lightly-active" id="lightly-active" />
                  <Label htmlFor="lightly-active">Lightly Active (1-3 days/week)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Active (3-5 days/week)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-active" id="very-active" />
                  <Label htmlFor="very-active">Very Active (6-7 days/week)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 3: Dietary Preferences */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Dietary Preference</Label>
              <Select
                value={userData.dietaryPreference}
                onValueChange={(value) => updateUserData("dietaryPreference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="omnivore">Omnivore (No restrictions)</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Ketogenic</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="low-carb">Low Carb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Food Allergies & Restrictions</Label>
              <Textarea
                id="allergies"
                placeholder="List any food allergies, intolerances, or foods you want to avoid..."
                value={userData.allergies}
                onChange={(e) => updateUserData("allergies", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Fitness Experience Level</Label>
              <RadioGroup
                value={userData.fitnessExperience}
                onValueChange={(value) => updateUserData("fitnessExperience", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner (0-6 months)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate (6 months - 2 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced (2+ years)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical">Medical Conditions (Optional)</Label>
              <Textarea
                id="medical"
                placeholder="Any medical conditions, injuries, or limitations we should consider..."
                value={userData.medicalConditions}
                onChange={(e) => updateUserData("medicalConditions", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading} className="min-w-[120px]">
              {isLoading ? "Processing..." : "Generate My Plan"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
