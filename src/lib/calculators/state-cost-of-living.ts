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

// ═══════════════════════════════════════════════════════════════════
// NY TRANSPORT/LIFESTYLE — Custom calculation functions
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()
const fmtD = (n: number) => '$' + n.toFixed(2)

/** #31 Cost of Living NYC — borough comparison */
function calcNYCostOfLiving(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const annualIncome = Number(input.annualIncome || 80000)
  const borough = String(input.borough || 'manhattan')
  const householdSize = Number(input.householdSize || 1)

  // NYC cost indices by borough (Manhattan = 100 baseline)
  const boroughCosts: Record<string, { index: number; rent1br: number; rent2br: number; groceries: number; transit: number; name: string }> = {
    manhattan: { index: 100, rent1br: 3500, rent2br: 4800, groceries: 550, transit: 127, name: 'Manhattan' },
    brooklyn: { index: 82, rent1br: 2700, rent2br: 3600, groceries: 480, transit: 127, name: 'Brooklyn' },
    queens: { index: 70, rent1br: 2100, rent2br: 2900, groceries: 420, transit: 127, name: 'Queens' },
    bronx: { index: 62, rent1br: 1700, rent2br: 2300, groceries: 380, transit: 127, name: 'Bronx' },
    staten_island: { index: 65, rent1br: 1500, rent2br: 2100, groceries: 400, transit: 200, name: 'Staten Island' },
  }

  const b = boroughCosts[borough] || boroughCosts.manhattan
  const hhMult = householdSize === 1 ? 1.0 : householdSize === 2 ? 1.5 : householdSize === 3 ? 1.9 : 2.3

  const monthlyRent = householdSize <= 1 ? b.rent1br : b.rent2br
  const monthlyGroceries = b.groceries * hhMult
  const monthlyTransit = b.transit * Math.min(householdSize, 2)
  const monthlyUtilities = 180 * (b.index / 100) * (householdSize <= 2 ? 1 : 1.3)
  const monthlyEntertainment = 400 * (b.index / 100)
  const monthlyMisc = 300 * hhMult

  const monthlyTotal = monthlyRent + monthlyGroceries + monthlyTransit + monthlyUtilities + monthlyEntertainment + monthlyMisc
  const annualTotal = monthlyTotal * 12
  const incomeAfterExpenses = annualIncome - annualTotal
  const savingsRate = (incomeAfterExpenses / annualIncome) * 100

  // National average comparison
  const nationalMonthly = 3500 * hhMult
  const premiumPercent = ((monthlyTotal / nationalMonthly) - 1) * 100

  return {
    primary: { value: Math.round(monthlyTotal), label: 'Monthly Cost of Living', unit: '$/mo' },
    secondary: [
      { label: 'Annual Cost', value: fmt(annualTotal), unit: '' },
      { label: 'Borough', value: b.name, unit: '' },
      { label: 'After Expenses', value: fmt(incomeAfterExpenses), unit: '/yr' },
      { label: 'Savings Rate', value: `${savingsRate.toFixed(0)}%`, unit: '' },
      { label: 'vs National Avg', value: `+${premiumPercent.toFixed(0)}%`, unit: '' },
    ],
    breakdown: [
      { label: 'Rent', value: Math.round(monthlyRent * 12), color: '#1E3A8A' },
      { label: 'Groceries', value: Math.round(monthlyGroceries * 12), color: '#059669' },
      { label: 'Transit', value: Math.round(monthlyTransit * 12), color: '#CA8A04' },
      { label: 'Utilities', value: Math.round(monthlyUtilities * 12), color: '#DC2626' },
      { label: 'Entertainment', value: Math.round(monthlyEntertainment * 12), color: '#7C3AED' },
      { label: 'Miscellaneous', value: Math.round(monthlyMisc * 12), color: '#6B7280' },
    ],
    chartData: Object.values(boroughCosts).map(bc => ({
      name: bc.name, value: Math.round((householdSize <= 1 ? bc.rent1br : bc.rent2br) + bc.groceries * hhMult + bc.transit),
    })),
    schedule: {
      headers: ['Borough', '1BR Rent', '2BR Rent', 'Groceries', 'Index'],
      rows: Object.values(boroughCosts).map(bc => [
        bc.name, fmt(bc.rent1br), fmt(bc.rent2br), fmt(bc.groceries), `${bc.index}`,
      ]),
    },
    advice: savingsRate < 10
      ? `At ${fmt(annualIncome)}/year in ${b.name}, your savings rate is only ${savingsRate.toFixed(0)}%. Consider a cheaper borough — moving from Manhattan to Queens saves ~${fmt((boroughCosts.manhattan.rent1br - boroughCosts.queens.rent1br) * 12)}/year in rent alone.`
      : `You can maintain a ${savingsRate.toFixed(0)}% savings rate in ${b.name}. NYC costs ${premiumPercent.toFixed(0)}% more than the national average, but salaries are typically 20-40% higher too.`,
  }
}

/** #32 Bodega vs Grocery — convenience premium */
function calcNYBodegaGrocery(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const weeklyGroceries = Number(input.weeklyGroceries || 150)
  const bodegaPct = Number(input.bodegaPct || 30)
  const dietType = String(input.dietType || 'moderate')
  const householdSize = Number(input.householdSize || 1)

  // Bodega markup ranges
  const bodegaMarkup = 1.35 // 35% average premium over grocery stores
  const traderJoesSavings = 0.80 // 20% cheaper than avg grocery
  const wholeFloodsPremium = 1.25 // 25% premium (Whole Foods)

  const dietMult: Record<string, number> = { budget: 0.75, moderate: 1.0, organic: 1.35, premium: 1.6 }
  const dMult = dietMult[dietType] || 1.0
  const hhMult = householdSize === 1 ? 1.0 : householdSize === 2 ? 1.7 : householdSize === 3 ? 2.2 : 2.8

  const baseWeekly = weeklyGroceries * dMult * hhMult

  // Current split
  const bodegaShare = (bodegaPct / 100) * baseWeekly * bodegaMarkup
  const groceryShare = (1 - bodegaPct / 100) * baseWeekly
  const actualWeekly = bodegaShare + groceryShare

  // Scenario: all grocery store
  const allGrocery = baseWeekly
  // Scenario: all Trader Joe's
  const allTJs = baseWeekly * traderJoesSavings
  // Scenario: all bodega
  const allBodega = baseWeekly * bodegaMarkup
  // Scenario: all Whole Foods
  const allWholeFoods = baseWeekly * wholeFloodsPremium

  const monthlyCurrent = actualWeekly * 4.33
  const annualCurrent = monthlyCurrent * 12
  const savingsVsAllGrocery = (actualWeekly - allGrocery) * 52

  return {
    primary: { value: Math.round(monthlyCurrent), label: 'Monthly Grocery Spend', unit: '$/mo' },
    secondary: [
      { label: 'Weekly Spend', value: fmt(actualWeekly), unit: '' },
      { label: 'Annual Spend', value: fmt(annualCurrent), unit: '' },
      { label: 'Bodega Premium', value: fmt(savingsVsAllGrocery), unit: '/yr' },
      { label: 'Bodega Share', value: `${bodegaPct}%`, unit: '' },
      { label: 'Household Size', value: `${householdSize}`, unit: '' },
    ],
    breakdown: [
      { label: 'Grocery Store', value: Math.round(groceryShare * 52), color: '#059669' },
      { label: 'Bodega Premium', value: Math.round(bodegaShare * 52), color: '#CA8A04' },
    ],
    chartData: [
      { name: 'All Bodega', value: Math.round(allBodega * 52) },
      { name: 'Current Mix', value: Math.round(actualWeekly * 52) },
      { name: 'All Grocery', value: Math.round(allGrocery * 52) },
      { name: "Trader Joe's", value: Math.round(allTJs * 52) },
    ],
    schedule: {
      headers: ['Shopping Strategy', 'Weekly', 'Monthly', 'Annual'],
      rows: [
        ['All Bodega', fmt(allBodega), fmt(allBodega * 4.33), fmt(allBodega * 52)],
        ['Current Mix', fmt(actualWeekly), fmt(monthlyCurrent), fmt(annualCurrent)],
        ['All Grocery Store', fmt(allGrocery), fmt(allGrocery * 4.33), fmt(allGrocery * 52)],
        ["Trader Joe's", fmt(allTJs), fmt(allTJs * 4.33), fmt(allTJs * 52)],
        ['Whole Foods', fmt(allWholeFoods), fmt(allWholeFoods * 4.33), fmt(allWholeFoods * 52)],
      ],
    },
    advice: bodegaPct > 40
      ? `You're spending ${bodegaPct}% at bodegas — the 35% markup costs you ${fmt(savingsVsAllGrocery)}/year extra. Batch-shopping at a grocery store once a week and using bodegas only for emergencies could save significantly.`
      : `Your bodega spending is reasonable at ${bodegaPct}%. The convenience factor is worth something — but switching entirely to Trader Joe's could save ${fmt((actualWeekly - allTJs) * 52)}/year.`,
  }
}

/** #33 ConEd Bill Estimator */
function calcNYConEdBill(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const apartmentSize = String(input.apartmentSize || '1br')
  const acUsage = String(input.acUsage || 'moderate')
  const season = String(input.season || 'summer')
  const hasGas = String(input.hasGas || 'yes') === 'yes'

  // ConEd rates (2024): supply ~$0.08/kWh + delivery ~$0.12/kWh = ~$0.20/kWh effective
  const elecRate = 0.20 // $/kWh effective
  const gasDelivery = 45 // base gas delivery charge
  const gasCostPerTherm = 1.10

  // kWh usage by apartment size and season
  const baseKwh: Record<string, { summer: number; winter: number; spring: number }> = {
    studio: { summer: 350, winter: 250, spring: 200 },
    '1br': { summer: 500, winter: 350, spring: 280 },
    '2br': { summer: 700, winter: 500, spring: 400 },
    '3br': { summer: 900, winter: 650, spring: 520 },
  }

  const usage = baseKwh[apartmentSize] || baseKwh['1br']
  const kwh = usage[season as keyof typeof usage] || usage.summer

  // AC adjustment
  const acMult: Record<string, number> = { none: 0.6, light: 0.85, moderate: 1.0, heavy: 1.4 }
  const acFactor = season === 'summer' ? (acMult[acUsage] || 1.0) : 1.0

  const monthlyKwh = kwh * acFactor
  const elecBill = monthlyKwh * elecRate

  // Gas (heating in winter, cooking year-round)
  const cookingTherms = 5
  const heatingTherms = season === 'winter' ? 40 : 0
  const totalTherms = cookingTherms + heatingTherms
  const gasBill = hasGas ? (gasDelivery + totalTherms * gasCostPerTherm) : 0

  const totalMonthly = elecBill + gasBill

  // Annual estimate (weighted average)
  const summerElec = (usage.summer * (acMult[acUsage] || 1.0)) * elecRate
  const winterElec = usage.winter * elecRate
  const springElec = usage.spring * elecRate
  const annualElec = (summerElec * 4 + winterElec * 4 + springElec * 4)
  const annualGas = hasGas ? (gasDelivery * 12 + (cookingTherms * 12 + 40 * 4) * gasCostPerTherm) : 0
  const annualTotal = annualElec + annualGas

  return {
    primary: { value: Math.round(totalMonthly), label: `Monthly Bill (${season})`, unit: '$/mo' },
    secondary: [
      { label: 'Electric', value: fmt(elecBill), unit: '/mo' },
      { label: 'Gas', value: hasGas ? fmt(gasBill) : 'N/A', unit: hasGas ? '/mo' : '' },
      { label: 'kWh Used', value: `${Math.round(monthlyKwh)}`, unit: 'kWh' },
      { label: 'Annual Estimate', value: fmt(annualTotal), unit: '' },
      { label: 'Rate', value: `${fmtD(elecRate)}/kWh`, unit: '' },
    ],
    breakdown: [
      { label: 'Electric Supply', value: Math.round(monthlyKwh * 0.08 * 12), color: '#CA8A04' },
      { label: 'Electric Delivery', value: Math.round(monthlyKwh * 0.12 * 12), color: '#1E3A8A' },
      ...(hasGas ? [{ label: 'Gas', value: Math.round(annualGas), color: '#DC2626' }] : []),
    ],
    chartData: [
      { name: 'Summer', value: Math.round(summerElec + (hasGas ? gasDelivery + cookingTherms * gasCostPerTherm : 0)) },
      { name: 'Winter', value: Math.round(winterElec + (hasGas ? gasDelivery + (cookingTherms + 40) * gasCostPerTherm : 0)) },
      { name: 'Spring/Fall', value: Math.round(springElec + (hasGas ? gasDelivery + cookingTherms * gasCostPerTherm : 0)) },
    ],
    advice: season === 'summer' && acUsage === 'heavy'
      ? `Heavy AC usage can double your summer ConEd bill. Consider a smart thermostat, closing curtains during peak sun, and using fans. ConEd offers time-of-use rates that are cheaper overnight.`
      : `Your estimated ${apartmentSize.toUpperCase()} ConEd bill is ${fmt(totalMonthly)}/mo in ${season}. NYC electricity rates (~$0.20/kWh) are 50% above the national average due to delivery charges.`,
  }
}

/** #34 Moving to NYC Cost */
function calcNYMovingToNYC(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const movingFrom = String(input.movingFrom || 'out_of_state')
  const apartmentSize = String(input.apartmentSize || '1br')
  const monthlyRent = Number(input.monthlyRent || 3000)
  const hasBroker = String(input.hasBroker || 'yes') === 'yes'

  // Broker fee (NYC-specific: 12-15% of annual rent, recently debated)
  const brokerFee = hasBroker ? monthlyRent * 12 * 0.15 : 0
  // First month + security deposit (1 month)
  const firstLast = monthlyRent * 2
  // Application fees (per application, avg 3-5 apps)
  const applicationFees = 50 * 4

  // Moving costs by origin
  const movingCosts: Record<string, number> = {
    local_nyc: 800,
    tri_state: 1500,
    out_of_state: 3500,
    cross_country: 6000,
  }
  const movingCost = movingCosts[movingFrom] || 3500

  // Size factor for moving
  const sizeMult: Record<string, number> = { studio: 0.6, '1br': 1.0, '2br': 1.5, '3br': 2.0 }
  const sMult = sizeMult[apartmentSize] || 1.0

  // Furnishing (if needed)
  const furnishingBase: Record<string, number> = { studio: 2500, '1br': 4000, '2br': 6500, '3br': 9000 }
  const furnishing = furnishingBase[apartmentSize] || 4000

  // Utility deposits + setup
  const utilitySetup = 300

  const totalUpfront = brokerFee + firstLast + applicationFees + (movingCost * sMult) + utilitySetup
  const totalWithFurnishing = totalUpfront + furnishing

  return {
    primary: { value: Math.round(totalUpfront), label: 'Move-In Cost (no furnishing)', unit: '$' },
    secondary: [
      { label: 'With Furnishing', value: fmt(totalWithFurnishing), unit: '' },
      { label: 'Broker Fee', value: hasBroker ? fmt(brokerFee) : 'No Broker', unit: '' },
      { label: 'First + Security', value: fmt(firstLast), unit: '' },
      { label: 'Moving Service', value: fmt(movingCost * sMult), unit: '' },
      { label: 'Monthly Rent', value: fmt(monthlyRent), unit: '' },
    ],
    breakdown: [
      { label: 'Broker Fee', value: Math.round(brokerFee), color: '#DC2626' },
      { label: 'First + Security', value: Math.round(firstLast), color: '#1E3A8A' },
      { label: 'Moving Service', value: Math.round(movingCost * sMult), color: '#CA8A04' },
      { label: 'Applications', value: applicationFees, color: '#7C3AED' },
      { label: 'Utility Setup', value: utilitySetup, color: '#059669' },
    ],
    chartData: [
      { name: 'No Broker', value: Math.round(totalUpfront - brokerFee) },
      { name: 'With Broker', value: Math.round(totalUpfront) },
      { name: '+ Furnishing', value: Math.round(totalWithFurnishing) },
    ],
    advice: hasBroker
      ? `The broker fee (${fmt(brokerFee)}) is your biggest upfront cost — 15% of annual rent. Look for no-fee apartments on StreetEasy (filter: "No Fee") or negotiate directly with management companies.`
      : `Smart move avoiding broker fees — you're saving ${fmt(monthlyRent * 12 * 0.15)}. Total move-in cost of ${fmt(totalUpfront)} is manageable. Budget ${fmt(monthlyRent * 3)} in reserves for the first few months.`,
  }
}

/** #35 Wedding Budget NYC */
function calcNYWeddingBudget(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const guestCount = Number(input.guestCount || 120)
  const venueType = String(input.venueType || 'city')
  const tier = String(input.tier || 'mid')

  // NYC wedding costs (2024 averages — NYC is #1 most expensive wedding market)
  const perGuestCosts: Record<string, Record<string, number>> = {
    budget: { city: 150, hudson_valley: 120, long_island: 130, brooklyn: 140 },
    mid: { city: 300, hudson_valley: 220, long_island: 250, brooklyn: 270 },
    luxury: { city: 600, hudson_valley: 400, long_island: 450, brooklyn: 500 },
  }
  const perGuest = perGuestCosts[tier]?.[venueType] || 300

  const cateringTotal = perGuest * guestCount

  // Fixed costs by tier
  const fixedCosts: Record<string, Record<string, number>> = {
    budget: { venue: 5000, photo: 3000, flowers: 2000, dress: 2000, band_dj: 1500, officiant: 500, invites: 300 },
    mid: { venue: 15000, photo: 7000, flowers: 5000, dress: 5000, band_dj: 4000, officiant: 800, invites: 800 },
    luxury: { venue: 40000, photo: 15000, flowers: 12000, dress: 12000, band_dj: 10000, officiant: 1500, invites: 2000 },
  }
  const fixed = fixedCosts[tier] || fixedCosts.mid

  const totalFixed = Object.values(fixed).reduce((sum, v) => sum + v, 0)
  const grandTotal = cateringTotal + totalFixed
  const perGuestTotal = grandTotal / guestCount

  const venueNames: Record<string, string> = { city: 'Manhattan', hudson_valley: 'Hudson Valley', long_island: 'Long Island', brooklyn: 'Brooklyn' }
  const venueName = venueNames[venueType] || 'Manhattan'

  // National average comparison
  const nationalAvg = 35000
  const vsNational = ((grandTotal / nationalAvg) - 1) * 100

  return {
    primary: { value: Math.round(grandTotal), label: 'Total Wedding Budget', unit: '$' },
    secondary: [
      { label: 'Per Guest', value: fmt(perGuestTotal), unit: '' },
      { label: 'Venue Area', value: venueName, unit: '' },
      { label: 'Guest Count', value: `${guestCount}`, unit: '' },
      { label: 'Tier', value: tier.charAt(0).toUpperCase() + tier.slice(1), unit: '' },
      { label: 'vs National Avg', value: `+${vsNational.toFixed(0)}%`, unit: '' },
    ],
    breakdown: [
      { label: 'Catering/Bar', value: Math.round(cateringTotal), color: '#1E3A8A' },
      { label: 'Venue', value: fixed.venue, color: '#DC2626' },
      { label: 'Photography', value: fixed.photo, color: '#CA8A04' },
      { label: 'Flowers/Decor', value: fixed.flowers, color: '#059669' },
      { label: 'Attire', value: fixed.dress, color: '#7C3AED' },
      { label: 'Music', value: fixed.band_dj, color: '#10B981' },
    ],
    chartData: [
      { name: 'Budget', value: Math.round(perGuestCosts.budget[venueType] * guestCount + Object.values(fixedCosts.budget).reduce((s, v) => s + v, 0)) },
      { name: 'Mid-Range', value: Math.round(perGuestCosts.mid[venueType] * guestCount + Object.values(fixedCosts.mid).reduce((s, v) => s + v, 0)) },
      { name: 'Luxury', value: Math.round(perGuestCosts.luxury[venueType] * guestCount + Object.values(fixedCosts.luxury).reduce((s, v) => s + v, 0)) },
    ],
    schedule: {
      headers: ['Category', 'Budget', 'Mid-Range', 'Luxury'],
      rows: [
        ['Catering (per guest)', fmt(perGuestCosts.budget[venueType] || 150), fmt(perGuestCosts.mid[venueType] || 300), fmt(perGuestCosts.luxury[venueType] || 600)],
        ['Venue', fmt(fixedCosts.budget.venue), fmt(fixedCosts.mid.venue), fmt(fixedCosts.luxury.venue)],
        ['Photography', fmt(fixedCosts.budget.photo), fmt(fixedCosts.mid.photo), fmt(fixedCosts.luxury.photo)],
        ['Flowers/Decor', fmt(fixedCosts.budget.flowers), fmt(fixedCosts.mid.flowers), fmt(fixedCosts.luxury.flowers)],
        ['Music', fmt(fixedCosts.budget.band_dj), fmt(fixedCosts.mid.band_dj), fmt(fixedCosts.luxury.band_dj)],
      ],
    },
    advice: venueType === 'city'
      ? `Manhattan weddings average ${fmt(grandTotal)} for ${guestCount} guests — ${vsNational.toFixed(0)}% above national average. Consider Hudson Valley or Brooklyn for 20-30% savings with equally stunning venues.`
      : `${venueName} offers great value vs Manhattan. At ${fmt(perGuestTotal)}/guest, you're getting NYC-area quality at a more reasonable price. Book venues 12-18 months ahead — popular dates sell fast.`,
  }
}

/** #37 Childcare Cost NYC */
function calcNYChildcareCost(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const careType = String(input.careType || 'daycare')
  const childAge = String(input.childAge || 'infant')
  const borough = String(input.borough || 'manhattan')
  const schedule = String(input.schedule || 'full')

  // NYC childcare rates (2024 — among highest in nation)
  const rates: Record<string, Record<string, Record<string, number>>> = {
    daycare: {
      infant: { manhattan: 2800, brooklyn: 2400, queens: 2000, bronx: 1700, staten_island: 1600 },
      toddler: { manhattan: 2500, brooklyn: 2100, queens: 1800, bronx: 1500, staten_island: 1400 },
      preschool: { manhattan: 2200, brooklyn: 1900, queens: 1600, bronx: 1300, staten_island: 1200 },
    },
    nanny: {
      infant: { manhattan: 4200, brooklyn: 3800, queens: 3400, bronx: 3000, staten_island: 2800 },
      toddler: { manhattan: 3800, brooklyn: 3500, queens: 3100, bronx: 2700, staten_island: 2500 },
      preschool: { manhattan: 3500, brooklyn: 3200, queens: 2800, bronx: 2500, staten_island: 2300 },
    },
    nanny_share: {
      infant: { manhattan: 2800, brooklyn: 2500, queens: 2200, bronx: 2000, staten_island: 1800 },
      toddler: { manhattan: 2500, brooklyn: 2200, queens: 2000, bronx: 1800, staten_island: 1600 },
      preschool: { manhattan: 2200, brooklyn: 2000, queens: 1800, bronx: 1600, staten_island: 1400 },
    },
  }

  const monthlyRate = rates[careType]?.[childAge]?.[borough] || 2500
  const scheduleMult = schedule === 'part' ? 0.6 : 1.0
  const monthlyCost = monthlyRate * scheduleMult
  const annualCost = monthlyCost * 12

  // NYC child care tax credit (up to $1,100 per child)
  const nycCredit = 1100
  // Federal CDCTC (up to $3,000 for one child)
  const fedCredit = Math.min(3000, annualCost * 0.20)
  const netAnnual = annualCost - nycCredit - fedCredit

  const boroughName = borough.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
  const careNames: Record<string, string> = { daycare: 'Daycare Center', nanny: 'Full-Time Nanny', nanny_share: 'Nanny Share' }

  return {
    primary: { value: Math.round(monthlyCost), label: 'Monthly Childcare Cost', unit: '$/mo' },
    secondary: [
      { label: 'Annual Cost', value: fmt(annualCost), unit: '' },
      { label: 'After Tax Credits', value: fmt(netAnnual), unit: '/yr' },
      { label: 'NYC Credit', value: fmt(nycCredit), unit: '/yr' },
      { label: 'Federal Credit', value: fmt(fedCredit), unit: '/yr' },
      { label: 'Care Type', value: careNames[careType] || careType, unit: '' },
    ],
    breakdown: [
      { label: 'Childcare', value: Math.round(annualCost), color: '#1E3A8A' },
      { label: 'NYC Tax Credit', value: -nycCredit, color: '#059669' },
      { label: 'Federal Credit', value: -Math.round(fedCredit), color: '#10B981' },
    ],
    chartData: [
      { name: 'Daycare', value: Math.round((rates.daycare[childAge]?.[borough] || 2500) * 12) },
      { name: 'Nanny', value: Math.round((rates.nanny[childAge]?.[borough] || 3800) * 12) },
      { name: 'Nanny Share', value: Math.round((rates.nanny_share[childAge]?.[borough] || 2500) * 12) },
    ],
    advice: careType === 'nanny'
      ? `A full-time nanny in ${boroughName} costs ${fmt(annualCost)}/year. Consider a nanny share to split costs — you'd save ~${fmt(annualCost - (rates.nanny_share[childAge]?.[borough] || 2500) * 12)}/year while your child gets socialization.`
      : `${careNames[careType]} in ${boroughName} runs ${fmt(monthlyCost)}/mo. NYC's Pre-K for All (free for 4-year-olds) and 3-K programs can eliminate costs starting at age 3.`,
  }
}

/** #38 Restaurant Tip Calculator */
function calcNYRestaurantTip(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const billAmount = Number(input.billAmount || 80)
  const serviceLevel = String(input.serviceLevel || 'good')
  const diningType = String(input.diningType || 'sit_down')
  const groupSize = Number(input.groupSize || 2)

  // NYC tipping norms (higher than national average)
  const tipRates: Record<string, Record<string, number>> = {
    sit_down: { poor: 15, fair: 18, good: 20, excellent: 25 },
    fast_casual: { poor: 0, fair: 10, good: 15, excellent: 18 },
    delivery: { poor: 10, fair: 15, good: 18, excellent: 20 },
    bar: { poor: 15, fair: 18, good: 20, excellent: 25 },
    coffee: { poor: 0, fair: 10, good: 15, excellent: 20 },
  }

  const tipPct = (tipRates[diningType]?.[serviceLevel] || 20) / 100
  const tipAmount = billAmount * tipPct

  // Auto-gratuity for large groups (NYC standard: 18-20% for 6+)
  const autoGrat = groupSize >= 6
  const autoGratAmount = autoGrat ? billAmount * 0.20 : 0

  const totalBill = billAmount + (autoGrat ? autoGratAmount : tipAmount)
  const perPerson = totalBill / groupSize

  // NYC tax on food (8.875%)
  const taxRate = 0.08875
  const taxAmount = billAmount * taxRate
  const totalWithTax = totalBill + taxAmount
  const perPersonWithTax = totalWithTax / groupSize

  // Monthly dining estimate
  const monthlyDiningOut = 8 // avg NYC resident dines out 8x/month
  const monthlyTips = tipAmount * monthlyDiningOut
  const annualTips = monthlyTips * 12

  return {
    primary: { value: Math.round(tipAmount * 100) / 100, label: 'Suggested Tip', unit: '$' },
    secondary: [
      { label: 'Tip Percentage', value: `${(tipPct * 100).toFixed(0)}%`, unit: '' },
      { label: 'Total (with tip)', value: fmtD(totalBill), unit: '' },
      { label: 'Total (with tax)', value: fmtD(totalWithTax), unit: '' },
      { label: 'Per Person', value: fmtD(perPersonWithTax), unit: '' },
      ...(autoGrat ? [{ label: 'Auto-Gratuity', value: `20% (${groupSize}+ group)`, unit: '' }] : []),
      { label: 'Est. Annual Tips', value: fmt(annualTips), unit: '' },
    ],
    breakdown: [
      { label: 'Food & Drink', value: Math.round(billAmount), color: '#1E3A8A' },
      { label: 'NYC Tax (8.875%)', value: Math.round(taxAmount * 100) / 100, color: '#DC2626' },
      { label: 'Tip', value: Math.round(tipAmount * 100) / 100, color: '#CA8A04' },
    ],
    chartData: [
      { name: '15%', value: Math.round(billAmount * 0.15 * 100) / 100 },
      { name: '18%', value: Math.round(billAmount * 0.18 * 100) / 100 },
      { name: '20%', value: Math.round(billAmount * 0.20 * 100) / 100 },
      { name: '25%', value: Math.round(billAmount * 0.25 * 100) / 100 },
    ],
    schedule: {
      headers: ['Service Type', 'Fair', 'Good', 'Excellent'],
      rows: [
        ['Sit-Down Restaurant', '18%', '20%', '25%'],
        ['Fast Casual/Counter', '10%', '15%', '18%'],
        ['Delivery', '15%', '18%', '20%'],
        ['Bar/Drinks', '18%', '20%', '25%'],
        ['Coffee Shop', '10%', '15%', '20%'],
      ],
    },
    advice: diningType === 'sit_down'
      ? `NYC standard for sit-down dining is 20% for good service (up from the national 15-18%). Tip on the pre-tax amount. At 8 meals out/month, that's ~${fmt(annualTips)}/year in tips alone.`
      : `NYC tipping culture has expanded — even counter-service spots now show tip screens. For ${diningType.replace('_', ' ')}, ${(tipPct * 100).toFixed(0)}% is appropriate for ${serviceLevel} service.`,
  }
}

/** #28 Suburb Commute vs City — Housing+Transit tradeoff */
function calcNYSuburbCommute(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const suburb = String(input.suburb || 'stamford')
  const householdIncome = Number(input.householdIncome || 150000)
  const commuteMode = String(input.commuteMode || 'train')

  // Suburb data: median rent, commuter rail monthly, drive time, train time
  const suburbs: Record<string, { name: string; rent2br: number; railMonthly: number; trainMin: number; driveMin: number; zone: string }> = {
    stamford: { name: 'Stamford, CT', rent2br: 2800, railMonthly: 360, trainMin: 50, driveMin: 70, zone: 'MN Zone 6' },
    white_plains: { name: 'White Plains, NY', rent2br: 2600, railMonthly: 283, trainMin: 40, driveMin: 55, zone: 'MN Zone 4' },
    hoboken: { name: 'Hoboken, NJ', rent2br: 3200, railMonthly: 89, trainMin: 15, driveMin: 35, zone: 'PATH' },
    jersey_city: { name: 'Jersey City, NJ', rent2br: 2900, railMonthly: 89, trainMin: 20, driveMin: 40, zone: 'PATH' },
    long_beach: { name: 'Long Beach, LI', rent2br: 2200, railMonthly: 270, trainMin: 55, driveMin: 75, zone: 'LIRR Zone 4' },
    new_rochelle: { name: 'New Rochelle, NY', rent2br: 2300, railMonthly: 248, trainMin: 35, driveMin: 45, zone: 'MN Zone 3' },
    maplewood: { name: 'Maplewood, NJ', rent2br: 2100, railMonthly: 300, trainMin: 45, driveMin: 55, zone: 'NJT Zone 3' },
    yonkers: { name: 'Yonkers, NY', rent2br: 2100, railMonthly: 170, trainMin: 30, driveMin: 40, zone: 'MN Zone 1' },
  }

  const sub = suburbs[suburb] || suburbs.stamford

  // NYC comparison: Manhattan 2BR median
  const nycRent = 4500
  const nycTransit = 127 // monthly MTA

  // Suburb costs
  const suburbRent = sub.rent2br
  const suburbTransit = commuteMode === 'train' ? sub.railMonthly + 127 : 0 // rail + subway
  const suburbDrive = commuteMode === 'drive' ? 650 : 0 // gas + tolls + parking approx

  const monthlySuburb = suburbRent + suburbTransit + suburbDrive
  const monthlyNYC = nycRent + nycTransit

  const monthlySavings = monthlyNYC - monthlySuburb
  const annualSavings = monthlySavings * 12

  // Time cost
  const commuteMin = commuteMode === 'train' ? sub.trainMin : sub.driveMin
  const monthlyCommuteHours = (commuteMin * 2 * 22) / 60
  const hourlyRate = householdIncome / 2080
  const timeCost = monthlyCommuteHours * hourlyRate

  const netMonthlySavings = monthlySavings - timeCost

  return {
    primary: { value: Math.round(monthlySavings), label: 'Monthly Housing Savings', unit: '$/mo' },
    secondary: [
      { label: 'Suburb', value: sub.name, unit: '' },
      { label: 'NYC Rent (2BR)', value: fmt(nycRent), unit: '/mo' },
      { label: 'Suburb Rent (2BR)', value: fmt(suburbRent), unit: '/mo' },
      { label: 'Commute Cost', value: fmt(suburbTransit + suburbDrive), unit: '/mo' },
      { label: 'Commute Time', value: `${commuteMin} min each way`, unit: '' },
      { label: 'Time Value Lost', value: fmt(timeCost), unit: '/mo' },
      { label: 'Net Savings', value: fmt(netMonthlySavings), unit: '/mo' },
    ],
    breakdown: [
      { label: 'Housing Savings', value: Math.round((nycRent - suburbRent) * 12), color: '#059669' },
      { label: 'Transit Cost', value: Math.round((suburbTransit + suburbDrive - nycTransit) * 12), color: '#DC2626' },
      { label: 'Time Cost', value: Math.round(timeCost * 12), color: '#CA8A04' },
    ],
    chartData: [
      { name: 'NYC Total', value: Math.round(monthlyNYC) },
      { name: `${sub.name} Total`, value: Math.round(monthlySuburb) },
      { name: 'Monthly Savings', value: Math.round(Math.max(0, monthlySavings)) },
    ],
    schedule: {
      headers: ['Suburb', '2BR Rent', 'Rail/mo', 'Train Time', 'Drive Time'],
      rows: Object.values(suburbs).map(s => [
        s.name, fmt(s.rent2br), fmt(s.railMonthly), `${s.trainMin} min`, `${s.driveMin} min`,
      ]),
    },
    advice: netMonthlySavings > 500
      ? `Moving to ${sub.name} saves ${fmt(annualSavings)}/year in housing, even after commute costs. Factor in quality of life — more space, quieter neighborhoods.`
      : netMonthlySavings > 0
        ? `${sub.name} saves ${fmt(monthlySavings)}/mo on rent but commute time erodes the advantage. At your income, time value costs ${fmt(timeCost)}/mo.`
        : `At current rents, ${sub.name} doesn't save enough to justify the commute. Consider closer suburbs like ${suburb === 'hoboken' ? 'Yonkers' : 'Hoboken'} for shorter commutes.`,
  }
}

/** #30 Parking Garage Calculator — Monthly by neighborhood */
function calcNYParkingGarage(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const neighborhood = String(input.neighborhood || 'midtown')
  const parkingType = String(input.parkingType || 'monthly')
  const vehicleSize = String(input.vehicleSize || 'standard')

  // Monthly parking rates by NYC neighborhood (2024 averages)
  const rates: Record<string, { monthly: number; daily: number; hourly: number; name: string }> = {
    midtown: { monthly: 600, daily: 55, hourly: 25, name: 'Midtown Manhattan' },
    fidi: { monthly: 500, daily: 45, hourly: 20, name: 'Financial District' },
    upper_east: { monthly: 550, daily: 45, hourly: 20, name: 'Upper East Side' },
    upper_west: { monthly: 500, daily: 42, hourly: 18, name: 'Upper West Side' },
    chelsea: { monthly: 480, daily: 40, hourly: 18, name: 'Chelsea' },
    soho: { monthly: 520, daily: 48, hourly: 22, name: 'SoHo / TriBeCa' },
    east_village: { monthly: 400, daily: 35, hourly: 15, name: 'East Village / LES' },
    brooklyn_heights: { monthly: 350, daily: 30, hourly: 12, name: 'Brooklyn Heights' },
    williamsburg: { monthly: 300, daily: 28, hourly: 12, name: 'Williamsburg' },
    lic: { monthly: 280, daily: 25, hourly: 10, name: 'Long Island City' },
    astoria: { monthly: 250, daily: 22, hourly: 10, name: 'Astoria' },
  }

  const spot = rates[neighborhood] || rates.midtown

  // Size surcharge
  const sizeMult: Record<string, number> = { compact: 0.85, standard: 1.0, suv: 1.2, oversized: 1.4 }
  const mult = sizeMult[vehicleSize] || 1.0

  let monthlyCost: number
  let costLabel: string
  if (parkingType === 'monthly') {
    monthlyCost = spot.monthly * mult
    costLabel = 'Monthly Rate'
  } else if (parkingType === 'daily') {
    monthlyCost = spot.daily * mult * 22 // 22 working days
    costLabel = 'Daily Rate x 22 days'
  } else {
    monthlyCost = spot.hourly * mult * 8 * 22 // 8 hrs x 22 days
    costLabel = 'Hourly Rate x 8hrs x 22 days'
  }

  const annualCost = monthlyCost * 12
  const dailyEquiv = monthlyCost / 30

  // Tax: NYC parking tax is 18.375% (state 8% + city 10.375%)
  const parkingTax = monthlyCost * 0.18375
  const totalWithTax = monthlyCost + parkingTax

  return {
    primary: { value: Math.round(totalWithTax), label: 'Monthly Parking (with tax)', unit: '$/mo' },
    secondary: [
      { label: 'Neighborhood', value: spot.name, unit: '' },
      { label: 'Base Rate', value: fmt(monthlyCost), unit: '/mo' },
      { label: 'NYC Parking Tax (18.4%)', value: fmt(parkingTax), unit: '/mo' },
      { label: 'Annual Cost', value: fmt(totalWithTax * 12), unit: '' },
      { label: 'Daily Equivalent', value: '$' + (totalWithTax / 30).toFixed(2), unit: '' },
      { label: costLabel, value: parkingType, unit: '' },
    ],
    breakdown: [
      { label: 'Base Parking', value: Math.round(monthlyCost * 12), color: '#1E3A8A' },
      { label: 'Parking Tax', value: Math.round(parkingTax * 12), color: '#DC2626' },
    ],
    chartData: Object.entries(rates).slice(0, 8).map(([, r]) => ({
      name: r.name.split(' ')[0], value: Math.round(r.monthly),
    })),
    schedule: {
      headers: ['Neighborhood', 'Monthly', 'Daily', 'Hourly'],
      rows: Object.values(rates).map(r => [
        r.name, fmt(r.monthly), '$' + r.daily, '$' + r.hourly,
      ]),
    },
    advice: annualCost > 6000
      ? `Parking in ${spot.name} costs ${fmt(totalWithTax * 12)}/year — more than many car payments. The 18.375% NYC parking tax adds ${fmt(parkingTax * 12)}/year alone. Consider transit or bike for daily commuting.`
      : `${spot.name} is relatively affordable for NYC parking. Still, at ${fmt(totalWithTax * 12)}/year with the 18.375% parking tax, it's a significant car ownership cost.`,
  }
}

/** #50 Broadway Budget — TKTS vs advance purchase vs premium */
function calcNYBroadwayBudget(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const showType = String(input.showType || 'musical')
  const purchaseMethod = String(input.purchaseMethod || 'tkts')
  const seats = Number(input.seats || 2)
  const includesDinner = String(input.includesDinner || 'yes') === 'yes'

  // Base ticket prices (2024 Broadway averages)
  const ticketPrices: Record<string, Record<string, number>> = {
    musical: { tkts: 85, advance: 140, premium: 275, lottery: 35, rush: 40 },
    play: { tkts: 60, advance: 100, premium: 200, lottery: 30, rush: 35 },
    offbroadway: { tkts: 45, advance: 75, premium: 120, lottery: 25, rush: 30 },
    special: { tkts: 110, advance: 200, premium: 450, lottery: 40, rush: 50 },
  }
  const basePrice = ticketPrices[showType]?.[purchaseMethod] || 140
  const ticketTotal = basePrice * seats

  // Service fees
  const serviceFee = purchaseMethod === 'tkts' ? 6 * seats : purchaseMethod === 'lottery' ? 0 : 15 * seats
  const facilityFee = 3 * seats

  // Dinner options (Theater District restaurants)
  const dinnerCosts: Record<string, number> = {
    quick: 25, // Joe Allen, Friedmans
    moderate: 65, // Carmine's, Sardi's
    upscale: 125, // The Lambs Club, Nobu
  }
  const dinnerPerPerson = includesDinner ? dinnerCosts.moderate : 0
  const dinnerTotal = dinnerPerPerson * seats
  const dinnerTax = dinnerTotal * 0.08875 // NYC 8.875% sales tax
  const dinnerTip = dinnerTotal * 0.20

  // Parking (if driving to theater district)
  const parkingCost = 45 // avg evening rate, Midtown garage

  // Transit alternative
  const transitCost = 2.90 * 2 * seats // round trip subway

  // Pre-show drinks
  const drinksCost = 18 * seats // avg cocktail at theater district bar

  // Total night out
  const totalWithDinner = ticketTotal + serviceFee + facilityFee + dinnerTotal + dinnerTax + dinnerTip + drinksCost + transitCost
  const totalWithoutDinner = ticketTotal + serviceFee + facilityFee + transitCost

  // Savings comparison
  const fullPriceEquiv = ticketPrices[showType]?.advance || 140
  const savings = (fullPriceEquiv - basePrice) * seats

  const showNames: Record<string, string> = { musical: 'Musical', play: 'Play', offbroadway: 'Off-Broadway', special: 'Special/Hit Show' }
  const methodNames: Record<string, string> = { tkts: 'TKTS Booth (25-50% off)', advance: 'Advance Purchase', premium: 'Premium/VIP', lottery: 'Digital Lottery', rush: 'Rush Tickets' }

  return {
    primary: { value: Math.round(includesDinner ? totalWithDinner : totalWithoutDinner), label: 'Total Night Out', unit: '$' },
    secondary: [
      { label: 'Ticket Total', value: fmt(Math.round(ticketTotal)), unit: '' },
      { label: 'Per Ticket', value: fmt(basePrice), unit: '' },
      { label: 'Fees', value: fmt(serviceFee + facilityFee), unit: '' },
      { label: 'Dinner + Drinks', value: includesDinner ? fmt(Math.round(dinnerTotal + dinnerTip + drinksCost)) : 'Not included', unit: '' },
      { label: 'vs Full Price', value: savings > 0 ? `Save ${fmt(savings)}` : 'Full price', unit: '' },
      { label: 'Method', value: methodNames[purchaseMethod] || purchaseMethod, unit: '' },
    ],
    breakdown: [
      { label: 'Tickets', value: Math.round(ticketTotal), color: '#1E3A8A' },
      { label: 'Fees', value: serviceFee + facilityFee, color: '#CA8A04' },
      ...(includesDinner ? [
        { label: 'Dinner', value: Math.round(dinnerTotal + dinnerTax + dinnerTip), color: '#059669' },
        { label: 'Drinks', value: Math.round(drinksCost), color: '#7C3AED' },
      ] : []),
      { label: 'Transit', value: Math.round(transitCost), color: '#6B7280' },
    ],
    chartData: [
      { name: 'TKTS', value: (ticketPrices[showType]?.tkts || 85) * seats },
      { name: 'Advance', value: (ticketPrices[showType]?.advance || 140) * seats },
      { name: 'Premium', value: (ticketPrices[showType]?.premium || 275) * seats },
      { name: 'Lottery', value: (ticketPrices[showType]?.lottery || 35) * seats },
      { name: 'Rush', value: (ticketPrices[showType]?.rush || 40) * seats },
    ],
    schedule: {
      headers: ['Purchase Method', 'Per Ticket', `${seats} Tickets`, 'Availability'],
      rows: [
        ['TKTS Booth (Times Sq)', fmt(ticketPrices[showType]?.tkts || 85), fmt((ticketPrices[showType]?.tkts || 85) * seats), 'Day-of, 25-50% off'],
        ['Advance Online', fmt(ticketPrices[showType]?.advance || 140), fmt((ticketPrices[showType]?.advance || 140) * seats), 'Guaranteed seats'],
        ['Premium/VIP', fmt(ticketPrices[showType]?.premium || 275), fmt((ticketPrices[showType]?.premium || 275) * seats), 'Best seats, extras'],
        ['Digital Lottery', fmt(ticketPrices[showType]?.lottery || 35), fmt((ticketPrices[showType]?.lottery || 35) * seats), 'Limited, luck-based'],
        ['Rush (Box Office)', fmt(ticketPrices[showType]?.rush || 40), fmt((ticketPrices[showType]?.rush || 40) * seats), 'First-come, day-of'],
      ],
    },
    advice: purchaseMethod === 'tkts'
      ? `TKTS booth in Times Square offers 25-50% off same-day tickets. Go to the Duffy Square booth (47th & Broadway) by 2pm for matinees or 5pm for evening shows. A ${showNames[showType]} night for ${seats} costs ~${fmt(Math.round(totalWithDinner))} total. Pro tip: the Lincoln Center TKTS has shorter lines.`
      : purchaseMethod === 'lottery'
        ? `Digital lotteries offer ${showNames[showType]} tickets for just ${fmt(basePrice)} — enter via TodayTix or show-specific apps 24 hours before. Odds are 1-5% but the savings are massive. Enter multiple lotteries to improve your chances.`
        : `${methodNames[purchaseMethod]} for ${showNames[showType]}: ${fmt(basePrice)}/ticket. ${includesDinner ? `With dinner at a Theater District restaurant, your full evening runs ${fmt(Math.round(totalWithDinner))}.` : ''} Take the subway (${fmt(transitCost)} round trip) — parking in Midtown costs $${parkingCost}+.`,
  }
}

export function calculateStateCostOfLiving(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!colBaseTypes.includes(baseType)) return null

  // Custom calculation handlers (NY cost of living)
  const customCalc = stateData.customCalc as string | undefined
  switch (customCalc) {
    case 'ny-cost-of-living': return calcNYCostOfLiving(input, stateData)
    case 'ny-bodega-grocery': return calcNYBodegaGrocery(input, stateData)
    case 'ny-coned-bill': return calcNYConEdBill(input, stateData)
    case 'ny-moving-to-nyc': return calcNYMovingToNYC(input, stateData)
    case 'ny-wedding-budget': return calcNYWeddingBudget(input, stateData)
    case 'ny-childcare-cost': return calcNYChildcareCost(input, stateData)
    case 'ny-restaurant-tip': return calcNYRestaurantTip(input, stateData)
    case 'ny-suburb-commute': return calcNYSuburbCommute(input, stateData)
    case 'ny-parking-garage': return calcNYParkingGarage(input, stateData)
    case 'ny-broadway-budget': return calcNYBroadwayBudget(input, stateData)
  }

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
