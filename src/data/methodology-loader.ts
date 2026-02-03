// Methodology data loader - loads methodology JSON files per calculator

import type { MethodologyData } from '@/types/methodology'

// Map of calculator paths to methodology file paths
const methodologyFiles: Record<string, () => Promise<MethodologyData>> = {
  // Health calculators
  'health/bmi': () => import('../../seo-templates/methodology/health-bmi.json').then(m => m.default as MethodologyData),
  'health/calories': () => import('../../seo-templates/methodology/health-calories.json').then(m => m.default as MethodologyData),
  'health/tdee': () => import('../../seo-templates/methodology/health-calories.json').then(m => m.default as MethodologyData), // Same as calories
  'health/bmr': () => import('../../seo-templates/methodology/health-bmr.json').then(m => m.default as MethodologyData),
  'health/macro': () => import('../../seo-templates/methodology/health-macro.json').then(m => m.default as MethodologyData),
  'health/body-fat': () => import('../../seo-templates/methodology/health-bodyfat.json').then(m => m.default as MethodologyData),
  'health/ideal-weight': () => import('../../seo-templates/methodology/health-idealweight.json').then(m => m.default as MethodologyData),
  'health/protein': () => import('../../seo-templates/methodology/health-protein.json').then(m => m.default as MethodologyData),
  'health/ovulation': () => import('../../seo-templates/methodology/health-ovulation.json').then(m => m.default as MethodologyData),
  'health/due-date': () => import('../../seo-templates/methodology/health-duedate.json').then(m => m.default as MethodologyData),
  'health/pregnancy': () => import('../../seo-templates/methodology/health-pregnancy.json').then(m => m.default as MethodologyData),
  'health/sleep': () => import('../../seo-templates/methodology/health-sleep.json').then(m => m.default as MethodologyData),

  // Finance calculators
  'finance/mortgage': () => import('../../seo-templates/methodology/finance-mortgage.json').then(m => m.default as MethodologyData),
  'finance/loan': () => import('../../seo-templates/methodology/finance-loan.json').then(m => m.default as MethodologyData),
  'finance/auto-loan': () => import('../../seo-templates/methodology/finance-loan.json').then(m => m.default as MethodologyData),
  'finance/tip': () => import('../../seo-templates/methodology/finance-tip.json').then(m => m.default as MethodologyData),
  'finance/interest': () => import('../../seo-templates/methodology/finance-interest.json').then(m => m.default as MethodologyData),
  'finance/compound': () => import('../../seo-templates/methodology/finance-interest.json').then(m => m.default as MethodologyData),
  'finance/salary': () => import('../../seo-templates/methodology/finance-salary.json').then(m => m.default as MethodologyData),
  'finance/tax': () => import('../../seo-templates/methodology/finance-tax.json').then(m => m.default as MethodologyData),
  'finance/inflation': () => import('../../seo-templates/methodology/finance-inflation.json').then(m => m.default as MethodologyData),
  'finance/budget': () => import('../../seo-templates/methodology/finance-budget.json').then(m => m.default as MethodologyData),
  'finance/retirement': () => import('../../seo-templates/methodology/finance-retirement.json').then(m => m.default as MethodologyData),
  'finance/401k': () => import('../../seo-templates/methodology/finance-retirement.json').then(m => m.default as MethodologyData),
  'finance/roi': () => import('../../seo-templates/methodology/finance-roi.json').then(m => m.default as MethodologyData),
  'finance/amortization': () => import('../../seo-templates/methodology/finance-amortization.json').then(m => m.default as MethodologyData),
  'finance/debt-payoff': () => import('../../seo-templates/methodology/finance-debtpayoff.json').then(m => m.default as MethodologyData),

  // Math calculators
  'math/percent': () => import('../../seo-templates/methodology/math-percent.json').then(m => m.default as MethodologyData),
  'math/scientific': () => import('../../seo-templates/methodology/math-scientific.json').then(m => m.default as MethodologyData),
  'math/fraction': () => import('../../seo-templates/methodology/math-fraction.json').then(m => m.default as MethodologyData),
  'math/gpa': () => import('../../seo-templates/methodology/math-gpa.json').then(m => m.default as MethodologyData),
  'math/grade': () => import('../../seo-templates/methodology/math-grade.json').then(m => m.default as MethodologyData),
  'math/quadratic': () => import('../../seo-templates/methodology/math-quadratic.json').then(m => m.default as MethodologyData),
  'math/slope': () => import('../../seo-templates/methodology/math-slope.json').then(m => m.default as MethodologyData),
  'math/std-dev': () => import('../../seo-templates/methodology/math-stddev.json').then(m => m.default as MethodologyData),
  'math/statistics': () => import('../../seo-templates/methodology/math-statistics.json').then(m => m.default as MethodologyData),
  'math/probability': () => import('../../seo-templates/methodology/math-probability.json').then(m => m.default as MethodologyData),

  // Date-Time calculators
  'date-time/age': () => import('../../seo-templates/methodology/datetime-age.json').then(m => m.default as MethodologyData),
  'date-time/date': () => import('../../seo-templates/methodology/datetime-date.json').then(m => m.default as MethodologyData),
  'date-time/time': () => import('../../seo-templates/methodology/datetime-time.json').then(m => m.default as MethodologyData),
  'date-time/hours': () => import('../../seo-templates/methodology/datetime-hours.json').then(m => m.default as MethodologyData),
  'date-time/day-counter': () => import('../../seo-templates/methodology/datetime-daycounter.json').then(m => m.default as MethodologyData),
  'date-time/timezone': () => import('../../seo-templates/methodology/datetime-timezone.json').then(m => m.default as MethodologyData),
  'date-time/timecard': () => import('../../seo-templates/methodology/datetime-timecard.json').then(m => m.default as MethodologyData),
  'date-time/countdown': () => import('../../seo-templates/methodology/datetime-countdown.json').then(m => m.default as MethodologyData),

  // Construction calculators
  'construction/sqft': () => import('../../seo-templates/methodology/construction-sqft.json').then(m => m.default as MethodologyData),
  'construction/paint': () => import('../../seo-templates/methodology/construction-paint.json').then(m => m.default as MethodologyData),
  'construction/concrete': () => import('../../seo-templates/methodology/construction-concrete.json').then(m => m.default as MethodologyData),
  'construction/tile': () => import('../../seo-templates/methodology/construction-tile.json').then(m => m.default as MethodologyData),
  'construction/btu': () => import('../../seo-templates/methodology/construction-btu.json').then(m => m.default as MethodologyData),

  // Tools/Fun calculators (both 'fun/' and 'tools/' routes)
  'fun/converter': () => import('../../seo-templates/methodology/tools-converter.json').then(m => m.default as MethodologyData),
  'fun/password': () => import('../../seo-templates/methodology/tools-password.json').then(m => m.default as MethodologyData),
  'fun/random-number': () => import('../../seo-templates/methodology/tools-random.json').then(m => m.default as MethodologyData),
  'fun/dice': () => import('../../seo-templates/methodology/tools-random.json').then(m => m.default as MethodologyData),
  'fun/love': () => import('../../seo-templates/methodology/fun-love.json').then(m => m.default as MethodologyData),
  // Aliases for 'tools/' category routes
  'tools/converter': () => import('../../seo-templates/methodology/tools-converter.json').then(m => m.default as MethodologyData),
  'tools/password': () => import('../../seo-templates/methodology/tools-password.json').then(m => m.default as MethodologyData),
  'tools/random-number': () => import('../../seo-templates/methodology/tools-random.json').then(m => m.default as MethodologyData),
  'tools/dice': () => import('../../seo-templates/methodology/tools-random.json').then(m => m.default as MethodologyData),

  // Education calculators
  'education/final-grade': () => import('../../seo-templates/methodology/education-finalgrade.json').then(m => m.default as MethodologyData),
  'education/weighted-gpa': () => import('../../seo-templates/methodology/education-weightedgpa.json').then(m => m.default as MethodologyData),
  'education/college-gpa': () => import('../../seo-templates/methodology/education-collegegpa.json').then(m => m.default as MethodologyData),
  'education/test-score': () => import('../../seo-templates/methodology/education-testscore.json').then(m => m.default as MethodologyData),
  'education/study-timer': () => import('../../seo-templates/methodology/education-studytimer.json').then(m => m.default as MethodologyData),
}

// Load methodology for a calculator
export async function loadMethodology(category: string, slug: string): Promise<MethodologyData | null> {
  const key = `${category}/${slug}`
  const loader = methodologyFiles[key]

  if (!loader) {
    console.log(`No methodology found for ${key}`)
    return null
  }

  try {
    return await loader()
  } catch (error) {
    console.error(`Failed to load methodology for ${key}:`, error)
    return null
  }
}

// Check if methodology exists for a calculator
export function hasMethodology(category: string, slug: string): boolean {
  return `${category}/${slug}` in methodologyFiles
}

// Get all calculator paths with methodology
export function getCalculatorsWithMethodology(): string[] {
  return Object.keys(methodologyFiles)
}
