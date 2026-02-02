import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, getCalculatorsByCategory, type CategorySlug } from '@/data/calculators'

interface PageProps {
  params: Promise<{ category: string }>
}

// Generate static params for all categories
export function generateStaticParams() {
  return Object.keys(categories).map(category => ({ category }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const categoryInfo = categories[category as CategorySlug]

  if (!categoryInfo) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${categoryInfo.name} Calculators`,
    description: `Free ${categoryInfo.name.toLowerCase()} calculators. ${categoryInfo.description}. Get instant results with AI-powered explanations.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const categoryInfo = categories[category as CategorySlug]

  if (!categoryInfo) {
    notFound()
  }

  const calculators = getCalculatorsByCategory(category)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{categoryInfo.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <span className={`category-badge category-${category} mb-4`}>
          {calculators.length} Calculators
        </span>
        <h1 className="text-4xl font-bold mb-4">
          <span className="mr-3">{categoryInfo.icon}</span>
          {categoryInfo.name} Calculators
        </h1>
        <p className="text-xl text-[var(--secondary)] max-w-3xl">
          {categoryInfo.description}. Get instant results with AI-powered explanations.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${category}/${calc.slug}`}
            className="group p-6 rounded-2xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:shadow-xl transition-all"
          >
            <h2 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
              {calc.name} Calculator
            </h2>
            <p className="text-[var(--secondary)] text-sm mb-4">
              {calc.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {calc.secondaryKeywords.slice(0, 3).map((kw) => (
                <span key={kw} className="text-xs px-2 py-1 bg-[var(--muted)] rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* SEO Content */}
      <section className="prose prose-lg max-w-none mb-12">
        <h2 className="text-2xl font-bold mb-4">About {categoryInfo.name} Calculators</h2>
        <p>
          Our {categoryInfo.name.toLowerCase()} calculators help you make informed decisions quickly.
          Each calculator provides instant results with AI-powered explanations to help you understand
          what the numbers mean and what actions you can take.
        </p>
        <p>
          All calculators are free to use, require no sign-up, and work on any device.
          Results can be saved locally for future reference.
        </p>
      </section>

      {/* Other Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(categories)
            .filter(([slug]) => slug !== category)
            .map(([slug, info]) => (
              <Link
                key={slug}
                href={`/${slug}`}
                className="p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <span className="text-2xl block mb-2">{info.icon}</span>
                <span className="font-medium">{info.name}</span>
                <p className="text-xs text-[var(--secondary)] mt-1">{info.description}</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
