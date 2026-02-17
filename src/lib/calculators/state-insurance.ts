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

export function calculateStateInsurance(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!insuranceBaseTypes.includes(baseType)) return null

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
