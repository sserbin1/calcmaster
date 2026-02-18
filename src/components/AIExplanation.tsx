'use client'

import { useState } from 'react'
import type { CalculatorOutput, CalculatorInput } from '@/lib/calculator-engine'

interface AIExplanationProps {
  calculatorType: string
  calculatorName: string
  inputs: CalculatorInput
  result: CalculatorOutput
  initialExplanation?: string
  onExplanationReady?: (explanation: string) => void
}

export default function AIExplanation({
  calculatorType,
  calculatorName,
  inputs,
  result,
  initialExplanation,
  onExplanationReady,
}: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(initialExplanation ?? null)
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
        className="w-full p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-all flex items-center justify-center gap-2.5 text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer group"
      >
        <svg className="w-5 h-5 group-hover:text-[var(--primary)] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Get AI Explanation</span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="p-5 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)]/20">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
          <span className="text-sm text-[var(--secondary)]" style={{ fontFamily: "'Poppins', sans-serif" }}>Generating AI explanation...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-5 rounded-xl bg-[var(--danger-light)] border border-[var(--danger)]/20">
        <p className="text-[var(--danger)] text-sm mb-3">{error}</p>
        <button
          onClick={fetchExplanation}
          className="text-sm text-[var(--primary)] hover:underline cursor-pointer"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--primary-light)] to-[var(--accent-light)]/30 border border-[var(--primary)]/15">
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <svg className="w-4 h-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        AI Explanation
      </h3>
      <div className="space-y-2">
        {explanation?.split('\n').map((paragraph, i) => {
          if (!paragraph.trim()) return null
          // Bold section headers like **What This Means**
          const headerMatch = paragraph.match(/^\*\*(.+?)\*\*$/)
          if (headerMatch) {
            return (
              <h4 key={i} className="text-sm font-bold mt-4 mb-1 text-[var(--primary)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                  ? <strong key={j} className="text-[var(--foreground)] font-semibold">{part}</strong>
                  : <span key={j}>{part}</span>
              ))}
            </p>
          )
        })}
      </div>
      <button
        onClick={fetchExplanation}
        className="mt-4 text-xs text-[var(--secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        Regenerate
      </button>
    </div>
  )
}
