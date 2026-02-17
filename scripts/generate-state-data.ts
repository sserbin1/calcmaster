#!/usr/bin/env npx tsx
/**
 * Generate state calculator JSON data files
 *
 * Creates a StateDataFile JSON with ~50 calculators per state, including:
 * - State-specific tax rates, brackets, and data
 * - SEO-optimized meta titles, descriptions, hero text
 * - 5 FAQs per calculator
 * - 3 benefits per calculator
 * - Related calculators
 *
 * Usage:
 *   npx tsx scripts/generate-state-data.ts california
 *   npx tsx scripts/generate-state-data.ts california texas new-york florida
 *   npx tsx scripts/generate-state-data.ts --all
 */

import * as fs from 'fs'
import * as path from 'path'

const STATES_DIR = path.join(__dirname, '..', 'src', 'data', 'states')
const REFERENCE_FILE = path.join(STATES_DIR, 'state-reference-data.json')

// ─── State metadata ─────────────────────────────────────────────────
interface RefData {
  incomeTaxType: string
  topIncomeTaxRate: number
  flatTaxRate: number
  salesTaxRate: number
  avgPropertyTaxRate: number
  minimumWage: number
  medianHomeValue: number
  costOfLivingIndex: number
  population: number
  capital: string
  region: string
}

const STATE_ABBREVS: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'district-of-columbia': 'DC', 'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI',
  'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME',
  'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN',
  'mississippi': 'MS', 'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE',
  'nevada': 'NV', 'new-hampshire': 'NH', 'new-jersey': 'NJ', 'new-mexico': 'NM',
  'new-york': 'NY', 'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI',
  'south-carolina': 'SC', 'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX',
  'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA',
  'west-virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
}

const NO_INCOME_TAX = ['alaska', 'florida', 'nevada', 'new-hampshire', 'south-dakota', 'tennessee', 'texas', 'washington', 'wyoming']
const NO_SALES_TAX = ['alaska', 'delaware', 'montana', 'new-hampshire', 'oregon']

function toTitleCase(slug: string): string {
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

// ─── Tax bracket data for states with progressive income tax ─────────
const STATE_TAX_BRACKETS: Record<string, { min: number; max: number; rate: number }[]> = {
  'california': [
    { min: 0, max: 10412, rate: 1 }, { min: 10412, max: 24684, rate: 2 },
    { min: 24684, max: 38959, rate: 4 }, { min: 38959, max: 54081, rate: 6 },
    { min: 54081, max: 68350, rate: 8 }, { min: 68350, max: 349137, rate: 9.3 },
    { min: 349137, max: 418961, rate: 10.3 }, { min: 418961, max: 698271, rate: 11.3 },
    { min: 698271, max: 1000000, rate: 12.3 }, { min: 1000000, max: Infinity, rate: 13.3 },
  ],
  'new-york': [
    { min: 0, max: 8500, rate: 4 }, { min: 8500, max: 11700, rate: 4.5 },
    { min: 11700, max: 13900, rate: 5.25 }, { min: 13900, max: 80650, rate: 5.5 },
    { min: 80650, max: 215400, rate: 6 }, { min: 215400, max: 1077550, rate: 6.85 },
    { min: 1077550, max: 5000000, rate: 9.65 }, { min: 5000000, max: 25000000, rate: 10.3 },
    { min: 25000000, max: Infinity, rate: 10.9 },
  ],
  'new-jersey': [
    { min: 0, max: 20000, rate: 1.4 }, { min: 20000, max: 35000, rate: 1.75 },
    { min: 35000, max: 40000, rate: 3.5 }, { min: 40000, max: 75000, rate: 5.525 },
    { min: 75000, max: 500000, rate: 6.37 }, { min: 500000, max: 1000000, rate: 8.97 },
    { min: 1000000, max: Infinity, rate: 10.75 },
  ],
  'alabama': [
    { min: 0, max: 500, rate: 2 }, { min: 500, max: 3000, rate: 4 },
    { min: 3000, max: Infinity, rate: 5 },
  ],
  'arizona': [
    { min: 0, max: Infinity, rate: 2.5 },
  ],
  'connecticut': [
    { min: 0, max: 10000, rate: 3 }, { min: 10000, max: 50000, rate: 5 },
    { min: 50000, max: 100000, rate: 5.5 }, { min: 100000, max: 200000, rate: 6 },
    { min: 200000, max: 250000, rate: 6.5 }, { min: 250000, max: 500000, rate: 6.9 },
    { min: 500000, max: Infinity, rate: 6.99 },
  ],
  'georgia': [
    { min: 0, max: 750, rate: 1 }, { min: 750, max: 2250, rate: 2 },
    { min: 2250, max: 3750, rate: 3 }, { min: 3750, max: 5250, rate: 4 },
    { min: 5250, max: 7000, rate: 5 }, { min: 7000, max: Infinity, rate: 5.49 },
  ],
  'hawaii': [
    { min: 0, max: 2400, rate: 1.4 }, { min: 2400, max: 4800, rate: 3.2 },
    { min: 4800, max: 9600, rate: 5.5 }, { min: 9600, max: 14400, rate: 6.4 },
    { min: 14400, max: 19200, rate: 6.8 }, { min: 19200, max: 24000, rate: 7.2 },
    { min: 24000, max: 36000, rate: 7.6 }, { min: 36000, max: 48000, rate: 7.9 },
    { min: 48000, max: 150000, rate: 8.25 }, { min: 150000, max: 175000, rate: 9 },
    { min: 175000, max: 200000, rate: 10 }, { min: 200000, max: Infinity, rate: 11 },
  ],
  'iowa': [
    { min: 0, max: 6210, rate: 4.4 }, { min: 6210, max: 31050, rate: 4.82 },
    { min: 31050, max: Infinity, rate: 5.7 },
  ],
  'louisiana': [
    { min: 0, max: 12500, rate: 1.85 }, { min: 12500, max: 50000, rate: 3.5 },
    { min: 50000, max: Infinity, rate: 4.25 },
  ],
  'maine': [
    { min: 0, max: 24500, rate: 5.8 }, { min: 24500, max: 58050, rate: 6.75 },
    { min: 58050, max: Infinity, rate: 7.15 },
  ],
  'maryland': [
    { min: 0, max: 1000, rate: 2 }, { min: 1000, max: 2000, rate: 3 },
    { min: 2000, max: 3000, rate: 4 }, { min: 3000, max: 100000, rate: 4.75 },
    { min: 100000, max: 125000, rate: 5 }, { min: 125000, max: 150000, rate: 5.25 },
    { min: 150000, max: 250000, rate: 5.5 }, { min: 250000, max: Infinity, rate: 5.75 },
  ],
  'minnesota': [
    { min: 0, max: 30070, rate: 5.35 }, { min: 30070, max: 98760, rate: 6.8 },
    { min: 98760, max: 183340, rate: 7.85 }, { min: 183340, max: Infinity, rate: 9.85 },
  ],
  'missouri': [
    { min: 0, max: 1207, rate: 2 }, { min: 1207, max: 2414, rate: 2.5 },
    { min: 2414, max: 3621, rate: 3 }, { min: 3621, max: 4828, rate: 3.5 },
    { min: 4828, max: 6035, rate: 4 }, { min: 6035, max: 7242, rate: 4.5 },
    { min: 7242, max: 8449, rate: 5 }, { min: 8449, max: Infinity, rate: 4.8 },
  ],
  'montana': [
    { min: 0, max: 20500, rate: 4.7 }, { min: 20500, max: Infinity, rate: 5.9 },
  ],
  'new-mexico': [
    { min: 0, max: 5500, rate: 1.7 }, { min: 5500, max: 11000, rate: 3.2 },
    { min: 11000, max: 16000, rate: 4.7 }, { min: 16000, max: 210000, rate: 4.9 },
    { min: 210000, max: Infinity, rate: 5.9 },
  ],
  'ohio': [
    { min: 0, max: 26050, rate: 0 }, { min: 26050, max: 100000, rate: 2.75 },
    { min: 100000, max: Infinity, rate: 3.5 },
  ],
  'oregon': [
    { min: 0, max: 4050, rate: 4.75 }, { min: 4050, max: 10200, rate: 6.75 },
    { min: 10200, max: 125000, rate: 8.75 }, { min: 125000, max: Infinity, rate: 9.9 },
  ],
  'south-carolina': [
    { min: 0, max: 3460, rate: 0 }, { min: 3460, max: 17330, rate: 3 },
    { min: 17330, max: Infinity, rate: 6.3 },
  ],
  'virginia': [
    { min: 0, max: 3000, rate: 2 }, { min: 3000, max: 5000, rate: 3 },
    { min: 5000, max: 17000, rate: 5 }, { min: 17000, max: Infinity, rate: 5.75 },
  ],
  'wisconsin': [
    { min: 0, max: 14320, rate: 3.5 }, { min: 14320, max: 28640, rate: 4.4 },
    { min: 28640, max: 315310, rate: 5.3 }, { min: 315310, max: Infinity, rate: 7.65 },
  ],
}

// ─── State-specific data tables ──────────────────────────────────────

const STATE_EXTRA_DATA: Record<string, Record<string, any>> = {
  'california': {
    hasEstateTax: false, estateExemption: 0, estateTopRate: 0,
    transferTaxRate: 0.11, avgClosingCostRate: 1.0,
    avgAutoInsurance: 2290, avgHealthInsurance: 580,
    avgHomeInsurance: 1520, avgTeacherSalary: 87275,
    avgInStateTuition: 9084, avgOutStateTuition: 42184,
    avgRoomBoard: 17556, avgStudentDebt: 36950,
    avgRent: 2100, avgGasPrice: 4.85, avgUtilityCost: 220,
    avgGroceryCost: 400, drivingAge: 16, avgLLCFiling: 70,
    avgSpeedingFine: 238, dui1stFine: 2500, dui2ndFine: 4000,
    taxesSocialSecurity: false, taxesPension: true,
    avgSolarInstallCost: 25000, avgSunHours: 5.5, stateSolarCredit: 0,
    avgElectricRate: 0.27, avgNatGasRate: 2.10,
    capitalGainsRate: 13.3, hasNoAdditionalCapGains: false,
    homesteadExemption: 300000, avgWorkerCompRate: 1.34,
    avgFranchiseTax: 800, minWageTipped: 16.50,
  },
  'texas': {
    hasEstateTax: false, estateExemption: 0, estateTopRate: 0,
    transferTaxRate: 0, avgClosingCostRate: 1.4,
    avgAutoInsurance: 2150, avgHealthInsurance: 520,
    avgHomeInsurance: 3875, avgTeacherSalary: 57641,
    avgInStateTuition: 10584, avgOutStateTuition: 24048,
    avgRoomBoard: 11500, avgStudentDebt: 32990,
    avgRent: 1350, avgGasPrice: 2.95, avgUtilityCost: 175,
    avgGroceryCost: 340, drivingAge: 16, avgLLCFiling: 300,
    avgSpeedingFine: 200, dui1stFine: 2000, dui2ndFine: 4000,
    taxesSocialSecurity: false, taxesPension: false,
    avgSolarInstallCost: 22500, avgSunHours: 5.2, stateSolarCredit: 0,
    avgElectricRate: 0.13, avgNatGasRate: 1.20,
    capitalGainsRate: 0, hasNoAdditionalCapGains: true,
    homesteadExemption: 100000, avgWorkerCompRate: 0.86,
    avgFranchiseTax: 0, minWageTipped: 2.13,
  },
  'new-york': {
    hasEstateTax: true, estateExemption: 6940000, estateTopRate: 16,
    transferTaxRate: 0.4, avgClosingCostRate: 2.8,
    avgAutoInsurance: 2600, avgHealthInsurance: 620,
    avgHomeInsurance: 1560, avgTeacherSalary: 92222,
    avgInStateTuition: 7070, avgOutStateTuition: 18090,
    avgRoomBoard: 16250, avgStudentDebt: 35045,
    avgRent: 1750, avgGasPrice: 3.65, avgUtilityCost: 250,
    avgGroceryCost: 390, drivingAge: 16, avgLLCFiling: 200,
    avgSpeedingFine: 300, dui1stFine: 2500, dui2ndFine: 5000,
    taxesSocialSecurity: false, taxesPension: true,
    avgSolarInstallCost: 23000, avgSunHours: 3.8, stateSolarCredit: 5000,
    avgElectricRate: 0.21, avgNatGasRate: 1.60,
    capitalGainsRate: 10.9, hasNoAdditionalCapGains: false,
    homesteadExemption: 0, avgWorkerCompRate: 1.54,
    avgFranchiseTax: 25, minWageTipped: 10.65,
    nycLocalIncomeTax: 3.876, yonkersLocalTax: 1.5,
  },
  'florida': {
    hasEstateTax: false, estateExemption: 0, estateTopRate: 0,
    transferTaxRate: 0.7, avgClosingCostRate: 1.6,
    avgAutoInsurance: 2560, avgHealthInsurance: 540,
    avgHomeInsurance: 4231, avgTeacherSalary: 51009,
    avgInStateTuition: 6380, avgOutStateTuition: 21150,
    avgRoomBoard: 12580, avgStudentDebt: 24890,
    avgRent: 1650, avgGasPrice: 3.35, avgUtilityCost: 190,
    avgGroceryCost: 350, drivingAge: 16, avgLLCFiling: 125,
    avgSpeedingFine: 277, dui1stFine: 1500, dui2ndFine: 4000,
    taxesSocialSecurity: false, taxesPension: false,
    avgSolarInstallCost: 21000, avgSunHours: 5.7, stateSolarCredit: 0,
    avgElectricRate: 0.13, avgNatGasRate: 1.75,
    capitalGainsRate: 0, hasNoAdditionalCapGains: true,
    homesteadExemption: 50000, avgWorkerCompRate: 1.01,
    avgFranchiseTax: 0, minWageTipped: 8.98,
    hurricaneDeductible: 2, avgFloodInsurance: 780,
  },
}

// Default extra data for states without custom data
function getDefaultExtraData(ref: RefData, slug: string): Record<string, any> {
  const isNoIncomeTax = NO_INCOME_TAX.includes(slug)
  return {
    hasEstateTax: false, estateExemption: 0, estateTopRate: 0,
    transferTaxRate: 0.1, avgClosingCostRate: 1.5,
    avgAutoInsurance: 1800, avgHealthInsurance: 500,
    avgHomeInsurance: 1600, avgTeacherSalary: 55000,
    avgInStateTuition: 9000, avgOutStateTuition: 22000,
    avgRoomBoard: 12000, avgStudentDebt: 30000,
    avgRent: 1200, avgGasPrice: 3.20, avgUtilityCost: 180,
    avgGroceryCost: 350, drivingAge: 16, avgLLCFiling: 100,
    avgSpeedingFine: 200, dui1stFine: 2000, dui2ndFine: 4000,
    taxesSocialSecurity: isNoIncomeTax ? false : true,
    taxesPension: isNoIncomeTax ? false : true,
    avgSolarInstallCost: 22000, avgSunHours: 4.5, stateSolarCredit: 0,
    avgElectricRate: 0.14, avgNatGasRate: 1.40,
    capitalGainsRate: isNoIncomeTax ? 0 : ref.topIncomeTaxRate,
    hasNoAdditionalCapGains: isNoIncomeTax,
    homesteadExemption: 50000, avgWorkerCompRate: 1.0,
    avgFranchiseTax: 0, minWageTipped: Math.max(2.13, ref.minimumWage * 0.4),
  }
}

// ─── Calculator definition templates ─────────────────────────────────
interface CalcTemplate {
  baseType: string
  category: string
  nameTemplate: (s: string) => string
  primaryKeywordTemplate: (s: string) => string
  secondaryKeywordsTemplate: (s: string) => string[]
  metaTitleTemplate: (s: string, abbr: string) => string
  metaDescTemplate: (s: string) => string
  heroTitleTemplate: (s: string) => string
  heroSubtitleTemplate: (s: string) => string
  introTextTemplate: (s: string, ref: RefData, extra: Record<string, any>) => string
  formulaTemplate: (s: string, ref: RefData, extra: Record<string, any>) => string
  stateDataTemplate: (ref: RefData, extra: Record<string, any>, slug: string) => Record<string, any>
  faqsTemplate: (s: string, ref: RefData, extra: Record<string, any>) => { question: string; answer: string }[]
  benefitsTemplate: (s: string) => { icon: string; title: string; description: string }[]
  relatedTemplate: (s: string) => string[]
  // condition: if set, only include for states matching condition
  condition?: (ref: RefData, extra: Record<string, any>, slug: string) => boolean
}

function buildCalculatorTemplates(): CalcTemplate[] {
  const templates: CalcTemplate[] = []

  // ─── FINANCE (13) ─────────────────────────────────────────────────
  templates.push({
    baseType: 'income-tax',
    category: 'finance',
    nameTemplate: s => `${s} Income Tax Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} income tax calculator`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} state tax`, `${s.toLowerCase()} tax brackets`, `${s.toLowerCase()} tax rate`],
    metaTitleTemplate: (s, a) => `${s} Income Tax Calculator 2025 | ${a} Tax Rates`,
    metaDescTemplate: s => `Calculate your ${s} state income tax. See current tax brackets, rates, and deductions. Free ${s} income tax calculator.`,
    heroTitleTemplate: s => `${s} Income Tax Calculator`,
    heroSubtitleTemplate: s => `Calculate your ${s} state income tax liability with current rates and brackets`,
    introTextTemplate: (s, ref) => ref.incomeTaxType === 'none'
      ? `${s} is one of the few states with no state income tax. Residents keep 100% of their income from state taxation, though federal taxes still apply.`
      : ref.incomeTaxType === 'flat'
        ? `${s} uses a flat income tax rate of ${ref.flatTaxRate}%. All taxable income is taxed at the same rate regardless of income level.`
        : `${s} uses a progressive income tax system with rates ranging from the lowest bracket up to ${ref.topIncomeTaxRate}%. Higher earners pay more on income above each threshold.`,
    formulaTemplate: (s, ref) => ref.incomeTaxType === 'none'
      ? 'No state income tax applies.'
      : ref.incomeTaxType === 'flat'
        ? `State Tax = Taxable Income × ${ref.flatTaxRate}%`
        : `State Tax = Sum of (Income in each bracket × Bracket rate)`,
    stateDataTemplate: (ref, extra, slug) => {
      const base: Record<string, any> = {
        hasIncomeTax: ref.incomeTaxType !== 'none',
        incomeTaxType: ref.incomeTaxType,
        topIncomeTaxRate: ref.topIncomeTaxRate,
        flatTaxRate: ref.flatTaxRate,
      }
      if (STATE_TAX_BRACKETS[slug]) base.taxBrackets = STATE_TAX_BRACKETS[slug]
      return base
    },
    faqsTemplate: (s, ref) => [
      { question: `What is the ${s} income tax rate?`, answer: ref.incomeTaxType === 'none' ? `${s} has no state income tax.` : ref.incomeTaxType === 'flat' ? `${s} has a flat income tax rate of ${ref.flatTaxRate}%.` : `${s} has progressive tax rates up to ${ref.topIncomeTaxRate}%.` },
      { question: `Does ${s} tax Social Security?`, answer: `${s} does not tax Social Security benefits at the state level.` },
      { question: `How do I file ${s} state taxes?`, answer: `You can file ${s} state taxes online through the state's Department of Revenue website, or use tax preparation software.` },
      { question: `What deductions are available in ${s}?`, answer: `${s} offers standard deductions and may allow itemized deductions. Check the state tax authority for current amounts.` },
      { question: `When are ${s} state taxes due?`, answer: `${s} state income taxes are typically due April 15, the same date as federal taxes, unless an extension is filed.` },
    ],
    benefitsTemplate: s => [
      { icon: '📊', title: 'Accurate Brackets', description: `Uses current ${s} tax brackets and rates` },
      { icon: '💰', title: 'Deduction Support', description: 'Accounts for standard and common deductions' },
      { icon: '📱', title: 'Instant Results', description: 'See your tax liability calculated in real-time' },
    ],
    relatedTemplate: s => [`property-tax-${s.toLowerCase().replace(/ /g, '-')}`, `sales-tax-${s.toLowerCase().replace(/ /g, '-')}`, `paycheck-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  templates.push({
    baseType: 'property-tax',
    category: 'finance',
    nameTemplate: s => `${s} Property Tax Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} property tax calculator`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} property tax rate`, `${s.toLowerCase()} home tax`, `${s.toLowerCase()} real estate tax`],
    metaTitleTemplate: (s, a) => `${s} Property Tax Calculator 2025 | ${a} Rates`,
    metaDescTemplate: s => `Calculate your ${s} property tax based on home value and local rates. See county-level rates and exemptions.`,
    heroTitleTemplate: s => `${s} Property Tax Calculator`,
    heroSubtitleTemplate: s => `Estimate your annual ${s} property tax based on home value and local rates`,
    introTextTemplate: (s, ref) => `The average property tax rate in ${s} is ${ref.avgPropertyTaxRate}%. With a median home value of $${ref.medianHomeValue.toLocaleString()}, this means an average annual property tax of $${Math.round(ref.medianHomeValue * ref.avgPropertyTaxRate / 100).toLocaleString()}.`,
    formulaTemplate: () => `Annual Property Tax = Assessed Home Value × Tax Rate`,
    stateDataTemplate: (ref, extra) => ({
      avgPropertyTaxRate: ref.avgPropertyTaxRate,
      medianHomeValue: ref.medianHomeValue,
      homesteadExemption: extra.homesteadExemption || 0,
    }),
    faqsTemplate: (s, ref) => [
      { question: `What is the average property tax rate in ${s}?`, answer: `The average effective property tax rate in ${s} is ${ref.avgPropertyTaxRate}%.` },
      { question: `How is property tax calculated in ${s}?`, answer: `Property tax is calculated by multiplying your home's assessed value by the local tax rate. Rates vary by county and municipality.` },
      { question: `Are there property tax exemptions in ${s}?`, answer: `${s} offers various exemptions including homestead, senior, veteran, and disability exemptions. Check with your county assessor.` },
      { question: `When are ${s} property taxes due?`, answer: `Property tax due dates vary by county but are typically due in one or two installments per year.` },
      { question: `Can I appeal my ${s} property tax assessment?`, answer: `Yes, you can appeal your property assessment through your county's board of equalization or tax appeal process.` },
    ],
    benefitsTemplate: s => [
      { icon: '🏠', title: 'Local Rates', description: `Based on ${s} county-level tax rates` },
      { icon: '📉', title: 'Exemption Check', description: 'See available homestead exemptions' },
      { icon: '📅', title: 'Monthly Estimate', description: 'Get monthly property tax payment estimates' },
    ],
    relatedTemplate: s => [`mortgage-${s.toLowerCase().replace(/ /g, '-')}`, `home-affordability-${s.toLowerCase().replace(/ /g, '-')}`, `homestead-exemption-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  templates.push({
    baseType: 'sales-tax',
    category: 'finance',
    nameTemplate: s => `${s} Sales Tax Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} sales tax calculator`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} sales tax rate`, `${s.toLowerCase()} tax on purchases`],
    metaTitleTemplate: (s, a) => `${s} Sales Tax Calculator 2025 | ${a} Rates`,
    metaDescTemplate: s => `Calculate ${s} sales tax on any purchase. See state and local combined rates.`,
    heroTitleTemplate: s => `${s} Sales Tax Calculator`,
    heroSubtitleTemplate: s => `Calculate total sales tax including state and local rates in ${s}`,
    introTextTemplate: (s, ref) => NO_SALES_TAX.includes(s.toLowerCase().replace(/ /g, '-'))
      ? `${s} is one of the five states with no state sales tax. Residents enjoy tax-free shopping on most purchases.`
      : `${s} has a state sales tax rate of ${ref.salesTaxRate}%. Combined with local taxes, the total rate can vary by city and county.`,
    formulaTemplate: (s, ref) => `Total Sales Tax = Purchase Amount × (${ref.salesTaxRate}% state + local rate)`,
    stateDataTemplate: (ref) => ({
      salesTaxRate: ref.salesTaxRate,
      hasSalesTax: !NO_SALES_TAX.includes(''),
    }),
    faqsTemplate: (s, ref) => [
      { question: `What is the ${s} sales tax rate?`, answer: `The ${s} state sales tax rate is ${ref.salesTaxRate}%. Local jurisdictions may add additional tax.` },
      { question: `What items are exempt from ${s} sales tax?`, answer: `Common exemptions include groceries, prescription medications, and certain clothing items, though specifics vary by state.` },
      { question: `Does ${s} tax online purchases?`, answer: `Yes, ${s} requires sales tax on online purchases from retailers with nexus in the state.` },
      { question: `What is the highest sales tax in ${s}?`, answer: `Combined state and local sales tax rates vary. Check your specific city or county for the exact combined rate.` },
      { question: `Are there sales tax holidays in ${s}?`, answer: `Some states offer sales tax holidays for back-to-school or hurricane preparedness. Check the state's revenue department for current offerings.` },
    ],
    benefitsTemplate: s => [
      { icon: '🛒', title: 'Purchase Calculator', description: `Calculate exact tax on any ${s} purchase` },
      { icon: '📍', title: 'Local Rates', description: 'Includes city and county tax rates' },
      { icon: '🏷️', title: 'Exemptions Listed', description: 'See what items are tax-exempt' },
    ],
    relatedTemplate: s => [`income-tax-${s.toLowerCase().replace(/ /g, '-')}`, `cost-of-living-${s.toLowerCase().replace(/ /g, '-')}`, `property-tax-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  templates.push({
    baseType: 'capital-gains-tax',
    category: 'finance',
    nameTemplate: s => `${s} Capital Gains Tax Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} capital gains tax`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} investment tax`, `${s.toLowerCase()} stock tax`, `capital gains ${s.toLowerCase()}`],
    metaTitleTemplate: (s, a) => `${s} Capital Gains Tax Calculator | ${a}`,
    metaDescTemplate: s => `Calculate capital gains tax in ${s}. See state rates for short-term and long-term gains on investments.`,
    heroTitleTemplate: s => `${s} Capital Gains Tax Calculator`,
    heroSubtitleTemplate: s => `Estimate your state capital gains tax liability in ${s}`,
    introTextTemplate: (s, ref, extra) => extra.capitalGainsRate === 0
      ? `${s} does not impose a state capital gains tax. Investment profits are not subject to state taxation.`
      : `${s} taxes capital gains as regular income at rates up to ${extra.capitalGainsRate}%. Both short-term and long-term gains are subject to state tax.`,
    formulaTemplate: (s, ref, extra) => extra.capitalGainsRate === 0
      ? 'No state capital gains tax applies.'
      : `State Capital Gains Tax = Gain × State Tax Rate (up to ${extra.capitalGainsRate}%)`,
    stateDataTemplate: (ref, extra) => ({
      topIncomeTaxRate: ref.topIncomeTaxRate,
      flatTaxRate: ref.flatTaxRate,
      capitalGainsRate: extra.capitalGainsRate,
    }),
    faqsTemplate: (s, ref, extra) => [
      { question: `Does ${s} tax capital gains?`, answer: extra.capitalGainsRate === 0 ? `No, ${s} does not tax capital gains at the state level.` : `Yes, ${s} taxes capital gains at rates up to ${extra.capitalGainsRate}%.` },
      { question: `Are long-term and short-term gains taxed differently in ${s}?`, answer: `At the state level, most states tax both types as ordinary income. The federal government offers lower rates for long-term gains.` },
      { question: `How can I reduce capital gains tax in ${s}?`, answer: `Strategies include holding investments for over a year, tax-loss harvesting, using retirement accounts, and utilizing the primary residence exclusion.` },
      { question: `Is there a capital gains exemption in ${s}?`, answer: `${s} follows federal exemptions for primary residence sales ($250K single, $500K married) and may offer additional deductions.` },
      { question: `When do I owe ${s} capital gains tax?`, answer: `Capital gains tax is due when you file your annual state tax return, typically by April 15.` },
    ],
    benefitsTemplate: s => [
      { icon: '📈', title: 'Investment Analysis', description: `Calculate ${s} tax on stock and property gains` },
      { icon: '⏱️', title: 'Holding Period', description: 'Compare short-term vs long-term impact' },
      { icon: '💡', title: 'Tax Strategies', description: 'Learn ways to minimize your tax burden' },
    ],
    relatedTemplate: s => [`income-tax-${s.toLowerCase().replace(/ /g, '-')}`, `investment-tax-${s.toLowerCase().replace(/ /g, '-')}`, `retirement-tax-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  templates.push({
    baseType: 'estate-tax',
    category: 'finance',
    nameTemplate: s => `${s} Estate Tax Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} estate tax`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} inheritance tax`, `${s.toLowerCase()} estate planning`],
    metaTitleTemplate: (s, a) => `${s} Estate Tax Calculator 2025 | ${a}`,
    metaDescTemplate: s => `Calculate ${s} estate tax. See exemptions, rates, and planning strategies for ${s} estates.`,
    heroTitleTemplate: s => `${s} Estate Tax Calculator`,
    heroSubtitleTemplate: s => `Estimate state estate tax liability and exemptions in ${s}`,
    introTextTemplate: (s, ref, extra) => extra.hasEstateTax
      ? `${s} imposes a state estate tax with an exemption of $${(extra.estateExemption || 0).toLocaleString()} and a top rate of ${extra.estateTopRate}%. Estates above the exemption threshold owe state tax in addition to any federal estate tax.`
      : `${s} does not impose a separate state estate tax or inheritance tax. However, the federal estate tax still applies to estates above the federal exemption threshold.`,
    formulaTemplate: (s, ref, extra) => extra.hasEstateTax
      ? `Estate Tax = (Estate Value - $${(extra.estateExemption || 0).toLocaleString()} exemption) × Rate (up to ${extra.estateTopRate}%)`
      : 'No state estate tax applies.',
    stateDataTemplate: (ref, extra) => ({
      hasEstateTax: extra.hasEstateTax,
      estateExemption: extra.estateExemption || 0,
      estateTopRate: extra.estateTopRate || 0,
    }),
    faqsTemplate: (s, ref, extra) => [
      { question: `Does ${s} have an estate tax?`, answer: extra.hasEstateTax ? `Yes, ${s} has an estate tax with an exemption of $${(extra.estateExemption || 0).toLocaleString()}.` : `No, ${s} does not have a state estate tax.` },
      { question: `What is the ${s} estate tax exemption?`, answer: extra.hasEstateTax ? `The ${s} estate tax exemption is $${(extra.estateExemption || 0).toLocaleString()}.` : `${s} has no estate tax, so no exemption is needed.` },
      { question: `Does ${s} have an inheritance tax?`, answer: `Check with the state's Department of Revenue for current inheritance tax laws, as they differ from estate taxes.` },
      { question: `How can I reduce estate taxes in ${s}?`, answer: `Common strategies include gifting, trusts, life insurance, and charitable donations. Consult an estate planning attorney.` },
      { question: `Is the federal estate tax different from ${s}'s?`, answer: `Yes, the federal estate tax is separate with its own exemption ($13.61M in 2024). You may owe both if applicable.` },
    ],
    benefitsTemplate: s => [
      { icon: '🏦', title: 'Estate Planning', description: `${s}-specific estate tax analysis` },
      { icon: '📋', title: 'Exemption Check', description: 'See if your estate exceeds the threshold' },
      { icon: '🔮', title: 'Planning Strategies', description: 'Learn tax-saving estate strategies' },
    ],
    relatedTemplate: s => [`retirement-tax-${s.toLowerCase().replace(/ /g, '-')}`, `income-tax-${s.toLowerCase().replace(/ /g, '-')}`, `capital-gains-tax-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  templates.push({
    baseType: 'effective-tax-rate',
    category: 'finance',
    nameTemplate: s => `${s} Effective Tax Rate Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} effective tax rate`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} total tax burden`, `${s.toLowerCase()} tax percentage`],
    metaTitleTemplate: (s, a) => `${s} Effective Tax Rate Calculator | ${a}`,
    metaDescTemplate: s => `Calculate your total effective tax rate in ${s} including state, federal, and FICA taxes.`,
    heroTitleTemplate: s => `${s} Effective Tax Rate Calculator`,
    heroSubtitleTemplate: s => `See your true tax burden combining all ${s} and federal taxes`,
    introTextTemplate: (s, ref) => `Your effective tax rate in ${s} combines state income tax (${ref.incomeTaxType === 'none' ? '0%' : `up to ${ref.topIncomeTaxRate}%`}), federal income tax, and FICA taxes (7.65%). This calculator shows your combined rate.`,
    formulaTemplate: () => `Effective Rate = Total Tax Paid / Gross Income × 100%`,
    stateDataTemplate: (ref) => ({ flatTaxRate: ref.flatTaxRate, topIncomeTaxRate: ref.topIncomeTaxRate }),
    faqsTemplate: (s, ref) => [
      { question: `What is the effective tax rate in ${s}?`, answer: `It depends on your income level. ${s} state taxes are ${ref.incomeTaxType === 'none' ? '0%' : `up to ${ref.topIncomeTaxRate}%`}, plus federal taxes and FICA.` },
      { question: `How is effective tax rate different from marginal rate?`, answer: `Marginal rate is the tax on your last dollar of income. Effective rate is your total tax divided by total income — typically lower.` },
      { question: `What taxes are included in the effective rate?`, answer: `Federal income tax, state income tax, Social Security tax (6.2%), and Medicare tax (1.45%).` },
      { question: `How can I lower my effective tax rate?`, answer: `Maximize pre-tax deductions (401k, HSA), itemize deductions, use tax credits, and consider tax-loss harvesting.` },
      { question: `Does ${s} have local income taxes too?`, answer: `Some ${s} localities may impose additional income taxes. Check with your city or county.` },
    ],
    benefitsTemplate: s => [
      { icon: '🎯', title: 'True Tax Rate', description: `See your real ${s} tax burden` },
      { icon: '📊', title: 'All Taxes Combined', description: 'State, federal, and FICA in one view' },
      { icon: '💡', title: 'Optimization Tips', description: 'Learn how to reduce your rate' },
    ],
    relatedTemplate: s => [`income-tax-${s.toLowerCase().replace(/ /g, '-')}`, `paycheck-${s.toLowerCase().replace(/ /g, '-')}`, `salary-after-tax-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  templates.push({
    baseType: 'self-employment-tax',
    category: 'finance',
    nameTemplate: s => `${s} Self-Employment Tax Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} self-employment tax`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} freelance tax`, `${s.toLowerCase()} 1099 tax`, `self-employed tax ${s.toLowerCase()}`],
    metaTitleTemplate: (s, a) => `${s} Self-Employment Tax Calculator | ${a}`,
    metaDescTemplate: s => `Calculate self-employment tax in ${s}. See SE tax, state income tax, and quarterly payment estimates.`,
    heroTitleTemplate: s => `${s} Self-Employment Tax Calculator`,
    heroSubtitleTemplate: s => `Estimate your total self-employment tax burden in ${s}`,
    introTextTemplate: (s, ref) => `Self-employed workers in ${s} pay 15.3% in SE tax (Social Security 12.4% + Medicare 2.9%) on 92.35% of net earnings, plus ${ref.incomeTaxType === 'none' ? 'no state income tax' : `state income tax up to ${ref.topIncomeTaxRate}%`}.`,
    formulaTemplate: () => `SE Tax = Net Earnings × 92.35% × 15.3% (SS capped at $168,600)`,
    stateDataTemplate: (ref) => ({ topIncomeTaxRate: ref.topIncomeTaxRate, flatTaxRate: ref.flatTaxRate }),
    faqsTemplate: (s, ref) => [
      { question: `How much is self-employment tax in ${s}?`, answer: `The federal SE tax rate is 15.3% on 92.35% of net earnings. ${ref.incomeTaxType === 'none' ? `${s} adds no state income tax.` : `Plus ${s} state income tax.`}` },
      { question: `Do I need to pay quarterly taxes in ${s}?`, answer: `Yes, self-employed individuals must make estimated quarterly payments if they expect to owe $1,000+ in taxes.` },
      { question: `Can I deduct half of SE tax?`, answer: `Yes, you can deduct 50% of your self-employment tax when calculating your adjusted gross income.` },
      { question: `What expenses can I deduct in ${s}?`, answer: `Common deductions include home office, vehicle, health insurance, supplies, and professional services.` },
      { question: `When are quarterly payments due?`, answer: `Quarterly estimated tax payments are due April 15, June 15, September 15, and January 15.` },
    ],
    benefitsTemplate: s => [
      { icon: '💼', title: 'SE Tax Estimate', description: `Calculate your ${s} self-employment tax` },
      { icon: '📅', title: 'Quarterly Payments', description: 'Get estimated quarterly amounts' },
      { icon: '✂️', title: 'Deduction Finder', description: 'See available business deductions' },
    ],
    relatedTemplate: s => [`income-tax-${s.toLowerCase().replace(/ /g, '-')}`, `effective-tax-rate-${s.toLowerCase().replace(/ /g, '-')}`, `llc-cost-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  templates.push({
    baseType: 'retirement-tax',
    category: 'finance',
    nameTemplate: s => `${s} Retirement Tax Calculator`,
    primaryKeywordTemplate: s => `${s.toLowerCase()} retirement tax`,
    secondaryKeywordsTemplate: s => [`${s.toLowerCase()} pension tax`, `${s.toLowerCase()} 401k tax`, `retirement income ${s.toLowerCase()}`],
    metaTitleTemplate: (s, a) => `${s} Retirement Tax Calculator | ${a}`,
    metaDescTemplate: s => `Calculate taxes on retirement income in ${s}. See how Social Security, pensions, and 401k withdrawals are taxed.`,
    heroTitleTemplate: s => `${s} Retirement Tax Calculator`,
    heroSubtitleTemplate: s => `See how ${s} taxes your retirement income sources`,
    introTextTemplate: (s, ref, extra) => `${s} ${ref.incomeTaxType === 'none' ? 'has no state income tax, so retirement income is not taxed at the state level.' : `taxes retirement income at rates up to ${ref.topIncomeTaxRate}%. Social Security is ${extra.taxesSocialSecurity ? 'taxed' : 'not taxed'}, pensions are ${extra.taxesPension ? 'taxed' : 'not taxed'}.`}`,
    formulaTemplate: () => `State Tax on Retirement = Taxable Retirement Income × State Rate`,
    stateDataTemplate: (ref, extra) => ({
      flatTaxRate: ref.flatTaxRate,
      topIncomeTaxRate: ref.topIncomeTaxRate,
      taxesSocialSecurity: extra.taxesSocialSecurity,
      taxesPension: extra.taxesPension,
    }),
    faqsTemplate: (s, ref, extra) => [
      { question: `Does ${s} tax Social Security?`, answer: extra.taxesSocialSecurity ? `Yes, ${s} taxes Social Security benefits.` : `No, ${s} does not tax Social Security benefits.` },
      { question: `Are pensions taxed in ${s}?`, answer: extra.taxesPension ? `Yes, pension income is subject to ${s} state income tax.` : `No, ${s} does not tax pension income.` },
      { question: `Is ${s} a good state for retirees?`, answer: `${s} has ${ref.incomeTaxType === 'none' ? 'no income tax, making it tax-friendly for retirees' : `income tax rates up to ${ref.topIncomeTaxRate}%`}. Consider cost of living (index: ${ref.costOfLivingIndex}) as well.` },
      { question: `Are 401k withdrawals taxed in ${s}?`, answer: ref.incomeTaxType === 'none' ? `No, ${s} has no state income tax on any income source.` : `Yes, 401k and IRA withdrawals are taxed as regular income in ${s}.` },
      { question: `What is the best state for retirement taxes?`, answer: `States with no income tax (like FL, TX, NV) are popular, but consider overall cost of living, healthcare, and quality of life.` },
    ],
    benefitsTemplate: s => [
      { icon: '🏖️', title: 'Retirement Planning', description: `Plan your ${s} retirement income strategy` },
      { icon: '🔍', title: 'Source Analysis', description: 'See tax impact by income source' },
      { icon: '🗺️', title: 'State Comparison', description: 'Compare retirement tax friendliness' },
    ],
    relatedTemplate: s => [`income-tax-${s.toLowerCase().replace(/ /g, '-')}`, `cost-of-living-${s.toLowerCase().replace(/ /g, '-')}`, `estate-tax-${s.toLowerCase().replace(/ /g, '-')}`],
  })

  // ─── HOUSING (10) ─────────────────────────────────────────────────
  const housingTypes: { baseType: string; label: string; keyword: string; desc: string }[] = [
    { baseType: 'mortgage', label: 'Mortgage', keyword: 'mortgage calculator', desc: 'monthly mortgage payments including PMI, taxes, and insurance' },
    { baseType: 'rent-vs-buy', label: 'Rent vs Buy', keyword: 'rent vs buy calculator', desc: 'whether it\'s better to rent or buy a home' },
    { baseType: 'closing-costs', label: 'Closing Costs', keyword: 'closing costs calculator', desc: 'estimated closing costs for buying or selling a home' },
    { baseType: 'homestead-exemption', label: 'Homestead Exemption', keyword: 'homestead exemption calculator', desc: 'property tax savings from your homestead exemption' },
    { baseType: 'home-affordability', label: 'Home Affordability', keyword: 'home affordability calculator', desc: 'how much house you can afford based on income' },
    { baseType: 'rent-affordability', label: 'Rent Affordability', keyword: 'rent affordability calculator', desc: 'how much rent you can afford based on income' },
    { baseType: 'down-payment', label: 'Down Payment', keyword: 'down payment calculator', desc: 'how long to save for a down payment' },
    { baseType: 'home-equity', label: 'Home Equity Loan', keyword: 'home equity calculator', desc: 'how much you can borrow against your home equity' },
    { baseType: 'refinance', label: 'Refinance', keyword: 'refinance calculator', desc: 'whether refinancing your mortgage saves money' },
    { baseType: 'adu-roi', label: 'ADU ROI', keyword: 'adu calculator', desc: 'the return on investment for an accessory dwelling unit' },
  ]

  for (const h of housingTypes) {
    templates.push({
      baseType: h.baseType,
      category: 'housing',
      nameTemplate: s => `${s} ${h.label} Calculator`,
      primaryKeywordTemplate: s => `${s.toLowerCase()} ${h.keyword}`,
      secondaryKeywordsTemplate: s => [`${h.keyword} ${s.toLowerCase()}`, `${s.toLowerCase()} ${h.label.toLowerCase()}`],
      metaTitleTemplate: (s, a) => `${s} ${h.label} Calculator 2025 | ${a}`,
      metaDescTemplate: s => `Calculate ${h.desc} in ${s}. Free online calculator with ${s}-specific data.`,
      heroTitleTemplate: s => `${s} ${h.label} Calculator`,
      heroSubtitleTemplate: s => `Calculate ${h.desc} in ${s}`,
      introTextTemplate: (s, ref) => `With a median home value of $${ref.medianHomeValue.toLocaleString()} and property tax rate of ${ref.avgPropertyTaxRate}%, understanding ${h.label.toLowerCase()} costs in ${s} is essential for homeowners and buyers.`,
      formulaTemplate: () => `See calculator for ${h.label.toLowerCase()} formula details.`,
      stateDataTemplate: (ref, extra) => ({
        medianHomeValue: ref.medianHomeValue,
        avgPropertyTaxRate: ref.avgPropertyTaxRate,
        homesteadExemption: extra.homesteadExemption,
        avgClosingCostRate: extra.avgClosingCostRate,
        transferTaxRate: extra.transferTaxRate,
        avgRent: extra.avgRent,
      }),
      faqsTemplate: (s, ref) => [
        { question: `What is the median home price in ${s}?`, answer: `The median home value in ${s} is approximately $${ref.medianHomeValue.toLocaleString()}.` },
        { question: `What is the average property tax rate in ${s}?`, answer: `The average effective property tax rate in ${s} is ${ref.avgPropertyTaxRate}%.` },
        { question: `How much is a typical ${h.label.toLowerCase()} in ${s}?`, answer: `${h.label} costs vary by location and property value. Use this calculator for a personalized estimate.` },
        { question: `Is ${s} a good state to buy a home?`, answer: `${s} has a cost of living index of ${ref.costOfLivingIndex} (100 = national average). Consider property taxes, insurance, and local market conditions.` },
        { question: `What are the housing trends in ${s}?`, answer: `Housing markets vary across ${s}. Research specific cities and counties for current trends and forecasts.` },
      ],
      benefitsTemplate: s => [
        { icon: '🏠', title: `${s} Data`, description: `Uses current ${s} housing market data` },
        { icon: '📊', title: 'Detailed Breakdown', description: `Itemized ${h.label.toLowerCase()} analysis` },
        { icon: '🔄', title: 'Compare Options', description: `Compare different ${h.label.toLowerCase()} scenarios` },
      ],
      relatedTemplate: s => {
        const slug = s.toLowerCase().replace(/ /g, '-')
        const others = housingTypes.filter(x => x.baseType !== h.baseType).slice(0, 3)
        return others.map(x => `${x.baseType}-${slug}`)
      },
    })
  }

  // ─── EMPLOYMENT (6 unique, avoiding overlap with finance paycheck/self-employment) ──
  const employmentTypes: { baseType: string; label: string; keyword: string; desc: string }[] = [
    { baseType: 'salary-after-tax', label: 'Salary After Tax', keyword: 'salary after tax', desc: 'your take-home pay after all taxes' },
    { baseType: 'minimum-wage', label: 'Minimum Wage', keyword: 'minimum wage calculator', desc: 'earnings at minimum wage including tipped rates' },
    { baseType: 'overtime', label: 'Overtime', keyword: 'overtime calculator', desc: 'overtime pay with state-specific rules' },
    { baseType: 'workers-comp', label: 'Workers Comp', keyword: 'workers compensation calculator', desc: 'estimated workers compensation insurance costs' },
    { baseType: 'hourly-to-salary', label: 'Hourly to Salary', keyword: 'hourly to salary', desc: 'the salary equivalent of an hourly wage' },
    { baseType: 'take-home-pay', label: 'Take Home Pay', keyword: 'take home pay calculator', desc: 'your net pay after deductions' },
  ]

  for (const e of employmentTypes) {
    templates.push({
      baseType: e.baseType,
      category: 'employment',
      nameTemplate: s => `${s} ${e.label} Calculator`,
      primaryKeywordTemplate: s => `${s.toLowerCase()} ${e.keyword}`,
      secondaryKeywordsTemplate: s => [`${e.keyword} ${s.toLowerCase()}`, `${s.toLowerCase()} ${e.label.toLowerCase()}`],
      metaTitleTemplate: (s, a) => `${s} ${e.label} Calculator 2025 | ${a}`,
      metaDescTemplate: s => `Calculate ${e.desc} in ${s}. Free calculator with current ${s} tax rates and rules.`,
      heroTitleTemplate: s => `${s} ${e.label} Calculator`,
      heroSubtitleTemplate: s => `Calculate ${e.desc} in ${s}`,
      introTextTemplate: (s, ref) => `${s} has a minimum wage of $${ref.minimumWage.toFixed(2)}/hr and ${ref.incomeTaxType === 'none' ? 'no state income tax' : `income tax rates up to ${ref.topIncomeTaxRate}%`}. Use this calculator to estimate ${e.label.toLowerCase()} in ${s}.`,
      formulaTemplate: () => `See calculator for detailed ${e.label.toLowerCase()} formula.`,
      stateDataTemplate: (ref, extra) => ({
        minimumWage: ref.minimumWage,
        flatTaxRate: ref.flatTaxRate,
        topIncomeTaxRate: ref.topIncomeTaxRate,
        minWageTipped: extra.minWageTipped,
        avgWorkerCompRate: extra.avgWorkerCompRate,
      }),
      faqsTemplate: (s, ref) => [
        { question: `What is the minimum wage in ${s}?`, answer: `The ${s} minimum wage is $${ref.minimumWage.toFixed(2)} per hour.` },
        { question: `Does ${s} have a state income tax?`, answer: ref.incomeTaxType === 'none' ? `No, ${s} has no state income tax.` : `Yes, ${s} has income tax rates up to ${ref.topIncomeTaxRate}%.` },
        { question: `How is ${e.label.toLowerCase()} calculated in ${s}?`, answer: `${e.label} in ${s} accounts for federal and state taxes, FICA, and any applicable deductions.` },
        { question: `What deductions apply to ${s} paychecks?`, answer: `Common deductions include federal tax, state tax, Social Security (6.2%), Medicare (1.45%), and voluntary deductions like 401k.` },
        { question: `How does ${s} compare to other states for workers?`, answer: `${s} has a cost of living index of ${ref.costOfLivingIndex} and minimum wage of $${ref.minimumWage.toFixed(2)}, compared to the federal minimum of $7.25.` },
      ],
      benefitsTemplate: s => [
        { icon: '💵', title: `${s} Rates`, description: `Current ${s} tax rates and minimum wage` },
        { icon: '📱', title: 'Quick Results', description: 'Instant calculation with all deductions' },
        { icon: '📊', title: 'Comparison', description: 'Compare to national averages' },
      ],
      relatedTemplate: s => {
        const slug = s.toLowerCase().replace(/ /g, '-')
        const others = employmentTypes.filter(x => x.baseType !== e.baseType).slice(0, 3)
        return others.map(x => `${x.baseType}-${slug}`)
      },
    })
  }

  // ─── INSURANCE (6) ────────────────────────────────────────────────
  const insuranceTypes: { baseType: string; label: string; keyword: string; desc: string }[] = [
    { baseType: 'health-insurance', label: 'Health Insurance', keyword: 'health insurance cost', desc: 'estimated health insurance premiums' },
    { baseType: 'auto-insurance', label: 'Auto Insurance', keyword: 'car insurance cost', desc: 'estimated car insurance premiums' },
    { baseType: 'homeowners-insurance', label: 'Homeowners Insurance', keyword: 'homeowners insurance cost', desc: 'estimated homeowners insurance premiums' },
    { baseType: 'flood-insurance', label: 'Flood Insurance', keyword: 'flood insurance cost', desc: 'estimated flood insurance premiums' },
    { baseType: 'renters-insurance', label: 'Renters Insurance', keyword: 'renters insurance cost', desc: 'estimated renters insurance premiums' },
    { baseType: 'life-insurance', label: 'Life Insurance', keyword: 'life insurance cost', desc: 'estimated life insurance premiums' },
  ]

  for (const i of insuranceTypes) {
    templates.push({
      baseType: i.baseType,
      category: 'insurance',
      nameTemplate: s => `${s} ${i.label} Calculator`,
      primaryKeywordTemplate: s => `${s.toLowerCase()} ${i.keyword}`,
      secondaryKeywordsTemplate: s => [`${i.keyword} ${s.toLowerCase()}`, `average ${i.keyword} ${s.toLowerCase()}`],
      metaTitleTemplate: (s, a) => `${s} ${i.label} Calculator 2025 | ${a}`,
      metaDescTemplate: s => `Estimate ${i.desc} in ${s}. Compare plans and find the best rates for ${s} residents.`,
      heroTitleTemplate: s => `${s} ${i.label} Cost Calculator`,
      heroSubtitleTemplate: s => `Estimate ${i.desc} based on ${s} averages`,
      introTextTemplate: (s, ref, extra) => {
        const avgKey = `avg${i.baseType.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('').replace('Insurance', 'Insurance')}`
        const avg = extra[avgKey]
        return avg
          ? `The average annual ${i.label.toLowerCase()} cost in ${s} is $${Number(avg).toLocaleString()}. Rates vary based on coverage, location, and personal factors.`
          : `${i.label} costs in ${s} vary based on coverage level, location, and personal factors. Use this calculator for a personalized estimate.`
      },
      formulaTemplate: () => `Premium = Base Rate × Coverage Factor × Personal Factors`,
      stateDataTemplate: (ref, extra) => {
        const result: Record<string, any> = { costOfLivingIndex: ref.costOfLivingIndex }
        if (extra.avgAutoInsurance) result.avgAutoInsurance = extra.avgAutoInsurance
        if (extra.avgHealthInsurance) result.avgHealthInsurance = extra.avgHealthInsurance
        if (extra.avgHomeInsurance) result.avgHomeInsurance = extra.avgHomeInsurance
        return result
      },
      faqsTemplate: (s) => [
        { question: `How much does ${i.label.toLowerCase()} cost in ${s}?`, answer: `${i.label} costs in ${s} depend on coverage level, location, and personal factors. Use this calculator for an estimate.` },
        { question: `Is ${i.label.toLowerCase()} required in ${s}?`, answer: `Requirements vary by insurance type and state law. Check ${s}'s Department of Insurance for specific mandates.` },
        { question: `How can I lower my ${i.label.toLowerCase()} in ${s}?`, answer: `Compare quotes from multiple providers, increase your deductible, bundle policies, and maintain a clean record.` },
        { question: `What factors affect ${i.label.toLowerCase()} rates in ${s}?`, answer: `Key factors include location, coverage level, deductible amount, age, credit score, and claims history.` },
        { question: `When should I shop for ${i.label.toLowerCase()} in ${s}?`, answer: `Compare rates annually at renewal time, or after major life changes like moving, buying a home, or getting married.` },
      ],
      benefitsTemplate: s => [
        { icon: '🛡️', title: `${s} Rates`, description: `Based on current ${s} insurance data` },
        { icon: '📊', title: 'Coverage Options', description: 'Compare different coverage levels' },
        { icon: '💰', title: 'Save Money', description: 'Find opportunities to reduce premiums' },
      ],
      relatedTemplate: s => {
        const slug = s.toLowerCase().replace(/ /g, '-')
        const others = insuranceTypes.filter(x => x.baseType !== i.baseType).slice(0, 3)
        return others.map(x => `${x.baseType}-${slug}`)
      },
    })
  }

  // ─── EDUCATION (5) ────────────────────────────────────────────────
  const educationTypes: { baseType: string; label: string; keyword: string; desc: string }[] = [
    { baseType: 'college-cost', label: 'College Cost', keyword: 'college cost', desc: 'total cost of college including tuition, room, and board' },
    { baseType: 'student-loan', label: 'Student Loan Repayment', keyword: 'student loan calculator', desc: 'monthly student loan payments and total interest' },
    { baseType: 'teacher-salary', label: 'Teacher Salary', keyword: 'teacher salary', desc: 'expected teacher salary based on experience and education' },
    { baseType: 'education-savings', label: '529 Plan Savings', keyword: '529 plan calculator', desc: 'how a 529 plan investment grows over time' },
    { baseType: 'in-state-tuition', label: 'In-State Tuition', keyword: 'in-state tuition cost', desc: 'in-state vs out-of-state tuition costs' },
  ]

  for (const ed of educationTypes) {
    templates.push({
      baseType: ed.baseType,
      category: 'education',
      nameTemplate: s => `${s} ${ed.label} Calculator`,
      primaryKeywordTemplate: s => `${s.toLowerCase()} ${ed.keyword}`,
      secondaryKeywordsTemplate: s => [`${ed.keyword} ${s.toLowerCase()}`, `${s.toLowerCase()} ${ed.label.toLowerCase()}`],
      metaTitleTemplate: (s, a) => `${s} ${ed.label} Calculator 2025 | ${a}`,
      metaDescTemplate: s => `Calculate ${ed.desc} in ${s}. Free calculator with ${s}-specific education data.`,
      heroTitleTemplate: s => `${s} ${ed.label} Calculator`,
      heroSubtitleTemplate: s => `Estimate ${ed.desc} for ${s} residents`,
      introTextTemplate: (s, ref, extra) => `${s} offers ${extra.avgInStateTuition ? `in-state tuition averaging $${Number(extra.avgInStateTuition).toLocaleString()}` : 'competitive tuition rates'} at public universities. The average student debt is $${(extra.avgStudentDebt || 30000).toLocaleString()}.`,
      formulaTemplate: () => `See calculator for detailed ${ed.label.toLowerCase()} formula.`,
      stateDataTemplate: (ref, extra) => ({
        avgInStateTuition: extra.avgInStateTuition || 9000,
        avgOutStateTuition: extra.avgOutStateTuition || 22000,
        avgRoomBoard: extra.avgRoomBoard || 12000,
        avgTeacherSalary: extra.avgTeacherSalary || 55000,
        avgStudentDebt: extra.avgStudentDebt || 30000,
      }),
      faqsTemplate: (s, ref, extra) => [
        { question: `What is the average in-state tuition in ${s}?`, answer: `The average in-state tuition at ${s} public universities is approximately $${(extra.avgInStateTuition || 9000).toLocaleString()} per year.` },
        { question: `What is the average teacher salary in ${s}?`, answer: `The average teacher salary in ${s} is approximately $${(extra.avgTeacherSalary || 55000).toLocaleString()} per year.` },
        { question: `How much student debt do ${s} graduates have?`, answer: `The average student debt for ${s} graduates is approximately $${(extra.avgStudentDebt || 30000).toLocaleString()}.` },
        { question: `Does ${s} offer a 529 plan?`, answer: `Yes, ${s} offers a 529 education savings plan with potential state tax deductions. Check the state plan for current benefits.` },
        { question: `What financial aid is available in ${s}?`, answer: `${s} offers various grants, scholarships, and aid programs. Complete the FAFSA and check the state's higher education agency.` },
      ],
      benefitsTemplate: s => [
        { icon: '🎓', title: `${s} Data`, description: `Based on current ${s} education costs` },
        { icon: '📊', title: 'Full Breakdown', description: `Itemized ${ed.label.toLowerCase()} analysis` },
        { icon: '💡', title: 'Planning Tools', description: 'Plan for education expenses' },
      ],
      relatedTemplate: s => {
        const slug = s.toLowerCase().replace(/ /g, '-')
        const others = educationTypes.filter(x => x.baseType !== ed.baseType).slice(0, 3)
        return others.map(x => `${x.baseType}-${slug}`)
      },
    })
  }

  // ─── COST OF LIVING (5) ───────────────────────────────────────────
  const colTypes: { baseType: string; label: string; keyword: string; desc: string }[] = [
    { baseType: 'cost-of-living', label: 'Cost of Living', keyword: 'cost of living', desc: 'the overall cost of living and salary equivalency' },
    { baseType: 'grocery-cost', label: 'Grocery Cost', keyword: 'grocery cost', desc: 'estimated monthly grocery costs' },
    { baseType: 'utility-cost', label: 'Utility Cost', keyword: 'utility bills', desc: 'estimated monthly utility bills' },
    { baseType: 'gas-price', label: 'Gas Price', keyword: 'gas cost', desc: 'fuel costs and driving expenses' },
    { baseType: 'relocation-cost', label: 'Relocation Cost', keyword: 'moving cost', desc: 'estimated costs of relocating' },
  ]

  for (const c of colTypes) {
    templates.push({
      baseType: c.baseType,
      category: 'cost-of-living',
      nameTemplate: s => `${s} ${c.label} Calculator`,
      primaryKeywordTemplate: s => `${s.toLowerCase()} ${c.keyword}`,
      secondaryKeywordsTemplate: s => [`${c.keyword} ${s.toLowerCase()}`, `${s.toLowerCase()} ${c.label.toLowerCase()}`],
      metaTitleTemplate: (s, a) => `${s} ${c.label} Calculator 2025 | ${a}`,
      metaDescTemplate: s => `Calculate ${c.desc} in ${s}. Compare to national averages and other states.`,
      heroTitleTemplate: s => `${s} ${c.label} Calculator`,
      heroSubtitleTemplate: s => `Estimate ${c.desc} in ${s}`,
      introTextTemplate: (s, ref) => `${s} has a cost of living index of ${ref.costOfLivingIndex} (100 = national average). This means living in ${s} is ${ref.costOfLivingIndex > 100 ? `${ref.costOfLivingIndex - 100}% above` : `${100 - ref.costOfLivingIndex}% below`} the national average.`,
      formulaTemplate: () => `See calculator for detailed ${c.label.toLowerCase()} formula.`,
      stateDataTemplate: (ref, extra) => ({
        costOfLivingIndex: ref.costOfLivingIndex,
        avgRent: extra.avgRent,
        avgGasPrice: extra.avgGasPrice,
        avgUtilityCost: extra.avgUtilityCost,
        avgGroceryCost: extra.avgGroceryCost,
      }),
      faqsTemplate: (s, ref) => [
        { question: `What is the cost of living in ${s}?`, answer: `${s}'s cost of living index is ${ref.costOfLivingIndex} (100 = US average). It's ${ref.costOfLivingIndex > 100 ? 'above' : 'below'} average.` },
        { question: `How much does ${c.label.toLowerCase()} cost in ${s}?`, answer: `Use this calculator for a personalized estimate based on your specific situation and location within ${s}.` },
        { question: `Is ${s} expensive to live in?`, answer: `${s} has a cost of living index of ${ref.costOfLivingIndex}. ${ref.costOfLivingIndex > 110 ? 'It is above the national average.' : ref.costOfLivingIndex > 95 ? 'It is close to the national average.' : 'It is below the national average.'}` },
        { question: `How does ${s} compare to other states?`, answer: `The national average cost of living index is 100. ${s} is at ${ref.costOfLivingIndex}, making it ${ref.costOfLivingIndex > 100 ? 'more expensive' : 'more affordable'} than average.` },
        { question: `What is the average rent in ${s}?`, answer: `Average rent varies significantly by city and region within ${s}. Check local listings for current rates in your area.` },
      ],
      benefitsTemplate: s => [
        { icon: '📊', title: `${s} Index`, description: `Based on ${s} cost of living data` },
        { icon: '🔄', title: 'Comparison', description: 'Compare to national averages' },
        { icon: '📱', title: 'Personalized', description: 'Customize for your situation' },
      ],
      relatedTemplate: s => {
        const slug = s.toLowerCase().replace(/ /g, '-')
        const others = colTypes.filter(x => x.baseType !== c.baseType).slice(0, 3)
        return others.map(x => `${x.baseType}-${slug}`)
      },
    })
  }

  // ─── LEGAL (5) ────────────────────────────────────────────────────
  const legalTypes: { baseType: string; label: string; keyword: string; desc: string }[] = [
    { baseType: 'llc-cost', label: 'LLC Cost', keyword: 'LLC cost', desc: 'the cost of forming and maintaining an LLC' },
    { baseType: 'speeding-ticket', label: 'Speeding Ticket', keyword: 'speeding ticket cost', desc: 'speeding ticket fines and insurance impact' },
    { baseType: 'dui-penalty', label: 'DUI Penalty', keyword: 'DUI cost', desc: 'total costs and penalties for a DUI' },
    { baseType: 'traffic-fine', label: 'Traffic Fine', keyword: 'traffic fine', desc: 'traffic violation fines and point penalties' },
    { baseType: 'business-registration', label: 'Business Registration', keyword: 'business registration cost', desc: 'costs of registering a business' },
  ]

  for (const l of legalTypes) {
    templates.push({
      baseType: l.baseType,
      category: 'legal',
      nameTemplate: s => `${s} ${l.label} Calculator`,
      primaryKeywordTemplate: s => `${s.toLowerCase()} ${l.keyword}`,
      secondaryKeywordsTemplate: s => [`${l.keyword} ${s.toLowerCase()}`, `${s.toLowerCase()} ${l.label.toLowerCase()}`],
      metaTitleTemplate: (s, a) => `${s} ${l.label} Calculator 2025 | ${a}`,
      metaDescTemplate: s => `Calculate ${l.desc} in ${s}. See ${s}-specific penalties, fees, and costs.`,
      heroTitleTemplate: s => `${s} ${l.label} Calculator`,
      heroSubtitleTemplate: s => `Estimate ${l.desc} in ${s}`,
      introTextTemplate: (s, ref, extra) => `Understanding ${l.label.toLowerCase()} in ${s} helps you plan and budget. ${l.baseType === 'llc-cost' ? `Filing an LLC in ${s} costs $${(extra.avgLLCFiling || 100).toLocaleString()}.` : `Fines and penalties in ${s} vary by violation type and history.`}`,
      formulaTemplate: () => `See calculator for detailed ${l.label.toLowerCase()} calculations.`,
      stateDataTemplate: (ref, extra) => ({
        avgLLCFiling: extra.avgLLCFiling || 100,
        avgFranchiseTax: extra.avgFranchiseTax || 0,
        avgSpeedingFine: extra.avgSpeedingFine || 200,
        dui1stFine: extra.dui1stFine || 2000,
        dui2ndFine: extra.dui2ndFine || 4000,
      }),
      faqsTemplate: (s, ref, extra) => [
        { question: `How much does ${l.label.toLowerCase()} cost in ${s}?`, answer: `${l.baseType === 'llc-cost' ? `Filing an LLC in ${s} costs approximately $${(extra.avgLLCFiling || 100).toLocaleString()}.` : `Costs vary by specifics. Use this calculator for a detailed estimate.`}` },
        { question: `What are the penalties in ${s}?`, answer: `${s} has specific penalties and fee structures. This calculator includes current ${s} data.` },
        { question: `Do I need a lawyer for this in ${s}?`, answer: `It depends on the complexity. For significant legal matters, consulting a ${s}-licensed attorney is recommended.` },
        { question: `How long does the process take in ${s}?`, answer: `Processing times vary. Check with the relevant ${s} state agency for current timelines.` },
        { question: `Are there ways to reduce costs in ${s}?`, answer: `Some options include online filing, payment plans, and eligibility for fee waivers. Check ${s}'s specific programs.` },
      ],
      benefitsTemplate: s => [
        { icon: '⚖️', title: `${s} Laws`, description: `Based on current ${s} regulations` },
        { icon: '💰', title: 'Cost Breakdown', description: `Itemized ${l.label.toLowerCase()} costs` },
        { icon: '📋', title: 'Full Picture', description: 'All fees and penalties included' },
      ],
      relatedTemplate: s => {
        const slug = s.toLowerCase().replace(/ /g, '-')
        const others = legalTypes.filter(x => x.baseType !== l.baseType).slice(0, 3)
        return others.map(x => `${x.baseType}-${slug}`)
      },
    })
  }

  // ─── STATE-SPECIFIC (5 universal ones) ─────────────────────────────
  const specificTypes: { baseType: string; label: string; keyword: string; desc: string }[] = [
    { baseType: 'solar-panel-roi', label: 'Solar Panel ROI', keyword: 'solar panel calculator', desc: 'the return on investment for solar panels' },
    { baseType: 'ev-savings', label: 'EV Savings', keyword: 'EV savings calculator', desc: 'savings from switching to an electric vehicle' },
    { baseType: 'commute-cost', label: 'Commute Cost', keyword: 'commute cost calculator', desc: 'your daily commuting costs' },
    { baseType: 'lottery-tax', label: 'Lottery Tax', keyword: 'lottery tax calculator', desc: 'taxes on lottery winnings' },
    { baseType: 'child-support', label: 'Child Support', keyword: 'child support calculator', desc: 'estimated child support payments' },
  ]

  for (const sp of specificTypes) {
    templates.push({
      baseType: sp.baseType,
      category: 'state-specific',
      nameTemplate: s => `${s} ${sp.label} Calculator`,
      primaryKeywordTemplate: s => `${s.toLowerCase()} ${sp.keyword}`,
      secondaryKeywordsTemplate: s => [`${sp.keyword} ${s.toLowerCase()}`, `${s.toLowerCase()} ${sp.label.toLowerCase()}`],
      metaTitleTemplate: (s, a) => `${s} ${sp.label} Calculator 2025 | ${a}`,
      metaDescTemplate: s => `Calculate ${sp.desc} in ${s}. Free calculator with ${s}-specific data and rates.`,
      heroTitleTemplate: s => `${s} ${sp.label} Calculator`,
      heroSubtitleTemplate: s => `Estimate ${sp.desc} in ${s}`,
      introTextTemplate: (s, ref, extra) => {
        if (sp.baseType === 'solar-panel-roi') return `${s} averages ${extra.avgSunHours || 4.5} peak sun hours per day. With an average solar installation cost of $${(extra.avgSolarInstallCost || 22000).toLocaleString()} and the 30% federal ITC, solar can be a great investment.`
        if (sp.baseType === 'ev-savings') return `With ${s} electricity averaging $${(extra.avgElectricRate || 0.14).toFixed(2)}/kWh vs gas at $${(extra.avgGasPrice || 3.20).toFixed(2)}/gallon, switching to an EV can yield significant savings.`
        if (sp.baseType === 'lottery-tax') return `Lottery winnings in ${s} are subject to federal tax (24-37%) ${ref.incomeTaxType === 'none' ? 'but no state income tax' : `plus ${s} state tax up to ${ref.topIncomeTaxRate}%`}.`
        return `Calculate ${sp.label.toLowerCase()} specific to ${s} residents using current state data and rates.`
      },
      formulaTemplate: () => `See calculator for detailed ${sp.label.toLowerCase()} formula.`,
      stateDataTemplate: (ref, extra) => ({
        avgSolarInstallCost: extra.avgSolarInstallCost,
        avgSunHours: extra.avgSunHours,
        stateSolarCredit: extra.stateSolarCredit,
        avgElectricRate: extra.avgElectricRate,
        avgGasPrice: extra.avgGasPrice,
        topIncomeTaxRate: ref.topIncomeTaxRate,
        flatTaxRate: ref.flatTaxRate,
        costOfLivingIndex: ref.costOfLivingIndex,
      }),
      faqsTemplate: (s, ref, extra) => [
        { question: `How does ${sp.label.toLowerCase()} work in ${s}?`, answer: `${sp.label} in ${s} follows state-specific rules and rates. Use this calculator for details.` },
        { question: `What factors affect ${sp.label.toLowerCase()} in ${s}?`, answer: `Key factors include location within ${s}, current rates, and personal circumstances.` },
        { question: `Is there a ${sp.label.toLowerCase()} benefit in ${s}?`, answer: `${s} may offer incentives or benefits. Check the state's official resources for current programs.` },
        { question: `How does ${s} compare to other states?`, answer: `${s}'s cost of living is ${ref.costOfLivingIndex > 100 ? 'above' : 'below'} the national average, which affects ${sp.label.toLowerCase()} costs.` },
        { question: `Where can I learn more about ${sp.label.toLowerCase()} in ${s}?`, answer: `Check the ${s} state government website or consult with a local professional for current information.` },
      ],
      benefitsTemplate: s => [
        { icon: '🔧', title: `${s} Specific`, description: `Uses current ${s} rates and data` },
        { icon: '📊', title: 'Detailed Analysis', description: `Complete ${sp.label.toLowerCase()} breakdown` },
        { icon: '💡', title: 'Actionable', description: 'Clear results you can use' },
      ],
      relatedTemplate: s => {
        const slug = s.toLowerCase().replace(/ /g, '-')
        return [`cost-of-living-${slug}`, `income-tax-${slug}`, `property-tax-${slug}`]
      },
    })
  }

  return templates
}

// ─── Generator ───────────────────────────────────────────────────────
function generateStateData(slug: string, ref: RefData): string {
  const stateName = toTitleCase(slug)
  const abbr = STATE_ABBREVS[slug] || slug.toUpperCase().slice(0, 2)
  const extra = STATE_EXTRA_DATA[slug] || getDefaultExtraData(ref, slug)
  const templates = buildCalculatorTemplates()

  const stateFile = {
    state: {
      name: stateName,
      slug: slug,
      abbreviation: abbr,
      capital: ref.capital,
      population: ref.population,
      region: ref.region as any,
      hasIncomeTax: ref.incomeTaxType !== 'none',
      hasSalesTax: ref.salesTaxRate > 0,
      hasPropertyTax: true,
    },
    calculators: templates
      .filter(t => !t.condition || t.condition(ref, extra, slug))
      .map(t => {
        const calcSlug = `${t.baseType}-${slug}`
        return {
          slug: calcSlug,
          baseType: t.baseType,
          name: t.nameTemplate(stateName),
          category: t.category,
          primaryKeyword: t.primaryKeywordTemplate(stateName),
          secondaryKeywords: t.secondaryKeywordsTemplate(stateName),
          metaTitle: t.metaTitleTemplate(stateName, abbr),
          metaDescription: t.metaDescTemplate(stateName),
          heroTitle: t.heroTitleTemplate(stateName),
          heroSubtitle: t.heroSubtitleTemplate(stateName),
          introText: t.introTextTemplate(stateName, ref, extra),
          formula: t.formulaTemplate(stateName, ref, extra),
          stateData: t.stateDataTemplate(ref, extra, slug),
          fields: [],
          benefits: t.benefitsTemplate(stateName),
          faqs: t.faqsTemplate(stateName, ref, extra),
          relatedCalculators: t.relatedTemplate(slug),
        }
      }),
  }

  return JSON.stringify(stateFile, null, 2)
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/generate-state-data.ts <state-slug> [state-slug...]')
    console.log('       npx tsx scripts/generate-state-data.ts --all')
    process.exit(1)
  }

  // Load reference data
  if (!fs.existsSync(REFERENCE_FILE)) {
    console.error('Reference data file not found:', REFERENCE_FILE)
    process.exit(1)
  }

  const reference: Record<string, RefData> = JSON.parse(fs.readFileSync(REFERENCE_FILE, 'utf-8'))
  console.log(`Loaded reference data for ${Object.keys(reference).length} states`)

  // Determine which states to generate
  let stateSlugs: string[]
  if (args.includes('--all')) {
    stateSlugs = Object.keys(reference)
  } else {
    stateSlugs = args.filter(a => !a.startsWith('--'))
  }

  // Ensure output directory exists
  if (!fs.existsSync(STATES_DIR)) {
    fs.mkdirSync(STATES_DIR, { recursive: true })
  }

  let generated = 0
  for (const slug of stateSlugs) {
    if (!reference[slug]) {
      console.error(`No reference data for "${slug}". Skipping.`)
      continue
    }

    const output = generateStateData(slug, reference[slug])
    const outPath = path.join(STATES_DIR, `${slug}.json`)
    fs.writeFileSync(outPath, output, 'utf-8')

    const parsed = JSON.parse(output)
    console.log(`Generated ${outPath} — ${parsed.calculators.length} calculators`)
    generated++
  }

  console.log(`\nDone! Generated ${generated} state files.`)
}

main().catch(console.error)
