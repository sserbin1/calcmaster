// State education calculations — college cost, student loan, teacher salary, 529 savings
import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

const educationBaseTypes = [
  'college-cost', 'student-loan', 'teacher-salary', 'school-district',
  'in-state-tuition', 'education-savings',
]

export function getStateEducationFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  if (!educationBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'college-cost':
    case 'in-state-tuition':
      return [
        { name: 'tuitionType', label: 'Tuition Type', type: 'select', options: [
          { value: 'in-state', label: 'In-State Public' },
          { value: 'out-state', label: 'Out-of-State Public' },
          { value: 'private', label: 'Private' },
        ], default: 'in-state' },
        { name: 'years', label: 'Years of Study', type: 'select', options: [
          { value: '2', label: '2 Years (Associates)' },
          { value: '4', label: '4 Years (Bachelors)' },
          { value: '6', label: '6 Years (Masters)' },
        ], default: '4' },
        { name: 'includeRoomBoard', label: 'Include Room & Board', type: 'select', options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No (Commuter)' },
        ], default: 'yes' },
        { name: 'financialAid', label: 'Expected Financial Aid ($/yr)', type: 'number', default: 0, min: 0 },
      ]

    case 'student-loan':
      return [
        { name: 'loanAmount', label: 'Total Loan Amount ($)', type: 'number', default: 30000, min: 0 },
        { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', default: 5.5, step: 0.1 },
        { name: 'repaymentPlan', label: 'Repayment Plan', type: 'select', options: [
          { value: 'standard', label: 'Standard (10 years)' },
          { value: 'extended', label: 'Extended (25 years)' },
          { value: 'graduated', label: 'Graduated' },
          { value: 'income', label: 'Income-Driven' },
        ], default: 'standard' },
        { name: 'annualIncome', label: 'Annual Income (for IDR) ($)', type: 'number', default: 50000, min: 0 },
      ]

    case 'teacher-salary':
      return [
        { name: 'yearsExperience', label: 'Years of Experience', type: 'number', default: 5, min: 0, max: 40 },
        { name: 'degree', label: 'Highest Degree', type: 'select', options: [
          { value: 'bachelors', label: 'Bachelors' },
          { value: 'masters', label: 'Masters' },
          { value: 'doctorate', label: 'Doctorate' },
        ], default: 'bachelors' },
        { name: 'district', label: 'District Type', type: 'select', options: [
          { value: 'urban', label: 'Urban' },
          { value: 'suburban', label: 'Suburban' },
          { value: 'rural', label: 'Rural' },
        ], default: 'suburban' },
      ]

    case 'education-savings':
      return [
        { name: 'childAge', label: "Child's Current Age", type: 'number', default: 5, min: 0, max: 17 },
        { name: 'monthlyContribution', label: 'Monthly Contribution ($)', type: 'number', default: 200, min: 0 },
        { name: 'currentBalance', label: 'Current 529 Balance ($)', type: 'number', default: 5000, min: 0 },
        { name: 'expectedReturn', label: 'Expected Annual Return (%)', type: 'number', default: 7, step: 0.5 },
        { name: 'tuitionType', label: 'Target School Type', type: 'select', options: [
          { value: 'in-state', label: 'In-State Public' },
          { value: 'out-state', label: 'Out-of-State' },
          { value: 'private', label: 'Private' },
        ], default: 'in-state' },
      ]

    case 'school-district':
      return [
        { name: 'children', label: 'Number of Children', type: 'number', default: 2, min: 1, max: 10 },
        { name: 'propertyValue', label: 'Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 300000, min: 0 },
      ]

    default:
      return [
        { name: 'amount', label: 'Amount ($)', type: 'number', default: 10000, min: 0 },
      ]
  }
}

export function calculateStateEducation(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!educationBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'college-cost':
    case 'in-state-tuition': {
      const years = Number(input.years || 4)
      const tuitionType = String(input.tuitionType || 'in-state')
      const includeRB = String(input.includeRoomBoard) !== 'no'
      const aid = Number(input.financialAid || 0)

      const inStateTuition = Number(stateData.avgInStateTuition || 10000)
      const outStateTuition = Number(stateData.avgOutStateTuition || 25000)
      const roomAndBoard = Number(stateData.avgRoomAndBoard || 12000)

      const annualTuition = tuitionType === 'in-state' ? inStateTuition
        : tuitionType === 'out-state' ? outStateTuition : 40000
      const annualRB = includeRB ? roomAndBoard : 0
      const annualTotal = annualTuition + annualRB - aid

      // Account for ~3% annual tuition inflation
      let totalCost = 0
      for (let y = 0; y < years; y++) {
        totalCost += annualTotal * Math.pow(1.03, y)
      }

      return {
        primary: { value: Math.round(totalCost), label: `Total ${years}-Year Cost`, unit: '$' },
        secondary: [
          { label: 'Annual Tuition', value: Math.round(annualTuition), unit: '$' },
          ...(includeRB ? [{ label: 'Room & Board/Year', value: Math.round(roomAndBoard), unit: '$' }] : []),
          ...(aid > 0 ? [{ label: 'Annual Aid', value: Math.round(aid), unit: '$' }] : []),
          { label: 'Year 1 Cost', value: Math.round(annualTotal), unit: '$' },
          { label: `Year ${years} Cost (inflated)`, value: Math.round(annualTotal * Math.pow(1.03, years - 1)), unit: '$' },
        ],
      }
    }

    case 'student-loan': {
      const principal = Number(input.loanAmount || 30000)
      const annualRate = Number(input.interestRate || 5.5) / 100
      const monthlyRate = annualRate / 12
      const plan = String(input.repaymentPlan || 'standard')
      const income = Number(input.annualIncome || 50000)

      let months: number
      let monthlyPayment: number

      if (plan === 'income') {
        // IDR: 10% of discretionary income (income - 150% FPL)
        const fpl150 = 22590 // 150% of Federal Poverty Level for individual
        const discretionary = Math.max(0, income - fpl150)
        monthlyPayment = (discretionary * 0.10) / 12
        // Calculate how long to pay off
        if (monthlyPayment <= principal * monthlyRate) {
          months = 240 // 20-year forgiveness cap
        } else {
          months = Math.ceil(-Math.log(1 - (principal * monthlyRate / monthlyPayment)) / Math.log(1 + monthlyRate))
        }
      } else {
        months = plan === 'extended' ? 300 : 120
        monthlyPayment = monthlyRate > 0
          ? principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
          : principal / months
      }

      const totalPaid = monthlyPayment * months
      const totalInterest = totalPaid - principal

      return {
        primary: { value: Math.round(monthlyPayment), label: 'Monthly Payment', unit: '$/mo' },
        secondary: [
          { label: 'Total Repaid', value: Math.round(totalPaid), unit: '$' },
          { label: 'Total Interest', value: Math.round(totalInterest), unit: '$' },
          { label: 'Repayment Period', value: `${Math.round(months / 12)} years`, unit: '' },
          { label: 'Interest Rate', value: (annualRate * 100).toFixed(1), unit: '%' },
        ],
        advice: plan === 'income'
          ? `Income-driven repayment: $${Math.round(monthlyPayment)}/mo based on your income. Remaining balance forgiven after 20 years.`
          : `Standard repayment: $${Math.round(monthlyPayment)}/mo for ${Math.round(months / 12)} years.`,
      }
    }

    case 'teacher-salary': {
      const experience = Number(input.yearsExperience || 5)
      const degree = String(input.degree || 'bachelors')
      const district = String(input.district || 'suburban')

      const avgTeacherSalary = Number(stateData.avgTeacherSalary || 55000)

      // Experience factor: ~2% per year, capping around 30 years
      const expFactor = 1 + Math.min(experience, 30) * 0.02
      // Degree factor
      const degreeFactor = degree === 'doctorate' ? 1.2 : degree === 'masters' ? 1.1 : 1.0
      // District factor
      const districtFactor = district === 'urban' ? 1.08 : district === 'rural' ? 0.9 : 1.0

      const salary = avgTeacherSalary * expFactor * degreeFactor * districtFactor
      const nationalAvg = 65000

      return {
        primary: { value: Math.round(salary), label: 'Estimated Salary', unit: '$' },
        secondary: [
          { label: 'Monthly Gross', value: Math.round(salary / 12), unit: '$' },
          { label: 'State Average', value: Math.round(avgTeacherSalary), unit: '$' },
          { label: 'vs National Average', value: `${salary > nationalAvg ? '+' : ''}${Math.round((salary / nationalAvg - 1) * 100)}%`, unit: '' },
          { label: 'Experience Factor', value: `+${Math.round((expFactor - 1) * 100)}%`, unit: '' },
        ],
      }
    }

    case 'education-savings': {
      const childAge = Number(input.childAge || 5)
      const monthly = Number(input.monthlyContribution || 200)
      const current = Number(input.currentBalance || 5000)
      const annualReturn = Number(input.expectedReturn || 7) / 100
      const tuitionType = String(input.tuitionType || 'in-state')

      const yearsToCollege = Math.max(0, 18 - childAge)
      const monthlyReturn = annualReturn / 12

      // FV of current balance + FV of annuity
      const fvCurrent = current * Math.pow(1 + annualReturn, yearsToCollege)
      let fvContributions = 0
      if (monthlyReturn > 0) {
        fvContributions = monthly * ((Math.pow(1 + monthlyReturn, yearsToCollege * 12) - 1) / monthlyReturn)
      } else {
        fvContributions = monthly * yearsToCollege * 12
      }
      const totalProjected = fvCurrent + fvContributions
      const totalContributed = current + monthly * yearsToCollege * 12
      const earningsGrowth = totalProjected - totalContributed

      // Target cost (4 years, with 3% inflation)
      const inStateTuition = Number(stateData.avgInStateTuition || 10000)
      const baseCost = tuitionType === 'in-state' ? inStateTuition * 4
        : tuitionType === 'out-state' ? 25000 * 4 : 40000 * 4
      const targetCost = baseCost * Math.pow(1.03, yearsToCollege)

      const fundedPercent = targetCost > 0 ? (totalProjected / targetCost) * 100 : 0

      return {
        primary: { value: Math.round(totalProjected), label: 'Projected 529 Balance at 18', unit: '$' },
        secondary: [
          { label: 'Total Contributed', value: Math.round(totalContributed), unit: '$' },
          { label: 'Investment Growth', value: Math.round(earningsGrowth), unit: '$' },
          { label: 'Target College Cost', value: Math.round(targetCost), unit: '$' },
          { label: 'Funded', value: Math.min(100, fundedPercent).toFixed(0), unit: '%' },
          { label: 'Years to Save', value: yearsToCollege, unit: 'years' },
        ],
        advice: fundedPercent >= 100
          ? 'You are on track to fully fund college costs.'
          : `You may have a gap of ~$${Math.round(targetCost - totalProjected).toLocaleString()}. Consider increasing contributions.`,
      }
    }

    case 'school-district': {
      const children = Number(input.children || 2)
      const propertyValue = Number(input.propertyValue || 300000)
      const schoolRate = Number(stateData.avgSchoolTaxRate || 0.5) / 100
      const perPupilSpending = Number(stateData.perPupilSpending || 12000)

      const annualSchoolTax = propertyValue * schoolRate
      const totalBenefit = perPupilSpending * children

      return {
        primary: { value: Math.round(perPupilSpending), label: 'Per-Pupil Spending', unit: '$' },
        secondary: [
          { label: 'Your School Tax', value: Math.round(annualSchoolTax), unit: '$/yr' },
          { label: 'Education Value', value: Math.round(totalBenefit), unit: '$/yr' },
          { label: 'ROI', value: annualSchoolTax > 0 ? `${(totalBenefit / annualSchoolTax * 100).toFixed(0)}%` : 'N/A', unit: '' },
          { label: 'National Average', value: '13,600', unit: '$' },
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
