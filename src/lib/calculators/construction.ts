// Construction calculator implementations
// Extracted from calculator-engine.ts

import type { CalculatorInput, CalculatorOutput, CalculatorField } from '../calculator-engine'

export function getConstructionFields(type: string): CalculatorField[] | null {
  const fields: Record<string, CalculatorField[]> = {
    sqft: [
      { name: 'length', label: 'Length', type: 'number', placeholder: '20', unit: 'ft' },
      { name: 'width', label: 'Width', type: 'number', placeholder: '15', unit: 'ft' },
    ],
    paint: [
      { name: 'length', label: 'Room Length', type: 'number', placeholder: '20', unit: 'ft' },
      { name: 'width', label: 'Room Width', type: 'number', placeholder: '15', unit: 'ft' },
      { name: 'height', label: 'Wall Height', type: 'number', placeholder: '8', unit: 'ft' },
      { name: 'coats', label: 'Number of Coats', type: 'number', placeholder: '2', default: 2 },
    ],
    concrete: [
      { name: 'length', label: 'Length', type: 'number', placeholder: '10', unit: 'ft' },
      { name: 'width', label: 'Width', type: 'number', placeholder: '10', unit: 'ft' },
      { name: 'depth', label: 'Depth/Thickness', type: 'number', placeholder: '4', unit: 'inches' },
    ],
    tile: [
      { name: 'areaLength', label: 'Area Length', type: 'number', placeholder: '10', unit: 'ft' },
      { name: 'areaWidth', label: 'Area Width', type: 'number', placeholder: '8', unit: 'ft' },
      { name: 'tileLength', label: 'Tile Length', type: 'number', placeholder: '12', unit: 'inches' },
      { name: 'tileWidth', label: 'Tile Width', type: 'number', placeholder: '12', unit: 'inches' },
      { name: 'gap', label: 'Gap/Spacing', type: 'number', placeholder: '0.125', unit: 'inches', default: 0.125 },
      { name: 'waste', label: 'Waste Factor', type: 'number', placeholder: '10', unit: '%', default: 10 },
    ],
    btu: [
      { name: 'squareFeet', label: 'Room Size', type: 'number', placeholder: '300', unit: 'sq ft' },
      { name: 'ceilingHeight', label: 'Ceiling Height', type: 'number', placeholder: '8', unit: 'ft', default: 8 },
      { name: 'insulation', label: 'Insulation', type: 'select', options: [
        { value: 'poor', label: 'Poor' },
        { value: 'average', label: 'Average' },
        { value: 'good', label: 'Good' },
      ], default: 'average' },
      { name: 'climate', label: 'Climate', type: 'select', options: [
        { value: 'hot', label: 'Hot/Humid' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'cold', label: 'Cold' },
      ], default: 'moderate' },
      { name: 'mode', label: 'Mode', type: 'radio', options: [
        { value: 'cooling', label: 'Cooling (AC)' },
        { value: 'heating', label: 'Heating' },
      ], default: 'cooling' },
    ],
    password: [
      { name: 'length', label: 'Password Length', type: 'number', placeholder: '16', default: 16, min: 8, max: 128 },
      { name: 'uppercase', label: 'Include Uppercase', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
      { name: 'lowercase', label: 'Include Lowercase', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
      { name: 'numbers', label: 'Include Numbers', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
      { name: 'symbols', label: 'Include Symbols', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'yes' },
    ],
    converter: [
      { name: 'value', label: 'Value', type: 'number', placeholder: '100' },
      { name: 'category', label: 'Category', type: 'select', options: [
        { value: 'length', label: 'Length' },
        { value: 'weight', label: 'Weight' },
        { value: 'temperature', label: 'Temperature' },
        { value: 'volume', label: 'Volume' },
        { value: 'area', label: 'Area' },
        { value: 'speed', label: 'Speed' },
      ], default: 'length' },
      { name: 'from', label: 'From Unit', type: 'text', placeholder: 'meters' },
      { name: 'to', label: 'To Unit', type: 'text', placeholder: 'feet' },
    ],
  }
  return fields[type] || null
}

export function calculateConstruction(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  switch (type) {
    case 'concrete': {
      const length = Number(input.length)
      const width = Number(input.width)
      const depthInches = Number(input.depth)
      const depthFeet = depthInches / 12

      const cubicFeet = length * width * depthFeet
      const cubicYards = cubicFeet / 27
      const cubicMeters = cubicFeet * 0.0283168

      // Add 10% for waste
      const yardsWithWaste = Math.ceil(cubicYards * 1.1 * 10) / 10

      // Estimate 80lb bags (0.6 cubic feet per bag)
      const bags80lb = Math.ceil(cubicFeet / 0.6)
      const bags60lb = Math.ceil(cubicFeet / 0.45)

      return {
        primary: { value: yardsWithWaste, label: 'Cubic Yards', unit: 'yd³' },
        secondary: [
          { label: 'Cubic Feet', value: Math.round(cubicFeet * 100) / 100, unit: 'ft³' },
          { label: 'Cubic Meters', value: Math.round(cubicMeters * 100) / 100, unit: 'm³' },
          { label: '80lb Bags', value: bags80lb },
          { label: '60lb Bags', value: bags60lb },
        ],
        advice: 'Includes 10% extra for waste. Order slightly more for safety.',
      }
    }

    case 'sqft': {
      const length = Number(input.length)
      const width = Number(input.width)
      const sqft = length * width

      return {
        primary: { value: sqft, label: 'Area', unit: 'sq ft' },
        secondary: [
          { label: 'Square Meters', value: Math.round(sqft * 0.0929 * 100) / 100, unit: 'm²' },
          { label: 'Square Yards', value: Math.round(sqft / 9 * 100) / 100, unit: 'sq yd' },
        ],
      }
    }

    case 'tile': {
      const areaLength = Number(input.areaLength)
      const areaWidth = Number(input.areaWidth)
      const tileLengthIn = Number(input.tileLength)
      const tileWidthIn = Number(input.tileWidth)
      const gap = Number(input.gap) || 0
      const wastePercent = Number(input.waste) || 10

      const areaSqFt = areaLength * areaWidth

      // Convert tile to feet including gap
      const tileLengthFt = (tileLengthIn + gap) / 12
      const tileWidthFt = (tileWidthIn + gap) / 12
      const tileSqFt = tileLengthFt * tileWidthFt

      const tilesNeeded = areaSqFt / tileSqFt
      const tilesWithWaste = Math.ceil(tilesNeeded * (1 + wastePercent / 100))

      // Boxes (typically 10-15 tiles per box)
      const boxesNeeded = Math.ceil(tilesWithWaste / 12)

      return {
        primary: { value: tilesWithWaste, label: 'Tiles Needed', unit: 'tiles' },
        secondary: [
          { label: 'Area', value: areaSqFt, unit: 'sq ft' },
          { label: 'Tiles (no waste)', value: Math.ceil(tilesNeeded) },
          { label: 'Boxes (12/box)', value: boxesNeeded },
          { label: 'Waste Factor', value: `${wastePercent}%` },
        ],
        advice: `Based on ${tileLengthIn}" x ${tileWidthIn}" tiles with ${gap}" spacing.`,
      }
    }

    case 'paint': {
      const length = Number(input.length)
      const width = Number(input.width)
      const height = Number(input.height)
      const coats = Number(input.coats) || 2

      const wallArea = 2 * (length + width) * height
      const coveragePerGallon = 350 // sq ft per gallon
      const gallons = Math.ceil((wallArea * coats) / coveragePerGallon)

      return {
        primary: { value: gallons, label: 'Gallons Needed', unit: 'gallons' },
        secondary: [
          { label: 'Wall Area', value: Math.round(wallArea), unit: 'sq ft' },
          { label: 'Coverage Needed', value: Math.round(wallArea * coats), unit: 'sq ft' },
        ],
        advice: `Based on ${coveragePerGallon} sq ft coverage per gallon with ${coats} coats`,
      }
    }

    case 'btu': {
      const squareFeet = Number(input.squareFeet)
      const ceilingHeight = Number(input.ceilingHeight) || 8
      const insulation = input.insulation as string
      const climate = input.climate as string
      const mode = input.mode as string

      // Base BTU: 20 BTU per sq ft for cooling
      let baseBtu = squareFeet * 20

      // Ceiling height adjustment (baseline 8ft)
      baseBtu *= ceilingHeight / 8

      // Insulation adjustment
      const insulationFactor = { poor: 1.3, average: 1.0, good: 0.8 }[insulation] || 1
      baseBtu *= insulationFactor

      // Climate adjustment
      const climateFactor = { hot: 1.2, moderate: 1.0, cold: 0.9 }[climate] || 1
      baseBtu *= climateFactor

      // Heating requires more BTU
      if (mode === 'heating') {
        baseBtu *= 1.4
      }

      const btuResult = Math.ceil(baseBtu / 1000) * 1000
      const tons = Math.round((btuResult / 12000) * 10) / 10

      return {
        primary: { value: btuResult.toLocaleString(), label: 'BTU Needed', unit: 'BTU' },
        secondary: [
          { label: 'Tons', value: tons },
          { label: 'Room Size', value: squareFeet, unit: 'sq ft' },
          { label: 'Mode', value: mode === 'cooling' ? 'Cooling (AC)' : 'Heating' },
        ],
        advice: `For ${mode}: ${insulation} insulation in ${climate} climate. Consider window exposure and occupancy for final sizing.`,
      }
    }
    default:
      return null
  }
}
