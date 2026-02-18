'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { getCalculatorFields, calculate, type CalculatorInput, type CalculatorOutput, type CalculatorField } from '@/lib/calculator-engine'
import { useHistoryStore } from '@/store/history'
import CalculationHistory from '@/components/CalculationHistory'
import AIExplanation from '@/components/AIExplanation'
import MethodSelector, { type MethodOption } from '@/components/ui/MethodSelector'
import type { ReportData } from '@/components/pdf/ReportDocument'

const TaxInfographic = dynamic(() => import('@/components/charts/TaxInfographic'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-[var(--muted)] rounded-xl" />,
})

const StateCalcInfographic = dynamic(() => import('@/components/charts/StateCalcInfographic'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-[var(--muted)] rounded-xl" />,
})

const ExportReportButton = dynamic(() => import('@/components/ui/ExportReportButton'), {
  ssr: false,
  loading: () => (
    <button disabled className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--muted)] text-[var(--secondary)] opacity-50">
      Loading...
    </button>
  ),
})

const AmortizationTable = dynamic(() => import('@/components/ui/AmortizationTable'), {
  ssr: false,
  loading: () => <div className="h-32 animate-pulse bg-[var(--muted)] rounded-xl" />,
})

// Dynamic import for charts (client-only)
const ResultChart = dynamic(() => import('@/components/charts/ResultChart'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-[var(--muted)] rounded-xl" />,
})

interface GenericCalculatorProps {
  type: string
  name?: string
  category?: string
  methods?: MethodOption[]
  initialFields?: CalculatorField[]
  stateContext?: { baseType: string; stateData: Record<string, unknown> }
  initialResult?: CalculatorOutput
  initialExplanation?: string
  onResult?: (result: CalculatorOutput) => void
}

export default function GenericCalculator({ type, name, category, methods, initialFields, stateContext, initialResult, initialExplanation, onResult }: GenericCalculatorProps) {
  const fields = initialFields && initialFields.length > 0 ? initialFields : getCalculatorFields(type)
  const [values, setValues] = useState<CalculatorInput>(() => {
    const initial: CalculatorInput = {}
    fields.forEach(f => {
      if (f.default !== undefined) initial[f.name] = f.default
    })
    return initial
  })
  const [result, setResult] = useState<CalculatorOutput | null>(initialResult ?? null)
  const [aiExplanation, setAiExplanation] = useState<string | null>(initialExplanation ?? null)
  const [selectedMethod, setSelectedMethod] = useState<string>(
    methods?.find(m => m.isDefault)?.id || methods?.[0]?.id || 'default'
  )
  const addHistoryEntry = useHistoryStore((state) => state.addEntry)

  const handleChange = useCallback((name: string, value: string | number) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleCalculate = useCallback(() => {
    const output = calculate(type, values, selectedMethod, stateContext)
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
  }, [type, values, selectedMethod, stateContext, onResult, addHistoryEntry, name, category])

  const handleMethodChange = useCallback((methodId: string) => {
    setSelectedMethod(methodId)
    // Auto-recalculate when method changes if we have a result
    if (result) {
      const output = calculate(type, values, methodId, stateContext)
      setResult(output)
      onResult?.(output)
    }
  }, [type, values, result, stateContext, onResult])

  const handleRestoreInputs = useCallback((inputs: CalculatorInput) => {
    setValues(inputs)
  }, [])

  const renderField = (field: CalculatorField) => {
    const rawValue = values[field.name]
    const value = typeof rawValue === 'boolean' ? '' : (rawValue ?? '')

    switch (field.type) {
      case 'number':
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {field.label}
              {field.unit && <span className="text-[var(--secondary)] font-normal ml-1">({field.unit})</span>}
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
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>{field.label}</label>
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
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>{field.label}</label>
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
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>{field.label}</label>
            <select
              value={value as string}
              onChange={e => handleChange(field.name, e.target.value)}
              className="calc-input cursor-pointer"
            >
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )

      case 'radio':
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>{field.label}</label>
            <div className="flex rounded-xl bg-[var(--muted)] p-1 gap-1">
              {field.options?.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange(field.name, opt.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    value === opt.value
                      ? 'bg-white shadow-sm text-[var(--primary)] dark:bg-[var(--navy)]'
                      : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
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

      {/* Method Selector */}
      {methods && methods.length > 1 && (
        <MethodSelector
          methods={methods}
          selectedMethod={selectedMethod}
          onMethodChange={handleMethodChange}
        />
      )}

      {/* Input Fields */}
      <div className={`grid gap-5 ${fields.length > 2 ? 'md:grid-cols-2' : ''}`}>
        {fields.map(renderField)}
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="btn-navy w-full py-4 text-lg cursor-pointer"
        style={{ fontFamily: "'Poppins', sans-serif", borderRadius: '0.75rem' }}
      >
        Calculate
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Primary Result */}
          <div className="result-card text-center relative">
            <p className="text-sm opacity-70 mb-2 tracking-wide uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {result.primary.label}
            </p>
            <p className="text-4xl md:text-5xl font-bold mb-1 relative z-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {result.primary.unit === '$' && <span className="text-2xl md:text-3xl opacity-80 mr-1">$</span>}
              {typeof result.primary.value === 'number' ? result.primary.value.toLocaleString() : result.primary.value}
              {result.primary.unit && result.primary.unit !== '$' && (
                <span className="text-xl md:text-2xl ml-2 opacity-70">{result.primary.unit}</span>
              )}
            </p>
          </div>

          {/* Secondary Results */}
          {result.secondary && result.secondary.length > 0 && (
            <div className={`grid gap-3 ${result.secondary.length > 3 ? 'grid-cols-2 md:grid-cols-4' : result.secondary.length > 2 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'}`}>
              {result.secondary.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <p className="text-xs text-[var(--secondary)] mb-1 uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.label}</p>
                  <p className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {item.unit === '$' && <span className="text-sm opacity-70">$</span>}
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    {item.unit && item.unit !== '$' && <span className="text-xs ml-1 font-normal text-[var(--secondary)]">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Chart */}
          <ResultChart result={result} calculatorType={type} />

          {/* Tax Infographic (for tax calculators with rich data) */}
          {result.secondary && result.secondary.some(s => s.label.includes('Federal Tax') || s.label.includes('NYS Tax')) && (
            <TaxInfographic
              result={result}
              grossIncome={Number(values.annualIncome || values.grossPay || 0)}
              stateName={stateContext ? 'New York' : undefined}
            />
          )}

          {/* State Calculator Infographic (housing, transport, legal, etc.) */}
          {!!stateContext?.stateData?.customCalc && (
            <StateCalcInfographic
              result={result}
              customCalc={String(stateContext.stateData.customCalc)}
              values={values}
            />
          )}

          {/* Amortization Schedule */}
          {result.schedule && (
            <AmortizationTable headers={result.schedule.headers} rows={result.schedule.rows} />
          )}

          {/* Breakdown */}
          {result.breakdown && result.breakdown.length > 0 && (
            <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
              <h3 className="font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <svg className="w-4 h-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                Breakdown
              </h3>
              <div className="space-y-2.5">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5">
                    <span className="flex items-center gap-2.5 text-sm text-[var(--secondary)]">
                      {item.color && (
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      )}
                      {item.label}
                    </span>
                    <span className="font-semibold text-sm text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advice */}
          {result.advice && (
            <div className="p-5 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-light)]/50">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Insight
              </h3>
              <p className="text-sm text-[var(--secondary)] leading-relaxed">{result.advice}</p>
            </div>
          )}

          {/* AI Explanation */}
          <AIExplanation
            calculatorType={type}
            calculatorName={name || type}
            inputs={values}
            result={result}
            initialExplanation={aiExplanation || undefined}
            onExplanationReady={setAiExplanation}
          />

          {/* Export PDF */}
          <ExportReportButton
            data={{
              calculatorName: name || type,
              calculatorType: type,
              category: category || 'other',
              result: {
                primary: {
                  value: result.primary.value,
                  label: result.primary.label,
                  unit: result.primary.unit,
                },
                secondary: result.secondary?.map(s => ({
                  label: s.label,
                  value: s.value,
                  unit: s.unit,
                })),
                breakdown: result.breakdown?.map(b => ({
                  label: b.label,
                  value: b.value,
                })),
                advice: result.advice,
              },
              inputs: Object.entries(values).map(([key, val]) => ({
                label: key,
                value: String(val),
              })),
              aiExplanation: aiExplanation || undefined,
              generatedAt: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            } satisfies ReportData}
          />
        </div>
      )}
    </div>
  )
}
