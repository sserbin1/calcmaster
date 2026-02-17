// State housing calculations — mortgage, rent vs buy, closing costs, homestead, affordability
import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

const housingBaseTypes = [
  'mortgage', 'rent-vs-buy', 'closing-costs', 'homestead-exemption',
  'home-affordability', 'rent-affordability', 'down-payment',
  'home-equity', 'refinance', 'adu-roi',
]

export function getStateHousingFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  if (!housingBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'mortgage':
      return [
        { name: 'homePrice', label: 'Home Price ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'downPayment', label: 'Down Payment (%)', type: 'number', default: 20, min: 0, max: 100 },
        { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', default: Number(stateData.avgMortgageRate) || 6.5, step: 0.1 },
        { name: 'loanTerm', label: 'Loan Term (years)', type: 'select', options: [
          { value: '30', label: '30 Years' },
          { value: '20', label: '20 Years' },
          { value: '15', label: '15 Years' },
        ], default: '30' },
        { name: 'includePropertyTax', label: 'Include Property Tax', type: 'select', options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ], default: 'yes' },
      ]

    case 'rent-vs-buy':
      return [
        { name: 'homePrice', label: 'Home Price ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', default: Number(stateData.medianRent) || 1500, min: 0 },
        { name: 'downPayment', label: 'Down Payment (%)', type: 'number', default: 20, min: 0, max: 100 },
        { name: 'yearsToStay', label: 'Years You Plan to Stay', type: 'number', default: 7, min: 1, max: 30 },
        { name: 'appreciation', label: 'Annual Home Appreciation (%)', type: 'number', default: 3, step: 0.5 },
      ]

    case 'closing-costs':
      return [
        { name: 'homePrice', label: 'Home Price ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'transactionType', label: 'Transaction Type', type: 'select', options: [
          { value: 'buyer', label: 'Buyer' },
          { value: 'seller', label: 'Seller' },
        ], default: 'buyer' },
      ]

    case 'homestead-exemption':
      return [
        { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'taxRate', label: 'Property Tax Rate (%)', type: 'number', default: Number(stateData.avgPropertyTaxRate) || 1.0, step: 0.01 },
        { name: 'isPrimary', label: 'Primary Residence?', type: 'select', options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ], default: 'yes' },
      ]

    case 'home-affordability':
      return [
        { name: 'annualIncome', label: 'Annual Household Income ($)', type: 'number', default: 75000, min: 0 },
        { name: 'monthlyDebts', label: 'Monthly Debts ($)', type: 'number', default: 500, min: 0 },
        { name: 'downPaymentSaved', label: 'Down Payment Saved ($)', type: 'number', default: 50000, min: 0 },
        { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', default: Number(stateData.avgMortgageRate) || 6.5, step: 0.1 },
      ]

    case 'rent-affordability':
      return [
        { name: 'monthlyIncome', label: 'Monthly Gross Income ($)', type: 'number', default: 5000, min: 0 },
        { name: 'percentRule', label: 'Affordability Rule', type: 'select', options: [
          { value: '30', label: '30% Rule (Recommended)' },
          { value: '25', label: '25% Rule (Conservative)' },
          { value: '35', label: '35% Rule (Aggressive)' },
        ], default: '30' },
      ]

    case 'down-payment':
      return [
        { name: 'homePrice', label: 'Target Home Price ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'targetPercent', label: 'Down Payment Goal (%)', type: 'select', options: [
          { value: '3', label: '3% (FHA Minimum)' },
          { value: '5', label: '5%' },
          { value: '10', label: '10%' },
          { value: '20', label: '20% (Avoid PMI)' },
        ], default: '20' },
        { name: 'monthlySavings', label: 'Monthly Savings ($)', type: 'number', default: 1000, min: 0 },
        { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', default: 10000, min: 0 },
      ]

    case 'home-equity':
      return [
        { name: 'homeValue', label: 'Current Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'mortgageBalance', label: 'Remaining Mortgage ($)', type: 'number', default: 250000, min: 0 },
        { name: 'loanType', label: 'Equity Loan Type', type: 'select', options: [
          { value: 'heloc', label: 'HELOC' },
          { value: 'loan', label: 'Home Equity Loan' },
        ], default: 'heloc' },
      ]

    case 'refinance':
      return [
        { name: 'currentBalance', label: 'Current Loan Balance ($)', type: 'number', default: 250000, min: 0 },
        { name: 'currentRate', label: 'Current Interest Rate (%)', type: 'number', default: 7.0, step: 0.1 },
        { name: 'newRate', label: 'New Interest Rate (%)', type: 'number', default: Number(stateData.avgMortgageRate) || 6.5, step: 0.1 },
        { name: 'remainingYears', label: 'Remaining Loan Term (years)', type: 'number', default: 25, min: 1, max: 30 },
        { name: 'closingCosts', label: 'Refinance Closing Costs ($)', type: 'number', default: 5000, min: 0 },
      ]

    case 'adu-roi':
      return [
        { name: 'buildCost', label: 'ADU Build Cost ($)', type: 'number', default: Number(stateData.avgADUCost) || 150000, min: 0 },
        { name: 'monthlyRent', label: 'Expected Monthly Rent ($)', type: 'number', default: Number(stateData.medianRent) || 1500, min: 0 },
        { name: 'propertyValueIncrease', label: 'Property Value Increase (%)', type: 'number', default: 10, step: 1 },
        { name: 'homeValue', label: 'Current Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
      ]

    default:
      return [
        { name: 'homePrice', label: 'Home Price ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
      ]
  }
}

export function calculateStateHousing(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!housingBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'mortgage': {
      const homePrice = Number(input.homePrice || 350000)
      const downPct = Number(input.downPayment || 20) / 100
      const annualRate = Number(input.interestRate || 6.5) / 100
      const rate = annualRate / 12
      const months = Number(input.loanTerm || 30) * 12
      const loanAmount = homePrice * (1 - downPct)
      const includePropertyTax = String(input.includePropertyTax) !== 'no'

      const monthlyPI = rate > 0
        ? loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
        : loanAmount / months

      const propertyTaxRate = Number(stateData.avgPropertyTaxRate || 1) / 100
      const monthlyTax = includePropertyTax ? (homePrice * propertyTaxRate) / 12 : 0
      const monthlyInsurance = homePrice * 0.004 / 12 // ~0.4% annual
      const pmi = downPct < 0.2 ? loanAmount * 0.005 / 12 : 0
      const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + pmi
      const totalPaid = monthlyPI * months

      return {
        primary: { value: Math.round(totalMonthly), label: 'Total Monthly Payment', unit: '$/mo' },
        secondary: [
          { label: 'Principal & Interest', value: Math.round(monthlyPI), unit: '$/mo' },
          { label: 'Property Tax', value: Math.round(monthlyTax), unit: '$/mo' },
          { label: 'Insurance', value: Math.round(monthlyInsurance), unit: '$/mo' },
          ...(pmi > 0 ? [{ label: 'PMI', value: Math.round(pmi), unit: '$/mo' }] : []),
          { label: 'Down Payment', value: Math.round(homePrice * downPct), unit: '$' },
          { label: 'Total Interest', value: Math.round(totalPaid - loanAmount), unit: '$' },
        ],
      }
    }

    case 'rent-vs-buy': {
      const homePrice = Number(input.homePrice || 350000)
      const rent = Number(input.monthlyRent || 1500)
      const downPct = Number(input.downPayment || 20) / 100
      const years = Number(input.yearsToStay || 7)
      const appreciation = Number(input.appreciation || 3) / 100
      const mortgageRate = Number(stateData.avgMortgageRate || 6.5) / 100 / 12
      const loanAmount = homePrice * (1 - downPct)
      const months = 30 * 12
      const monthlyMortgage = mortgageRate > 0
        ? loanAmount * (mortgageRate * Math.pow(1 + mortgageRate, months)) / (Math.pow(1 + mortgageRate, months) - 1)
        : loanAmount / months
      const propertyTaxRate = Number(stateData.avgPropertyTaxRate || 1) / 100
      const monthlyOwnership = monthlyMortgage + (homePrice * propertyTaxRate / 12) + (homePrice * 0.004 / 12)

      const totalRent = rent * years * 12 * (1 + 0.03 * years / 2) // ~3% annual rent increase
      const totalOwnership = monthlyOwnership * years * 12
      const homeValueEnd = homePrice * Math.pow(1 + appreciation, years)
      const equityGained = homeValueEnd - loanAmount + (homePrice * downPct)

      const buyAdvantage = equityGained - totalOwnership + totalRent - (homePrice * downPct)

      return {
        primary: { value: Math.round(buyAdvantage), label: buyAdvantage > 0 ? 'Buying Saves You' : 'Renting Saves You', unit: '$' },
        secondary: [
          { label: 'Total Rent Cost', value: Math.round(totalRent), unit: '$' },
          { label: 'Total Ownership Cost', value: Math.round(totalOwnership), unit: '$' },
          { label: 'Home Value After', value: Math.round(homeValueEnd), unit: '$' },
          { label: 'Equity Gained', value: Math.round(equityGained), unit: '$' },
        ],
        advice: buyAdvantage > 0
          ? `Over ${years} years, buying is projected to save you $${Math.abs(Math.round(buyAdvantage)).toLocaleString()}.`
          : `Over ${years} years, renting may save you $${Math.abs(Math.round(buyAdvantage)).toLocaleString()}.`,
      }
    }

    case 'closing-costs': {
      const homePrice = Number(input.homePrice || 350000)
      const isBuyer = String(input.transactionType) !== 'seller'
      const closingRate = Number(stateData.avgClosingCostRate || (isBuyer ? 3 : 8)) / 100
      const transferTax = Number(stateData.transferTaxRate || 0) / 100
      const closingCosts = homePrice * closingRate
      const transferAmount = homePrice * transferTax

      return {
        primary: { value: Math.round(closingCosts + transferAmount), label: `${isBuyer ? 'Buyer' : 'Seller'} Closing Costs`, unit: '$' },
        secondary: [
          { label: 'Title & Escrow', value: Math.round(closingCosts * 0.35), unit: '$' },
          { label: 'Lender Fees', value: Math.round(closingCosts * 0.25), unit: '$' },
          { label: 'Transfer Tax', value: Math.round(transferAmount), unit: '$' },
          { label: 'Other Fees', value: Math.round(closingCosts * 0.40), unit: '$' },
          { label: 'Closing Rate', value: (closingRate * 100).toFixed(1), unit: '%' },
        ],
      }
    }

    case 'homestead-exemption': {
      const homeValue = Number(input.homeValue || 350000)
      const taxRate = Number(input.taxRate || stateData.avgPropertyTaxRate || 1) / 100
      const isPrimary = String(input.isPrimary) !== 'no'
      const exemption = isPrimary ? Number(stateData.homesteadExemption || 0) : 0
      const taxableValue = Math.max(0, homeValue - exemption)
      const taxWithout = homeValue * taxRate
      const taxWith = taxableValue * taxRate
      const savings = taxWithout - taxWith

      return {
        primary: { value: Math.round(savings), label: 'Annual Tax Savings', unit: '$' },
        secondary: [
          { label: 'Homestead Exemption', value: exemption.toLocaleString(), unit: '$' },
          { label: 'Tax Without Exemption', value: Math.round(taxWithout), unit: '$' },
          { label: 'Tax With Exemption', value: Math.round(taxWith), unit: '$' },
          { label: 'Monthly Savings', value: Math.round(savings / 12), unit: '$' },
        ],
        advice: exemption > 0
          ? `The homestead exemption reduces your taxable value by $${exemption.toLocaleString()}.`
          : 'This state does not offer a homestead exemption.',
      }
    }

    case 'home-affordability': {
      const income = Number(input.annualIncome || 75000)
      const monthlyDebts = Number(input.monthlyDebts || 500)
      const downPayment = Number(input.downPaymentSaved || 50000)
      const rate = Number(input.interestRate || 6.5) / 100 / 12
      const months = 360 // 30 years

      // 28/36 rule: housing max 28% of gross, total debt max 36%
      const monthlyIncome = income / 12
      const maxHousing = monthlyIncome * 0.28
      const maxTotalDebt = monthlyIncome * 0.36
      const maxMortgagePayment = Math.min(maxHousing, maxTotalDebt - monthlyDebts)

      // Reverse mortgage formula: payment → principal
      const maxLoan = rate > 0
        ? maxMortgagePayment * (Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months))
        : maxMortgagePayment * months

      const maxHomePrice = maxLoan + downPayment
      const propertyTaxRate = Number(stateData.avgPropertyTaxRate || 1) / 100
      // Adjust for property tax eating into payment
      const adjustedMax = maxHomePrice / (1 + propertyTaxRate / 12 * months / maxMortgagePayment * 0.1)

      return {
        primary: { value: Math.round(adjustedMax), label: 'Max Home Price', unit: '$' },
        secondary: [
          { label: 'Max Monthly Payment', value: Math.round(maxMortgagePayment), unit: '$' },
          { label: 'Max Loan Amount', value: Math.round(maxLoan), unit: '$' },
          { label: 'Down Payment', value: Math.round(downPayment), unit: '$' },
          { label: 'Debt-to-Income Ratio', value: ((monthlyDebts + maxMortgagePayment) / monthlyIncome * 100).toFixed(0), unit: '%' },
        ],
      }
    }

    case 'rent-affordability': {
      const monthlyIncome = Number(input.monthlyIncome || 5000)
      const percent = Number(input.percentRule || 30) / 100
      const maxRent = monthlyIncome * percent
      const medianRent = Number(stateData.medianRent || 1500)

      return {
        primary: { value: Math.round(maxRent), label: 'Max Affordable Rent', unit: '$/mo' },
        secondary: [
          { label: 'State Median Rent', value: Math.round(medianRent), unit: '$/mo' },
          { label: 'Annual Rent Budget', value: Math.round(maxRent * 12), unit: '$' },
          { label: 'Rent as % of Income', value: (percent * 100).toFixed(0), unit: '%' },
        ],
        advice: maxRent >= medianRent
          ? `You can afford the median rent of $${Math.round(medianRent).toLocaleString()}/mo in this state.`
          : `The median rent of $${Math.round(medianRent).toLocaleString()}/mo exceeds your budget by $${Math.round(medianRent - maxRent).toLocaleString()}/mo.`,
      }
    }

    case 'down-payment': {
      const homePrice = Number(input.homePrice || 350000)
      const targetPct = Number(input.targetPercent || 20) / 100
      const monthlySavings = Number(input.monthlySavings || 1000)
      const currentSavings = Number(input.currentSavings || 10000)
      const needed = homePrice * targetPct
      const remaining = Math.max(0, needed - currentSavings)
      const monthsToSave = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : Infinity

      return {
        primary: { value: Math.round(needed), label: 'Down Payment Needed', unit: '$' },
        secondary: [
          { label: 'Already Saved', value: Math.round(currentSavings), unit: '$' },
          { label: 'Still Needed', value: Math.round(remaining), unit: '$' },
          { label: 'Months to Save', value: monthsToSave === Infinity ? 'N/A' : monthsToSave, unit: monthsToSave === Infinity ? '' : 'months' },
          { label: 'Target Date', value: monthsToSave === Infinity ? 'N/A' : `~${Math.ceil(monthsToSave / 12)} years`, unit: '' },
        ],
      }
    }

    case 'home-equity': {
      const homeValue = Number(input.homeValue || 350000)
      const balance = Number(input.mortgageBalance || 250000)
      const equity = homeValue - balance
      const ltvRatio = (balance / homeValue) * 100
      // Most lenders allow up to 80-85% CLTV
      const maxBorrow = Math.max(0, homeValue * 0.8 - balance)

      return {
        primary: { value: Math.round(equity), label: 'Total Home Equity', unit: '$' },
        secondary: [
          { label: 'Borrowable Equity', value: Math.round(maxBorrow), unit: '$' },
          { label: 'LTV Ratio', value: ltvRatio.toFixed(1), unit: '%' },
          { label: 'Equity Percentage', value: ((equity / homeValue) * 100).toFixed(1), unit: '%' },
        ],
        advice: maxBorrow > 0
          ? `You could borrow up to $${Math.round(maxBorrow).toLocaleString()} against your home equity (80% CLTV).`
          : 'Your current LTV is too high to borrow additional equity.',
      }
    }

    case 'refinance': {
      const balance = Number(input.currentBalance || 250000)
      const currentRate = Number(input.currentRate || 7.0) / 100 / 12
      const newRate = Number(input.newRate || 6.5) / 100 / 12
      const years = Number(input.remainingYears || 25)
      const closingCosts = Number(input.closingCosts || 5000)
      const months = years * 12

      const currentPayment = currentRate > 0
        ? balance * (currentRate * Math.pow(1 + currentRate, months)) / (Math.pow(1 + currentRate, months) - 1)
        : balance / months

      const newPayment = newRate > 0
        ? balance * (newRate * Math.pow(1 + newRate, months)) / (Math.pow(1 + newRate, months) - 1)
        : balance / months

      const monthlySavings = currentPayment - newPayment
      const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity
      const totalSavings = monthlySavings * months - closingCosts

      return {
        primary: { value: Math.round(monthlySavings), label: 'Monthly Savings', unit: '$/mo' },
        secondary: [
          { label: 'Current Payment', value: Math.round(currentPayment), unit: '$/mo' },
          { label: 'New Payment', value: Math.round(newPayment), unit: '$/mo' },
          { label: 'Break-Even', value: breakEvenMonths === Infinity ? 'Never' : `${breakEvenMonths} months`, unit: '' },
          { label: 'Total Savings', value: Math.round(totalSavings), unit: '$' },
          { label: 'Closing Costs', value: Math.round(closingCosts), unit: '$' },
        ],
        advice: totalSavings > 0
          ? `Refinancing saves $${Math.round(totalSavings).toLocaleString()} over the loan term after closing costs.`
          : 'Refinancing may not be beneficial at this rate difference.',
      }
    }

    case 'adu-roi': {
      const buildCost = Number(input.buildCost || 150000)
      const monthlyRent = Number(input.monthlyRent || 1500)
      const valueIncreasePct = Number(input.propertyValueIncrease || 10) / 100
      const homeValue = Number(input.homeValue || 350000)
      const annualRent = monthlyRent * 12
      const propertyIncrease = homeValue * valueIncreasePct
      const yearsToPayback = buildCost / annualRent
      const roi10Year = (annualRent * 10 + propertyIncrease - buildCost) / buildCost * 100

      return {
        primary: { value: roi10Year.toFixed(1), label: '10-Year ROI', unit: '%' },
        secondary: [
          { label: 'Annual Rental Income', value: Math.round(annualRent), unit: '$' },
          { label: 'Property Value Increase', value: Math.round(propertyIncrease), unit: '$' },
          { label: 'Payback Period', value: yearsToPayback.toFixed(1), unit: 'years' },
          { label: 'Build Cost', value: Math.round(buildCost), unit: '$' },
        ],
      }
    }

    default:
      return {
        primary: { value: Number(input.homePrice || 0), label: `${baseType} Result`, unit: '$' },
        advice: 'Calculator under development.',
      }
  }
}
