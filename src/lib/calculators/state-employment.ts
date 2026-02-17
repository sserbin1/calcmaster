// State employment calculations — salary, minimum wage, overtime, workers comp, hourly-to-salary
import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

const employmentBaseTypes = [
  'salary-after-tax', 'minimum-wage', 'overtime', 'workers-comp',
  'take-home-pay', 'hourly-to-salary', 'paycheck', 'self-employment',
]

export function getStateEmploymentFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  if (!employmentBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'minimum-wage':
      return [
        { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', default: 40, min: 1, max: 80 },
        { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', default: 52, min: 1, max: 52 },
        { name: 'tippedWorker', label: 'Tipped Worker?', type: 'select', options: [
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes' },
        ], default: 'no' },
      ]

    case 'salary-after-tax':
    case 'take-home-pay':
      return [
        { name: 'grossSalary', label: 'Gross Annual Salary ($)', type: 'number', default: 60000, min: 0 },
        { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married Filing Jointly' },
          { value: 'head', label: 'Head of Household' },
        ], default: 'single' },
        { name: 'payFrequency', label: 'Pay Frequency', type: 'select', options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly' },
          { value: 'semimonthly', label: 'Semi-monthly' },
          { value: 'monthly', label: 'Monthly' },
        ], default: 'biweekly' },
        { name: 'retirement401k', label: '401k Contribution (%)', type: 'number', default: 0, min: 0, max: 100, step: 1 },
      ]

    case 'overtime':
      return [
        { name: 'hourlyRate', label: 'Regular Hourly Rate ($)', type: 'number', default: 25, min: 0 },
        { name: 'regularHours', label: 'Regular Hours/Week', type: 'number', default: 40, min: 0, max: 80 },
        { name: 'overtimeHours', label: 'Overtime Hours/Week', type: 'number', default: 10, min: 0, max: 60 },
        { name: 'overtimeMultiplier', label: 'Overtime Rate', type: 'select', options: [
          { value: '1.5', label: '1.5x (Standard)' },
          { value: '2', label: '2x (Double Time)' },
        ], default: '1.5' },
      ]

    case 'workers-comp':
      return [
        { name: 'annualPayroll', label: 'Annual Payroll ($)', type: 'number', default: 500000, min: 0 },
        { name: 'industryClass', label: 'Industry Classification', type: 'select', options: [
          { value: 'office', label: 'Office/Clerical' },
          { value: 'retail', label: 'Retail/Service' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'construction', label: 'Construction' },
          { value: 'restaurant', label: 'Restaurant/Hospitality' },
        ], default: 'office' },
        { name: 'employees', label: 'Number of Employees', type: 'number', default: 10, min: 1 },
      ]

    case 'hourly-to-salary':
      return [
        { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', default: 25, min: 0 },
        { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', default: 40, min: 1, max: 80 },
        { name: 'paidTimeOff', label: 'Paid Time Off (weeks)', type: 'number', default: 2, min: 0, max: 8 },
      ]

    case 'paycheck':
      return [
        { name: 'grossPay', label: 'Gross Pay per Period ($)', type: 'number', default: 3000, min: 0 },
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
        { name: 'allowances', label: 'Withholding Allowances', type: 'number', default: 1, min: 0, max: 10 },
      ]

    case 'self-employment':
      return [
        { name: 'netIncome', label: 'Net Self-Employment Income ($)', type: 'number', default: 80000, min: 0 },
        { name: 'businessExpenses', label: 'Deductible Expenses ($)', type: 'number', default: 15000, min: 0 },
        { name: 'quarterlyPayments', label: 'Quarterly Estimated Payments?', type: 'select', options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ], default: 'yes' },
      ]

    default:
      return [
        { name: 'amount', label: 'Amount ($)', type: 'number', default: 50000, min: 0 },
      ]
  }
}

export function calculateStateEmployment(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!employmentBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'minimum-wage': {
      const wage = Number(stateData.minimumWage || 7.25)
      const tippedWage = Number(stateData.tippedMinimumWage || 2.13)
      const isTipped = String(input.tippedWorker) === 'yes'
      const effectiveWage = isTipped ? tippedWage : wage
      const hours = Number(input.hoursPerWeek || 40)
      const weeks = Number(input.weeksPerYear || 52)
      const annual = effectiveWage * hours * weeks
      const federalMinimum = 7.25

      return {
        primary: { value: effectiveWage.toFixed(2), label: 'State Minimum Wage', unit: '$/hr' },
        secondary: [
          { label: 'Weekly Income', value: Math.round(effectiveWage * hours), unit: '$' },
          { label: 'Monthly Income', value: Math.round(annual / 12), unit: '$' },
          { label: 'Annual Income', value: Math.round(annual), unit: '$' },
          { label: 'Federal Minimum', value: federalMinimum.toFixed(2), unit: '$/hr' },
          ...(isTipped ? [{ label: 'Regular Minimum', value: wage.toFixed(2), unit: '$/hr' }] : []),
        ],
        advice: wage > federalMinimum
          ? `This state's minimum wage ($${wage.toFixed(2)}/hr) is $${(wage - federalMinimum).toFixed(2)} above the federal minimum.`
          : 'This state follows the federal minimum wage.',
      }
    }

    case 'salary-after-tax':
    case 'take-home-pay': {
      const gross = Number(input.grossSalary || 60000)
      const retirement = Number(input.retirement401k || 0) / 100
      const retirementDeduction = gross * retirement
      const taxableIncome = gross - retirementDeduction

      const stateRate = Number(stateData.incomeTaxRate || stateData.flatTaxRate || stateData.topIncomeTaxRate || 0) / 100
      const stateTax = stateData.hasIncomeTax === false ? 0 : taxableIncome * stateRate

      // Simplified federal brackets (2024)
      let federalTax = 0
      const brackets = [
        { max: 11600, rate: 0.10 },
        { max: 47150, rate: 0.12 },
        { max: 100525, rate: 0.22 },
        { max: 191950, rate: 0.24 },
        { max: 243725, rate: 0.32 },
        { max: 609350, rate: 0.35 },
        { max: Infinity, rate: 0.37 },
      ]
      let remaining = taxableIncome
      let prev = 0
      for (const bracket of brackets) {
        const taxable = Math.min(remaining, bracket.max - prev)
        if (taxable <= 0) break
        federalTax += taxable * bracket.rate
        remaining -= taxable
        prev = bracket.max
      }

      const fica = Math.min(gross, 168600) * 0.0765 + Math.max(0, gross - 168600) * 0.0145
      const net = gross - stateTax - federalTax - fica - retirementDeduction

      const freq = String(input.payFrequency || 'biweekly')
      const periods = freq === 'weekly' ? 52 : freq === 'biweekly' ? 26 : freq === 'semimonthly' ? 24 : 12

      return {
        primary: { value: Math.round(net), label: 'Annual Take-Home Pay', unit: '$' },
        secondary: [
          { label: 'Per Paycheck', value: Math.round(net / periods), unit: '$' },
          { label: 'Monthly', value: Math.round(net / 12), unit: '$' },
          { label: 'State Tax', value: Math.round(stateTax), unit: '$' },
          { label: 'Federal Tax', value: Math.round(federalTax), unit: '$' },
          { label: 'FICA', value: Math.round(fica), unit: '$' },
          ...(retirementDeduction > 0 ? [{ label: '401k Contribution', value: Math.round(retirementDeduction), unit: '$' }] : []),
          { label: 'Effective Tax Rate', value: ((stateTax + federalTax + fica) / gross * 100).toFixed(1), unit: '%' },
        ],
      }
    }

    case 'overtime': {
      const hourlyRate = Number(input.hourlyRate || 25)
      const regularHours = Number(input.regularHours || 40)
      const overtimeHours = Number(input.overtimeHours || 10)
      const multiplier = Number(input.overtimeMultiplier || 1.5)
      const overtimeRate = hourlyRate * multiplier

      const weeklyRegular = hourlyRate * regularHours
      const weeklyOvertime = overtimeRate * overtimeHours
      const weeklyTotal = weeklyRegular + weeklyOvertime
      const annualTotal = weeklyTotal * 52

      return {
        primary: { value: Math.round(weeklyTotal), label: 'Weekly Gross Pay', unit: '$' },
        secondary: [
          { label: 'Regular Pay', value: Math.round(weeklyRegular), unit: '$' },
          { label: 'Overtime Pay', value: Math.round(weeklyOvertime), unit: '$' },
          { label: 'OT Rate', value: overtimeRate.toFixed(2), unit: '$/hr' },
          { label: 'Monthly Gross', value: Math.round(annualTotal / 12), unit: '$' },
          { label: 'Annual Gross', value: Math.round(annualTotal), unit: '$' },
        ],
      }
    }

    case 'workers-comp': {
      const payroll = Number(input.annualPayroll || 500000)
      const industry = String(input.industryClass || 'office')
      const employees = Number(input.employees || 10)

      // Rate per $100 of payroll by industry class
      const rateMap: Record<string, number> = {
        office: Number(stateData.wcRateOffice || 0.25),
        retail: Number(stateData.wcRateRetail || 1.2),
        manufacturing: Number(stateData.wcRateManufacturing || 2.5),
        construction: Number(stateData.wcRateConstruction || 6.0),
        restaurant: Number(stateData.wcRateRestaurant || 1.8),
      }
      const rate = rateMap[industry] || 1.0
      const annualPremium = (payroll / 100) * rate
      const perEmployee = annualPremium / employees

      return {
        primary: { value: Math.round(annualPremium), label: 'Estimated Annual Premium', unit: '$' },
        secondary: [
          { label: 'Rate per $100', value: rate.toFixed(2), unit: '$' },
          { label: 'Cost per Employee', value: Math.round(perEmployee), unit: '$/yr' },
          { label: 'Monthly Cost', value: Math.round(annualPremium / 12), unit: '$' },
        ],
      }
    }

    case 'hourly-to-salary': {
      const hourlyRate = Number(input.hourlyRate || 25)
      const hours = Number(input.hoursPerWeek || 40)
      const pto = Number(input.paidTimeOff || 2)
      const workWeeks = 52 - pto
      const annualSalary = hourlyRate * hours * 52 // Salary includes PTO
      const actualEarned = hourlyRate * hours * workWeeks

      return {
        primary: { value: Math.round(annualSalary), label: 'Equivalent Annual Salary', unit: '$' },
        secondary: [
          { label: 'Monthly Salary', value: Math.round(annualSalary / 12), unit: '$' },
          { label: 'Working Weeks', value: workWeeks, unit: 'weeks' },
          { label: 'Hours Worked/Year', value: hours * workWeeks, unit: 'hours' },
          { label: 'Effective Hourly', value: (annualSalary / (hours * workWeeks)).toFixed(2), unit: '$/hr' },
        ],
      }
    }

    case 'paycheck': {
      const grossPay = Number(input.grossPay || 3000)
      const freq = String(input.payFrequency || 'biweekly')
      const periods = freq === 'weekly' ? 52 : freq === 'biweekly' ? 26 : freq === 'semimonthly' ? 24 : 12
      const annualGross = grossPay * periods

      const stateRate = Number(stateData.incomeTaxRate || stateData.flatTaxRate || stateData.topIncomeTaxRate || 0) / 100
      const stateWithholding = stateData.hasIncomeTax === false ? 0 : grossPay * stateRate
      const federalWithholding = grossPay * 0.22 // Simplified
      const socialSecurity = grossPay * 0.062
      const medicare = grossPay * 0.0145
      const netPay = grossPay - stateWithholding - federalWithholding - socialSecurity - medicare

      return {
        primary: { value: Math.round(netPay * 100) / 100, label: 'Net Pay', unit: '$' },
        secondary: [
          { label: 'Gross Pay', value: grossPay, unit: '$' },
          { label: 'State Tax', value: Math.round(stateWithholding * 100) / 100, unit: '$' },
          { label: 'Federal Tax', value: Math.round(federalWithholding * 100) / 100, unit: '$' },
          { label: 'Social Security', value: Math.round(socialSecurity * 100) / 100, unit: '$' },
          { label: 'Medicare', value: Math.round(medicare * 100) / 100, unit: '$' },
          { label: 'Annual Net', value: Math.round(netPay * periods), unit: '$' },
        ],
      }
    }

    case 'self-employment': {
      const netIncome = Number(input.netIncome || 80000)
      const expenses = Number(input.businessExpenses || 15000)
      const taxableIncome = netIncome - expenses

      // SE tax: 92.35% of net earnings subject to 15.3% (SS+Medicare)
      const seTaxable = taxableIncome * 0.9235
      const ssTax = Math.min(seTaxable, 168600) * 0.124
      const medicareTax = seTaxable * 0.029
      const additionalMedicare = Math.max(0, seTaxable - 200000) * 0.009
      const seTax = ssTax + medicareTax + additionalMedicare

      // Half of SE tax is deductible
      const seDeduction = seTax / 2
      const adjustedIncome = taxableIncome - seDeduction

      const stateRate = Number(stateData.incomeTaxRate || stateData.flatTaxRate || stateData.topIncomeTaxRate || 0) / 100
      const stateTax = stateData.hasIncomeTax === false ? 0 : adjustedIncome * stateRate
      const federalTax = adjustedIncome * 0.22 // Simplified
      const totalTax = seTax + stateTax + federalTax
      const netAfterTax = netIncome - expenses - totalTax

      const quarterly = String(input.quarterlyPayments) !== 'no'
      const quarterlyPayment = totalTax / 4

      return {
        primary: { value: Math.round(netAfterTax), label: 'Annual Net Income', unit: '$' },
        secondary: [
          { label: 'Self-Employment Tax', value: Math.round(seTax), unit: '$' },
          { label: 'State Income Tax', value: Math.round(stateTax), unit: '$' },
          { label: 'Federal Income Tax', value: Math.round(federalTax), unit: '$' },
          { label: 'Total Tax Burden', value: Math.round(totalTax), unit: '$' },
          { label: 'Effective Rate', value: (totalTax / netIncome * 100).toFixed(1), unit: '%' },
          ...(quarterly ? [{ label: 'Quarterly Payment', value: Math.round(quarterlyPayment), unit: '$' }] : []),
        ],
      }
    }

    default:
      return {
        primary: { value: Number(input.amount || 0), label: `${baseType} Result`, unit: '$' },
        advice: 'Calculator under development.',
      }
  }
}
