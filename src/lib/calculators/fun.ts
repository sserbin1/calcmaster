// Fun calculator implementations
// Extracted from calculator-engine.ts

import type { CalculatorInput, CalculatorOutput, CalculatorField } from '../calculator-engine'

export function getFunFields(type: string): CalculatorField[] | null {
  const fields: Record<string, CalculatorField[]> = {
    'random-number': [
      { name: 'min', label: 'Minimum', type: 'number', placeholder: '1', default: 1 },
      { name: 'max', label: 'Maximum', type: 'number', placeholder: '100', default: 100 },
      { name: 'count', label: 'How Many', type: 'number', placeholder: '1', default: 1 },
    ],
    dice: [
      { name: 'sides', label: 'Dice Sides', type: 'select', options: [
        { value: '4', label: 'd4' },
        { value: '6', label: 'd6' },
        { value: '8', label: 'd8' },
        { value: '10', label: 'd10' },
        { value: '12', label: 'd12' },
        { value: '20', label: 'd20' },
      ], default: '6' },
      { name: 'count', label: 'Number of Dice', type: 'number', placeholder: '2', default: 2 },
    ],
    love: [
      { name: 'name1', label: 'Your Name', type: 'text', placeholder: 'Enter your name' },
      { name: 'name2', label: "Partner's Name", type: 'text', placeholder: "Enter partner's name" },
    ],
  }
  return fields[type] || null
}

export function calculateFun(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  switch (type) {
    case 'love': {
      const name1 = (input.name1 as string || '').toLowerCase().replace(/[^a-z]/g, '')
      const name2 = (input.name2 as string || '').toLowerCase().replace(/[^a-z]/g, '')

      if (!name1 || !name2) {
        return { primary: { value: '?', label: 'Enter both names!' } }
      }

      // Fun algorithm based on letter frequencies
      const combined = name1 + 'loves' + name2
      let hash = 0
      for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i)
        hash = hash & hash
      }
      const compatibility = Math.abs(hash % 101)

      let message: string
      if (compatibility >= 80) message = 'Amazing match! 💕'
      else if (compatibility >= 60) message = 'Great potential! 💜'
      else if (compatibility >= 40) message = 'Worth exploring! 💙'
      else message = 'Opposites attract? 🤔'

      return {
        primary: { value: compatibility, label: 'Love Score', unit: '%' },
        advice: message,
      }
    }

    case 'random-number': {
      const min = Number(input.min)
      const max = Number(input.max)
      const count = Number(input.count) || 1

      const numbers: number[] = []
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }

      return {
        primary: { value: numbers.join(', '), label: count === 1 ? 'Random Number' : 'Random Numbers' },
        secondary: [
          { label: 'Range', value: `${min} - ${max}` },
        ],
      }
    }

    case 'dice': {
      const sides = Number(input.sides)
      const count = Number(input.count) || 1

      const rolls: number[] = []
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1)
      }

      const total = rolls.reduce((a, b) => a + b, 0)

      return {
        primary: { value: total, label: 'Total' },
        secondary: [
          { label: 'Rolls', value: rolls.join(', ') },
          { label: 'Dice', value: `${count}d${sides}` },
        ],
      }
    }

    case 'password': {
      const length = Math.min(128, Math.max(8, Number(input.length) || 16))
      const useUpper = input.uppercase === 'yes'
      const useLower = input.lowercase === 'yes'
      const useNumbers = input.numbers === 'yes'
      const useSymbols = input.symbols === 'yes'

      let chars = ''
      if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz'
      if (useNumbers) chars += '0123456789'
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

      if (chars.length === 0) chars = 'abcdefghijklmnopqrstuvwxyz'

      let password = ''
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length]
      }

      // Calculate entropy
      const entropy = Math.round(length * Math.log2(chars.length))
      let strength: string
      if (entropy >= 128) strength = 'Very Strong'
      else if (entropy >= 80) strength = 'Strong'
      else if (entropy >= 60) strength = 'Moderate'
      else strength = 'Weak'

      return {
        primary: { value: password, label: 'Generated Password' },
        secondary: [
          { label: 'Length', value: length },
          { label: 'Entropy', value: `${entropy} bits` },
          { label: 'Strength', value: strength },
        ],
        advice: 'Click Calculate again for a new password. Use a password manager to store it securely.',
      }
    }

    case 'converter': {
      const value = Number(input.value)
      const category = input.category as string
      const from = (input.from as string || '').toLowerCase().trim()
      const to = (input.to as string || '').toLowerCase().trim()

      // Conversion factors to base unit
      const conversions: Record<string, Record<string, number>> = {
        length: {
          meters: 1, m: 1, meter: 1,
          feet: 0.3048, ft: 0.3048, foot: 0.3048,
          inches: 0.0254, in: 0.0254, inch: 0.0254,
          yards: 0.9144, yd: 0.9144, yard: 0.9144,
          miles: 1609.344, mi: 1609.344, mile: 1609.344,
          kilometers: 1000, km: 1000,
          centimeters: 0.01, cm: 0.01,
          millimeters: 0.001, mm: 0.001,
        },
        weight: {
          kilograms: 1, kg: 1, kilogram: 1,
          pounds: 0.453592, lbs: 0.453592, lb: 0.453592, pound: 0.453592,
          ounces: 0.0283495, oz: 0.0283495, ounce: 0.0283495,
          grams: 0.001, g: 0.001, gram: 0.001,
          tons: 907.185, ton: 907.185,
          'metric tons': 1000, 'metric ton': 1000,
          stones: 6.35029, stone: 6.35029, st: 6.35029,
        },
        volume: {
          liters: 1, l: 1, liter: 1,
          gallons: 3.78541, gal: 3.78541, gallon: 3.78541,
          quarts: 0.946353, qt: 0.946353, quart: 0.946353,
          pints: 0.473176, pt: 0.473176, pint: 0.473176,
          cups: 0.236588, cup: 0.236588,
          milliliters: 0.001, ml: 0.001,
          'fluid ounces': 0.0295735, floz: 0.0295735, 'fl oz': 0.0295735,
        },
        area: {
          'square meters': 1, sqm: 1, m2: 1,
          'square feet': 0.092903, sqft: 0.092903, ft2: 0.092903,
          'square yards': 0.836127, sqyd: 0.836127,
          'square inches': 0.00064516, sqin: 0.00064516,
          acres: 4046.86, acre: 4046.86,
          hectares: 10000, ha: 10000, hectare: 10000,
        },
        speed: {
          'meters per second': 1, mps: 1, 'm/s': 1,
          'kilometers per hour': 0.277778, kph: 0.277778, 'km/h': 0.277778, kmh: 0.277778,
          'miles per hour': 0.44704, mph: 0.44704,
          knots: 0.514444, knot: 0.514444, kt: 0.514444,
        },
      }

      // Temperature is special
      if (category === 'temperature') {
        const fromUnit = from.charAt(0)
        const toUnit = to.charAt(0)

        let celsius: number
        if (fromUnit === 'f') celsius = (value - 32) * 5 / 9
        else if (fromUnit === 'k') celsius = value - 273.15
        else celsius = value

        let result: number
        if (toUnit === 'f') result = celsius * 9 / 5 + 32
        else if (toUnit === 'k') result = celsius + 273.15
        else result = celsius

        return {
          primary: { value: Math.round(result * 1000) / 1000, label: 'Result' },
          secondary: [
            { label: 'From', value: `${value} ${from}` },
            { label: 'To', value: to },
          ],
        }
      }

      const catConv = conversions[category] || conversions.length
      const fromFactor = catConv[from]
      const toFactor = catConv[to]

      if (!fromFactor || !toFactor) {
        return {
          primary: { value: 'Unknown unit', label: 'Error' },
          advice: `Try units like: ${Object.keys(catConv).slice(0, 5).join(', ')}`,
        }
      }

      const baseValue = value * fromFactor
      const result = baseValue / toFactor

      return {
        primary: { value: Math.round(result * 1000000) / 1000000, label: 'Result' },
        secondary: [
          { label: 'From', value: `${value} ${from}` },
          { label: 'To', value: to },
        ],
      }
    }
    default:
      return null
  }
}
