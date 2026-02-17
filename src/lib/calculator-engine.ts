// Calculator engine - routes to category-specific modules
// Types are defined here and shared across all modules

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
  chartData?: { name: string; value: number; color?: string; [key: string]: string | number | undefined }[]
  schedule?: { headers: string[]; rows: (string | number)[][] }
}

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

// Category modules
import { getHealthFields, calculateHealth } from './calculators/health'
import { getFinanceFields, calculateFinance } from './calculators/finance'
import { getMathFields, calculateMath } from './calculators/math'
import { getDateTimeFields, calculateDateTime } from './calculators/datetime'
import { getConstructionFields, calculateConstruction } from './calculators/construction'
import { getFunFields, calculateFun } from './calculators/fun'
import { getEducationFields, calculateEducation } from './calculators/education'

// Field routers
const fieldRouters = [
  getHealthFields,
  getFinanceFields,
  getMathFields,
  getDateTimeFields,
  getConstructionFields,
  getFunFields,
  getEducationFields,
]

// Calculate routers
const calculateRouters = [
  calculateHealth,
  calculateFinance,
  calculateMath,
  calculateDateTime,
  calculateConstruction,
  calculateFun,
  calculateEducation,
]

// Default fields for unknown calculator types
const defaultFields: CalculatorField[] = [
  { name: 'value1', label: 'Value 1', type: 'number', placeholder: '0' },
  { name: 'value2', label: 'Value 2', type: 'number', placeholder: '0' },
]

// Get input fields for a calculator type
export function getCalculatorFields(type: string): CalculatorField[] {
  for (const getFields of fieldRouters) {
    const fields = getFields(type)
    if (fields) return fields
  }
  return defaultFields
}

// Calculate result based on calculator type
export function calculate(type: string, input: CalculatorInput, method?: string): CalculatorOutput {
  for (const calc of calculateRouters) {
    const result = calc(type, input, method)
    if (result) return result
  }

  return {
    primary: { value: 0, label: 'Unknown calculator type', unit: '' },
    advice: `Calculator type "${type}" is not yet implemented.`,
  }
}
