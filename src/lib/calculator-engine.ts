// Generic calculator engine - handles multiple calculator types
// Uses mathjs for precision calculations

import { create, all } from 'mathjs'

const math = create(all, {
  precision: 64,
  number: 'BigNumber',
})

// Calculator input/output types
export interface CalculatorInput {
  [key: string]: number | string | boolean
}

export interface CalculatorOutput {
  primary: {
    value: number | string
    label: string
    unit?: string
  }
  secondary?: {
    label: string
    value: number | string
    unit?: string
  }[]
  breakdown?: {
    label: string
    value: number | string
    color?: string
  }[]
  advice?: string
  chartData?: { name: string; value: number; color?: string }[]
}

// Calculator configurations by type
type CalculatorType =
  | 'bmi' | 'calories' | 'tdee' | 'bmr' | 'macro' | 'body-fat' | 'ideal-weight' | 'protein'
  | 'ovulation' | 'due-date' | 'pregnancy' | 'sleep'
  | 'mortgage' | 'loan' | 'auto-loan' | 'interest' | 'compound-interest' | 'tip'
  | 'salary' | 'tax' | 'inflation' | 'budget' | 'retirement' | '401k' | 'roi' | 'amortization' | 'debt-payoff'
  | 'percent' | 'scientific' | 'fraction' | 'gpa' | 'grade' | 'quadratic' | 'slope' | 'std-dev' | 'statistics' | 'probability'
  | 'age' | 'date' | 'time' | 'hours' | 'day-counter' | 'timezone' | 'timecard' | 'countdown'
  | 'concrete' | 'sqft' | 'tile' | 'paint' | 'btu'
  | 'love' | 'random-number' | 'dice' | 'password' | 'converter'
  | 'final-grade' | 'weighted-gpa' | 'college-gpa' | 'test-score' | 'study-timer'

// Field definitions for each calculator
export interface CalculatorField {
  name: string
  label: string
  type: 'number' | 'select' | 'radio' | 'date' | 'text'
  placeholder?: string
  unit?: string
  options?: { value: string; label: string }[]
  default?: string | number
  min?: number
  max?: number
  step?: number
}

// Get input fields for a calculator type
export function getCalculatorFields(type: string): CalculatorField[] {
  const fields: Record<string, CalculatorField[]> = {
    // Health calculators
    bmi: [
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg' },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm' },
    ],
    calories: [
      { name: 'age', label: 'Age', type: 'number', placeholder: '25', unit: 'years' },
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg' },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm' },
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
      { name: 'age', label: 'Age', type: 'number', placeholder: '25' },
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg' },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm' },
      { name: 'activity', label: 'Activity Level', type: 'select', options: [
        { value: '1.2', label: 'Sedentary' },
        { value: '1.375', label: 'Light' },
        { value: '1.55', label: 'Moderate' },
        { value: '1.725', label: 'Active' },
        { value: '1.9', label: 'Very Active' },
      ], default: '1.55' },
    ],
    bmr: [
      { name: 'age', label: 'Age', type: 'number', placeholder: '25' },
      { name: 'gender', label: 'Gender', type: 'radio', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], default: 'male' },
      { name: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg' },
      { name: 'height', label: 'Height', type: 'number', placeholder: '175', unit: 'cm' },
    ],
    // Finance calculators
    mortgage: [
      { name: 'principal', label: 'Loan Amount', type: 'number', placeholder: '300000', unit: '$' },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '6.5', unit: '%', step: 0.1 },
      { name: 'years', label: 'Loan Term', type: 'number', placeholder: '30', unit: 'years' },
      { name: 'downPayment', label: 'Down Payment', type: 'number', placeholder: '60000', unit: '$' },
    ],
    loan: [
      { name: 'principal', label: 'Loan Amount', type: 'number', placeholder: '10000', unit: '$' },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '8', unit: '%', step: 0.1 },
      { name: 'months', label: 'Loan Term', type: 'number', placeholder: '36', unit: 'months' },
    ],
    tip: [
      { name: 'bill', label: 'Bill Amount', type: 'number', placeholder: '50', unit: '$' },
      { name: 'tipPercent', label: 'Tip Percentage', type: 'number', placeholder: '18', unit: '%' },
      { name: 'people', label: 'Split Between', type: 'number', placeholder: '1', default: 1 },
    ],
    // Math calculators
    percent: [
      { name: 'value', label: 'Number', type: 'number', placeholder: '50' },
      { name: 'percent', label: 'Percentage', type: 'number', placeholder: '20', unit: '%' },
      { name: 'mode', label: 'Calculation', type: 'select', options: [
        { value: 'of', label: 'X% of Y' },
        { value: 'is', label: 'X is what % of Y' },
        { value: 'change', label: '% change from X to Y' },
      ], default: 'of' },
    ],
    gpa: [
      { name: 'grades', label: 'Grades (comma-separated)', type: 'text', placeholder: 'A, B+, A-, B, A' },
      { name: 'credits', label: 'Credits (comma-separated)', type: 'text', placeholder: '3, 4, 3, 3, 4' },
    ],
    // Date calculators
    age: [
      { name: 'birthdate', label: 'Birth Date', type: 'date' },
    ],
    date: [
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
    ],
    // Construction calculators
    sqft: [
      { name: 'length', label: 'Length', type: 'number', placeholder: '20', unit: 'ft' },
      { name: 'width', label: 'Width', type: 'number', placeholder: '15', unit: 'ft' },
    ],
    paint: [
      { name: 'length', label: 'Room Length', type: 'number', placeholder: '20', unit: 'ft' },
      { name: 'width', label: 'Room Width', type: 'number', placeholder: '15', unit: 'ft' },
      { name: 'height', label: 'Wall Height', type: 'number', placeholder: '8', unit: 'ft' },
      { name: 'coats', label: 'Number of Coats', type: 'number', placeholder: '2', default: 2 },
    ],
    // Fun calculators
    'random-number': [
      { name: 'min', label: 'Minimum', type: 'number', placeholder: '1', default: 1 },
      { name: 'max', label: 'Maximum', type: 'number', placeholder: '100', default: 100 },
      { name: 'count', label: 'How Many', type: 'number', placeholder: '1', default: 1 },
    ],
    dice: [
      { name: 'sides', label: 'Dice Sides', type: 'select', options: [
        { value: '4', label: 'd4' },
        { value: '6', label: 'd6' },
        { value: '8', label: 'd8' },
        { value: '10', label: 'd10' },
        { value: '12', label: 'd12' },
        { value: '20', label: 'd20' },
      ], default: '6' },
      { name: 'count', label: 'Number of Dice', type: 'number', placeholder: '2', default: 2 },
    ],
    love: [
      { name: 'name1', label: 'Your Name', type: 'text', placeholder: 'Enter your name' },
      { name: 'name2', label: "Partner's Name", type: 'text', placeholder: "Enter partner's name" },
    ],
  }

  // Default fields for calculators not yet configured
  const defaultFields: CalculatorField[] = [
    { name: 'value1', label: 'Value 1', type: 'number', placeholder: '0' },
    { name: 'value2', label: 'Value 2', type: 'number', placeholder: '0' },
  ]

  return fields[type] || defaultFields
}

// Calculate result based on calculator type
export function calculate(type: string, input: CalculatorInput): CalculatorOutput {
  switch (type) {
    case 'bmi': {
      const weight = Number(input.weight)
      const height = Number(input.height) / 100 // cm to m
      const bmi = weight / (height * height)
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
        primary: { value: rounded, label: 'Your BMI' },
        secondary: [
          { label: 'Category', value: category },
          { label: 'Healthy Range', value: '18.5 - 24.9' },
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

      // Mifflin-St Jeor
      const bmr = isMale
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161

      const tdee = Math.round(bmr * activity)

      let target = tdee
      if (input.goal === 'lose') target = tdee - 500
      if (input.goal === 'gain') target = tdee + 300

      return {
        primary: { value: type === 'tdee' ? tdee : target, label: type === 'tdee' ? 'Daily Calories Burned' : 'Daily Calories', unit: 'kcal' },
        secondary: [
          { label: 'BMR', value: Math.round(bmr), unit: 'kcal' },
          { label: 'TDEE', value: tdee, unit: 'kcal' },
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

    case 'mortgage': {
      const principal = Number(input.principal) - Number(input.downPayment || 0)
      const monthlyRate = Number(input.rate) / 100 / 12
      const payments = Number(input.years) * 12

      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
      const totalPayment = monthlyPayment * payments
      const totalInterest = totalPayment - principal

      return {
        primary: { value: Math.round(monthlyPayment), label: 'Monthly Payment', unit: '$' },
        secondary: [
          { label: 'Loan Amount', value: principal.toLocaleString(), unit: '$' },
          { label: 'Total Interest', value: Math.round(totalInterest).toLocaleString(), unit: '$' },
          { label: 'Total Cost', value: Math.round(totalPayment).toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Principal', value: principal, color: '#10b981' },
          { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' },
        ],
      }
    }

    case 'loan': {
      const principal = Number(input.principal)
      const monthlyRate = Number(input.rate) / 100 / 12
      const payments = Number(input.months)

      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
      const totalPayment = monthlyPayment * payments
      const totalInterest = totalPayment - principal

      return {
        primary: { value: Math.round(monthlyPayment * 100) / 100, label: 'Monthly Payment', unit: '$' },
        secondary: [
          { label: 'Total Interest', value: Math.round(totalInterest * 100) / 100, unit: '$' },
          { label: 'Total Cost', value: Math.round(totalPayment * 100) / 100, unit: '$' },
        ],
      }
    }

    case 'tip': {
      const bill = Number(input.bill)
      const tipPercent = Number(input.tipPercent)
      const people = Number(input.people) || 1

      const tip = bill * (tipPercent / 100)
      const total = bill + tip
      const perPerson = total / people

      return {
        primary: { value: Math.round(tip * 100) / 100, label: 'Tip Amount', unit: '$' },
        secondary: [
          { label: 'Total', value: Math.round(total * 100) / 100, unit: '$' },
          ...(people > 1 ? [{ label: 'Per Person', value: Math.round(perPerson * 100) / 100, unit: '$' }] : []),
        ],
      }
    }

    case 'percent': {
      const value = Number(input.value)
      const percent = Number(input.percent)
      const mode = input.mode as string

      let result: number
      let label: string

      switch (mode) {
        case 'of':
          result = (percent / 100) * value
          label = `${percent}% of ${value}`
          break
        case 'is':
          result = (value / percent) * 100
          label = `${value} is ${result.toFixed(2)}% of ${percent}`
          break
        case 'change':
          result = ((percent - value) / value) * 100
          label = `% change from ${value} to ${percent}`
          break
        default:
          result = (percent / 100) * value
          label = 'Result'
      }

      return {
        primary: { value: Math.round(result * 100) / 100, label },
      }
    }

    case 'age': {
      const birthdate = new Date(input.birthdate as string)
      const today = new Date()

      let years = today.getFullYear() - birthdate.getFullYear()
      let months = today.getMonth() - birthdate.getMonth()
      let days = today.getDate() - birthdate.getDate()

      if (days < 0) {
        months--
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
      }
      if (months < 0) {
        years--
        months += 12
      }

      const totalDays = Math.floor((today.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24))

      return {
        primary: { value: years, label: 'Your Age', unit: 'years' },
        secondary: [
          { label: 'Months', value: months },
          { label: 'Days', value: days },
          { label: 'Total Days Lived', value: totalDays.toLocaleString() },
        ],
      }
    }

    case 'date': {
      const start = new Date(input.startDate as string)
      const end = new Date(input.endDate as string)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.floor(diffDays / 30.44)

      return {
        primary: { value: diffDays, label: 'Days Between', unit: 'days' },
        secondary: [
          { label: 'Weeks', value: diffWeeks },
          { label: 'Months (approx)', value: diffMonths },
        ],
      }
    }

    case 'sqft': {
      const length = Number(input.length)
      const width = Number(input.width)
      const sqft = length * width

      return {
        primary: { value: sqft, label: 'Area', unit: 'sq ft' },
        secondary: [
          { label: 'Square Meters', value: Math.round(sqft * 0.0929 * 100) / 100, unit: 'm²' },
          { label: 'Square Yards', value: Math.round(sqft / 9 * 100) / 100, unit: 'sq yd' },
        ],
      }
    }

    case 'paint': {
      const length = Number(input.length)
      const width = Number(input.width)
      const height = Number(input.height)
      const coats = Number(input.coats) || 2

      const wallArea = 2 * (length + width) * height
      const coveragePerGallon = 350 // sq ft per gallon
      const gallons = Math.ceil((wallArea * coats) / coveragePerGallon)

      return {
        primary: { value: gallons, label: 'Gallons Needed', unit: 'gallons' },
        secondary: [
          { label: 'Wall Area', value: Math.round(wallArea), unit: 'sq ft' },
          { label: 'Coverage Needed', value: Math.round(wallArea * coats), unit: 'sq ft' },
        ],
        advice: `Based on ${coveragePerGallon} sq ft coverage per gallon with ${coats} coats`,
      }
    }

    case 'random-number': {
      const min = Number(input.min)
      const max = Number(input.max)
      const count = Number(input.count) || 1

      const numbers: number[] = []
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }

      return {
        primary: { value: numbers.join(', '), label: count === 1 ? 'Random Number' : 'Random Numbers' },
        secondary: [
          { label: 'Range', value: `${min} - ${max}` },
        ],
      }
    }

    case 'dice': {
      const sides = Number(input.sides)
      const count = Number(input.count) || 1

      const rolls: number[] = []
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1)
      }

      const total = rolls.reduce((a, b) => a + b, 0)

      return {
        primary: { value: total, label: 'Total' },
        secondary: [
          { label: 'Rolls', value: rolls.join(', ') },
          { label: 'Dice', value: `${count}d${sides}` },
        ],
      }
    }

    case 'love': {
      const name1 = (input.name1 as string || '').toLowerCase().replace(/[^a-z]/g, '')
      const name2 = (input.name2 as string || '').toLowerCase().replace(/[^a-z]/g, '')

      if (!name1 || !name2) {
        return { primary: { value: '?', label: 'Enter both names!' } }
      }

      // Fun algorithm based on letter frequencies
      const combined = name1 + 'loves' + name2
      let hash = 0
      for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i)
        hash = hash & hash
      }
      const compatibility = Math.abs(hash % 101)

      let message: string
      if (compatibility >= 80) message = 'Amazing match! 💕'
      else if (compatibility >= 60) message = 'Great potential! 💜'
      else if (compatibility >= 40) message = 'Worth exploring! 💙'
      else message = 'Opposites attract? 🤔'

      return {
        primary: { value: compatibility, label: 'Love Score', unit: '%' },
        advice: message,
      }
    }

    default:
      return {
        primary: { value: 'Coming soon!', label: 'Result' },
        advice: 'This calculator is being developed.',
      }
  }
}
