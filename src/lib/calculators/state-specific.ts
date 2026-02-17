// State-specific calculations — unique per state (earthquake, tornado, hurricane, cannabis, etc.)
// This module handles calculator types unique to specific states or regions
import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

// Known state-specific base types
const stateSpecificBaseTypes = [
  'earthquake-insurance', 'hurricane-preparedness', 'tornado-risk',
  'wildfire-risk', 'cannabis-tax', 'ski-pass', 'beach-vacation',
  'fishing-license', 'hunting-license', 'snowbird-savings',
  'solar-panel-roi', 'ev-savings', 'toll-cost', 'commute-cost',
  'lottery-tax', 'alimony', 'child-support', 'divorce-cost',
]

export function getStateSpecificFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  // Handle known specific types
  if (stateSpecificBaseTypes.includes(baseType)) {
    return getKnownFields(baseType, stateData)
  }

  // Catch-all: if stateData exists, return fields from JSON config
  if (!stateData || typeof stateData !== 'object') return null

  return [
    { name: 'value1', label: 'Primary Value', type: 'number', default: 0, min: 0 },
    { name: 'value2', label: 'Secondary Value', type: 'number', default: 0, min: 0 },
  ]
}

function getKnownFields(baseType: string, stateData: StateData): CalculatorField[] {
  switch (baseType) {
    case 'earthquake-insurance':
      return [
        { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: Number(stateData.medianHomeValue) || 350000, min: 0 },
        { name: 'deductible', label: 'Deductible (%)', type: 'select', options: [
          { value: '10', label: '10%' },
          { value: '15', label: '15%' },
          { value: '20', label: '20%' },
        ], default: '15' },
        { name: 'riskZone', label: 'Seismic Risk Zone', type: 'select', options: [
          { value: 'low', label: 'Low' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'high', label: 'High' },
        ], default: 'moderate' },
      ]

    case 'solar-panel-roi':
      return [
        { name: 'systemSize', label: 'System Size (kW)', type: 'number', default: 8, min: 1, max: 50 },
        { name: 'installCost', label: 'Installation Cost ($)', type: 'number', default: Number(stateData.avgSolarCostPerKw || 3) * 8 * 1000, min: 0 },
        { name: 'monthlyBill', label: 'Current Monthly Electric Bill ($)', type: 'number', default: 150, min: 0 },
        { name: 'netMetering', label: 'Net Metering Available?', type: 'select', options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ], default: String(stateData.hasNetMetering || 'yes') },
      ]

    case 'ev-savings':
      return [
        { name: 'annualMiles', label: 'Annual Miles Driven', type: 'number', default: 12000, min: 0 },
        { name: 'gasMpg', label: 'Current Vehicle MPG', type: 'number', default: 28, min: 5, max: 80 },
        { name: 'evEfficiency', label: 'EV Efficiency (kWh/mi)', type: 'number', default: 0.3, step: 0.05 },
        { name: 'chargingType', label: 'Primary Charging', type: 'select', options: [
          { value: 'home', label: 'Home Charging' },
          { value: 'public', label: 'Public Charging' },
          { value: 'mix', label: 'Mixed' },
        ], default: 'home' },
      ]

    case 'cannabis-tax':
      return [
        { name: 'purchaseAmount', label: 'Purchase Amount ($)', type: 'number', default: 50, min: 0 },
        { name: 'productType', label: 'Product Type', type: 'select', options: [
          { value: 'flower', label: 'Flower' },
          { value: 'edibles', label: 'Edibles' },
          { value: 'concentrate', label: 'Concentrates' },
        ], default: 'flower' },
      ]

    case 'lottery-tax':
      return [
        { name: 'winnings', label: 'Lottery Winnings ($)', type: 'number', default: 1000000, min: 0 },
        { name: 'lumpSum', label: 'Payment Option', type: 'select', options: [
          { value: 'lump', label: 'Lump Sum' },
          { value: 'annuity', label: 'Annuity (30 years)' },
        ], default: 'lump' },
      ]

    case 'child-support':
      return [
        { name: 'parentIncome', label: 'Paying Parent Monthly Income ($)', type: 'number', default: 5000, min: 0 },
        { name: 'otherParentIncome', label: 'Other Parent Monthly Income ($)', type: 'number', default: 3000, min: 0 },
        { name: 'children', label: 'Number of Children', type: 'select', options: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4+' },
        ], default: '1' },
        { name: 'custody', label: 'Custody Arrangement', type: 'select', options: [
          { value: 'primary', label: 'Other Parent Has Primary' },
          { value: 'shared', label: 'Shared (50/50)' },
        ], default: 'primary' },
      ]

    case 'commute-cost':
      return [
        { name: 'distanceOneway', label: 'One-Way Distance (miles)', type: 'number', default: 20, min: 0 },
        { name: 'daysPerWeek', label: 'Days per Week', type: 'number', default: 5, min: 1, max: 7 },
        { name: 'transportMode', label: 'Transport Mode', type: 'select', options: [
          { value: 'car', label: 'Personal Car' },
          { value: 'transit', label: 'Public Transit' },
          { value: 'hybrid', label: 'Mixed (Car + Transit)' },
        ], default: 'car' },
        { name: 'mpg', label: 'Vehicle MPG (if driving)', type: 'number', default: 28, min: 5, max: 80 },
      ]

    default:
      return [
        { name: 'value1', label: 'Value', type: 'number', default: 0, min: 0 },
      ]
  }
}

export function calculateStateSpecific(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  switch (baseType) {
    case 'earthquake-insurance': {
      const homeValue = Number(input.homeValue || 350000)
      const deductiblePct = Number(input.deductible || 15) / 100
      const zone = String(input.riskZone || 'moderate')

      const zoneRate: Record<string, number> = { low: 0.05, moderate: 0.15, high: 0.35 }
      const rate = (zoneRate[zone] || 0.15) / 100
      const annualPremium = homeValue * rate
      const deductibleAmount = homeValue * deductiblePct

      return {
        primary: { value: Math.round(annualPremium), label: 'Annual Premium', unit: '$/yr' },
        secondary: [
          { label: 'Monthly Cost', value: Math.round(annualPremium / 12), unit: '$' },
          { label: 'Deductible', value: Math.round(deductibleAmount), unit: '$' },
          { label: 'Max Coverage', value: Math.round(homeValue), unit: '$' },
        ],
      }
    }

    case 'solar-panel-roi': {
      const systemKw = Number(input.systemSize || 8)
      const installCost = Number(input.installCost || systemKw * 3000)
      const monthlyBill = Number(input.monthlyBill || 150)
      const netMetering = String(input.netMetering) !== 'no'

      const federalCredit = installCost * 0.30
      const stateCredit = Number(stateData.solarTaxCredit || 0) / 100 * installCost
      const netCost = installCost - federalCredit - stateCredit

      const sunHours = Number(stateData.avgSunHoursPerDay || 4.5)
      const annualProduction = systemKw * sunHours * 365
      const electricRate = Number(stateData.avgElectricityRate || 0.13)
      const annualSavings = annualProduction * electricRate * (netMetering ? 1.0 : 0.7)

      const paybackYears = annualSavings > 0 ? netCost / annualSavings : 99
      const roi25Year = ((annualSavings * 25 - netCost) / netCost) * 100

      return {
        primary: { value: paybackYears.toFixed(1), label: 'Payback Period', unit: 'years' },
        secondary: [
          { label: 'Net System Cost', value: Math.round(netCost), unit: '$' },
          { label: 'Federal Tax Credit', value: Math.round(federalCredit), unit: '$' },
          ...(stateCredit > 0 ? [{ label: 'State Incentive', value: Math.round(stateCredit), unit: '$' }] : []),
          { label: 'Annual Savings', value: Math.round(annualSavings), unit: '$' },
          { label: '25-Year ROI', value: roi25Year.toFixed(0), unit: '%' },
          { label: 'Annual Production', value: `${Math.round(annualProduction).toLocaleString()} kWh`, unit: '' },
        ],
      }
    }

    case 'ev-savings': {
      const miles = Number(input.annualMiles || 12000)
      const gasMpg = Number(input.gasMpg || 28)
      const evEfficiency = Number(input.evEfficiency || 0.3)
      const charging = String(input.chargingType || 'home')

      const gasPrice = Number(stateData.avgGasPrice || 3.50)
      const electricRate = Number(stateData.avgElectricityRate || 0.13)
      const publicChargeRate = electricRate * 3

      const annualGasCost = (miles / gasMpg) * gasPrice
      const homeChargeRate = electricRate
      const chargeRate = charging === 'public' ? publicChargeRate : charging === 'mix' ? (homeChargeRate + publicChargeRate) / 2 : homeChargeRate
      const annualEVCost = miles * evEfficiency * chargeRate

      const annualSavings = annualGasCost - annualEVCost
      const fiveYearSavings = annualSavings * 5

      const evIncentive = Number(stateData.evIncentive || 0)

      return {
        primary: { value: Math.round(annualSavings), label: 'Annual Fuel Savings', unit: '$' },
        secondary: [
          { label: 'Gas Cost/Year', value: Math.round(annualGasCost), unit: '$' },
          { label: 'EV Cost/Year', value: Math.round(annualEVCost), unit: '$' },
          { label: '5-Year Savings', value: Math.round(fiveYearSavings), unit: '$' },
          ...(evIncentive > 0 ? [{ label: 'State EV Incentive', value: evIncentive, unit: '$' }] : []),
          { label: 'Electric Rate', value: electricRate.toFixed(2), unit: '$/kWh' },
        ],
      }
    }

    case 'cannabis-tax': {
      const amount = Number(input.purchaseAmount || 50)
      const product = String(input.productType || 'flower')

      const stateTaxRate = Number(stateData.cannabisTaxRate || 0) / 100
      const salesTaxRate = Number(stateData.salesTaxRate || 0) / 100
      const localTax = Number(stateData.cannabisLocalTax || 0) / 100

      const productMultiplier = product === 'concentrate' ? 1.5 : product === 'edibles' ? 1.2 : 1.0
      const exciseTax = amount * stateTaxRate * productMultiplier
      const salesTax = amount * salesTaxRate
      const local = amount * localTax
      const totalTax = exciseTax + salesTax + local
      const totalPrice = amount + totalTax

      return {
        primary: { value: totalTax.toFixed(2), label: 'Total Cannabis Tax', unit: '$' },
        secondary: [
          { label: 'Excise Tax', value: exciseTax.toFixed(2), unit: '$' },
          { label: 'Sales Tax', value: salesTax.toFixed(2), unit: '$' },
          ...(local > 0 ? [{ label: 'Local Tax', value: local.toFixed(2), unit: '$' }] : []),
          { label: 'Total Price', value: totalPrice.toFixed(2), unit: '$' },
          { label: 'Effective Rate', value: (totalTax / amount * 100).toFixed(1), unit: '%' },
        ],
      }
    }

    case 'lottery-tax': {
      const winnings = Number(input.winnings || 1000000)
      const isLump = String(input.lumpSum) !== 'annuity'

      const lumpSumPct = 0.60
      const grossPayout = isLump ? winnings * lumpSumPct : winnings

      const federalRate = grossPayout > 500000 ? 0.37 : 0.24
      const stateRate = Number(stateData.incomeTaxRate || stateData.flatTaxRate || stateData.topIncomeTaxRate || 0) / 100
      const hasIncomeTax = stateData.hasIncomeTax !== false

      const federalTax = grossPayout * federalRate
      const stateTax = hasIncomeTax ? grossPayout * stateRate : 0
      const netPayout = grossPayout - federalTax - stateTax

      return {
        primary: { value: Math.round(netPayout), label: 'Net After-Tax Payout', unit: '$' },
        secondary: [
          { label: 'Gross Payout', value: Math.round(grossPayout), unit: '$' },
          { label: 'Federal Tax', value: Math.round(federalTax), unit: '$' },
          { label: 'State Tax', value: Math.round(stateTax), unit: '$' },
          { label: 'Total Tax', value: Math.round(federalTax + stateTax), unit: '$' },
          { label: 'Effective Rate', value: ((federalTax + stateTax) / grossPayout * 100).toFixed(1), unit: '%' },
          ...(isLump ? [{ label: 'Lump Sum Discount', value: `${Math.round((1 - lumpSumPct) * 100)}%`, unit: '' }] : [{ label: 'Annual Payment', value: Math.round(netPayout / 30), unit: '$/yr' }]),
        ],
        advice: !hasIncomeTax
          ? 'This state has no income tax — you keep more of your winnings!'
          : `State tax on lottery winnings is ${(stateRate * 100).toFixed(1)}% in this state.`,
      }
    }

    case 'child-support': {
      const payerIncome = Number(input.parentIncome || 5000)
      const otherIncome = Number(input.otherParentIncome || 3000)
      const children = Number(input.children || 1)
      const isShared = String(input.custody) === 'shared'

      const combinedIncome = payerIncome + otherIncome
      const childSharePct: Record<number, number> = { 1: 0.20, 2: 0.28, 3: 0.32, 4: 0.35 }
      const basePct = childSharePct[Math.min(children, 4)] || 0.20
      const totalObligation = combinedIncome * basePct
      const payerShare = combinedIncome > 0 ? payerIncome / combinedIncome : 0.5
      let monthlyPayment = totalObligation * payerShare

      if (isShared) monthlyPayment *= 0.75

      return {
        primary: { value: Math.round(monthlyPayment), label: 'Monthly Child Support', unit: '$/mo' },
        secondary: [
          { label: 'Annual Amount', value: Math.round(monthlyPayment * 12), unit: '$' },
          { label: 'Your Income Share', value: (payerShare * 100).toFixed(0), unit: '%' },
          { label: 'Total Obligation', value: Math.round(totalObligation), unit: '$/mo' },
          ...(isShared ? [{ label: 'Shared Custody Credit', value: '-25%', unit: '' }] : []),
        ],
        advice: 'This is an estimate based on the income shares model. Actual amounts may vary based on state guidelines and court discretion.',
      }
    }

    case 'commute-cost': {
      const distance = Number(input.distanceOneway || 20)
      const days = Number(input.daysPerWeek || 5)
      const mode = String(input.transportMode || 'car')
      const mpg = Number(input.mpg || 28)

      const gasPrice = Number(stateData.avgGasPrice || 3.50)
      const transitPass = Number(stateData.avgTransitPass || 100)

      const dailyMiles = distance * 2
      const weeklyMiles = dailyMiles * days
      const annualMiles = weeklyMiles * 50

      let monthlyCost: number
      if (mode === 'car') {
        const fuelCost = (annualMiles / mpg * gasPrice) / 12
        const maintenance = annualMiles * 0.08 / 12
        const parking = Number(stateData.avgParkingCost || 100)
        monthlyCost = fuelCost + maintenance + parking
      } else if (mode === 'transit') {
        monthlyCost = transitPass
      } else {
        const carDays = Math.ceil(days / 2)
        const transitDays = days - carDays
        const carCost = (dailyMiles * carDays * 50 / mpg * gasPrice + dailyMiles * carDays * 50 * 0.08) / 12
        const transitCost = transitPass * (transitDays / days)
        monthlyCost = carCost + transitCost
      }

      const annualCost = monthlyCost * 12
      const annualHours = annualMiles / 30

      return {
        primary: { value: Math.round(monthlyCost), label: 'Monthly Commute Cost', unit: '$/mo' },
        secondary: [
          { label: 'Annual Cost', value: Math.round(annualCost), unit: '$' },
          { label: 'Daily Round-Trip', value: dailyMiles, unit: 'miles' },
          { label: 'Annual Miles', value: annualMiles.toLocaleString(), unit: 'mi' },
          { label: 'Hours Commuting/Year', value: Math.round(annualHours), unit: 'hrs' },
          { label: 'Cost per Mile', value: (annualCost / annualMiles).toFixed(2), unit: '$' },
        ],
      }
    }

    default: {
      const value = Number(input.value1 || 0)
      return {
        primary: { value, label: `${baseType} Result`, unit: '' },
        advice: String(stateData.description || 'Calculator result based on state-specific data.'),
      }
    }
  }
}
