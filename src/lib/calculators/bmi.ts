export interface BMIResult {
  bmi: number
  category: string
  categoryColor: string
  healthyWeightRange: { min: number; max: number }
  advice: string
}

export interface BMIInput {
  weight: number
  height: number
  unit: 'metric' | 'imperial'
}

export function calculateBMI(input: BMIInput): BMIResult {
  let weightKg: number
  let heightM: number

  if (input.unit === 'imperial') {
    // Convert lbs to kg, inches to meters
    weightKg = input.weight * 0.453592
    heightM = input.height * 0.0254
  } else {
    weightKg = input.weight
    heightM = input.height / 100 // cm to meters
  }

  const bmi = weightKg / (heightM * heightM)
  const roundedBMI = Math.round(bmi * 10) / 10

  // Determine category
  let category: string
  let categoryColor: string
  let advice: string

  if (bmi < 18.5) {
    category = 'Underweight'
    categoryColor = '#3b82f6' // blue
    advice = 'You may need to gain some weight. Consider consulting a nutritionist for a healthy meal plan.'
  } else if (bmi < 25) {
    category = 'Normal'
    categoryColor = '#10b981' // green
    advice = 'Great job! Your weight is in the healthy range. Maintain your current lifestyle.'
  } else if (bmi < 30) {
    category = 'Overweight'
    categoryColor = '#f59e0b' // amber
    advice = 'Consider making lifestyle changes. Small adjustments to diet and exercise can help.'
  } else if (bmi < 35) {
    category = 'Obese (Class I)'
    categoryColor = '#ef4444' // red
    advice = 'Health risks are elevated. Consult a healthcare provider for a personalized plan.'
  } else if (bmi < 40) {
    category = 'Obese (Class II)'
    categoryColor = '#dc2626' // darker red
    advice = 'Significant health risks. Professional medical guidance is recommended.'
  } else {
    category = 'Obese (Class III)'
    categoryColor = '#991b1b' // darkest red
    advice = 'Severe health risks. Please seek medical attention for comprehensive care.'
  }

  // Calculate healthy weight range (BMI 18.5-24.9)
  const healthyWeightRange = {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  }

  return {
    bmi: roundedBMI,
    category,
    categoryColor,
    healthyWeightRange,
    advice,
  }
}

export const bmiCategories = [
  { range: '< 18.5', category: 'Underweight', color: '#3b82f6' },
  { range: '18.5 - 24.9', category: 'Normal', color: '#10b981' },
  { range: '25 - 29.9', category: 'Overweight', color: '#f59e0b' },
  { range: '30 - 34.9', category: 'Obese I', color: '#ef4444' },
  { range: '35 - 39.9', category: 'Obese II', color: '#dc2626' },
  { range: '≥ 40', category: 'Obese III', color: '#991b1b' },
]
