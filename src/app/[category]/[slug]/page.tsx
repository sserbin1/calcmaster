import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCalculator, getAllCalculatorPaths, getRelatedCalculators, categories, type CategorySlug } from '@/data/calculators'
import { loadMethodology } from '@/data/methodology-loader'
import { generateCalculatorSchema, generateFAQSchema, generateHowToSchema, generateBreadcrumbSchema, generateStateCalculatorSchema, generateStateFAQSchema } from '@/lib/schema-generators'
import { isStateCalculator, getStateRouterEntry, getAllStateCalculatorPaths, getStateInfo } from '@/data/states'
import { getStateCalculatorConfig, initPromise as stateInitPromise } from '@/data/state-calculators'
import { calculate, type CalculatorInput, type CalculatorOutput } from '@/lib/calculator-engine'
import GenericCalculator from '@/components/calculators/GenericCalculator'
import MethodologySection from '@/components/ui/MethodologySection'
import StateHeroBanner from '@/components/ui/StateHeroBanner'
import Image from 'next/image'
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

// SVG Icons as components
function IconMapPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function IconArrowLeft({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function IconCheckCircle({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function IconShield({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconTrendingUp({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function IconClock({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconBookOpen({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function IconCalculator({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="18" />
      <line x1="8" y1="11" x2="8" y2="11" />
      <line x1="12" y1="11" x2="12" y2="11" />
      <line x1="16" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="8" y2="15" />
      <line x1="12" y1="15" x2="12" y2="15" />
      <line x1="8" y1="19" x2="8" y2="19" />
      <line x1="12" y1="19" x2="12" y2="19" />
    </svg>
  )
}

// Benefit icon mapping (replaces emojis)
const benefitIcons: Record<string, React.ReactNode> = {
  default: <IconCheckCircle className="w-5 h-5" />,
}

function getBenefitIcon(icon: string) {
  return benefitIcons[icon] || <IconCheckCircle className="w-5 h-5" />
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

    // Pre-compute result with default values for SSR (Google Bot sees full report)
    const defaultInputs: CalculatorInput = {}
    const calcFields = stateCalc.fields && stateCalc.fields.length > 0 ? stateCalc.fields : []
    calcFields.forEach(f => {
      if (f.default !== undefined) defaultInputs[f.name] = f.default
    })
    const stateCtx = { baseType: stateCalc.baseType, stateData: stateCalc.stateData as Record<string, unknown> }
    const precomputedResult = calcFields.length > 0
      ? calculate(slug, defaultInputs, undefined, stateCtx)
      : undefined

    // Generate SSR explanation from precomputed result
    let precomputedExplanation: string | undefined
    if (precomputedResult) {
      const r = precomputedResult
      const primary = `${r.primary.unit === '$' ? '$' : ''}${typeof r.primary.value === 'number' ? r.primary.value.toLocaleString() : r.primary.value}${r.primary.unit && r.primary.unit !== '$' ? ' ' + r.primary.unit : ''}`
      const secondaryText = r.secondary?.map(s => `**${s.label}**: ${s.unit === '$' ? '$' : ''}${typeof s.value === 'number' ? s.value.toLocaleString() : s.value}${s.unit && s.unit !== '$' ? s.unit : ''}`).join(', ') || ''

      precomputedExplanation = `**What This Means**\nBased on default inputs, the ${stateCalc.name} shows a ${r.primary.label?.toLowerCase() || 'result'} of ${primary}. ${secondaryText ? `Key figures: ${secondaryText}.` : ''}\n\n**Key Insights**\n${r.advice || `This calculation uses current ${stateInfo?.name || 'state'} tax rates and brackets. Adjust the inputs above to see how changes in income, filing status, or deductions affect your results.`}\n\n**What You Can Do**\nEnter your actual figures in the calculator above for a personalized breakdown. Consider consulting a tax professional for comprehensive planning, especially for complex situations involving multiple income sources or deductions.\n\n**Keep In Mind**\nThis calculator provides estimates based on ${new Date().getFullYear()} rates. Actual tax liability may vary based on credits, exemptions, and other factors not captured here. This is for educational purposes only and should not be considered tax advice.`
    }

    // SEO: Generate rich content sections from calculator data
    const stateName = stateInfo?.name || 'this state'
    const stateAbbr = stateInfo?.abbreviation || ''
    const currentYear = new Date().getFullYear()

    return (
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--secondary)] mb-8 flex-wrap">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
          <IconChevronRight className="w-3.5 h-3.5 text-[var(--border)]" />
          {stateInfo && (
            <>
              <Link href={`/state/${routerEntry.stateSlug}`} className="hover:text-[var(--primary)] transition-colors">{stateInfo.name}</Link>
              <IconChevronRight className="w-3.5 h-3.5 text-[var(--border)]" />
            </>
          )}
          <Link href={`/${category}`} className="hover:text-[var(--primary)] transition-colors">{categoryInfo?.name || category}</Link>
          <IconChevronRight className="w-3.5 h-3.5 text-[var(--border)]" />
          <span className="text-[var(--foreground)] font-medium">{stateCalc.name}</span>
        </nav>

        {/* Hero Section — Glass Card */}
        <div className="glass-card p-8 md:p-10 mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className={`category-badge category-${category}`}>
              {categoryInfo?.name}
            </span>
            {stateInfo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <IconMapPin className="w-3.5 h-3.5" />
                {stateInfo.name}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-[var(--navy)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stateCalc.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-[var(--secondary)] leading-relaxed max-w-3xl">
            {stateCalc.heroSubtitle}
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
              <IconShield className="w-4 h-4 text-[var(--success)]" />
              <span>Updated for {currentYear}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
              <IconClock className="w-4 h-4 text-[var(--primary)]" />
              <span>Results in seconds</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
              <IconCalculator className="w-4 h-4 text-[var(--accent)]" />
              <span>100% free</span>
            </div>
          </div>
        </div>

        {/* Category-themed Hero Banner */}
        <StateHeroBanner baseType={stateCalc.baseType} name={stateCalc.name} stateName={stateName} />

        {/* Intro — rich SEO text */}
        <div className="mb-10 px-1">
          <p className="text-base leading-relaxed text-[var(--secondary)]">{stateCalc.introText}</p>
        </div>

        {/* Calculator Component — Glass Container */}
        <div className="glass-card p-6 md:p-8 mb-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center">
              <IconCalculator className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Calculate Your {stateAbbr} Tax
            </h2>
          </div>
          <GenericCalculator
            type={slug}
            name={stateCalc.name}
            category={category}
            initialFields={calcFields.length > 0 ? calcFields : undefined}
            stateContext={stateCtx}
            initialResult={precomputedResult}
            initialExplanation={precomputedExplanation}
          />
        </div>

        {/* SEO Content: How It Works */}
        <section className="mb-12 px-1">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
              <IconBookOpen className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              How the {stateCalc.name} Works
            </h2>
          </div>
          <div className="space-y-4 text-[var(--secondary)] leading-relaxed">
            <p>
              The {stateCalc.name} uses {currentYear} tax rates, brackets, and deductions specific to {stateName} to provide you with an accurate estimate of your tax obligations. Unlike generic federal-only calculators, this tool accounts for the unique tax structure that {stateName} residents face.
            </p>
            {stateCalc.formula && (
              <div className="glass-card p-5 my-6">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Formula
                </h3>
                <code className="text-[var(--primary)] text-sm leading-relaxed block">{stateCalc.formula}</code>
              </div>
            )}
            <p>
              Simply enter your financial details above, and the calculator instantly computes your results using the latest available data. All calculations happen directly in your browser — your personal information is never sent to any server or stored anywhere.
            </p>
          </div>
        </section>

        {/* SEO Content: Why This Calculator */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-5 px-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
              <IconTrendingUp className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Why Use a {stateName}-Specific Calculator?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[var(--success-light)] flex items-center justify-center flex-shrink-0">
                  <IconCheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>State-Specific Rates</h3>
                  <p className="text-sm text-[var(--secondary)] leading-relaxed">Uses real {currentYear} {stateName} tax brackets, rates, and thresholds — not generic national averages that miss state-level nuances.</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[var(--success-light)] flex items-center justify-center flex-shrink-0">
                  <IconCheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Local Programs & Exemptions</h3>
                  <p className="text-sm text-[var(--secondary)] leading-relaxed">Factors in {stateName}-specific programs, exemptions, and deductions that national calculators simply don&apos;t account for.</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[var(--success-light)] flex items-center justify-center flex-shrink-0">
                  <IconCheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Instant & Private</h3>
                  <p className="text-sm text-[var(--secondary)] leading-relaxed">All calculations run locally in your browser. No account required, no data stored, no waiting for results.</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[var(--success-light)] flex items-center justify-center flex-shrink-0">
                  <IconCheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>AI-Powered Explanations</h3>
                  <p className="text-sm text-[var(--secondary)] leading-relaxed">Get a plain-English breakdown of your results with actionable insights you can actually use for financial planning.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits/Features — Cards Grid */}
        {stateCalc.benefits && stateCalc.benefits.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2.5 mb-5 px-1">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
                <IconCheckCircle className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What&apos;s Included
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {stateCalc.benefits.map((benefit, i) => (
                <div key={i} className="glass-card p-5 flex items-start gap-3 hover:shadow-md transition-shadow cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center flex-shrink-0">
                    {getBenefitIcon(benefit.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-[var(--secondary)] leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section — Redesigned Accordion */}
        {stateCalc.faqs && stateCalc.faqs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2.5 mb-5 px-1">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
                <IconBookOpen className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {stateCalc.faqs.map((faq, i) => (
                <details key={i} className="group glass-card overflow-hidden">
                  <summary className="p-5 font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:bg-[var(--muted)]/50 transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[var(--foreground)]">{faq.question}</span>
                    <svg className="w-5 h-5 text-[var(--secondary)] group-open:rotate-180 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-[var(--secondary)] leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* SEO Content: Additional Context */}
        <section className="mb-12 px-1">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center">
              <IconShield className="w-4 h-4 text-[var(--secondary)]" />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Important Information for {stateName} Residents
            </h2>
          </div>
          <div className="space-y-4 text-[var(--secondary)] leading-relaxed">
            <p>
              Tax laws in {stateName} can change annually. This calculator is updated regularly to reflect the latest {currentYear} rates and regulations, but you should always verify important financial decisions with a qualified {stateName} tax professional or CPA.
            </p>
            <p>
              This tool is designed for informational and educational purposes. While we strive for accuracy using official {stateName} Department of Taxation data, the results should be used as estimates for planning purposes only. Your actual tax liability may differ based on credits, special circumstances, and legislative changes that occur after our last update.
            </p>
            <p>
              For filing deadlines, payment schedules, and official forms, visit the {stateName} Department of Taxation and Finance website. If you have complex tax situations involving multiple states, business income, or significant investment gains, professional guidance is recommended.
            </p>
          </div>
        </section>

        {/* Related Calculators — Modern Cards */}
        {stateCalc.relatedCalculators && stateCalc.relatedCalculators.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2.5 mb-5 px-1">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
                <IconCalculator className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Related {stateName} Calculators
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stateCalc.relatedCalculators.slice(0, 4).map((relSlug) => (
                <Link
                  key={relSlug}
                  href={`/${category}/${relSlug}`}
                  className="glass-card p-4 text-center hover:shadow-md hover:border-[var(--primary)]/30 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--muted)] mx-auto mb-3 flex items-center justify-center group-hover:bg-[var(--primary-light)] transition-colors">
                    <IconCalculator className="w-5 h-5 text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)] leading-tight block" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {relSlug.replace(/-new-york$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to state landing */}
        {stateInfo && (
          <div className="mb-12 px-1">
            <Link
              href={`/state/${routerEntry.stateSlug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-card hover:shadow-md transition-all font-medium text-[var(--primary)] text-sm cursor-pointer"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <IconArrowLeft className="w-4 h-4" />
              All {stateInfo.name} Calculators
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
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--secondary)] mb-8 flex-wrap">
        <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
        <IconChevronRight className="w-3.5 h-3.5 text-[var(--border)]" />
        <Link href={`/${category}`} className="hover:text-[var(--primary)] transition-colors">{categoryInfo?.name || category}</Link>
        <IconChevronRight className="w-3.5 h-3.5 text-[var(--border)]" />
        <span className="text-[var(--foreground)] font-medium">{calculator.name} Calculator</span>
      </nav>

      {/* Hero */}
      <div className="glass-card p-8 md:p-10 mb-8">
        <span className={`category-badge category-${category} mb-4 inline-block`}>
          {categoryInfo?.name}
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-[var(--navy)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {calculator.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-[var(--secondary)] leading-relaxed max-w-3xl">
          {calculator.heroSubtitle}
        </p>
      </div>

      {/* Intro Text */}
      <div className="mb-10 px-1">
        <p className="text-base leading-relaxed text-[var(--secondary)]">{calculator.introText}</p>
      </div>

      {/* Calculator Component */}
      <div className="glass-card p-6 md:p-8 mb-10">
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
        <div className="glass-card p-5 mb-8">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Formula</h3>
          <code className="text-[var(--primary)] text-sm">{calculator.formula}</code>
        </div>
      )}

      {/* Benefits */}
      {calculator.benefits && calculator.benefits.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 px-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {calculator.benefits.map((benefit, i) => (
              <div key={i} className="glass-card p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center flex-shrink-0">
                  {getBenefitIcon(benefit.icon)}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{benefit.title}</h3>
                  <p className="text-sm text-[var(--secondary)] leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {calculator.faqs && calculator.faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 px-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {calculator.faqs.map((faq, i) => (
              <details key={i} className="group glass-card overflow-hidden">
                <summary className="p-5 font-semibold cursor-pointer list-none flex justify-between items-center gap-4 hover:bg-[var(--muted)]/50 transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span className="text-[var(--foreground)]">{faq.question}</span>
                  <svg className="w-5 h-5 text-[var(--secondary)] group-open:rotate-180 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <p className="text-[var(--secondary)] leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Calculators */}
      {relatedCalcs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 px-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCalcs.map((calc) => (
              <Link
                key={calc.slug}
                href={`/${calc.category}/${calc.slug}`}
                className="glass-card p-4 text-center hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--muted)] mx-auto mb-3 flex items-center justify-center group-hover:bg-[var(--primary-light)] transition-colors">
                  <IconCalculator className="w-5 h-5 text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors" />
                </div>
                <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{calc.name}</span>
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
