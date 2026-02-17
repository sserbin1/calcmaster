// State calculator data merger — loads all state JSON files and builds lookup tables
// This file is imported at build time to register all state calculators

import type { StateDataFile, StateCalculatorConfig } from '@/types/state-calculator'
import { buildLookupTables, registerState, type StateSlug } from './states'

// Dynamic imports for each state JSON file
// Add new states here as they are generated (Batch 1C onwards)
// JSON imports use `as any` because TypeScript infers string for union types (e.g., region)
const stateFiles: Partial<Record<StateSlug, () => Promise<{ default: StateDataFile }>>> = {
  // Batch 1C: First 4 states
  'california': () => import('./states/california.json') as any,
  'texas': () => import('./states/texas.json') as any,
  'new-york': () => import('./states/new-york.json') as any,
  'florida': () => import('./states/florida.json') as any,
}

// Register all states with the loader
for (const [slug, importer] of Object.entries(stateFiles)) {
  if (importer) {
    registerState(slug as StateSlug, async () => {
      const mod = await importer()
      return mod.default
    })
  }
}

// Load all state data at build time and build lookup tables
let initialized = false
const allStateDataFiles: StateDataFile[] = []

export async function initializeStateCalculators(): Promise<void> {
  if (initialized) return

  for (const [slug, importer] of Object.entries(stateFiles)) {
    if (!importer) continue
    try {
      const mod = await importer()
      allStateDataFiles.push(mod.default)
    } catch (e) {
      console.error(`Failed to load state data for ${slug}:`, e)
    }
  }

  buildLookupTables(allStateDataFiles)
  initialized = true
}

// Synchronous init from pre-loaded data (for build-time use)
export function initializeFromPreloaded(dataFiles: StateDataFile[]): void {
  if (initialized) return
  allStateDataFiles.push(...dataFiles)
  buildLookupTables(allStateDataFiles)
  initialized = true
}

// Get a specific state calculator config by category and slug
export function getStateCalculatorConfig(category: string, slug: string): StateCalculatorConfig | null {
  for (const stateFile of allStateDataFiles) {
    const calc = stateFile.calculators.find(c => c.slug === slug && c.category === category)
    if (calc) return calc
  }
  return null
}

// Get all state calculator paths for static generation
export function getAllStateCalcPaths(): { category: string; slug: string }[] {
  const paths: { category: string; slug: string }[] = []
  for (const stateFile of allStateDataFiles) {
    for (const calc of stateFile.calculators) {
      paths.push({ category: calc.category, slug: calc.slug })
    }
  }
  return paths
}

// Eagerly initialize on module load (for build-time SSG)
// This ensures lookup tables are ready when generateStaticParams runs
const initPromise = initializeStateCalculators()
export { initPromise }
