import { ComprehensivePlan } from "@/components/comprehensive-plan"

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Personalized Plan</h1>
            <p className="text-muted-foreground">Complete nutrition and fitness guidance tailored just for you</p>
          </div>
          <ComprehensivePlan />
        </div>
      </div>
    </div>
  )
}
