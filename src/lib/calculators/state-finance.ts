// State finance calculations — income tax, property tax, sales tax, capital gains, estate tax
// Custom handlers for NY-specific calculators + generic fallbacks for other states

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calcBracketTax(taxableIncome: number, brackets: { min: number; max: number | null; rate: number }[]): { total: number; perBracket: { bracket: string; rate: number; taxableInBracket: number; tax: number }[] } {
  let total = 0
  const perBracket: { bracket: string; rate: number; taxableInBracket: number; tax: number }[] = []
  for (const b of brackets) {
    const upper = b.max ?? Infinity
    if (taxableIncome > b.min) {
      const taxableInBracket = Math.min(taxableIncome, upper) - b.min
      const tax = taxableInBracket * (b.rate / 100)
      total += tax
      perBracket.push({
        bracket: b.max ? `$${b.min.toLocaleString()} – $${b.max.toLocaleString()}` : `$${b.min.toLocaleString()}+`,
        rate: b.rate,
        taxableInBracket: Math.round(taxableInBracket),
        tax: Math.round(tax * 100) / 100,
      })
    }
  }
  return { total, perBracket }
}

function fmt(n: number): string { return n.toLocaleString() }
function fmtD(n: number): string { return '$' + n.toLocaleString() }

// ============================================================================
// CUSTOM CALCULATION: NYC Triple Tax (#1 income-tax-new-york)
// ============================================================================

function calculateNYCTripleTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const grossIncome = Number(input.annualIncome || 150000)
  const filingStatus = String(input.filingStatus || 'single')
  const isNYCResident = String(input.nycResident || 'yes') === 'yes'
  const deductionType = String(input.deductions || 'standard')
  const itemizedAmount = Number(input.itemizedAmount || 0)

  const fedStdKey = filingStatus === 'married' ? 'federalStandardDeductionMarried' : filingStatus === 'head' ? 'federalStandardDeductionHead' : 'federalStandardDeductionSingle'
  const fedStdDeduction = Number(stateData[fedStdKey] || 14600)
  const fedDeduction = deductionType === 'itemized' && itemizedAmount > fedStdDeduction ? itemizedAmount : fedStdDeduction
  const fedTaxableIncome = Math.max(0, grossIncome - fedDeduction)
  const fedBrackets = (stateData.federalBrackets || []) as unknown as { min: number; max: number | null; rate: number }[]
  const fedResult = calcBracketTax(fedTaxableIncome, fedBrackets)

  const nysStdKey = filingStatus === 'married' ? 'standardDeductionMarried' : filingStatus === 'head' ? 'standardDeductionHead' : 'standardDeductionSingle'
  const nysStdDeduction = Number(stateData[nysStdKey] || 8000)
  const nysDeduction = deductionType === 'itemized' && itemizedAmount > nysStdDeduction ? itemizedAmount : nysStdDeduction
  const nysTaxableIncome = Math.max(0, grossIncome - nysDeduction)
  const nysBrackets = (stateData.taxBrackets || []) as unknown as { min: number; max: number | null; rate: number }[]
  const nysResult = calcBracketTax(nysTaxableIncome, nysBrackets)

  const nycBrackets = (stateData.nycTaxBrackets || []) as unknown as { min: number; max: number | null; rate: number }[]
  const nycResult = isNYCResident ? calcBracketTax(nysTaxableIncome, nycBrackets) : { total: 0, perBracket: [] }

  const ssMax = 168600
  const ssTax = Math.min(grossIncome, ssMax) * 0.062
  const medicareTax = grossIncome * 0.0145
  const additionalMedicare = grossIncome > 200000 ? (grossIncome - 200000) * 0.009 : 0
  const ficaTotal = ssTax + medicareTax + additionalMedicare

  const totalFed = Math.round(fedResult.total)
  const totalNYS = Math.round(nysResult.total)
  const totalNYC = Math.round(nycResult.total)
  const totalFICA = Math.round(ficaTotal)
  const totalTax = totalFed + totalNYS + totalNYC + totalFICA
  const takeHomePay = grossIncome - totalTax
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0
  const marginalRate = (fedBrackets.length > 0 ? fedResult.perBracket[fedResult.perBracket.length - 1]?.rate || 0 : 0) +
    (nysResult.perBracket.length > 0 ? nysResult.perBracket[nysResult.perBracket.length - 1]?.rate || 0 : 0) +
    (isNYCResident && nycResult.perBracket.length > 0 ? nycResult.perBracket[nycResult.perBracket.length - 1]?.rate || 0 : 0)

  const scheduleHeaders = ['Tax Level', 'Bracket', 'Rate', 'Taxable Income', 'Tax']
  const scheduleRows: (string | number)[][] = []
  for (const b of fedResult.perBracket) {
    scheduleRows.push(['Federal', b.bracket, `${b.rate}%`, fmtD(b.taxableInBracket), fmtD(b.tax)])
  }
  scheduleRows.push(['Federal Total', '', '', '', fmtD(totalFed)])
  for (const b of nysResult.perBracket) {
    scheduleRows.push(['NYS', b.bracket, `${b.rate}%`, fmtD(b.taxableInBracket), fmtD(b.tax)])
  }
  scheduleRows.push(['NYS Total', '', '', '', fmtD(totalNYS)])
  if (isNYCResident) {
    for (const b of nycResult.perBracket) {
      scheduleRows.push(['NYC', b.bracket, `${b.rate}%`, fmtD(b.taxableInBracket), fmtD(b.tax)])
    }
    scheduleRows.push(['NYC Total', '', '', '', fmtD(totalNYC)])
  }
  scheduleRows.push(['FICA (SS + Medicare)', '', '7.65%', fmtD(grossIncome), fmtD(totalFICA)])

  const breakdown = [
    { label: 'Federal Income Tax', value: fmtD(totalFed), color: '#1E3A8A' },
    { label: 'NYS Income Tax', value: fmtD(totalNYS), color: '#059669' },
    ...(isNYCResident ? [{ label: 'NYC Income Tax', value: fmtD(totalNYC), color: '#CA8A04' }] : []),
    { label: 'FICA (SS + Medicare)', value: fmtD(totalFICA), color: '#DC2626' },
    { label: 'Take-Home Pay', value: fmtD(takeHomePay), color: '#10B981' },
  ]

  const chartData = [
    { name: 'Federal', value: totalFed, color: '#1E3A8A' },
    { name: 'NYS', value: totalNYS, color: '#059669' },
    ...(isNYCResident ? [{ name: 'NYC', value: totalNYC, color: '#CA8A04' }] : []),
    { name: 'FICA', value: totalFICA, color: '#DC2626' },
    { name: 'Take-Home', value: takeHomePay, color: '#10B981' },
  ]

  const saltCap = Number(stateData.saltCap || 10000)
  const totalSALT = totalNYS + totalNYC
  const saltWarning = totalSALT > saltCap
    ? ` Note: Your state & local taxes (${fmtD(totalSALT)}) exceed the ${fmtD(saltCap)} SALT deduction cap — you can only deduct ${fmtD(saltCap)} on your federal return.`
    : ''

  return {
    primary: { value: totalTax, label: 'Total Tax Liability', unit: '$' },
    secondary: [
      { label: 'Take-Home Pay', value: fmt(takeHomePay), unit: '$' },
      { label: 'Monthly Take-Home', value: fmt(Math.round(takeHomePay / 12)), unit: '$' },
      { label: 'Effective Rate', value: effectiveRate.toFixed(1), unit: '%' },
      { label: 'Federal Tax', value: fmt(totalFed), unit: '$' },
      { label: 'NYS Tax', value: fmt(totalNYS), unit: '$' },
      ...(isNYCResident ? [{ label: 'NYC Tax', value: fmt(totalNYC), unit: '$' }] : []),
      { label: 'FICA', value: fmt(totalFICA), unit: '$' },
      { label: 'Marginal Rate', value: marginalRate.toFixed(1), unit: '%' },
    ],
    breakdown,
    chartData,
    schedule: { headers: scheduleHeaders, rows: scheduleRows },
    advice: `On ${fmtD(grossIncome)} gross income, your combined effective tax rate is ${effectiveRate.toFixed(1)}% — you pay ${fmtD(totalTax)} in total taxes and take home ${fmtD(takeHomePay)} (${fmtD(Math.round(takeHomePay / 12))}/month). Your top marginal rate across all levels is ${marginalRate.toFixed(1)}%.${saltWarning}`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: NY Property Tax (#2 property-tax-new-york)
// ============================================================================

function calculateNYPropertyTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const homeValue = Number(input.homeValue || 500000)
  const borough = String(input.borough || 'manhattan')
  const propertyClass = String(input.propertyClass || 'class1')
  const starProgram = String(input.starProgram || 'none')

  // NYC assessment ratios by class
  const assessmentRatio = propertyClass === 'class1' ? Number(stateData.nycClass1AssessmentRatio || 6) / 100
    : Number(stateData.nycClass2AssessmentRatio || 45) / 100

  // Borough mill rates (per $100 assessed) — approximations
  const boroughRates: Record<string, number> = {
    manhattan: 10.69, brooklyn: 10.69, queens: 10.69, bronx: 10.69, staten_island: 10.69,
    nassau: 19.68, westchester: 17.25, suffolk: 18.89, upstate: 22.50,
  }
  const millRate = boroughRates[borough] || 10.69

  const assessedValue = homeValue * assessmentRatio
  const rawTax = (assessedValue / 100) * millRate

  // STAR savings
  const starSavings = starProgram === 'basic' ? Number(stateData.starBasicSavings || 1245)
    : starProgram === 'enhanced' ? Number(stateData.starEnhancedSavings || 1780)
    : 0

  const annualTax = Math.max(0, rawTax - starSavings)
  const monthlyTax = annualTax / 12
  const effectiveRate = homeValue > 0 ? (annualTax / homeValue) * 100 : 0

  return {
    primary: { value: Math.round(annualTax), label: 'Annual Property Tax', unit: '$' },
    secondary: [
      { label: 'Monthly Tax', value: fmt(Math.round(monthlyTax)), unit: '$' },
      { label: 'Effective Rate', value: effectiveRate.toFixed(2), unit: '%' },
      { label: 'Assessed Value', value: fmt(Math.round(assessedValue)), unit: '$' },
      { label: 'Mill Rate', value: millRate.toFixed(2), unit: 'per $100' },
      { label: 'STAR Savings', value: fmt(starSavings), unit: '$' },
      { label: 'Daily Tax', value: (annualTax / 365).toFixed(2), unit: '$' },
    ],
    breakdown: [
      { label: 'Property Tax (before STAR)', value: fmtD(Math.round(rawTax)), color: '#1E3A8A' },
      { label: 'STAR Exemption', value: `-${fmtD(starSavings)}`, color: '#10B981' },
      { label: 'Net Annual Tax', value: fmtD(Math.round(annualTax)), color: '#CA8A04' },
    ],
    chartData: [
      { name: 'Manhattan', value: Math.round((homeValue * assessmentRatio / 100) * 10.69), color: '#1E3A8A' },
      { name: 'Nassau', value: Math.round((homeValue * assessmentRatio / 100) * 19.68), color: '#059669' },
      { name: 'Westchester', value: Math.round((homeValue * assessmentRatio / 100) * 17.25), color: '#CA8A04' },
      { name: 'Suffolk', value: Math.round((homeValue * assessmentRatio / 100) * 18.89), color: '#DC2626' },
      { name: 'Upstate', value: Math.round((homeValue * assessmentRatio / 100) * 22.50), color: '#7C3AED' },
    ],
    schedule: {
      headers: ['Location', 'Mill Rate', 'Assessed Value', 'Annual Tax', 'Monthly'],
      rows: Object.entries(boroughRates).map(([loc, rate]) => {
        const tax = Math.round((homeValue * assessmentRatio / 100) * rate)
        return [loc.charAt(0).toUpperCase() + loc.slice(1).replace('_', ' '), `${rate}`, fmtD(Math.round(assessedValue)), fmtD(tax), fmtD(Math.round(tax / 12))]
      }),
    },
    advice: `On a ${fmtD(homeValue)} home in ${borough.charAt(0).toUpperCase() + borough.slice(1).replace('_', ' ')}, your effective property tax rate is ${effectiveRate.toFixed(2)}%. The assessed value is only ${fmtD(Math.round(assessedValue))} (${(assessmentRatio * 100).toFixed(0)}% assessment ratio for ${propertyClass === 'class1' ? '1-3 family homes' : 'co-ops/condos'}). ${starSavings > 0 ? `You save ${fmtD(starSavings)}/year with ${starProgram === 'enhanced' ? 'Enhanced' : 'Basic'} STAR.` : 'Apply for STAR to save up to $1,780/year.'}`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: NY Sales Tax (#3 sales-tax-new-york)
// ============================================================================

function calculateNYSalesTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const purchaseAmount = Number(input.purchaseAmount || 500)
  const itemType = String(input.itemType || 'general')
  const location = String(input.location || 'nyc')

  const stateRate = Number(stateData.salesTaxRate || 4)
  const clothingThreshold = Number(stateData.clothingExemptionThreshold || 110)

  // Location-based local rates
  const localRates: Record<string, number> = {
    nyc: 4.5, westchester: 3.375, nassau: 4.25, suffolk: 4.25,
    albany: 4, buffalo: 4, syracuse: 4, yonkers: 1.5,
  }
  const localRate = localRates[location] || 4
  const mctd = location === 'nyc' || location === 'westchester' || location === 'nassau' || location === 'suffolk'
    ? Number(stateData.mctdSurcharge || 0.375) : 0

  // Item-type exemptions
  let isExempt = false
  let exemptReason = ''
  if (itemType === 'clothing' && purchaseAmount < clothingThreshold) {
    isExempt = true
    exemptReason = `Clothing under $${clothingThreshold} is tax-exempt in NY`
  } else if (itemType === 'groceries') {
    isExempt = true
    exemptReason = 'Unprepared food/groceries are tax-exempt in NY'
  } else if (itemType === 'prescription') {
    isExempt = true
    exemptReason = 'Prescription drugs are tax-exempt in NY'
  }

  const totalRate = isExempt ? 0 : stateRate + localRate + mctd
  const taxAmount = purchaseAmount * (totalRate / 100)
  const totalWithTax = purchaseAmount + taxAmount

  // Compare across locations
  const locationComparison = Object.entries(localRates).map(([loc, lr]) => {
    const total = stateRate + lr + (loc === 'nyc' || loc === 'westchester' || loc === 'nassau' || loc === 'suffolk' ? 0.375 : 0)
    return { name: loc.toUpperCase(), value: Math.round(purchaseAmount * total) / 100, color: loc === location ? '#CA8A04' : '#1E3A8A' }
  })

  return {
    primary: { value: isExempt ? 0 : Math.round(taxAmount * 100) / 100, label: 'Sales Tax', unit: '$' },
    secondary: [
      { label: 'Total with Tax', value: totalWithTax.toFixed(2), unit: '$' },
      { label: 'Combined Rate', value: totalRate.toFixed(3), unit: '%' },
      { label: 'State Rate', value: stateRate.toFixed(2), unit: '%' },
      { label: 'Local Rate', value: localRate.toFixed(2), unit: '%' },
      { label: 'MCTD Surcharge', value: mctd.toFixed(3), unit: '%' },
      ...(isExempt ? [{ label: 'Exemption', value: exemptReason, unit: '' }] : []),
    ],
    breakdown: [
      { label: 'Item Price', value: fmtD(purchaseAmount), color: '#10B981' },
      { label: `State Tax (${stateRate}%)`, value: isExempt ? '$0' : `$${(purchaseAmount * stateRate / 100).toFixed(2)}`, color: '#1E3A8A' },
      { label: `Local Tax (${localRate}%)`, value: isExempt ? '$0' : `$${(purchaseAmount * localRate / 100).toFixed(2)}`, color: '#059669' },
      { label: `MCTD (${mctd}%)`, value: isExempt ? '$0' : `$${(purchaseAmount * mctd / 100).toFixed(2)}`, color: '#CA8A04' },
    ],
    chartData: locationComparison,
    advice: isExempt
      ? `${exemptReason}. Your ${fmtD(purchaseAmount)} purchase has zero sales tax.`
      : `In ${location.toUpperCase()}, the combined sales tax rate is ${totalRate.toFixed(3)}%. On a ${fmtD(purchaseAmount)} purchase, you pay ${fmtD(Math.round(taxAmount * 100) / 100)} in tax. NYC has the highest combined rate at ${(stateRate + 4.5 + 0.375).toFixed(3)}% — shopping in NJ or online may save on certain items.`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: Wall Street Bonus Tax (#4 wall-street-bonus-tax-new-york)
// ============================================================================

function calculateWallStreetBonusTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const baseSalary = Number(input.baseSalary || 200000)
  const bonusAmount = Number(input.bonusAmount || 300000)
  const compensationType = String(input.compensationType || 'cash')
  const isNYCResident = String(input.nycResident || 'yes') === 'yes'

  const totalComp = baseSalary + bonusAmount

  // Federal supplemental rate (flat 22% up to $1M, 37% above)
  const fedBonusTax = bonusAmount <= 1000000
    ? bonusAmount * 0.22
    : 1000000 * 0.22 + (bonusAmount - 1000000) * 0.37

  // NYS rate on bonus (at top marginal rate for high earners)
  const nysRate = Number(stateData.topIncomeTaxRate || 10.9)
  const nysBonusTax = bonusAmount * (nysRate / 100)

  // NYC rate
  const nycRate = Number(stateData.nycTopRate || 3.876)
  const nycBonusTax = isNYCResident ? bonusAmount * (nycRate / 100) : 0

  // FICA on bonus
  const ssMax = 168600
  const ssRemaining = Math.max(0, ssMax - baseSalary)
  const ssTax = Math.min(bonusAmount, ssRemaining) * 0.062
  const medicareTax = bonusAmount * 0.0145
  const additionalMedicare = (baseSalary + bonusAmount) > 200000
    ? Math.min(bonusAmount, baseSalary + bonusAmount - 200000) * 0.009 : 0
  const ficaOnBonus = ssTax + medicareTax + additionalMedicare

  // NIIT on investment income (RSU/equity grants)
  const niitRate = Number(stateData.niitRate || 3.8)
  const niitTax = compensationType === 'rsu' && totalComp > 200000
    ? bonusAmount * (niitRate / 100) : 0

  const totalTax = Math.round(fedBonusTax + nysBonusTax + nycBonusTax + ficaOnBonus + niitTax)
  const netBonus = bonusAmount - totalTax
  const effectiveRate = bonusAmount > 0 ? (totalTax / bonusAmount) * 100 : 0

  return {
    primary: { value: totalTax, label: 'Total Tax on Bonus', unit: '$' },
    secondary: [
      { label: 'Net Bonus', value: fmt(Math.round(netBonus)), unit: '$' },
      { label: 'Effective Rate', value: effectiveRate.toFixed(1), unit: '%' },
      { label: 'Federal Tax', value: fmt(Math.round(fedBonusTax)), unit: '$' },
      { label: 'NYS Tax', value: fmt(Math.round(nysBonusTax)), unit: '$' },
      ...(isNYCResident ? [{ label: 'NYC Tax', value: fmt(Math.round(nycBonusTax)), unit: '$' }] : []),
      { label: 'FICA', value: fmt(Math.round(ficaOnBonus)), unit: '$' },
      ...(niitTax > 0 ? [{ label: 'NIIT (3.8%)', value: fmt(Math.round(niitTax)), unit: '$' }] : []),
    ],
    breakdown: [
      { label: 'Federal Tax', value: fmtD(Math.round(fedBonusTax)), color: '#1E3A8A' },
      { label: 'NYS Tax', value: fmtD(Math.round(nysBonusTax)), color: '#059669' },
      ...(isNYCResident ? [{ label: 'NYC Tax', value: fmtD(Math.round(nycBonusTax)), color: '#CA8A04' }] : []),
      { label: 'FICA', value: fmtD(Math.round(ficaOnBonus)), color: '#DC2626' },
      ...(niitTax > 0 ? [{ label: 'NIIT', value: fmtD(Math.round(niitTax)), color: '#7C3AED' }] : []),
      { label: 'Net Bonus', value: fmtD(Math.round(netBonus)), color: '#10B981' },
    ],
    chartData: [
      { name: 'Federal', value: Math.round(fedBonusTax), color: '#1E3A8A' },
      { name: 'NYS', value: Math.round(nysBonusTax), color: '#059669' },
      ...(isNYCResident ? [{ name: 'NYC', value: Math.round(nycBonusTax), color: '#CA8A04' }] : []),
      { name: 'FICA', value: Math.round(ficaOnBonus), color: '#DC2626' },
      { name: 'Net Bonus', value: Math.round(netBonus), color: '#10B981' },
    ],
    advice: `Your ${fmtD(bonusAmount)} ${compensationType === 'rsu' ? 'RSU vest' : 'cash bonus'} is taxed at an effective ${effectiveRate.toFixed(1)}% in NYC — you take home ${fmtD(Math.round(netBonus))}. ${bonusAmount > 1000000 ? 'The portion above $1M is taxed at 37% federal.' : 'Federal supplemental withholding is flat 22%.'} ${isNYCResident ? `NYC residents pay an additional ${nycRate}% city tax.` : 'Non-NYC residents avoid the city tax.'} ${niitTax > 0 ? 'As equity compensation, the 3.8% Net Investment Income Tax also applies.' : ''}`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: NY Estate Tax (#5 estate-tax-new-york)
// ============================================================================

function calculateNYEstateTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const estateValue = Number(input.estateValue || 7000000)
  const filingStatus = String(input.filingStatus || 'single')
  const hasSpouse = String(input.hasSpouse || 'no') === 'yes'

  const exemption = Number(stateData.estateTaxExemption || 6940000)
  const cliffThreshold = Number(stateData.cliffThreshold || 105)
  const topRate = Number(stateData.topEstateTaxRate || 16)
  const bottomRate = Number(stateData.bottomEstateTaxRate || 3.06)

  // Marital deduction — unlimited for spouse
  const taxableEstate = hasSpouse ? 0 : estateValue

  // NY cliff rule: if estate > 105% of exemption, ENTIRE estate is taxed (no exemption)
  const cliffAmount = exemption * (cliffThreshold / 100)
  const isAboveCliff = taxableEstate > cliffAmount
  const isAboveExemption = taxableEstate > exemption

  let estateTax = 0
  if (isAboveCliff) {
    // Entire estate taxed — progressive rates on full amount
    estateTax = taxableEstate * (topRate / 100) * 0.65 // blended approximation
  } else if (isAboveExemption) {
    // Only amount above exemption taxed, but cliff phases in
    const excess = taxableEstate - exemption
    const phaseInRate = bottomRate + (topRate - bottomRate) * (excess / (cliffAmount - exemption))
    estateTax = taxableEstate * (phaseInRate / 100)
  }

  const federalExemption = 13610000
  const federalTax = Math.max(0, (taxableEstate - federalExemption) * 0.40)
  const totalTax = Math.round(estateTax) + Math.round(federalTax)
  const netToHeirs = estateValue - totalTax
  const effectiveRate = estateValue > 0 ? (totalTax / estateValue) * 100 : 0

  // Comparison at different estate values
  const scenarios = [5000000, 7000000, 8000000, 10000000, 15000000]

  return {
    primary: { value: Math.round(estateTax), label: 'NY Estate Tax', unit: '$' },
    secondary: [
      { label: 'Federal Estate Tax', value: fmt(Math.round(federalTax)), unit: '$' },
      { label: 'Total Estate Tax', value: fmt(totalTax), unit: '$' },
      { label: 'Net to Heirs', value: fmt(Math.round(netToHeirs)), unit: '$' },
      { label: 'Effective Rate', value: effectiveRate.toFixed(1), unit: '%' },
      { label: 'NY Exemption', value: fmt(exemption), unit: '$' },
      { label: 'Cliff Status', value: isAboveCliff ? 'Above 105% — full tax' : isAboveExemption ? 'Phase-in zone' : 'Below exemption', unit: '' },
    ],
    breakdown: [
      { label: 'NY Estate Tax', value: fmtD(Math.round(estateTax)), color: '#1E3A8A' },
      { label: 'Federal Estate Tax', value: fmtD(Math.round(federalTax)), color: '#DC2626' },
      { label: 'Net to Heirs', value: fmtD(Math.round(netToHeirs)), color: '#10B981' },
    ],
    chartData: scenarios.map(v => ({
      name: `$${(v / 1000000).toFixed(0)}M`,
      value: v > cliffAmount ? Math.round(v * topRate / 100 * 0.65) : v > exemption ? Math.round((v - exemption) * bottomRate / 100) : 0,
      color: v === estateValue ? '#CA8A04' : '#1E3A8A',
    })),
    schedule: {
      headers: ['Estate Value', 'NY Tax', 'Federal Tax', 'Total Tax', 'Net to Heirs'],
      rows: scenarios.map(v => {
        const nyT = v > cliffAmount ? Math.round(v * topRate / 100 * 0.65) : v > exemption ? Math.round((v - exemption) * bottomRate / 100) : 0
        const fedT = Math.max(0, Math.round((v - federalExemption) * 0.40))
        return [fmtD(v), fmtD(nyT), fmtD(fedT), fmtD(nyT + fedT), fmtD(v - nyT - fedT)]
      }),
    },
    advice: isAboveCliff
      ? `Warning: Your ${fmtD(estateValue)} estate exceeds 105% of the NY exemption (${fmtD(cliffAmount)}). Under NY's cliff rule, you lose the ENTIRE exemption and the full estate is taxed. This costs ${fmtD(Math.round(estateTax))} in NY estate tax alone. Consider gifting strategies to bring the estate below ${fmtD(exemption)}.`
      : isAboveExemption
      ? `Your estate is in the phase-in zone between ${fmtD(exemption)} and ${fmtD(cliffAmount)}. You owe ${fmtD(Math.round(estateTax))} in NY estate tax. Reducing by ${fmtD(taxableEstate - exemption)} would eliminate NY estate tax entirely.`
      : hasSpouse
      ? 'The unlimited marital deduction eliminates estate tax when passing to a spouse. Plan for the second death.'
      : `Your ${fmtD(estateValue)} estate is below the NY exemption of ${fmtD(exemption)}. No NY estate tax is owed.`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: NYC vs Yonkers Tax (#6 nyc-vs-yonkers-tax-new-york)
// ============================================================================

function calculateNYCvsYonkersTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const annualIncome = Number(input.annualIncome || 120000)
  const filingStatus = String(input.filingStatus || 'single')
  const currentLocation = String(input.currentLocation || 'nyc')

  const nysRate = Number(stateData.topIncomeTaxRate || 10.9)
  const nycRate = Number(stateData.nycTopRate || 3.876)
  const yonkersResSurcharge = Number(stateData.yonkersResidentSurcharge || 16.75)
  const yonkersNonResRate = Number(stateData.yonkersNonResidentRate || 0.5)

  // NYS tax (same for all)
  const nysTax = annualIncome * (nysRate / 100) * 0.6 // approximation with deductions

  // NYC resident tax
  const nycTax = annualIncome * (nycRate / 100)

  // Yonkers resident: NYS tax + surcharge on NYS tax
  const yonkersResTax = nysTax * (yonkersResSurcharge / 100)

  // Yonkers non-resident: flat rate
  const yonkersNonResTax = annualIncome * (yonkersNonResRate / 100)

  // No city tax locations
  const noCityTax = 0

  const scenarios = [
    { name: 'NYC Resident', cityTax: Math.round(nycTax), total: Math.round(nysTax + nycTax) },
    { name: 'Yonkers Resident', cityTax: Math.round(yonkersResTax), total: Math.round(nysTax + yonkersResTax) },
    { name: 'Yonkers Non-Res', cityTax: Math.round(yonkersNonResTax), total: Math.round(nysTax + yonkersNonResTax) },
    { name: 'Elsewhere in NY', cityTax: 0, total: Math.round(nysTax) },
  ]

  const currentScenario = scenarios.find(s =>
    currentLocation === 'nyc' ? s.name === 'NYC Resident'
    : currentLocation === 'yonkers' ? s.name === 'Yonkers Resident'
    : s.name === 'Elsewhere in NY'
  ) || scenarios[0]

  const cheapest = scenarios.reduce((a, b) => a.total < b.total ? a : b)
  const savings = currentScenario.total - cheapest.total

  return {
    primary: { value: currentScenario.cityTax, label: `${currentScenario.name} City/Local Tax`, unit: '$' },
    secondary: [
      { label: 'NYS Tax', value: fmt(Math.round(nysTax)), unit: '$' },
      { label: 'Total State+Local', value: fmt(currentScenario.total), unit: '$' },
      { label: 'Cheapest Option', value: cheapest.name, unit: '' },
      { label: 'Potential Savings', value: fmt(savings), unit: '$' },
      { label: 'NYC Tax Rate', value: `${nycRate}%`, unit: '' },
      { label: 'Yonkers Surcharge', value: `${yonkersResSurcharge}%`, unit: '' },
    ],
    breakdown: scenarios.map((s, i) => ({
      label: s.name,
      value: fmtD(s.total),
      color: ['#1E3A8A', '#CA8A04', '#059669', '#10B981'][i],
    })),
    chartData: scenarios.map((s, i) => ({
      name: s.name,
      value: s.total,
      color: ['#1E3A8A', '#CA8A04', '#059669', '#10B981'][i],
    })),
    advice: `On ${fmtD(annualIncome)} income, ${currentScenario.name} pays ${fmtD(currentScenario.total)} in state+local tax. ${savings > 0 ? `Moving to ${cheapest.name} would save ${fmtD(savings)}/year.` : 'You are already in the lowest-tax location.'} NYC charges a flat ${nycRate}% city tax, while Yonkers adds a ${yonkersResSurcharge}% surcharge on your NYS tax. Living elsewhere in NY avoids city tax entirely.`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: Freelancer UBT (#7 freelancer-ubt-new-york)
// ============================================================================

function calculateFreelancerUBT(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const netEarnings = Number(input.netEarnings || 100000)
  const businessExpenses = Number(input.businessExpenses || 15000)
  const isNYCBased = String(input.nycBased || 'yes') === 'yes'
  const businessType = String(input.businessType || 'sole_prop')

  const ubtRate = Number(stateData.ubtRate || 4)
  const ubtExemption = Number(stateData.ubtExemption || 100000) // UBT has no exemption — $0, but credit effectively exempts first ~$100K
  const nysRate = Number(stateData.topIncomeTaxRate || 10.9)
  const nycRate = Number(stateData.nycTopRate || 3.876)
  const seRate = Number(stateData.selfEmploymentRate || 15.3)

  const taxableIncome = Math.max(0, netEarnings - businessExpenses)

  // Self-employment tax (FICA equivalent)
  const seTaxable = taxableIncome * 0.9235
  const seTax = Math.min(seTaxable, 168600) * 0.153 + Math.max(0, seTaxable - 168600) * 0.029

  // Federal income tax (simplified — 22% bracket for most freelancers)
  const fedDeduction = taxableIncome * 0.5 * 0.153 // SE deduction
  const fedTaxable = Math.max(0, taxableIncome - 14600 - fedDeduction)
  const fedTax = fedTaxable * 0.22 // simplified

  // NYS tax
  const nysTax = taxableIncome * (nysRate / 100) * 0.6

  // NYC tax
  const nycTax = isNYCBased ? taxableIncome * (nycRate / 100) : 0

  // UBT (NYC only, on unincorporated business income)
  const ubtTax = isNYCBased && businessType !== 'scorp' ? taxableIncome * (ubtRate / 100) : 0
  // UBT credit against NYC personal income tax
  const ubtCredit = Math.min(ubtTax * 0.65, nycTax)
  const netUBT = ubtTax - ubtCredit

  const totalTax = Math.round(fedTax + nysTax + nycTax + seTax + netUBT)
  const netIncome = taxableIncome - totalTax
  const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0

  return {
    primary: { value: Math.round(netUBT + ubtCredit), label: 'NYC UBT (Gross)', unit: '$' },
    secondary: [
      { label: 'UBT Credit', value: fmt(Math.round(ubtCredit)), unit: '$' },
      { label: 'Net UBT Cost', value: fmt(Math.round(netUBT)), unit: '$' },
      { label: 'Total All Taxes', value: fmt(totalTax), unit: '$' },
      { label: 'Net Income', value: fmt(Math.round(netIncome)), unit: '$' },
      { label: 'Effective Rate', value: effectiveRate.toFixed(1), unit: '%' },
      { label: 'SE Tax', value: fmt(Math.round(seTax)), unit: '$' },
      { label: 'Federal Tax', value: fmt(Math.round(fedTax)), unit: '$' },
    ],
    breakdown: [
      { label: 'Federal Income Tax', value: fmtD(Math.round(fedTax)), color: '#1E3A8A' },
      { label: 'NYS Income Tax', value: fmtD(Math.round(nysTax)), color: '#059669' },
      { label: 'NYC Income Tax', value: fmtD(Math.round(nycTax)), color: '#CA8A04' },
      { label: 'Self-Employment Tax', value: fmtD(Math.round(seTax)), color: '#DC2626' },
      { label: 'UBT (net of credit)', value: fmtD(Math.round(netUBT)), color: '#7C3AED' },
      { label: 'Net Income', value: fmtD(Math.round(netIncome)), color: '#10B981' },
    ],
    chartData: [
      { name: 'Federal', value: Math.round(fedTax), color: '#1E3A8A' },
      { name: 'NYS', value: Math.round(nysTax), color: '#059669' },
      { name: 'NYC', value: Math.round(nycTax), color: '#CA8A04' },
      { name: 'SE Tax', value: Math.round(seTax), color: '#DC2626' },
      { name: 'UBT (net)', value: Math.round(netUBT), color: '#7C3AED' },
      { name: 'Net Income', value: Math.round(netIncome), color: '#10B981' },
    ],
    advice: `As a NYC freelancer earning ${fmtD(taxableIncome)}, your total tax burden is ${fmtD(totalTax)} (${effectiveRate.toFixed(1)}% effective rate). The NYC Unincorporated Business Tax adds ${ubtRate}% (${fmtD(Math.round(ubtTax))}), but the 65% UBT credit reduces this to ${fmtD(Math.round(netUBT))} net. ${businessType === 'sole_prop' ? 'Consider incorporating as an S-Corp to potentially avoid UBT and reduce SE tax.' : 'S-Corp election eliminates UBT on reasonable salary distributions.'}`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: Retirement Tax (#8 retirement-tax-new-york)
// ============================================================================

function calculateNYRetirementTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const retirementIncome = Number(input.retirementIncome || 60000)
  const incomeSource = String(input.incomeSource || '401k')
  const age = Number(input.age || 67)
  const filingStatus = String(input.filingStatus || 'single')

  const pensionExclusion = Number(stateData.pensionExclusion || 20000)
  const govPensionExempt = stateData.govPensionExempt !== false
  const retirementExclusionAge = Number(stateData.retirementExclusionAge || 59.5)

  // NY does NOT tax Social Security
  const ssTaxable = 0

  // NY pension exclusion: $20,000 for age 59.5+
  let nysTaxableIncome = retirementIncome
  let exclusionApplied = 0
  if (incomeSource === 'social-security') {
    nysTaxableIncome = 0
    exclusionApplied = retirementIncome
  } else if (incomeSource === 'gov-pension' && govPensionExempt) {
    nysTaxableIncome = 0
    exclusionApplied = retirementIncome
  } else if (age >= retirementExclusionAge) {
    exclusionApplied = Math.min(retirementIncome, pensionExclusion)
    nysTaxableIncome = Math.max(0, retirementIncome - exclusionApplied)
  }

  const nysRate = Number(stateData.topIncomeTaxRate || 10.9) / 100 * 0.5 // lower bracket estimate
  const nysTax = nysTaxableIncome * nysRate

  // Federal tax estimate
  const fedTaxable = incomeSource === 'social-security'
    ? retirementIncome * 0.85 * 0.12 // up to 85% taxable at 12%
    : retirementIncome * 0.15 // simplified
  const fedTax = fedTaxable

  const totalTax = Math.round(nysTax + fedTax)
  const netIncome = retirementIncome - totalTax
  const monthlyNet = Math.round(netIncome / 12)

  // Comparison across income sources
  const sources = ['social-security', 'pension', '401k', 'gov-pension']
  const sourceLabels: Record<string, string> = { 'social-security': 'Social Security', pension: 'Private Pension', '401k': '401k/IRA', 'gov-pension': 'Gov Pension' }

  return {
    primary: { value: Math.round(nysTax), label: 'NYS Tax on Retirement Income', unit: '$' },
    secondary: [
      { label: 'Federal Tax (est.)', value: fmt(Math.round(fedTax)), unit: '$' },
      { label: 'Total Tax', value: fmt(totalTax), unit: '$' },
      { label: 'Net Annual Income', value: fmt(Math.round(netIncome)), unit: '$' },
      { label: 'Monthly Net', value: fmt(monthlyNet), unit: '$' },
      { label: 'NY Exclusion Used', value: fmt(Math.round(exclusionApplied)), unit: '$' },
      { label: 'NY Taxable Income', value: fmt(Math.round(nysTaxableIncome)), unit: '$' },
    ],
    breakdown: [
      { label: 'NYS Tax', value: fmtD(Math.round(nysTax)), color: '#1E3A8A' },
      { label: 'Federal Tax (est.)', value: fmtD(Math.round(fedTax)), color: '#DC2626' },
      { label: 'Net Income', value: fmtD(Math.round(netIncome)), color: '#10B981' },
    ],
    chartData: sources.map((s, i) => {
      const taxable = s === 'social-security' ? 0
        : s === 'gov-pension' ? 0
        : Math.max(0, retirementIncome - (age >= retirementExclusionAge ? pensionExclusion : 0))
      return { name: sourceLabels[s], value: Math.round(taxable * nysRate), color: ['#1E3A8A', '#CA8A04', '#DC2626', '#059669'][i] }
    }),
    advice: incomeSource === 'social-security'
      ? `New York does not tax Social Security benefits. Your full ${fmtD(retirementIncome)} is NYS tax-free. Federal tax may apply on up to 85% of benefits.`
      : incomeSource === 'gov-pension'
      ? `Government pensions (federal, NYS, local) are fully exempt from NYS income tax. Your ${fmtD(retirementIncome)} is NYS tax-free.`
      : `New York allows a ${fmtD(pensionExclusion)}/year exclusion on private pension and retirement plan income for age ${retirementExclusionAge}+. ${age >= retirementExclusionAge ? `You save ${fmtD(Math.round(pensionExclusion * nysRate))} in NYS tax.` : `You are under ${retirementExclusionAge} — no exclusion applies yet.`}`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: Commuter Tax (#9 commuter-tax-new-york)
// ============================================================================

function calculateCommuterTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const annualSalary = Number(input.annualSalary || 120000)
  const residenceState = String(input.residenceState || 'nj')
  const workLocation = String(input.workLocation || 'nyc')
  const daysInOffice = Number(input.daysInOffice || 3)

  const nysRate = Number(stateData.topIncomeTaxRate || 10.9)
  const convenienceRule = stateData.convenienceRule !== false

  // NYS tax brackets
  const nysBrackets = (stateData.taxBrackets || []) as unknown as { min: number; max: number | null; rate: number }[]
  const nysResult = calcBracketTax(annualSalary - 8000, nysBrackets)

  // Home state tax (simplified estimates)
  const homeStateTaxRates: Record<string, number> = {
    nj: 6.37, ct: 6.99, pa: 3.07, none: 0,
  }
  const homeStateRate = homeStateTaxRates[residenceState] || 5
  const homeStateTax = annualSalary * (homeStateRate / 100) * 0.6

  // NY Convenience Rule: if you COULD work from the employer's NY office,
  // NY taxes your full income even if you work remotely from another state
  const daysPerYear = 260
  const nyDays = daysInOffice * 52
  const nyAllocation = convenienceRule ? 1.0 : nyDays / daysPerYear

  const nysTax = Math.round(nysResult.total * nyAllocation)

  // Home state credit for taxes paid to NY (most states allow this)
  const creditForNYTax = Math.min(nysTax, Math.round(homeStateTax))
  const netHomeStateTax = Math.max(0, Math.round(homeStateTax) - creditForNYTax)
  const totalStateTax = nysTax + netHomeStateTax

  // Federal + FICA
  const fedTax = Math.round(annualSalary * 0.22)
  const ficaTax = Math.round(annualSalary * 0.0765)
  const totalTax = totalStateTax + fedTax + ficaTax
  const netIncome = annualSalary - totalTax

  const stateNames: Record<string, string> = { nj: 'New Jersey', ct: 'Connecticut', pa: 'Pennsylvania', none: 'No-tax state' }
  const homeStateName = stateNames[residenceState] || residenceState.toUpperCase()

  return {
    primary: { value: nysTax, label: 'NYS Tax (Non-Resident)', unit: '$' },
    secondary: [
      { label: `${homeStateName} Tax`, value: fmt(netHomeStateTax), unit: '$' },
      { label: 'Total State Tax', value: fmt(totalStateTax), unit: '$' },
      { label: 'Federal Tax', value: fmt(fedTax), unit: '$' },
      { label: 'FICA', value: fmt(ficaTax), unit: '$' },
      { label: 'Net Income', value: fmt(Math.round(netIncome)), unit: '$' },
      { label: 'NY Allocation', value: `${(nyAllocation * 100).toFixed(0)}%`, unit: '' },
      { label: 'Convenience Rule', value: convenienceRule ? 'Applies' : 'N/A', unit: '' },
    ],
    breakdown: [
      { label: 'NYS Tax', value: fmtD(nysTax), color: '#1E3A8A' },
      { label: `${homeStateName} Tax (net)`, value: fmtD(netHomeStateTax), color: '#CA8A04' },
      { label: 'Federal Tax', value: fmtD(fedTax), color: '#059669' },
      { label: 'FICA', value: fmtD(ficaTax), color: '#DC2626' },
      { label: 'Net Income', value: fmtD(Math.round(netIncome)), color: '#10B981' },
    ],
    chartData: [
      { name: 'NYS', value: nysTax, color: '#1E3A8A' },
      { name: homeStateName, value: netHomeStateTax, color: '#CA8A04' },
      { name: 'Federal', value: fedTax, color: '#059669' },
      { name: 'FICA', value: ficaTax, color: '#DC2626' },
      { name: 'Net', value: Math.round(netIncome), color: '#10B981' },
    ],
    schedule: {
      headers: ['Home State', 'Home Tax', 'NY Tax', 'Credit', 'Net Home Tax', 'Total State'],
      rows: Object.entries(homeStateTaxRates).map(([st, rate]) => {
        const hTax = Math.round(annualSalary * rate / 100 * 0.6)
        const credit = Math.min(nysTax, hTax)
        const net = Math.max(0, hTax - credit)
        return [stateNames[st] || st.toUpperCase(), fmtD(hTax), fmtD(nysTax), fmtD(credit), fmtD(net), fmtD(nysTax + net)]
      }),
    },
    advice: `As a ${homeStateName} resident working in NYC, you owe ${fmtD(nysTax)} in NYS non-resident tax. ${convenienceRule ? "NY's Convenience of the Employer rule taxes your FULL income even if you work remotely — you must prove telecommuting is required by your employer, not just convenient." : ''} ${homeStateName} gives a credit of ${fmtD(creditForNYTax)} for NY taxes paid, reducing your ${homeStateName} tax to ${fmtD(netHomeStateTax)}. Total state tax burden: ${fmtD(totalStateTax)}.`,
  }
}

// ============================================================================
// CUSTOM CALCULATION: Nanny Tax (#10 nanny-tax-new-york)
// ============================================================================

function calculateNannyTax(input: CalculatorInput, stateData: StateData): CalculatorOutput {
  const annualWage = Number(input.annualWage || 45000)
  const weeklyHours = Number(input.weeklyHours || 40)
  const provideBenefits = String(input.provideBenefits || 'basic') // basic, full, none

  const ficaEmployerRate = Number(stateData.ficaEmployerRate || 7.65) / 100
  const nysUIRate = Number(stateData.nysUnemploymentRate || 4.1) / 100
  const uiWageBase = Number(stateData.nysUIWageBase || 12500)
  const futaRate = Number(stateData.futaRate || 0.6) / 100
  const nannyThreshold = Number(stateData.nannyThreshold || 2700)

  if (annualWage < nannyThreshold) {
    return {
      primary: { value: 0, label: 'Employer Tax Obligation', unit: '$' },
      secondary: [{ label: 'Status', value: `Below $${nannyThreshold} threshold`, unit: '' }],
      advice: `Annual wages under $${nannyThreshold} do not trigger household employer tax obligations in New York.`,
    }
  }

  // Employer's share of FICA
  const employerFICA = annualWage * ficaEmployerRate

  // NYS Unemployment Insurance
  const nysUI = Math.min(annualWage, uiWageBase) * nysUIRate

  // Federal Unemployment (FUTA)
  const futa = Math.min(annualWage, 7000) * futaRate

  // NYS Workers' Comp (estimated)
  const workersComp = annualWage * 0.015

  // NYS Disability Insurance
  const nysDBL = 52 * 0.60 // $0.60/week employee contribution, employer often covers

  // Paid Family Leave
  const pfml = annualWage * 0.00455 // 2024 rate

  // Benefits cost estimate
  const benefitsCost = provideBenefits === 'full' ? annualWage * 0.15
    : provideBenefits === 'basic' ? annualWage * 0.05
    : 0

  const totalEmployerCost = Math.round(employerFICA + nysUI + futa + workersComp + nysDBL + pfml + benefitsCost)
  const totalCostWithWages = annualWage + totalEmployerCost
  const hourlyRate = annualWage / (weeklyHours * 52)
  const trueHourlyRate = totalCostWithWages / (weeklyHours * 52)

  return {
    primary: { value: totalEmployerCost, label: 'Total Employer Tax & Costs', unit: '$' },
    secondary: [
      { label: 'Nanny Gross Wage', value: fmt(annualWage), unit: '$' },
      { label: 'True Annual Cost', value: fmt(totalCostWithWages), unit: '$' },
      { label: 'Nanny Hourly Rate', value: hourlyRate.toFixed(2), unit: '$/hr' },
      { label: 'True Hourly Cost', value: trueHourlyRate.toFixed(2), unit: '$/hr' },
      { label: 'Employer FICA', value: fmt(Math.round(employerFICA)), unit: '$' },
      { label: 'NYS Unemployment', value: fmt(Math.round(nysUI)), unit: '$' },
      { label: 'Monthly True Cost', value: fmt(Math.round(totalCostWithWages / 12)), unit: '$' },
    ],
    breakdown: [
      { label: 'Nanny Wages', value: fmtD(annualWage), color: '#10B981' },
      { label: 'Employer FICA (7.65%)', value: fmtD(Math.round(employerFICA)), color: '#1E3A8A' },
      { label: 'NYS Unemployment', value: fmtD(Math.round(nysUI)), color: '#CA8A04' },
      { label: 'Workers Comp', value: fmtD(Math.round(workersComp)), color: '#DC2626' },
      { label: 'FUTA', value: fmtD(Math.round(futa)), color: '#059669' },
      { label: 'PFL + DBL', value: fmtD(Math.round(pfml + nysDBL)), color: '#7C3AED' },
      ...(benefitsCost > 0 ? [{ label: 'Benefits', value: fmtD(Math.round(benefitsCost)), color: '#0891B2' }] : []),
    ],
    chartData: [
      { name: 'Wages', value: annualWage, color: '#10B981' },
      { name: 'FICA', value: Math.round(employerFICA), color: '#1E3A8A' },
      { name: 'NYS UI', value: Math.round(nysUI), color: '#CA8A04' },
      { name: 'Workers Comp', value: Math.round(workersComp), color: '#DC2626' },
      { name: 'FUTA+PFL+DBL', value: Math.round(futa + pfml + nysDBL), color: '#7C3AED' },
    ],
    advice: `Hiring a nanny at ${fmtD(annualWage)}/year (${fmtD(Math.round(hourlyRate))}/hr) actually costs ${fmtD(totalCostWithWages)}/year (${fmtD(Math.round(trueHourlyRate))}/hr) when you include employer taxes and contributions. That's ${fmtD(totalEmployerCost)} in additional costs (${((totalEmployerCost / annualWage) * 100).toFixed(1)}% on top of wages). As a household employer in NY, you must register with the NYS DOL, file quarterly returns (Form NYS-45), and provide W-2 by January 31.`,
  }
}

// ============================================================================
// MAIN ROUTER
// ============================================================================

export function calculateStateFinance(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!financeBaseTypes.includes(baseType)) return null

  // Custom calculation handlers
  const customCalc = stateData.customCalc as string | undefined
  switch (customCalc) {
    case 'nyc-triple-tax': return calculateNYCTripleTax(input, stateData)
    case 'ny-property-tax': return calculateNYPropertyTax(input, stateData)
    case 'ny-sales-tax': return calculateNYSalesTax(input, stateData)
    case 'wall-street-bonus': return calculateWallStreetBonusTax(input, stateData)
    case 'ny-estate-tax': return calculateNYEstateTax(input, stateData)
    case 'nyc-vs-yonkers': return calculateNYCvsYonkersTax(input, stateData)
    case 'freelancer-ubt': return calculateFreelancerUBT(input, stateData)
    case 'ny-retirement-tax': return calculateNYRetirementTax(input, stateData)
    case 'commuter-tax': return calculateCommuterTax(input, stateData)
    case 'nanny-tax': return calculateNannyTax(input, stateData)
  }

  // Generic fallback for other states
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
      if (stateData.hasIncomeTax === false) {
        return {
          primary: { value: 0, label: 'State Income Tax', unit: '$' },
          advice: `This state has no state income tax. Your full income of ${fmtD(amount)} is not subject to state income tax.`,
        }
      }
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
      const stateRate = holding === 'short'
        ? Number(stateData.topIncomeTaxRate || stateData.flatTaxRate || 0)
        : Number(stateData.capitalGainsRate || stateData.topIncomeTaxRate || stateData.flatTaxRate || 0)
      const stateTax = gain * (stateRate / 100)
      const fedRate = holding === 'long' ? 15 : 22
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
          { label: 'Exemption', value: fmt(exemption), unit: '$' },
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
      const seTaxable = net * 0.9235
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
