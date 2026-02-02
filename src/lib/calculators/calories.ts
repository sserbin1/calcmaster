export interface CalorieInput {
  age: number
  gender: 'male' | 'female'
  weight: number
  height: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'
  goal: 'lose' | 'maintain' | 'gain'
}

export interface CalorieResult {
  bmr: number
  tdee: number
  targetCalories: number
  protein: { min: number; max: number }
  carbs: { min: number; max: number }
  fat: { min: number; max: number }
  deficit: number
  weeklyChange: number
}

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
}

export const activityLabels = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (exercise 1-3 days/week)',
  moderate: 'Moderate (exercise 3-5 days/week)',
  active: 'Active (hard exercise 6-7 days/week)',
  veryActive: 'Very Active (physical job + exercise)',
}

export function calculateCalories(input: CalorieInput): CalorieResult {
  let bmr: number
  if (input.gender === 'male') {
    bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5
  } else {
    bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161
  }

  const tdee = bmr * activityMultipliers[input.activityLevel]

  let targetCalories: number
  let deficit: number

  switch (input.goal) {
    case 'lose':
      deficit = -500
      targetCalories = tdee + deficit
      break
    case 'gain':
      deficit = 300
      targetCalories = tdee + deficit
      break
    default:
      deficit = 0
      targetCalories = tdee
  }

  const minCalories = input.gender === 'male' ? 1500 : 1200
  targetCalories = Math.max(targetCalories, minCalories)

  const proteinMultiplier = input.activityLevel === 'sedentary' ? { min: 0.8, max: 1.0 } : { min: 1.6, max: 2.2 }
  const protein = {
    min: Math.round(input.weight * proteinMultiplier.min),
    max: Math.round(input.weight * proteinMultiplier.max),
  }

  const fat = {
    min: Math.round((targetCalories * 0.25) / 9),
    max: Math.round((targetCalories * 0.35) / 9),
  }

  const avgProteinCals = ((protein.min + protein.max) / 2) * 4
  const avgFatCals = ((fat.min + fat.max) / 2) * 9
  const remainingCals = targetCalories - avgProteinCals - avgFatCals
  const carbs = {
    min: Math.round((remainingCals * 0.8) / 4),
    max: Math.round((remainingCals * 1.2) / 4),
  }

  const weeklyChange = (deficit * 7) / 7700

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein,
    carbs,
    fat,
    deficit: Math.round(deficit),
    weeklyChange: Math.round(weeklyChange * 100) / 100,
  }
}
