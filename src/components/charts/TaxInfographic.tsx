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
  Legend,
  Treemap,
} from 'recharts'
import type { CalculatorOutput } from '@/lib/calculator-engine'

interface TaxInfographicProps {
  result: CalculatorOutput
  grossIncome: number
  stateName?: string
}

const TAX_COLORS = {
  federal: '#1E3A8A',
  state: '#059669',
  city: '#CA8A04',
  fica: '#DC2626',
  takeHome: '#10B981',
  deduction: '#8B5CF6',
}

// Custom label for treemap
function TreemapCustomContent(props: { x: number; y: number; width: number; height: number; name: string; value: number; color: string; root?: { children: { value: number }[] } }) {
  const { x, y, width, height, name, value, color } = props
  if (width < 50 || height < 30) return null

  const total = props.root?.children?.reduce((sum: number, c: { value: number }) => sum + c.value, 0) || 1
  const pct = ((value / total) * 100).toFixed(1)

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} rx={6} ry={6} stroke="white" strokeWidth={2} />
      {width > 70 && height > 45 && (
        <>
          <text x={x + 10} y={y + 20} fill="white" fontSize={12} fontWeight={600} fontFamily="Poppins, sans-serif">
            {name}
          </text>
          <text x={x + 10} y={y + 38} fill="rgba(255,255,255,0.8)" fontSize={11} fontFamily="Open Sans, sans-serif">
            ${value.toLocaleString()} ({pct}%)
          </text>
        </>
      )}
      {width > 40 && width <= 70 && height > 30 && (
        <text x={x + 6} y={y + height / 2 + 4} fill="white" fontSize={10} fontWeight={600} fontFamily="Poppins, sans-serif">
          {pct}%
        </text>
      )}
    </g>
  )
}

export default function TaxInfographic({ result, grossIncome, stateName = 'New York' }: TaxInfographicProps) {
  const data = useMemo(() => {
    if (!result.secondary || result.secondary.length < 4) return null

    // Extract tax amounts from secondary
    const getValue = (label: string): number => {
      const item = result.secondary?.find(s => s.label.toLowerCase().includes(label.toLowerCase()))
      if (!item) return 0
      return typeof item.value === 'number' ? item.value : parseFloat(String(item.value).replace(/,/g, '')) || 0
    }

    const federalTax = getValue('Federal Tax')
    const stateTax = getValue('NYS Tax') || getValue('State Tax')
    const cityTax = getValue('NYC Tax') || getValue('City Tax')
    const fica = getValue('FICA')
    const takeHome = getValue('Take-Home Pay') || getValue('Take-Home')
    const effectiveRate = getValue('Effective Rate')
    const marginalRate = getValue('Marginal Rate')
    const monthlyTakeHome = getValue('Monthly')

    const totalTax = typeof result.primary.value === 'number' ? result.primary.value : parseFloat(String(result.primary.value).replace(/,/g, '')) || 0

    return {
      federalTax, stateTax, cityTax, fica, takeHome, totalTax,
      effectiveRate, marginalRate, monthlyTakeHome,
    }
  }, [result])

  if (!data || grossIncome <= 0) return null

  // --- 1. Treemap: Where Your Money Goes ---
  const treemapData = [
    { name: 'Take-Home', value: data.takeHome, color: TAX_COLORS.takeHome },
    { name: 'Federal', value: data.federalTax, color: TAX_COLORS.federal },
    { name: 'NYS', value: data.stateTax, color: TAX_COLORS.state },
    ...(data.cityTax > 0 ? [{ name: 'NYC', value: data.cityTax, color: TAX_COLORS.city }] : []),
    { name: 'FICA', value: data.fica, color: TAX_COLORS.fica },
  ].filter(d => d.value > 0)

  // --- 2. Donut: Tax vs Take-Home ---
  const donutData = [
    { name: 'Take-Home Pay', value: data.takeHome, color: TAX_COLORS.takeHome },
    { name: 'Total Taxes', value: data.totalTax, color: TAX_COLORS.federal },
  ]

  // --- 3. Horizontal stacked bar: Each dollar breakdown ---
  const perDollar = [
    { label: 'Federal', cents: Math.round((data.federalTax / grossIncome) * 100), color: TAX_COLORS.federal },
    { label: 'NYS', cents: Math.round((data.stateTax / grossIncome) * 100), color: TAX_COLORS.state },
    ...(data.cityTax > 0 ? [{ label: 'NYC', cents: Math.round((data.cityTax / grossIncome) * 100), color: TAX_COLORS.city }] : []),
    { label: 'FICA', cents: Math.round((data.fica / grossIncome) * 100), color: TAX_COLORS.fica },
  ]
  const takeHomeCents = 100 - perDollar.reduce((sum, d) => sum + d.cents, 0)

  // --- 4. Waterfall data ---
  const waterfallData = [
    { name: 'Gross Income', value: grossIncome, fill: '#475569' },
    { name: 'Federal Tax', value: -data.federalTax, fill: TAX_COLORS.federal },
    { name: 'NYS Tax', value: -data.stateTax, fill: TAX_COLORS.state },
    ...(data.cityTax > 0 ? [{ name: 'NYC Tax', value: -data.cityTax, fill: TAX_COLORS.city }] : []),
    { name: 'FICA', value: -data.fica, fill: TAX_COLORS.fica },
    { name: 'Take-Home', value: data.takeHome, fill: TAX_COLORS.takeHome },
  ]

  // Calculate running totals for waterfall
  let runningTotal = 0
  const waterfallBars = waterfallData.map((d, i) => {
    if (i === 0) {
      runningTotal = d.value
      return { ...d, start: 0, end: d.value }
    }
    if (i === waterfallData.length - 1) {
      return { ...d, start: 0, end: d.value }
    }
    const start = runningTotal + d.value
    const result = { ...d, start: Math.min(start, runningTotal), end: Math.max(start, runningTotal) }
    runningTotal = start
    return result
  })

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Tax Breakdown Analysis
        </h3>
      </div>

      {/* Row 1: Treemap + Donut side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Treemap: Where Your Money Goes */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Where Every Dollar Goes
          </h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="value"
                aspectRatio={4 / 3}
                stroke="white"
                content={<TreemapCustomContent x={0} y={0} width={0} height={0} name="" value={0} color="" />}
              />
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut: Tax vs Take-Home */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Income Split
          </h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {donutData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => '$' + value.toLocaleString()}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '13px',
                  }}
                />
                <Legend
                  formatter={(value: string) => <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '12px', color: 'var(--secondary)' }}>{value}</span>}
                />
                {/* Center label */}
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '20px', fontWeight: 700, fill: 'var(--foreground)' }}>
                  {data.effectiveRate.toFixed(1)}%
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', fill: 'var(--secondary)' }}>
                  effective rate
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Per-Dollar Breakdown Bar */}
      <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
          For Every Dollar You Earn in {stateName}
        </h4>

        {/* Stacked horizontal bar */}
        <div className="relative h-10 rounded-lg overflow-hidden flex" role="img" aria-label="Tax breakdown per dollar">
          {perDollar.map((segment, i) => (
            <div
              key={i}
              className="h-full flex items-center justify-center text-white text-xs font-semibold transition-all"
              style={{
                width: `${segment.cents}%`,
                backgroundColor: segment.color,
                fontFamily: "'Poppins', sans-serif",
                minWidth: segment.cents > 3 ? undefined : '0px',
              }}
            >
              {segment.cents >= 5 && `${segment.cents}¢`}
            </div>
          ))}
          <div
            className="h-full flex items-center justify-center text-white text-xs font-semibold"
            style={{
              width: `${takeHomeCents}%`,
              backgroundColor: TAX_COLORS.takeHome,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {takeHomeCents}¢
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
          {perDollar.map((segment, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--secondary)]">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: segment.color }} />
              <span>{segment.label}: {segment.cents}¢</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs text-[var(--secondary)]">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: TAX_COLORS.takeHome }} />
            <span>Take-Home: {takeHomeCents}¢</span>
          </div>
        </div>
      </div>

      {/* Row 3: Waterfall Chart */}
      <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Income to Take-Home Waterfall
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallBars} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--secondary)"
                fontSize={11}
                fontFamily="'Open Sans', sans-serif"
                tickLine={false}
              />
              <YAxis
                stroke="var(--secondary)"
                fontSize={11}
                fontFamily="'Open Sans', sans-serif"
                tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'end') return ['$' + Math.abs(value).toLocaleString(), 'Amount']
                  return [null, null]
                }}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '13px',
                }}
              />
              {/* Invisible base bar */}
              <Bar dataKey="start" stackId="waterfall" fill="transparent" />
              {/* Visible portion */}
              <Bar dataKey="end" stackId="waterfall" radius={[4, 4, 0, 0]}>
                {waterfallBars.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Rate Comparison Meters */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Effective Rate */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Effective Tax Rate
          </h4>
          <p className="text-xs text-[var(--secondary)] mb-3">What you actually pay on your total income</p>
          <div className="relative">
            <div className="h-3 rounded-full bg-[var(--border)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(data.effectiveRate, 60)}%`,
                  background: `linear-gradient(90deg, ${TAX_COLORS.takeHome}, ${TAX_COLORS.city})`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {data.effectiveRate.toFixed(1)}%
              </span>
              <span className="text-xs text-[var(--secondary)] self-end">of 60% scale</span>
            </div>
          </div>
        </div>

        {/* Marginal Rate */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Combined Marginal Rate
          </h4>
          <p className="text-xs text-[var(--secondary)] mb-3">Rate on your next dollar of income</p>
          <div className="relative">
            <div className="h-3 rounded-full bg-[var(--border)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(data.marginalRate, 60)}%`,
                  background: `linear-gradient(90deg, ${TAX_COLORS.city}, ${TAX_COLORS.fica})`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {data.marginalRate.toFixed(1)}%
              </span>
              <span className="text-xs text-[var(--secondary)] self-end">of 60% scale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--navy)] to-[var(--primary)] text-white text-center">
          <p className="text-xs opacity-70 uppercase tracking-wider mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Monthly Net</p>
          <p className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>${data.monthlyTakeHome.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--navy)] to-[var(--primary)] text-white text-center">
          <p className="text-xs opacity-70 uppercase tracking-wider mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Weekly Net</p>
          <p className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>${Math.round(data.takeHome / 52).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--navy)] to-[var(--primary)] text-white text-center">
          <p className="text-xs opacity-70 uppercase tracking-wider mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Daily Net</p>
          <p className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>${Math.round(data.takeHome / 365).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--navy)] to-[var(--primary)] text-white text-center">
          <p className="text-xs opacity-70 uppercase tracking-wider mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Hourly Net</p>
          <p className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>${(data.takeHome / 2080).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
