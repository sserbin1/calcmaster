'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CalculatorOutput } from '@/lib/calculator-engine'

export interface HistoryEntry {
  id: string
  calculatorType: string
  calculatorName: string
  category: string
  inputs: Record<string, string | number | boolean>
  result: CalculatorOutput
  timestamp: number
}

interface HistoryState {
  entries: HistoryEntry[]
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void
  removeEntry: (id: string) => void
  clearHistory: () => void
  getEntriesByCalculator: (calculatorType: string) => HistoryEntry[]
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: HistoryEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          timestamp: Date.now(),
        }
        set((state) => ({
          entries: [newEntry, ...state.entries].slice(0, 50), // Keep last 50 entries
        }))
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }))
      },

      clearHistory: () => {
        set({ entries: [] })
      },

      getEntriesByCalculator: (calculatorType) => {
        return get().entries.filter((e) => e.calculatorType === calculatorType)
      },
    }),
    {
      name: 'calcmaster-history',
    }
  )
)
