'use client'

import { useState } from 'react'
import type { CalculatorOutput, CalculatorInput } from '@/lib/calculator-engine'

interface AIExplanationProps {
  calculatorType: string
  calculatorName: string
  inputs: CalculatorInput
  result: CalculatorOutput
  onExplanationReady?: (explanation: string) => void
}

export default function AIExplanation({
  calculatorType,
  calculatorName,
  inputs,
  result,
  onExplanationReady,
}: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExplanation = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorType,
          calculatorName,
          inputs,
          result,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get explanation')
      }

      const data = await response.json()
      setExplanation(data.explanation)
      onExplanationReady?.(data.explanation)
    } catch (err) {
      setError('Could not generate explanation. Please try again.')
      console.error('AI Explanation error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!explanation && !loading) {
    return (
      <button
        onClick={fetchExplanation}
        className="w-full p-4 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-colors flex items-center justify-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)]"
      >
        <span className="text-xl">🤖</span>
        <span>Get AI Explanation</span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
          <span className="text-[var(--secondary)]">Generating AI explanation...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/20">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={fetchExplanation}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <span>🤖</span> AI Explanation
      </h3>
      <div className="max-w-none text-[var(--foreground)] space-y-2">
        {explanation?.split('\n').map((paragraph, i) => {
          if (!paragraph.trim()) return null
          // Bold section headers like **What This Means**
          const headerMatch = paragraph.match(/^\*\*(.+?)\*\*$/)
          if (headerMatch) {
            return (
              <h4 key={i} className="text-sm font-bold mt-4 mb-1 text-[var(--primary)]">
                {headerMatch[1]}
              </h4>
            )
          }
          // Inline bold within paragraphs
          const parts = paragraph.split(/\*\*(.+?)\*\*/g)
          return (
            <p key={i} className="text-sm text-[var(--secondary)] leading-relaxed">
              {parts.map((part, j) => (
                j % 2 === 1
                  ? <strong key={j} className="text-[var(--foreground)]">{part}</strong>
                  : <span key={j}>{part}</span>
              ))}
            </p>
          )
        })}
      </div>
      <button
        onClick={fetchExplanation}
        className="mt-4 text-xs text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
      >
        ↻ Regenerate
      </button>
    </div>
  )
}
