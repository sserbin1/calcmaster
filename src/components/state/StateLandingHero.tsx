import type { StateInfo } from '@/types/state-calculator'

interface StateLandingHeroProps {
  state: StateInfo
  calculatorCount: number
}

const regionColors: Record<string, string> = {
  Northeast: 'from-blue-500/20 to-indigo-500/10',
  Southeast: 'from-emerald-500/20 to-teal-500/10',
  Midwest: 'from-amber-500/20 to-orange-500/10',
  Southwest: 'from-red-500/20 to-orange-500/10',
  West: 'from-violet-500/20 to-purple-500/10',
  Pacific: 'from-cyan-500/20 to-blue-500/10',
}

export default function StateLandingHero({ state, calculatorCount }: StateLandingHeroProps) {
  const gradient = regionColors[state.region] || 'from-blue-500/20 to-violet-500/10'

  return (
    <section className={`relative rounded-3xl bg-gradient-to-br ${gradient} border-2 border-[var(--border)] p-8 md:p-12 mb-12 overflow-hidden`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{state.abbreviation === 'DC' ? '🏛️' : '📍'}</span>
          <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium">
            {state.region}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          {state.name} Calculators
        </h1>

        <p className="text-xl text-[var(--secondary)] max-w-2xl mb-8">
          {calculatorCount} free calculators built with {state.name}-specific tax rates, laws, and data.
          Get accurate results tailored to {state.abbreviation} residents.
        </p>

        <div className="flex flex-wrap gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{calculatorCount}</div>
            <div className="text-sm text-[var(--secondary)]">Calculators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{state.abbreviation}</div>
            <div className="text-sm text-[var(--secondary)]">State</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{(state.population / 1_000_000).toFixed(1)}M</div>
            <div className="text-sm text-[var(--secondary)]">Population</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{state.capital}</div>
            <div className="text-sm text-[var(--secondary)]">Capital</div>
          </div>
        </div>
      </div>
    </section>
  )
}
