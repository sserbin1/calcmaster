import Link from 'next/link'

const categories = [
  {
    name: 'Health & Fitness',
    slug: 'health',
    icon: '🏥',
    description: 'BMI, calories, TDEE, body fat, and more',
    calculators: ['BMI', 'Calorie', 'TDEE', 'BMR', 'Body Fat'],
    color: 'bg-green-500',
  },
  {
    name: 'Finance',
    slug: 'finance',
    icon: '💰',
    description: 'Mortgage, loans, investments, and budgeting',
    calculators: ['Mortgage', 'Loan', 'Compound Interest', '401k', 'ROI'],
    color: 'bg-blue-500',
  },
  {
    name: 'Math',
    slug: 'math',
    icon: '📐',
    description: 'Percentages, fractions, statistics, and algebra',
    calculators: ['Percentage', 'Scientific', 'Fraction', 'GPA', 'Quadratic'],
    color: 'bg-purple-500',
  },
  {
    name: 'Date & Time',
    slug: 'date-time',
    icon: '📅',
    description: 'Age, date difference, time zones, and countdowns',
    calculators: ['Age', 'Date', 'Time', 'Countdown', 'Time Zone'],
    color: 'bg-orange-500',
  },
  {
    name: 'Construction',
    slug: 'construction',
    icon: '🏗️',
    description: 'Concrete, square footage, paint, and BTU',
    calculators: ['Concrete', 'Square Footage', 'Tile', 'Paint', 'BTU'],
    color: 'bg-yellow-500',
  },
  {
    name: 'Education',
    slug: 'education',
    icon: '🎓',
    description: 'GPA, grades, test scores, and study tools',
    calculators: ['Final Grade', 'Weighted GPA', 'College GPA', 'Test Score'],
    color: 'bg-indigo-500',
  },
]

const popularCalculators = [
  { name: 'BMI Calculator', slug: '/health/bmi', icon: '⚖️' },
  { name: 'Mortgage Calculator', slug: '/finance/mortgage', icon: '🏠' },
  { name: 'Age Calculator', slug: '/date-time/age', icon: '🎂' },
  { name: 'Percentage Calculator', slug: '/math/percent', icon: '📊' },
  { name: 'Calorie Calculator', slug: '/health/calories', icon: '🔥' },
  { name: 'Loan Calculator', slug: '/finance/loan', icon: '💳' },
]

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Free Online <span className="text-[var(--primary)]">Calculators</span>
        </h1>
        <p className="text-xl text-[var(--secondary)] max-w-2xl mx-auto mb-8">
          60+ calculators with instant results and AI-powered explanations.
          No ads, no sign-up, just calculate.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/health/bmi"
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            Try BMI Calculator
          </Link>
          <Link
            href="#categories"
            className="px-6 py-3 border-2 border-[var(--border)] rounded-xl font-medium hover:border-[var(--primary)] transition-colors"
          >
            Browse All Calculators
          </Link>
        </div>
      </section>

      {/* Popular Calculators */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Popular Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCalculators.map((calc) => (
            <Link
              key={calc.slug}
              href={calc.slug}
              className="p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all text-center"
            >
              <span className="text-3xl block mb-2">{calc.icon}</span>
              <span className="text-sm font-medium">{calc.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories">
        <h2 className="text-2xl font-bold mb-6">Calculator Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group p-6 rounded-2xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <span className={`text-4xl p-3 rounded-xl ${category.color} bg-opacity-10`}>
                  {category.icon}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[var(--secondary)] text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.calculators.slice(0, 3).map((calc) => (
                      <span key={calc} className="text-xs px-2 py-1 bg-[var(--muted)] rounded-full">
                        {calc}
                      </span>
                    ))}
                    <span className="text-xs px-2 py-1 text-[var(--secondary)]">
                      +{category.calculators.length - 3} more
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-[var(--muted)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-8 text-center">Why CalcMaster?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <span className="text-4xl block mb-4">🤖</span>
            <h3 className="font-bold mb-2">AI Explanations</h3>
            <p className="text-[var(--secondary)] text-sm">
              Get personalized insights about your results, not just numbers
            </p>
          </div>
          <div className="text-center">
            <span className="text-4xl block mb-4">📊</span>
            <h3 className="font-bold mb-2">Visual Charts</h3>
            <p className="text-[var(--secondary)] text-sm">
              See your data visualized with beautiful, interactive charts
            </p>
          </div>
          <div className="text-center">
            <span className="text-4xl block mb-4">💾</span>
            <h3 className="font-bold mb-2">Save & Track</h3>
            <p className="text-[var(--secondary)] text-sm">
              Keep history of your calculations and track progress over time
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
