import Link from 'next/link'
import type { StateCalculatorConfig } from '@/types/state-calculator'

interface StateCalculatorGridProps {
  calculators: StateCalculatorConfig[]
  stateName: string
}

// Group calculators by category
const categoryMeta: Record<string, { label: string; icon: string; color: string }> = {
  finance: { label: 'Finance & Tax', icon: '💰', color: 'border-blue-500/50' },
  housing: { label: 'Housing', icon: '🏠', color: 'border-emerald-500/50' },
  employment: { label: 'Employment', icon: '💼', color: 'border-amber-500/50' },
  insurance: { label: 'Insurance', icon: '🛡️', color: 'border-red-500/50' },
  education: { label: 'Education', icon: '🎓', color: 'border-indigo-500/50' },
  'cost-of-living': { label: 'Cost of Living', icon: '🏙️', color: 'border-violet-500/50' },
  legal: { label: 'Legal', icon: '⚖️', color: 'border-gray-500/50' },
  'state-specific': { label: 'State Specific', icon: '⭐', color: 'border-orange-500/50' },
  health: { label: 'Health', icon: '🏥', color: 'border-green-500/50' },
  math: { label: 'Math', icon: '📐', color: 'border-purple-500/50' },
  construction: { label: 'Construction', icon: '🏗️', color: 'border-yellow-500/50' },
}

export default function StateCalculatorGrid({ calculators, stateName }: StateCalculatorGridProps) {
  // Group by category
  const grouped = calculators.reduce<Record<string, StateCalculatorConfig[]>>((acc, calc) => {
    const cat = calc.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(calc)
    return acc
  }, {})

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([category, calcs]) => {
        const meta = categoryMeta[category] || { label: category, icon: '🔢', color: 'border-gray-500/50' }

        return (
          <section key={category}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{meta.icon}</span>
              <h2 className="text-2xl font-bold">{meta.label}</h2>
              <span className="text-sm text-[var(--secondary)]">({calcs.length})</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calcs.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/${calc.category}/${calc.slug}`}
                  className={`group p-5 rounded-2xl border-2 border-[var(--border)] hover:${meta.color} hover:shadow-lg transition-all hover:-translate-y-0.5`}
                >
                  <h3 className="font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-[var(--secondary)] mb-3 line-clamp-2">
                    {calc.heroSubtitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {calc.secondaryKeywords.slice(0, 2).map((kw) => (
                      <span key={kw} className="text-[10px] px-2 py-0.5 bg-[var(--muted)] rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
