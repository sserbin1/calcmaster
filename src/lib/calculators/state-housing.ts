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
          { value: '30', label: '30 Years' }, { value: '20', label: '20 Years' }, { value: '15', label: '15 Years' },
        ], default: '30' },
        { name: 'includePropertyTax', label: 'Include Property Tax', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
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
          { value: 'buyer', label: 'Buyer' }, { value: 'seller', label: 'Seller' },
        ], default: 'buyer' },
      ]
    case 'homestead-exemption':
      return [
        { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'taxRate', label: 'Property Tax Rate (%)', type: 'number', default: Number(stateData.avgPropertyTaxRate) || 1.0, step: 0.01 },
        { name: 'isPrimary', label: 'Primary Residence?', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
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
          { value: '30', label: '30% Rule (Recommended)' }, { value: '25', label: '25% Rule (Conservative)' },
          { value: '35', label: '35% Rule (Aggressive)' },
        ], default: '30' },
      ]
    case 'down-payment':
      return [
        { name: 'homePrice', label: 'Target Home Price ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'targetPercent', label: 'Down Payment Goal (%)', type: 'select', options: [
          { value: '3', label: '3% (FHA Minimum)' }, { value: '5', label: '5%' },
          { value: '10', label: '10%' }, { value: '20', label: '20% (Avoid PMI)' },
        ], default: '20' },
        { name: 'monthlySavings', label: 'Monthly Savings ($)', type: 'number', default: 1000, min: 0 },
        { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', default: 10000, min: 0 },
      ]
    case 'home-equity':
      return [
        { name: 'homeValue', label: 'Current Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'mortgageBalance', label: 'Remaining Mortgage ($)', type: 'number', default: 250000, min: 0 },
        { name: 'loanType', label: 'Equity Loan Type', type: 'select', options: [
          { value: 'heloc', label: 'HELOC' }, { value: 'loan', label: 'Home Equity Loan' },
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

// ============================================================================
// HELPERS
// ============================================================================
function fmt(n: number): string { return n.toLocaleString() }
function fmtD(n: number): string { return '$' + n.toLocaleString() }

function calcMonthlyPayment(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

// ============================================================================
// NY MORTGAGE RECORDING TAX (#11)
// ============================================================================
function calcMortgageRecordingTax(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const purchasePrice = Number(input.purchasePrice || 800000)
  const loanAmount = Number(input.loanAmount || 640000)
  const borough = String(input.borough || 'manhattan')
  const propertyType = String(input.propertyType || 'condo')

  // Mortgage recording tax rates
  const lowThreshold = Number(sd.mortgageTaxThreshold || 500000)
  const rateLow = Number(sd.mortgageTaxRateLow || 1.8) / 100
  const rateHigh = Number(sd.mortgageTaxRateHigh || 1.925) / 100
  const isHigh = loanAmount >= lowThreshold
  const borrowerRate = isHigh ? rateHigh : rateLow

  // NYC additional tax (0.25%) on loans >= $500K
  const isNYC = ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten_island'].includes(borough)
  const nycAdditional = isNYC && loanAmount >= 500000 ? loanAmount * 0.0025 : 0

  // Lender's portion
  const lenderRate = 0.25 / 100
  const lenderTax = loanAmount * lenderRate

  // Co-ops are EXEMPT from mortgage recording tax
  const isExempt = propertyType === 'coop'
  const borrowerTax = isExempt ? 0 : loanAmount * borrowerRate
  const totalTax = isExempt ? 0 : borrowerTax + lenderTax + nycAdditional

  // Mansion tax (separate — on purchases >= $1M)
  const mansionTax = purchasePrice >= 1000000 ? purchasePrice * 0.01 : 0

  // Transfer tax
  const transferTaxRate = purchasePrice >= 500000 ? 0.01425 : 0.004
  const transferTax = purchasePrice * transferTaxRate

  const totalClosing = totalTax + mansionTax + transferTax

  return {
    primary: { value: Math.round(totalTax), label: 'Mortgage Recording Tax', unit: '$' },
    secondary: [
      { label: 'Borrower Portion', value: fmt(Math.round(borrowerTax)), unit: '$' },
      { label: 'Lender Portion', value: fmt(Math.round(lenderTax)), unit: '$' },
      ...(nycAdditional > 0 ? [{ label: 'NYC Additional', value: fmt(Math.round(nycAdditional)), unit: '$' }] : []),
      { label: 'Transfer Tax', value: fmt(Math.round(transferTax)), unit: '$' },
      ...(mansionTax > 0 ? [{ label: 'Mansion Tax', value: fmt(Math.round(mansionTax)), unit: '$' }] : []),
      { label: 'Total Closing Taxes', value: fmt(Math.round(totalClosing)), unit: '$' },
      { label: 'Tax Rate', value: isExempt ? 'EXEMPT' : `${(borrowerRate * 100).toFixed(3)}%`, unit: '' },
    ],
    breakdown: [
      { label: 'Borrower Tax', value: fmtD(Math.round(borrowerTax)), color: '#1E3A8A' },
      { label: 'Lender Tax', value: fmtD(Math.round(lenderTax)), color: '#059669' },
      { label: 'Transfer Tax', value: fmtD(Math.round(transferTax)), color: '#CA8A04' },
      ...(mansionTax > 0 ? [{ label: 'Mansion Tax', value: fmtD(Math.round(mansionTax)), color: '#DC2626' }] : []),
      ...(nycAdditional > 0 ? [{ label: 'NYC Surcharge', value: fmtD(Math.round(nycAdditional)), color: '#7C3AED' }] : []),
    ],
    chartData: [
      { name: 'Borrower', value: Math.round(borrowerTax), color: '#1E3A8A' },
      { name: 'Lender', value: Math.round(lenderTax), color: '#059669' },
      { name: 'Transfer', value: Math.round(transferTax), color: '#CA8A04' },
      ...(mansionTax > 0 ? [{ name: 'Mansion', value: Math.round(mansionTax), color: '#DC2626' }] : []),
    ],
    advice: isExempt
      ? `Co-op purchases are exempt from mortgage recording tax in NYC — you save ${fmtD(Math.round(loanAmount * borrowerRate))}. This is a major financial advantage of co-ops over condos.`
      : `On a ${fmtD(loanAmount)} mortgage in ${borough.charAt(0).toUpperCase() + borough.slice(1).replace('_', ' ')}, you owe ${fmtD(Math.round(totalTax))} in recording tax (${(borrowerRate * 100).toFixed(3)}% rate). ${purchasePrice >= 1000000 ? `The 1% mansion tax adds ${fmtD(Math.round(mansionTax))}.` : ''} Total closing taxes: ${fmtD(Math.round(totalClosing))}.`,
  }
}

// ============================================================================
// NY RENT VS BUY (#12)
// ============================================================================
function calcNYRentVsBuy(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const homePrice = Number(input.homePrice || 750000)
  const monthlyRent = Number(input.monthlyRent || 3000)
  const downPct = Number(input.downPayment || 20) / 100
  const years = Number(input.yearsToStay || 7)
  const borough = String(input.borough || 'manhattan')

  const appreciation: Record<string, number> = { manhattan: 3.5, brooklyn: 4.5, queens: 4, bronx: 3, staten_island: 2.5 }
  const appRate = (appreciation[borough] || 3) / 100

  const rate = Number(sd.avgMortgageRate || 6.8) / 100 / 12
  const loanAmount = homePrice * (1 - downPct)
  const monthlyMortgage = calcMonthlyPayment(loanAmount, Number(sd.avgMortgageRate || 6.8), 360)
  const propTax = Number(sd.avgPropertyTaxRate || 1.69) / 100
  const monthlyOwn = monthlyMortgage + (homePrice * propTax / 12) + (homePrice * 0.004 / 12) + 800 // +maintenance

  // Mortgage recording tax (one-time)
  const mrtRate = loanAmount >= 500000 ? 1.925 : 1.8
  const closingBuy = loanAmount * (mrtRate / 100) + homePrice * 0.01425 + (homePrice >= 1000000 ? homePrice * 0.01 : 0) + 5000

  // Rental costs
  const rentIncrease = 0.035
  let totalRent = 0
  for (let y = 0; y < years; y++) totalRent += monthlyRent * Math.pow(1 + rentIncrease, y) * 12
  const brokerFee = monthlyRent // 1 month broker fee

  // Ownership costs
  const totalOwn = monthlyOwn * years * 12 + closingBuy
  const futureValue = homePrice * Math.pow(1 + appRate, years)
  const sellingCosts = futureValue * 0.06
  const equity = futureValue - loanAmount + (homePrice * downPct) - sellingCosts

  const buyNet = equity - totalOwn - (homePrice * downPct)
  const rentNet = -(totalRent + brokerFee)
  const advantage = buyNet - rentNet

  return {
    primary: { value: Math.abs(Math.round(advantage)), label: advantage > 0 ? 'Buying Advantage' : 'Renting Advantage', unit: '$' },
    secondary: [
      { label: 'Total Rent Cost', value: fmt(Math.round(totalRent)), unit: '$' },
      { label: 'Total Ownership Cost', value: fmt(Math.round(totalOwn)), unit: '$' },
      { label: 'Closing Costs (Buy)', value: fmt(Math.round(closingBuy)), unit: '$' },
      { label: 'Home Value Year ' + years, value: fmt(Math.round(futureValue)), unit: '$' },
      { label: 'Equity Built', value: fmt(Math.round(equity)), unit: '$' },
      { label: 'Monthly Own vs Rent', value: `${fmtD(Math.round(monthlyOwn))} vs ${fmtD(monthlyRent)}`, unit: '' },
    ],
    breakdown: [
      { label: 'Rent (total)', value: fmtD(Math.round(totalRent)), color: '#DC2626' },
      { label: 'Own (total)', value: fmtD(Math.round(totalOwn)), color: '#1E3A8A' },
      { label: 'Equity Built', value: fmtD(Math.round(equity)), color: '#10B981' },
      { label: 'Closing Costs', value: fmtD(Math.round(closingBuy)), color: '#CA8A04' },
    ],
    chartData: [
      { name: 'Rent Total', value: Math.round(totalRent), color: '#DC2626' },
      { name: 'Own Total', value: Math.round(totalOwn), color: '#1E3A8A' },
      { name: 'Equity', value: Math.round(equity), color: '#10B981' },
    ],
    advice: advantage > 0
      ? `In ${borough.charAt(0).toUpperCase() + borough.slice(1).replace('_', ' ')}, buying is ${fmtD(Math.round(advantage))} better than renting over ${years} years. NYC closing costs are high (${fmtD(Math.round(closingBuy))}), but ${(appRate * 100).toFixed(1)}% annual appreciation builds ${fmtD(Math.round(equity))} in equity.`
      : `Renting saves ${fmtD(Math.abs(Math.round(advantage)))} over ${years} years in ${borough.charAt(0).toUpperCase() + borough.slice(1).replace('_', ' ')}. NYC's high closing costs and property taxes make buying expensive for shorter stays.`,
  }
}

// ============================================================================
// NY MANSION TAX (#13)
// ============================================================================
function calcMansionTax(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const purchasePrice = Number(input.purchasePrice || 2000000)
  const propertyType = String(input.propertyType || 'condo')

  // NYC progressive mansion tax (2019 rates)
  const brackets = [
    { min: 1000000, max: 2000000, rate: 1.0 },
    { min: 2000000, max: 3000000, rate: 1.25 },
    { min: 3000000, max: 5000000, rate: 1.5 },
    { min: 5000000, max: 10000000, rate: 2.25 },
    { min: 10000000, max: 15000000, rate: 3.25 },
    { min: 15000000, max: 20000000, rate: 3.5 },
    { min: 20000000, max: 25000000, rate: 3.75 },
    { min: 25000000, max: Infinity, rate: 3.9 },
  ]

  let mansionTax = 0
  let applicableBracket = ''
  for (const b of brackets) {
    if (purchasePrice >= b.min && purchasePrice < b.max) {
      mansionTax = purchasePrice * (b.rate / 100)
      applicableBracket = `${b.rate}%`
      break
    }
  }

  // Transfer tax
  const transferRate = purchasePrice >= 500000 ? 1.425 : 0.4
  const transferTax = purchasePrice * (transferRate / 100)

  // Mortgage recording tax estimate (80% LTV)
  const estLoan = purchasePrice * 0.8
  const mrtRate = estLoan >= 500000 ? 1.925 : 1.8
  const mrt = propertyType === 'coop' ? 0 : estLoan * (mrtRate / 100)

  const totalTaxes = mansionTax + transferTax + mrt
  const effectiveRate = purchasePrice > 0 ? (totalTaxes / purchasePrice) * 100 : 0

  // Comparison at different price points
  const pricePoints = [1000000, 2000000, 3000000, 5000000, 10000000]

  return {
    primary: { value: Math.round(mansionTax), label: 'NYC Mansion Tax', unit: '$' },
    secondary: [
      { label: 'Tax Rate', value: applicableBracket || 'N/A', unit: '' },
      { label: 'Transfer Tax', value: fmt(Math.round(transferTax)), unit: '$' },
      { label: 'Mortgage Recording Tax', value: fmt(Math.round(mrt)), unit: '$' },
      { label: 'Total Buyer Taxes', value: fmt(Math.round(totalTaxes)), unit: '$' },
      { label: 'Effective Tax Rate', value: effectiveRate.toFixed(2), unit: '%' },
    ],
    breakdown: [
      { label: 'Mansion Tax', value: fmtD(Math.round(mansionTax)), color: '#1E3A8A' },
      { label: 'Transfer Tax', value: fmtD(Math.round(transferTax)), color: '#CA8A04' },
      { label: 'Mortgage Recording Tax', value: fmtD(Math.round(mrt)), color: '#059669' },
    ],
    chartData: pricePoints.map((p, i) => {
      let tax = 0
      for (const b of brackets) { if (p >= b.min && p < b.max) { tax = p * (b.rate / 100); break } }
      return { name: `$${(p / 1000000).toFixed(0)}M`, value: Math.round(tax), color: ['#1E3A8A', '#CA8A04', '#059669', '#DC2626', '#7C3AED'][i] }
    }),
    schedule: {
      headers: ['Price Range', 'Rate', 'Tax on $' + (purchasePrice / 1000000).toFixed(1) + 'M'],
      rows: brackets.map(b => [
        `$${fmt(b.min)} – ${b.max === Infinity ? '$25M+' : '$' + fmt(b.max)}`,
        `${b.rate}%`,
        purchasePrice >= b.min && purchasePrice < b.max ? fmtD(Math.round(purchasePrice * b.rate / 100)) : '-'
      ]),
    },
    advice: purchasePrice < 1000000
      ? `At ${fmtD(purchasePrice)}, your purchase is below the $1M mansion tax threshold. No mansion tax applies.`
      : `Your ${fmtD(purchasePrice)} purchase triggers the ${applicableBracket} mansion tax — ${fmtD(Math.round(mansionTax))}. Combined with transfer tax and mortgage recording tax, total buyer taxes are ${fmtD(Math.round(totalTaxes))} (${effectiveRate.toFixed(2)}% of purchase price). ${purchasePrice > 999000 && purchasePrice < 1050000 ? 'Consider negotiating below $1M to avoid mansion tax entirely.' : ''}`,
  }
}

// ============================================================================
// NY STAR EXEMPTION (#14)
// ============================================================================
function calcSTARExemption(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const homeValue = Number(input.homeValue || 400000)
  const householdIncome = Number(input.householdIncome || 85000)
  const age = Number(input.age || 45)
  const county = String(input.county || 'nyc')

  const basicLimit = Number(sd.starBasicIncomeLimit || 250000)
  const enhancedLimit = Number(sd.starEnhancedIncomeLimit || 98700)
  const enhancedAge = Number(sd.starEnhancedAge || 65)
  const basicSavings = Number(sd.starBasicSavings || 1245)
  const enhancedSavings = Number(sd.starEnhancedSavings || 1780)

  const qualifiesBasic = householdIncome <= basicLimit
  const qualifiesEnhanced = age >= enhancedAge && householdIncome <= enhancedLimit
  const savings = qualifiesEnhanced ? enhancedSavings : qualifiesBasic ? basicSavings : 0
  const programType = qualifiesEnhanced ? 'Enhanced STAR' : qualifiesBasic ? 'Basic STAR' : 'Not Eligible'

  const taxRate = county === 'nyc' ? 1.069 : county === 'nassau' ? 1.968 : county === 'westchester' ? 1.725 : 1.5
  const annualTax = homeValue * (taxRate / 100)
  const effectiveSavings = Math.min(savings, annualTax)

  return {
    primary: { value: Math.round(effectiveSavings), label: 'Annual STAR Savings', unit: '$' },
    secondary: [
      { label: 'Program', value: programType, unit: '' },
      { label: 'Property Tax (est.)', value: fmt(Math.round(annualTax)), unit: '$' },
      { label: 'Tax After STAR', value: fmt(Math.round(annualTax - effectiveSavings)), unit: '$' },
      { label: 'Monthly Savings', value: fmt(Math.round(effectiveSavings / 12)), unit: '$' },
      { label: 'Basic STAR Max', value: fmt(basicSavings), unit: '$' },
      { label: 'Enhanced STAR Max', value: fmt(enhancedSavings), unit: '$' },
    ],
    breakdown: [
      { label: 'Property Tax', value: fmtD(Math.round(annualTax)), color: '#DC2626' },
      { label: 'STAR Savings', value: `-${fmtD(Math.round(effectiveSavings))}`, color: '#10B981' },
      { label: 'Net Tax', value: fmtD(Math.round(annualTax - effectiveSavings)), color: '#1E3A8A' },
    ],
    chartData: [
      { name: 'No STAR', value: Math.round(annualTax), color: '#DC2626' },
      { name: 'Basic STAR', value: Math.round(annualTax - basicSavings), color: '#CA8A04' },
      { name: 'Enhanced STAR', value: Math.round(annualTax - enhancedSavings), color: '#10B981' },
    ],
    advice: qualifiesEnhanced
      ? `You qualify for Enhanced STAR — saving ${fmtD(enhancedSavings)}/year. Requires age ${enhancedAge}+ and income under ${fmtD(enhancedLimit)}.`
      : qualifiesBasic
      ? `You qualify for Basic STAR — saving ${fmtD(basicSavings)}/year. ${age >= 60 ? `When you turn ${enhancedAge}, you may qualify for Enhanced STAR (${fmtD(enhancedSavings)}/year) if income stays under ${fmtD(enhancedLimit)}.` : ''}`
      : `Your household income of ${fmtD(householdIncome)} exceeds the ${fmtD(basicLimit)} Basic STAR limit. You do not qualify for STAR savings.`,
  }
}

// ============================================================================
// NY CO-OP AFFORDABILITY (#15)
// ============================================================================
function calcCoopAffordability(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const annualIncome = Number(input.annualIncome || 150000)
  const monthlyDebts = Number(input.monthlyDebts || 500)
  const savedForDown = Number(input.savedForDown || 200000)
  const targetBorough = String(input.targetBorough || 'manhattan')

  const dtiLimit = Number(sd.typicalDTILimit || 25) / 100
  const liquidityYears = Number(sd.typicalLiquidityYears || 2)
  const minDown = Number(sd.minDownPayment || 20) / 100
  const maintenance1BR: Record<string, number> = { manhattan: 1200, brooklyn: 900, queens: 700, bronx: 500, staten_island: 450 }
  const avgMaint = maintenance1BR[targetBorough] || 800

  const monthlyIncome = annualIncome / 12
  const maxMonthlyHousing = monthlyIncome * dtiLimit - monthlyDebts
  const maxMortgagePayment = maxMonthlyHousing - avgMaint
  const maxLoan = maxMortgagePayment > 0 ? maxMortgagePayment * 166.79 : 0 // ~30yr at 6.8%
  const maxPrice = maxLoan / (1 - minDown)
  const downNeeded = maxPrice * minDown
  const postCloseLiquidity = annualIncome * liquidityYears - savedForDown

  const canAfford = savedForDown >= downNeeded && maxMortgagePayment > 0

  return {
    primary: { value: Math.round(maxPrice), label: 'Max Co-op Price', unit: '$' },
    secondary: [
      { label: 'Down Payment (20%)', value: fmt(Math.round(downNeeded)), unit: '$' },
      { label: 'Max Mortgage Payment', value: fmt(Math.round(maxMortgagePayment)), unit: '$/mo' },
      { label: 'Est. Maintenance', value: fmt(avgMaint), unit: '$/mo' },
      { label: 'DTI Limit', value: `${(dtiLimit * 100).toFixed(0)}%`, unit: '' },
      { label: 'Post-Close Liquidity', value: fmt(Math.round(Math.max(0, savedForDown - downNeeded))), unit: '$' },
      { label: 'Status', value: canAfford ? 'Likely Approved' : 'May Need More Savings', unit: '' },
    ],
    breakdown: [
      { label: 'Mortgage Payment', value: fmtD(Math.round(maxMortgagePayment)), color: '#1E3A8A' },
      { label: 'Maintenance', value: fmtD(avgMaint), color: '#CA8A04' },
      { label: 'Other Debts', value: fmtD(Math.round(monthlyDebts)), color: '#DC2626' },
      { label: 'Remaining Income', value: fmtD(Math.round(monthlyIncome - maxMonthlyHousing)), color: '#10B981' },
    ],
    chartData: Object.entries(maintenance1BR).map(([b, m], i) => ({
      name: b.charAt(0).toUpperCase() + b.slice(1).replace('_', ' '),
      value: m,
      color: ['#1E3A8A', '#CA8A04', '#059669', '#DC2626', '#7C3AED'][i],
    })),
    advice: `NYC co-op boards typically require 25% DTI, 20% down payment, and ${liquidityYears} years of post-close liquidity. In ${targetBorough.charAt(0).toUpperCase() + targetBorough.slice(1).replace('_', ' ')}, avg maintenance is ${fmtD(avgMaint)}/mo. ${canAfford ? `You can afford up to ${fmtD(Math.round(maxPrice))} with your ${fmtD(annualIncome)} income.` : `You need more savings — ${fmtD(Math.round(downNeeded))} down payment required.`} Remember: co-ops are exempt from mortgage recording tax, saving thousands.`,
  }
}

// ============================================================================
// NY 40x RENT RULE (#16)
// ============================================================================
function calc40xRentRule(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const annualIncome = Number(input.annualIncome || 80000)
  const needsGuarantor = String(input.needsGuarantor || 'no') === 'yes'
  const desiredRent = Number(input.desiredRent || 2500)

  const multiplier = Number(sd.rentMultiplier || 40)
  const guarantorMultiplier = Number(sd.guarantorMultiplier || 80)

  const maxRent = annualIncome / multiplier
  const guarantorIncomeNeeded = desiredRent * guarantorMultiplier
  const canAfford = maxRent >= desiredRent
  const shortfall = canAfford ? 0 : desiredRent - maxRent
  const incomeNeeded = desiredRent * multiplier

  return {
    primary: { value: Math.round(maxRent), label: 'Max Affordable Rent', unit: '$/mo' },
    secondary: [
      { label: 'Income Needed for Target', value: fmt(Math.round(incomeNeeded)), unit: '$' },
      { label: 'Your Annual Income', value: fmt(annualIncome), unit: '$' },
      { label: 'Monthly Shortfall', value: fmt(Math.round(shortfall)), unit: '$/mo' },
      { label: 'Guarantor Income Needed', value: fmt(Math.round(guarantorIncomeNeeded)), unit: '$' },
      { label: '40x Rule Status', value: canAfford ? 'PASS' : 'FAIL — Need Guarantor', unit: '' },
    ],
    breakdown: [
      { label: 'Max Affordable Rent', value: fmtD(Math.round(maxRent)), color: '#10B981' },
      { label: 'Desired Rent', value: fmtD(desiredRent), color: canAfford ? '#059669' : '#DC2626' },
      ...(shortfall > 0 ? [{ label: 'Monthly Gap', value: fmtD(Math.round(shortfall)), color: '#CA8A04' }] : []),
    ],
    chartData: [
      { name: '$1,500', value: 1500 * 40, color: '#10B981' },
      { name: '$2,000', value: 2000 * 40, color: '#059669' },
      { name: '$2,500', value: 2500 * 40, color: '#CA8A04' },
      { name: '$3,000', value: 3000 * 40, color: '#DC2626' },
      { name: '$3,500', value: 3500 * 40, color: '#1E3A8A' },
    ],
    schedule: {
      headers: ['Monthly Rent', 'Income Needed (40x)', 'Guarantor Income (80x)'],
      rows: [1500, 2000, 2500, 3000, 3500, 4000, 5000].map(r => [
        fmtD(r), fmtD(r * 40), fmtD(r * 80),
      ]),
    },
    advice: canAfford
      ? `Your ${fmtD(annualIncome)} income passes the 40x rule for ${fmtD(desiredRent)}/month rent (you need ${fmtD(Math.round(incomeNeeded))}). Most NYC landlords use this as the minimum threshold.`
      : `Your ${fmtD(annualIncome)} income falls short for ${fmtD(desiredRent)}/month rent. You need a guarantor earning ${fmtD(Math.round(guarantorIncomeNeeded))} (80x rule) or reduce rent to ${fmtD(Math.round(maxRent))}/month. Alternatively, some landlords accept 2+ months security deposit.`,
  }
}

// ============================================================================
// NY DOWN PAYMENT (#17)
// ============================================================================
function calcNYDownPayment(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const targetPrice = Number(input.targetPrice || 700000)
  const propertyType = String(input.propertyType || 'condo')
  const monthlySavings = Number(input.monthlySavings || 3000)
  const currentSavings = Number(input.currentSavings || 50000)

  const minDown: Record<string, number> = {
    coop: Number(sd.coopMinDown || 20),
    condo: Number(sd.condoMinDown || 10),
    house: 5,
  }
  const pct = (minDown[propertyType] || 20) / 100
  const needed = targetPrice * pct
  const closingCosts = Number(sd.avgClosingCosts || 15000) + (propertyType !== 'coop' ? targetPrice * 0.8 * 0.019 : 0)
  const totalNeeded = needed + closingCosts
  const remaining = Math.max(0, totalNeeded - currentSavings)
  const monthsToSave = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0

  return {
    primary: { value: Math.round(totalNeeded), label: 'Total Cash Needed', unit: '$' },
    secondary: [
      { label: 'Down Payment', value: fmt(Math.round(needed)), unit: '$' },
      { label: 'Closing Costs (est.)', value: fmt(Math.round(closingCosts)), unit: '$' },
      { label: 'Already Saved', value: fmt(currentSavings), unit: '$' },
      { label: 'Still Needed', value: fmt(Math.round(remaining)), unit: '$' },
      { label: 'Months to Save', value: monthsToSave > 0 ? `${monthsToSave} months` : 'Ready', unit: '' },
      { label: 'Min Down %', value: `${(pct * 100).toFixed(0)}%`, unit: '' },
    ],
    breakdown: [
      { label: 'Down Payment', value: fmtD(Math.round(needed)), color: '#1E3A8A' },
      { label: 'Closing Costs', value: fmtD(Math.round(closingCosts)), color: '#CA8A04' },
      { label: 'Current Savings', value: fmtD(currentSavings), color: '#10B981' },
      ...(remaining > 0 ? [{ label: 'Gap', value: fmtD(Math.round(remaining)), color: '#DC2626' }] : []),
    ],
    chartData: ['coop', 'condo', 'house'].map((t, i) => ({
      name: t === 'coop' ? 'Co-op (20%)' : t === 'condo' ? 'Condo (10%)' : 'House (5%)',
      value: Math.round(targetPrice * (minDown[t] || 20) / 100),
      color: ['#1E3A8A', '#CA8A04', '#059669'][i],
    })),
    advice: `For a ${fmtD(targetPrice)} ${propertyType} in NYC, you need ${fmtD(Math.round(totalNeeded))} total (${fmtD(Math.round(needed))} down + ${fmtD(Math.round(closingCosts))} closing costs). ${propertyType === 'coop' ? 'Co-ops require 20% minimum and are strict — boards may reject lower offers.' : 'Condos accept as low as 10% down.'} ${remaining > 0 ? `At ${fmtD(monthlySavings)}/month savings, you need ${monthsToSave} more months.` : 'You have enough saved to proceed.'}`,
  }
}

// ============================================================================
// NY HOME EQUITY (#18)
// ============================================================================
function calcNYHomeEquity(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const homeValue = Number(input.homeValue || 600000)
  const mortgageBalance = Number(input.mortgageBalance || 350000)
  const loanType = String(input.loanType || 'heloc')

  const equity = homeValue - mortgageBalance
  const maxLTV = Number(sd.maxLTV || 80) / 100
  const maxBorrow = Math.max(0, homeValue * maxLTV - mortgageBalance)
  const mrtRate = Number(sd.mortgageTaxRateLow || 1.8) / 100
  const mrt = maxBorrow * mrtRate
  const netBorrow = maxBorrow - mrt

  return {
    primary: { value: Math.round(equity), label: 'Total Home Equity', unit: '$' },
    secondary: [
      { label: 'Borrowable (80% CLTV)', value: fmt(Math.round(maxBorrow)), unit: '$' },
      { label: 'Mortgage Recording Tax', value: fmt(Math.round(mrt)), unit: '$' },
      { label: 'Net After MRT', value: fmt(Math.round(netBorrow)), unit: '$' },
      { label: 'Current LTV', value: ((mortgageBalance / homeValue) * 100).toFixed(1), unit: '%' },
      { label: 'Equity %', value: ((equity / homeValue) * 100).toFixed(1), unit: '%' },
    ],
    breakdown: [
      { label: 'Equity', value: fmtD(Math.round(equity)), color: '#10B981' },
      { label: 'Mortgage Balance', value: fmtD(mortgageBalance), color: '#1E3A8A' },
      { label: 'Borrowable', value: fmtD(Math.round(maxBorrow)), color: '#CA8A04' },
    ],
    chartData: [
      { name: 'Equity', value: Math.round(equity), color: '#10B981' },
      { name: 'Mortgage', value: mortgageBalance, color: '#1E3A8A' },
    ],
    advice: `Your ${fmtD(homeValue)} home has ${fmtD(Math.round(equity))} in equity. You can borrow up to ${fmtD(Math.round(maxBorrow))} via ${loanType.toUpperCase()}, but NY's mortgage recording tax takes ${fmtD(Math.round(mrt))} (${(mrtRate * 100).toFixed(1)}%) — leaving ${fmtD(Math.round(netBorrow))} net. This is a NY-specific cost most other states don't have.`,
  }
}

// ============================================================================
// NY REFINANCE (#19)
// ============================================================================
function calcNYRefinance(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const balance = Number(input.currentBalance || 400000)
  const currentRate = Number(input.currentRate || 7.0)
  const newRate = Number(input.newRate || 6.0)
  const remainingYears = Number(input.remainingYears || 25)
  const isCEMA = String(input.isCEMA || 'yes') === 'yes'

  const currentPayment = calcMonthlyPayment(balance, currentRate, remainingYears * 12)
  const newPayment = calcMonthlyPayment(balance, newRate, 30 * 12)
  const monthlySavings = currentPayment - newPayment

  // Mortgage recording tax on refinance
  const mrtRate = Number(sd.mortgageTaxRateHigh || 1.925) / 100
  const fullMRT = balance * mrtRate
  // CEMA (Consolidation, Extension, Modification Agreement) — pay MRT only on new money
  const cemaMRT = isCEMA ? balance * 0.001 : fullMRT // nominal on CEMA
  const closingCosts = 3000 + cemaMRT
  const breakEven = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 0
  const totalSavings = monthlySavings * remainingYears * 12 - closingCosts

  return {
    primary: { value: Math.round(monthlySavings), label: 'Monthly Savings', unit: '$/mo' },
    secondary: [
      { label: 'Current Payment', value: fmt(Math.round(currentPayment)), unit: '$/mo' },
      { label: 'New Payment', value: fmt(Math.round(newPayment)), unit: '$/mo' },
      { label: 'MRT Cost', value: fmt(Math.round(cemaMRT)), unit: '$' },
      { label: 'Total Closing', value: fmt(Math.round(closingCosts)), unit: '$' },
      { label: 'Break-Even', value: `${breakEven} months`, unit: '' },
      { label: 'Lifetime Savings', value: fmt(Math.round(totalSavings)), unit: '$' },
      { label: 'CEMA', value: isCEMA ? 'Yes (saves MRT)' : 'No (full MRT)', unit: '' },
    ],
    breakdown: [
      { label: 'Monthly Savings', value: fmtD(Math.round(monthlySavings)), color: '#10B981' },
      { label: 'Closing Costs', value: fmtD(Math.round(closingCosts)), color: '#DC2626' },
      { label: 'Lifetime Savings', value: fmtD(Math.round(totalSavings)), color: '#1E3A8A' },
    ],
    chartData: [
      { name: 'Without CEMA', value: Math.round(fullMRT), color: '#DC2626' },
      { name: 'With CEMA', value: Math.round(balance * 0.001), color: '#10B981' },
    ],
    advice: `Refinancing from ${currentRate}% to ${newRate}% saves ${fmtD(Math.round(monthlySavings))}/month. ${isCEMA ? `Using a CEMA saves ${fmtD(Math.round(fullMRT - cemaMRT))} in mortgage recording tax — a NY-specific option that lets you avoid paying MRT on the existing loan balance.` : `Without a CEMA, you pay ${fmtD(Math.round(fullMRT))} in mortgage recording tax. Ask your lender about a CEMA to save most of this.`} Break-even in ${breakEven} months, lifetime savings: ${fmtD(Math.round(totalSavings))}.`,
  }
}

// ============================================================================
// NY ADU ROI (#20)
// ============================================================================
function calcNYAduROI(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const buildCost = Number(input.buildCost || Number(sd.avgADUCost || 200000))
  const monthlyRent = Number(input.expectedRent || 2000)
  const homeValue = Number(input.homeValue || 500000)
  const location = String(input.location || 'nyc')

  const annualRent = monthlyRent * 12
  const expenses = annualRent * 0.15 // vacancy + maintenance
  const netRent = annualRent - expenses

  // Value increase
  const valueIncrease = buildCost * 0.7
  const newHomeValue = homeValue + valueIncrease

  const paybackYears = buildCost / netRent
  const roi5Year = ((netRent * 5 + valueIncrease - buildCost) / buildCost) * 100
  const roi10Year = ((netRent * 10 + valueIncrease - buildCost) / buildCost) * 100
  const capRate = (netRent / buildCost) * 100

  return {
    primary: { value: Math.round(roi10Year * 10) / 10, label: '10-Year ROI', unit: '%' },
    secondary: [
      { label: 'Annual Net Rent', value: fmt(Math.round(netRent)), unit: '$' },
      { label: 'Payback Period', value: `${paybackYears.toFixed(1)} years`, unit: '' },
      { label: 'Cap Rate', value: capRate.toFixed(1), unit: '%' },
      { label: '5-Year ROI', value: `${roi5Year.toFixed(1)}%`, unit: '' },
      { label: 'Value Added', value: fmt(Math.round(valueIncrease)), unit: '$' },
      { label: 'New Home Value', value: fmt(Math.round(newHomeValue)), unit: '$' },
    ],
    breakdown: [
      { label: 'Build Cost', value: fmtD(buildCost), color: '#DC2626' },
      { label: 'Net Rent (10yr)', value: fmtD(Math.round(netRent * 10)), color: '#10B981' },
      { label: 'Value Added', value: fmtD(Math.round(valueIncrease)), color: '#1E3A8A' },
    ],
    chartData: [1, 2, 3, 5, 7, 10].map((y, i) => ({
      name: `Year ${y}`,
      value: Math.round(netRent * y + valueIncrease - buildCost),
      color: (netRent * y + valueIncrease - buildCost) >= 0 ? '#10B981' : '#DC2626',
    })),
    advice: `Building an ADU for ${fmtD(buildCost)} with ${fmtD(monthlyRent)}/mo rent yields ${roi10Year.toFixed(1)}% ROI over 10 years. NY's 2024 ADU law allows accessory dwelling units statewide. Payback in ${paybackYears.toFixed(1)} years. The ADU adds an estimated ${fmtD(Math.round(valueIncrease))} to your property value.`,
  }
}

// ============================================================================
// NY RENT STABILIZATION (#21)
// ============================================================================
function calcRentStabilization(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const currentRent = Number(input.currentRent || 1800)
  const leaseType = String(input.leaseType || '1year')
  const yearsProjection = Number(input.yearsProjection || 5)

  const rgb1Year = Number(sd.rgb1Year || 3.0) / 100
  const rgb2Year = Number(sd.rgb2Year || 2.75) / 100
  const marketIncrease = 0.05 // 5% market rate increase

  const isOneYear = leaseType === '1year'
  const rgbRate = isOneYear ? rgb1Year : rgb2Year
  const annualRGB = isOneYear ? rgb1Year : rgb2Year / 2 // annualized for 2-year

  let stabilizedRent = currentRent
  let marketRent = currentRent
  const projection: (string | number)[][] = []

  for (let y = 1; y <= yearsProjection; y++) {
    stabilizedRent *= (1 + annualRGB)
    marketRent *= (1 + marketIncrease)
    projection.push([`Year ${y}`, fmtD(Math.round(stabilizedRent)), fmtD(Math.round(marketRent)), fmtD(Math.round(marketRent - stabilizedRent))])
  }

  const totalSavings = projection.reduce((sum, row) => sum + (Number(String(row[2]).replace(/[$,]/g, '')) - Number(String(row[1]).replace(/[$,]/g, ''))) * 12, 0)

  return {
    primary: { value: Math.round(totalSavings), label: `${yearsProjection}-Year Savings vs Market`, unit: '$' },
    secondary: [
      { label: 'Current Rent', value: fmt(currentRent), unit: '$/mo' },
      { label: `Year ${yearsProjection} Stabilized`, value: fmt(Math.round(stabilizedRent)), unit: '$/mo' },
      { label: `Year ${yearsProjection} Market Rate`, value: fmt(Math.round(marketRent)), unit: '$/mo' },
      { label: 'RGB Increase', value: `${(rgbRate * 100).toFixed(1)}%`, unit: '' },
      { label: 'Market Increase', value: '5.0%', unit: '' },
      { label: 'Stabilized Units NYC', value: fmt(Number(sd.stabilizedUnits || 1000000)), unit: '' },
    ],
    breakdown: [
      { label: 'Stabilized Total', value: fmtD(Math.round(stabilizedRent * 12 * yearsProjection)), color: '#10B981' },
      { label: 'Market Total', value: fmtD(Math.round(marketRent * 12 * yearsProjection)), color: '#DC2626' },
      { label: 'Your Savings', value: fmtD(Math.round(totalSavings)), color: '#1E3A8A' },
    ],
    chartData: Array.from({ length: yearsProjection }, (_, i) => ({
      name: `Year ${i + 1}`,
      value: Math.round(currentRent * Math.pow(1 + marketIncrease, i + 1) - currentRent * Math.pow(1 + annualRGB, i + 1)) * 12,
      color: '#10B981',
    })),
    schedule: { headers: ['Year', 'Stabilized Rent', 'Market Rent', 'Monthly Savings'], rows: projection },
    advice: `Your rent-stabilized apartment saves an estimated ${fmtD(Math.round(totalSavings))} over ${yearsProjection} years vs market rates. The RGB set ${(rgbRate * 100).toFixed(1)}% increases for ${leaseType === '1year' ? '1-year' : '2-year'} leases, while market rents grow ~5%/year. Never give up a stabilized apartment voluntarily — the value compounds dramatically over time.`,
  }
}

// ============================================================================
// NY CO-OP FLIP TAX (#22)
// ============================================================================
function calcCoopFlipTax(input: CalculatorInput, sd: StateData): CalculatorOutput {
  const salePrice = Number(input.salePrice || 800000)
  const purchasePrice = Number(input.purchasePrice || 600000)
  const flipTaxType = String(input.flipTaxType || 'price')

  const priceRate = Number(sd.typicalFlipTaxRate || 2) / 100
  const profitRate = Number(sd.typicalProfitFlipRate || 10) / 100

  const profit = salePrice - purchasePrice
  const flipTax = flipTaxType === 'price' ? salePrice * priceRate : profit * profitRate
  const transferTax = salePrice * 0.004 + (salePrice >= 500000 ? salePrice * 0.01025 : 0)
  const brokerFee = salePrice * 0.06
  const totalCosts = flipTax + transferTax + brokerFee
  const netProceeds = salePrice - totalCosts

  return {
    primary: { value: Math.round(flipTax), label: 'Co-op Flip Tax', unit: '$' },
    secondary: [
      { label: 'Sale Price', value: fmt(salePrice), unit: '$' },
      { label: 'Profit', value: fmt(Math.round(profit)), unit: '$' },
      { label: 'Broker Fee (6%)', value: fmt(Math.round(brokerFee)), unit: '$' },
      { label: 'Transfer Tax', value: fmt(Math.round(transferTax)), unit: '$' },
      { label: 'Total Selling Costs', value: fmt(Math.round(totalCosts)), unit: '$' },
      { label: 'Net Proceeds', value: fmt(Math.round(netProceeds)), unit: '$' },
    ],
    breakdown: [
      { label: 'Flip Tax', value: fmtD(Math.round(flipTax)), color: '#CA8A04' },
      { label: 'Broker Fee', value: fmtD(Math.round(brokerFee)), color: '#1E3A8A' },
      { label: 'Transfer Tax', value: fmtD(Math.round(transferTax)), color: '#DC2626' },
      { label: 'Net Proceeds', value: fmtD(Math.round(netProceeds)), color: '#10B981' },
    ],
    chartData: [
      { name: 'Net Proceeds', value: Math.round(netProceeds), color: '#10B981' },
      { name: 'Flip Tax', value: Math.round(flipTax), color: '#CA8A04' },
      { name: 'Broker', value: Math.round(brokerFee), color: '#1E3A8A' },
      { name: 'Transfer Tax', value: Math.round(transferTax), color: '#DC2626' },
    ],
    advice: `The ${flipTaxType === 'price' ? `${(priceRate * 100)}% of sale price` : `${(profitRate * 100)}% of profit`} flip tax on your ${fmtD(salePrice)} sale is ${fmtD(Math.round(flipTax))}. Combined with broker fees and transfer taxes, total selling costs are ${fmtD(Math.round(totalCosts))} (${((totalCosts / salePrice) * 100).toFixed(1)}% of sale price). Flip tax is typically paid by the seller and varies by building — check your proprietary lease for exact terms.`,
  }
}

// ============================================================================
// MAIN ROUTER
// ============================================================================
export function calculateStateHousing(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!housingBaseTypes.includes(baseType)) return null

  // Custom calculation handlers
  const customCalc = stateData.customCalc as string | undefined
  switch (customCalc) {
    case 'ny-mortgage-recording-tax': return calcMortgageRecordingTax(input, stateData)
    case 'ny-rent-vs-buy': return calcNYRentVsBuy(input, stateData)
    case 'ny-mansion-tax': return calcMansionTax(input, stateData)
    case 'ny-star-exemption': return calcSTARExemption(input, stateData)
    case 'ny-coop-affordability': return calcCoopAffordability(input, stateData)
    case 'ny-40x-rent-rule': return calc40xRentRule(input, stateData)
    case 'ny-down-payment': return calcNYDownPayment(input, stateData)
    case 'ny-home-equity': return calcNYHomeEquity(input, stateData)
    case 'ny-refinance': return calcNYRefinance(input, stateData)
    case 'ny-adu-roi': return calcNYAduROI(input, stateData)
    case 'ny-rent-stabilization': return calcRentStabilization(input, stateData)
    case 'ny-coop-flip-tax': return calcCoopFlipTax(input, stateData)
  }

  // Generic fallback calculations
  switch (baseType) {
    case 'mortgage': {
      const homePrice = Number(input.homePrice || 350000)
      const downPct = Number(input.downPayment || 20) / 100
      const loanAmount = homePrice * (1 - downPct)
      const months = Number(input.loanTerm || 30) * 12
      const monthlyPI = calcMonthlyPayment(loanAmount, Number(input.interestRate || 6.5), months)
      const propertyTaxRate = Number(stateData.avgPropertyTaxRate || 1) / 100
      const monthlyTax = String(input.includePropertyTax) !== 'no' ? (homePrice * propertyTaxRate) / 12 : 0
      const monthlyInsurance = homePrice * 0.004 / 12
      const pmi = downPct < 0.2 ? loanAmount * 0.005 / 12 : 0
      const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + pmi
      return {
        primary: { value: Math.round(totalMonthly), label: 'Total Monthly Payment', unit: '$/mo' },
        secondary: [
          { label: 'Principal & Interest', value: Math.round(monthlyPI), unit: '$/mo' },
          { label: 'Property Tax', value: Math.round(monthlyTax), unit: '$/mo' },
          { label: 'Insurance', value: Math.round(monthlyInsurance), unit: '$/mo' },
          ...(pmi > 0 ? [{ label: 'PMI', value: Math.round(pmi), unit: '$/mo' }] : []),
          { label: 'Down Payment', value: Math.round(homePrice * downPct), unit: '$' },
          { label: 'Total Interest', value: Math.round(monthlyPI * months - loanAmount), unit: '$' },
        ],
      }
    }
    case 'rent-vs-buy': {
      const homePrice = Number(input.homePrice || 350000)
      const rent = Number(input.monthlyRent || 1500)
      const downPct = Number(input.downPayment || 20) / 100
      const years = Number(input.yearsToStay || 7)
      const appreciation = Number(input.appreciation || 3) / 100
      const loanAmount = homePrice * (1 - downPct)
      const monthlyMortgage = calcMonthlyPayment(loanAmount, Number(stateData.avgMortgageRate || 6.5), 360)
      const propertyTaxRate = Number(stateData.avgPropertyTaxRate || 1) / 100
      const monthlyOwnership = monthlyMortgage + (homePrice * propertyTaxRate / 12) + (homePrice * 0.004 / 12)
      const totalRent = rent * years * 12 * (1 + 0.03 * years / 2)
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
      }
    }
    case 'closing-costs': {
      const homePrice = Number(input.homePrice || 350000)
      const isBuyer = String(input.transactionType) !== 'seller'
      const closingRate = Number(stateData.avgClosingCostRate || (isBuyer ? 3 : 8)) / 100
      const closingCosts = homePrice * closingRate
      return {
        primary: { value: Math.round(closingCosts), label: `${isBuyer ? 'Buyer' : 'Seller'} Closing Costs`, unit: '$' },
        secondary: [
          { label: 'Closing Rate', value: (closingRate * 100).toFixed(1), unit: '%' },
        ],
      }
    }
    case 'homestead-exemption': {
      const homeValue = Number(input.homeValue || 350000)
      const taxRate = Number(input.taxRate || stateData.avgPropertyTaxRate || 1) / 100
      const isPrimary = String(input.isPrimary) !== 'no'
      const exemption = isPrimary ? Number(stateData.homesteadExemption || 0) : 0
      const taxWithout = homeValue * taxRate
      const taxWith = Math.max(0, homeValue - exemption) * taxRate
      return {
        primary: { value: Math.round(taxWithout - taxWith), label: 'Annual Tax Savings', unit: '$' },
        secondary: [
          { label: 'Homestead Exemption', value: fmt(exemption), unit: '$' },
          { label: 'Tax Without', value: Math.round(taxWithout), unit: '$' },
          { label: 'Tax With', value: Math.round(taxWith), unit: '$' },
        ],
      }
    }
    case 'home-affordability': {
      const income = Number(input.annualIncome || 75000)
      const debts = Number(input.monthlyDebts || 500)
      const down = Number(input.downPaymentSaved || 50000)
      const r = Number(input.interestRate || 6.5) / 100 / 12
      const maxHousing = (income / 12) * 0.28
      const maxPayment = Math.min(maxHousing, (income / 12) * 0.36 - debts)
      const maxLoan = r > 0 ? maxPayment * (Math.pow(1 + r, 360) - 1) / (r * Math.pow(1 + r, 360)) : maxPayment * 360
      return {
        primary: { value: Math.round(maxLoan + down), label: 'Max Home Price', unit: '$' },
        secondary: [
          { label: 'Max Monthly Payment', value: Math.round(maxPayment), unit: '$' },
          { label: 'Max Loan', value: Math.round(maxLoan), unit: '$' },
        ],
      }
    }
    case 'rent-affordability': {
      const monthlyIncome = Number(input.monthlyIncome || 5000)
      const pct = Number(input.percentRule || 30) / 100
      const maxRent = monthlyIncome * pct
      return {
        primary: { value: Math.round(maxRent), label: 'Max Affordable Rent', unit: '$/mo' },
        secondary: [{ label: 'Annual Budget', value: Math.round(maxRent * 12), unit: '$' }],
      }
    }
    case 'down-payment': {
      const price = Number(input.homePrice || 350000)
      const pct = Number(input.targetPercent || 20) / 100
      const needed = price * pct
      const current = Number(input.currentSavings || 10000)
      const monthly = Number(input.monthlySavings || 1000)
      const remaining = Math.max(0, needed - current)
      return {
        primary: { value: Math.round(needed), label: 'Down Payment Needed', unit: '$' },
        secondary: [
          { label: 'Still Needed', value: Math.round(remaining), unit: '$' },
          { label: 'Months to Save', value: monthly > 0 ? Math.ceil(remaining / monthly) : 0, unit: 'months' },
        ],
      }
    }
    case 'home-equity': {
      const hv = Number(input.homeValue || 350000)
      const bal = Number(input.mortgageBalance || 250000)
      const eq = hv - bal
      return {
        primary: { value: Math.round(eq), label: 'Total Home Equity', unit: '$' },
        secondary: [
          { label: 'Borrowable', value: Math.round(Math.max(0, hv * 0.8 - bal)), unit: '$' },
          { label: 'LTV', value: ((bal / hv) * 100).toFixed(1), unit: '%' },
        ],
      }
    }
    case 'refinance': {
      const bal = Number(input.currentBalance || 250000)
      const cr = Number(input.currentRate || 7.0)
      const nr = Number(input.newRate || 6.5)
      const yrs = Number(input.remainingYears || 25)
      const cc = Number(input.closingCosts || 5000)
      const cp = calcMonthlyPayment(bal, cr, yrs * 12)
      const np = calcMonthlyPayment(bal, nr, yrs * 12)
      const ms = cp - np
      return {
        primary: { value: Math.round(ms), label: 'Monthly Savings', unit: '$/mo' },
        secondary: [
          { label: 'Break-Even', value: ms > 0 ? `${Math.ceil(cc / ms)} months` : 'Never', unit: '' },
          { label: 'Total Savings', value: Math.round(ms * yrs * 12 - cc), unit: '$' },
        ],
      }
    }
    case 'adu-roi': {
      const cost = Number(input.buildCost || 150000)
      const rent = Number(input.monthlyRent || 1500)
      const valInc = Number(input.propertyValueIncrease || 10) / 100
      const hv = Number(input.homeValue || 350000)
      const annual = rent * 12
      const roi = ((annual * 10 + hv * valInc - cost) / cost) * 100
      return {
        primary: { value: Math.round(roi * 10) / 10, label: '10-Year ROI', unit: '%' },
        secondary: [
          { label: 'Annual Income', value: Math.round(annual), unit: '$' },
          { label: 'Payback', value: (cost / annual).toFixed(1), unit: 'years' },
        ],
      }
    }
    default:
      return { primary: { value: Number(input.homePrice || 0), label: `${baseType} Result`, unit: '$' } }
  }
}
