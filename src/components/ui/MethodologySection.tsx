'use client'

import { useState } from 'react'

export interface Formula {
  name: string
  expression: string
  description?: string
  variables?: Array<{ symbol: string; meaning: string }>
}

export interface Source {
  name: string
  url?: string
  year?: number
  type: 'organization' | 'study' | 'standard' | 'book' | 'government'
}

export interface ExpandedContent {
  history: string
  scientificBasis: string
  examples: string[]
  comparison?: string
  prosAndCons?: {
    pros: string[]
    cons: string[]
  }
}

export interface Method {
  name: string
  description: string
  formula?: Formula
  accuracy?: string
  limitations?: string[]
  bestFor?: string
  isDefault?: boolean
  expandedContent?: ExpandedContent
}

export interface MethodologySectionProps {
  title?: string
  methods: Method[]
  sources: Source[]
  footnotes?: string[]
}

export default function MethodologySection({
  title = 'Methodology',
  methods,
  sources,
  footnotes,
}: MethodologySectionProps) {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(
    methods.find(m => m.isDefault)?.name || methods[0]?.name || null
  )

  const toggleMethod = (methodName: string) => {
    setExpandedMethod(expandedMethod === methodName ? null : methodName)
  }

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'organization': return '🏛️'
      case 'study': return '📊'
      case 'standard': return '📋'
      case 'book': return '📚'
      case 'government': return '🏛️'
      default: return '📄'
    }
  }

  return (
    <div className="mt-8 p-6 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🔬</span>
        {title}
      </h2>

      {/* Methods accordion */}
      <div className="space-y-3">
        {methods.map((method) => {
          const isExpanded = expandedMethod === method.name

          return (
            <div
              key={method.name}
              className="rounded-xl bg-[var(--background)] border border-[var(--border)] overflow-hidden"
            >
              {/* Header - clickable */}
              <button
                onClick={() => toggleMethod(method.name)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--muted)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  <div>
                    <span className="font-semibold">{method.name}</span>
                    {method.isDefault && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--primary)] text-white">
                        Default
                      </span>
                    )}
                    {method.accuracy && (
                      <span className="ml-2 text-xs text-[var(--secondary)]">
                        ({method.accuracy} accuracy)
                      </span>
                    )}
                  </div>
                </div>
                {method.bestFor && (
                  <span className="text-xs text-[var(--secondary)] hidden sm:block">
                    Best for: {method.bestFor}
                  </span>
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-[var(--border)]">
                  <p className="text-sm text-[var(--secondary)] mt-3 mb-4">
                    {method.description}
                  </p>

                  {/* Formula display */}
                  {method.formula && (
                    <div className="mb-4 p-4 rounded-lg bg-[var(--muted)]">
                      <p className="text-xs text-[var(--secondary)] mb-2">Formula</p>
                      <code className="text-lg font-mono block mb-3">
                        {method.formula.expression}
                      </code>

                      {method.formula.variables && method.formula.variables.length > 0 && (
                        <div className="text-sm space-y-1">
                          <p className="text-xs text-[var(--secondary)] mb-1">Where:</p>
                          {method.formula.variables.map((v, i) => (
                            <div key={i} className="flex gap-2">
                              <code className="font-mono text-[var(--primary)]">{v.symbol}</code>
                              <span className="text-[var(--secondary)]">= {v.meaning}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Limitations */}
                  {method.limitations && method.limitations.length > 0 && (
                    <div className="text-sm">
                      <p className="text-xs text-[var(--secondary)] mb-2">Limitations:</p>
                      <ul className="list-disc list-inside space-y-1 text-[var(--secondary)]">
                        {method.limitations.map((limit, i) => (
                          <li key={i}>{limit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expanded Content */}
                  {method.expandedContent && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-[var(--border)]">
                      {/* History */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <span>📜</span> Historical Background
                        </h4>
                        <p className="text-sm text-[var(--secondary)] leading-relaxed">
                          {method.expandedContent.history}
                        </p>
                      </div>

                      {/* Scientific Basis */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <span>🔬</span> Scientific Basis
                        </h4>
                        <p className="text-sm text-[var(--secondary)] leading-relaxed">
                          {method.expandedContent.scientificBasis}
                        </p>
                      </div>

                      {/* Examples */}
                      {method.expandedContent.examples.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <span>💡</span> Practical Examples
                          </h4>
                          <ul className="space-y-2">
                            {method.expandedContent.examples.map((example, i) => (
                              <li key={i} className="text-sm text-[var(--secondary)] leading-relaxed pl-4 border-l-2 border-[var(--primary)]">
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Comparison */}
                      {method.expandedContent.comparison && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <span>⚖️</span> Comparison with Other Methods
                          </h4>
                          <p className="text-sm text-[var(--secondary)] leading-relaxed">
                            {method.expandedContent.comparison}
                          </p>
                        </div>
                      )}

                      {/* Pros and Cons */}
                      {method.expandedContent.prosAndCons && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <span>⚡</span> Pros & Cons
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Advantages</p>
                              <ul className="space-y-1">
                                {method.expandedContent.prosAndCons.pros.map((pro, i) => (
                                  <li key={i} className="text-xs text-[var(--secondary)] flex gap-1.5">
                                    <span className="text-green-500 shrink-0">+</span>
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Limitations</p>
                              <ul className="space-y-1">
                                {method.expandedContent.prosAndCons.cons.map((con, i) => (
                                  <li key={i} className="text-xs text-[var(--secondary)] flex gap-1.5">
                                    <span className="text-red-500 shrink-0">-</span>
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>📚</span>
            Sources & References
          </h3>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--border)]"
              >
                {getSourceIcon(source.type)}
                {source.url ? (
                  <a
                    href={`/api/redirect?url=${encodeURIComponent(source.url)}`}
                    target="_blank"
                    rel="noopener nofollow"
                    className="text-[var(--primary)] hover:underline"
                  >
                    {source.name}
                  </a>
                ) : (
                  <span>{source.name}</span>
                )}
                {source.year && (
                  <span className="text-[var(--secondary)]">({source.year})</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footnotes */}
      {footnotes && footnotes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--secondary)] space-y-1">
            {footnotes.map((note, i) => (
              <p key={i}>* {note}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
