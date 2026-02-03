// Math calculator visual configurations and helpers

import type { VisualScaleConfig } from '@/types/methodology'
import { GRADE_SCALE, GPA_SCALE } from './scale-presets'

export const mathScales: Record<string, VisualScaleConfig> = {
  grade: GRADE_SCALE,
  gpa: GPA_SCALE,

  probability: {
    type: 'gauge',
    min: 0,
    max: 100,
    unit: '%',
    showLabels: true,
    animate: true,
    segments: [
      { label: 'Very Unlikely', min: 0, max: 20, color: '#ef4444' },
      { label: 'Unlikely', min: 20, max: 40, color: '#f97316' },
      { label: 'Possible', min: 40, max: 60, color: '#eab308' },
      { label: 'Likely', min: 60, max: 80, color: '#10b981' },
      { label: 'Very Likely', min: 80, max: 100, color: '#22c55e' },
    ],
  },
}

// Get math scale
export function getMathScale(calculatorType: string): VisualScaleConfig | null {
  return mathScales[calculatorType] || null
}

// Quadratic equation visualization data
export interface QuadraticVisualization {
  vertex: { x: number; y: number }
  roots: { x1: number | null; x2: number | null; type: 'real' | 'complex' | 'repeated' }
  discriminant: number
  opensUp: boolean
  points: Array<{ x: number; y: number }>
}

export function getQuadraticVisualization(a: number, b: number, c: number): QuadraticVisualization {
  const discriminant = b * b - 4 * a * c
  const vertexX = -b / (2 * a)
  const vertexY = a * vertexX * vertexX + b * vertexX + c

  let roots: QuadraticVisualization['roots']

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant)
    roots = {
      x1: (-b + sqrtD) / (2 * a),
      x2: (-b - sqrtD) / (2 * a),
      type: 'real',
    }
  } else if (discriminant === 0) {
    roots = {
      x1: -b / (2 * a),
      x2: null,
      type: 'repeated',
    }
  } else {
    roots = {
      x1: null,
      x2: null,
      type: 'complex',
    }
  }

  // Generate points for plotting
  const range = 5
  const points: Array<{ x: number; y: number }> = []
  for (let x = vertexX - range; x <= vertexX + range; x += 0.5) {
    points.push({ x, y: a * x * x + b * x + c })
  }

  return {
    vertex: { x: vertexX, y: vertexY },
    roots,
    discriminant,
    opensUp: a > 0,
    points,
  }
}

// Step-by-step calculation display
export interface CalculationStep {
  description: string
  expression: string
  result: string | number
}

export function generatePercentageSteps(
  type: 'findPart' | 'findPercent' | 'findWhole' | 'change',
  values: { percent?: number; whole?: number; part?: number; oldValue?: number; newValue?: number }
): CalculationStep[] {
  const steps: CalculationStep[] = []

  switch (type) {
    case 'findPart':
      steps.push(
        { description: 'Convert percentage to decimal', expression: `${values.percent}% ÷ 100`, result: (values.percent! / 100).toFixed(4) },
        { description: 'Multiply by the whole', expression: `${values.percent! / 100} × ${values.whole}`, result: (values.percent! / 100 * values.whole!).toFixed(2) }
      )
      break
    case 'findPercent':
      steps.push(
        { description: 'Divide part by whole', expression: `${values.part} ÷ ${values.whole}`, result: (values.part! / values.whole!).toFixed(4) },
        { description: 'Convert to percentage', expression: `${(values.part! / values.whole!).toFixed(4)} × 100`, result: `${(values.part! / values.whole! * 100).toFixed(2)}%` }
      )
      break
    case 'change':
      const change = values.newValue! - values.oldValue!
      steps.push(
        { description: 'Calculate the change', expression: `${values.newValue} - ${values.oldValue}`, result: change },
        { description: 'Divide by original', expression: `${change} ÷ ${values.oldValue}`, result: (change / values.oldValue!).toFixed(4) },
        { description: 'Convert to percentage', expression: `${(change / values.oldValue!).toFixed(4)} × 100`, result: `${(change / values.oldValue! * 100).toFixed(2)}%` }
      )
      break
  }

  return steps
}

// Statistics summary display
export interface StatisticsSummary {
  count: number
  sum: number
  mean: number
  median: number
  mode: number[]
  min: number
  max: number
  range: number
  variance: number
  stdDev: number
  q1: number
  q3: number
  iqr: number
}

export function calculateStatistics(data: number[]): StatisticsSummary {
  const sorted = [...data].sort((a, b) => a - b)
  const n = data.length
  const sum = data.reduce((a, b) => a + b, 0)
  const mean = sum / n

  // Median
  const mid = Math.floor(n / 2)
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]

  // Mode
  const counts = new Map<number, number>()
  data.forEach(v => counts.set(v, (counts.get(v) || 0) + 1))
  const maxCount = Math.max(...counts.values())
  const mode = [...counts.entries()].filter(([_, c]) => c === maxCount).map(([v]) => v)

  // Variance and SD
  const variance = data.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1)
  const stdDev = Math.sqrt(variance)

  // Quartiles
  const q1Idx = Math.floor(n * 0.25)
  const q3Idx = Math.floor(n * 0.75)
  const q1 = sorted[q1Idx]
  const q3 = sorted[q3Idx]

  return {
    count: n,
    sum,
    mean,
    median,
    mode,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    variance,
    stdDev,
    q1,
    q3,
    iqr: q3 - q1,
  }
}

// Fraction display helper
export function formatFraction(numerator: number, denominator: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator))
  const simpNum = numerator / divisor
  const simpDen = denominator / divisor
  return `${simpNum}/${simpDen}`
}
