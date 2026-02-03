import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCalculator, getAllCalculatorPaths, getRelatedCalculators, categories, type CategorySlug } from '@/data/calculators'
import { loadMethodology } from '@/data/methodology-loader'
import GenericCalculator from '@/components/calculators/GenericCalculator'
import MethodologySection from '@/components/ui/MethodologySection'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

// Generate static params for all calculators
export async function generateStaticParams() {
  return getAllCalculatorPaths()
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
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
      url: `https://calcmaster.io/${category}/${slug}`,
      type: 'website',
    },
  }
}

export default async function CalculatorPage({ params }: PageProps) {
  const { category, slug } = await params
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
        <GenericCalculator type={slug} name={calculator.name} category={category} />
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
                  <span className="text-[var(--primary)] group-open:rotate-180 transition-transform">▼</span>
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
              {
                '@type': 'WebApplication',
                name: calculator.heroTitle,
                url: `https://calcmaster.io/${category}/${slug}/`,
                description: calculator.metaDescription,
                applicationCategory: 'UtilityApplication',
                operatingSystem: 'Any',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              },
              {
                '@type': 'FAQPage',
                mainEntity: calculator.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://calcmaster.io/' },
                  { '@type': 'ListItem', position: 2, name: categoryInfo?.name, item: `https://calcmaster.io/${category}/` },
                  { '@type': 'ListItem', position: 3, name: calculator.heroTitle, item: `https://calcmaster.io/${category}/${slug}/` },
                ],
              },
            ],
          }),
        }}
      />
    </div>
  )
}
