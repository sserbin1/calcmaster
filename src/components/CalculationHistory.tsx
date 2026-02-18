'use client'

import { useHistoryStore, type HistoryEntry } from '@/store/history'
import { useState } from 'react'

interface CalculationHistoryProps {
  calculatorType: string
  onRestore?: (inputs: HistoryEntry['inputs']) => void
}

export default function CalculationHistory({ calculatorType, onRestore }: CalculationHistoryProps) {
  const { entries, removeEntry, clearHistory } = useHistoryStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const relevantEntries = entries.filter((e) => e.calculatorType === calculatorType)

  if (relevantEntries.length === 0) {
    return null
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <h3 className="font-medium flex items-center gap-2 text-sm text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <svg className="w-4 h-4 text-[var(--secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Recent Calculations ({relevantEntries.length})
        </h3>
        <svg className={`w-4 h-4 text-[var(--secondary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {relevantEntries.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]/50 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-[var(--foreground)]">
                  {entry.result.primary.label}: {entry.result.primary.value}
                  {entry.result.primary.unit && ` ${entry.result.primary.unit}`}
                </p>
                <p className="text-xs text-[var(--secondary)]">{formatTime(entry.timestamp)}</p>
              </div>
              <div className="flex items-center gap-2">
                {onRestore && (
                  <button
                    onClick={() => onRestore(entry.inputs)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Restore
                  </button>
                )}
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-xs text-[var(--secondary)] hover:text-[var(--danger)] transition-colors p-1 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {relevantEntries.length > 5 && (
            <p className="text-xs text-center text-[var(--secondary)]">
              +{relevantEntries.length - 5} more calculations
            </p>
          )}

          <button
            onClick={() => clearHistory()}
            className="w-full text-xs text-center text-[var(--secondary)] hover:text-[var(--danger)] transition-colors py-2 cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Clear all history
          </button>
        </div>
      )}
    </div>
  )
}
