import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCalculator, getAllCalculatorPaths, getRelatedCalculators, categories, type CategorySlug } from '@/data/calculators'
import { loadMethodology } from '@/data/methodology-loader'
import { generateCalculatorSchema, generateFAQSchema, generateHowToSchema, generateBreadcrumbSchema, generateStateCalculatorSchema, generateStateFAQSchema } from '@/lib/schema-generators'
import { isStateCalculator, getStateRouterEntry, getAllStateCalculatorPaths, getStateInfo } from '@/data/states'
import { getStateCalculatorConfig, initPromise as stateInitPromise } from '@/data/state-calculators'
import GenericCalculator from '@/components/calculators/GenericCalculator'
import MethodologySection from '@/components/ui/MethodologySection'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

// Generate static params for ALL calculators (generic + state)
export async function generateStaticParams() {
  await stateInitPromise // Ensure state data is loaded before building paths
  const genericPaths = getAllCalculatorPaths()
  const statePaths = getAllStateCalculatorPaths()
  return [...genericPaths, ...statePaths]
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await stateInitPromise
  const { category, slug } = await params

  // Check state calculator first
  if (isStateCalculator(slug)) {
    const stateCalc = getStateCalculatorConfig(category, slug)
    if (stateCalc) {
      return {
        title: stateCalc.metaTitle,
        description: stateCalc.metaDescription,
        keywords: [stateCalc.primaryKeyword, ...stateCalc.secondaryKeywords],
        openGraph: {
          title: stateCalc.metaTitle,
          description: stateCalc.metaDescription,
          url: `https://calcmaster.vercel.app/${category}/${slug}`,
          type: 'website',
        },
        alternates: {
          canonical: `https://calcmaster.vercel.app/${category}/${slug}`,
        },
      }
    }
  }

  // Generic calculator
  const calculator = getCalculator(category, slug)
  if (!calculator) {
    return { title: 'Calculator Not Found' }
  }

  return {
    title: calculator.metaTitle,
    description: calculator.metaDescription,
    keywords: [calculator.primaryKeyword, ...calculator.secondaryKeywords],
    openGraph: {
      title: calculator.metaTitle,
      description: calculator.metaDescription,
      url: `https://calcmaster.vercel.app/${category}/${slug}`,
      type: 'website',
    },
  }
}

export default async function CalculatorPage({ params }: PageProps) {
  await stateInitPromise
  const { category, slug } = await params

  // Check if this is a state calculator
  if (isStateCalculator(slug)) {
    const stateCalc = getStateCalculatorConfig(category, slug)
    const routerEntry = getStateRouterEntry(slug)

    if (!stateCalc || !routerEntry) {
      notFound()
    }

    const stateInfo = getStateInfo(routerEntry.stateSlug)
    const categoryInfo = categories[category as CategorySlug]

    return (
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb — includes state */}
        <nav className="text-sm text-[var(--secondary)] mb-6">
          <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
          <span className="mx-2">/</span>
          {stateInfo && (
            <>
              <Link href={`/state/${routerEntry.stateSlug}`} className="hover:text-[var(--primary)]">{stateInfo.name}</Link>
              <span className="mx-2">/</span>
            </>
          )}
          <Link href={`/${category}`} className="hover:text-[var(--primary)]">{categoryInfo?.name || category}</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--foreground)]">{stateCalc.name}</span>
        </nav>

        {/* State badge + Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`category-badge category-${category}`}>
              {categoryInfo?.icon} {categoryInfo?.name}
            </span>
            {stateInfo && (
              <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium">
                📍 {stateInfo.name}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{stateCalc.heroTitle}</h1>
          <p className="text-xl text-[var(--secondary)]">{stateCalc.heroSubtitle}</p>
        </div>

        {/* Intro Text */}
        <p className="text-[var(--secondary)] mb-8">{stateCalc.introText}</p>

        {/* Calculator Component */}
        <div className="mb-12">
          <GenericCalculator
            type={slug}
            name={stateCalc.name}
            category={category}
          />
        </div>

        {/* Formula */}
        {stateCalc.formula && (
          <div className="p-4 bg-[var(--muted)] rounded-xl mb-8">
            <h3 className="font-bold mb-2">Formula</h3>
            <code className="text-[var(--primary)]">{stateCalc.formula}</code>
          </div>
        )}

        {/* Benefits */}
        {stateCalc.benefits && stateCalc.benefits.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stateCalc.benefits.map((benefit, i) => (
                <div key={i} className="p-4 rounded-xl border-2 border-[var(--border)]">
                  <span className="text-2xl">{benefit.icon}</span>
                  <h3 className="font-bold mt-2">{benefit.title}</h3>
                  <p className="text-sm text-[var(--secondary)]">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {stateCalc.faqs && stateCalc.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {stateCalc.faqs.map((faq, i) => (
                <details key={i} className="group p-6 rounded-2xl border-2 border-[var(--border)]">
                  <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-[var(--primary)] group-open:rotate-180 transition-transform">&#9660;</span>
                  </summary>
                  <p className="mt-4 text-[var(--secondary)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Calculators */}
        {stateCalc.relatedCalculators && stateCalc.relatedCalculators.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Calculators</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stateCalc.relatedCalculators.slice(0, 4).map((relSlug) => (
                <Link
                  key={relSlug}
                  href={isStateCalculator(relSlug) ? `/${category}/${relSlug}` : `/${category}/${relSlug}`}
                  className="p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors text-center"
                >
                  <span className="text-2xl block mb-2">
                    {categories[category as CategorySlug]?.icon || '🔢'}
                  </span>
                  <span className="text-sm font-medium">{relSlug}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to state landing */}
        {stateInfo && (
          <div className="mb-12">
            <Link
              href={`/state/${routerEntry.stateSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors"
            >
              ← All {stateInfo.name} Calculators
            </Link>
          </div>
        )}

        {/* Schema.org JSON-LD */}
        {stateInfo && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  generateStateCalculatorSchema(stateCalc, stateInfo),
                  generateStateFAQSchema(stateCalc.faqs),
                  generateBreadcrumbSchema([
                    { name: 'Home', url: 'https://calcmaster.vercel.app/' },
                    { name: stateInfo.name, url: `https://calcmaster.vercel.app/state/${routerEntry.stateSlug}/` },
                    { name: categoryInfo?.name || category, url: `https://calcmaster.vercel.app/${category}/` },
                    { name: stateCalc.name, url: `https://calcmaster.vercel.app/${category}/${slug}/` },
                  ]),
                ].filter(Boolean),
              }),
            }}
          />
        )}
      </div>
    )
  }

  // === GENERIC CALCULATOR (existing logic) ===
  const calculator = getCalculator(category, slug)

  if (!calculator) {
    notFound()
  }

  const categoryInfo = categories[category as CategorySlug]
  const relatedCalcs = getRelatedCalculators(calculator.relatedCalculators, slug)

  // Load methodology data
  const methodology = await loadMethodology(category, slug)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${category}`} className="hover:text-[var(--primary)]">{categoryInfo?.name || category}</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{calculator.name} Calculator</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <span className={`category-badge category-${category} mb-4`}>
          {categoryInfo?.icon} {categoryInfo?.name}
        </span>
        <h1 className="text-4xl font-bold mb-4">{calculator.heroTitle}</h1>
        <p className="text-xl text-[var(--secondary)]">{calculator.heroSubtitle}</p>
      </div>

      {/* Intro Text */}
      <p className="text-[var(--secondary)] mb-8">{calculator.introText}</p>

      {/* Calculator Component */}
      <div className="mb-12">
        <GenericCalculator
          type={slug}
          name={calculator.name}
          category={category}
          methods={methodology?.methods?.map(m => ({
            id: m.id,
            name: m.name,
            description: m.description,
            accuracy: m.accuracy,
            isDefault: m.isDefault,
          }))}
        />
      </div>

      {/* Methodology Section */}
      {methodology && (
        <MethodologySection
          title={methodology.title}
          methods={methodology.methods}
          sources={methodology.sources}
          footnotes={methodology.footnotes}
        />
      )}

      {/* Formula (fallback if no methodology) */}
      {!methodology && calculator.formula && (
        <div className="p-4 bg-[var(--muted)] rounded-xl mb-8">
          <h3 className="font-bold mb-2">Formula</h3>
          <code className="text-[var(--primary)]">{calculator.formula}</code>
        </div>
      )}

      {/* Benefits */}
      {calculator.benefits && calculator.benefits.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {calculator.benefits.map((benefit, i) => (
              <div key={i} className="p-4 rounded-xl border-2 border-[var(--border)]">
                <span className="text-2xl">{benefit.icon}</span>
                <h3 className="font-bold mt-2">{benefit.title}</h3>
                <p className="text-sm text-[var(--secondary)]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {calculator.faqs && calculator.faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {calculator.faqs.map((faq, i) => (
              <details key={i} className="group p-6 rounded-2xl border-2 border-[var(--border)]">
                <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="text-[var(--primary)] group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <p className="mt-4 text-[var(--secondary)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Calculators */}
      {relatedCalcs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedCalcs.map((calc) => (
              <Link
                key={calc.slug}
                href={`/${calc.category}/${calc.slug}`}
                className="p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors text-center"
              >
                <span className="text-2xl block mb-2">
                  {categories[calc.category as CategorySlug]?.icon || '🔢'}
                </span>
                <span className="text-sm font-medium">{calc.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              generateCalculatorSchema(calculator, categoryInfo?.name || category),
              generateFAQSchema(calculator.faqs),
              generateHowToSchema(calculator),
              generateBreadcrumbSchema([
                { name: 'Home', url: 'https://calcmaster.vercel.app/' },
                { name: categoryInfo?.name || category, url: `https://calcmaster.vercel.app/${category}/` },
                { name: calculator.name, url: `https://calcmaster.vercel.app/${category}/${slug}/` },
              ]),
            ].filter(Boolean),
          }),
        }}
      />
    </div>
  )
}
