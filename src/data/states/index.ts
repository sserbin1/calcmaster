// State data loader — loads all state JSON files and builds lookup tables
import type { StateDataFile, StateInfo, StateCalculatorConfig, StateRouterEntry } from '@/types/state-calculator'

// All US states + DC
export const ALL_STATE_SLUGS = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
  'connecticut', 'delaware', 'district-of-columbia', 'florida', 'georgia',
  'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky',
  'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire',
  'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota',
  'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina',
  'south-dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia',
  'washington', 'west-virginia', 'wisconsin', 'wyoming',
] as const

export type StateSlug = typeof ALL_STATE_SLUGS[number]

// Dynamic import map — each state JSON is loaded on demand
const stateImporters: Partial<Record<StateSlug, () => Promise<StateDataFile>>> = {}

// Register a state data file (called from state-calculators.ts)
export function registerState(slug: StateSlug, importer: () => Promise<StateDataFile>) {
  stateImporters[slug] = importer
}

// Cache for loaded state data
const stateCache = new Map<string, StateDataFile>()

// Load a single state's data
export async function loadStateData(slug: string): Promise<StateDataFile | null> {
  if (stateCache.has(slug)) return stateCache.get(slug)!

  const importer = stateImporters[slug as StateSlug]
  if (!importer) return null

  try {
    const data = await importer()
    stateCache.set(slug, data)
    return data
  } catch {
    console.error(`Failed to load state data for ${slug}`)
    return null
  }
}

// Get list of registered (available) state slugs
export function getRegisteredStateSlugs(): string[] {
  return Object.keys(stateImporters)
}

// Build the full slug → router entry lookup table
// This is used by state-router.ts at module load time
let routerLookup: Map<string, StateRouterEntry> | null = null
let allStateCalcPaths: { category: string; slug: string }[] | null = null
let stateInfoMap: Map<string, StateInfo> | null = null

// Initialize lookup tables from all registered states (sync, for build-time)
export function buildLookupTables(stateDataFiles: StateDataFile[]) {
  routerLookup = new Map()
  allStateCalcPaths = []
  stateInfoMap = new Map()

  for (const stateFile of stateDataFiles) {
    stateInfoMap.set(stateFile.state.slug, stateFile.state)

    for (const calc of stateFile.calculators) {
      // Register in router lookup: full slug → entry
      routerLookup.set(calc.slug, {
        baseType: calc.baseType,
        stateSlug: stateFile.state.slug,
        stateName: stateFile.state.name,
        category: calc.category,
        fields: calc.fields,
        stateData: calc.stateData,
      })

      // Register path for generateStaticParams
      allStateCalcPaths.push({
        category: calc.category,
        slug: calc.slug,
      })
    }
  }
}

// Get router entry by full slug (e.g., "property-tax-california")
export function getStateRouterEntry(slug: string): StateRouterEntry | null {
  return routerLookup?.get(slug) ?? null
}

// Get all state calculator paths for generateStaticParams
export function getAllStateCalculatorPaths(): { category: string; slug: string }[] {
  return allStateCalcPaths ?? []
}

// Get all state landing page slugs
export function getAllStateSlugs(): string[] {
  return stateInfoMap ? Array.from(stateInfoMap.keys()) : []
}

// Get state info by slug
export function getStateInfo(slug: string): StateInfo | null {
  return stateInfoMap?.get(slug) ?? null
}

// Get all calculators for a specific state
export function getStateCalculators(stateSlug: string): StateCalculatorConfig[] {
  // Find from cache
  const stateData = stateCache.get(stateSlug)
  if (stateData) return stateData.calculators
  return []
}

// Check if a slug is a state calculator (fast O(1) lookup)
export function isStateCalculator(slug: string): boolean {
  return routerLookup?.has(slug) ?? false
}
