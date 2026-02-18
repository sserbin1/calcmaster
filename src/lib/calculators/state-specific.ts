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

// ═══════════════════════════════════════════════════════════════════
// NY TRANSPORT — Custom calculation functions
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()
const fmtD = (n: number) => '$' + n.toFixed(2)

/** #23 MTA Fare Calculator — OMNY capping vs MetroCard */
function calcNYMtaFare(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const tripsPerWeek = Number(input.tripsPerWeek || 10)
  const fareType = String(input.fareType || 'omny')
  const reducedFare = String(input.reducedFare || 'no') === 'yes'
  const weeksPerYear = 50

  const baseFare = 2.90
  const reducedRate = reducedFare ? 0.5 : 1.0
  const fare = baseFare * reducedRate

  // OMNY: $2.90/ride, capped at $34/wk (like a weekly) = ~11.7 rides free after cap
  const omnyWeeklyCap = 34.00 * reducedRate
  const weeklyOmny = Math.min(tripsPerWeek * fare, omnyWeeklyCap)

  // MetroCard weekly unlimited = $33
  const weeklyUnlimited = 33.00 * reducedRate
  // MetroCard monthly = $127
  const monthlyUnlimited = 127.00 * reducedRate
  // Pay per ride (11% bonus on $5.50+)
  const payPerRideWeekly = tripsPerWeek * fare * 0.91 // 11% bonus = pay ~91%

  let weeklyCost: number
  let method: string
  if (fareType === 'omny') {
    weeklyCost = weeklyOmny
    method = 'OMNY (fare capping)'
  } else if (fareType === 'weekly') {
    weeklyCost = weeklyUnlimited
    method = 'MetroCard Weekly'
  } else if (fareType === 'monthly') {
    weeklyCost = monthlyUnlimited / 4.33
    method = 'MetroCard Monthly'
  } else {
    weeklyCost = payPerRideWeekly
    method = 'Pay-Per-Ride'
  }

  const monthlyCost = weeklyCost * 4.33
  const annualCost = weeklyCost * weeksPerYear

  // Comparison: find cheapest
  const options = [
    { name: 'OMNY Capping', weekly: weeklyOmny },
    { name: 'Weekly Unlimited', weekly: weeklyUnlimited },
    { name: 'Monthly Unlimited', weekly: monthlyUnlimited / 4.33 },
    { name: 'Pay-Per-Ride', weekly: payPerRideWeekly },
  ].sort((a, b) => a.weekly - b.weekly)

  const cheapest = options[0]
  const savingsVsCurrent = (weeklyCost - cheapest.weekly) * weeksPerYear

  return {
    primary: { value: Math.round(monthlyCost), label: 'Monthly Transit Cost', unit: '$/mo' },
    secondary: [
      { label: 'Your Method', value: method, unit: '' },
      { label: 'Weekly Cost', value: fmtD(weeklyCost), unit: '' },
      { label: 'Annual Cost', value: fmt(annualCost), unit: '' },
      { label: 'Per-Trip Cost', value: fmtD(weeklyCost / tripsPerWeek), unit: '' },
      { label: 'Best Option', value: cheapest.name, unit: '' },
      { label: 'Potential Savings', value: fmt(Math.max(0, savingsVsCurrent)), unit: '/yr' },
    ],
    breakdown: [
      { label: 'OMNY Capping', value: Math.round(weeklyOmny * weeksPerYear), color: '#1E3A8A' },
      { label: 'Weekly Unlimited', value: Math.round(weeklyUnlimited * weeksPerYear), color: '#059669' },
      { label: 'Monthly Unlimited', value: Math.round(monthlyUnlimited * 12), color: '#CA8A04' },
      { label: 'Pay-Per-Ride', value: Math.round(payPerRideWeekly * weeksPerYear), color: '#DC2626' },
    ],
    chartData: options.map(o => ({ name: o.name, value: Math.round(o.weekly * weeksPerYear) })),
    schedule: {
      headers: ['Fare Method', 'Weekly', 'Monthly', 'Annual'],
      rows: options.map(o => [
        o.name,
        fmtD(o.weekly),
        fmt(o.weekly * 4.33),
        fmt(o.weekly * weeksPerYear),
      ]),
    },
    advice: tripsPerWeek >= 12
      ? 'At 12+ trips/week, unlimited passes or OMNY capping saves the most. OMNY auto-caps at $34/week — no need to pre-pay.'
      : tripsPerWeek >= 8
        ? 'At 8-11 trips/week, OMNY capping and weekly unlimited are close. OMNY is more flexible since you only pay for rides taken.'
        : 'At fewer than 8 trips/week, pay-per-ride is cheapest. Consider OMNY for convenience — you still get the weekly cap safety net.',
  }
}

/** #24 Car Ownership Cost NYC */
function calcNYCarOwnership(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const borough = String(input.borough || 'manhattan')
  const vehicleType = String(input.vehicleType || 'sedan')
  const annualMiles = Number(input.annualMiles || 8000)
  const hasGarage = String(input.parkingType || 'garage') === 'garage'

  // Parking by borough (monthly)
  const parkingCosts: Record<string, { garage: number; street: number }> = {
    manhattan: { garage: 550, street: 0 }, // ASP stress
    brooklyn: { garage: 300, street: 0 },
    queens: { garage: 200, street: 0 },
    bronx: { garage: 175, street: 0 },
    staten_island: { garage: 100, street: 0 },
  }
  const parking = parkingCosts[borough] || parkingCosts.manhattan
  const monthlyParking = hasGarage ? parking.garage : parking.street

  // Insurance by borough (annual) — NYC among highest in US
  const insuranceCosts: Record<string, number> = {
    manhattan: 3800, brooklyn: 3400, queens: 2900, bronx: 3600, staten_island: 2500,
  }
  const annualInsurance = insuranceCosts[borough] || 3200

  // Vehicle type adjustments
  const vehicleFactor: Record<string, number> = {
    economy: 0.8, sedan: 1.0, suv: 1.25, luxury: 1.6,
  }
  const vFactor = vehicleFactor[vehicleType] || 1.0

  // Fuel: NYC gas ~$3.80/gal average
  const mpg = vehicleType === 'economy' ? 35 : vehicleType === 'suv' ? 22 : vehicleType === 'luxury' ? 20 : 28
  const gasPrice = 3.80
  const annualFuel = (annualMiles / mpg) * gasPrice

  // Maintenance + repairs
  const annualMaintenance = annualMiles * 0.09 * vFactor

  // Registration + inspection ($90 reg + $37 inspection)
  const regInspection = 127

  // Tolls estimate (bridges, tunnels, congestion pricing)
  const tollEstimates: Record<string, number> = {
    manhattan: 2400, brooklyn: 1800, queens: 1500, bronx: 1200, staten_island: 2000,
  }
  const annualTolls = tollEstimates[borough] || 1500

  // Depreciation (avg $3,500/yr)
  const annualDepreciation = 3500 * vFactor

  const annualTotal = (monthlyParking * 12) + annualInsurance * vFactor + annualFuel +
    annualMaintenance + regInspection + annualTolls + annualDepreciation
  const monthlyTotal = annualTotal / 12

  // Compare with transit
  const monthlyTransit = 127 // MTA monthly unlimited

  return {
    primary: { value: Math.round(monthlyTotal), label: 'Monthly Car Cost', unit: '$/mo' },
    secondary: [
      { label: 'Annual Cost', value: fmt(annualTotal), unit: '' },
      { label: 'Monthly Transit', value: fmt(monthlyTransit), unit: '' },
      { label: 'Car Premium', value: fmt(monthlyTotal - monthlyTransit), unit: '/mo' },
      { label: 'Cost per Mile', value: fmtD(annualTotal / annualMiles), unit: '' },
      { label: 'Borough', value: borough.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()), unit: '' },
    ],
    breakdown: [
      { label: 'Parking', value: monthlyParking * 12, color: '#1E3A8A' },
      { label: 'Insurance', value: Math.round(annualInsurance * vFactor), color: '#DC2626' },
      { label: 'Fuel', value: Math.round(annualFuel), color: '#CA8A04' },
      { label: 'Tolls', value: annualTolls, color: '#7C3AED' },
      { label: 'Maintenance', value: Math.round(annualMaintenance), color: '#059669' },
      { label: 'Depreciation', value: Math.round(annualDepreciation), color: '#10B981' },
      { label: 'Reg & Inspection', value: regInspection, color: '#6B7280' },
    ],
    chartData: [
      { name: 'Car (Annual)', value: Math.round(annualTotal) },
      { name: 'Transit (Annual)', value: monthlyTransit * 12 },
      { name: 'Difference', value: Math.round(annualTotal - monthlyTransit * 12) },
    ],
    advice: monthlyTotal > 800
      ? `Owning a car in ${borough === 'manhattan' ? 'Manhattan' : 'NYC'} costs ${fmt(monthlyTotal)}/mo — ${Math.round(monthlyTotal / monthlyTransit)}x more than an unlimited MetroCard. Consider if you really need daily car access.`
      : `Car ownership in ${borough.replace('_', ' ')} is relatively affordable for NYC at ${fmt(monthlyTotal)}/mo, but still ${Math.round(monthlyTotal / monthlyTransit)}x the cost of transit.`,
  }
}

/** #25 LIRR / Metro-North Commuter Rail */
function calcNYCommuterRail(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const railroad = String(input.railroad || 'lirr')
  const zone = Number(input.zone || 3)
  const peakTravel = String(input.peakTravel || 'peak') === 'peak'
  const daysPerWeek = Number(input.daysPerWeek || 5)

  // Monthly pass prices (2024 rates, approximate)
  // LIRR zones: 1 (Penn Zone) through 14
  const lirrMonthly: Record<number, { peak: number; offpeak: number }> = {
    1: { peak: 197, offpeak: 142 }, // Zone 1 (Penn)
    3: { peak: 270, offpeak: 195 },
    4: { peak: 308, offpeak: 222 },
    7: { peak: 398, offpeak: 287 },
    9: { peak: 453, offpeak: 327 },
    12: { peak: 536, offpeak: 387 },
    14: { peak: 604, offpeak: 436 },
  }
  // Metro-North zones: 1 through 10+
  const mnMonthly: Record<number, { peak: number; offpeak: number }> = {
    1: { peak: 170, offpeak: 123 },
    3: { peak: 248, offpeak: 179 },
    4: { peak: 283, offpeak: 204 },
    6: { peak: 360, offpeak: 260 },
    8: { peak: 430, offpeak: 310 },
    10: { peak: 510, offpeak: 368 },
  }

  const rates = railroad === 'lirr' ? lirrMonthly : mnMonthly
  // Find nearest zone
  const zones = Object.keys(rates).map(Number).sort((a, b) => a - b)
  const nearestZone = zones.reduce((prev, curr) =>
    Math.abs(curr - zone) < Math.abs(prev - zone) ? curr : prev
  )
  const zoneRates = rates[nearestZone]
  const monthlyPass = peakTravel ? zoneRates.peak : zoneRates.offpeak

  // Per-trip (one-way) ticket
  const perTripPeak = monthlyPass / 40 * 1.3 // ~30% more than monthly per-trip equivalent
  const perTripOffpeak = perTripPeak * 0.72

  // Calculate actual cost based on days
  const tripsPerMonth = daysPerWeek * 2 * 4.33 // round trips
  const payPerTrip = tripsPerMonth * (peakTravel ? perTripPeak : perTripOffpeak)

  const cheaperOption = monthlyPass < payPerTrip ? 'Monthly Pass' : 'Pay-Per-Ride'
  const monthlyCost = Math.min(monthlyPass, payPerTrip)
  const annualCost = monthlyCost * 12

  // Add subway connection
  const subwayMonthly = 127 // MetroCard monthly
  const totalWithSubway = monthlyCost + subwayMonthly
  const railName = railroad === 'lirr' ? 'LIRR' : 'Metro-North'

  return {
    primary: { value: Math.round(totalWithSubway), label: 'Monthly Commute (Rail + Subway)', unit: '$/mo' },
    secondary: [
      { label: `${railName} Only`, value: fmt(monthlyCost), unit: '/mo' },
      { label: 'Subway Connect', value: fmt(subwayMonthly), unit: '/mo' },
      { label: 'Annual Total', value: fmt(totalWithSubway * 12), unit: '' },
      { label: 'Best Option', value: cheaperOption, unit: '' },
      { label: 'Zone', value: `Zone ${zone}`, unit: '' },
      { label: 'Per Trip', value: fmtD(monthlyCost / tripsPerMonth), unit: '' },
    ],
    breakdown: [
      { label: `${railName} Pass`, value: Math.round(monthlyCost * 12), color: '#1E3A8A' },
      { label: 'Subway/Bus', value: subwayMonthly * 12, color: '#059669' },
    ],
    chartData: [
      { name: 'Monthly Pass', value: Math.round(monthlyPass) },
      { name: 'Pay-Per-Ride', value: Math.round(payPerTrip) },
    ],
    schedule: {
      headers: ['Option', 'Monthly', 'Annual', 'Per Trip'],
      rows: [
        ['Peak Monthly Pass', fmt(zoneRates.peak), fmt(zoneRates.peak * 12), fmtD(zoneRates.peak / (5 * 2 * 4.33))],
        ['Off-Peak Monthly', fmt(zoneRates.offpeak), fmt(zoneRates.offpeak * 12), fmtD(zoneRates.offpeak / (5 * 2 * 4.33))],
        [`Peak Per-Ride (${daysPerWeek}d/wk)`, fmt(tripsPerMonth * perTripPeak), fmt(tripsPerMonth * perTripPeak * 12), fmtD(perTripPeak)],
        [`+ Subway Monthly`, fmt(subwayMonthly), fmt(subwayMonthly * 12), '—'],
      ],
    },
    advice: daysPerWeek >= 4
      ? `At ${daysPerWeek} days/week, a monthly pass is your best value. The ${railName} Zone ${zone} ${peakTravel ? 'peak' : 'off-peak'} pass saves ${fmt(Math.max(0, payPerTrip - monthlyPass))}/mo vs per-ride tickets.`
      : `At ${daysPerWeek} days/week, per-ride tickets may be cheaper. Consider off-peak trains (25-30% cheaper) if your schedule allows.`,
  }
}

/** #26 Bridge & Tunnel Tolls */
function calcNYBridgeTolls(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const crossing = String(input.crossing || 'lincoln')
  const hasEZPass = String(input.hasEZPass || 'yes') === 'yes'
  const tripsPerMonth = Number(input.tripsPerMonth || 20)
  const vehicleType = String(input.vehicleType || 'car')

  // 2024 toll rates (one-way, car)
  const tolls: Record<string, { ezpass: number; cash: number; name: string }> = {
    gwb: { ezpass: 11.75, cash: 16.00, name: 'George Washington Bridge' },
    lincoln: { ezpass: 11.75, cash: 16.00, name: 'Lincoln Tunnel' },
    holland: { ezpass: 11.75, cash: 16.00, name: 'Holland Tunnel' },
    verrazano: { ezpass: 6.55, cash: 16.00, name: 'Verrazano-Narrows' },
    bayonne: { ezpass: 11.75, cash: 16.00, name: 'Bayonne Bridge' },
    goethals: { ezpass: 11.75, cash: 16.00, name: 'Goethals Bridge' },
    outerbridge: { ezpass: 11.75, cash: 16.00, name: 'Outerbridge Crossing' },
    triboro: { ezpass: 6.55, cash: 8.50, name: 'RFK (Triboro) Bridge' },
    throgs_neck: { ezpass: 6.55, cash: 8.50, name: 'Throgs Neck Bridge' },
    bronx_whitestone: { ezpass: 6.55, cash: 8.50, name: 'Bronx-Whitestone' },
    queens_midtown: { ezpass: 6.55, cash: 8.50, name: 'Queens Midtown Tunnel' },
    battery: { ezpass: 6.55, cash: 8.50, name: 'Hugh L. Carey Tunnel' },
    henry_hudson: { ezpass: 6.55, cash: 8.50, name: 'Henry Hudson Bridge' },
    marine_parkway: { ezpass: 4.12, cash: 5.50, name: 'Marine Parkway Bridge' },
    cross_bay: { ezpass: 4.12, cash: 5.50, name: 'Cross Bay Bridge' },
  }

  const tollInfo = tolls[crossing] || tolls.lincoln
  const baseToll = hasEZPass ? tollInfo.ezpass : tollInfo.cash

  // Vehicle multiplier
  const vehicleMult: Record<string, number> = {
    car: 1.0, suv: 1.0, truck_2axle: 1.5, truck_3axle: 3.0, motorcycle: 0.65,
  }
  const tollPerTrip = baseToll * (vehicleMult[vehicleType] || 1.0)
  const monthlyCost = tollPerTrip * tripsPerMonth
  const annualCost = monthlyCost * 12
  const ezpassSavings = hasEZPass ? 0 : (tollInfo.cash - tollInfo.ezpass) * tripsPerMonth * 12

  // Congestion pricing add-on (if entering Manhattan below 60th St)
  const congestionZoneCrossings = ['lincoln', 'holland', 'queens_midtown', 'battery']
  const hasCongestion = congestionZoneCrossings.includes(crossing)
  const congestionToll = hasCongestion ? 9.00 : 0
  const congestionCredit = hasCongestion ? Math.min(congestionToll, 3.00) : 0 // PA crossings get $3 credit
  const netCongestion = congestionToll - congestionCredit

  const totalMonthly = monthlyCost + (netCongestion * tripsPerMonth)
  const totalAnnual = totalMonthly * 12

  return {
    primary: { value: Math.round(totalMonthly), label: 'Monthly Toll Cost', unit: '$/mo' },
    secondary: [
      { label: 'Crossing', value: tollInfo.name, unit: '' },
      { label: 'Per Trip', value: fmtD(tollPerTrip), unit: '' },
      { label: 'Annual Cost', value: fmt(totalAnnual), unit: '' },
      { label: 'E-ZPass', value: hasEZPass ? 'Yes' : 'No', unit: '' },
      ...(hasCongestion ? [{ label: 'Congestion Fee', value: fmtD(netCongestion), unit: '/trip' }] : []),
      ...(!hasEZPass ? [{ label: 'E-ZPass Would Save', value: fmt(ezpassSavings), unit: '/yr' }] : []),
    ],
    breakdown: [
      { label: 'Base Tolls', value: Math.round(monthlyCost * 12), color: '#1E3A8A' },
      ...(hasCongestion ? [{ label: 'Congestion Pricing', value: Math.round(netCongestion * tripsPerMonth * 12), color: '#DC2626' }] : []),
    ],
    chartData: [
      { name: 'E-ZPass Rate', value: Math.round(tollInfo.ezpass * tripsPerMonth * 12) },
      { name: 'Cash Rate', value: Math.round(tollInfo.cash * tripsPerMonth * 12) },
    ],
    schedule: {
      headers: ['Crossing', 'E-ZPass', 'Cash/Mail', 'Congestion'],
      rows: Object.entries(tolls).slice(0, 10).map(([, t]) => [
        t.name,
        fmtD(t.ezpass),
        fmtD(t.cash),
        congestionZoneCrossings.includes(crossing) ? '$9.00' : '—',
      ]),
    },
    advice: !hasEZPass
      ? `Get E-ZPass immediately — you'd save ${fmt(ezpassSavings)}/year. Cash tolls are 35-145% higher at NYC crossings.`
      : hasCongestion
        ? `Your crossing enters the congestion zone. The $9 toll applies but you get a ${fmtD(congestionCredit)} credit for MTA crossings.`
        : `E-ZPass saves you ${fmtD(tollInfo.cash - tollInfo.ezpass)} per trip vs cash. At ${tripsPerMonth} trips/mo, that's ${fmt((tollInfo.cash - tollInfo.ezpass) * tripsPerMonth * 12)}/year.`,
  }
}

/** #27 Congestion Pricing Calculator */
function calcNYCongestionPricing(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const vehicleType = String(input.vehicleType || 'car')
  const frequency = String(input.tripFrequency || 'daily')
  const hasEZPass = String(input.hasEZPass || 'yes') === 'yes'
  const timeOfDay = String(input.timeOfDay || 'peak')

  // Congestion pricing rates (effective Jan 2025)
  // Peak: 5AM-9PM weekdays, 9AM-9PM weekends
  // Off-peak: 9PM-5AM weekdays, 9PM-9AM weekends
  const rates: Record<string, { peak: number; offpeak: number; overnight: number }> = {
    car: { peak: 9.00, offpeak: 9.00, overnight: 2.25 },
    small_truck: { peak: 14.40, offpeak: 14.40, overnight: 3.60 },
    large_truck: { peak: 21.60, offpeak: 21.60, overnight: 5.40 },
    motorcycle: { peak: 4.50, offpeak: 4.50, overnight: 1.13 },
    taxi: { peak: 0.75, offpeak: 0.75, overnight: 0.75 }, // per trip surcharge
    rideshare: { peak: 1.50, offpeak: 1.50, overnight: 1.50 }, // per trip
  }

  const rate = rates[vehicleType] || rates.car
  const tollPerTrip = timeOfDay === 'overnight' ? rate.overnight : rate.peak
  // No E-ZPass: +50% for car/trucks via mail
  const actualToll = (hasEZPass || vehicleType === 'taxi' || vehicleType === 'rideshare')
    ? tollPerTrip
    : tollPerTrip * 1.5

  // Frequency to monthly trips
  const freqMap: Record<string, number> = {
    daily: 22, '3x_week': 13, '2x_week': 9, weekly: 4, occasional: 2,
  }
  const monthlyTrips = freqMap[frequency] || 22

  const monthlyCost = actualToll * monthlyTrips
  const annualCost = monthlyCost * 12

  // Credits for tunnel/bridge tolls
  const tunnelCredit = 3.00 // PA crossings
  const mtaBridgeCredit = Math.min(actualToll, 6.55) // MTA bridges

  // Alternative: avoid congestion zone
  const detourPenalty = 20 // extra minutes
  const fuelCostDetour = 3.50 // approximate extra fuel

  return {
    primary: { value: Math.round(monthlyCost), label: 'Monthly Congestion Cost', unit: '$/mo' },
    secondary: [
      { label: 'Per Trip', value: fmtD(actualToll), unit: '' },
      { label: 'Annual Cost', value: fmt(annualCost), unit: '' },
      { label: 'Vehicle Type', value: vehicleType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()), unit: '' },
      { label: 'Time', value: timeOfDay === 'overnight' ? 'Overnight (75% off)' : 'Peak', unit: '' },
      { label: 'Tunnel Credit', value: fmtD(tunnelCredit), unit: '' },
      { label: 'MTA Bridge Credit', value: fmtD(mtaBridgeCredit), unit: '' },
    ],
    breakdown: [
      { label: 'Congestion Tolls', value: Math.round(annualCost), color: '#DC2626' },
      { label: 'Potential Credits', value: Math.round((tunnelCredit + mtaBridgeCredit) * monthlyTrips * 12 / 2), color: '#059669' },
    ],
    chartData: [
      { name: 'Peak', value: Math.round(rate.peak * monthlyTrips * 12) },
      { name: 'Overnight', value: Math.round(rate.overnight * monthlyTrips * 12) },
      { name: 'With Credits', value: Math.round((rate.peak - tunnelCredit) * monthlyTrips * 12) },
    ],
    schedule: {
      headers: ['Vehicle', 'Peak', 'Overnight', 'No E-ZPass'],
      rows: [
        ['Car/SUV', '$9.00', '$2.25', '$13.50'],
        ['Small Truck', '$14.40', '$3.60', '$21.60'],
        ['Large Truck/Bus', '$21.60', '$5.40', '$32.40'],
        ['Motorcycle', '$4.50', '$1.13', '$6.75'],
        ['Taxi (surcharge)', '$0.75', '$0.75', '$0.75'],
        ['Rideshare (surcharge)', '$1.50', '$1.50', '$1.50'],
      ],
    },
    advice: timeOfDay !== 'overnight'
      ? `Overnight trips (9PM-5AM) save 75% — ${fmtD(rate.peak - rate.overnight)} per trip. If you commute ${frequency.replace('_', ' ')}, switching to overnight could save ${fmt((rate.peak - rate.overnight) * monthlyTrips * 12)}/year.`
      : `You're already paying overnight rates (75% discount). At ${fmtD(rate.overnight)}/trip, your congestion cost is minimized. Detour adds ~${detourPenalty} min and ~${fmtD(fuelCostDetour)} in fuel — not worth it.`,
  }
}

/** #39 Lottery Tax NYC — triple tax on winnings */
function calcNYLotteryTax(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const winnings = Number(input.winnings || 1000000)
  const paymentOption = String(input.paymentOption || 'lump')
  const nycResident = String(input.nycResident || 'yes') === 'yes'

  const lumpSumPct = 0.60
  const grossPayout = paymentOption === 'lump' ? winnings * lumpSumPct : winnings

  // Federal tax (37% for >$578,125 in 2024)
  const fedRate = grossPayout > 578125 ? 0.37 : grossPayout > 231250 ? 0.35 : 0.32
  const fedTax = grossPayout * fedRate

  // NYS tax (10.9% top rate)
  const nysRate = 0.109
  const nysTax = grossPayout * nysRate

  // NYC tax (3.876% for residents)
  const nycRate = nycResident ? 0.03876 : 0
  const nycTax = grossPayout * nycRate

  const totalTax = fedTax + nysTax + nycTax
  const netPayout = grossPayout - totalTax
  const effectiveRate = (totalTax / grossPayout) * 100

  // Annuity comparison
  const annuityAnnual = winnings / 30
  const annuityFedTax = annuityAnnual * 0.35
  const annuityNYSTax = annuityAnnual * nysRate
  const annuityNYCTax = annuityAnnual * nycRate
  const annuityNet = annuityAnnual - annuityFedTax - annuityNYSTax - annuityNYCTax
  const annuity30YrNet = annuityNet * 30

  return {
    primary: { value: Math.round(netPayout), label: 'Net Lump Sum Payout', unit: '$' },
    secondary: [
      { label: 'Jackpot', value: fmt(winnings), unit: '' },
      { label: 'Gross Payout', value: fmt(grossPayout), unit: '' },
      { label: 'Federal Tax', value: fmt(fedTax), unit: '' },
      { label: 'NYS Tax', value: fmt(nysTax), unit: '' },
      { label: 'NYC Tax', value: nycResident ? fmt(nycTax) : 'N/A (non-resident)', unit: '' },
      { label: 'Effective Rate', value: `${effectiveRate.toFixed(1)}%`, unit: '' },
    ],
    breakdown: [
      { label: 'Net Payout', value: Math.round(netPayout), color: '#059669' },
      { label: 'Federal Tax', value: Math.round(fedTax), color: '#1E3A8A' },
      { label: 'NYS Tax', value: Math.round(nysTax), color: '#CA8A04' },
      ...(nycResident ? [{ label: 'NYC Tax', value: Math.round(nycTax), color: '#DC2626' }] : []),
    ],
    chartData: [
      { name: 'Lump Sum Net', value: Math.round(netPayout) },
      { name: 'Annuity 30yr Net', value: Math.round(annuity30YrNet) },
    ],
    schedule: {
      headers: ['Tax Layer', 'Rate', 'Amount'],
      rows: [
        ['Federal', `${(fedRate * 100).toFixed(0)}%`, fmt(fedTax)],
        ['New York State', `${(nysRate * 100).toFixed(1)}%`, fmt(nysTax)],
        ...(nycResident ? [['New York City', `${(nycRate * 100).toFixed(3)}%`, fmt(nycTax)]] : []),
        ['Total Tax', `${effectiveRate.toFixed(1)}%`, fmt(totalTax)],
        ['Net Payout', '', fmt(netPayout)],
      ],
    },
    advice: nycResident
      ? `NYC residents face the "triple tax" on lottery winnings: Federal (${(fedRate * 100).toFixed(0)}%) + NYS (10.9%) + NYC (3.876%) = ${effectiveRate.toFixed(1)}% total. A ${fmt(winnings)} jackpot nets only ${fmt(netPayout)} lump sum. Annuity pays ${fmt(annuityNet)}/year for 30 years.`
      : `Non-NYC residents avoid the 3.876% city tax, saving ${fmt(grossPayout * 0.03876)}. Your effective rate is ${effectiveRate.toFixed(1)}%.`,
  }
}

/** #40 Child Support NY — CSSA formula */
function calcNYChildSupport(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const payerIncome = Number(input.payerIncome || 80000)
  const otherIncome = Number(input.otherIncome || 50000)
  const children = Number(input.children || 1)
  const custody = String(input.custody || 'primary')

  // NY Child Support Standards Act (CSSA)
  const cssaCap = 163000
  const combinedIncome = payerIncome + otherIncome
  const cappedIncome = Math.min(combinedIncome, cssaCap)
  const excessIncome = Math.max(0, combinedIncome - cssaCap)

  const cssaPct: Record<number, number> = { 1: 0.17, 2: 0.25, 3: 0.29, 4: 0.31, 5: 0.35 }
  const pct = cssaPct[Math.min(children, 5)] || 0.17

  const payerShare = combinedIncome > 0 ? payerIncome / combinedIncome : 0.5
  const basicObligation = cappedIncome * pct
  const payerObligation = basicObligation * payerShare
  const excessObligation = excessIncome * pct * payerShare * 0.5
  const totalMonthly = (payerObligation + excessObligation) / 12

  const sharedReduction = custody === 'shared' ? 0.25 : 0
  const adjustedMonthly = totalMonthly * (1 - sharedReduction)

  const ficaDeduction = payerIncome * 0.0765

  return {
    primary: { value: Math.round(adjustedMonthly), label: 'Monthly Child Support', unit: '$/mo' },
    secondary: [
      { label: 'Annual Amount', value: fmt(adjustedMonthly * 12), unit: '' },
      { label: 'CSSA Percentage', value: `${(pct * 100).toFixed(0)}% (${children} child${children > 1 ? 'ren' : ''})`, unit: '' },
      { label: 'Your Income Share', value: `${(payerShare * 100).toFixed(0)}%`, unit: '' },
      { label: 'Combined Income', value: fmt(combinedIncome), unit: '' },
      ...(custody === 'shared' ? [{ label: 'Shared Custody Adj', value: '-25%', unit: '' }] : []),
      ...(excessIncome > 0 ? [{ label: 'Above CSSA Cap', value: fmt(excessIncome), unit: '' }] : []),
    ],
    breakdown: [
      { label: 'Basic Obligation', value: Math.round(payerObligation), color: '#1E3A8A' },
      ...(excessObligation > 0 ? [{ label: 'Excess Income', value: Math.round(excessObligation), color: '#CA8A04' }] : []),
    ],
    chartData: [
      { name: '1 Child (17%)', value: Math.round(cappedIncome * 0.17 * payerShare / 12) },
      { name: '2 Children (25%)', value: Math.round(cappedIncome * 0.25 * payerShare / 12) },
      { name: '3 Children (29%)', value: Math.round(cappedIncome * 0.29 * payerShare / 12) },
    ],
    schedule: {
      headers: ['Children', 'CSSA %', 'Monthly (Your Share)', 'Annual'],
      rows: [1, 2, 3, 4, 5].map(n => {
        const p = cssaPct[n] || 0.35
        const mo = (cappedIncome * p * payerShare) / 12
        return [`${n} child${n > 1 ? 'ren' : ''}`, `${(p * 100).toFixed(0)}%`, fmt(mo), fmt(mo * 12)]
      }),
    },
    advice: `NY uses the CSSA formula: ${(pct * 100).toFixed(0)}% of combined income (capped at ${fmt(cssaCap)}) for ${children} child${children > 1 ? 'ren' : ''}. Your share (${(payerShare * 100).toFixed(0)}%) = ${fmt(adjustedMonthly)}/month. FICA deduction (${fmt(ficaDeduction)}) can reduce the base calculation.`,
  }
}

/** #48 Solar Panel ROI — NYSERDA NY-Sun incentives */
function calcNYSolarNyserda(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const systemSize = Number(input.systemSize || 8)
  const monthlyBill = Number(input.monthlyBill || 180)
  const region = String(input.region || 'downstate')
  const roofType = String(input.roofType || 'owned')

  // Installation cost (2024 NY average: ~$3.50/watt before incentives)
  const costPerWatt = 3.50
  const grossCost = systemSize * 1000 * costPerWatt

  // Federal ITC (30%)
  const federalCredit = grossCost * 0.30

  // NYSERDA NY-Sun incentive (per watt, varies by region + sector)
  const nyserdaRates: Record<string, number> = {
    downstate: 0.20, // ConEd / downstate utilities — lower incentive
    upstate: 0.35, // Upstate utilities — higher incentive
    long_island: 0.15, // PSEG LI — lowest
  }
  const nyserdaPerWatt = nyserdaRates[region] || 0.20
  const nyserdaIncentive = systemSize * 1000 * nyserdaPerWatt

  // NY State tax credit (25% of system cost, max $5,000)
  const nyStateTaxCredit = Math.min(grossCost * 0.25, 5000)

  // Property tax exemption (NY: 15 years, solar systems exempt from property tax increase)
  const propertyTaxSavings = 0 // exempt — no increase despite home value bump

  // Net cost after all incentives
  const netCost = grossCost - federalCredit - nyserdaIncentive - nyStateTaxCredit

  // Annual production (kWh) — NY averages 1,200 kWh/kW/year
  const annualKwh = systemSize * (region === 'upstate' ? 1150 : 1250)

  // Electricity rate (NY has highest rates in continental US)
  const rates: Record<string, number> = {
    downstate: 0.28, // ConEd — $0.28/kWh avg
    upstate: 0.19, // National Grid / RG&E
    long_island: 0.26, // PSEG LI
  }
  const electricRate = rates[region] || 0.28
  const annualSavings = annualKwh * electricRate

  // Net metering (NY: 1:1 credits through VDER for most residential)
  const monthlyProduction = annualKwh / 12
  const monthlyConsumption = monthlyBill / electricRate
  const offsetPercent = Math.min(100, (monthlyProduction / monthlyConsumption) * 100)

  // Payback period
  const paybackYears = netCost / annualSavings

  // 25-year savings
  const twentyFiveYearSavings = annualSavings * 25 * 1.03 - netCost // 3% rate increase avg
  const roi = ((twentyFiveYearSavings + netCost) / netCost) * 100

  const regionNames: Record<string, string> = { downstate: 'Downstate (ConEd)', upstate: 'Upstate', long_island: 'Long Island (PSEG LI)' }

  return {
    primary: { value: Math.round(netCost), label: 'Net Cost After Incentives', unit: '$' },
    secondary: [
      { label: 'Gross System Cost', value: fmt(Math.round(grossCost)), unit: '' },
      { label: 'Federal ITC (30%)', value: `-${fmt(Math.round(federalCredit))}`, unit: '' },
      { label: 'NYSERDA NY-Sun', value: `-${fmt(Math.round(nyserdaIncentive))}`, unit: '' },
      { label: 'NY State Credit', value: `-${fmt(nyStateTaxCredit)}`, unit: '' },
      { label: 'Annual Savings', value: fmt(Math.round(annualSavings)), unit: '/yr' },
      { label: 'Payback Period', value: `${paybackYears.toFixed(1)} years`, unit: '' },
      { label: 'Bill Offset', value: `${offsetPercent.toFixed(0)}%`, unit: '' },
      { label: '25-Year ROI', value: `${roi.toFixed(0)}%`, unit: '' },
    ],
    breakdown: [
      { label: 'Your Net Cost', value: Math.round(netCost), color: '#1E3A8A' },
      { label: 'Federal ITC', value: Math.round(federalCredit), color: '#059669' },
      { label: 'NYSERDA', value: Math.round(nyserdaIncentive), color: '#CA8A04' },
      { label: 'NY State Credit', value: nyStateTaxCredit, color: '#7C3AED' },
    ],
    chartData: [
      { name: 'Gross Cost', value: Math.round(grossCost) },
      { name: 'Net Cost', value: Math.round(netCost) },
      { name: 'Year 1 Savings', value: Math.round(annualSavings) },
      { name: '25yr Savings', value: Math.round(twentyFiveYearSavings) },
    ],
    schedule: {
      headers: ['Incentive', 'Amount', 'Type', 'Notes'],
      rows: [
        ['Federal ITC', fmt(Math.round(federalCredit)), 'Tax Credit', '30% of system cost'],
        ['NYSERDA NY-Sun', fmt(Math.round(nyserdaIncentive)), 'Upfront Rebate', `$${nyserdaPerWatt.toFixed(2)}/watt (${regionNames[region]})`],
        ['NY State Credit', fmt(nyStateTaxCredit), 'Tax Credit', '25% up to $5,000'],
        ['Property Tax Exempt', '$0 increase', 'Exemption', '15-year exemption on added value'],
        ['Net Metering', `${offsetPercent.toFixed(0)}% offset`, 'Bill Credit', 'VDER 1:1 credits'],
      ],
    },
    advice: roofType === 'rented'
      ? `As a renter, consider community solar — NY has one of the largest programs in the US. You can subscribe for ~10% savings with no installation needed. Check NYSERDA's community solar marketplace.`
      : paybackYears < 7
        ? `Excellent ROI! Your ${systemSize}kW system pays for itself in ${paybackYears.toFixed(1)} years thanks to NY's high electricity rates ($${electricRate.toFixed(2)}/kWh). With ${regionNames[region]} rates and NYSERDA incentives, your 25-year savings reach ${fmt(Math.round(twentyFiveYearSavings))}.`
        : `Your ${systemSize}kW system breaks even in ${paybackYears.toFixed(1)} years. Consider increasing system size to maximize the 30% federal ITC. NY's property tax exemption means your home value increases without higher taxes.`,
  }
}

/** #49 EV Drive Clean — NY state + federal incentives */
function calcNYEvDriveClean(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const vehicleType = String(input.vehicleType || 'new_ev')
  const msrp = Number(input.msrp || 45000)
  const annualMiles = Number(input.annualMiles || 12000)
  const electricRate = Number(input.electricRate || 0.25)

  // NY Drive Clean Rebate (2024)
  const driveCleanRebates: Record<string, number> = {
    new_ev: 2000, // BEV ≤$42K MSRP → $2K (or $500 ≤$80K)
    new_phev: 500, // PHEV
    used_ev: 500, // Used EV
  }
  // Adjusted by MSRP (Drive Clean caps at $42K for full rebate)
  let driveCleanAmount = driveCleanRebates[vehicleType] || 2000
  if (vehicleType === 'new_ev' && msrp > 42000) driveCleanAmount = msrp <= 80000 ? 500 : 0

  // Federal EV tax credit ($7,500 max for new, $4,000 for used)
  const federalMax = vehicleType === 'used_ev' ? 4000 : 7500
  // MSRP cap: $55K for sedans, $80K for SUV/truck (simplified)
  const federalCredit = msrp <= 80000 ? federalMax : 0

  // NY has no state EV tax credit beyond Drive Clean

  // Charging costs
  const evEfficiency = 3.5 // miles per kWh (average)
  const annualKwh = annualMiles / evEfficiency
  const annualChargingCost = annualKwh * electricRate
  const monthlyCharging = annualChargingCost / 12

  // Gas comparison
  const gasPriceNY = 3.85 // NY avg gas price
  const avgMPG = 30
  const annualGasCost = (annualMiles / avgMPG) * gasPriceNY
  const annualFuelSavings = annualGasCost - annualChargingCost

  // Maintenance savings (EVs: ~50% less maintenance)
  const gasMaintenancePerMile = 0.09
  const evMaintenancePerMile = 0.04
  const annualMaintenanceSavings = annualMiles * (gasMaintenancePerMile - evMaintenancePerMile)

  // Total annual savings
  const totalAnnualSavings = annualFuelSavings + annualMaintenanceSavings

  // 5-year total savings
  const fiveYearSavings = totalAnnualSavings * 5 + federalCredit + driveCleanAmount

  // NY-specific: no emissions inspection needed, HOV access, reduced tolls
  const tollSavings = 1200 // E-ZPass Green discount on some crossings + reduced congestion pricing
  const inspectionSavings = 37 * 2 // biennial inspection: EVs exempt from emissions

  // Net effective vehicle cost
  const effectiveCost = msrp - federalCredit - driveCleanAmount

  return {
    primary: { value: Math.round(totalAnnualSavings), label: 'Annual Savings vs Gas', unit: '$/yr' },
    secondary: [
      { label: 'Monthly Charging', value: fmt(Math.round(monthlyCharging)), unit: '' },
      { label: 'vs Gas Monthly', value: fmt(Math.round(annualGasCost / 12)), unit: '' },
      { label: 'Federal Credit', value: fmt(federalCredit), unit: '' },
      { label: 'NY Drive Clean', value: fmt(driveCleanAmount), unit: '' },
      { label: 'Effective Price', value: fmt(Math.round(effectiveCost)), unit: '' },
      { label: '5-Year Savings', value: fmt(Math.round(fiveYearSavings)), unit: '' },
      { label: 'Fuel Savings/yr', value: fmt(Math.round(annualFuelSavings)), unit: '' },
      { label: 'Maintenance Savings', value: fmt(Math.round(annualMaintenanceSavings)), unit: '/yr' },
    ],
    breakdown: [
      { label: 'Fuel Savings', value: Math.round(annualFuelSavings), color: '#059669' },
      { label: 'Maintenance Savings', value: Math.round(annualMaintenanceSavings), color: '#1E3A8A' },
      { label: 'Charging Cost', value: Math.round(annualChargingCost), color: '#DC2626' },
    ],
    chartData: [
      { name: 'EV Annual', value: Math.round(annualChargingCost + annualMiles * evMaintenancePerMile) },
      { name: 'Gas Annual', value: Math.round(annualGasCost + annualMiles * gasMaintenancePerMile) },
      { name: 'EV 5yr', value: Math.round((annualChargingCost + annualMiles * evMaintenancePerMile) * 5) },
      { name: 'Gas 5yr', value: Math.round((annualGasCost + annualMiles * gasMaintenancePerMile) * 5) },
    ],
    schedule: {
      headers: ['Cost Category', 'EV Annual', 'Gas Annual', 'You Save'],
      rows: [
        ['Fuel', fmt(Math.round(annualChargingCost)), fmt(Math.round(annualGasCost)), fmt(Math.round(annualFuelSavings))],
        ['Maintenance', fmt(Math.round(annualMiles * evMaintenancePerMile)), fmt(Math.round(annualMiles * gasMaintenancePerMile)), fmt(Math.round(annualMaintenanceSavings))],
        ['Inspections', '$0', '$37/yr', '$37'],
        ['Tolls (E-ZPass Green)', 'Reduced', 'Standard', `~${fmt(tollSavings)}/yr`],
        ['TOTAL', fmt(Math.round(annualChargingCost + annualMiles * evMaintenancePerMile)), fmt(Math.round(annualGasCost + annualMiles * gasMaintenancePerMile)), fmt(Math.round(totalAnnualSavings))],
      ],
    },
    advice: driveCleanAmount > 0
      ? `Your ${vehicleType === 'used_ev' ? 'used' : 'new'} EV qualifies for ${fmt(driveCleanAmount)} NY Drive Clean rebate + ${fmt(federalCredit)} federal credit, bringing effective price to ${fmt(Math.round(effectiveCost))}. At ${annualMiles.toLocaleString()} miles/year, you save ${fmt(Math.round(totalAnnualSavings))}/year vs gas. NYC bonus: EVs pay reduced congestion pricing and skip emissions inspections.`
      : `At ${fmt(msrp)} MSRP, this vehicle exceeds NY Drive Clean limits ($42K for full rebate). You still get ${fmt(federalCredit)} federal credit. Consider a model under $42K for the full $2K state rebate. Annual savings of ${fmt(Math.round(totalAnnualSavings))} still make EVs worthwhile in NY thanks to $${gasPriceNY.toFixed(2)}/gallon gas prices.`,
  }
}

export function calculateStateSpecific(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  // Custom calculation handlers (NY transport + lifestyle)
  const customCalc = stateData.customCalc as string | undefined
  switch (customCalc) {
    case 'ny-mta-fare': return calcNYMtaFare(input, stateData)
    case 'ny-car-ownership': return calcNYCarOwnership(input, stateData)
    case 'ny-commuter-rail': return calcNYCommuterRail(input, stateData)
    case 'ny-bridge-tolls': return calcNYBridgeTolls(input, stateData)
    case 'ny-congestion-pricing': return calcNYCongestionPricing(input, stateData)
    case 'ny-lottery-tax': return calcNYLotteryTax(input, stateData)
    case 'ny-child-support': return calcNYChildSupport(input, stateData)
    case 'ny-solar-nyserda': return calcNYSolarNyserda(input, stateData)
    case 'ny-ev-drive-clean': return calcNYEvDriveClean(input, stateData)
  }

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
