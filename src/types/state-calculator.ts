// Types for state-specific calculators

import type { CalculatorField } from '@/lib/calculator-engine'

export interface StateCalculatorFAQ {
  question: string
  answer: string
}

export interface StateCalculatorBenefit {
  icon: string
  title: string
  description: string
}

// State-specific data embedded in each calculator
export interface StateData {
  [key: string]: number | string | boolean | number[] | Record<string, number | string>
}

// Individual state calculator config
export interface StateCalculatorConfig {
  slug: string              // e.g., "property-tax-california"
  baseType: string          // e.g., "property-tax" — used for engine routing
  name: string              // e.g., "California Property Tax (Prop 13)"
  category: string          // e.g., "finance"
  primaryKeyword: string
  secondaryKeywords: string[]
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroSubtitle: string
  introText: string
  formula: string
  stateData: StateData
  fields: CalculatorField[]
  benefits: StateCalculatorBenefit[]
  faqs: StateCalculatorFAQ[]
  relatedCalculators: string[]
  sourceUrl?: string
  lastVerified?: string
}

// State metadata
export interface StateInfo {
  name: string               // "California"
  slug: string               // "california"
  abbreviation: string       // "CA"
  capital: string
  population: number
  region: 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West' | 'Pacific'
  hasIncomeTax: boolean
  hasSalesTax: boolean
  hasPropertyTax: boolean
}

// Full state data file structure
export interface StateDataFile {
  state: StateInfo
  calculators: StateCalculatorConfig[]
}

// Lookup entry for the state router
export interface StateRouterEntry {
  baseType: string
  stateSlug: string
  stateName: string
  category: string
  fields: CalculatorField[]
  stateData: StateData
}
