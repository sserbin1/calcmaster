// Math calculator implementations
// Extracted from calculator-engine.ts

import { create, all } from 'mathjs'

const math = create(all, {
  precision: 64,
  number: 'BigNumber',
})

import type { CalculatorInput, CalculatorOutput, CalculatorField } from '../calculator-engine'

export function getMathFields(type: string): CalculatorField[] | null {
  const fields: Record<string, CalculatorField[]> = {
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
  }
  return fields[type] || null
}

export function calculateMath(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  switch (type) {
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
    default:
      return null
  }
}
