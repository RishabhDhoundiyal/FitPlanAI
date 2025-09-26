import { UserInputForm } from "@/components/user-input-form"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Let's Create Your Plan</h1>
            <p className="text-muted-foreground">Tell us about yourself to get personalized recommendations</p>
          </div>
          <UserInputForm />
        </div>
      </div>
    </div>
  )
}
