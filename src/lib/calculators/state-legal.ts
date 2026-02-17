// State legal calculations — DUI penalty, traffic fine, business registration, LLC, speeding
import type { CalculatorField, CalculatorInput, CalculatorOutput } from '../calculator-engine'
import type { StateData } from '@/types/state-calculator'

const legalBaseTypes = [
  'dui-penalty', 'traffic-fine', 'business-registration',
  'llc-cost', 'speeding-ticket',
]

export function getStateLegalFields(baseType: string, stateData: StateData): CalculatorField[] | null {
  if (!legalBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'llc-cost':
    case 'business-registration':
      return [
        { name: 'entityType', label: 'Entity Type', type: 'select', options: [
          { value: 'llc', label: 'LLC' },
          { value: 'corp', label: 'S-Corporation' },
          { value: 'ccorp', label: 'C-Corporation' },
          { value: 'sole', label: 'Sole Proprietorship' },
        ], default: 'llc' },
        { name: 'registeredAgent', label: 'Registered Agent Service', type: 'select', options: [
          { value: 'self', label: 'Self (Free)' },
          { value: 'service', label: 'Professional Service (~$125/yr)' },
        ], default: 'self' },
        { name: 'expedited', label: 'Expedited Filing?', type: 'select', options: [
          { value: 'no', label: 'Standard' },
          { value: 'yes', label: 'Expedited (+$50-$500)' },
        ], default: 'no' },
      ]

    case 'speeding-ticket':
      return [
        { name: 'mphOver', label: 'MPH Over Speed Limit', type: 'number', default: 15, min: 1, max: 60 },
        { name: 'zone', label: 'Zone Type', type: 'select', options: [
          { value: 'regular', label: 'Regular Road' },
          { value: 'school', label: 'School Zone' },
          { value: 'construction', label: 'Construction Zone' },
          { value: 'highway', label: 'Highway' },
        ], default: 'regular' },
        { name: 'priorOffenses', label: 'Prior Offenses', type: 'select', options: [
          { value: '0', label: 'None' },
          { value: '1', label: '1 Prior' },
          { value: '2', label: '2+ Prior' },
        ], default: '0' },
      ]

    case 'dui-penalty':
      return [
        { name: 'offense', label: 'Offense Number', type: 'select', options: [
          { value: 'first', label: 'First Offense' },
          { value: 'second', label: 'Second Offense' },
          { value: 'third', label: 'Third Offense' },
        ], default: 'first' },
        { name: 'bac', label: 'Blood Alcohol Content', type: 'select', options: [
          { value: 'low', label: '0.08-0.14%' },
          { value: 'high', label: '0.15-0.19%' },
          { value: 'extreme', label: '0.20%+' },
        ], default: 'low' },
        { name: 'accident', label: 'Accident Involved?', type: 'select', options: [
          { value: 'no', label: 'No' },
          { value: 'property', label: 'Property Damage' },
          { value: 'injury', label: 'Injury' },
        ], default: 'no' },
      ]

    case 'traffic-fine':
      return [
        { name: 'violation', label: 'Violation Type', type: 'select', options: [
          { value: 'redlight', label: 'Running Red Light' },
          { value: 'stop', label: 'Running Stop Sign' },
          { value: 'seatbelt', label: 'No Seatbelt' },
          { value: 'phone', label: 'Cell Phone Use' },
          { value: 'improper-turn', label: 'Improper Turn' },
          { value: 'following', label: 'Following Too Closely' },
        ], default: 'redlight' },
        { name: 'points', label: 'Include Points Impact?', type: 'select', options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ], default: 'yes' },
      ]

    default:
      return [
        { name: 'amount', label: 'Amount', type: 'number', default: 0, min: 0 },
      ]
  }
}

export function calculateStateLegal(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!legalBaseTypes.includes(baseType)) return null

  switch (baseType) {
    case 'llc-cost':
    case 'business-registration': {
      const entity = String(input.entityType || 'llc')
      const agentService = String(input.registeredAgent) === 'service'
      const expedited = String(input.expedited) === 'yes'

      // State-specific fees
      const llcFiling = Number(stateData.llcFilingFee || 100)
      const corpFiling = Number(stateData.corpFilingFee || 150)
      const annualReport = Number(stateData.llcAnnualFee || 50)
      const expeditedFee = Number(stateData.expeditedFilingFee || 100)
      const franchiseTax = Number(stateData.franchiseTax || 0)

      const filingFee = entity === 'sole' ? 25 : entity === 'llc' ? llcFiling : corpFiling
      const agentCost = agentService ? 125 : 0
      const expeditedCost = expedited ? expeditedFee : 0

      const firstYearCost = filingFee + agentCost + expeditedCost + franchiseTax
      const yearlyOngoing = annualReport + (agentService ? 125 : 0) + franchiseTax
      const fiveYearTotal = firstYearCost + yearlyOngoing * 4

      return {
        primary: { value: Math.round(firstYearCost), label: 'First-Year Cost', unit: '$' },
        secondary: [
          { label: 'Filing Fee', value: filingFee, unit: '$' },
          { label: 'Annual Report/Fee', value: annualReport, unit: '$/yr' },
          ...(franchiseTax > 0 ? [{ label: 'Franchise Tax', value: franchiseTax, unit: '$/yr' }] : []),
          ...(agentService ? [{ label: 'Agent Service', value: 125, unit: '$/yr' }] : []),
          ...(expedited ? [{ label: 'Expedited Fee', value: expeditedFee, unit: '$' }] : []),
          { label: '5-Year Total', value: Math.round(fiveYearTotal), unit: '$' },
        ],
      }
    }

    case 'speeding-ticket': {
      const mphOver = Number(input.mphOver || 15)
      const zone = String(input.zone || 'regular')
      const priors = Number(input.priorOffenses || 0)

      const baseFine = Number(stateData.baseSpeedingFine || 100)
      const perMph = Number(stateData.finePerMphOver || 10)

      let fine = baseFine + mphOver * perMph

      // Zone multipliers
      if (zone === 'school') fine *= 2
      if (zone === 'construction') fine *= 1.5

      // Prior offenses
      fine *= (1 + priors * 0.3)

      // Court costs
      const courtCosts = Number(stateData.courtCosts || 75)

      // Points
      const points = mphOver > 25 ? 4 : mphOver > 15 ? 3 : 2

      // Insurance impact (annual increase)
      const avgInsurance = Number(stateData.avgAutoInsurance || 1500)
      const insuranceIncrease = avgInsurance * (points * 0.05)

      return {
        primary: { value: Math.round(fine + courtCosts), label: 'Total Fine + Court Costs', unit: '$' },
        secondary: [
          { label: 'Base Fine', value: Math.round(fine), unit: '$' },
          { label: 'Court Costs', value: courtCosts, unit: '$' },
          { label: 'Points on License', value: points, unit: 'pts' },
          { label: 'Insurance Impact', value: `+$${Math.round(insuranceIncrease)}/yr`, unit: '' },
          { label: '3-Year Total Impact', value: Math.round(fine + courtCosts + insuranceIncrease * 3), unit: '$' },
        ],
        advice: mphOver > 25
          ? 'At this speed, you may face a reckless driving charge in addition to the speeding ticket.'
          : `A ${mphOver} mph speeding ticket typically adds ${points} points to your license.`,
      }
    }

    case 'dui-penalty': {
      const offense = String(input.offense || 'first')
      const bac = String(input.bac || 'low')
      const accident = String(input.accident || 'no')

      // Base penalties by offense
      const penalties: Record<string, { fine: number; jail: string; license: string }> = {
        first: {
          fine: Number(stateData.duiFirstFine || 1000),
          jail: String(stateData.duiFirstJail || '0-6 months'),
          license: String(stateData.duiFirstLicense || '90 days - 1 year suspension'),
        },
        second: {
          fine: Number(stateData.duiSecondFine || 2500),
          jail: String(stateData.duiSecondJail || '10 days - 1 year'),
          license: String(stateData.duiSecondLicense || '1-2 year suspension'),
        },
        third: {
          fine: Number(stateData.duiThirdFine || 5000),
          jail: String(stateData.duiThirdJail || '120 days - 5 years'),
          license: String(stateData.duiThirdLicense || '3-5 year revocation'),
        },
      }

      const penalty = penalties[offense] || penalties.first
      let totalFine = penalty.fine

      // BAC multiplier
      if (bac === 'high') totalFine *= 1.5
      if (bac === 'extreme') totalFine *= 2

      // Accident multiplier
      if (accident === 'property') totalFine *= 1.3
      if (accident === 'injury') totalFine *= 2

      // Additional costs
      const lawyerCost = 3000
      const drivingSchool = 500
      const iid = 1200 // Ignition interlock device
      const insuranceSurcharge = 1500 * 3 // 3 years SR-22

      const totalCost = totalFine + lawyerCost + drivingSchool + iid + insuranceSurcharge

      return {
        primary: { value: Math.round(totalCost), label: 'Estimated Total Cost', unit: '$' },
        secondary: [
          { label: 'Court Fine', value: Math.round(totalFine), unit: '$' },
          { label: 'Attorney (est.)', value: lawyerCost, unit: '$' },
          { label: 'DUI School', value: drivingSchool, unit: '$' },
          { label: 'Ignition Interlock', value: iid, unit: '$' },
          { label: 'Insurance (3yr)', value: insuranceSurcharge, unit: '$' },
          { label: 'Jail Time', value: penalty.jail, unit: '' },
          { label: 'License Status', value: penalty.license, unit: '' },
        ],
      }
    }

    case 'traffic-fine': {
      const violation = String(input.violation || 'redlight')
      const showPoints = String(input.points) !== 'no'

      // Fine and points by violation type
      const violations: Record<string, { fine: number; points: number }> = {
        redlight: { fine: Number(stateData.redLightFine || 250), points: 3 },
        stop: { fine: Number(stateData.stopSignFine || 200), points: 2 },
        seatbelt: { fine: Number(stateData.seatbeltFine || 50), points: 0 },
        phone: { fine: Number(stateData.cellPhoneFine || 150), points: 2 },
        'improper-turn': { fine: 150, points: 2 },
        following: { fine: 200, points: 3 },
      }

      const v = violations[violation] || { fine: 150, points: 2 }
      const courtCosts = Number(stateData.courtCosts || 75)
      const total = v.fine + courtCosts

      // Insurance impact
      const avgInsurance = Number(stateData.avgAutoInsurance || 1500)
      const insuranceImpact = v.points > 0 ? avgInsurance * v.points * 0.04 : 0

      return {
        primary: { value: Math.round(total), label: 'Fine + Court Costs', unit: '$' },
        secondary: [
          { label: 'Base Fine', value: v.fine, unit: '$' },
          { label: 'Court Costs', value: courtCosts, unit: '$' },
          ...(showPoints ? [{ label: 'Points', value: v.points, unit: 'pts' }] : []),
          ...(showPoints && insuranceImpact > 0 ? [{ label: 'Insurance Impact', value: `+$${Math.round(insuranceImpact)}/yr`, unit: '' }] : []),
        ],
      }
    }

    default:
      return {
        primary: { value: 0, label: `${baseType} Result`, unit: '$' },
        advice: 'Calculator under development.',
      }
  }
}
