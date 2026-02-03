// Health calculator visual scale configurations

import type { VisualScaleConfig } from '@/types/methodology'
import { BMI_SCALE, BODY_FAT_MALE_SCALE, BODY_FAT_FEMALE_SCALE, PROTEIN_SCALE, SLEEP_SCALE, CALORIE_BALANCE_SCALE } from './scale-presets'

// Map calculator types to their visual scales
export const healthScales: Record<string, VisualScaleConfig | ((gender?: string) => VisualScaleConfig)> = {
  bmi: BMI_SCALE,

  'body-fat': (gender?: string) => gender === 'female' ? BODY_FAT_FEMALE_SCALE : BODY_FAT_MALE_SCALE,

  protein: PROTEIN_SCALE,

  sleep: SLEEP_SCALE,

  calories: CALORIE_BALANCE_SCALE,

  tdee: CALORIE_BALANCE_SCALE,
}

// Get the appropriate scale for a health calculator
export function getHealthScale(calculatorType: string, options?: { gender?: string }): VisualScaleConfig | null {
  const scale = healthScales[calculatorType]

  if (!scale) return null

  if (typeof scale === 'function') {
    return scale(options?.gender)
  }

  return scale
}

// BMI category helper
export function getBMICategory(bmi: number): { label: string; color: string; description: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', description: 'BMI below 18.5 may indicate nutritional deficiency' }
  if (bmi < 25) return { label: 'Normal', color: '#22c55e', description: 'Healthy weight range associated with lower health risks' }
  if (bmi < 30) return { label: 'Overweight', color: '#eab308', description: 'Elevated BMI may increase health risks' }
  if (bmi < 35) return { label: 'Obese Class I', color: '#f97316', description: 'Moderate obesity, increased health risks' }
  if (bmi < 40) return { label: 'Obese Class II', color: '#ef4444', description: 'Severe obesity, high health risks' }
  return { label: 'Obese Class III', color: '#dc2626', description: 'Very severe obesity, very high health risks' }
}

// Body fat category helper
export function getBodyFatCategory(bodyFat: number, gender: 'male' | 'female'): { label: string; color: string; description: string } {
  const maleCategories = [
    { max: 6, label: 'Essential', color: '#3b82f6', description: 'Minimum fat for survival' },
    { max: 14, label: 'Athletic', color: '#22c55e', description: 'Elite athletic condition' },
    { max: 18, label: 'Fitness', color: '#10b981', description: 'Fit and healthy' },
    { max: 25, label: 'Average', color: '#eab308', description: 'Acceptable range' },
    { max: 100, label: 'Obese', color: '#ef4444', description: 'Above healthy range' },
  ]

  const femaleCategories = [
    { max: 14, label: 'Essential', color: '#3b82f6', description: 'Minimum fat for survival' },
    { max: 21, label: 'Athletic', color: '#22c55e', description: 'Elite athletic condition' },
    { max: 25, label: 'Fitness', color: '#10b981', description: 'Fit and healthy' },
    { max: 32, label: 'Average', color: '#eab308', description: 'Acceptable range' },
    { max: 100, label: 'Obese', color: '#ef4444', description: 'Above healthy range' },
  ]

  const categories = gender === 'female' ? femaleCategories : maleCategories
  const category = categories.find(c => bodyFat <= c.max) || categories[categories.length - 1]

  return { label: category.label, color: category.color, description: category.description }
}

// Ideal weight range helper
export function getIdealWeightStatus(currentWeight: number, idealWeight: number): { status: string; color: string; percentDiff: number } {
  const percentDiff = ((currentWeight - idealWeight) / idealWeight) * 100

  if (percentDiff < -15) return { status: 'Significantly Underweight', color: '#ef4444', percentDiff }
  if (percentDiff < -5) return { status: 'Underweight', color: '#eab308', percentDiff }
  if (percentDiff <= 5) return { status: 'At Ideal Weight', color: '#22c55e', percentDiff }
  if (percentDiff <= 15) return { status: 'Overweight', color: '#eab308', percentDiff }
  return { status: 'Significantly Overweight', color: '#ef4444', percentDiff }
}

// Protein intake status helper
export function getProteinStatus(gramsPerKg: number, activityLevel: string): { status: string; color: string; recommendation: string } {
  const isAthlete = activityLevel === 'athlete' || activityLevel === 'very_active'

  if (gramsPerKg < 0.8) {
    return { status: 'Below RDA', color: '#ef4444', recommendation: 'Increase protein intake to at least 0.8g/kg' }
  }

  if (isAthlete) {
    if (gramsPerKg < 1.6) return { status: 'Low for Athletes', color: '#eab308', recommendation: 'Athletes should aim for 1.6-2.2g/kg' }
    if (gramsPerKg <= 2.2) return { status: 'Optimal for Athletes', color: '#22c55e', recommendation: 'Good protein intake for athletic performance' }
    return { status: 'Above Recommended', color: '#3b82f6', recommendation: 'May be beneficial for muscle building goals' }
  }

  if (gramsPerKg < 1.2) return { status: 'RDA Level', color: '#eab308', recommendation: 'Consider increasing to 1.2g/kg for active adults' }
  if (gramsPerKg <= 1.6) return { status: 'Optimal for Active Adults', color: '#22c55e', recommendation: 'Good protein intake for general fitness' }
  return { status: 'High Intake', color: '#10b981', recommendation: 'Suitable for high-intensity training' }
}

// Sleep quality assessment
export function getSleepAssessment(hours: number, age: number): { quality: string; color: string; advice: string } {
  // Adjust recommendations by age
  let minRecommended = 7
  let maxRecommended = 9

  if (age < 18) {
    minRecommended = 8
    maxRecommended = 10
  } else if (age >= 65) {
    minRecommended = 7
    maxRecommended = 8
  }

  if (hours < minRecommended - 1) {
    return { quality: 'Severely Insufficient', color: '#ef4444', advice: 'This is well below recommended. Prioritize getting more sleep.' }
  }
  if (hours < minRecommended) {
    return { quality: 'Insufficient', color: '#eab308', advice: 'Try to add 30-60 minutes to your sleep schedule.' }
  }
  if (hours <= maxRecommended) {
    return { quality: 'Optimal', color: '#22c55e', advice: 'You are getting the recommended amount of sleep.' }
  }
  if (hours <= maxRecommended + 1) {
    return { quality: 'Adequate', color: '#10b981', advice: 'Slightly above average but generally fine.' }
  }
  return { quality: 'Excessive', color: '#3b82f6', advice: 'Regularly sleeping this much may indicate an underlying condition.' }
}
