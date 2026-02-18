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

// ═══════════════════════════════════════════════════════════════════
// NY LEGAL — Custom calculation functions
// ═══════════════════════════════════════════════════════════════════

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

/** #41 LLC Publication Requirement — $1500+ newspaper requirement */
function calcNYLLCPublication(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const county = String(input.county || 'new_york')
  const entityType = String(input.entityType || 'llc')
  const useService = String(input.useService || 'yes') === 'yes'

  // NY LLC publication costs by county (must publish in 2 newspapers for 6 consecutive weeks)
  const publicationCosts: Record<string, { low: number; high: number; countyName: string }> = {
    new_york: { low: 1200, high: 1800, countyName: 'New York (Manhattan)' },
    kings: { low: 600, high: 1000, countyName: 'Kings (Brooklyn)' },
    queens: { low: 500, high: 800, countyName: 'Queens' },
    bronx: { low: 400, high: 700, countyName: 'Bronx' },
    richmond: { low: 300, high: 500, countyName: 'Richmond (Staten Island)' },
    westchester: { low: 500, high: 900, countyName: 'Westchester' },
    nassau: { low: 400, high: 700, countyName: 'Nassau' },
    suffolk: { low: 300, high: 600, countyName: 'Suffolk' },
    albany: { low: 200, high: 400, countyName: 'Albany' },
  }

  const countyInfo = publicationCosts[county] || publicationCosts.new_york
  const pubCost = (countyInfo.low + countyInfo.high) / 2

  // LLC filing fee: $200 for Articles of Organization
  const filingFee = 200
  // Biennial statement: $9 every 2 years
  const biennialFee = 9
  // Publication service fee (if using a service)
  const serviceFee = useService ? 200 : 0
  // Registered agent (optional, $125/yr)
  const agentFee = 0

  // Certificate of publication filing: $50
  const certFee = 50

  const totalFirstYear = filingFee + pubCost + serviceFee + certFee
  const yearlyOngoing = biennialFee / 2 + agentFee

  // If you don't publish within 120 days, LLC can be revoked
  const penaltyRisk = 'LLC revocation + personal liability'

  return {
    primary: { value: Math.round(totalFirstYear), label: 'Total First-Year LLC Cost', unit: '$' },
    secondary: [
      { label: 'Publication Cost', value: fmt(pubCost), unit: '' },
      { label: 'Filing Fee', value: fmt(filingFee), unit: '' },
      { label: 'Certificate Filing', value: fmt(certFee), unit: '' },
      { label: 'County', value: countyInfo.countyName, unit: '' },
      { label: 'Annual Ongoing', value: fmt(yearlyOngoing), unit: '/yr' },
      ...(useService ? [{ label: 'Service Fee', value: fmt(serviceFee), unit: '' }] : []),
    ],
    breakdown: [
      { label: 'Publication', value: Math.round(pubCost), color: '#DC2626' },
      { label: 'State Filing', value: filingFee, color: '#1E3A8A' },
      { label: 'Certificate', value: certFee, color: '#CA8A04' },
      ...(useService ? [{ label: 'Service Fee', value: serviceFee, color: '#7C3AED' }] : []),
    ],
    chartData: Object.entries(publicationCosts).slice(0, 6).map(([, v]) => ({
      name: v.countyName.split(' ')[0], value: Math.round((v.low + v.high) / 2),
    })),
    schedule: {
      headers: ['County', 'Low Estimate', 'High Estimate', 'Average'],
      rows: Object.values(publicationCosts).map(v => [
        v.countyName, fmt(v.low), fmt(v.high), fmt((v.low + v.high) / 2),
      ]),
    },
    advice: county === 'new_york'
      ? `Manhattan (New York County) has the highest publication costs — ${fmt(countyInfo.low)}-${fmt(countyInfo.high)}. Many attorneys recommend forming your LLC in a cheaper county (Albany: ~$300) and registering to do business in NYC.`
      : `Publication in ${countyInfo.countyName} costs ${fmt(countyInfo.low)}-${fmt(countyInfo.high)}. You MUST publish within 120 days of formation or your LLC's authority to do business can be suspended.`,
  }
}

/** #42 Business Registration NY */
function calcNYBusinessReg(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const entityType = String(input.entityType || 'llc')
  const hasEIN = String(input.hasEIN || 'no') === 'yes'
  const needsPermits = String(input.needsPermits || 'no') === 'yes'

  // NY filing fees by entity type
  const filingFees: Record<string, { filing: number; name: string; annual: number }> = {
    llc: { filing: 200, name: 'LLC', annual: 9 }, // biennial but $9/2yr
    corp: { filing: 125, name: 'Corporation', annual: 25 },
    sole_prop: { filing: 0, name: 'Sole Proprietorship', annual: 0 }, // DBA only
    partnership: { filing: 200, name: 'Partnership', annual: 9 },
  }

  const entity = filingFees[entityType] || filingFees.llc

  // DBA (Doing Business As) - if needed
  const dbaFee = 30 // NYC DBA filing

  // Publication requirement (LLC only)
  const publicationCost = entityType === 'llc' ? 800 : 0

  // EIN (free from IRS)
  const einCost = 0

  // NYC business license (general)
  const nycBusinessCert = 110

  // Permits (food service, home occupation, etc.)
  const permitCost = needsPermits ? 500 : 0

  // Workers comp (required if you have employees)
  const workersComp = 0 // Estimated separately

  const totalStartup = entity.filing + publicationCost + nycBusinessCert + dbaFee + permitCost
  const annualCost = entity.annual + nycBusinessCert

  return {
    primary: { value: Math.round(totalStartup), label: 'Total Startup Cost', unit: '$' },
    secondary: [
      { label: 'Entity Type', value: entity.name, unit: '' },
      { label: 'State Filing', value: fmt(entity.filing), unit: '' },
      { label: 'NYC Business Cert', value: fmt(nycBusinessCert), unit: '' },
      ...(publicationCost > 0 ? [{ label: 'Publication (LLC)', value: fmt(publicationCost), unit: '' }] : []),
      { label: 'Annual Costs', value: fmt(annualCost), unit: '/yr' },
      { label: 'EIN', value: 'Free (IRS)', unit: '' },
    ],
    breakdown: [
      { label: 'State Filing', value: entity.filing, color: '#1E3A8A' },
      ...(publicationCost > 0 ? [{ label: 'Publication', value: publicationCost, color: '#DC2626' }] : []),
      { label: 'NYC License', value: nycBusinessCert, color: '#CA8A04' },
      { label: 'DBA Filing', value: dbaFee, color: '#059669' },
      ...(permitCost > 0 ? [{ label: 'Permits', value: permitCost, color: '#7C3AED' }] : []),
    ],
    chartData: Object.entries(filingFees).map(([, v]) => ({
      name: v.name, value: v.filing + (v.name === 'LLC' ? 800 : 0) + nycBusinessCert,
    })),
    advice: entityType === 'llc'
      ? `NY LLCs have the infamous publication requirement (~$800+), making them the most expensive to form. Total startup is ${fmt(totalStartup)}. Consider forming in another state and registering as a foreign LLC in NY.`
      : `${entity.name} formation costs ${fmt(totalStartup)} in NY. Remember to file your biennial statement (${fmt(entity.annual)}/2yr) to keep your entity in good standing.`,
  }
}

/** #43 DMV Points NY — surcharge at 6+ points */
function calcNYDMVPoints(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const currentPoints = Number(input.currentPoints || 3)
  const newViolation = String(input.newViolation || 'speeding_15')
  const hasDefensiveDriving = String(input.hasDefensiveDriving || 'no') === 'yes'

  // NY DMV point values by violation
  const violationPoints: Record<string, { points: number; fine: [number, number]; name: string }> = {
    speeding_10: { points: 3, fine: [45, 150], name: 'Speeding 1-10 MPH over' },
    speeding_15: { points: 4, fine: [90, 300], name: 'Speeding 11-20 MPH over' },
    speeding_20: { points: 6, fine: [90, 300], name: 'Speeding 21-30 MPH over' },
    speeding_30: { points: 8, fine: [180, 600], name: 'Speeding 31-40 MPH over' },
    speeding_40: { points: 11, fine: [360, 600], name: 'Speeding 41+ MPH over' },
    red_light: { points: 3, fine: [100, 300], name: 'Red Light Violation' },
    cell_phone: { points: 5, fine: [50, 400], name: 'Cell Phone / Texting' },
    reckless: { points: 5, fine: [100, 300], name: 'Reckless Driving' },
    failure_signal: { points: 2, fine: [50, 150], name: 'Failure to Signal' },
    improper_passing: { points: 3, fine: [50, 150], name: 'Improper Passing' },
    following_close: { points: 4, fine: [50, 300], name: 'Following Too Closely' },
  }

  const violation = violationPoints[newViolation] || violationPoints.speeding_15
  const newPoints = violation.points
  const ddReduction = hasDefensiveDriving ? 4 : 0 // Defensive driving removes up to 4 points
  const totalPoints = Math.max(0, currentPoints + newPoints - ddReduction)

  // Driver Responsibility Assessment (DRA) — surcharge for 6+ points in 18 months
  const draSurcharge = totalPoints >= 6 ? 100 + (totalPoints - 6) * 25 : 0 // $100 base + $25 per point over 6
  const draAnnual = draSurcharge // paid annually for 3 years
  const draTotal = draAnnual * 3

  // Fine estimate
  const fineAvg = (violation.fine[0] + violation.fine[1]) / 2
  const nycSurcharge = 88 // mandatory NYC surcharge
  const stateSurcharge = 93 // mandatory state surcharge

  // Insurance impact
  const insuranceIncrease = totalPoints * 150 // approx per point per year
  const insurance3yr = insuranceIncrease * 3

  // License suspension risk
  const suspensionRisk = totalPoints >= 11 ? 'Automatic Suspension' : totalPoints >= 8 ? 'High Risk' : 'Low Risk'

  const totalCost = fineAvg + nycSurcharge + stateSurcharge + draTotal + insurance3yr

  return {
    primary: { value: Math.round(totalCost), label: 'Total 3-Year Cost', unit: '$' },
    secondary: [
      { label: 'New Points', value: `+${newPoints}`, unit: '' },
      { label: 'Total Points', value: `${totalPoints}`, unit: '' },
      { label: 'Fine Range', value: `${fmt(violation.fine[0])}-${fmt(violation.fine[1])}`, unit: '' },
      { label: 'DRA Surcharge', value: draTotal > 0 ? `${fmt(draAnnual)}/yr x 3yr` : 'None', unit: '' },
      { label: 'Insurance Impact', value: `+${fmt(insuranceIncrease)}/yr`, unit: '' },
      { label: 'Suspension Risk', value: suspensionRisk, unit: '' },
    ],
    breakdown: [
      { label: 'Fine', value: Math.round(fineAvg), color: '#DC2626' },
      { label: 'Surcharges', value: nycSurcharge + stateSurcharge, color: '#CA8A04' },
      { label: 'DRA (3yr)', value: Math.round(draTotal), color: '#1E3A8A' },
      { label: 'Insurance (3yr)', value: Math.round(insurance3yr), color: '#7C3AED' },
    ],
    chartData: [
      { name: 'Fine + Surcharges', value: Math.round(fineAvg + nycSurcharge + stateSurcharge) },
      { name: 'DRA (3yr)', value: Math.round(draTotal) },
      { name: 'Insurance (3yr)', value: Math.round(insurance3yr) },
    ],
    schedule: {
      headers: ['Violation', 'Points', 'Fine Range'],
      rows: Object.values(violationPoints).map(v => [
        v.name, `${v.points}`, `${fmt(v.fine[0])}-${fmt(v.fine[1])}`,
      ]),
    },
    advice: totalPoints >= 6
      ? `At ${totalPoints} points, you'll owe the Driver Responsibility Assessment: ${fmt(draAnnual)}/year for 3 years (${fmt(draTotal)} total). Take a defensive driving course to remove 4 points and get a 10% insurance discount.`
      : `You're at ${totalPoints} points — below the 6-point DRA threshold. A defensive driving course (6 hours, ~$30 online) can preemptively remove 4 points and lower insurance by 10%.`,
  }
}

/** #44 DUI Penalty NY — Leandra's Law, IID */
function calcNYDuiPenalty(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const offense = String(input.offense || 'first')
  const bac = String(input.bac || 'low')
  const hasMinor = String(input.hasMinor || 'no') === 'yes'

  // NY DWI penalties (VTL 1192)
  // DWAI (0.05-0.07), DWI (0.08+), Aggravated DWI (0.18+)
  const isAggravated = bac === 'extreme' // 0.18+
  const chargeType = bac === 'low' ? 'DWI' : bac === 'high' ? 'DWI' : 'Aggravated DWI'

  const penalties: Record<string, { fineRange: [number, number]; jailMax: string; licSusp: string; iidMonths: number }> = {
    first: { fineRange: [500, 1000], jailMax: 'Up to 1 year', licSusp: '6 months', iidMonths: 12 },
    second: { fineRange: [1000, 5000], jailMax: 'Up to 4 years (felony)', licSusp: '1 year min', iidMonths: 12 },
    third: { fineRange: [2000, 10000], jailMax: 'Up to 7 years (felony)', licSusp: '1 year min (may be permanent)', iidMonths: 24 },
  }

  const p = penalties[offense] || penalties.first
  const baseFine = (p.fineRange[0] + p.fineRange[1]) / 2

  // Aggravated DWI increases penalties
  const aggMult = isAggravated ? 1.5 : 1.0
  const fine = baseFine * aggMult

  // Leandra's Law: DWI with minor under 16 = automatic felony (even first offense)
  const leandraFelony = hasMinor
  const leandraFine = hasMinor ? 5000 : 0

  // Additional costs
  const surcharge = 400 // mandatory surcharge
  const dra = 250 * 3 // Driver Responsibility Assessment for 3 years
  const iidCost = 100 * p.iidMonths // $100/mo IID installation + monitoring
  const lawyerCost = offense === 'first' ? 5000 : 10000
  const vipProgram = 1500 // Victim Impact Panel + treatment program
  const insuranceSR22 = 3000 * 3 // SR-22 filing + increased premiums for 3 years
  const licenseRestore = 50

  const totalEstimate = fine + leandraFine + surcharge + dra + iidCost + lawyerCost + vipProgram + insuranceSR22 + licenseRestore

  return {
    primary: { value: Math.round(totalEstimate), label: 'Estimated Total Cost', unit: '$' },
    secondary: [
      { label: 'Charge', value: leandraFelony ? "Leandra's Law Felony" : chargeType, unit: '' },
      { label: 'Fine', value: `${fmt(p.fineRange[0])}-${fmt(p.fineRange[1])}`, unit: '' },
      { label: 'Jail (max)', value: p.jailMax, unit: '' },
      { label: 'License', value: p.licSusp, unit: '' },
      { label: 'IID Required', value: `${p.iidMonths} months`, unit: '' },
      { label: 'Offense', value: offense.charAt(0).toUpperCase() + offense.slice(1), unit: '' },
    ],
    breakdown: [
      { label: 'Fine + Surcharge', value: Math.round(fine + surcharge + leandraFine), color: '#DC2626' },
      { label: 'Attorney', value: lawyerCost, color: '#1E3A8A' },
      { label: 'IID Device', value: Math.round(iidCost), color: '#CA8A04' },
      { label: 'Insurance (3yr)', value: Math.round(insuranceSR22), color: '#7C3AED' },
      { label: 'DRA (3yr)', value: Math.round(dra), color: '#059669' },
      { label: 'Treatment/VIP', value: vipProgram, color: '#6B7280' },
    ],
    chartData: [
      { name: 'First DWI', value: Math.round((penalties.first.fineRange[0] + penalties.first.fineRange[1]) / 2 + surcharge + dra + 100 * 12 + 5000 + vipProgram + insuranceSR22) },
      { name: 'Second DWI', value: Math.round((penalties.second.fineRange[0] + penalties.second.fineRange[1]) / 2 + surcharge + dra + 100 * 12 + 10000 + vipProgram + insuranceSR22) },
      { name: 'Third DWI', value: Math.round((penalties.third.fineRange[0] + penalties.third.fineRange[1]) / 2 + surcharge + dra + 100 * 24 + 10000 + vipProgram + insuranceSR22) },
    ],
    advice: hasMinor
      ? "Leandra's Law (2009): DWI with a child under 16 in the vehicle is an automatic Class E felony — even for first offenders. This means up to 4 years in prison and a permanent criminal record."
      : offense === 'first'
        ? `A first DWI in NY costs ${fmt(totalEstimate)} total when you include IID (${p.iidMonths} months at $100/mo), lawyer, and 3 years of increased insurance. All first-time DWI offenders must install an ignition interlock device.`
        : `A ${offense} offense DWI is a felony in NY, carrying ${p.jailMax} and fines up to ${fmt(p.fineRange[1])}. Total cost exceeds ${fmt(totalEstimate)} including legal fees and long-term insurance impact.`,
  }
}

/** #45 Traffic Fine NYC — camera tickets, parking */
function calcNYTrafficFine(input: CalculatorInput, _sd: StateData): CalculatorOutput {
  const violationType = String(input.violationType || 'speed_camera')
  const location = String(input.location || 'nyc')
  const priorViolations = Number(input.priorViolations || 0)

  // NYC traffic violation fines (2024)
  const violations: Record<string, { fine: number; surcharge: number; points: number; name: string; camera: boolean }> = {
    speed_camera: { fine: 50, surcharge: 0, points: 0, name: 'School Zone Speed Camera', camera: true },
    red_light_camera: { fine: 50, surcharge: 0, points: 0, name: 'Red Light Camera', camera: true },
    bus_lane: { fine: 115, surcharge: 0, points: 0, name: 'Bus Lane Violation', camera: true },
    parking_meter: { fine: 65, surcharge: 0, points: 0, name: 'Expired Meter', camera: false },
    parking_hydrant: { fine: 115, surcharge: 0, points: 0, name: 'Fire Hydrant', camera: false },
    parking_double: { fine: 115, surcharge: 0, points: 0, name: 'Double Parking', camera: false },
    speeding_officer: { fine: 180, surcharge: 93, points: 4, name: 'Speeding (Officer-Issued)', camera: false },
    red_light_officer: { fine: 225, surcharge: 93, points: 3, name: 'Red Light (Officer-Issued)', camera: false },
    cell_phone: { fine: 235, surcharge: 93, points: 5, name: 'Cell Phone / Texting', camera: false },
    no_seatbelt: { fine: 50, surcharge: 0, points: 0, name: 'No Seatbelt', camera: false },
  }

  const v = violations[violationType] || violations.speed_camera

  // Repeat camera offenses (NYC doubles after certain # of violations)
  const repeatMult = v.camera && priorViolations >= 3 ? 1.5 : v.camera && priorViolations >= 1 ? 1.0 : 1.0
  const adjustedFine = v.fine * repeatMult

  const totalFine = adjustedFine + v.surcharge

  // Late payment penalty (25% after 60 days, doubles if not paid)
  const latePenalty = totalFine * 0.25

  // Insurance impact (only for officer-issued with points)
  const insuranceImpact = v.points > 0 ? v.points * 150 : 0

  // DRA surcharge (if this pushes over 6 points)
  const draRisk = v.points > 0

  return {
    primary: { value: Math.round(totalFine), label: 'Total Fine', unit: '$' },
    secondary: [
      { label: 'Violation', value: v.name, unit: '' },
      { label: 'Base Fine', value: fmt(adjustedFine), unit: '' },
      { label: 'Surcharge', value: v.surcharge > 0 ? fmt(v.surcharge) : 'None', unit: '' },
      { label: 'Points', value: v.points > 0 ? `${v.points} points` : 'No points (camera)', unit: '' },
      { label: 'Late Penalty', value: `+${fmt(latePenalty)} after 60 days`, unit: '' },
      ...(insuranceImpact > 0 ? [{ label: 'Insurance Impact', value: `+${fmt(insuranceImpact)}/yr`, unit: '' }] : []),
    ],
    breakdown: [
      { label: 'Base Fine', value: Math.round(adjustedFine), color: '#DC2626' },
      ...(v.surcharge > 0 ? [{ label: 'NYS Surcharge', value: v.surcharge, color: '#CA8A04' }] : []),
      ...(insuranceImpact > 0 ? [{ label: 'Insurance (annual)', value: insuranceImpact, color: '#7C3AED' }] : []),
    ],
    chartData: [
      { name: 'Camera Tickets', value: 50 },
      { name: 'Parking', value: 115 },
      { name: 'Officer (w/ Points)', value: 225 },
      { name: 'Cell Phone', value: 328 },
    ],
    schedule: {
      headers: ['Violation', 'Fine', 'Surcharge', 'Points'],
      rows: Object.values(violations).map(viol => [
        viol.name,
        fmt(viol.fine),
        viol.surcharge > 0 ? fmt(viol.surcharge) : '—',
        viol.points > 0 ? `${viol.points}` : viol.camera ? 'None (camera)' : '0',
      ]),
    },
    advice: v.camera
      ? `Camera tickets (${v.name}: ${fmt(v.fine)}) carry no points and no insurance impact. Pay promptly — after 60 days, a ${fmt(latePenalty)} penalty is added. NYC issues ~10 million camera tickets annually.`
      : v.points > 0
        ? `Officer-issued ${v.name} carries ${v.points} points + ${fmt(v.surcharge)} surcharge. With insurance impact of +${fmt(insuranceImpact)}/yr, the 3-year real cost is ${fmt(totalFine + insuranceImpact * 3)}. Consider traffic school to reduce points.`
        : `${v.name} fine is ${fmt(totalFine)}. No points on your license. Pay within 30 days to avoid late fees.`,
  }
}

export function calculateStateLegal(baseType: string, input: CalculatorInput, stateData: StateData, method?: string): CalculatorOutput | null {
  if (!legalBaseTypes.includes(baseType)) return null

  // Custom calculation handlers (NY legal)
  const customCalc = stateData.customCalc as string | undefined
  switch (customCalc) {
    case 'ny-llc-publication': return calcNYLLCPublication(input, stateData)
    case 'ny-business-reg': return calcNYBusinessReg(input, stateData)
    case 'ny-dmv-points': return calcNYDMVPoints(input, stateData)
    case 'ny-dui-penalty': return calcNYDuiPenalty(input, stateData)
    case 'ny-traffic-fine': return calcNYTrafficFine(input, stateData)
  }

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
