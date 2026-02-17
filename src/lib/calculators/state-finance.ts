// State finance calculations — income tax, property tax, sales tax, capital gains, estate tax
// Stub: will be fully implemented in Batch 1B Task 10

import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

const financeBaseTypes = [
  'income-tax', 'property-tax', 'sales-tax', 'capital-gains-tax', 'estate-tax',
  'state-tax', 'tax-comparison', 'tax-bracket', 'effective-tax-rate',
  'paycheck', 'self-employment-tax', 'investment-tax', 'retirement-tax',
]

export function getStateFinanceFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  if (!financeBaseTypes.includes(baseType)) return null

  // Default fields based on baseType — overridden by JSON fields when available
  switch (baseType) {
    case 'income-tax':
      return [
        { name: 'annualIncome', label: 'Annual Income ($)', type: 'number', default: 75000, min: 0 },
        { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married Filing Jointly' },
          { value: 'head', label: 'Head of Household' },
        ], default: 'single' },
      ]
    case 'property-tax':
      return [
        { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 300000, min: 0 },
        { name: 'taxRate', label: 'Tax Rate (%)', type: 'number', default: Number(stateData.avgPropertyTaxRate) || 1.0, step: 0.01 },
      ]
    case 'sales-tax':
      return [
        { name: 'purchaseAmount', label: 'Purchase Amount ($)', type: 'number', default: 100, min: 0 },
        { name: 'localRate', label: 'Local Tax Rate (%)', type: 'number', default: 0, step: 0.01 },
      ]
    case 'capital-gains-tax':
      return [
        { name: 'gain', label: 'Capital Gain ($)', type: 'number', default: 50000, min: 0 },
        { name: 'holdingPeriod', label: 'Holding Period', type: 'select', options: [
          { value: 'short', label: 'Short-term (< 1 year)' },
          { value: 'long', label: 'Long-term (1+ years)' },
        ], default: 'long' },
        { name: 'annualIncome', label: 'Annual Income ($)', type: 'number', default: 75000, min: 0 },
      ]
    case 'estate-tax':
      return [
        { name: 'estateValue', label: 'Estate Value ($)', type: 'number', default: 1000000, min: 0 },
      ]
    case 'paycheck':
    case 'effective-tax-rate':
      return [
        { name: 'grossPay', label: 'Gross Pay ($)', type: 'number', default: 5000, min: 0 },
        { name: 'payFrequency', label: 'Pay Frequency', type: 'select', options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly' },
          { value: 'semimonthly', label: 'Semi-monthly' },
          { value: 'monthly', label: 'Monthly' },
        ], default: 'biweekly' },
        { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
        ], default: 'single' },
      ]
    case 'self-employment-tax':
      return [
        { name: 'netEarnings', label: 'Net Self-Employment Earnings ($)', type: 'number', default: 80000, min: 0 },
      ]
    case 'retirement-tax':
      return [
        { name: 'retirementIncome', label: 'Annual Retirement Income ($)', type: 'number', default: 50000, min: 0 },
        { name: 'incomeSource', label: 'Income Source', type: 'select', options: [
          { value: 'social-security', label: 'Social Security' },
          { value: 'pension', label: 'Pension' },
          { value: '401k', label: '401k/IRA Withdrawal' },
        ], default: '401k' },
      ]
    default:
      return [
        { name: 'amount', label: 'Amount ($)', type: 'number', default: 50000, min: 0 },
      ]
  }
}

export function calculateStateFinance(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!financeBaseTypes.includes(baseType)) return null

  const amount = Number(input.annualIncome || input.homeValue || input.purchaseAmount || input.amount || 0)

  switch (baseType) {
    case 'income-tax': {
      const brackets = stateData.taxBrackets as unknown as { min: number; max: number; rate: number }[] | undefined
      if (brackets && Array.isArray(brackets)) {
        let tax = 0
        for (const bracket of brackets) {
          if (amount > bracket.min) {
            const taxableInBracket = Math.min(amount, bracket.max || Infinity) - bracket.min
            tax += taxableInBracket * (bracket.rate / 100)
          }
        }
        const effectiveRate = amount > 0 ? (tax / amount) * 100 : 0
        return {
          primary: { value: Math.round(tax), label: 'State Income Tax', unit: '$' },
          secondary: [
            { label: 'Effective Rate', value: effectiveRate.toFixed(2), unit: '%' },
            { label: 'After Tax Income', value: Math.round(amount - tax), unit: '$' },
          ],
          advice: `Your effective state income tax rate is ${effectiveRate.toFixed(2)}%.`,
        }
      }
      // No-income-tax state
      if (stateData.hasIncomeTax === false) {
        return {
          primary: { value: 0, label: 'State Income Tax', unit: '$' },
          advice: `This state has no state income tax. Your full income of $${amount.toLocaleString()} is not subject to state income tax.`,
        }
      }
      // Flat rate
      const flatRate = Number(stateData.flatTaxRate || stateData.incomeTaxRate || 0)
      const tax = amount * (flatRate / 100)
      return {
        primary: { value: Math.round(tax), label: 'State Income Tax', unit: '$' },
        secondary: [
          { label: 'Tax Rate', value: flatRate.toFixed(2), unit: '%' },
          { label: 'After Tax Income', value: Math.round(amount - tax), unit: '$' },
        ],
      }
    }

    case 'property-tax': {
      const rate = Number(input.taxRate || stateData.avgPropertyTaxRate || 1) / 100
      const homeValue = Number(input.homeValue || 300000)
      const annualTax = homeValue * rate
      return {
        primary: { value: Math.round(annualTax), label: 'Annual Property Tax', unit: '$' },
        secondary: [
          { label: 'Monthly Tax', value: Math.round(annualTax / 12), unit: '$' },
          { label: 'Effective Rate', value: (rate * 100).toFixed(2), unit: '%' },
        ],
      }
    }

    case 'sales-tax': {
      const stateRate = Number(stateData.salesTaxRate || 0)
      const localRate = Number(input.localRate || 0)
      const totalRate = stateRate + localRate
      const purchaseAmount = Number(input.purchaseAmount || 100)
      const tax = purchaseAmount * (totalRate / 100)
      return {
        primary: { value: tax.toFixed(2), label: 'Total Sales Tax', unit: '$' },
        secondary: [
          { label: 'State Rate', value: stateRate.toFixed(2), unit: '%' },
          { label: 'Local Rate', value: localRate.toFixed(2), unit: '%' },
          { label: 'Total with Tax', value: (purchaseAmount + tax).toFixed(2), unit: '$' },
        ],
      }
    }

    case 'capital-gains-tax': {
      const gain = Number(input.gain || 50000)
      const holding = String(input.holdingPeriod || 'long')
      // Short-term = taxed as income, long-term = often same rate or lower in some states
      const stateRate = holding === 'short'
        ? Number(stateData.topIncomeTaxRate || stateData.flatTaxRate || 0)
        : Number(stateData.capitalGainsRate || stateData.topIncomeTaxRate || stateData.flatTaxRate || 0)
      const stateTax = gain * (stateRate / 100)
      const fedRate = holding === 'long' ? 15 : 22  // simplified federal rates
      const fedTax = gain * (fedRate / 100)
      return {
        primary: { value: Math.round(stateTax), label: 'State Capital Gains Tax', unit: '$' },
        secondary: [
          { label: 'State Rate', value: stateRate.toFixed(2), unit: '%' },
          { label: 'Federal Tax (est.)', value: Math.round(fedTax), unit: '$' },
          { label: 'Total Tax', value: Math.round(stateTax + fedTax), unit: '$' },
          { label: 'Net After Tax', value: Math.round(gain - stateTax - fedTax), unit: '$' },
        ],
      }
    }

    case 'estate-tax': {
      const estate = Number(input.estateValue || 1000000)
      const hasEstateTax = stateData.hasEstateTax !== false
      const exemption = Number(stateData.estateExemption || 0)
      const estateRate = Number(stateData.estateTopRate || 0)

      if (!hasEstateTax || exemption === 0) {
        return {
          primary: { value: 0, label: 'State Estate Tax', unit: '$' },
          advice: 'This state does not impose a separate estate or inheritance tax.',
        }
      }

      const taxable = Math.max(0, estate - exemption)
      const tax = taxable * (estateRate / 100)
      return {
        primary: { value: Math.round(tax), label: 'Estimated State Estate Tax', unit: '$' },
        secondary: [
          { label: 'Exemption', value: exemption.toLocaleString(), unit: '$' },
          { label: 'Taxable Amount', value: Math.round(taxable), unit: '$' },
          { label: 'Top Rate', value: estateRate, unit: '%' },
        ],
      }
    }

    case 'paycheck':
    case 'effective-tax-rate': {
      const grossPay = Number(input.grossPay || 5000)
      const freq = String(input.payFrequency || 'biweekly')
      const periodsPerYear = freq === 'weekly' ? 52 : freq === 'biweekly' ? 26 : freq === 'semimonthly' ? 24 : 12
      const annualGross = grossPay * periodsPerYear

      const stateRate = Number(stateData.flatTaxRate || stateData.topIncomeTaxRate || 0) / 100
      const stateTaxPerPeriod = grossPay * stateRate
      const federalPerPeriod = grossPay * 0.22
      const ficaPerPeriod = grossPay * 0.0765
      const netPay = grossPay - stateTaxPerPeriod - federalPerPeriod - ficaPerPeriod

      return {
        primary: { value: Math.round(netPay * 100) / 100, label: 'Net Pay', unit: '$' },
        secondary: [
          { label: 'State Tax', value: Math.round(stateTaxPerPeriod * 100) / 100, unit: '$' },
          { label: 'Federal Tax (est.)', value: Math.round(federalPerPeriod * 100) / 100, unit: '$' },
          { label: 'FICA', value: Math.round(ficaPerPeriod * 100) / 100, unit: '$' },
          { label: 'Annual Net', value: Math.round(netPay * periodsPerYear), unit: '$' },
        ],
      }
    }

    case 'self-employment-tax': {
      const net = Number(input.netEarnings || 80000)
      const seTaxable = net * 0.9235  // 92.35% subject to SE tax
      const seTax = Math.min(seTaxable, 168600) * 0.153 + Math.max(0, seTaxable - 168600) * 0.029
      const stateRate = Number(stateData.flatTaxRate || stateData.topIncomeTaxRate || 0) / 100
      const stateTax = net * stateRate
      return {
        primary: { value: Math.round(seTax), label: 'Self-Employment Tax', unit: '$' },
        secondary: [
          { label: 'State Income Tax', value: Math.round(stateTax), unit: '$' },
          { label: 'Total Tax Burden', value: Math.round(seTax + stateTax), unit: '$' },
          { label: 'Net After All Tax', value: Math.round(net - seTax - stateTax), unit: '$' },
        ],
      }
    }

    case 'retirement-tax': {
      const income = Number(input.retirementIncome || 50000)
      const source = String(input.incomeSource || '401k')
      const taxesSS = stateData.taxesSocialSecurity !== false
      const taxesPension = stateData.taxesPension !== false

      let taxableIncome = income
      if (source === 'social-security' && !taxesSS) taxableIncome = 0
      if (source === 'pension' && !taxesPension) taxableIncome = 0

      const stateRate = Number(stateData.flatTaxRate || stateData.topIncomeTaxRate || 0) / 100
      const stateTax = taxableIncome * stateRate

      return {
        primary: { value: Math.round(stateTax), label: 'State Tax on Retirement Income', unit: '$' },
        secondary: [
          { label: 'Taxable Amount', value: Math.round(taxableIncome), unit: '$' },
          { label: 'After-Tax Income', value: Math.round(income - stateTax), unit: '$' },
        ],
        advice: taxableIncome === 0
          ? `This state does not tax ${source === 'social-security' ? 'Social Security' : 'pension'} income.`
          : `Your ${source} income is taxed at the state level.`,
      }
    }

    default:
      return {
        primary: { value: amount, label: `${baseType} Result`, unit: '$' },
        advice: 'This calculator is under development.',
      }
  }
}
