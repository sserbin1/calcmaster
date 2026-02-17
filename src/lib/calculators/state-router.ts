// State calculator router — uses LOOKUP TABLE (not pattern matching)
// This avoids slug parsing ambiguity (e.g., "cost-of-living-new-york")

import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import { getStateRouterEntry, isStateCalculator } from '@/data/states'
import type { StateData } from '@/types/state-calculator'

// Import state calculation modules (added in Batch 1B)
// Each module handles calculation logic for a category of state calculators
import { calculateStateFinance, getStateFinanceFields } from './state-finance'
import { calculateStateHousing, getStateHousingFields } from './state-housing'
import { calculateStateEmployment, getStateEmploymentFields } from './state-employment'
import { calculateStateInsurance, getStateInsuranceFields } from './state-insurance'
import { calculateStateEducation, getStateEducationFields } from './state-education'
import { calculateStateCostOfLiving, getStateCostOfLivingFields } from './state-cost-of-living'
import { calculateStateLegal, getStateLegalFields } from './state-legal'
import { calculateStateSpecific, getStateSpecificFields } from './state-specific'

// Category routers for state calculators
const stateFieldRouters: ((baseType: string, stateData: StateData) => CalculatorField[] | null)[] = [
  getStateFinanceFields,
  getStateHousingFields,
  getStateEmploymentFields,
  getStateInsuranceFields,
  getStateEducationFields,
  getStateCostOfLivingFields,
  getStateLegalFields,
  getStateSpecificFields,
]

const stateCalcRouters: ((baseType: string, input: CalculatorInput, stateData: StateData, method?: string) => CalculatorOutput | null)[] = [
  calculateStateFinance,
  calculateStateHousing,
  calculateStateEmployment,
  calculateStateInsurance,
  calculateStateEducation,
  calculateStateCostOfLiving,
  calculateStateLegal,
  calculateStateSpecific,
]

// Get fields for a state calculator type
// Returns null if this is not a state calculator (falls through to next router)
export function getStateFields(type: string): CalculatorField[] | null {
  if (!isStateCalculator(type)) return null

  const entry = getStateRouterEntry(type)
  if (!entry) return null

  // If the state data JSON defined custom fields, use those
  if (entry.fields && entry.fields.length > 0) {
    return entry.fields
  }

  // Otherwise, delegate to category-specific field generator
  for (const getFields of stateFieldRouters) {
    const fields = getFields(entry.baseType, entry.stateData)
    if (fields) return fields
  }

  return null
}

// Calculate result for a state calculator
export function calculateState(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  if (!isStateCalculator(type)) return null

  const entry = getStateRouterEntry(type)
  if (!entry) return null

  // Delegate to category-specific calculator
  for (const calc of stateCalcRouters) {
    const result = calc(entry.baseType, input, entry.stateData, method)
    if (result) return result
  }

  return null
}
