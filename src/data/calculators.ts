// SEO data for all calculators - loaded from JSON files
import healthData from '../../seo-templates/calculator-seo-data-full.json'
import financeData from '../../seo-templates/seo-data-finance.json'
import otherData from '../../seo-templates/seo-data-math-datetime-other.json'
import type { MethodologyData, VisualScaleConfig } from '@/types/methodology'

export interface CalculatorFAQ {
  question: string
  answer: string
}

export interface CalculatorBenefit {
  icon: string
  title: string
  description: string
}

export interface LongTailVariant {
  slug: string
  title: string
  keyword: string
}

export interface CalculatorData {
  slug: string
  name: string
  category: string
  primaryKeyword: string
  secondaryKeywords: string[]
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroSubtitle: string
  introText: string
  formula: string
  benefits: CalculatorBenefit[]
  faqs: CalculatorFAQ[]
  relatedCalculators: string[]
  longTailVariants: LongTailVariant[]
  lastUpdated: string
  // Methodology fields (optional, loaded separately)
  methodology?: MethodologyData
  visualScale?: VisualScaleConfig
}

// Category configuration
export const categories = {
  health: {
    name: 'Health & Fitness',
    icon: '🏥',
    description: 'BMI, calories, TDEE, body fat, and more',
    color: 'green',
  },
  finance: {
    name: 'Finance',
    icon: '💰',
    description: 'Mortgage, loans, investments, and budgeting',
    color: 'blue',
  },
  math: {
    name: 'Math',
    icon: '📐',
    description: 'Percentages, fractions, statistics, and algebra',
    color: 'purple',
  },
  'date-time': {
    name: 'Date & Time',
    icon: '📅',
    description: 'Age, date difference, time zones, and countdowns',
    color: 'orange',
  },
  construction: {
    name: 'Construction',
    icon: '🏗️',
    description: 'Concrete, square footage, paint, and BTU',
    color: 'yellow',
  },
  fun: {
    name: 'Fun & Tools',
    icon: '🎮',
    description: 'Love calculator, random numbers, dice, passwords',
    color: 'pink',
  },
  education: {
    name: 'Education',
    icon: '🎓',
    description: 'GPA, grades, test scores, and study tools',
    color: 'indigo',
  },
} as const

export type CategorySlug = keyof typeof categories

// Merge all calculator data
function loadAllCalculators(): Record<string, CalculatorData> {
  const all: Record<string, CalculatorData> = {}

  // Process each data source (skip _metadata keys)
  const sources = [healthData, financeData, otherData]

  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (key === '_metadata') continue
      all[key] = value as CalculatorData
    }
  }

  return all
}

export const allCalculators = loadAllCalculators()

// Get calculators by category
export function getCalculatorsByCategory(category: string): CalculatorData[] {
  return Object.values(allCalculators).filter(calc => calc.category === category)
}

// Get single calculator by category and slug
export function getCalculator(category: string, slug: string): CalculatorData | undefined {
  return allCalculators[`${category}/${slug}`]
}

// Get all calculator paths for static generation
export function getAllCalculatorPaths(): { category: string; slug: string }[] {
  return Object.keys(allCalculators).map(key => {
    const [category, slug] = key.split('/')
    return { category, slug }
  })
}

// Get related calculators data
export function getRelatedCalculators(slugs: string[], currentSlug: string): CalculatorData[] {
  return slugs
    .filter(s => s !== currentSlug)
    .slice(0, 4)
    .map(slug => {
      // Find calculator by slug across all categories
      const found = Object.values(allCalculators).find(c => c.slug === slug)
      return found
    })
    .filter((c): c is CalculatorData => c !== undefined)
}

// Get all categories with calculator count
export function getCategoriesWithCounts(): { slug: string; count: number; info: typeof categories[CategorySlug] }[] {
  return Object.entries(categories).map(([slug, info]) => ({
    slug,
    count: getCalculatorsByCategory(slug).length,
    info,
  }))
}
