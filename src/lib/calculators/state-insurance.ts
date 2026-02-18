// State insurance calculations — health, auto, homeowners, flood, renters, life
import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

const insuranceBaseTypes = [
  'health-insurance', 'auto-insurance', 'homeowners-insurance',
  'flood-insurance', 'renters-insurance', 'life-insurance',
]

export function getStateInsuranceFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  if (!insuranceBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'health-insurance':
      return [
        { name: 'age', label: 'Your Age', type: 'number', default: 35, min: 18, max: 64 },
        { name: 'planType', label: 'Plan Tier', type: 'select', options: [
          { value: 'bronze', label: 'Bronze (60/40)' },
          { value: 'silver', label: 'Silver (70/30)' },
          { value: 'gold', label: 'Gold (80/20)' },
          { value: 'platinum', label: 'Platinum (90/10)' },
        ], default: 'silver' },
        { name: 'householdSize', label: 'Household Size', type: 'select', options: [
          { value: '1', label: 'Individual' },
          { value: '2', label: 'Couple' },
          { value: '3', label: 'Family (3)' },
          { value: '4', label: 'Family (4+)' },
        ], default: '1' },
        { name: 'smoker', label: 'Tobacco User?', type: 'select', options: [
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes' },
        ], default: 'no' },
      ]

    case 'auto-insurance':
      return [
        { name: 'age', label: 'Driver Age', type: 'number', default: 30, min: 16, max: 100 },
        { name: 'coverage', label: 'Coverage Type', type: 'select', options: [
          { value: 'minimum', label: 'State Minimum' },
          { value: 'standard', label: 'Standard' },
          { value: 'full', label: 'Full Coverage' },
        ], default: 'standard' },
        { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: [
          { value: 'sedan', label: 'Sedan' },
          { value: 'suv', label: 'SUV/Truck' },
          { value: 'sports', label: 'Sports Car' },
          { value: 'economy', label: 'Economy' },
        ], default: 'sedan' },
        { name: 'drivingRecord', label: 'Driving Record', type: 'select', options: [
          { value: 'clean', label: 'Clean' },
          { value: 'minor', label: '1-2 Minor Incidents' },
          { value: 'major', label: 'Major Incident/DUI' },
        ], default: 'clean' },
      ]

    case 'homeowners-insurance':
      return [
        { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 300000, min: 0 },
        { name: 'deductible', label: 'Deductible ($)', type: 'select', options: [
          { value: '500', label: '$500' },
          { value: '1000', label: '$1,000' },
          { value: '2500', label: '$2,500' },
          { value: '5000', label: '$5,000' },
        ], default: '1000' },
        { name: 'homeAge', label: 'Home Age (years)', type: 'number', default: 20, min: 0, max: 150 },
      ]

    case 'flood-insurance':
      return [
        { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 300000, min: 0 },
        { name: 'floodZone', label: 'Flood Zone', type: 'select', options: [
          { value: 'low', label: 'Low Risk (Zone X)' },
          { value: 'moderate', label: 'Moderate Risk (Zone B)' },
          { value: 'high', label: 'High Risk (Zone A)' },
          { value: 'coastal', label: 'Coastal High Risk (Zone V)' },
        ], default: 'low' },
        { name: 'elevation', label: 'Below Base Flood Elevation?', type: 'select', options: [
          { value: 'no', label: 'No / At or Above' },
          { value: 'yes', label: 'Yes / Below' },
        ], default: 'no' },
      ]

    case 'renters-insurance':
      return [
        { name: 'personalProperty', label: 'Personal Property Value ($)', type: 'number', default: 25000, min: 0 },
        { name: 'liability', label: 'Liability Coverage ($)', type: 'select', options: [
          { value: '100000', label: '$100,000' },
          { value: '300000', label: '$300,000' },
          { value: '500000', label: '$500,000' },
        ], default: '100000' },
        { name: 'deductible', label: 'Deductible ($)', type: 'select', options: [
          { value: '250', label: '$250' },
          { value: '500', label: '$500' },
          { value: '1000', label: '$1,000' },
        ], default: '500' },
      ]

    case 'life-insurance':
      return [
        { name: 'age', label: 'Your Age', type: 'number', default: 35, min: 18, max: 80 },
        { name: 'coverageAmount', label: 'Coverage Amount ($)', type: 'select', options: [
          { value: '250000', label: '$250,000' },
          { value: '500000', label: '$500,000' },
          { value: '1000000', label: '$1,000,000' },
          { value: '2000000', label: '$2,000,000' },
        ], default: '500000' },
        { name: 'termLength', label: 'Term Length', type: 'select', options: [
          { value: '10', label: '10 Years' },
          { value: '20', label: '20 Years' },
          { value: '30', label: '30 Years' },
        ], default: '20' },
        { name: 'health', label: 'Health Status', type: 'select', options: [
          { value: 'excellent', label: 'Excellent' },
          { value: 'good', label: 'Good' },
          { value: 'average', label: 'Average' },
          { value: 'below', label: 'Below Average' },
        ], default: 'good' },
      ]

    default:
      return [
        { name: 'coverageAmount', label: 'Coverage Amount ($)', type: 'number', default: 100000, min: 0 },
      ]
  }
}

// ═══════════════════════════════════════════════════════════════════
// NY INSURANCE — Custom calculation functions
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

/** #46 Health Insurance NYC — Essential Plan, NY State of Health Marketplace */
function calcNYHealthInsurance(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const age = Number(input.age || 35)
  const planType = String(input.planType || 'silver')
  const householdSize = Number(input.householdSize || 1)
  const income = Number(input.income || 50000)
  const smoker = String(input.smoker || 'no') === 'yes'

  // NY ACA base premiums (2024, second-lowest Silver benchmark — NYC region)
  const ageBands: Record<string, number> = {
    '21': 450, '25': 465, '30': 520, '35': 580, '40': 650, '45': 740,
    '50': 880, '55': 1050, '60': 1300, '64': 1400,
  }
  const ageKey = String(Math.min(64, Math.max(21, Math.floor(age / 5) * 5)))
  const baseMonthly = ageBands[ageKey] || 580

  // Plan type actuarial values
  const planMult: Record<string, number> = {
    bronze: 0.75, silver: 1.0, gold: 1.2, platinum: 1.45,
  }
  const planMonthly = baseMonthly * (planMult[planType] || 1.0)

  // Household size multiplier
  const hhMult: Record<number, number> = { 1: 1.0, 2: 2.0, 3: 2.85, 4: 3.4 }
  const totalMonthly = planMonthly * (hhMult[householdSize] || 1.0)

  // NY does NOT allow tobacco rating (one of few states)
  const smokerNote = smoker ? 'NY law prohibits tobacco surcharges — no extra cost.' : ''

  // Federal Premium Tax Credit (ACA subsidy) — based on FPL
  const fpl2024: Record<number, number> = { 1: 15060, 2: 20440, 3: 25820, 4: 31200 }
  const fplThreshold = fpl2024[householdSize] || 15060
  const fplPercent = (income / fplThreshold) * 100

  // NY Essential Plan: <250% FPL → $0-$15/mo comprehensive coverage
  const essentialPlanEligible = fplPercent <= 250
  const essentialPlanCost = fplPercent <= 150 ? 0 : fplPercent <= 200 ? 1 : 15

  // Subsidy calculation (simplified ACA benchmark)
  let subsidy = 0
  if (fplPercent <= 150) subsidy = totalMonthly * 0.95
  else if (fplPercent <= 200) subsidy = totalMonthly * 0.80
  else if (fplPercent <= 250) subsidy = totalMonthly * 0.65
  else if (fplPercent <= 300) subsidy = totalMonthly * 0.45
  else if (fplPercent <= 400) subsidy = totalMonthly * 0.25
  else subsidy = 0

  const afterSubsidy = Math.max(0, totalMonthly - subsidy)
  const annualCost = afterSubsidy * 12
  const annualFull = totalMonthly * 12

  // Deductibles and OOP max by plan tier
  const deductibles: Record<string, number> = { bronze: 7500, silver: 4500, gold: 1500, platinum: 0 }
  const oopMax: Record<string, number> = { bronze: 9100, silver: 8700, gold: 8700, platinum: 4500 }
  const deductible = deductibles[planType] || 4500
  const oop = oopMax[planType] || 8700

  const planNames: Record<string, string> = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' }

  return {
    primary: { value: Math.round(afterSubsidy), label: 'Monthly Premium (After Subsidy)', unit: '$/mo' },
    secondary: [
      { label: 'Full Monthly Premium', value: fmt(Math.round(totalMonthly)), unit: '' },
      { label: 'Monthly Subsidy', value: fmt(Math.round(subsidy)), unit: '' },
      { label: 'Annual Cost', value: fmt(Math.round(annualCost)), unit: '' },
      { label: 'Deductible', value: fmt(deductible), unit: '' },
      { label: 'Out-of-Pocket Max', value: fmt(oop), unit: '' },
      { label: 'FPL %', value: `${fplPercent.toFixed(0)}%`, unit: '' },
      { label: 'Essential Plan?', value: essentialPlanEligible ? `Yes — ${fmt(essentialPlanCost)}/mo` : 'No', unit: '' },
    ],
    breakdown: [
      { label: 'Your Premium', value: Math.round(annualCost), color: '#1E3A8A' },
      { label: 'Subsidy Covers', value: Math.round(subsidy * 12), color: '#059669' },
      { label: 'Deductible Risk', value: deductible, color: '#CA8A04' },
    ],
    chartData: [
      { name: 'Bronze', value: Math.round(baseMonthly * 0.75 * (hhMult[householdSize] || 1)) },
      { name: 'Silver', value: Math.round(baseMonthly * 1.0 * (hhMult[householdSize] || 1)) },
      { name: 'Gold', value: Math.round(baseMonthly * 1.2 * (hhMult[householdSize] || 1)) },
      { name: 'Platinum', value: Math.round(baseMonthly * 1.45 * (hhMult[householdSize] || 1)) },
    ],
    schedule: {
      headers: ['Plan', 'Monthly', 'Deductible', 'OOP Max', 'Actuarial Value'],
      rows: [
        ['Bronze', fmt(Math.round(baseMonthly * 0.75)), '$7,500', '$9,100', '60%'],
        ['Silver', fmt(Math.round(baseMonthly * 1.0)), '$4,500', '$8,700', '70%'],
        ['Gold', fmt(Math.round(baseMonthly * 1.2)), '$1,500', '$8,700', '80%'],
        ['Platinum', fmt(Math.round(baseMonthly * 1.45)), '$0', '$4,500', '90%'],
        ...(essentialPlanEligible ? [['Essential Plan', `${fmt(essentialPlanCost)}/mo`, '$0', '$200', '~95%']] : []),
      ],
    },
    advice: essentialPlanEligible
      ? `At ${fplPercent.toFixed(0)}% FPL, you qualify for NY's Essential Plan at just ${fmt(essentialPlanCost)}/month — far better than any ACA plan. This covers medical, dental, vision, and prescriptions with no deductible. ${smokerNote}`
      : `Your ${planNames[planType]} plan costs ${fmt(Math.round(afterSubsidy))}/month after ${fmt(Math.round(subsidy))}/month in subsidies. NY bans tobacco surcharges and has guaranteed issue — no pre-existing condition exclusions. Consider Gold if you use healthcare frequently; the higher premium saves on deductibles.`,
  }
}

/** #29 Auto Insurance NYC — highest premiums by borough */
function calcNYAutoInsurance(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const borough = String(input.borough || 'manhattan')
  const driverAge = Number(input.driverAge || 30)
  const coverage = String(input.coverage || 'full')
  const drivingRecord = String(input.drivingRecord || 'clean')
  const vehicleType = String(input.vehicleType || 'sedan')

  // NYC base premiums by borough (2024 averages — NYC is #1 or #2 most expensive in US)
  const boroughBase: Record<string, number> = {
    manhattan: 3200, brooklyn: 3800, queens: 3100, bronx: 4200, staten_island: 2600,
    nassau: 2200, westchester: 2100, suffolk: 2000,
  }
  const basePremium = boroughBase[borough] || 3200

  // Coverage multiplier
  const coverageMult: Record<string, number> = {
    minimum: 0.55, // 25/50/25 NY minimum
    standard: 0.85, // 100/300/100
    full: 1.0, // full coverage + comprehensive + collision
    premium: 1.3, // full + low deductibles + extras
  }
  const covMult = coverageMult[coverage] || 1.0

  // Age factor: under 25 = +60%, 25-65 = base, 65+ = +15%
  const ageMult = driverAge < 21 ? 2.0 : driverAge < 25 ? 1.6 : driverAge < 65 ? 1.0 : 1.15

  // Driving record
  const recordMult: Record<string, number> = {
    clean: 1.0, minor: 1.35, accident: 1.6, dui: 2.2,
  }
  const recMult = recordMult[drivingRecord] || 1.0

  // Vehicle type
  const vehMult: Record<string, number> = {
    economy: 0.8, sedan: 1.0, suv: 1.15, luxury: 1.45, sports: 1.55,
  }
  const vMult = vehMult[vehicleType] || 1.0

  const annualPremium = basePremium * covMult * ageMult * recMult * vMult
  const monthlyPremium = annualPremium / 12
  const sixMonth = annualPremium / 2

  // NY minimum requirements
  const nyMinimums = '25/50/25 (Bodily Injury $25K/$50K, Property $25K)'
  const noPIPRequirement = 'No-Fault PIP required ($50K minimum)'

  // State average comparison
  const stateAvg = 2800
  const vsAvg = ((annualPremium / stateAvg) - 1) * 100

  // Savings tips
  const multiPolicyDiscount = annualPremium * 0.15
  const goodDriverDiscount = drivingRecord === 'clean' ? annualPremium * 0.10 : 0
  const defensiveDriving = annualPremium * 0.10 // NY mandates 10% discount for approved course

  return {
    primary: { value: Math.round(annualPremium), label: 'Annual Premium Estimate', unit: '$/yr' },
    secondary: [
      { label: 'Monthly', value: fmt(monthlyPremium), unit: '' },
      { label: '6-Month', value: fmt(sixMonth), unit: '' },
      { label: 'Borough', value: borough.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()), unit: '' },
      { label: 'vs NY Average', value: `${vsAvg >= 0 ? '+' : ''}${vsAvg.toFixed(0)}%`, unit: '' },
      { label: 'NY Minimum', value: nyMinimums, unit: '' },
      { label: 'No-Fault PIP', value: noPIPRequirement, unit: '' },
    ],
    breakdown: [
      { label: 'Base Premium', value: basePremium, color: '#1E3A8A' },
      { label: 'Age Factor', value: Math.round(basePremium * (ageMult - 1)), color: '#CA8A04' },
      { label: 'Record Factor', value: Math.round(basePremium * (recMult - 1)), color: '#DC2626' },
      { label: 'Vehicle Factor', value: Math.round(basePremium * (vMult - 1)), color: '#7C3AED' },
      { label: 'Coverage Level', value: Math.round(basePremium * Math.abs(covMult - 1)), color: '#059669' },
    ],
    chartData: Object.entries(boroughBase).map(([b, rate]) => ({
      name: b.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: Math.round(rate * covMult),
    })),
    schedule: {
      headers: ['Discount Type', 'Potential Savings', 'Requirements'],
      rows: [
        ['Defensive Driving (NY mandated)', fmt(defensiveDriving), 'Complete approved 6-hr course'],
        ['Multi-Policy Bundle', fmt(multiPolicyDiscount), 'Bundle home/renters + auto'],
        ['Good Driver', fmt(goodDriverDiscount), '3+ years clean record'],
        ['Pay in Full', fmt(annualPremium * 0.05), 'Pay 6-mo or annual upfront'],
        ['Low Mileage', fmt(annualPremium * 0.08), 'Drive < 7,500 mi/year'],
      ],
    },
    advice: borough === 'bronx' || borough === 'brooklyn'
      ? `${borough === 'bronx' ? 'The Bronx' : 'Brooklyn'} has the highest auto insurance rates in NYC due to accident frequency and theft rates. A defensive driving course saves 10% (NY Insurance Law Section 2336).`
      : `NYC auto insurance is ${vsAvg > 0 ? Math.round(vsAvg) + '% above' : 'near'} the state average. Take a NY-approved defensive driving course for a guaranteed 10% discount — it's state law.`,
  }
}

export function calculateStateInsurance(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!insuranceBaseTypes.includes(baseType)) return null

  // Custom calculation handlers (NY insurance)
  const customCalc = stateData.customCalc as string | undefined
  switch (customCalc) {
    case 'ny-auto-insurance': return calcNYAutoInsurance(input, stateData)
    case 'ny-health-insurance': return calcNYHealthInsurance(input, stateData)
  }

  switch (baseType) {
    case 'health-insurance': {
      const age = Number(input.age || 35)
      const plan = String(input.planType || 'silver')
      const household = Number(input.householdSize || 1)
      const isSmoker = String(input.smoker) === 'yes'

      const baseRate = Number(stateData.avgHealthPremium || 450)

      // Age factor: younger = cheaper
      const ageFactor = age < 25 ? 0.7 : age < 35 ? 0.85 : age < 45 ? 1.0 : age < 55 ? 1.3 : 1.6
      // Plan factor
      const planFactor = plan === 'bronze' ? 0.75 : plan === 'gold' ? 1.25 : plan === 'platinum' ? 1.5 : 1.0
      // Household factor
      const householdFactor = household <= 1 ? 1.0 : household === 2 ? 1.8 : household === 3 ? 2.3 : 2.8
      // Smoker surcharge (up to 50% per ACA)
      const smokerFactor = isSmoker ? 1.5 : 1.0

      const monthlyPremium = baseRate * ageFactor * planFactor * householdFactor * smokerFactor
      const annualPremium = monthlyPremium * 12

      // Deductible/OOP estimates by plan
      const deductibles: Record<string, number> = { bronze: 7000, silver: 4500, gold: 1500, platinum: 500 }
      const oopMax: Record<string, number> = { bronze: 9100, silver: 8700, gold: 6000, platinum: 3000 }

      return {
        primary: { value: Math.round(monthlyPremium), label: 'Monthly Premium', unit: '$/mo' },
        secondary: [
          { label: 'Annual Premium', value: Math.round(annualPremium), unit: '$' },
          { label: 'Deductible', value: deductibles[plan] || 4500, unit: '$' },
          { label: 'Max Out-of-Pocket', value: oopMax[plan] || 8700, unit: '$' },
          { label: 'State Average', value: Math.round(baseRate), unit: '$/mo' },
        ],
      }
    }

    case 'auto-insurance': {
      const age = Number(input.age || 30)
      const coverage = String(input.coverage || 'standard')
      const vehicle = String(input.vehicleType || 'sedan')
      const record = String(input.drivingRecord || 'clean')

      const avgPremium = Number(stateData.avgAutoInsurance || 1500)

      // Coverage multiplier
      const coverageMultiplier = coverage === 'minimum' ? 0.6 : coverage === 'full' ? 1.4 : 1.0
      // Age factor: young and old drivers pay more
      const ageFactor = age < 21 ? 1.8 : age < 25 ? 1.4 : age < 65 ? 1.0 : 1.2
      // Vehicle factor
      const vehicleMultiplier = vehicle === 'sports' ? 1.3 : vehicle === 'suv' ? 1.1 : vehicle === 'economy' ? 0.85 : 1.0
      // Record factor
      const recordMultiplier = record === 'major' ? 1.8 : record === 'minor' ? 1.3 : 1.0

      const estimated = avgPremium * coverageMultiplier * ageFactor * vehicleMultiplier * recordMultiplier

      return {
        primary: { value: Math.round(estimated), label: 'Estimated Annual Premium', unit: '$/yr' },
        secondary: [
          { label: 'Monthly Cost', value: Math.round(estimated / 12), unit: '$' },
          { label: 'State Average', value: Math.round(avgPremium), unit: '$/yr' },
          { label: '6-Month Premium', value: Math.round(estimated / 2), unit: '$' },
          { label: 'vs State Average', value: `${estimated > avgPremium ? '+' : ''}${Math.round((estimated / avgPremium - 1) * 100)}%`, unit: '' },
        ],
      }
    }

    case 'homeowners-insurance': {
      const homeValue = Number(input.homeValue || 300000)
      const deductible = Number(input.deductible || 1000)
      const homeAge = Number(input.homeAge || 20)

      const avgRate = Number(stateData.avgHomeInsuranceRate || 0.5) / 100
      // Deductible discount: higher deductible = lower premium
      const deductibleFactor = deductible >= 5000 ? 0.75 : deductible >= 2500 ? 0.85 : deductible >= 1000 ? 1.0 : 1.1
      // Older homes cost more to insure
      const ageFactor = homeAge > 50 ? 1.3 : homeAge > 30 ? 1.15 : homeAge > 15 ? 1.0 : 0.9

      const annual = homeValue * avgRate * deductibleFactor * ageFactor
      const dwellingCoverage = homeValue * 0.8 // Typically 80% of value

      return {
        primary: { value: Math.round(annual), label: 'Annual Premium', unit: '$/yr' },
        secondary: [
          { label: 'Monthly Cost', value: Math.round(annual / 12), unit: '$' },
          { label: 'Dwelling Coverage', value: Math.round(dwellingCoverage), unit: '$' },
          { label: 'Deductible', value: deductible, unit: '$' },
          { label: 'Cost per $1k Value', value: (annual / homeValue * 1000).toFixed(2), unit: '$' },
        ],
      }
    }

    case 'flood-insurance': {
      const homeValue = Number(input.homeValue || 300000)
      const zone = String(input.floodZone || 'low')
      const belowBFE = String(input.elevation) === 'yes'

      // NFIP rates by zone
      const zoneRates: Record<string, number> = {
        low: 0.15,
        moderate: 0.5,
        high: 1.2,
        coastal: 2.5,
      }
      const baseRate = (zoneRates[zone] || 0.15) / 100
      const elevationFactor = belowBFE ? 2.0 : 1.0
      const coverageAmount = Math.min(homeValue, 250000) // NFIP max $250k dwelling

      const annual = coverageAmount * baseRate * elevationFactor
      const contentsCoverage = Math.min(homeValue * 0.3, 100000) // NFIP max $100k contents

      return {
        primary: { value: Math.round(annual), label: 'Annual Flood Premium', unit: '$/yr' },
        secondary: [
          { label: 'Monthly Cost', value: Math.round(annual / 12), unit: '$' },
          { label: 'Dwelling Coverage', value: Math.round(coverageAmount), unit: '$' },
          { label: 'Contents Coverage', value: Math.round(contentsCoverage), unit: '$' },
          { label: 'Flood Zone', value: zone.toUpperCase(), unit: '' },
        ],
        advice: zone === 'high' || zone === 'coastal'
          ? 'You are in a high-risk flood zone. Flood insurance is typically required by mortgage lenders.'
          : 'Even in lower-risk zones, 25% of flood claims come from outside high-risk areas.',
      }
    }

    case 'renters-insurance': {
      const property = Number(input.personalProperty || 25000)
      const liability = Number(input.liability || 100000)
      const deductible = Number(input.deductible || 500)

      const avgRate = Number(stateData.avgRentersInsurance || 15) // monthly
      const propertyFactor = property / 25000 // base is $25k
      const liabilityFactor = liability > 300000 ? 1.2 : liability > 100000 ? 1.1 : 1.0
      const deductibleFactor = deductible >= 1000 ? 0.85 : deductible <= 250 ? 1.15 : 1.0

      const monthly = avgRate * propertyFactor * liabilityFactor * deductibleFactor
      const annual = monthly * 12

      return {
        primary: { value: Math.round(monthly), label: 'Monthly Premium', unit: '$/mo' },
        secondary: [
          { label: 'Annual Cost', value: Math.round(annual), unit: '$' },
          { label: 'Personal Property Coverage', value: property.toLocaleString(), unit: '$' },
          { label: 'Liability Coverage', value: liability.toLocaleString(), unit: '$' },
          { label: 'Daily Cost', value: (annual / 365).toFixed(2), unit: '$' },
        ],
      }
    }

    case 'life-insurance': {
      const age = Number(input.age || 35)
      const coverage = Number(input.coverageAmount || 500000)
      const term = Number(input.termLength || 20)
      const health = String(input.health || 'good')

      // Base rate per $1000 of coverage per month
      const baseRatePer1k = age < 25 ? 0.08 : age < 35 ? 0.12 : age < 45 ? 0.20 : age < 55 ? 0.40 : age < 65 ? 0.80 : 1.50

      // Health factor
      const healthFactor = health === 'excellent' ? 0.7 : health === 'good' ? 1.0 : health === 'average' ? 1.4 : 2.0
      // Term factor: longer term = slightly higher per-month
      const termFactor = term === 10 ? 0.9 : term === 30 ? 1.15 : 1.0

      const monthlyPremium = (coverage / 1000) * baseRatePer1k * healthFactor * termFactor
      const totalPremiums = monthlyPremium * term * 12
      const coveragePerDollar = coverage / totalPremiums

      return {
        primary: { value: Math.round(monthlyPremium), label: 'Monthly Premium', unit: '$/mo' },
        secondary: [
          { label: 'Annual Premium', value: Math.round(monthlyPremium * 12), unit: '$' },
          { label: 'Coverage Amount', value: coverage.toLocaleString(), unit: '$' },
          { label: 'Total Premiums', value: Math.round(totalPremiums), unit: '$' },
          { label: 'Coverage per $1 Paid', value: `$${coveragePerDollar.toFixed(0)}`, unit: '' },
          { label: 'Term Length', value: term, unit: 'years' },
        ],
      }
    }

    default:
      return {
        primary: { value: 0, label: `${baseType} Estimate`, unit: '$' },
        advice: 'Calculator under development.',
      }
  }
}
