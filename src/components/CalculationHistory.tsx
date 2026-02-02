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
    <div className="p-4 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="font-medium flex items-center gap-2">
          <span>📋</span> Recent Calculations ({relevantEntries.length})
        </h3>
        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          {relevantEntries.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-lg bg-[var(--background)] flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {entry.result.primary.label}: {entry.result.primary.value}
                  {entry.result.primary.unit && ` ${entry.result.primary.unit}`}
                </p>
                <p className="text-xs text-[var(--secondary)]">{formatTime(entry.timestamp)}</p>
              </div>
              <div className="flex items-center gap-2">
                {onRestore && (
                  <button
                    onClick={() => onRestore(entry.inputs)}
                    className="text-xs px-2 py-1 rounded bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Restore
                  </button>
                )}
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-xs text-[var(--secondary)] hover:text-red-500 transition-colors"
                >
                  ✕
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
            className="w-full text-xs text-center text-[var(--secondary)] hover:text-red-500 transition-colors py-2"
          >
            Clear all history
          </button>
        </div>
      )}
    </div>
  )
}
