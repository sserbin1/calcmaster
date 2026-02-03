// Finance calculator visual scale configurations and helpers

import type { VisualScaleConfig } from '@/types/methodology'
import { DTI_SCALE } from './scale-presets'

// Debt-to-Income ratio scale
export const financeScales: Record<string, VisualScaleConfig> = {
  dti: DTI_SCALE,

  'savings-rate': {
    type: 'gauge',
    min: 0,
    max: 50,
    unit: '%',
    showLabels: true,
    animate: true,
    segments: [
      { label: 'Low', min: 0, max: 10, color: '#ef4444', description: 'Below recommended' },
      { label: 'Adequate', min: 10, max: 15, color: '#eab308', description: 'Minimum recommended' },
      { label: 'Good', min: 15, max: 25, color: '#22c55e', description: 'Healthy savings rate' },
      { label: 'Excellent', min: 25, max: 50, color: '#10b981', description: 'FIRE territory' },
    ],
  },

  'emergency-fund': {
    type: 'progress',
    min: 0,
    max: 6,
    unit: 'months',
    showLabels: true,
    animate: true,
    segments: [
      { label: 'Critical', min: 0, max: 1, color: '#ef4444', description: 'Immediate risk' },
      { label: 'Starter', min: 1, max: 3, color: '#eab308', description: 'Basic cushion' },
      { label: 'Solid', min: 3, max: 6, color: '#22c55e', description: 'Recommended' },
    ],
  },
}

// Get finance scale
export function getFinanceScale(calculatorType: string): VisualScaleConfig | null {
  return financeScales[calculatorType] || null
}

// Amortization schedule types
export interface AmortizationPayment {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
  totalPrincipal: number
  totalInterest: number
}

// Generate amortization schedule
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number = 0
): AmortizationPayment[] {
  const monthlyRate = annualRate / 100 / 12
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  const schedule: AmortizationPayment[] = []
  let balance = principal
  let totalPrincipal = 0
  let totalInterest = 0

  for (let month = 1; month <= termMonths && balance > 0; month++) {
    const interestPayment = balance * monthlyRate
    let principalPayment = payment - interestPayment + extraPayment

    if (principalPayment > balance) {
      principalPayment = balance
    }

    balance -= principalPayment
    totalPrincipal += principalPayment
    totalInterest += interestPayment

    schedule.push({
      month,
      payment: principalPayment + interestPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
      totalPrincipal,
      totalInterest,
    })

    if (balance <= 0) break
  }

  return schedule
}

// Get amortization summary
export function getAmortizationSummary(schedule: AmortizationPayment[]) {
  const lastPayment = schedule[schedule.length - 1]
  return {
    totalPayments: schedule.length,
    totalPaid: lastPayment.totalPrincipal + lastPayment.totalInterest,
    totalInterest: lastPayment.totalInterest,
    totalPrincipal: lastPayment.totalPrincipal,
    monthlyPayment: schedule[0].payment,
  }
}

// Budget allocation helper
export interface BudgetAllocation {
  category: string
  amount: number
  percentage: number
  color: string
  recommended?: { min: number; max: number }
}

export function calculate5030Budget(monthlyIncome: number): BudgetAllocation[] {
  return [
    {
      category: 'Needs',
      amount: monthlyIncome * 0.5,
      percentage: 50,
      color: '#ef4444',
      recommended: { min: 50, max: 50 },
    },
    {
      category: 'Wants',
      amount: monthlyIncome * 0.3,
      percentage: 30,
      color: '#eab308',
      recommended: { min: 30, max: 30 },
    },
    {
      category: 'Savings & Debt',
      amount: monthlyIncome * 0.2,
      percentage: 20,
      color: '#22c55e',
      recommended: { min: 20, max: 20 },
    },
  ]
}

// ROI classification
export function getROIClassification(roi: number, years: number): { label: string; color: string; description: string } {
  const annualized = years > 1 ? Math.pow(1 + roi / 100, 1 / years) - 1 : roi / 100

  if (annualized < 0) return { label: 'Loss', color: '#ef4444', description: 'Negative return' }
  if (annualized < 0.03) return { label: 'Below Inflation', color: '#f97316', description: 'May not keep pace with inflation' }
  if (annualized < 0.07) return { label: 'Moderate', color: '#eab308', description: 'Reasonable return' }
  if (annualized < 0.12) return { label: 'Good', color: '#22c55e', description: 'Above market average' }
  return { label: 'Excellent', color: '#10b981', description: 'Outstanding performance' }
}

// Debt payoff comparison
export interface DebtPayoffComparison {
  avalanche: { months: number; totalInterest: number }
  snowball: { months: number; totalInterest: number }
  savings: number
}

export interface Debt {
  name: string
  balance: number
  rate: number
  minimum: number
}

export function compareDebtStrategies(
  debts: Debt[],
  extraPayment: number
): DebtPayoffComparison {
  // Simplified calculation - full implementation would simulate month by month
  const avalancheOrder = [...debts].sort((a, b) => b.rate - a.rate)
  const snowballOrder = [...debts].sort((a, b) => a.balance - b.balance)

  // Estimate based on weighted average (simplified)
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const avgRate = debts.reduce((sum, d) => sum + d.rate * (d.balance / totalDebt), 0)

  const avalancheMonths = Math.ceil(totalDebt / (extraPayment + debts.reduce((sum, d) => sum + d.minimum, 0) / debts.length))
  const snowballMonths = avalancheMonths + Math.ceil(debts.length * 1.5) // Snowball typically takes slightly longer

  const avalancheInterest = totalDebt * (avgRate / 100) * (avalancheMonths / 12) * 0.5
  const snowballInterest = totalDebt * (avgRate / 100) * (snowballMonths / 12) * 0.55

  return {
    avalanche: { months: avalancheMonths, totalInterest: avalancheInterest },
    snowball: { months: snowballMonths, totalInterest: snowballInterest },
    savings: snowballInterest - avalancheInterest,
  }
}

// Retirement progress indicator
export function getRetirementProgress(
  currentSavings: number,
  targetSavings: number,
  yearsToRetirement: number
): { percentage: number; status: string; color: string; monthlyNeeded: number } {
  const percentage = (currentSavings / targetSavings) * 100
  const gap = targetSavings - currentSavings
  const monthlyNeeded = gap / (yearsToRetirement * 12)

  if (percentage >= 100) {
    return { percentage: 100, status: 'On Track', color: '#22c55e', monthlyNeeded: 0 }
  }
  if (percentage >= 75) {
    return { percentage, status: 'Good Progress', color: '#10b981', monthlyNeeded }
  }
  if (percentage >= 50) {
    return { percentage, status: 'Making Progress', color: '#eab308', monthlyNeeded }
  }
  if (percentage >= 25) {
    return { percentage, status: 'Behind Schedule', color: '#f97316', monthlyNeeded }
  }
  return { percentage, status: 'Just Starting', color: '#ef4444', monthlyNeeded }
}
