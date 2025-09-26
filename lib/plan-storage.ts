import type { ComprehensivePlan } from "./plan-generator"

export interface SavedPlan {
  id: string
  name: string
  plan: ComprehensivePlan
  savedAt: Date
  isActive: boolean
}

export class PlanStorage {
  private static STORAGE_KEY = "savedPlans"
  private static ACTIVE_PLAN_KEY = "activePlan"

  static savePlan(plan: ComprehensivePlan, name?: string): string {
    const savedPlans = this.getSavedPlans()
    const planName = name || `Plan ${new Date().toLocaleDateString()}`

    const savedPlan: SavedPlan = {
      id: plan.planId,
      name: planName,
      plan,
      savedAt: new Date(),
      isActive: false,
    }

    savedPlans.push(savedPlan)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedPlans))

    return savedPlan.id
  }

  static getSavedPlans(): SavedPlan[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return []

    try {
      return JSON.parse(stored).map((plan: any) => ({
        ...plan,
        savedAt: new Date(plan.savedAt),
        plan: {
          ...plan.plan,
          createdAt: new Date(plan.plan.createdAt),
        },
      }))
    } catch {
      return []
    }
  }

  static getPlan(id: string): SavedPlan | null {
    const plans = this.getSavedPlans()
    return plans.find((plan) => plan.id === id) || null
  }

  static deletePlan(id: string): boolean {
    const plans = this.getSavedPlans()
    const filteredPlans = plans.filter((plan) => plan.id !== id)

    if (filteredPlans.length !== plans.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPlans))
      return true
    }

    return false
  }

  static setActivePlan(id: string): boolean {
    const plans = this.getSavedPlans()
    const plan = plans.find((p) => p.id === id)

    if (plan) {
      // Mark all plans as inactive
      plans.forEach((p) => (p.isActive = false))
      // Mark selected plan as active
      plan.isActive = true

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans))
      localStorage.setItem(this.ACTIVE_PLAN_KEY, id)
      return true
    }

    return false
  }

  static getActivePlan(): SavedPlan | null {
    const activeId = localStorage.getItem(this.ACTIVE_PLAN_KEY)
    if (!activeId) return null

    return this.getPlan(activeId)
  }
}
