// Health calculator implementations
// Extracted from calculator-engine.ts

import { create, all } from 'mathjs'

const math = create(all, {
  precision: 64,
  number: 'BigNumber',
})

import type { CalculatorInput, CalculatorOutput, CalculatorField } from '../calculator-engine'

export function getHealthFields(type: string): CalculatorField[] | null {
  const fields: Record<string, CalculatorField[]> = {
    bmi: [
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg', default: 70 },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm', default: 175 },
    ],
    calories: [
      { name: 'age', label: 'Age', type: 'number', placeholder: '25', unit: 'years', default: 25 },
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg', default: 70 },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm', default: 175 },
      { name: 'activity', label: 'Activity Level', type: 'select', options: [
        { value: '1.2', label: 'Sedentary' },
        { value: '1.375', label: 'Light (1-3 days/week)' },
        { value: '1.55', label: 'Moderate (3-5 days/week)' },
        { value: '1.725', label: 'Active (6-7 days/week)' },
        { value: '1.9', label: 'Very Active' },
      ], default: '1.55' },
      { name: 'goal', label: 'Goal', type: 'radio', options: [
        { value: 'lose', label: 'Lose Weight' },
        { value: 'maintain', label: 'Maintain' },
        { value: 'gain', label: 'Build Muscle' },
      ], default: 'maintain' },
    ],
    tdee: [
      { name: 'age', label: 'Age', type: 'number', placeholder: '25', default: 25 },
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg', default: 70 },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm', default: 175 },
      { name: 'activity', label: 'Activity Level', type: 'select', options: [
        { value: '1.2', label: 'Sedentary' },
        { value: '1.375', label: 'Light' },
        { value: '1.55', label: 'Moderate' },
        { value: '1.725', label: 'Active' },
        { value: '1.9', label: 'Very Active' },
      ], default: '1.55' },
    ],
    bmr: [
      { name: 'age', label: 'Age', type: 'number', placeholder: '25', default: 25 },
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg', default: 70 },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm', default: 175 },
    ],
    macro: [
      { name: 'calories', label: 'Daily Calories', type: 'number', placeholder: '2000', unit: 'kcal', default: 2000 },
      { name: 'goal', label: 'Goal', type: 'select', options: [
        { value: 'balanced', label: 'Balanced (40/30/30)' },
        { value: 'lowcarb', label: 'Low Carb (25/40/35)' },
        { value: 'highprotein', label: 'High Protein (40/40/20)' },
        { value: 'keto', label: 'Keto (5/30/65)' },
      ], default: 'balanced' },
    ],
    'body-fat': [
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'waist', label: 'Waist', type: 'number', placeholder: '85', unit: 'cm', default: 85 },
      { name: 'neck', label: 'Neck', type: 'number', placeholder: '38', unit: 'cm', default: 38 },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm', default: 175 },
      { name: 'hip', label: 'Hip (women only)', type: 'number', placeholder: '95', unit: 'cm', default: 95 },
    ],
    'ideal-weight': [
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm', default: 175 },
      { name: 'frame', label: 'Body Frame', type: 'select', options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ], default: 'medium' },
    ],
    protein: [
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg', default: 70 },
      { name: 'activity', label: 'Activity Level', type: 'select', options: [
        { value: 'sedentary', label: 'Sedentary' },
        { value: 'moderate', label: 'Moderately Active' },
        { value: 'active', label: 'Very Active' },
        { value: 'athlete', label: 'Athlete' },
      ], default: 'moderate' },
      { name: 'goal', label: 'Goal', type: 'select', options: [
        { value: 'maintain', label: 'Maintain Weight' },
        { value: 'lose', label: 'Lose Fat' },
        { value: 'gain', label: 'Build Muscle' },
      ], default: 'maintain' },
    ],
    ovulation: [
      { name: 'lastPeriod', label: 'First Day of Last Period', type: 'date' },
      { name: 'cycleLength', label: 'Cycle Length', type: 'number', placeholder: '28', unit: 'days', default: 28 },
    ],
    'due-date': [
      { name: 'lastPeriod', label: 'First Day of Last Period', type: 'date' },
      { name: 'cycleLength', label: 'Cycle Length', type: 'number', placeholder: '28', unit: 'days', default: 28 },
    ],
    pregnancy: [
      { name: 'dueDate', label: 'Due Date', type: 'date' },
    ],
    sleep: [
      { name: 'wakeTime', label: 'Wake Up Time', type: 'text', placeholder: '07:00', default: '07:00' },
      { name: 'mode', label: 'Calculate', type: 'radio', options: [
        { value: 'bedtime', label: 'Bedtime' },
        { value: 'waketime', label: 'Wake Time' },
      ], default: 'bedtime' },
    ],
  }
  return fields[type] || null
}

export function calculateHealth(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  switch (type) {
    case 'bmi': {
      const weight = Number(input.weight)
      const heightCm = Number(input.height)
      const heightM = heightCm / 100

      let bmi: number
      let methodLabel: string

      // Different BMI calculation methods
      switch (method) {
        case 'new-bmi':
          // Trefethen's New BMI (2013) - better for tall/short people
          bmi = 1.3 * weight / Math.pow(heightM, 2.5)
          methodLabel = 'New BMI (Trefethen)'
          break
        case 'ponderal':
          // Ponderal Index - more accurate for extremes
          bmi = weight / Math.pow(heightM, 3) * 10
          methodLabel = 'Ponderal Index'
          break
        case 'quetelet':
        default:
          // Classic Quetelet Index (1832) - standard BMI
          bmi = weight / (heightM * heightM)
          methodLabel = 'Standard BMI'
          break
      }

      const rounded = Math.round(bmi * 10) / 10

      let category: string
      let color: string
      let advice: string

      if (bmi < 18.5) {
        category = 'Underweight'
        color = '#3b82f6'
        advice = 'Consider gaining weight through healthy eating.'
      } else if (bmi < 25) {
        category = 'Normal'
        color = '#10b981'
        advice = 'Great! Maintain your healthy lifestyle.'
      } else if (bmi < 30) {
        category = 'Overweight'
        color = '#f59e0b'
        advice = 'Consider small lifestyle changes for better health.'
      } else {
        category = 'Obese'
        color = '#ef4444'
        advice = 'Consult a healthcare provider for personalized advice.'
      }

      return {
        primary: { value: rounded, label: methodLabel },
        secondary: [
          { label: 'Category', value: category },
          { label: 'Healthy Range', value: '18.5 - 24.9' },
          { label: 'Method', value: methodLabel },
        ],
        advice,
        chartData: [
          { name: 'Your BMI', value: rounded, color },
          { name: 'Underweight', value: 18.5, color: '#3b82f6' },
          { name: 'Normal', value: 24.9, color: '#10b981' },
          { name: 'Overweight', value: 29.9, color: '#f59e0b' },
        ],
      }
    }

    case 'calories':

    case 'tdee': {
      const age = Number(input.age)
      const weight = Number(input.weight)
      const height = Number(input.height)
      const activity = Number(input.activity) || 1.55
      const isMale = input.gender === 'male'

      let bmr: number
      let methodLabel: string

      // Different BMR calculation methods
      switch (method) {
        case 'harris-benedict':
          // Harris-Benedict (1919, revised 1984)
          bmr = isMale
            ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
            : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age
          methodLabel = 'Harris-Benedict'
          break
        case 'katch-mcardle':
          // Katch-McArdle (requires body fat %, using estimate)
          const leanMass = weight * 0.85 // Estimate 15% body fat
          bmr = 370 + 21.6 * leanMass
          methodLabel = 'Katch-McArdle'
          break
        case 'mifflin-st-jeor':
        default:
          // Mifflin-St Jeor (1990) - most accurate for most people
          bmr = isMale
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161
          methodLabel = 'Mifflin-St Jeor'
          break
      }

      const tdee = Math.round(bmr * activity)

      let target = tdee
      if (input.goal === 'lose') target = tdee - 500
      if (input.goal === 'gain') target = tdee + 300

      return {
        primary: { value: type === 'tdee' ? tdee : target, label: type === 'tdee' ? 'Daily Calories Burned' : 'Daily Calories', unit: 'kcal' },
        secondary: [
          { label: 'BMR', value: Math.round(bmr), unit: 'kcal' },
          { label: 'TDEE', value: tdee, unit: 'kcal' },
          { label: 'Formula', value: methodLabel },
        ],
        breakdown: [
          { label: 'Protein', value: `${Math.round(weight * 1.6)}-${Math.round(weight * 2.2)}g`, color: '#ef4444' },
          { label: 'Carbs', value: `${Math.round(target * 0.4 / 4)}-${Math.round(target * 0.5 / 4)}g`, color: '#3b82f6' },
          { label: 'Fat', value: `${Math.round(target * 0.25 / 9)}-${Math.round(target * 0.35 / 9)}g`, color: '#f59e0b' },
        ],
        advice: input.goal === 'lose'
          ? '500 calorie deficit for ~0.5kg/week loss'
          : input.goal === 'gain'
          ? '300 calorie surplus for lean muscle gain'
          : 'These are your maintenance calories',
      }
    }

    case 'bmr': {
      const age = Number(input.age)
      const weight = Number(input.weight)
      const height = Number(input.height)
      const isMale = input.gender === 'male'

      const bmr = isMale
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161

      return {
        primary: { value: Math.round(bmr), label: 'Basal Metabolic Rate', unit: 'kcal/day' },
        secondary: [
          { label: 'Sedentary TDEE', value: Math.round(bmr * 1.2), unit: 'kcal' },
          { label: 'Active TDEE', value: Math.round(bmr * 1.725), unit: 'kcal' },
        ],
        advice: 'BMR is calories burned at complete rest. Multiply by activity factor for TDEE.',
      }
    }

    case 'macro': {
      const calories = Number(input.calories)
      const goal = input.goal as string

      const splits: Record<string, { carb: number; protein: number; fat: number }> = {
        balanced: { carb: 40, protein: 30, fat: 30 },
        lowcarb: { carb: 25, protein: 40, fat: 35 },
        highprotein: { carb: 40, protein: 40, fat: 20 },
        keto: { carb: 5, protein: 30, fat: 65 },
      }

      const split = splits[goal] || splits.balanced
      const carbGrams = Math.round((calories * split.carb / 100) / 4)
      const proteinGrams = Math.round((calories * split.protein / 100) / 4)
      const fatGrams = Math.round((calories * split.fat / 100) / 9)

      return {
        primary: { value: calories, label: 'Daily Calories', unit: 'kcal' },
        breakdown: [
          { label: 'Carbohydrates', value: `${carbGrams}g (${split.carb}%)`, color: '#3b82f6' },
          { label: 'Protein', value: `${proteinGrams}g (${split.protein}%)`, color: '#ef4444' },
          { label: 'Fat', value: `${fatGrams}g (${split.fat}%)`, color: '#f59e0b' },
        ],
        chartData: [
          { name: 'Carbs', value: carbGrams * 4, color: '#3b82f6' },
          { name: 'Protein', value: proteinGrams * 4, color: '#ef4444' },
          { name: 'Fat', value: fatGrams * 9, color: '#f59e0b' },
        ],
        advice: `${goal === 'keto' ? 'Keto diet requires strict carb restriction.' : 'Adjust macros based on your results and preferences.'}`,
      }
    }

    case 'body-fat': {
      const isMale = input.gender === 'male'
      const waist = Number(input.waist)
      const neck = Number(input.neck)
      const height = Number(input.height)
      const hip = Number(input.hip) || 0

      // Navy Method formula
      let bodyFat: number
      if (isMale) {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
      } else {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450
      }

      bodyFat = Math.round(bodyFat * 10) / 10

      let category: string
      let color: string
      if (isMale) {
        if (bodyFat < 6) { category = 'Essential Fat'; color = '#ef4444' }
        else if (bodyFat < 14) { category = 'Athletic'; color = '#10b981' }
        else if (bodyFat < 18) { category = 'Fitness'; color = '#22c55e' }
        else if (bodyFat < 25) { category = 'Average'; color = '#f59e0b' }
        else { category = 'Above Average'; color = '#ef4444' }
      } else {
        if (bodyFat < 14) { category = 'Essential Fat'; color = '#ef4444' }
        else if (bodyFat < 21) { category = 'Athletic'; color = '#10b981' }
        else if (bodyFat < 25) { category = 'Fitness'; color = '#22c55e' }
        else if (bodyFat < 32) { category = 'Average'; color = '#f59e0b' }
        else { category = 'Above Average'; color = '#ef4444' }
      }

      return {
        primary: { value: bodyFat, label: 'Body Fat', unit: '%' },
        secondary: [
          { label: 'Category', value: category },
          { label: 'Method', value: 'Navy Method' },
        ],
        chartData: [
          { name: 'Body Fat', value: bodyFat, color },
          { name: 'Lean Mass', value: 100 - bodyFat, color: '#10b981' },
        ],
        advice: `${category} body fat for ${isMale ? 'men' : 'women'}. ${bodyFat > (isMale ? 25 : 32) ? 'Consider reducing body fat for health benefits.' : 'You are within a healthy range.'}`,
      }
    }

    case 'ideal-weight': {
      const isMale = input.gender === 'male'
      const height = Number(input.height)
      const frame = input.frame as string
      const heightInches = height / 2.54

      // Devine formula (base)
      let devine: number
      if (isMale) {
        devine = 50 + 2.3 * (heightInches - 60)
      } else {
        devine = 45.5 + 2.3 * (heightInches - 60)
      }

      // Adjust for frame size
      const frameAdjust = frame === 'small' ? 0.9 : frame === 'large' ? 1.1 : 1
      const idealWeight = Math.round(devine * frameAdjust)
      const rangeMin = Math.round(idealWeight * 0.9)
      const rangeMax = Math.round(idealWeight * 1.1)

      return {
        primary: { value: idealWeight, label: 'Ideal Weight', unit: 'kg' },
        secondary: [
          { label: 'Healthy Range', value: `${rangeMin} - ${rangeMax}`, unit: 'kg' },
          { label: 'Frame', value: frame.charAt(0).toUpperCase() + frame.slice(1) },
        ],
        advice: 'Ideal weight varies based on muscle mass, bone density, and individual factors.',
      }
    }

    case 'protein': {
      const weight = Number(input.weight)
      const activity = input.activity as string
      const goal = input.goal as string

      const multipliers: Record<string, Record<string, number>> = {
        sedentary: { maintain: 0.8, lose: 1.0, gain: 1.2 },
        moderate: { maintain: 1.0, lose: 1.2, gain: 1.6 },
        active: { maintain: 1.2, lose: 1.4, gain: 1.8 },
        athlete: { maintain: 1.6, lose: 1.8, gain: 2.2 },
      }

      const mult = multipliers[activity]?.[goal] || 1.2
      const protein = Math.round(weight * mult)
      const rangeMin = Math.round(weight * (mult - 0.2))
      const rangeMax = Math.round(weight * (mult + 0.2))

      return {
        primary: { value: protein, label: 'Daily Protein', unit: 'g' },
        secondary: [
          { label: 'Range', value: `${rangeMin} - ${rangeMax}`, unit: 'g' },
          { label: 'Per Meal (4 meals)', value: Math.round(protein / 4), unit: 'g' },
        ],
        advice: `Based on ${mult}g per kg body weight. Spread intake across meals for optimal absorption.`,
      }
    }

    case 'ovulation': {
      const lastPeriod = new Date(input.lastPeriod as string)
      const cycleLength = Number(input.cycleLength) || 28

      // Ovulation typically occurs 14 days before next period
      const ovulationDay = new Date(lastPeriod)
      ovulationDay.setDate(ovulationDay.getDate() + cycleLength - 14)

      const fertileStart = new Date(ovulationDay)
      fertileStart.setDate(fertileStart.getDate() - 5)

      const fertileEnd = new Date(ovulationDay)
      fertileEnd.setDate(fertileEnd.getDate() + 1)

      const nextPeriod = new Date(lastPeriod)
      nextPeriod.setDate(nextPeriod.getDate() + cycleLength)

      return {
        primary: { value: ovulationDay.toLocaleDateString(), label: 'Estimated Ovulation' },
        secondary: [
          { label: 'Fertile Window Start', value: fertileStart.toLocaleDateString() },
          { label: 'Fertile Window End', value: fertileEnd.toLocaleDateString() },
          { label: 'Next Period', value: nextPeriod.toLocaleDateString() },
        ],
        advice: 'Most fertile 2-3 days before ovulation. Track multiple cycles for accuracy.',
      }
    }

    case 'due-date': {
      const lastPeriod = new Date(input.lastPeriod as string)
      const cycleLength = Number(input.cycleLength) || 28

      // Naegele's rule: LMP + 280 days, adjusted for cycle length
      const adjustment = cycleLength - 28
      const dueDate = new Date(lastPeriod)
      dueDate.setDate(dueDate.getDate() + 280 + adjustment)

      const today = new Date()
      const weeksPregnant = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24 * 7))
      const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      const trimester = weeksPregnant < 13 ? '1st' : weeksPregnant < 27 ? '2nd' : '3rd'

      return {
        primary: { value: dueDate.toLocaleDateString(), label: 'Estimated Due Date' },
        secondary: [
          { label: 'Weeks Pregnant', value: weeksPregnant },
          { label: 'Days Remaining', value: Math.max(0, daysRemaining) },
          { label: 'Trimester', value: trimester },
        ],
        advice: 'Due dates are estimates. Only 5% of babies are born on their exact due date.',
      }
    }

    case 'pregnancy': {
      const dueDate = new Date(input.dueDate as string)
      const today = new Date()

      // Calculate conception date (approximately 266 days before due date)
      const conceptionDate = new Date(dueDate)
      conceptionDate.setDate(conceptionDate.getDate() - 266)

      const totalDays = Math.floor((today.getTime() - conceptionDate.getTime()) / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(totalDays / 7)
      const days = totalDays % 7
      const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      const trimester = weeks < 13 ? '1st' : weeks < 27 ? '2nd' : '3rd'
      const progress = Math.min(100, Math.round((totalDays / 280) * 100))

      return {
        primary: { value: `${weeks}w ${days}d`, label: 'Pregnancy Progress' },
        secondary: [
          { label: 'Trimester', value: trimester },
          { label: 'Days Until Due', value: Math.max(0, daysRemaining) },
          { label: 'Progress', value: `${progress}%` },
        ],
        chartData: [
          { name: 'Completed', value: progress, color: '#10b981' },
          { name: 'Remaining', value: 100 - progress, color: '#e5e7eb' },
        ],
        advice: `You are in your ${trimester} trimester. ${weeks < 12 ? 'First prenatal visit recommended.' : weeks < 28 ? 'Regular checkups important.' : 'Preparing for delivery phase.'}`,
      }
    }

    case 'sleep': {
      const wakeTime = input.wakeTime as string
      const mode = input.mode as string

      // Parse time
      const [hours, minutes] = (wakeTime || '07:00').split(':').map(Number)
      const sleepCycles = [4.5, 6, 7.5, 9] // hours for 3, 4, 5, 6 cycles

      if (mode === 'bedtime') {
        // Calculate bedtime based on wake time
        const bedtimes = sleepCycles.map(cycleHours => {
          const bedtime = new Date()
          bedtime.setHours(hours, minutes, 0, 0)
          bedtime.setMinutes(bedtime.getMinutes() - (cycleHours * 60) - 15) // 15 min to fall asleep
          return bedtime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        })

        return {
          primary: { value: bedtimes[2], label: 'Ideal Bedtime (5 cycles)' },
          secondary: [
            { label: '6 cycles (9h)', value: bedtimes[3] },
            { label: '5 cycles (7.5h)', value: bedtimes[2] },
            { label: '4 cycles (6h)', value: bedtimes[1] },
          ],
          advice: 'Each sleep cycle is ~90 minutes. Waking between cycles helps you feel refreshed.',
        }
      } else {
        // Calculate wake time based on sleeping now
        const now = new Date()
        now.setMinutes(now.getMinutes() + 15) // 15 min to fall asleep

        const wakeOptions = sleepCycles.map(cycleHours => {
          const wake = new Date(now)
          wake.setMinutes(wake.getMinutes() + (cycleHours * 60))
          return wake.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        })

        return {
          primary: { value: wakeOptions[2], label: 'Ideal Wake Time (5 cycles)' },
          secondary: [
            { label: '4 cycles (6h)', value: wakeOptions[1] },
            { label: '5 cycles (7.5h)', value: wakeOptions[2] },
            { label: '6 cycles (9h)', value: wakeOptions[3] },
          ],
          advice: 'If sleeping now, these are optimal wake times based on sleep cycles.',
        }
      }
    }
    default:
      return null
  }
}
