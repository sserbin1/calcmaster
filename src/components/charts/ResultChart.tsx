'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import type { CalculatorOutput } from '@/lib/calculator-engine'

interface ResultChartProps {
  result: CalculatorOutput
  calculatorType: string
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function ResultChart({ result, calculatorType }: ResultChartProps) {
  const chartConfig = useMemo(() => {
    // Determine chart type based on calculator and available data
    if (result.chartData && result.chartData.length > 0) {
      const hasTimeSeries = result.chartData.some(d => d.name?.includes('Year') || d.name?.includes('Month'))

      // Detect multi-series: objects have numeric keys beyond 'value' and 'name'
      const sampleItem = result.chartData[0]
      const numericKeys = Object.keys(sampleItem).filter(k => k !== 'name' && k !== 'value' && k !== 'color' && typeof sampleItem[k] === 'number')
      if (hasTimeSeries && numericKeys.length >= 2) {
        return { type: 'multiline' as const, data: result.chartData, seriesKeys: numericKeys }
      }

      if (hasTimeSeries) {
        return { type: 'line' as const, data: result.chartData }
      }

      // Use pie chart for distribution data (macros, percentages)
      if (['calories', 'tdee', 'macro'].includes(calculatorType)) {
        return { type: 'pie' as const, data: result.chartData }
      }

      return { type: 'bar' as const, data: result.chartData }
    }

    // Generate chart data from breakdown if available
    if (result.breakdown && result.breakdown.length > 0) {
      const data = result.breakdown.map((item, i) => ({
        name: item.label,
        value: parseFloat(String(item.value).replace(/[^0-9.-]/g, '')) || 0,
        color: item.color || COLORS[i % COLORS.length],
      }))

      if (['calories', 'tdee', 'macro', 'bmi'].includes(calculatorType)) {
        return { type: 'pie' as const, data }
      }

      return { type: 'bar' as const, data }
    }

    // Generate chart from secondary results
    if (result.secondary && result.secondary.length > 1) {
      const data = result.secondary.map((item, i) => ({
        name: item.label,
        value: parseFloat(String(item.value).replace(/[^0-9.-]/g, '')) || 0,
        color: COLORS[i % COLORS.length],
      }))
      return { type: 'bar' as const, data }
    }

    return null
  }, [result, calculatorType])

  if (!chartConfig) return null

  return (
    <div className="p-6 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)]">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <span>📊</span> Visual Breakdown
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartConfig.type === 'pie' ? (
            <PieChart>
              <Pie
                data={chartConfig.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartConfig.data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          ) : chartConfig.type === 'multiline' ? (
            <LineChart data={chartConfig.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--secondary)" fontSize={12} />
              <YAxis stroke="var(--secondary)" fontSize={12} tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
              <Tooltip
                formatter={(value: number, name: string) => ['$' + value.toLocaleString(), name.replace(/([A-Z])/g, ' $1').trim()]}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend formatter={(value: string) => value.replace(/([A-Z])/g, ' $1').trim()} />
              {chartConfig.seriesKeys.map((key: string, i: number) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[i % COLORS.length], r: 3 }}
                  name={key}
                />
              ))}
            </LineChart>
          ) : chartConfig.type === 'line' ? (
            <LineChart data={chartConfig.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--secondary)" fontSize={12} />
              <YAxis stroke="var(--secondary)" fontSize={12} />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1' }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartConfig.data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--secondary)" fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--secondary)"
                fontSize={12}
                width={100}
              />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartConfig.data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
