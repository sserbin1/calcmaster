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

// ═══════════════════════════════════════════════════════════════════
// NY EDUCATION — Custom calculation functions
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

/** #47 SUNY/CUNY Tuition — Excelsior Scholarship, TAP, Pell */
function calcNYSunyCuny(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const system = String(input.system || 'suny_4yr')
  const residency = String(input.residency || 'in_state')
  const householdIncome = Number(input.householdIncome || 90000)
  const livingArrangement = String(input.livingArrangement || 'on_campus')

  // 2024-2025 tuition rates
  const tuitionRates: Record<string, number> = {
    suny_4yr: 7070, suny_2yr: 5480, cuny_4yr: 6930, cuny_2yr: 4800,
  }
  const outOfStateMult = residency === 'out_state' ? 2.5 : 1.0
  const baseTuition = (tuitionRates[system] || 7070) * outOfStateMult

  // Fees
  const fees: Record<string, number> = {
    suny_4yr: 3200, suny_2yr: 1800, cuny_4yr: 850, cuny_2yr: 400,
  }
  const annualFees = fees[system] || 3200

  // Room & board
  const roomBoard: Record<string, Record<string, number>> = {
    on_campus: { suny_4yr: 15500, suny_2yr: 12000, cuny_4yr: 18000, cuny_2yr: 0 },
    off_campus: { suny_4yr: 12000, suny_2yr: 10000, cuny_4yr: 16000, cuny_2yr: 14000 },
    commuter: { suny_4yr: 5000, suny_2yr: 5000, cuny_4yr: 5000, cuny_2yr: 5000 },
  }
  const annualRoomBoard = roomBoard[livingArrangement]?.[system] || 15500

  const totalCOA = baseTuition + annualFees + annualRoomBoard + 1200 // + books/supplies

  // Excelsior Scholarship: household income ≤ $125K, in-state, full-time
  const excelsiorEligible = residency === 'in_state' && householdIncome <= 125000
  const excelsiorAmount = excelsiorEligible ? baseTuition : 0

  // TAP (Tuition Assistance Program): NY residents, income-based
  let tapAmount = 0
  if (residency === 'in_state') {
    if (householdIncome <= 10000) tapAmount = 5665
    else if (householdIncome <= 20000) tapAmount = 4500
    else if (householdIncome <= 40000) tapAmount = 3000
    else if (householdIncome <= 60000) tapAmount = 1500
    else if (householdIncome <= 80000) tapAmount = 500
  }
  // TAP cannot exceed tuition
  tapAmount = Math.min(tapAmount, baseTuition)

  // Pell Grant (federal): income-based
  let pellAmount = 0
  if (householdIncome <= 30000) pellAmount = 7395
  else if (householdIncome <= 45000) pellAmount = 5500
  else if (householdIncome <= 60000) pellAmount = 3500
  else if (householdIncome <= 70000) pellAmount = 1500

  // Total aid — Excelsior is "last dollar" (fills gap after TAP + Pell applied to tuition)
  const tuitionAid = Math.min(baseTuition, tapAmount + pellAmount)
  const excelsiorGap = excelsiorEligible ? Math.max(0, baseTuition - tuitionAid) : 0
  const totalAid = tuitionAid + excelsiorGap + (pellAmount > baseTuition ? pellAmount - baseTuition : 0)

  const netCost = Math.max(0, totalCOA - tapAmount - pellAmount - excelsiorGap)
  const fourYearCost = netCost * 4 * 1.03 // ~3% annual increase

  const systemNames: Record<string, string> = {
    suny_4yr: 'SUNY 4-Year', suny_2yr: 'SUNY Community College',
    cuny_4yr: 'CUNY Senior College', cuny_2yr: 'CUNY Community College',
  }

  return {
    primary: { value: Math.round(netCost), label: 'Annual Net Cost', unit: '$/yr' },
    secondary: [
      { label: 'Sticker Price (COA)', value: fmt(Math.round(totalCOA)), unit: '' },
      { label: 'Tuition', value: fmt(Math.round(baseTuition)), unit: '' },
      { label: 'Excelsior', value: excelsiorEligible ? `-${fmt(excelsiorGap)}` : 'Ineligible', unit: '' },
      { label: 'TAP Award', value: tapAmount > 0 ? `-${fmt(tapAmount)}` : 'N/A', unit: '' },
      { label: 'Pell Grant', value: pellAmount > 0 ? `-${fmt(pellAmount)}` : 'N/A', unit: '' },
      { label: '4-Year Total', value: fmt(Math.round(fourYearCost)), unit: '' },
    ],
    breakdown: [
      { label: 'Tuition', value: Math.round(baseTuition), color: '#1E3A8A' },
      { label: 'Fees', value: annualFees, color: '#059669' },
      { label: 'Room & Board', value: Math.round(annualRoomBoard), color: '#CA8A04' },
      { label: 'Books/Supplies', value: 1200, color: '#DC2626' },
    ],
    chartData: [
      { name: 'SUNY 4yr', value: tuitionRates.suny_4yr },
      { name: 'SUNY 2yr', value: tuitionRates.suny_2yr },
      { name: 'CUNY 4yr', value: tuitionRates.cuny_4yr },
      { name: 'CUNY 2yr', value: tuitionRates.cuny_2yr },
    ],
    schedule: {
      headers: ['Aid Program', 'Amount', 'Eligibility', 'Status'],
      rows: [
        ['Excelsior Scholarship', excelsiorEligible ? fmt(excelsiorGap) : '$0', '≤$125K income, in-state', excelsiorEligible ? 'Eligible' : 'Not eligible'],
        ['TAP (NY)', fmt(tapAmount), 'NY residents, income-based', tapAmount > 0 ? 'Eligible' : 'Over income limit'],
        ['Pell Grant (Federal)', fmt(pellAmount), 'Federal, income-based', pellAmount > 0 ? 'Eligible' : 'Over income limit'],
        ['Total Tuition Aid', fmt(Math.round(tapAmount + pellAmount + excelsiorGap)), '—', '—'],
      ],
    },
    advice: excelsiorEligible
      ? `At ${fmt(householdIncome)} household income, you qualify for Excelsior Scholarship — making ${systemNames[system]} tuition effectively FREE. Room and board (${fmt(Math.round(annualRoomBoard))}/yr) is your main cost. ${system.includes('cuny') ? 'CUNY students: consider commuting to save further.' : 'Consider off-campus housing to save vs dorms.'}`
      : residency === 'out_state'
        ? `Out-of-state tuition is ${fmt(Math.round(baseTuition))} — 2.5x the in-state rate. After one year of NY residency, you can apply for in-state rates and Excelsior/TAP eligibility.`
        : `Your income of ${fmt(householdIncome)} exceeds the $125K Excelsior threshold. ${tapAmount > 0 ? `You still qualify for ${fmt(tapAmount)} in TAP.` : 'Consider community college for 2 years then transfer to save ~$10K.'} ${pellAmount > 0 ? `Plus ${fmt(pellAmount)} Pell Grant.` : ''}`,
  }
}

/** #36 Private School NYC — K-12 tuition */
function calcNYPrivateSchool(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const gradeLevel = String(input.gradeLevel || 'elementary')
  const schoolTier = String(input.schoolTier || 'mid')
  const children = Number(input.children || 1)
  const yearsRemaining = Number(input.yearsRemaining || 8)

  // NYC private school tuition (2024 — NYC has most expensive private schools in US)
  const tuition: Record<string, Record<string, number>> = {
    budget: { pre_k: 18000, elementary: 25000, middle: 30000, high: 35000 },
    mid: { pre_k: 28000, elementary: 40000, middle: 48000, high: 55000 },
    elite: { pre_k: 38000, elementary: 55000, middle: 58000, high: 62000 },
  }

  const baseTuition = tuition[schoolTier]?.[gradeLevel] || 40000
  const annualPerChild = baseTuition

  // Additional costs
  const booksMaterials = 1500
  const uniformExtra = schoolTier === 'elite' ? 800 : 400
  const extracurriculars = gradeLevel === 'high' ? 3000 : 1500
  const transportation = 2000 // school bus or MetroCard
  const annualExtras = booksMaterials + uniformExtra + extracurriculars + transportation

  const annualTotal = (annualPerChild + annualExtras) * children
  const monthlyTotal = annualTotal / 10 // 10-month payment plan typical

  // Sibling discount (many schools offer 10-15% for second child)
  const siblingDiscount = children > 1 ? annualPerChild * 0.10 * (children - 1) : 0
  const netAnnual = annualTotal - siblingDiscount

  // Total through graduation
  let totalThroughGrad = 0
  for (let y = 0; y < yearsRemaining; y++) {
    totalThroughGrad += netAnnual * Math.pow(1.04, y) // 4% annual tuition inflation
  }

  // Public school comparison
  const publicSchoolCost = 0 // free
  const savingsVsPrivate = netAnnual

  const tierNames: Record<string, string> = { budget: 'Budget', mid: 'Mid-Range', elite: 'Elite (Top-Tier)' }
  const gradeNames: Record<string, string> = { pre_k: 'Pre-K', elementary: 'Elementary', middle: 'Middle School', high: 'High School' }

  return {
    primary: { value: Math.round(netAnnual), label: 'Annual Cost', unit: '$/yr' },
    secondary: [
      { label: 'Monthly (10-mo plan)', value: fmt(netAnnual / 10), unit: '' },
      { label: 'Per Child Tuition', value: fmt(annualPerChild), unit: '/yr' },
      { label: 'Extras (per child)', value: fmt(annualExtras), unit: '/yr' },
      { label: 'Tier', value: tierNames[schoolTier] || schoolTier, unit: '' },
      { label: 'Level', value: gradeNames[gradeLevel] || gradeLevel, unit: '' },
      ...(siblingDiscount > 0 ? [{ label: 'Sibling Discount', value: fmt(-siblingDiscount), unit: '/yr' }] : []),
      { label: 'Through Graduation', value: fmt(totalThroughGrad), unit: '' },
    ],
    breakdown: [
      { label: 'Tuition', value: Math.round(annualPerChild * children), color: '#1E3A8A' },
      { label: 'Books & Materials', value: booksMaterials * children, color: '#CA8A04' },
      { label: 'Extracurriculars', value: extracurriculars * children, color: '#059669' },
      { label: 'Transportation', value: transportation * children, color: '#7C3AED' },
      { label: 'Uniforms', value: uniformExtra * children, color: '#DC2626' },
    ],
    chartData: [
      { name: 'Budget', value: Math.round((tuition.budget[gradeLevel] || 25000) + annualExtras) },
      { name: 'Mid-Range', value: Math.round((tuition.mid[gradeLevel] || 40000) + annualExtras) },
      { name: 'Elite', value: Math.round((tuition.elite[gradeLevel] || 55000) + annualExtras) },
    ],
    schedule: {
      headers: ['Grade Level', 'Budget', 'Mid-Range', 'Elite'],
      rows: ['pre_k', 'elementary', 'middle', 'high'].map(g => [
        gradeNames[g] || g,
        fmt(tuition.budget[g] || 0),
        fmt(tuition.mid[g] || 0),
        fmt(tuition.elite[g] || 0),
      ]),
    },
    advice: schoolTier === 'elite'
      ? `Elite NYC private schools (Dalton, Trinity, Horace Mann) run ${fmt(annualPerChild)}/year — comparable to Ivy League tuition. Over ${yearsRemaining} years with 4% inflation, total cost reaches ${fmt(totalThroughGrad)}.`
      : `${tierNames[schoolTier]} private schools cost ${fmt(annualPerChild)}/year for ${gradeNames[gradeLevel]}. NYC public schools spend ~$28K per pupil — consider that many public schools offer excellent education, especially screened programs.`,
  }
}

export function calculateStateEducation(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!educationBaseTypes.includes(baseType)) return null

  // Custom calculation handlers (NY education)
  const customCalc = stateData.customCalc as string | undefined
  switch (customCalc) {
    case 'ny-private-school': return calcNYPrivateSchool(input, stateData)
    case 'ny-suny-cuny': return calcNYSunyCuny(input, stateData)
  }

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
