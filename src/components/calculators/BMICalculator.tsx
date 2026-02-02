'use client'

import { useState, useCallback } from 'react'
import { calculateBMI, bmiCategories, type BMIResult } from '@/lib/calculators/bmi'

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [heightFeet, setHeightFeet] = useState<string>('')
  const [heightInches, setHeightInches] = useState<string>('')
  const [result, setResult] = useState<BMIResult | null>(null)

  const calculate = useCallback(() => {
    const weightNum = parseFloat(weight)
    let heightNum: number

    if (unit === 'imperial') {
      const feet = parseFloat(heightFeet) || 0
      const inches = parseFloat(heightInches) || 0
      heightNum = feet * 12 + inches // total inches
    } else {
      heightNum = parseFloat(height)
    }

    if (!weightNum || !heightNum || weightNum <= 0 || heightNum <= 0) {
      setResult(null)
      return
    }

    const bmiResult = calculateBMI({ weight: weightNum, height: heightNum, unit })
    setResult(bmiResult)
  }, [weight, height, heightFeet, heightInches, unit])

  // Calculate on input change
  const handleInputChange = useCallback(() => {
    setTimeout(calculate, 100)
  }, [calculate])

  return (
    <div className="space-y-8">
      {/* Unit Toggle */}
      <div className="flex rounded-xl bg-[var(--muted)] p-1">
        <button
          onClick={() => { setUnit('metric'); setResult(null) }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            unit === 'metric'
              ? 'bg-[var(--background)] shadow text-[var(--primary)]'
              : 'text-[var(--secondary)]'
          }`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => { setUnit('imperial'); setResult(null) }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            unit === 'imperial'
              ? 'bg-[var(--background)] shadow text-[var(--primary)]'
              : 'text-[var(--secondary)]'
          }`}
        >
          Imperial (lbs/ft)
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => { setWeight(e.target.value); handleInputChange() }}
            placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
            className="calc-input"
          />
        </div>

        {unit === 'metric' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => { setHeight(e.target.value); handleInputChange() }}
              placeholder="e.g., 175"
              className="calc-input"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => { setHeightFeet(e.target.value); handleInputChange() }}
                placeholder="ft"
                className="calc-input w-1/2"
              />
              <input
                type="number"
                value={heightInches}
                onChange={(e) => { setHeightInches(e.target.value); handleInputChange() }}
                placeholder="in"
                className="calc-input w-1/2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-medium text-lg hover:bg-[var(--primary-hover)] transition-colors"
      >
        Calculate BMI
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Result */}
          <div className="result-card text-center">
            <p className="text-sm opacity-80 mb-1">Your BMI</p>
            <p className="text-6xl font-bold mb-2">{result.bmi}</p>
            <p
              className="text-xl font-medium px-4 py-1 rounded-full inline-block"
              style={{ backgroundColor: result.categoryColor + '33' }}
            >
              {result.category}
            </p>
          </div>

          {/* BMI Scale Visualization */}
          <div className="p-6 rounded-2xl border-2 border-[var(--border)]">
            <h3 className="font-bold mb-4">BMI Scale</h3>
            <div className="relative h-8 rounded-full overflow-hidden flex">
              {bmiCategories.map((cat, i) => (
                <div
                  key={cat.category}
                  className="h-full flex-1"
                  style={{ backgroundColor: cat.color }}
                />
              ))}
              {/* Indicator */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                style={{
                  left: `${Math.min(Math.max((result.bmi - 15) / 30 * 100, 0), 100)}%`,
                }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--foreground)] text-[var(--background)] text-xs px-2 py-1 rounded whitespace-nowrap">
                  {result.bmi}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--secondary)]">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40+</span>
            </div>
          </div>

          {/* Advice */}
          <div className="p-6 rounded-2xl bg-[var(--muted)]">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span>💡</span> AI Insight
            </h3>
            <p className="text-[var(--secondary)]">{result.advice}</p>
          </div>

          {/* Healthy Range */}
          <div className="p-6 rounded-2xl border-2 border-[var(--border)]">
            <h3 className="font-bold mb-2">Healthy Weight Range</h3>
            <p className="text-[var(--secondary)]">
              For your height, a healthy weight is between{' '}
              <span className="font-bold text-[var(--accent)]">
                {result.healthyWeightRange.min} kg
              </span>{' '}
              and{' '}
              <span className="font-bold text-[var(--accent)]">
                {result.healthyWeightRange.max} kg
              </span>
            </p>
          </div>

          {/* Categories Table */}
          <div className="p-6 rounded-2xl border-2 border-[var(--border)]">
            <h3 className="font-bold mb-4">BMI Categories</h3>
            <div className="space-y-2">
              {bmiCategories.map((cat) => (
                <div
                  key={cat.category}
                  className={`flex justify-between p-3 rounded-lg ${
                    cat.category === result.category ? 'ring-2 ring-[var(--primary)]' : ''
                  }`}
                  style={{ backgroundColor: cat.color + '15' }}
                >
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-[var(--secondary)]">{cat.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
