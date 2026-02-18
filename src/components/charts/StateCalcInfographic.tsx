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
} from 'recharts'
import type { CalculatorOutput, CalculatorInput } from '@/lib/calculator-engine'

interface StateCalcInfographicProps {
  result: CalculatorOutput
  customCalc?: string
  values: CalculatorInput
}

const COLORS = ['#1E3A8A', '#059669', '#CA8A04', '#DC2626', '#7C3AED', '#10B981', '#0891B2', '#6B7280']
const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

// Category detection from customCalc prefix
function getCategory(customCalc?: string): string | null {
  if (!customCalc) return null
  // Housing
  if (['ny-rent-vs-buy', 'ny-mortgage-recording-tax', 'ny-co-op-vs-condo', 'ny-rent-stabilized', 'ny-closing-cost', 'ny-mansion-tax',
    'ny-flip-tax', 'ny-property-tax', 'ny-airbnb-profit', 'ny-star-exemption', 'ny-mitchell-lama', 'ny-affordable-housing'].includes(customCalc))
    return 'housing'
  // Transport
  if (['ny-mta-fare', 'ny-car-ownership', 'ny-commuter-rail', 'ny-bridge-tolls', 'ny-congestion-pricing',
    'ny-suburb-commute', 'ny-auto-insurance', 'ny-parking-garage'].includes(customCalc))
    return 'transport'
  // Cost of Living
  if (['ny-cost-of-living', 'ny-bodega-grocery', 'ny-coned-bill', 'ny-moving-to-nyc', 'ny-wedding-budget',
    'ny-childcare-cost', 'ny-restaurant-tip', 'ny-broadway-budget'].includes(customCalc))
    return 'cost-of-living'
  // Legal
  if (['ny-llc-publication', 'ny-business-reg', 'ny-dmv-points', 'ny-dui-penalty', 'ny-traffic-fine'].includes(customCalc))
    return 'legal'
  // Finance
  if (['ny-income-tax', 'ny-sales-tax', 'ny-capital-gains', 'ny-estate-tax', 'ny-payroll-tax',
    'ny-self-employment-tax', 'ny-retirement-tax', 'ny-lottery-tax', 'ny-child-support'].includes(customCalc))
    return 'finance'
  // Energy/Education
  if (['ny-solar-nyserda', 'ny-ev-drive-clean', 'ny-health-insurance', 'ny-suny-cuny', 'ny-private-school'].includes(customCalc))
    return 'education-energy'
  return null
}

/** Comparison Meter — shows value relative to a max */
function ComparisonMeter({ label, value, maxValue, color, formatValue }: {
  label: string; value: number; maxValue: number; color: string; formatValue?: (n: number) => string
}) {
  const pct = Math.min((value / maxValue) * 100, 100)
  const fmtV = formatValue || fmt
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--secondary)]">{label}</span>
        <span className="font-semibold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmtV(value)}</span>
      </div>
      <div className="h-2.5 rounded-full bg-[var(--border)] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

/** Stat Card */
function StatCard({ label, value, gradient }: { label: string; value: string; gradient?: string }) {
  return (
    <div className={`p-4 rounded-xl text-white text-center ${gradient || 'bg-gradient-to-br from-[var(--navy)] to-[var(--primary)]'}`}>
      <p className="text-xs opacity-70 uppercase tracking-wider mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</p>
      <p className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</p>
    </div>
  )
}

// Housing-specific: affordability gauge + borough comparison
function HousingInfographic({ result }: { result: CalculatorOutput }) {
  const breakdown = result.breakdown || []
  if (breakdown.length < 2) return null

  const total = breakdown.reduce((sum, b) => sum + (typeof b.value === 'number' ? b.value : 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#059669] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Cost Breakdown Analysis
        </h3>
      </div>

      {/* Horizontal stacked bar */}
      <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Where Your Money Goes
        </h4>
        <div className="relative h-10 rounded-lg overflow-hidden flex">
          {breakdown.map((item, i) => {
            const pct = total > 0 ? ((typeof item.value === 'number' ? item.value : 0) / total) * 100 : 0
            return (
              <div
                key={i}
                className="h-full flex items-center justify-center text-white text-xs font-semibold transition-all"
                style={{ width: `${pct}%`, backgroundColor: item.color || COLORS[i % COLORS.length], fontFamily: "'Poppins', sans-serif", minWidth: pct > 3 ? undefined : '0px' }}
              >
                {pct >= 8 && `${pct.toFixed(0)}%`}
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
          {breakdown.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--secondary)]">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }} />
              <span>{item.label}: {typeof item.value === 'number' ? fmt(item.value) : item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison meters from secondary */}
      {result.secondary && result.secondary.length >= 3 && (
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Key Metrics
          </h4>
          <div className="space-y-3">
            {result.secondary.slice(0, 6).map((item, i) => {
              const numVal = typeof item.value === 'number' ? item.value : parseFloat(String(item.value).replace(/[$,%]/g, '')) || 0
              if (numVal <= 0 || isNaN(numVal)) return null
              const maxVal = numVal * 2.5
              return (
                <ComparisonMeter
                  key={i}
                  label={item.label}
                  value={numVal}
                  maxValue={maxVal}
                  color={COLORS[i % COLORS.length]}
                  formatValue={String(item.value).includes('%') ? (n) => `${n.toFixed(1)}%` : undefined}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Transport: mode comparison radar + cost meters
function TransportInfographic({ result }: { result: CalculatorOutput }) {
  const chartData = result.chartData || []
  if (chartData.length < 2) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#CA8A04] to-[#DC2626] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Cost Comparison
        </h3>
      </div>

      {/* Bar comparison with labels */}
      <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--secondary)" fontSize={11} fontFamily="'Open Sans', sans-serif" tickLine={false} />
              <YAxis stroke="var(--secondary)" fontSize={11} fontFamily="'Open Sans', sans-serif" tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
              <Tooltip
                formatter={(value: number) => ['$' + value.toLocaleString(), 'Cost']}
                contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: "'Open Sans', sans-serif", fontSize: '13px' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings highlight */}
      {result.secondary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {result.secondary.slice(0, 4).map((item, i) => (
            <StatCard key={i} label={item.label} value={typeof item.value === 'number' ? fmt(item.value) : String(item.value)} />
          ))}
        </div>
      )}
    </div>
  )
}

// Legal: penalty/cost visualization
function LegalInfographic({ result }: { result: CalculatorOutput }) {
  const breakdown = result.breakdown || []
  if (breakdown.length < 2) return null

  const total = breakdown.reduce((sum, b) => sum + (typeof b.value === 'number' ? b.value : 0), 0)

  // Donut for cost distribution
  const donutData = breakdown.map((b, i) => ({
    name: b.label,
    value: typeof b.value === 'number' ? b.value : 0,
    color: b.color || COLORS[i % COLORS.length],
  })).filter(d => d.value > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#DC2626] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Cost Distribution
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Donut */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {donutData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => fmt(value)} contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: "'Open Sans', sans-serif", fontSize: '13px' }} />
                <Legend formatter={(value: string) => <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '12px', color: 'var(--secondary)' }}>{value}</span>} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: 700, fill: 'var(--foreground)' }}>
                  {fmt(total)}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Meters */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Component Costs
          </h4>
          <div className="space-y-3">
            {breakdown.map((item, i) => {
              const numVal = typeof item.value === 'number' ? item.value : 0
              return numVal > 0 ? (
                <ComparisonMeter key={i} label={item.label} value={numVal} maxValue={total} color={item.color || COLORS[i % COLORS.length]} />
              ) : null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Education/Energy: savings timeline + aid breakdown
function EduEnergyInfographic({ result }: { result: CalculatorOutput }) {
  const breakdown = result.breakdown || []
  const chartData = result.chartData || []

  if (breakdown.length < 2 && chartData.length < 2) return null

  const total = breakdown.reduce((sum, b) => sum + (typeof b.value === 'number' ? b.value : 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#0891B2] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Savings & Incentives
        </h3>
      </div>

      {/* Horizontal stacked bar for breakdown */}
      {breakdown.length >= 2 && (
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Cost Structure
          </h4>
          <div className="relative h-10 rounded-lg overflow-hidden flex">
            {breakdown.map((item, i) => {
              const pct = total > 0 ? ((typeof item.value === 'number' ? item.value : 0) / total) * 100 : 0
              return (
                <div key={i} className="h-full flex items-center justify-center text-white text-xs font-semibold transition-all"
                  style={{ width: `${pct}%`, backgroundColor: item.color || COLORS[i % COLORS.length], fontFamily: "'Poppins', sans-serif", minWidth: pct > 3 ? undefined : '0px' }}>
                  {pct >= 8 && `${pct.toFixed(0)}%`}
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
            {breakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--secondary)]">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }} />
                <span>{item.label}: {typeof item.value === 'number' ? fmt(item.value) : item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stat cards */}
      {result.secondary && result.secondary.length >= 4 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {result.secondary.slice(0, 4).map((item, i) => (
            <StatCard key={i} label={item.label} value={typeof item.value === 'number' ? fmt(item.value) : String(item.value)} />
          ))}
        </div>
      )}
    </div>
  )
}

// Cost of Living: spending distribution + comparison
function CostOfLivingInfographic({ result }: { result: CalculatorOutput }) {
  const breakdown = result.breakdown || []
  if (breakdown.length < 2) return null

  const total = breakdown.reduce((sum, b) => sum + (typeof b.value === 'number' ? b.value : 0), 0)

  const donutData = breakdown.map((b, i) => ({
    name: b.label,
    value: typeof b.value === 'number' ? b.value : 0,
    color: b.color || COLORS[i % COLORS.length],
  })).filter(d => d.value > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#CA8A04] to-[#059669] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Spending Analysis
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Donut */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Monthly Spending Split
          </h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {donutData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => fmt(value)} contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: "'Open Sans', sans-serif", fontSize: '13px' }} />
                <Legend formatter={(value: string) => <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '12px', color: 'var(--secondary)' }}>{value}</span>} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: 700, fill: 'var(--foreground)' }}>
                  {fmt(total)}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Percentage bar breakdown */}
        <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Percentage Breakdown
          </h4>
          <div className="space-y-3">
            {breakdown.map((item, i) => {
              const numVal = typeof item.value === 'number' ? item.value : 0
              return numVal > 0 ? (
                <ComparisonMeter key={i} label={item.label} value={numVal} maxValue={total} color={item.color || COLORS[i % COLORS.length]} />
              ) : null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StateCalcInfographic({ result, customCalc, values }: StateCalcInfographicProps) {
  const category = useMemo(() => getCategory(customCalc), [customCalc])

  if (!category || !result.breakdown || result.breakdown.length < 2) return null

  // Skip finance category — handled by TaxInfographic
  if (category === 'finance') return null

  switch (category) {
    case 'housing': return <HousingInfographic result={result} />
    case 'transport': return <TransportInfographic result={result} />
    case 'cost-of-living': return <CostOfLivingInfographic result={result} />
    case 'legal': return <LegalInfographic result={result} />
    case 'education-energy': return <EduEnergyInfographic result={result} />
    default: return null
  }
}
