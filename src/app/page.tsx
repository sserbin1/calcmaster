import Link from 'next/link'
import { generateWebSiteSchema, generateOrganizationSchema } from '@/lib/schema-generators'

const categories = [
  {
    name: 'Health & Fitness',
    slug: 'health',
    icon: '🏥',
    description: 'BMI, calories, TDEE, body fat, and more',
    calculators: ['BMI', 'Calorie', 'TDEE', 'BMR', 'Body Fat'],
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10',
  },
  {
    name: 'Finance',
    slug: 'finance',
    icon: '💰',
    description: 'Mortgage, loans, investments, and budgeting',
    calculators: ['Mortgage', 'Loan', 'Compound Interest', '401k', 'ROI'],
    gradient: 'from-blue-500/20 to-cyan-500/10',
    border: 'hover:border-blue-500/50',
    iconBg: 'bg-blue-500/10',
  },
  {
    name: 'Math',
    slug: 'math',
    icon: '📐',
    description: 'Percentages, fractions, statistics, and algebra',
    calculators: ['Percentage', 'Scientific', 'Fraction', 'GPA', 'Quadratic'],
    gradient: 'from-violet-500/20 to-purple-500/10',
    border: 'hover:border-violet-500/50',
    iconBg: 'bg-violet-500/10',
  },
  {
    name: 'Date & Time',
    slug: 'date-time',
    icon: '📅',
    description: 'Age, date difference, time zones, and countdowns',
    calculators: ['Age', 'Date', 'Time', 'Countdown', 'Time Zone'],
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'hover:border-amber-500/50',
    iconBg: 'bg-amber-500/10',
  },
  {
    name: 'Construction',
    slug: 'construction',
    icon: '🏗️',
    description: 'Concrete, square footage, paint, and BTU',
    calculators: ['Concrete', 'Square Footage', 'Tile', 'Paint', 'BTU'],
    gradient: 'from-yellow-500/20 to-amber-500/10',
    border: 'hover:border-yellow-500/50',
    iconBg: 'bg-yellow-500/10',
  },
  {
    name: 'Education',
    slug: 'education',
    icon: '🎓',
    description: 'GPA, grades, test scores, and study tools',
    calculators: ['Final Grade', 'Weighted GPA', 'College GPA', 'Test Score'],
    gradient: 'from-indigo-500/20 to-blue-500/10',
    border: 'hover:border-indigo-500/50',
    iconBg: 'bg-indigo-500/10',
  },
]

const popularCalculators = [
  { name: 'BMI Calculator', slug: '/health/bmi', icon: '⚖️', tag: 'Most Used' },
  { name: 'Mortgage Calculator', slug: '/finance/mortgage', icon: '🏠', tag: 'Finance #1' },
  { name: 'Age Calculator', slug: '/date-time/age', icon: '🎂', tag: 'Trending' },
  { name: 'Percentage Calculator', slug: '/math/percent', icon: '📊', tag: 'Quick Math' },
  { name: 'Calorie Calculator', slug: '/health/calories', icon: '🔥', tag: 'Health' },
  { name: 'Loan Calculator', slug: '/finance/loan', icon: '💳', tag: 'Finance' },
]

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    description: 'Get personalized explanations for every result. Our AI understands your numbers and gives actionable advice.',
    gradient: 'from-blue-500/10 to-violet-500/10',
  },
  {
    icon: '📊',
    title: 'Interactive Charts',
    description: 'See your data come alive with beautiful visualizations. Compare scenarios and understand trends instantly.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    icon: '📄',
    title: 'PDF Reports',
    description: 'Export professional reports with full methodology breakdown. Perfect for presentations and record-keeping.',
    gradient: 'from-amber-500/10 to-orange-500/10',
  },
  {
    icon: '🔬',
    title: 'Scientific Methodology',
    description: 'Every formula backed by peer-reviewed research. Full transparency on how your results are calculated.',
    gradient: 'from-violet-500/10 to-pink-500/10',
  },
  {
    icon: '💾',
    title: 'Calculation History',
    description: 'Automatically saves your calculations locally. Track progress, compare results, and restore past inputs.',
    gradient: 'from-cyan-500/10 to-blue-500/10',
  },
  {
    icon: '⚡',
    title: 'Instant & Free',
    description: 'No sign-up, no ads, no tracking. Just fast, accurate calculations right in your browser.',
    gradient: 'from-rose-500/10 to-pink-500/10',
  },
]

const stats = [
  { value: '60+', label: 'Calculators' },
  { value: '7', label: 'Categories' },
  { value: '54', label: 'Scientific Methods' },
  { value: '100%', label: 'Free' },
]

export default function HomePage() {
  const websiteSchema = generateWebSiteSchema()
  const orgSchema = generateOrganizationSchema()

  return (
    <div className="space-y-24">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              websiteSchema,
              orgSchema,
              {
                '@type': 'ItemList',
                name: 'Calculator Categories',
                itemListElement: categories.map((cat, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: cat.name,
                  url: `https://calcmaster.vercel.app/${cat.slug}/`,
                })),
              },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative text-center pt-16 pb-8 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-sm text-[var(--primary)] font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
          </span>
          60+ calculators with AI explanations
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
          Calculate Smarter,<br />
          <span className="bg-gradient-to-r from-[var(--primary)] via-blue-400 to-violet-500 bg-clip-text text-transparent">
            Not Harder
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Professional-grade calculators with scientific methodology,
          AI insights, and exportable PDF reports.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            href="/health/bmi"
            className="group px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-semibold text-lg hover:bg-[var(--primary-hover)] transition-all hover:shadow-xl hover:shadow-[var(--primary)]/20 hover:-translate-y-0.5"
          >
            Try BMI Calculator
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
          <Link
            href="#categories"
            className="px-8 py-4 border-2 border-[var(--border)] rounded-2xl font-semibold text-lg hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all hover:-translate-y-0.5"
          >
            Browse All
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)]">{stat.value}</div>
              <div className="text-sm text-[var(--secondary)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Calculators */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Popular Calculators</h2>
            <p className="text-[var(--secondary)] mt-1">Most used by our community</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCalculators.map((calc) => (
            <Link
              key={calc.slug}
              href={calc.slug}
              className="group relative p-5 rounded-2xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all hover:-translate-y-1 bg-[var(--background)]"
            >
              <span className="text-4xl block mb-3">{calc.icon}</span>
              <span className="text-sm font-semibold block mb-1">{calc.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--secondary)]">
                {calc.tag}
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Calculator Categories</h2>
          <p className="text-[var(--secondary)] text-lg max-w-xl mx-auto">
            From health metrics to financial planning, find the right tool for any calculation
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className={`group relative p-6 rounded-2xl border-2 border-[var(--border)] ${category.border} transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
            >
              {/* Gradient bg on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative flex items-start gap-4">
                <span className={`text-4xl p-3 rounded-2xl ${category.iconBg} shrink-0`}>
                  {category.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[var(--secondary)] text-sm mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.calculators.slice(0, 3).map((calc) => (
                      <span key={calc} className="text-xs px-2.5 py-1 bg-[var(--muted)] rounded-full font-medium">
                        {calc}
                      </span>
                    ))}
                    {category.calculators.length > 3 && (
                      <span className="text-xs px-2.5 py-1 text-[var(--secondary)]">
                        +{category.calculators.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="absolute top-6 right-6 text-[var(--secondary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why CalcMaster?</h2>
          <p className="text-[var(--secondary)] text-lg max-w-xl mx-auto">
            Not just another calculator site. Built for accuracy, designed for clarity.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`relative p-6 rounded-2xl border-2 border-[var(--border)] bg-gradient-to-br ${feature.gradient} overflow-hidden`}
            >
              <span className="text-4xl block mb-4">{feature.icon}</span>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-[var(--secondary)] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative text-center py-16 rounded-3xl bg-gradient-to-br from-[var(--primary)]/10 via-violet-500/5 to-[var(--primary)]/10 border-2 border-[var(--primary)]/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to calculate?
          </h2>
          <p className="text-[var(--secondary)] text-lg mb-8 max-w-lg mx-auto">
            Pick any calculator and get instant results with scientific methodology and AI-powered explanations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/health/bmi"
              className="group px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-semibold hover:bg-[var(--primary-hover)] transition-all hover:shadow-xl hover:shadow-[var(--primary)]/20 hover:-translate-y-0.5"
            >
              Start Calculating
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="/finance/mortgage"
              className="px-8 py-4 border-2 border-[var(--border)] rounded-2xl font-semibold hover:border-[var(--primary)] transition-all hover:-translate-y-0.5 bg-[var(--background)]"
            >
              Try Mortgage Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
