import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllStateSlugs, getStateInfo, getStateCalculators, loadStateData } from '@/data/states'
import { initPromise as stateInitPromise } from '@/data/state-calculators'
import { generateStateLandingSchema, generateBreadcrumbSchema } from '@/lib/schema-generators'
import StateLandingHero from '@/components/state/StateLandingHero'
import StateCalculatorGrid from '@/components/state/StateCalculatorGrid'
import StateComparisonBanner from '@/components/state/StateComparisonBanner'

interface PageProps {
  params: Promise<{ state: string }>
}

// Generate static params for all states
export async function generateStaticParams() {
  await stateInitPromise
  return getAllStateSlugs().map(state => ({ state }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await stateInitPromise
  const { state: stateSlug } = await params
  const stateInfo = getStateInfo(stateSlug)

  if (!stateInfo) {
    return { title: 'State Not Found' }
  }

  return {
    title: `${stateInfo.name} Calculators - Free ${stateInfo.abbreviation} Tax, Finance & More`,
    description: `Free ${stateInfo.name} calculators with real ${stateInfo.abbreviation} tax rates, laws, and data. Property tax, income tax, cost of living, and more. Built for ${stateInfo.name} residents.`,
    openGraph: {
      title: `${stateInfo.name} Calculators | CalcMaster`,
      description: `Free calculators built with ${stateInfo.name}-specific data.`,
      url: `https://calcmaster.vercel.app/state/${stateSlug}`,
    },
  }
}

// Nearby states for comparison
const regionStates: Record<string, { name: string; slug: string }[]> = {
  Northeast: [
    { name: 'New York', slug: 'new-york' }, { name: 'New Jersey', slug: 'new-jersey' },
    { name: 'Pennsylvania', slug: 'pennsylvania' }, { name: 'Massachusetts', slug: 'massachusetts' },
    { name: 'Connecticut', slug: 'connecticut' },
  ],
  Southeast: [
    { name: 'Florida', slug: 'florida' }, { name: 'Georgia', slug: 'georgia' },
    { name: 'North Carolina', slug: 'north-carolina' }, { name: 'Virginia', slug: 'virginia' },
    { name: 'Tennessee', slug: 'tennessee' },
  ],
  Midwest: [
    { name: 'Illinois', slug: 'illinois' }, { name: 'Ohio', slug: 'ohio' },
    { name: 'Michigan', slug: 'michigan' }, { name: 'Indiana', slug: 'indiana' },
    { name: 'Wisconsin', slug: 'wisconsin' },
  ],
  Southwest: [
    { name: 'Texas', slug: 'texas' }, { name: 'Arizona', slug: 'arizona' },
    { name: 'New Mexico', slug: 'new-mexico' }, { name: 'Oklahoma', slug: 'oklahoma' },
    { name: 'Nevada', slug: 'nevada' },
  ],
  West: [
    { name: 'California', slug: 'california' }, { name: 'Washington', slug: 'washington' },
    { name: 'Oregon', slug: 'oregon' }, { name: 'Colorado', slug: 'colorado' },
    { name: 'Utah', slug: 'utah' },
  ],
  Pacific: [
    { name: 'Hawaii', slug: 'hawaii' }, { name: 'Alaska', slug: 'alaska' },
    { name: 'California', slug: 'california' }, { name: 'Washington', slug: 'washington' },
    { name: 'Oregon', slug: 'oregon' },
  ],
}

export default async function StateLandingPage({ params }: PageProps) {
  await stateInitPromise
  const { state: stateSlug } = await params
  const stateInfo = getStateInfo(stateSlug)

  if (!stateInfo) {
    notFound()
  }

  // Load full state data to get calculators
  const stateData = await loadStateData(stateSlug)
  const calculators = stateData?.calculators ?? []

  const relatedStates = regionStates[stateInfo.region] || []

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/state" className="hover:text-[var(--primary)]">States</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{stateInfo.name}</span>
      </nav>

      {/* Hero */}
      <StateLandingHero state={stateInfo} calculatorCount={calculators.length} />

      {/* Calculator Grid */}
      {calculators.length > 0 ? (
        <StateCalculatorGrid calculators={calculators} stateName={stateInfo.name} />
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-[var(--secondary)]">
            {stateInfo.name} calculators are coming soon!
          </p>
        </div>
      )}

      {/* Comparison Banner */}
      <StateComparisonBanner
        currentState={stateInfo.name}
        currentStateSlug={stateSlug}
        relatedStates={relatedStates}
      />

      {/* SEO Content */}
      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold mb-4">About {stateInfo.name} Calculators</h2>
        <p>
          Our {stateInfo.name} calculators use real {stateInfo.abbreviation} tax rates, state laws, and local data
          to give you accurate results. Whether you&apos;re calculating property taxes, estimating your
          take-home salary, or comparing insurance rates, each calculator is built specifically for
          {stateInfo.name} residents.
        </p>
        <p>
          All calculators are free, require no sign-up, and provide instant results with
          AI-powered explanations to help you understand what the numbers mean.
        </p>
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              generateStateLandingSchema(stateInfo, calculators),
              generateBreadcrumbSchema([
                { name: 'Home', url: 'https://calcmaster.vercel.app/' },
                { name: 'States', url: 'https://calcmaster.vercel.app/state/' },
                { name: stateInfo.name, url: `https://calcmaster.vercel.app/state/${stateSlug}/` },
              ]),
            ],
          }),
        }}
      />
    </div>
  )
}
