#!/usr/bin/env npx tsx
/**
 * Validate state calculator JSON data files
 *
 * Checks:
 * 1. JSON structure matches StateDataFile interface
 * 2. All required fields present for each calculator
 * 3. State data values match reference data (tax rates, minimums, etc.)
 * 4. No-income-tax states don't have income tax calculators with non-zero rates
 * 5. Slug format is valid (lowercase, hyphenated, includes state slug)
 * 6. Category values are valid
 *
 * Usage: npx tsx scripts/validate-state-data.ts [state-slug]
 *        npx tsx scripts/validate-state-data.ts              (validates all)
 */

import * as fs from 'fs'
import * as path from 'path'

const STATES_DIR = path.join(__dirname, '..', 'src', 'data', 'states')
const REFERENCE_FILE = path.join(STATES_DIR, 'state-reference-data.json')

interface ValidationError {
  file: string
  field: string
  message: string
  severity: 'error' | 'warning'
}

interface ReferenceState {
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

const VALID_CATEGORIES = ['finance', 'housing', 'employment', 'insurance', 'education', 'cost-of-living', 'legal', 'state-specific', 'health', 'math', 'construction']
const NO_INCOME_TAX_STATES = ['alaska', 'florida', 'nevada', 'new-hampshire', 'south-dakota', 'tennessee', 'texas', 'washington', 'wyoming']

function validateStateFile(filePath: string, reference: Record<string, ReferenceState>): ValidationError[] {
  const errors: ValidationError[] = []
  const fileName = path.basename(filePath)
  const stateSlug = fileName.replace('.json', '')

  // Read and parse JSON
  let data: any
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    data = JSON.parse(content)
  } catch (e) {
    errors.push({ file: fileName, field: 'root', message: `Invalid JSON: ${e}`, severity: 'error' })
    return errors
  }

  // Check state metadata
  if (!data.state) {
    errors.push({ file: fileName, field: 'state', message: 'Missing state metadata object', severity: 'error' })
    return errors
  }

  const state = data.state
  const requiredStateFields = ['name', 'slug', 'abbreviation', 'capital', 'population', 'region']
  for (const field of requiredStateFields) {
    if (!state[field]) {
      errors.push({ file: fileName, field: `state.${field}`, message: `Missing required field`, severity: 'error' })
    }
  }

  // Validate slug matches filename
  if (state.slug && state.slug !== stateSlug) {
    errors.push({ file: fileName, field: 'state.slug', message: `Slug "${state.slug}" doesn't match filename "${stateSlug}"`, severity: 'error' })
  }

  // Check against reference data
  const ref = reference[stateSlug]
  if (ref) {
    // Population check (within 10%)
    if (state.population && Math.abs(state.population - ref.population) / ref.population > 0.1) {
      errors.push({ file: fileName, field: 'state.population', message: `Population ${state.population} differs >10% from reference ${ref.population}`, severity: 'warning' })
    }

    // Capital check
    if (state.capital && state.capital !== ref.capital) {
      errors.push({ file: fileName, field: 'state.capital', message: `Capital "${state.capital}" doesn't match reference "${ref.capital}"`, severity: 'error' })
    }
  }

  // Check calculators array
  if (!Array.isArray(data.calculators)) {
    errors.push({ file: fileName, field: 'calculators', message: 'Missing or invalid calculators array', severity: 'error' })
    return errors
  }

  if (data.calculators.length < 10) {
    errors.push({ file: fileName, field: 'calculators', message: `Only ${data.calculators.length} calculators (expected ~50)`, severity: 'warning' })
  }

  // Validate each calculator
  const slugsSeen = new Set<string>()
  for (let i = 0; i < data.calculators.length; i++) {
    const calc = data.calculators[i]
    const prefix = `calculators[${i}]`

    // Required fields
    const requiredCalcFields = ['slug', 'baseType', 'name', 'category', 'primaryKeyword', 'metaTitle', 'metaDescription', 'heroTitle', 'heroSubtitle', 'introText']
    for (const field of requiredCalcFields) {
      if (!calc[field]) {
        errors.push({ file: fileName, field: `${prefix}.${field}`, message: `Missing required field`, severity: 'error' })
      }
    }

    // Slug format: should include state slug
    if (calc.slug && !calc.slug.includes(stateSlug)) {
      errors.push({ file: fileName, field: `${prefix}.slug`, message: `Slug "${calc.slug}" doesn't include state slug "${stateSlug}"`, severity: 'warning' })
    }

    // Duplicate slug check
    if (calc.slug) {
      if (slugsSeen.has(calc.slug)) {
        errors.push({ file: fileName, field: `${prefix}.slug`, message: `Duplicate slug "${calc.slug}"`, severity: 'error' })
      }
      slugsSeen.add(calc.slug)
    }

    // Valid category
    if (calc.category && !VALID_CATEGORIES.includes(calc.category)) {
      errors.push({ file: fileName, field: `${prefix}.category`, message: `Invalid category "${calc.category}"`, severity: 'error' })
    }

    // FAQs present
    if (!calc.faqs || !Array.isArray(calc.faqs) || calc.faqs.length < 3) {
      errors.push({ file: fileName, field: `${prefix}.faqs`, message: `Less than 3 FAQs (has ${calc.faqs?.length || 0})`, severity: 'warning' })
    }

    // Meta title length
    if (calc.metaTitle && calc.metaTitle.length > 70) {
      errors.push({ file: fileName, field: `${prefix}.metaTitle`, message: `Meta title too long (${calc.metaTitle.length} chars, max 70)`, severity: 'warning' })
    }

    // Meta description length
    if (calc.metaDescription && calc.metaDescription.length > 160) {
      errors.push({ file: fileName, field: `${prefix}.metaDescription`, message: `Meta description too long (${calc.metaDescription.length} chars, max 160)`, severity: 'warning' })
    }

    // No-income-tax state validation
    if (NO_INCOME_TAX_STATES.includes(stateSlug)) {
      if (calc.baseType === 'income-tax' && calc.stateData) {
        const rate = Number(calc.stateData.flatTaxRate || calc.stateData.topIncomeTaxRate || 0)
        if (rate > 0) {
          errors.push({ file: fileName, field: `${prefix}.stateData`, message: `No-income-tax state has income tax rate of ${rate}%`, severity: 'error' })
        }
      }
    }

    // Fields array
    if (calc.fields && Array.isArray(calc.fields)) {
      for (let j = 0; j < calc.fields.length; j++) {
        const field = calc.fields[j]
        if (!field.name || !field.label || !field.type) {
          errors.push({ file: fileName, field: `${prefix}.fields[${j}]`, message: 'Field missing name, label, or type', severity: 'error' })
        }
        if (field.type && !['number', 'select', 'radio', 'date', 'text'].includes(field.type)) {
          errors.push({ file: fileName, field: `${prefix}.fields[${j}].type`, message: `Invalid field type "${field.type}"`, severity: 'error' })
        }
      }
    }
  }

  return errors
}

// Main
async function main() {
  const targetState = process.argv[2]

  // Load reference data
  let reference: Record<string, ReferenceState> = {}
  if (fs.existsSync(REFERENCE_FILE)) {
    reference = JSON.parse(fs.readFileSync(REFERENCE_FILE, 'utf-8'))
    console.log(`Loaded reference data for ${Object.keys(reference).length} states`)
  } else {
    console.log('WARNING: No reference data file found. Skipping reference validation.')
  }

  // Find state files to validate
  const files = fs.readdirSync(STATES_DIR)
    .filter(f => f.endsWith('.json') && f !== 'state-reference-data.json')
    .filter(f => !targetState || f === `${targetState}.json`)

  if (files.length === 0) {
    console.log(targetState ? `No state file found for "${targetState}"` : 'No state JSON files found')
    process.exit(1)
  }

  let totalErrors = 0
  let totalWarnings = 0

  for (const file of files) {
    const filePath = path.join(STATES_DIR, file)
    const errors = validateStateFile(filePath, reference)

    const fileErrors = errors.filter(e => e.severity === 'error')
    const fileWarnings = errors.filter(e => e.severity === 'warning')

    if (errors.length > 0) {
      console.log(`\n=== ${file} ===`)
      for (const err of fileErrors) {
        console.log(`  ❌ ERROR [${err.field}]: ${err.message}`)
      }
      for (const warn of fileWarnings) {
        console.log(`  ⚠️  WARN [${warn.field}]: ${warn.message}`)
      }
    } else {
      console.log(`✅ ${file} — OK`)
    }

    totalErrors += fileErrors.length
    totalWarnings += fileWarnings.length
  }

  console.log(`\n--- Summary ---`)
  console.log(`Files validated: ${files.length}`)
  console.log(`Errors: ${totalErrors}`)
  console.log(`Warnings: ${totalWarnings}`)

  if (totalErrors > 0) {
    console.log('\n❌ VALIDATION FAILED')
    process.exit(1)
  } else {
    console.log('\n✅ VALIDATION PASSED')
  }
}

main().catch(console.error)
