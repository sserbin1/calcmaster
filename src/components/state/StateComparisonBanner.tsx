import Link from 'next/link'

interface StateComparisonBannerProps {
  currentState: string
  currentStateSlug: string
  relatedStates: { name: string; slug: string }[]
}

export default function StateComparisonBanner({ currentState, currentStateSlug, relatedStates }: StateComparisonBannerProps) {
  const otherStates = relatedStates.filter(s => s.slug !== currentStateSlug).slice(0, 5)

  if (otherStates.length === 0) return null

  return (
    <section className="mt-12 p-6 rounded-2xl border-2 border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
      <h2 className="text-xl font-bold mb-3">Compare with Other States</h2>
      <p className="text-[var(--secondary)] text-sm mb-4">
        See how {currentState} calculators compare with other states.
      </p>
      <div className="flex flex-wrap gap-3">
        {otherStates.map((state) => (
          <Link
            key={state.slug}
            href={`/state/${state.slug}`}
            className="px-4 py-2 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors text-sm font-medium"
          >
            {state.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
