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
    // Finance calculators
    mortgage: [
      { name: 'principal', label: 'Loan Amount', type: 'number', placeholder: '300000', unit: '$', default: 300000 },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '6.5', unit: '%', step: 0.1, default: 6.5 },
      { name: 'years', label: 'Loan Term', type: 'number', placeholder: '30', unit: 'years', default: 30 },
      { name: 'downPayment', label: 'Down Payment', type: 'number', placeholder: '60000', unit: '$', default: 60000 },
    ],
    loan: [
      { name: 'principal', label: 'Loan Amount', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '8', unit: '%', step: 0.1, default: 8 },
      { name: 'months', label: 'Loan Term', type: 'number', placeholder: '36', unit: 'months', default: 36 },
    ],
    tip: [
      { name: 'bill', label: 'Bill Amount', type: 'number', placeholder: '50', unit: '$', default: 50 },
      { name: 'tipPercent', label: 'Tip Percentage', type: 'number', placeholder: '18', unit: '%', default: 18 },
      { name: 'people', label: 'Split Between', type: 'number', placeholder: '1', default: 1 },
    ],
    'auto-loan': [
      { name: 'price', label: 'Vehicle Price', type: 'number', placeholder: '35000', unit: '$', default: 35000 },
      { name: 'downPayment', label: 'Down Payment', type: 'number', placeholder: '5000', unit: '$', default: 5000 },
      { name: 'tradeIn', label: 'Trade-in Value', type: 'number', placeholder: '0', unit: '$', default: 0 },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '6.5', unit: '%', step: 0.1, default: 6.5 },
      { name: 'months', label: 'Loan Term', type: 'select', options: [
        { value: '36', label: '36 months' },
        { value: '48', label: '48 months' },
        { value: '60', label: '60 months' },
        { value: '72', label: '72 months' },
      ], default: '60' },
    ],
    interest: [
      { name: 'principal', label: 'Principal', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', placeholder: '5', unit: '%', step: 0.1, default: 5 },
      { name: 'time', label: 'Time Period', type: 'number', placeholder: '5', unit: 'years', default: 5 },
    ],
    compound: [
      { name: 'principal', label: 'Initial Investment', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', placeholder: '7', unit: '%', step: 0.1, default: 7 },
      { name: 'years', label: 'Time Period', type: 'number', placeholder: '10', unit: 'years', default: 10 },
      { name: 'contribution', label: 'Monthly Contribution', type: 'number', placeholder: '500', unit: '$', default: 500 },
      { name: 'frequency', label: 'Compound Frequency', type: 'select', options: [
        { value: '1', label: 'Annually' },
        { value: '4', label: 'Quarterly' },
        { value: '12', label: 'Monthly' },
        { value: '365', label: 'Daily' },
      ], default: '12' },
    ],
    salary: [
      { name: 'amount', label: 'Amount', type: 'number', placeholder: '25', unit: '$', default: 25 },
      { name: 'type', label: 'Type', type: 'select', options: [
        { value: 'hourly', label: 'Hourly Rate' },
        { value: 'weekly', label: 'Weekly Salary' },
        { value: 'biweekly', label: 'Bi-weekly Salary' },
        { value: 'monthly', label: 'Monthly Salary' },
        { value: 'annual', label: 'Annual Salary' },
      ], default: 'hourly' },
      { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', placeholder: '40', default: 40 },
    ],
    tax: [
      { name: 'income', label: 'Annual Income', type: 'number', placeholder: '75000', unit: '$', default: 75000 },
      { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
        { value: 'single', label: 'Single' },
        { value: 'married', label: 'Married Filing Jointly' },
        { value: 'head', label: 'Head of Household' },
      ], default: 'single' },
      { name: 'deductions', label: 'Deductions', type: 'number', placeholder: '14600', unit: '$', default: 14600 },
    ],
    inflation: [
      { name: 'amount', label: 'Current Amount', type: 'number', placeholder: '100', unit: '$', default: 100 },
      { name: 'rate', label: 'Inflation Rate', type: 'number', placeholder: '3', unit: '%', step: 0.1, default: 3 },
      { name: 'years', label: 'Years', type: 'number', placeholder: '10', default: 10 },
    ],
    budget: [
      { name: 'income', label: 'Monthly Income', type: 'number', placeholder: '5000', unit: '$', default: 5000 },
      { name: 'method', label: 'Budget Method', type: 'select', options: [
        { value: '50-30-20', label: '50/30/20 Rule' },
        { value: '60-20-20', label: '60/20/20 Rule' },
        { value: '70-20-10', label: '70/20/10 Rule' },
      ], default: '50-30-20' },
    ],
    retirement: [
      { name: 'currentAge', label: 'Current Age', type: 'number', placeholder: '30', default: 30 },
      { name: 'retireAge', label: 'Retirement Age', type: 'number', placeholder: '65', default: 65 },
      { name: 'currentSavings', label: 'Current Savings', type: 'number', placeholder: '50000', unit: '$', default: 50000 },
      { name: 'monthlyContrib', label: 'Monthly Contribution', type: 'number', placeholder: '500', unit: '$', default: 500 },
      { name: 'returnRate', label: 'Expected Return', type: 'number', placeholder: '7', unit: '%', step: 0.1, default: 7 },
    ],
    '401k': [
      { name: 'salary', label: 'Annual Salary', type: 'number', placeholder: '75000', unit: '$', default: 75000 },
      { name: 'contribution', label: 'Your Contribution', type: 'number', placeholder: '6', unit: '%', default: 6 },
      { name: 'employerMatch', label: 'Employer Match', type: 'number', placeholder: '50', unit: '%', default: 50 },
      { name: 'matchLimit', label: 'Match Limit', type: 'number', placeholder: '6', unit: '%', default: 6 },
      { name: 'years', label: 'Years to Retirement', type: 'number', placeholder: '30', default: 30 },
      { name: 'returnRate', label: 'Expected Return', type: 'number', placeholder: '7', unit: '%', step: 0.1, default: 7 },
    ],
    roi: [
      { name: 'initialInvestment', label: 'Initial Investment', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'finalValue', label: 'Final Value', type: 'number', placeholder: '15000', unit: '$', default: 15000 },
      { name: 'years', label: 'Investment Period', type: 'number', placeholder: '5', unit: 'years', default: 5 },
    ],
    amortization: [
      { name: 'principal', label: 'Loan Amount', type: 'number', placeholder: '200000', unit: '$', default: 200000 },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', placeholder: '6', unit: '%', step: 0.1, default: 6 },
      { name: 'years', label: 'Loan Term', type: 'number', placeholder: '30', unit: 'years', default: 30 },
      { name: 'extraPayment', label: 'Extra Monthly Payment', type: 'number', placeholder: '0', unit: '$', default: 0 },
    ],
    'debt-payoff': [
      { name: 'totalDebt', label: 'Total Debt', type: 'number', placeholder: '25000', unit: '$', default: 25000 },
      { name: 'interestRate', label: 'Average Interest Rate', type: 'number', placeholder: '18', unit: '%', step: 0.1, default: 18 },
      { name: 'monthlyPayment', label: 'Monthly Payment', type: 'number', placeholder: '500', unit: '$', default: 500 },
    ],
    // Math calculators
    percent: [
      { name: 'value', label: 'Number', type: 'number', placeholder: '50', default: 50 },
      { name: 'percent', label: 'Percentage', type: 'number', placeholder: '20', unit: '%', default: 20 },
      { name: 'mode', label: 'Calculation', type: 'select', options: [
        { value: 'of', label: 'X% of Y' },
        { value: 'is', label: 'X is what % of Y' },
        { value: 'change', label: '% change from X to Y' },
      ], default: 'of' },
    ],
    scientific: [
      { name: 'expression', label: 'Expression', type: 'text', placeholder: '2^10 or sqrt(144)', default: '2^10' },
    ],
    fraction: [
      { name: 'num1', label: 'Numerator 1', type: 'number', placeholder: '1', default: 1 },
      { name: 'den1', label: 'Denominator 1', type: 'number', placeholder: '2', default: 2 },
      { name: 'operation', label: 'Operation', type: 'select', options: [
        { value: 'add', label: 'Add (+)' },
        { value: 'subtract', label: 'Subtract (-)' },
        { value: 'multiply', label: 'Multiply (×)' },
        { value: 'divide', label: 'Divide (÷)' },
        { value: 'simplify', label: 'Simplify' },
        { value: 'toDecimal', label: 'To Decimal' },
      ], default: 'add' },
      { name: 'num2', label: 'Numerator 2', type: 'number', placeholder: '1', default: 1 },
      { name: 'den2', label: 'Denominator 2', type: 'number', placeholder: '4', default: 4 },
    ],
    gpa: [
      { name: 'grades', label: 'Grades (comma-separated)', type: 'text', placeholder: 'A, B+, A-, B, A', default: 'A, B+, A-, B, A' },
      { name: 'credits', label: 'Credits (comma-separated)', type: 'text', placeholder: '3, 4, 3, 3, 4', default: '3, 4, 3, 3, 4' },
    ],
    grade: [
      { name: 'earned', label: 'Points Earned', type: 'number', placeholder: '85', default: 85 },
      { name: 'possible', label: 'Points Possible', type: 'number', placeholder: '100', default: 100 },
    ],
    quadratic: [
      { name: 'a', label: 'a (x² coefficient)', type: 'number', placeholder: '1', default: 1 },
      { name: 'b', label: 'b (x coefficient)', type: 'number', placeholder: '-5', default: -5 },
      { name: 'c', label: 'c (constant)', type: 'number', placeholder: '6', default: 6 },
    ],
    slope: [
      { name: 'x1', label: 'X₁', type: 'number', placeholder: '0', default: 0 },
      { name: 'y1', label: 'Y₁', type: 'number', placeholder: '0', default: 0 },
      { name: 'x2', label: 'X₂', type: 'number', placeholder: '4', default: 4 },
      { name: 'y2', label: 'Y₂', type: 'number', placeholder: '8', default: 8 },
    ],
    'std-dev': [
      { name: 'numbers', label: 'Numbers (comma-separated)', type: 'text', placeholder: '10, 12, 23, 23, 16, 23, 21, 16', default: '10, 12, 23, 23, 16, 23, 21, 16' },
      { name: 'type', label: 'Type', type: 'radio', options: [
        { value: 'sample', label: 'Sample (n-1)' },
        { value: 'population', label: 'Population (n)' },
      ], default: 'sample' },
    ],
    statistics: [
      { name: 'numbers', label: 'Numbers (comma-separated)', type: 'text', placeholder: '10, 12, 23, 23, 16, 23, 21, 16', default: '10, 12, 23, 23, 16, 23, 21, 16' },
    ],
    probability: [
      { name: 'favorable', label: 'Favorable Outcomes', type: 'number', placeholder: '3', default: 3 },
      { name: 'total', label: 'Total Outcomes', type: 'number', placeholder: '10', default: 10 },
      { name: 'trials', label: 'Number of Trials', type: 'number', placeholder: '1', default: 1 },
    ],
    // Date calculators
    age: [
      { name: 'birthdate', label: 'Birth Date', type: 'date' },
    ],
    date: [
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
    ],
    time: [
      { name: 'hours1', label: 'Hours', type: 'number', placeholder: '2', default: 0 },
      { name: 'minutes1', label: 'Minutes', type: 'number', placeholder: '30', default: 0 },
      { name: 'seconds1', label: 'Seconds', type: 'number', placeholder: '0', default: 0 },
      { name: 'operation', label: 'Operation', type: 'select', options: [
        { value: 'add', label: 'Add Time' },
        { value: 'subtract', label: 'Subtract Time' },
        { value: 'convert', label: 'Convert to...' },
      ], default: 'add' },
      { name: 'hours2', label: 'Hours to Add/Sub', type: 'number', placeholder: '1', default: 0 },
      { name: 'minutes2', label: 'Minutes to Add/Sub', type: 'number', placeholder: '45', default: 0 },
    ],
    hours: [
      { name: 'startTime', label: 'Start Time', type: 'text', placeholder: '09:00', default: '09:00' },
      { name: 'endTime', label: 'End Time', type: 'text', placeholder: '17:00', default: '17:00' },
      { name: 'breakMinutes', label: 'Break Duration', type: 'number', placeholder: '30', unit: 'min', default: 0 },
    ],
    'day-counter': [
      { name: 'targetDate', label: 'Target Date', type: 'date' },
      { name: 'includeEndDate', label: 'Include End Date', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'no' },
    ],
    timezone: [
      { name: 'time', label: 'Time', type: 'text', placeholder: '14:00' },
      { name: 'fromZone', label: 'From Timezone', type: 'select', options: [
        { value: '-12', label: 'UTC-12 (Baker Island)' },
        { value: '-11', label: 'UTC-11 (Samoa)' },
        { value: '-10', label: 'UTC-10 (Hawaii)' },
        { value: '-9', label: 'UTC-9 (Alaska)' },
        { value: '-8', label: 'UTC-8 (Pacific/LA)' },
        { value: '-7', label: 'UTC-7 (Mountain)' },
        { value: '-6', label: 'UTC-6 (Central)' },
        { value: '-5', label: 'UTC-5 (Eastern/NY)' },
        { value: '-4', label: 'UTC-4 (Atlantic)' },
        { value: '-3', label: 'UTC-3 (Brazil)' },
        { value: '0', label: 'UTC+0 (London)' },
        { value: '1', label: 'UTC+1 (Paris)' },
        { value: '2', label: 'UTC+2 (Cairo)' },
        { value: '3', label: 'UTC+3 (Moscow)' },
        { value: '4', label: 'UTC+4 (Dubai)' },
        { value: '5', label: 'UTC+5 (Pakistan)' },
        { value: '5.5', label: 'UTC+5:30 (India)' },
        { value: '6', label: 'UTC+6 (Bangladesh)' },
        { value: '7', label: 'UTC+7 (Bangkok)' },
        { value: '8', label: 'UTC+8 (Singapore/China)' },
        { value: '9', label: 'UTC+9 (Tokyo)' },
        { value: '10', label: 'UTC+10 (Sydney)' },
        { value: '12', label: 'UTC+12 (Auckland)' },
      ], default: '-5' },
      { name: 'toZone', label: 'To Timezone', type: 'select', options: [
        { value: '-12', label: 'UTC-12 (Baker Island)' },
        { value: '-11', label: 'UTC-11 (Samoa)' },
        { value: '-10', label: 'UTC-10 (Hawaii)' },
        { value: '-9', label: 'UTC-9 (Alaska)' },
        { value: '-8', label: 'UTC-8 (Pacific/LA)' },
        { value: '-7', label: 'UTC-7 (Mountain)' },
        { value: '-6', label: 'UTC-6 (Central)' },
        { value: '-5', label: 'UTC-5 (Eastern/NY)' },
        { value: '-4', label: 'UTC-4 (Atlantic)' },
        { value: '-3', label: 'UTC-3 (Brazil)' },
        { value: '0', label: 'UTC+0 (London)' },
        { value: '1', label: 'UTC+1 (Paris)' },
        { value: '2', label: 'UTC+2 (Cairo)' },
        { value: '3', label: 'UTC+3 (Moscow)' },
        { value: '4', label: 'UTC+4 (Dubai)' },
        { value: '5', label: 'UTC+5 (Pakistan)' },
        { value: '5.5', label: 'UTC+5:30 (India)' },
        { value: '6', label: 'UTC+6 (Bangladesh)' },
        { value: '7', label: 'UTC+7 (Bangkok)' },
        { value: '8', label: 'UTC+8 (Singapore/China)' },
        { value: '9', label: 'UTC+9 (Tokyo)' },
        { value: '10', label: 'UTC+10 (Sydney)' },
        { value: '12', label: 'UTC+12 (Auckland)' },
      ], default: '0' },
    ],
    timecard: [
      { name: 'entries', label: 'Time Entries (start-end, one per line)', type: 'text', placeholder: '09:00-12:30, 13:00-17:00' },
      { name: 'hourlyRate', label: 'Hourly Rate (optional)', type: 'number', placeholder: '25', unit: '$' },
    ],
    countdown: [
      { name: 'eventDate', label: 'Event Date', type: 'date' },
      { name: 'eventTime', label: 'Event Time (optional)', type: 'text', placeholder: '00:00' },
      { name: 'eventName', label: 'Event Name', type: 'text', placeholder: 'My Event' },
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
    concrete: [
      { name: 'length', label: 'Length', type: 'number', placeholder: '10', unit: 'ft' },
      { name: 'width', label: 'Width', type: 'number', placeholder: '10', unit: 'ft' },
      { name: 'depth', label: 'Depth/Thickness', type: 'number', placeholder: '4', unit: 'inches' },
    ],
    tile: [
      { name: 'areaLength', label: 'Area Length', type: 'number', placeholder: '10', unit: 'ft' },
      { name: 'areaWidth', label: 'Area Width', type: 'number', placeholder: '8', unit: 'ft' },
      { name: 'tileLength', label: 'Tile Length', type: 'number', placeholder: '12', unit: 'inches' },
      { name: 'tileWidth', label: 'Tile Width', type: 'number', placeholder: '12', unit: 'inches' },
      { name: 'gap', label: 'Gap/Spacing', type: 'number', placeholder: '0.125', unit: 'inches', default: 0.125 },
      { name: 'waste', label: 'Waste Factor', type: 'number', placeholder: '10', unit: '%', default: 10 },
    ],
    btu: [
      { name: 'squareFeet', label: 'Room Size', type: 'number', placeholder: '300', unit: 'sq ft' },
      { name: 'ceilingHeight', label: 'Ceiling Height', type: 'number', placeholder: '8', unit: 'ft', default: 8 },
      { name: 'insulation', label: 'Insulation', type: 'select', options: [
        { value: 'poor', label: 'Poor' },
        { value: 'average', label: 'Average' },
        { value: 'good', label: 'Good' },
      ], default: 'average' },
      { name: 'climate', label: 'Climate', type: 'select', options: [
        { value: 'hot', label: 'Hot/Humid' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'cold', label: 'Cold' },
      ], default: 'moderate' },
      { name: 'mode', label: 'Mode', type: 'radio', options: [
        { value: 'cooling', label: 'Cooling (AC)' },
        { value: 'heating', label: 'Heating' },
      ], default: 'cooling' },
    ],
    password: [
      { name: 'length', label: 'Password Length', type: 'number', placeholder: '16', default: 16, min: 8, max: 128 },
      { name: 'uppercase', label: 'Include Uppercase', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
      { name: 'lowercase', label: 'Include Lowercase', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
      { name: 'numbers', label: 'Include Numbers', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
      { name: 'symbols', label: 'Include Symbols', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
    ],
    converter: [
      { name: 'value', label: 'Value', type: 'number', placeholder: '100' },
      { name: 'category', label: 'Category', type: 'select', options: [
        { value: 'length', label: 'Length' },
        { value: 'weight', label: 'Weight' },
        { value: 'temperature', label: 'Temperature' },
        { value: 'volume', label: 'Volume' },
        { value: 'area', label: 'Area' },
        { value: 'speed', label: 'Speed' },
      ], default: 'length' },
      { name: 'from', label: 'From Unit', type: 'text', placeholder: 'meters' },
      { name: 'to', label: 'To Unit', type: 'text', placeholder: 'feet' },
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
    // Education calculators
    'final-grade': [
      { name: 'currentGrade', label: 'Current Grade', type: 'number', placeholder: '85', unit: '%' },
      { name: 'desiredGrade', label: 'Desired Grade', type: 'number', placeholder: '90', unit: '%' },
      { name: 'finalWeight', label: 'Final Exam Weight', type: 'number', placeholder: '20', unit: '%' },
    ],
    'weighted-gpa': [
      { name: 'grades', label: 'Grades (comma-separated)', type: 'text', placeholder: 'A, B+, A-, B' },
      { name: 'credits', label: 'Credits (comma-separated)', type: 'text', placeholder: '4, 3, 3, 4' },
      { name: 'weights', label: 'Weights: AP/H/R (comma-separated)', type: 'text', placeholder: 'AP, H, R, AP' },
    ],
    'college-gpa': [
      { name: 'grades', label: 'Grades (comma-separated)', type: 'text', placeholder: 'A, B+, A-, C+' },
      { name: 'credits', label: 'Credit Hours (comma-separated)', type: 'text', placeholder: '3, 4, 3, 3' },
      { name: 'currentGpa', label: 'Current GPA (optional)', type: 'number', placeholder: '3.5' },
      { name: 'currentCredits', label: 'Current Credits (optional)', type: 'number', placeholder: '60' },
    ],
    'test-score': [
      { name: 'correct', label: 'Correct Answers', type: 'number', placeholder: '42' },
      { name: 'total', label: 'Total Questions', type: 'number', placeholder: '50' },
      { name: 'scale', label: 'Grading Scale', type: 'select', options: [
        { value: 'standard', label: 'Standard (A=90+)' },
        { value: 'strict', label: 'Strict (A=93+)' },
        { value: 'lenient', label: 'Lenient (A=85+)' },
      ], default: 'standard' },
    ],
    'study-timer': [
      { name: 'studyMinutes', label: 'Study Duration', type: 'number', placeholder: '25', unit: 'min', default: 25 },
      { name: 'breakMinutes', label: 'Break Duration', type: 'number', placeholder: '5', unit: 'min', default: 5 },
      { name: 'sessions', label: 'Number of Sessions', type: 'number', placeholder: '4', default: 4 },
      { name: 'longBreak', label: 'Long Break', type: 'number', placeholder: '15', unit: 'min', default: 15 },
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

    case 'auto-loan': {
      const price = Number(input.price)
      const downPayment = Number(input.downPayment) || 0
      const tradeIn = Number(input.tradeIn) || 0
      const rate = Number(input.rate) / 100 / 12
      const months = Number(input.months)

      const principal = price - downPayment - tradeIn
      const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      const totalPayment = monthlyPayment * months
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

    case 'interest': {
      const principal = Number(input.principal)
      const rate = Number(input.rate) / 100
      const time = Number(input.time)

      const interest = principal * rate * time
      const total = principal + interest

      return {
        primary: { value: Math.round(interest * 100) / 100, label: 'Simple Interest', unit: '$' },
        secondary: [
          { label: 'Total Amount', value: Math.round(total * 100) / 100, unit: '$' },
          { label: 'Interest per Year', value: Math.round(interest / time * 100) / 100, unit: '$' },
        ],
        advice: 'Simple interest is calculated only on the principal amount.',
      }
    }

    case 'compound': {
      const principal = Number(input.principal)
      const rate = Number(input.rate) / 100
      const years = Number(input.years)
      const contribution = Number(input.contribution) || 0
      const frequency = Number(input.frequency)

      // Compound interest formula with contributions
      const r = rate / frequency
      const n = frequency * years
      const compoundInterest = principal * Math.pow(1 + r, n)

      // Future value of series (contributions)
      const contributionValue = contribution * 12 * ((Math.pow(1 + rate / 12, years * 12) - 1) / (rate / 12))

      const totalValue = Math.round(compoundInterest + contributionValue)
      const totalContributions = principal + (contribution * 12 * years)
      const totalInterestEarned = totalValue - totalContributions

      return {
        primary: { value: totalValue.toLocaleString(), label: 'Future Value', unit: '$' },
        secondary: [
          { label: 'Total Contributions', value: totalContributions.toLocaleString(), unit: '$' },
          { label: 'Interest Earned', value: totalInterestEarned.toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Contributions', value: totalContributions, color: '#3b82f6' },
          { name: 'Interest', value: totalInterestEarned, color: '#10b981' },
        ],
        advice: 'Compound interest grows exponentially over time. Start early for maximum benefit.',
      }
    }

    case 'salary': {
      const amount = Number(input.amount)
      const type = input.type as string
      const hoursPerWeek = Number(input.hoursPerWeek) || 40

      let hourly: number, weekly: number, biweekly: number, monthly: number, annual: number

      switch (type) {
        case 'hourly':
          hourly = amount
          weekly = amount * hoursPerWeek
          biweekly = weekly * 2
          monthly = annual = weekly * 52 / 12
          annual = weekly * 52
          break
        case 'weekly':
          weekly = amount
          hourly = amount / hoursPerWeek
          biweekly = amount * 2
          monthly = amount * 52 / 12
          annual = amount * 52
          break
        case 'biweekly':
          biweekly = amount
          weekly = amount / 2
          hourly = weekly / hoursPerWeek
          monthly = amount * 26 / 12
          annual = amount * 26
          break
        case 'monthly':
          monthly = amount
          annual = amount * 12
          weekly = annual / 52
          biweekly = weekly * 2
          hourly = weekly / hoursPerWeek
          break
        case 'annual':
        default:
          annual = amount
          monthly = amount / 12
          weekly = amount / 52
          biweekly = weekly * 2
          hourly = weekly / hoursPerWeek
      }

      return {
        primary: { value: Math.round(annual).toLocaleString(), label: 'Annual Salary', unit: '$' },
        secondary: [
          { label: 'Monthly', value: Math.round(monthly).toLocaleString(), unit: '$' },
          { label: 'Bi-weekly', value: Math.round(biweekly).toLocaleString(), unit: '$' },
          { label: 'Hourly', value: Math.round(hourly * 100) / 100, unit: '$' },
        ],
      }
    }

    case 'tax': {
      const income = Number(input.income)
      const status = input.filingStatus as string
      const deductions = Number(input.deductions) || 14600

      const taxableIncome = Math.max(0, income - deductions)

      // 2024 US Federal Tax Brackets (simplified)
      const brackets: Record<string, { rate: number; min: number; max: number }[]> = {
        single: [
          { rate: 0.10, min: 0, max: 11600 },
          { rate: 0.12, min: 11600, max: 47150 },
          { rate: 0.22, min: 47150, max: 100525 },
          { rate: 0.24, min: 100525, max: 191950 },
          { rate: 0.32, min: 191950, max: 243725 },
          { rate: 0.35, min: 243725, max: 609350 },
          { rate: 0.37, min: 609350, max: Infinity },
        ],
        married: [
          { rate: 0.10, min: 0, max: 23200 },
          { rate: 0.12, min: 23200, max: 94300 },
          { rate: 0.22, min: 94300, max: 201050 },
          { rate: 0.24, min: 201050, max: 383900 },
          { rate: 0.32, min: 383900, max: 487450 },
          { rate: 0.35, min: 487450, max: 731200 },
          { rate: 0.37, min: 731200, max: Infinity },
        ],
        head: [
          { rate: 0.10, min: 0, max: 16550 },
          { rate: 0.12, min: 16550, max: 63100 },
          { rate: 0.22, min: 63100, max: 100500 },
          { rate: 0.24, min: 100500, max: 191950 },
          { rate: 0.32, min: 191950, max: 243700 },
          { rate: 0.35, min: 243700, max: 609350 },
          { rate: 0.37, min: 609350, max: Infinity },
        ],
      }

      let tax = 0
      let remaining = taxableIncome
      const statusBrackets = brackets[status] || brackets.single

      for (const bracket of statusBrackets) {
        if (remaining <= 0) break
        const taxableInBracket = Math.min(remaining, bracket.max - bracket.min)
        tax += taxableInBracket * bracket.rate
        remaining -= taxableInBracket
      }

      const effectiveRate = (tax / income) * 100
      const takeHome = income - tax

      return {
        primary: { value: Math.round(tax).toLocaleString(), label: 'Estimated Federal Tax', unit: '$' },
        secondary: [
          { label: 'Effective Rate', value: `${effectiveRate.toFixed(1)}%` },
          { label: 'Take Home', value: Math.round(takeHome).toLocaleString(), unit: '$' },
          { label: 'Monthly Take Home', value: Math.round(takeHome / 12).toLocaleString(), unit: '$' },
        ],
        advice: 'This is a simplified estimate. Consult a tax professional for accurate calculations.',
      }
    }

    case 'inflation': {
      const amount = Number(input.amount)
      const rate = Number(input.rate) / 100
      const years = Number(input.years)

      const futureValue = amount * Math.pow(1 + rate, years)
      const purchasingPower = amount / Math.pow(1 + rate, years)
      const totalInflation = ((futureValue - amount) / amount) * 100

      return {
        primary: { value: Math.round(futureValue * 100) / 100, label: 'Future Cost', unit: '$' },
        secondary: [
          { label: 'Purchasing Power', value: Math.round(purchasingPower * 100) / 100, unit: '$' },
          { label: 'Total Inflation', value: `${totalInflation.toFixed(1)}%` },
        ],
        advice: `$${amount} today will be worth $${purchasingPower.toFixed(2)} in ${years} years due to inflation.`,
      }
    }

    case 'budget': {
      const income = Number(input.income)
      const method = input.method as string

      const splits: Record<string, { needs: number; wants: number; savings: number }> = {
        '50-30-20': { needs: 50, wants: 30, savings: 20 },
        '60-20-20': { needs: 60, wants: 20, savings: 20 },
        '70-20-10': { needs: 70, wants: 20, savings: 10 },
      }

      const split = splits[method] || splits['50-30-20']
      const needs = Math.round(income * split.needs / 100)
      const wants = Math.round(income * split.wants / 100)
      const savings = Math.round(income * split.savings / 100)

      return {
        primary: { value: income.toLocaleString(), label: 'Monthly Income', unit: '$' },
        breakdown: [
          { label: `Needs (${split.needs}%)`, value: `$${needs.toLocaleString()}`, color: '#ef4444' },
          { label: `Wants (${split.wants}%)`, value: `$${wants.toLocaleString()}`, color: '#3b82f6' },
          { label: `Savings (${split.savings}%)`, value: `$${savings.toLocaleString()}`, color: '#10b981' },
        ],
        chartData: [
          { name: 'Needs', value: needs, color: '#ef4444' },
          { name: 'Wants', value: wants, color: '#3b82f6' },
          { name: 'Savings', value: savings, color: '#10b981' },
        ],
        advice: 'Needs: rent, utilities, groceries. Wants: dining, entertainment. Savings: emergency fund, investments.',
      }
    }

    case 'retirement': {
      const currentAge = Number(input.currentAge)
      const retireAge = Number(input.retireAge)
      const currentSavings = Number(input.currentSavings)
      const monthlyContrib = Number(input.monthlyContrib)
      const returnRate = Number(input.returnRate) / 100

      const yearsToRetire = retireAge - currentAge
      const monthlyRate = returnRate / 12
      const months = yearsToRetire * 12

      // Future value of current savings
      const fvCurrent = currentSavings * Math.pow(1 + returnRate, yearsToRetire)

      // Future value of contributions
      const fvContrib = monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

      const totalSavings = Math.round(fvCurrent + fvContrib)
      const totalContributions = currentSavings + (monthlyContrib * months)
      const interestEarned = totalSavings - totalContributions

      // 4% rule for retirement income
      const monthlyRetirementIncome = Math.round((totalSavings * 0.04) / 12)

      return {
        primary: { value: totalSavings.toLocaleString(), label: 'Retirement Savings', unit: '$' },
        secondary: [
          { label: 'Monthly Retirement Income', value: monthlyRetirementIncome.toLocaleString(), unit: '$' },
          { label: 'Total Contributions', value: totalContributions.toLocaleString(), unit: '$' },
          { label: 'Interest Earned', value: interestEarned.toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Contributions', value: totalContributions, color: '#3b82f6' },
          { name: 'Growth', value: interestEarned, color: '#10b981' },
        ],
        advice: 'Based on 4% safe withdrawal rate. Adjust for inflation and personal circumstances.',
      }
    }

    case '401k': {
      const salary = Number(input.salary)
      const contribution = Number(input.contribution) / 100
      const employerMatch = Number(input.employerMatch) / 100
      const matchLimit = Number(input.matchLimit) / 100
      const years = Number(input.years)
      const returnRate = Number(input.returnRate) / 100

      const annualContrib = salary * contribution
      const matchedAmount = Math.min(contribution, matchLimit) * salary * employerMatch
      const totalAnnualContrib = annualContrib + matchedAmount

      // Future value with contributions
      const fv = totalAnnualContrib * ((Math.pow(1 + returnRate, years) - 1) / returnRate) * (1 + returnRate)

      const totalContributions = totalAnnualContrib * years
      const interestEarned = fv - totalContributions

      return {
        primary: { value: Math.round(fv).toLocaleString(), label: 'Future Value', unit: '$' },
        secondary: [
          { label: 'Your Annual Contribution', value: Math.round(annualContrib).toLocaleString(), unit: '$' },
          { label: 'Employer Match', value: Math.round(matchedAmount).toLocaleString(), unit: '$' },
          { label: 'Free Money (Total Match)', value: Math.round(matchedAmount * years).toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Your Contributions', value: Math.round(annualContrib * years), color: '#3b82f6' },
          { name: 'Employer Match', value: Math.round(matchedAmount * years), color: '#8b5cf6' },
          { name: 'Growth', value: Math.round(interestEarned), color: '#10b981' },
        ],
        advice: 'Always contribute at least enough to get the full employer match - it\'s free money!',
      }
    }

    case 'roi': {
      const initial = Number(input.initialInvestment)
      const final = Number(input.finalValue)
      const years = Number(input.years)

      const roi = ((final - initial) / initial) * 100
      const annualizedRoi = (Math.pow(final / initial, 1 / years) - 1) * 100
      const profit = final - initial

      return {
        primary: { value: `${roi.toFixed(2)}%`, label: 'Total ROI' },
        secondary: [
          { label: 'Annualized ROI', value: `${annualizedRoi.toFixed(2)}%` },
          { label: 'Total Profit', value: profit.toLocaleString(), unit: '$' },
          { label: 'Profit per Year', value: Math.round(profit / years).toLocaleString(), unit: '$' },
        ],
        advice: roi > 0 ? 'Positive return on investment.' : 'Investment resulted in a loss.',
      }
    }

    case 'amortization': {
      const principal = Number(input.principal)
      const rate = Number(input.rate) / 100 / 12
      const years = Number(input.years)
      const extraPayment = Number(input.extraPayment) || 0

      const months = years * 12
      const basePayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      const monthlyPayment = basePayment + extraPayment

      // Calculate payoff with extra payments
      let balance = principal
      let totalInterest = 0
      let payoffMonths = 0

      while (balance > 0 && payoffMonths < months * 2) {
        const interest = balance * rate
        const principalPayment = Math.min(monthlyPayment - interest, balance)
        balance -= principalPayment
        totalInterest += interest
        payoffMonths++
      }

      const payoffYears = Math.floor(payoffMonths / 12)
      const payoffMonthsRemainder = payoffMonths % 12
      const savedInterest = extraPayment > 0 ? (principal * rate * months - totalInterest) : 0

      return {
        primary: { value: Math.round(basePayment), label: 'Monthly Payment', unit: '$' },
        secondary: [
          { label: 'Total Interest', value: Math.round(totalInterest).toLocaleString(), unit: '$' },
          { label: 'Payoff Time', value: `${payoffYears}y ${payoffMonthsRemainder}m` },
          ...(extraPayment > 0 ? [{ label: 'Interest Saved', value: Math.round(savedInterest).toLocaleString(), unit: '$' }] : []),
        ],
        chartData: [
          { name: 'Principal', value: principal, color: '#3b82f6' },
          { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' },
        ],
        advice: extraPayment > 0
          ? `Extra payments save $${Math.round(savedInterest).toLocaleString()} in interest!`
          : 'Adding extra payments can significantly reduce total interest.',
      }
    }

    case 'debt-payoff': {
      const totalDebt = Number(input.totalDebt)
      const rate = Number(input.interestRate) / 100 / 12
      const monthlyPayment = Number(input.monthlyPayment)

      if (monthlyPayment <= totalDebt * rate) {
        return {
          primary: { value: '∞', label: 'Payoff Time' },
          advice: 'Payment too low to cover interest. Increase monthly payment.',
        }
      }

      let balance = totalDebt
      let months = 0
      let totalInterest = 0

      while (balance > 0 && months < 1200) {
        const interest = balance * rate
        totalInterest += interest
        balance = balance + interest - monthlyPayment
        months++
      }

      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      const totalPaid = monthlyPayment * months

      return {
        primary: { value: `${years}y ${remainingMonths}m`, label: 'Payoff Time' },
        secondary: [
          { label: 'Total Interest', value: Math.round(totalInterest).toLocaleString(), unit: '$' },
          { label: 'Total Paid', value: Math.round(totalPaid).toLocaleString(), unit: '$' },
          { label: 'Monthly Payment', value: monthlyPayment.toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Principal', value: totalDebt, color: '#3b82f6' },
          { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' },
        ],
        advice: 'Increase payments to pay off faster and save on interest.',
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

    case 'scientific': {
      const expression = (input.expression as string || '').trim()
      if (!expression) {
        return { primary: { value: 'Enter expression', label: 'Result' } }
      }

      try {
        const result = math.evaluate(expression)
        const numResult = typeof result === 'object' ? Number(result.toString()) : Number(result)
        return {
          primary: { value: Math.round(numResult * 1000000) / 1000000, label: 'Result' },
          secondary: [
            { label: 'Expression', value: expression },
          ],
          advice: 'Supports: +, -, *, /, ^, sqrt(), sin(), cos(), tan(), log(), ln(), abs(), etc.',
        }
      } catch {
        return { primary: { value: 'Error', label: 'Invalid expression' } }
      }
    }

    case 'fraction': {
      const num1 = Number(input.num1)
      const den1 = Number(input.den1)
      const num2 = Number(input.num2) || 0
      const den2 = Number(input.den2) || 1
      const operation = input.operation as string

      const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)

      const simplify = (n: number, d: number): [number, number] => {
        const g = gcd(n, d)
        return [n / g, d / g]
      }

      let resultNum: number, resultDen: number

      switch (operation) {
        case 'add':
          resultNum = num1 * den2 + num2 * den1
          resultDen = den1 * den2
          break
        case 'subtract':
          resultNum = num1 * den2 - num2 * den1
          resultDen = den1 * den2
          break
        case 'multiply':
          resultNum = num1 * num2
          resultDen = den1 * den2
          break
        case 'divide':
          resultNum = num1 * den2
          resultDen = den1 * num2
          break
        case 'simplify':
          resultNum = num1
          resultDen = den1
          break
        case 'toDecimal':
          return {
            primary: { value: Math.round((num1 / den1) * 1000000) / 1000000, label: 'Decimal' },
            secondary: [{ label: 'Fraction', value: `${num1}/${den1}` }],
          }
        default:
          resultNum = num1
          resultDen = den1
      }

      const [simpNum, simpDen] = simplify(resultNum, resultDen)
      const decimal = Math.round((simpNum / simpDen) * 1000000) / 1000000

      return {
        primary: { value: `${simpNum}/${simpDen}`, label: 'Result' },
        secondary: [
          { label: 'Decimal', value: decimal },
          { label: 'Simplified', value: simpNum === resultNum && simpDen === resultDen ? 'Already simplified' : 'Yes' },
        ],
      }
    }

    case 'gpa': {
      const gradesStr = (input.grades as string || '').toUpperCase()
      const creditsStr = (input.credits as string || '')

      const gradePoints: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0,
      }

      const grades = gradesStr.split(',').map(g => g.trim())
      const credits = creditsStr.split(',').map(c => Number(c.trim()) || 3)

      let totalPoints = 0
      let totalCredits = 0

      for (let i = 0; i < grades.length; i++) {
        const grade = grades[i]
        const credit = credits[i] || 3
        if (gradePoints[grade] !== undefined) {
          totalPoints += gradePoints[grade] * credit
          totalCredits += credit
        }
      }

      const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0

      return {
        primary: { value: gpa, label: 'GPA' },
        secondary: [
          { label: 'Total Credits', value: totalCredits },
          { label: 'Quality Points', value: Math.round(totalPoints * 100) / 100 },
        ],
        advice: 'Enter grades like: A, B+, A-, C. Credits optional (default 3).',
      }
    }

    case 'grade': {
      const earned = Number(input.earned)
      const possible = Number(input.possible)

      const percentage = (earned / possible) * 100
      const rounded = Math.round(percentage * 100) / 100

      let letterGrade: string
      if (percentage >= 93) letterGrade = 'A'
      else if (percentage >= 90) letterGrade = 'A-'
      else if (percentage >= 87) letterGrade = 'B+'
      else if (percentage >= 83) letterGrade = 'B'
      else if (percentage >= 80) letterGrade = 'B-'
      else if (percentage >= 77) letterGrade = 'C+'
      else if (percentage >= 73) letterGrade = 'C'
      else if (percentage >= 70) letterGrade = 'C-'
      else if (percentage >= 67) letterGrade = 'D+'
      else if (percentage >= 63) letterGrade = 'D'
      else if (percentage >= 60) letterGrade = 'D-'
      else letterGrade = 'F'

      return {
        primary: { value: rounded, label: 'Percentage', unit: '%' },
        secondary: [
          { label: 'Letter Grade', value: letterGrade },
          { label: 'Points', value: `${earned}/${possible}` },
        ],
      }
    }

    case 'quadratic': {
      const a = Number(input.a)
      const b = Number(input.b)
      const c = Number(input.c)

      const discriminant = b * b - 4 * a * c

      if (discriminant < 0) {
        const realPart = -b / (2 * a)
        const imagPart = Math.sqrt(-discriminant) / (2 * a)
        return {
          primary: { value: 'Complex roots', label: 'Result' },
          secondary: [
            { label: 'x₁', value: `${realPart.toFixed(3)} + ${imagPart.toFixed(3)}i` },
            { label: 'x₂', value: `${realPart.toFixed(3)} - ${imagPart.toFixed(3)}i` },
            { label: 'Discriminant', value: discriminant },
          ],
          advice: 'Negative discriminant means no real solutions.',
        }
      }

      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)

      return {
        primary: { value: discriminant === 0 ? x1.toFixed(4) : `${x1.toFixed(4)}, ${x2.toFixed(4)}`, label: discriminant === 0 ? 'x (double root)' : 'x₁, x₂' },
        secondary: [
          { label: 'Discriminant', value: discriminant },
          { label: 'Equation', value: `${a}x² + ${b}x + ${c} = 0` },
        ],
        advice: discriminant === 0 ? 'One repeated root (discriminant = 0)' : 'Two distinct real roots',
      }
    }

    case 'slope': {
      const x1 = Number(input.x1)
      const y1 = Number(input.y1)
      const x2 = Number(input.x2)
      const y2 = Number(input.y2)

      if (x2 === x1) {
        return {
          primary: { value: 'Undefined', label: 'Slope' },
          secondary: [
            { label: 'Line Type', value: 'Vertical line' },
            { label: 'Equation', value: `x = ${x1}` },
          ],
        }
      }

      const slope = (y2 - y1) / (x2 - x1)
      const yIntercept = y1 - slope * x1
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

      return {
        primary: { value: Math.round(slope * 10000) / 10000, label: 'Slope (m)' },
        secondary: [
          { label: 'Y-intercept (b)', value: Math.round(yIntercept * 10000) / 10000 },
          { label: 'Equation', value: `y = ${slope.toFixed(2)}x + ${yIntercept.toFixed(2)}` },
          { label: 'Distance', value: Math.round(distance * 10000) / 10000 },
        ],
      }
    }

    case 'std-dev': {
      const numbersStr = input.numbers as string || ''
      const type = input.type as string || 'sample'
      const numbers = numbersStr.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n))

      if (numbers.length < 2) {
        return { primary: { value: 'Need 2+ numbers', label: 'Error' } }
      }

      const n = numbers.length
      const mean = numbers.reduce((a, b) => a + b, 0) / n
      const variance = numbers.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (type === 'sample' ? n - 1 : n)
      const stdDev = Math.sqrt(variance)

      return {
        primary: { value: Math.round(stdDev * 10000) / 10000, label: 'Standard Deviation' },
        secondary: [
          { label: 'Variance', value: Math.round(variance * 10000) / 10000 },
          { label: 'Mean', value: Math.round(mean * 10000) / 10000 },
          { label: 'Type', value: type === 'sample' ? 'Sample (n-1)' : 'Population (n)' },
        ],
      }
    }

    case 'statistics': {
      const numbersStr = input.numbers as string || ''
      const numbers = numbersStr.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n))

      if (numbers.length === 0) {
        return { primary: { value: 'Enter numbers', label: 'Error' } }
      }

      const n = numbers.length
      const sorted = [...numbers].sort((a, b) => a - b)
      const sum = numbers.reduce((a, b) => a + b, 0)
      const mean = sum / n
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]

      // Mode
      const freq: Record<number, number> = {}
      let maxFreq = 0
      numbers.forEach(num => {
        freq[num] = (freq[num] || 0) + 1
        if (freq[num] > maxFreq) maxFreq = freq[num]
      })
      const modes = Object.keys(freq).filter(k => freq[Number(k)] === maxFreq).map(Number)
      const modeStr = maxFreq === 1 ? 'No mode' : modes.join(', ')

      const range = sorted[n - 1] - sorted[0]

      return {
        primary: { value: Math.round(mean * 10000) / 10000, label: 'Mean' },
        secondary: [
          { label: 'Median', value: Math.round(median * 10000) / 10000 },
          { label: 'Mode', value: modeStr },
          { label: 'Range', value: range },
          { label: 'Sum', value: sum },
          { label: 'Count', value: n },
        ],
      }
    }

    case 'probability': {
      const favorable = Number(input.favorable)
      const total = Number(input.total)
      const trials = Number(input.trials) || 1

      const probability = favorable / total
      const percentage = probability * 100
      const odds = favorable / (total - favorable)

      // Probability of at least one success in multiple trials
      const atLeastOne = 1 - Math.pow(1 - probability, trials)

      return {
        primary: { value: Math.round(percentage * 100) / 100, label: 'Probability', unit: '%' },
        secondary: [
          { label: 'Decimal', value: Math.round(probability * 10000) / 10000 },
          { label: 'Odds', value: `${favorable}:${total - favorable}` },
          ...(trials > 1 ? [{ label: `At least 1 in ${trials} trials`, value: `${(atLeastOne * 100).toFixed(2)}%` }] : []),
        ],
        advice: `${favorable} favorable outcomes out of ${total} total possibilities.`,
      }
    }

    case 'time': {
      const hours1 = Number(input.hours1) || 0
      const minutes1 = Number(input.minutes1) || 0
      const seconds1 = Number(input.seconds1) || 0
      const hours2 = Number(input.hours2) || 0
      const minutes2 = Number(input.minutes2) || 0
      const operation = input.operation as string

      const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1
      const totalSeconds2 = hours2 * 3600 + minutes2 * 60

      let resultSeconds: number
      if (operation === 'add') {
        resultSeconds = totalSeconds1 + totalSeconds2
      } else if (operation === 'subtract') {
        resultSeconds = Math.max(0, totalSeconds1 - totalSeconds2)
      } else {
        resultSeconds = totalSeconds1
      }

      const resHours = Math.floor(resultSeconds / 3600)
      const resMinutes = Math.floor((resultSeconds % 3600) / 60)
      const resSecs = resultSeconds % 60

      return {
        primary: { value: `${resHours}h ${resMinutes}m ${resSecs}s`, label: 'Result' },
        secondary: [
          { label: 'Total Seconds', value: resultSeconds.toLocaleString() },
          { label: 'Total Minutes', value: Math.round(resultSeconds / 60 * 100) / 100 },
          { label: 'Decimal Hours', value: Math.round(resultSeconds / 3600 * 100) / 100 },
        ],
      }
    }

    case 'hours': {
      const startTime = input.startTime as string || '09:00'
      const endTime = input.endTime as string || '17:00'
      const breakMinutes = Number(input.breakMinutes) || 0

      const [startH, startM] = startTime.split(':').map(Number)
      const [endH, endM] = endTime.split(':').map(Number)

      let startMinutes = startH * 60 + startM
      let endMinutes = endH * 60 + endM

      // Handle overnight shifts
      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60
      }

      const workedMinutes = endMinutes - startMinutes - breakMinutes
      const hours = Math.floor(workedMinutes / 60)
      const minutes = workedMinutes % 60
      const decimalHours = Math.round(workedMinutes / 60 * 100) / 100

      return {
        primary: { value: `${hours}h ${minutes}m`, label: 'Hours Worked' },
        secondary: [
          { label: 'Decimal Hours', value: decimalHours },
          { label: 'Total Minutes', value: workedMinutes },
          ...(breakMinutes > 0 ? [{ label: 'Break Deducted', value: `${breakMinutes}m` }] : []),
        ],
      }
    }

    case 'day-counter': {
      const targetDate = new Date(input.targetDate as string)
      const includeEnd = input.includeEndDate === 'yes'
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      targetDate.setHours(0, 0, 0, 0)

      const diffTime = targetDate.getTime() - today.getTime()
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (includeEnd && diffDays > 0) diffDays += 1

      const isPast = diffDays < 0
      const absDays = Math.abs(diffDays)
      const weeks = Math.floor(absDays / 7)
      const remainingDays = absDays % 7

      return {
        primary: { value: absDays, label: isPast ? 'Days Ago' : 'Days Until', unit: 'days' },
        secondary: [
          { label: 'Weeks', value: `${weeks}w ${remainingDays}d` },
          { label: 'Target', value: targetDate.toLocaleDateString() },
          { label: 'Status', value: isPast ? 'Past' : diffDays === 0 ? 'Today!' : 'Future' },
        ],
      }
    }

    case 'timezone': {
      const timeStr = input.time as string || '12:00'
      const fromZone = Number(input.fromZone)
      const toZone = Number(input.toZone)

      const [hours, minutes] = timeStr.split(':').map(Number)
      const diff = toZone - fromZone

      let newHours = hours + diff
      let dayChange = ''

      if (newHours >= 24) {
        newHours -= 24
        dayChange = ' (+1 day)'
      } else if (newHours < 0) {
        newHours += 24
        dayChange = ' (-1 day)'
      }

      const newTime = `${String(Math.floor(newHours)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

      return {
        primary: { value: newTime + dayChange, label: 'Converted Time' },
        secondary: [
          { label: 'Original', value: timeStr },
          { label: 'Time Difference', value: `${diff > 0 ? '+' : ''}${diff} hours` },
        ],
      }
    }

    case 'timecard': {
      const entriesStr = input.entries as string || ''
      const hourlyRate = Number(input.hourlyRate) || 0

      const entries = entriesStr.split(',').map(e => e.trim()).filter(e => e.includes('-'))
      let totalMinutes = 0

      for (const entry of entries) {
        const [start, end] = entry.split('-').map(t => t.trim())
        if (start && end) {
          const [startH, startM] = start.split(':').map(Number)
          const [endH, endM] = end.split(':').map(Number)
          let startMins = startH * 60 + (startM || 0)
          let endMins = endH * 60 + (endM || 0)
          if (endMins < startMins) endMins += 24 * 60
          totalMinutes += endMins - startMins
        }
      }

      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      const decimalHours = Math.round(totalMinutes / 60 * 100) / 100
      const earnings = hourlyRate > 0 ? Math.round(decimalHours * hourlyRate * 100) / 100 : 0

      return {
        primary: { value: `${hours}h ${minutes}m`, label: 'Total Hours' },
        secondary: [
          { label: 'Decimal Hours', value: decimalHours },
          { label: 'Entries Counted', value: entries.length },
          ...(hourlyRate > 0 ? [{ label: 'Earnings', value: `$${earnings.toLocaleString()}` }] : []),
        ],
        advice: 'Format: start-end, separated by commas (e.g., 09:00-12:30, 13:00-17:00)',
      }
    }

    case 'countdown': {
      const eventDate = new Date(input.eventDate as string)
      const eventTimeStr = input.eventTime as string || '00:00'
      const eventName = input.eventName as string || 'Event'

      const [eventH, eventM] = eventTimeStr.split(':').map(Number)
      eventDate.setHours(eventH || 0, eventM || 0, 0, 0)

      const now = new Date()
      const diffMs = eventDate.getTime() - now.getTime()
      const isPast = diffMs < 0
      const absDiff = Math.abs(diffMs)

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000)

      return {
        primary: { value: isPast ? 'Event passed!' : `${days}d ${hours}h ${minutes}m`, label: isPast ? 'Status' : `Until ${eventName}` },
        secondary: [
          { label: 'Days', value: days },
          { label: 'Hours', value: hours },
          { label: 'Minutes', value: minutes },
          { label: 'Event Date', value: eventDate.toLocaleDateString() },
        ],
        advice: isPast ? `${eventName} was ${days} days ago.` : `${eventName} is coming up!`,
      }
    }

    case 'concrete': {
      const length = Number(input.length)
      const width = Number(input.width)
      const depthInches = Number(input.depth)
      const depthFeet = depthInches / 12

      const cubicFeet = length * width * depthFeet
      const cubicYards = cubicFeet / 27
      const cubicMeters = cubicFeet * 0.0283168

      // Add 10% for waste
      const yardsWithWaste = Math.ceil(cubicYards * 1.1 * 10) / 10

      // Estimate 80lb bags (0.6 cubic feet per bag)
      const bags80lb = Math.ceil(cubicFeet / 0.6)
      const bags60lb = Math.ceil(cubicFeet / 0.45)

      return {
        primary: { value: yardsWithWaste, label: 'Cubic Yards', unit: 'yd³' },
        secondary: [
          { label: 'Cubic Feet', value: Math.round(cubicFeet * 100) / 100, unit: 'ft³' },
          { label: 'Cubic Meters', value: Math.round(cubicMeters * 100) / 100, unit: 'm³' },
          { label: '80lb Bags', value: bags80lb },
          { label: '60lb Bags', value: bags60lb },
        ],
        advice: 'Includes 10% extra for waste. Order slightly more for safety.',
      }
    }

    case 'tile': {
      const areaLength = Number(input.areaLength)
      const areaWidth = Number(input.areaWidth)
      const tileLengthIn = Number(input.tileLength)
      const tileWidthIn = Number(input.tileWidth)
      const gap = Number(input.gap) || 0
      const wastePercent = Number(input.waste) || 10

      const areaSqFt = areaLength * areaWidth

      // Convert tile to feet including gap
      const tileLengthFt = (tileLengthIn + gap) / 12
      const tileWidthFt = (tileWidthIn + gap) / 12
      const tileSqFt = tileLengthFt * tileWidthFt

      const tilesNeeded = areaSqFt / tileSqFt
      const tilesWithWaste = Math.ceil(tilesNeeded * (1 + wastePercent / 100))

      // Boxes (typically 10-15 tiles per box)
      const boxesNeeded = Math.ceil(tilesWithWaste / 12)

      return {
        primary: { value: tilesWithWaste, label: 'Tiles Needed', unit: 'tiles' },
        secondary: [
          { label: 'Area', value: areaSqFt, unit: 'sq ft' },
          { label: 'Tiles (no waste)', value: Math.ceil(tilesNeeded) },
          { label: 'Boxes (12/box)', value: boxesNeeded },
          { label: 'Waste Factor', value: `${wastePercent}%` },
        ],
        advice: `Based on ${tileLengthIn}" x ${tileWidthIn}" tiles with ${gap}" spacing.`,
      }
    }

    case 'btu': {
      const squareFeet = Number(input.squareFeet)
      const ceilingHeight = Number(input.ceilingHeight) || 8
      const insulation = input.insulation as string
      const climate = input.climate as string
      const mode = input.mode as string

      // Base BTU: 20 BTU per sq ft for cooling
      let baseBtu = squareFeet * 20

      // Ceiling height adjustment (baseline 8ft)
      baseBtu *= ceilingHeight / 8

      // Insulation adjustment
      const insulationFactor = { poor: 1.3, average: 1.0, good: 0.8 }[insulation] || 1
      baseBtu *= insulationFactor

      // Climate adjustment
      const climateFactor = { hot: 1.2, moderate: 1.0, cold: 0.9 }[climate] || 1
      baseBtu *= climateFactor

      // Heating requires more BTU
      if (mode === 'heating') {
        baseBtu *= 1.4
      }

      const btuResult = Math.ceil(baseBtu / 1000) * 1000
      const tons = Math.round((btuResult / 12000) * 10) / 10

      return {
        primary: { value: btuResult.toLocaleString(), label: 'BTU Needed', unit: 'BTU' },
        secondary: [
          { label: 'Tons', value: tons },
          { label: 'Room Size', value: squareFeet, unit: 'sq ft' },
          { label: 'Mode', value: mode === 'cooling' ? 'Cooling (AC)' : 'Heating' },
        ],
        advice: `For ${mode}: ${insulation} insulation in ${climate} climate. Consider window exposure and occupancy for final sizing.`,
      }
    }

    case 'password': {
      const length = Math.min(128, Math.max(8, Number(input.length) || 16))
      const useUpper = input.uppercase === 'yes'
      const useLower = input.lowercase === 'yes'
      const useNumbers = input.numbers === 'yes'
      const useSymbols = input.symbols === 'yes'

      let chars = ''
      if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz'
      if (useNumbers) chars += '0123456789'
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

      if (chars.length === 0) chars = 'abcdefghijklmnopqrstuvwxyz'

      let password = ''
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length]
      }

      // Calculate entropy
      const entropy = Math.round(length * Math.log2(chars.length))
      let strength: string
      if (entropy >= 128) strength = 'Very Strong'
      else if (entropy >= 80) strength = 'Strong'
      else if (entropy >= 60) strength = 'Moderate'
      else strength = 'Weak'

      return {
        primary: { value: password, label: 'Generated Password' },
        secondary: [
          { label: 'Length', value: length },
          { label: 'Entropy', value: `${entropy} bits` },
          { label: 'Strength', value: strength },
        ],
        advice: 'Click Calculate again for a new password. Use a password manager to store it securely.',
      }
    }

    case 'converter': {
      const value = Number(input.value)
      const category = input.category as string
      const from = (input.from as string || '').toLowerCase().trim()
      const to = (input.to as string || '').toLowerCase().trim()

      // Conversion factors to base unit
      const conversions: Record<string, Record<string, number>> = {
        length: {
          meters: 1, m: 1, meter: 1,
          feet: 0.3048, ft: 0.3048, foot: 0.3048,
          inches: 0.0254, in: 0.0254, inch: 0.0254,
          yards: 0.9144, yd: 0.9144, yard: 0.9144,
          miles: 1609.344, mi: 1609.344, mile: 1609.344,
          kilometers: 1000, km: 1000,
          centimeters: 0.01, cm: 0.01,
          millimeters: 0.001, mm: 0.001,
        },
        weight: {
          kilograms: 1, kg: 1, kilogram: 1,
          pounds: 0.453592, lbs: 0.453592, lb: 0.453592, pound: 0.453592,
          ounces: 0.0283495, oz: 0.0283495, ounce: 0.0283495,
          grams: 0.001, g: 0.001, gram: 0.001,
          tons: 907.185, ton: 907.185,
          'metric tons': 1000, 'metric ton': 1000,
          stones: 6.35029, stone: 6.35029, st: 6.35029,
        },
        volume: {
          liters: 1, l: 1, liter: 1,
          gallons: 3.78541, gal: 3.78541, gallon: 3.78541,
          quarts: 0.946353, qt: 0.946353, quart: 0.946353,
          pints: 0.473176, pt: 0.473176, pint: 0.473176,
          cups: 0.236588, cup: 0.236588,
          milliliters: 0.001, ml: 0.001,
          'fluid ounces': 0.0295735, floz: 0.0295735, 'fl oz': 0.0295735,
        },
        area: {
          'square meters': 1, sqm: 1, m2: 1,
          'square feet': 0.092903, sqft: 0.092903, ft2: 0.092903,
          'square yards': 0.836127, sqyd: 0.836127,
          'square inches': 0.00064516, sqin: 0.00064516,
          acres: 4046.86, acre: 4046.86,
          hectares: 10000, ha: 10000, hectare: 10000,
        },
        speed: {
          'meters per second': 1, mps: 1, 'm/s': 1,
          'kilometers per hour': 0.277778, kph: 0.277778, 'km/h': 0.277778, kmh: 0.277778,
          'miles per hour': 0.44704, mph: 0.44704,
          knots: 0.514444, knot: 0.514444, kt: 0.514444,
        },
      }

      // Temperature is special
      if (category === 'temperature') {
        const fromUnit = from.charAt(0)
        const toUnit = to.charAt(0)

        let celsius: number
        if (fromUnit === 'f') celsius = (value - 32) * 5 / 9
        else if (fromUnit === 'k') celsius = value - 273.15
        else celsius = value

        let result: number
        if (toUnit === 'f') result = celsius * 9 / 5 + 32
        else if (toUnit === 'k') result = celsius + 273.15
        else result = celsius

        return {
          primary: { value: Math.round(result * 1000) / 1000, label: 'Result' },
          secondary: [
            { label: 'From', value: `${value} ${from}` },
            { label: 'To', value: to },
          ],
        }
      }

      const catConv = conversions[category] || conversions.length
      const fromFactor = catConv[from]
      const toFactor = catConv[to]

      if (!fromFactor || !toFactor) {
        return {
          primary: { value: 'Unknown unit', label: 'Error' },
          advice: `Try units like: ${Object.keys(catConv).slice(0, 5).join(', ')}`,
        }
      }

      const baseValue = value * fromFactor
      const result = baseValue / toFactor

      return {
        primary: { value: Math.round(result * 1000000) / 1000000, label: 'Result' },
        secondary: [
          { label: 'From', value: `${value} ${from}` },
          { label: 'To', value: to },
        ],
      }
    }

    case 'final-grade': {
      const currentGrade = Number(input.currentGrade)
      const desiredGrade = Number(input.desiredGrade)
      const finalWeight = Number(input.finalWeight) / 100

      // Formula: desiredGrade = currentGrade * (1 - finalWeight) + finalGrade * finalWeight
      // Solve for finalGrade: finalGrade = (desiredGrade - currentGrade * (1 - finalWeight)) / finalWeight
      const neededGrade = (desiredGrade - currentGrade * (1 - finalWeight)) / finalWeight
      const rounded = Math.round(neededGrade * 100) / 100

      let advice: string
      if (neededGrade > 100) {
        advice = `You need ${rounded}% which is above 100%. Consider adjusting your goal.`
      } else if (neededGrade < 0) {
        advice = `You could get 0% and still achieve your goal!`
      } else if (neededGrade > 90) {
        advice = `You need an A on the final (${rounded}%). Study hard!`
      } else {
        advice = `You need ${rounded}% on the final to achieve your goal.`
      }

      return {
        primary: { value: rounded, label: 'Final Exam Score Needed', unit: '%' },
        secondary: [
          { label: 'Current Grade', value: currentGrade, unit: '%' },
          { label: 'Desired Grade', value: desiredGrade, unit: '%' },
          { label: 'Final Weight', value: `${finalWeight * 100}%` },
        ],
        advice,
      }
    }

    case 'weighted-gpa': {
      const gradesStr = (input.grades as string || '').toUpperCase()
      const creditsStr = (input.credits as string || '')
      const weightsStr = (input.weights as string || '').toUpperCase()

      const gradePoints: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0,
      }

      // Weight bonuses: AP = +1.0, H (Honors) = +0.5, R (Regular) = 0
      const weightBonus: Record<string, number> = {
        'AP': 1.0, 'IB': 1.0, 'H': 0.5, 'HONORS': 0.5, 'R': 0, 'REGULAR': 0,
      }

      const grades = gradesStr.split(',').map(g => g.trim())
      const credits = creditsStr.split(',').map(c => Number(c.trim()) || 3)
      const weights = weightsStr.split(',').map(w => w.trim())

      let totalWeightedPoints = 0
      let totalUnweightedPoints = 0
      let totalCredits = 0

      for (let i = 0; i < grades.length; i++) {
        const grade = grades[i]
        const credit = credits[i] || 3
        const weight = weights[i] || 'R'

        if (gradePoints[grade] !== undefined) {
          const basePoints = gradePoints[grade]
          const bonus = weightBonus[weight] || 0
          totalUnweightedPoints += basePoints * credit
          totalWeightedPoints += (basePoints + bonus) * credit
          totalCredits += credit
        }
      }

      const weightedGpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0
      const unweightedGpa = totalCredits > 0 ? Math.round((totalUnweightedPoints / totalCredits) * 100) / 100 : 0

      return {
        primary: { value: weightedGpa, label: 'Weighted GPA' },
        secondary: [
          { label: 'Unweighted GPA', value: unweightedGpa },
          { label: 'Total Credits', value: totalCredits },
        ],
        advice: 'AP/IB adds 1.0, Honors adds 0.5 to grade points. Enter weights as AP, H, or R.',
      }
    }

    case 'college-gpa': {
      const gradesStr = (input.grades as string || '').toUpperCase()
      const creditsStr = (input.credits as string || '')
      const currentGpa = Number(input.currentGpa) || 0
      const currentCredits = Number(input.currentCredits) || 0

      const gradePoints: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0,
      }

      const grades = gradesStr.split(',').map(g => g.trim())
      const credits = creditsStr.split(',').map(c => Number(c.trim()) || 3)

      let semesterPoints = 0
      let semesterCredits = 0

      for (let i = 0; i < grades.length; i++) {
        const grade = grades[i]
        const credit = credits[i] || 3
        if (gradePoints[grade] !== undefined) {
          semesterPoints += gradePoints[grade] * credit
          semesterCredits += credit
        }
      }

      const semesterGpa = semesterCredits > 0 ? Math.round((semesterPoints / semesterCredits) * 100) / 100 : 0

      // Cumulative GPA
      const totalPoints = (currentGpa * currentCredits) + semesterPoints
      const totalCredits = currentCredits + semesterCredits
      const cumulativeGpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : semesterGpa

      return {
        primary: { value: semesterGpa, label: 'Semester GPA' },
        secondary: [
          { label: 'Cumulative GPA', value: cumulativeGpa },
          { label: 'Semester Credits', value: semesterCredits },
          { label: 'Total Credits', value: totalCredits },
        ],
        advice: currentCredits > 0 ? `Combined with previous ${currentCredits} credits at ${currentGpa} GPA.` : 'Add current GPA and credits to calculate cumulative.',
      }
    }

    case 'test-score': {
      const correct = Number(input.correct)
      const total = Number(input.total)
      const scale = input.scale as string

      const percentage = (correct / total) * 100
      const rounded = Math.round(percentage * 100) / 100

      const scales: Record<string, { A: number; B: number; C: number; D: number }> = {
        standard: { A: 90, B: 80, C: 70, D: 60 },
        strict: { A: 93, B: 83, C: 73, D: 63 },
        lenient: { A: 85, B: 75, C: 65, D: 55 },
      }

      const gradeScale = scales[scale] || scales.standard
      let letterGrade: string
      if (percentage >= gradeScale.A) letterGrade = 'A'
      else if (percentage >= gradeScale.B) letterGrade = 'B'
      else if (percentage >= gradeScale.C) letterGrade = 'C'
      else if (percentage >= gradeScale.D) letterGrade = 'D'
      else letterGrade = 'F'

      const wrong = total - correct
      const neededFor = (targetGrade: number) => Math.ceil(total * targetGrade / 100)

      return {
        primary: { value: rounded, label: 'Score', unit: '%' },
        secondary: [
          { label: 'Letter Grade', value: letterGrade },
          { label: 'Correct', value: `${correct}/${total}` },
          { label: 'Wrong', value: wrong },
          { label: 'For A', value: `Need ${neededFor(gradeScale.A)} correct` },
        ],
      }
    }

    case 'study-timer': {
      const studyMinutes = Number(input.studyMinutes) || 25
      const breakMinutes = Number(input.breakMinutes) || 5
      const sessions = Number(input.sessions) || 4
      const longBreak = Number(input.longBreak) || 15

      const totalStudyTime = studyMinutes * sessions
      const totalBreakTime = breakMinutes * (sessions - 1) + longBreak
      const totalTime = totalStudyTime + totalBreakTime

      const studyHours = Math.floor(totalStudyTime / 60)
      const studyMins = totalStudyTime % 60
      const totalHours = Math.floor(totalTime / 60)
      const totalMins = totalTime % 60

      return {
        primary: { value: `${totalHours}h ${totalMins}m`, label: 'Total Session Time' },
        secondary: [
          { label: 'Study Time', value: `${studyHours}h ${studyMins}m` },
          { label: 'Break Time', value: `${totalBreakTime} min` },
          { label: 'Sessions', value: sessions },
        ],
        breakdown: [
          ...Array.from({ length: sessions }, (_, i) => ({
            label: `Session ${i + 1}`,
            value: `${studyMinutes}min study${i < sessions - 1 ? ` + ${breakMinutes}min break` : ` + ${longBreak}min long break`}`,
          })),
        ],
        advice: `Pomodoro technique: ${studyMinutes} min focus, ${breakMinutes} min break. Long break after ${sessions} sessions.`,
      }
    }

    default:
      return {
        primary: { value: 'Coming soon!', label: 'Result' },
        advice: 'This calculator is being developed.',
      }
  }
}
