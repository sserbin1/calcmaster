'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { getCalculatorFields, calculate, type CalculatorInput, type CalculatorOutput, type CalculatorField } from '@/lib/calculator-engine'
import { useHistoryStore } from '@/store/history'
import CalculationHistory from '@/components/CalculationHistory'
import AIExplanation from '@/components/AIExplanation'

// Dynamic import for charts (client-only)
const ResultChart = dynamic(() => import('@/components/charts/ResultChart'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-[var(--muted)] rounded-2xl" />,
})

interface GenericCalculatorProps {
  type: string
  name?: string
  category?: string
  onResult?: (result: CalculatorOutput) => void
}

export default function GenericCalculator({ type, name, category, onResult }: GenericCalculatorProps) {
  const fields = getCalculatorFields(type)
  const [values, setValues] = useState<CalculatorInput>(() => {
    const initial: CalculatorInput = {}
    fields.forEach(f => {
      if (f.default !== undefined) initial[f.name] = f.default
    })
    return initial
  })
  const [result, setResult] = useState<CalculatorOutput | null>(null)
  const addHistoryEntry = useHistoryStore((state) => state.addEntry)

  const handleChange = useCallback((name: string, value: string | number) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleCalculate = useCallback(() => {
    const output = calculate(type, values)
    setResult(output)
    onResult?.(output)

    // Save to history
    addHistoryEntry({
      calculatorType: type,
      calculatorName: name || type,
      category: category || 'other',
      inputs: values,
      result: output,
    })
  }, [type, values, onResult, addHistoryEntry, name, category])

  const handleRestoreInputs = useCallback((inputs: CalculatorInput) => {
    setValues(inputs)
  }, [])

  const renderField = (field: CalculatorField) => {
    const rawValue = values[field.name]
    const value = typeof rawValue === 'boolean' ? '' : (rawValue ?? '')

    switch (field.type) {
      case 'number':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label} {field.unit && <span className="text-[var(--secondary)]">({field.unit})</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={e => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              className="calc-input"
            />
          </div>
        )

      case 'text':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">{field.label}</label>
            <input
              type="text"
              value={value}
              onChange={e => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="calc-input"
            />
          </div>
        )

      case 'date':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">{field.label}</label>
            <input
              type="date"
              value={value as string}
              onChange={e => handleChange(field.name, e.target.value)}
              className="calc-input"
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">{field.label}</label>
            <select
              value={value as string}
              onChange={e => handleChange(field.name, e.target.value)}
              className="calc-input"
            >
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )

      case 'radio':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">{field.label}</label>
            <div className="flex rounded-xl bg-[var(--muted)] p-1">
              {field.options?.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange(field.name, opt.value)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    value === opt.value
                      ? 'bg-[var(--background)] shadow text-[var(--primary)]'
                      : 'text-[var(--secondary)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* History */}
      <CalculationHistory
        calculatorType={type}
        onRestore={handleRestoreInputs}
      />

      {/* Input Fields */}
      <div className={`grid gap-4 ${fields.length > 2 ? 'md:grid-cols-2' : ''}`}>
        {fields.map(renderField)}
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-medium text-lg hover:bg-[var(--primary-hover)] transition-colors"
      >
        Calculate
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Primary Result */}
          <div className="result-card text-center">
            <p className="text-sm opacity-80 mb-1">{result.primary.label}</p>
            <p className="text-5xl font-bold mb-1">
              {result.primary.value}
              {result.primary.unit && <span className="text-2xl ml-2 opacity-80">{result.primary.unit}</span>}
            </p>
          </div>

          {/* Secondary Results */}
          {result.secondary && result.secondary.length > 0 && (
            <div className={`grid gap-4 ${result.secondary.length > 2 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'}`}>
              {result.secondary.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--muted)]">
                  <p className="text-sm text-[var(--secondary)]">{item.label}</p>
                  <p className="text-xl font-bold">
                    {item.value}
                    {item.unit && <span className="text-sm ml-1 font-normal">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Chart */}
          <ResultChart result={result} calculatorType={type} />

          {/* Breakdown */}
          {result.breakdown && result.breakdown.length > 0 && (
            <div className="p-6 rounded-2xl border-2 border-[var(--border)]">
              <h3 className="font-bold mb-4">Breakdown</h3>
              <div className="space-y-3">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      {item.color && (
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      )}
                      {item.label}
                    </span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advice */}
          {result.advice && (
            <div className="p-6 rounded-2xl bg-[var(--muted)]">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>💡</span> Insight
              </h3>
              <p className="text-[var(--secondary)]">{result.advice}</p>
            </div>
          )}

          {/* AI Explanation */}
          <AIExplanation
            calculatorType={type}
            calculatorName={name || type}
            inputs={values}
            result={result}
          />
        </div>
      )}
    </div>
  )
}
