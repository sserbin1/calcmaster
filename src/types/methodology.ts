// Methodology types for calculator scientific documentation

export interface FormulaVariable {
  symbol: string
  meaning: string
  unit?: string
}

export interface Formula {
  name: string
  expression: string
  description?: string
  variables?: FormulaVariable[]
}

export interface Source {
  name: string
  url?: string
  year?: number
  type: 'organization' | 'study' | 'standard' | 'book' | 'government'
  citation?: string
}

export interface ExpandedContent {
  history: string          // 100+ words on historical background
  scientificBasis: string  // 150+ words on scientific foundation
  examples: string[]       // 2-3 practical usage examples
  comparison?: string      // How this method compares to others
  prosAndCons?: {
    pros: string[]
    cons: string[]
  }
}

export interface Method {
  id: string
  name: string
  description: string
  formula?: Formula
  accuracy?: string
  limitations?: string[]
  bestFor?: string
  isDefault?: boolean
  yearIntroduced?: number
  author?: string
  // Expanded content fields for 500+ words per method
  expandedContent?: ExpandedContent
}

export interface VisualScaleConfig {
  type: 'linear' | 'gauge' | 'progress' | 'range'
  min: number
  max: number
  segments: ScaleSegment[]
  unit?: string
  showLabels?: boolean
  animate?: boolean
}

export interface ScaleSegment {
  label: string
  min: number
  max: number
  color: string
  description?: string
}

export interface MethodologyData {
  calculatorId: string
  title: string
  overview: string
  methods: Method[]
  sources: Source[]
  visualScale?: VisualScaleConfig
  footnotes?: string[]
  disclaimer?: string
  lastReviewed?: string
}

// Preset scale types for common use cases
export type ScalePresetType =
  | 'bmi'
  | 'body-fat-male'
  | 'body-fat-female'
  | 'risk-low-to-high'
  | 'percentage'
  | 'grade'

// Calculator category methodology configuration
export interface CategoryMethodologyConfig {
  defaultVisualType: VisualScaleConfig['type']
  showFormulas: boolean
  showSources: boolean
  showLimitations: boolean
}

// Extended calculator data with methodology
export interface CalculatorWithMethodology {
  slug: string
  category: string
  methodology?: MethodologyData
}
