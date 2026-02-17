// State cost of living calculations — cost comparison, groceries, utilities, gas, relocation
import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

const colBaseTypes = [
  'cost-of-living', 'cost-comparison', 'grocery-cost', 'utility-cost',
  'gas-price', 'relocation-cost',
]

export function getStateCostOfLivingFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  if (!colBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'cost-of-living':
    case 'cost-comparison':
      return [
        { name: 'currentSalary', label: 'Current Salary ($)', type: 'number', default: 60000, min: 0 },
        { name: 'currentState', label: 'Moving From', type: 'select', options: [
          { value: '100', label: 'Average US City (Index 100)' },
          { value: '150', label: 'High Cost (NYC, SF - Index 150)' },
          { value: '120', label: 'Above Average (Index 120)' },
          { value: '80', label: 'Below Average (Index 80)' },
        ], default: '100' },
        { name: 'householdSize', label: 'Household Size', type: 'select', options: [
          { value: '1', label: 'Single' },
          { value: '2', label: 'Couple' },
          { value: '3', label: 'Family (3)' },
          { value: '4', label: 'Family (4+)' },
        ], default: '2' },
      ]

    case 'grocery-cost':
      return [
        { name: 'monthlyBudget', label: 'Current Monthly Grocery Budget ($)', type: 'number', default: 500, min: 0 },
        { name: 'householdSize', label: 'Household Size', type: 'select', options: [
          { value: '1', label: '1 Person' },
          { value: '2', label: '2 People' },
          { value: '3', label: '3 People' },
          { value: '4', label: '4 People' },
        ], default: '2' },
        { name: 'diet', label: 'Diet Type', type: 'select', options: [
          { value: 'budget', label: 'Budget-Friendly' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'organic', label: 'Organic/Premium' },
        ], default: 'moderate' },
      ]

    case 'utility-cost':
      return [
        { name: 'homeSqft', label: 'Home Size (sq ft)', type: 'number', default: 1500, min: 100 },
        { name: 'residents', label: 'Number of Residents', type: 'number', default: 2, min: 1, max: 10 },
        { name: 'season', label: 'Season', type: 'select', options: [
          { value: 'summer', label: 'Summer' },
          { value: 'winter', label: 'Winter' },
          { value: 'average', label: 'Annual Average' },
        ], default: 'average' },
      ]

    case 'gas-price':
      return [
        { name: 'milesPerWeek', label: 'Miles Driven per Week', type: 'number', default: 250, min: 0 },
        { name: 'mpg', label: 'Vehicle MPG', type: 'number', default: 28, min: 5, max: 100 },
        { name: 'fuelType', label: 'Fuel Type', type: 'select', options: [
          { value: 'regular', label: 'Regular' },
          { value: 'midgrade', label: 'Mid-Grade' },
          { value: 'premium', label: 'Premium' },
          { value: 'diesel', label: 'Diesel' },
        ], default: 'regular' },
      ]

    case 'relocation-cost':
      return [
        { name: 'distance', label: 'Distance (miles)', type: 'number', default: 500, min: 0 },
        { name: 'homeSize', label: 'Home Size', type: 'select', options: [
          { value: 'studio', label: 'Studio/1BR' },
          { value: '2br', label: '2 Bedroom' },
          { value: '3br', label: '3 Bedroom' },
          { value: '4br', label: '4+ Bedroom' },
        ], default: '2br' },
        { name: 'movingType', label: 'Moving Type', type: 'select', options: [
          { value: 'diy', label: 'DIY (Truck Rental)' },
          { value: 'partial', label: 'Partial Service' },
          { value: 'full', label: 'Full Service Movers' },
        ], default: 'partial' },
      ]

    default:
      return [
        { name: 'currentSalary', label: 'Current Salary ($)', type: 'number', default: 60000, min: 0 },
      ]
  }
}

export function calculateStateCostOfLiving(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!colBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'cost-of-living':
    case 'cost-comparison': {
      const salary = Number(input.currentSalary || 60000)
      const currentIndex = Number(input.currentState || 100)
      const stateIndex = Number(stateData.costOfLivingIndex || 100)
      const householdSize = Number(input.householdSize || 2)

      const adjustedSalary = salary * (stateIndex / currentIndex)
      const difference = adjustedSalary - salary
      const monthlyDiff = difference / 12

      // Breakdown by category (approximate proportions)
      const housingShare = 0.33
      const foodShare = 0.13
      const transportShare = 0.16
      const healthShare = 0.08
      const otherShare = 0.30

      return {
        primary: { value: Math.round(adjustedSalary), label: 'Equivalent Salary Needed', unit: '$' },
        secondary: [
          { label: 'Salary Difference', value: `${difference >= 0 ? '+' : ''}$${Math.round(Math.abs(difference)).toLocaleString()}`, unit: '' },
          { label: 'Monthly Difference', value: `${monthlyDiff >= 0 ? '+' : ''}$${Math.round(Math.abs(monthlyDiff)).toLocaleString()}`, unit: '' },
          { label: 'COL Index', value: stateIndex, unit: '' },
          { label: 'Housing Cost Impact', value: `${difference >= 0 ? '+' : ''}$${Math.round(Math.abs(difference * housingShare)).toLocaleString()}`, unit: '/yr' },
          { label: 'Food Cost Impact', value: `${difference >= 0 ? '+' : ''}$${Math.round(Math.abs(difference * foodShare)).toLocaleString()}`, unit: '/yr' },
        ],
        advice: stateIndex > currentIndex
          ? `This state's cost of living is ${((stateIndex / currentIndex - 1) * 100).toFixed(0)}% higher. You'd need $${Math.round(adjustedSalary).toLocaleString()} to maintain your lifestyle.`
          : `This state's cost of living is ${((1 - stateIndex / currentIndex) * 100).toFixed(0)}% lower. Your $${salary.toLocaleString()} salary has more purchasing power here.`,
      }
    }

    case 'grocery-cost': {
      const budget = Number(input.monthlyBudget || 500)
      const household = Number(input.householdSize || 2)
      const diet = String(input.diet || 'moderate')

      const stateIndex = Number(stateData.groceryIndex || stateData.costOfLivingIndex || 100)
      const dietFactor = diet === 'budget' ? 0.75 : diet === 'organic' ? 1.4 : 1.0

      // USDA monthly food costs per person (moderate plan ~$350)
      const basePerson = 350
      const perPerson = basePerson * (stateIndex / 100) * dietFactor
      const monthlyEstimate = perPerson * household
      const annualEstimate = monthlyEstimate * 12
      const vs = monthlyEstimate - budget

      return {
        primary: { value: Math.round(monthlyEstimate), label: 'Monthly Grocery Cost', unit: '$/mo' },
        secondary: [
          { label: 'Annual Cost', value: Math.round(annualEstimate), unit: '$' },
          { label: 'Per Person', value: Math.round(perPerson), unit: '$/mo' },
          { label: 'Grocery Index', value: stateIndex, unit: '' },
          { label: 'vs Your Budget', value: `${vs >= 0 ? '+' : ''}$${Math.round(Math.abs(vs))}`, unit: '/mo' },
        ],
      }
    }

    case 'utility-cost': {
      const sqft = Number(input.homeSqft || 1500)
      const residents = Number(input.residents || 2)
      const season = String(input.season || 'average')

      const avgUtility = Number(stateData.avgMonthlyUtility || 150)
      const avgElecRate = Number(stateData.avgElectricityRate || 0.13) // per kWh

      // Size factor: base 1000 sqft
      const sizeFactor = sqft / 1000
      // Season factor
      const seasonFactor = season === 'summer' ? 1.3 : season === 'winter' ? 1.4 : 1.0
      // Residents factor
      const residentFactor = 1 + (residents - 1) * 0.15

      const electricity = avgUtility * 0.55 * sizeFactor * seasonFactor * residentFactor
      const gas = avgUtility * 0.25 * sizeFactor * seasonFactor
      const water = avgUtility * 0.15 * residentFactor
      const trash = avgUtility * 0.05
      const totalMonthly = electricity + gas + water + trash

      return {
        primary: { value: Math.round(totalMonthly), label: 'Monthly Utility Cost', unit: '$/mo' },
        secondary: [
          { label: 'Electricity', value: Math.round(electricity), unit: '$/mo' },
          { label: 'Gas/Heating', value: Math.round(gas), unit: '$/mo' },
          { label: 'Water/Sewer', value: Math.round(water), unit: '$/mo' },
          { label: 'Trash', value: Math.round(trash), unit: '$/mo' },
          { label: 'Annual Cost', value: Math.round(totalMonthly * 12), unit: '$' },
          { label: 'Electric Rate', value: avgElecRate.toFixed(2), unit: '$/kWh' },
        ],
      }
    }

    case 'gas-price': {
      const miles = Number(input.milesPerWeek || 250)
      const mpg = Number(input.mpg || 28)
      const fuelType = String(input.fuelType || 'regular')

      const basePrice = Number(stateData.avgGasPrice || 3.50)
      const fuelMultiplier = fuelType === 'premium' ? 1.2 : fuelType === 'midgrade' ? 1.1 : fuelType === 'diesel' ? 1.15 : 1.0
      const pricePerGallon = basePrice * fuelMultiplier

      const gallonsPerWeek = miles / mpg
      const weeklyFuelCost = gallonsPerWeek * pricePerGallon
      const monthlyFuelCost = weeklyFuelCost * 4.33
      const annualFuelCost = weeklyFuelCost * 52
      const costPerMile = pricePerGallon / mpg

      return {
        primary: { value: Math.round(monthlyFuelCost), label: 'Monthly Fuel Cost', unit: '$/mo' },
        secondary: [
          { label: 'Weekly Cost', value: Math.round(weeklyFuelCost), unit: '$' },
          { label: 'Annual Cost', value: Math.round(annualFuelCost), unit: '$' },
          { label: 'Price/Gallon', value: pricePerGallon.toFixed(2), unit: '$' },
          { label: 'Cost/Mile', value: costPerMile.toFixed(2), unit: '$' },
          { label: 'Gallons/Week', value: gallonsPerWeek.toFixed(1), unit: 'gal' },
        ],
      }
    }

    case 'relocation-cost': {
      const distance = Number(input.distance || 500)
      const homeSize = String(input.homeSize || '2br')
      const movingType = String(input.movingType || 'partial')

      // Base costs by home size (weight/volume)
      const sizeBase: Record<string, number> = {
        studio: 2000, '2br': 4000, '3br': 6500, '4br': 9000,
      }
      // Moving type multiplier
      const typeMult: Record<string, number> = {
        diy: 0.4, partial: 0.7, full: 1.0,
      }
      // Distance factor: local (<100mi) is flat, long-distance scales
      const distanceFactor = distance < 100 ? 1.0 : 1.0 + (distance - 100) * 0.002

      const baseCost = sizeBase[homeSize] || 4000
      const movingCost = baseCost * (typeMult[movingType] || 0.7) * distanceFactor

      // Additional costs
      const deposit = Number(stateData.medianRent || 1500) * 2 // First + last
      const travelCost = distance * 0.655 // IRS mileage rate
      const miscCost = 500 // Boxes, supplies, etc.
      const totalCost = movingCost + deposit + travelCost + miscCost

      return {
        primary: { value: Math.round(totalCost), label: 'Total Relocation Cost', unit: '$' },
        secondary: [
          { label: 'Moving Service', value: Math.round(movingCost), unit: '$' },
          { label: 'Security Deposits', value: Math.round(deposit), unit: '$' },
          { label: 'Travel Cost', value: Math.round(travelCost), unit: '$' },
          { label: 'Supplies & Misc', value: Math.round(miscCost), unit: '$' },
        ],
      }
    }

    default:
      return {
        primary: { value: Number(input.currentSalary || 0), label: `${baseType} Result`, unit: '$' },
        advice: 'Calculator under development.',
      }
  }
}
