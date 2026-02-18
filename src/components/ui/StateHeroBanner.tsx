import type { ReactNode } from 'react'

/** Category-themed hero banner for state calculators with gradient backgrounds + SVG icons */

const categoryThemes: Record<string, { gradient: string; icon: string; tagline: string }> = {
  // Finance/Tax
  'income-tax': { gradient: 'from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]', icon: 'tax', tagline: 'Know your exact tax burden' },
  'sales-tax': { gradient: 'from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]', icon: 'receipt', tagline: 'See what you really pay' },
  'capital-gains': { gradient: 'from-[#059669] via-[#047857] to-[#34D399]', icon: 'chart', tagline: 'Maximize your investment returns' },
  'estate-tax': { gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#A78BFA]', icon: 'estate', tagline: 'Protect your legacy' },
  'payroll-tax': { gradient: 'from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]', icon: 'payroll', tagline: 'Understand your paycheck' },
  'self-employment-tax': { gradient: 'from-[#CA8A04] via-[#B45309] to-[#FBBF24]', icon: 'briefcase', tagline: 'Plan for freelance success' },
  'retirement-savings': { gradient: 'from-[#059669] via-[#047857] to-[#34D399]', icon: 'savings', tagline: 'Secure your future' },
  // Housing
  'rent-vs-buy': { gradient: 'from-[#DC2626] via-[#B91C1C] to-[#F87171]', icon: 'home', tagline: 'Make the right housing decision' },
  'mortgage-tax': { gradient: 'from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]', icon: 'mortgage', tagline: 'Know your closing costs' },
  'co-op-condo': { gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#A78BFA]', icon: 'building', tagline: 'Co-op vs Condo compared' },
  'rent-stabilized': { gradient: 'from-[#059669] via-[#047857] to-[#34D399]', icon: 'shield', tagline: 'Know your tenant rights' },
  'property-tax': { gradient: 'from-[#CA8A04] via-[#B45309] to-[#FBBF24]', icon: 'home', tagline: 'Plan your property costs' },
  'closing-cost': { gradient: 'from-[#DC2626] via-[#B91C1C] to-[#F87171]', icon: 'receipt', tagline: 'Budget for your purchase' },
  // Transport
  'mta-fare': { gradient: 'from-[#0891B2] via-[#0E7490] to-[#22D3EE]', icon: 'subway', tagline: 'Optimize your commute costs' },
  'commute-cost': { gradient: 'from-[#0891B2] via-[#0E7490] to-[#22D3EE]', icon: 'car', tagline: 'Save on your daily commute' },
  'car-ownership': { gradient: 'from-[#DC2626] via-[#B91C1C] to-[#F87171]', icon: 'car', tagline: 'Total cost of driving in NYC' },
  'toll-cost': { gradient: 'from-[#CA8A04] via-[#B45309] to-[#FBBF24]', icon: 'bridge', tagline: 'Cross bridges smarter' },
  'auto-insurance': { gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#A78BFA]', icon: 'shield', tagline: 'Find the right coverage' },
  // Cost of Living
  'cost-of-living': { gradient: 'from-[#CA8A04] via-[#B45309] to-[#FBBF24]', icon: 'dollar', tagline: 'Budget for life in NYC' },
  'grocery-cost': { gradient: 'from-[#059669] via-[#047857] to-[#34D399]', icon: 'cart', tagline: 'Shop smarter in the city' },
  'utility-cost': { gradient: 'from-[#0891B2] via-[#0E7490] to-[#22D3EE]', icon: 'bolt', tagline: 'Control your energy costs' },
  // Legal
  'llc-cost': { gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#A78BFA]', icon: 'gavel', tagline: 'Start your business right' },
  'dui-penalty': { gradient: 'from-[#DC2626] via-[#B91C1C] to-[#F87171]', icon: 'alert', tagline: 'Understand the consequences' },
  'traffic-fine': { gradient: 'from-[#CA8A04] via-[#B45309] to-[#FBBF24]', icon: 'alert', tagline: 'Know what violations cost' },
  // Education
  'college-cost': { gradient: 'from-[#059669] via-[#047857] to-[#34D399]', icon: 'graduation', tagline: 'Plan for higher education' },
  'health-insurance': { gradient: 'from-[#DC2626] via-[#B91C1C] to-[#F87171]', icon: 'heart', tagline: 'Find affordable coverage' },
  // Energy
  'solar-panel-roi': { gradient: 'from-[#CA8A04] via-[#EAB308] to-[#FDE047]', icon: 'sun', tagline: 'Harness the power of solar' },
  'ev-savings': { gradient: 'from-[#059669] via-[#047857] to-[#34D399]', icon: 'bolt', tagline: 'Drive electric, save more' },
}

const defaultTheme = { gradient: 'from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]', icon: 'calculator', tagline: 'Get accurate results' }

function getIcon(type: string) {
  const icons: Record<string, ReactNode> = {
    tax: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    receipt: <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><path d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></>,
    chart: <><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></>,
    estate: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></>,
    payroll: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>,
    savings: <><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-0.5 2-2 2-3.5 0-1-.5-1.5-1-2z" /><path d="M2 9.1V5" /></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    mortgage: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><line x1="8" y1="6" x2="8" y2="6.01" /><line x1="16" y1="6" x2="16" y2="6.01" /><line x1="12" y1="6" x2="12" y2="6.01" /><line x1="8" y1="10" x2="8" y2="10.01" /><line x1="16" y1="10" x2="16" y2="10.01" /><line x1="12" y1="10" x2="12" y2="10.01" /><line x1="8" y1="14" x2="8" y2="14.01" /><line x1="16" y1="14" x2="16" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    subway: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 17v2" /><path d="M16 17v2" /><circle cx="9" cy="13" r="1.5" /><circle cx="15" cy="13" r="1.5" /><path d="M7 8h10" /></>,
    car: <><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a1 1 0 00-.8.4L1.74 11l-5.16.86a1 1 0 00-.84.99V16h3" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></>,
    bridge: <><path d="M4 16h16" /><path d="M4 12c2-2 4-4 8-4s6 2 8 4" /><line x1="4" y1="16" x2="4" y2="20" /><line x1="20" y1="16" x2="20" y2="20" /></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>,
    cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></>,
    bolt: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    gavel: <><path d="M14.5 2l5 5-5 5M9.5 7l5 5M4.5 12l5 5M2 19.5l2 2 5-5" /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    graduation: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 10 3 12 0v-5" /></>,
    heart: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></>,
    sun: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>,
    calculator: <><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10.01" /><line x1="12" y1="10" x2="12" y2="10.01" /><line x1="16" y1="10" x2="16" y2="10.01" /><line x1="8" y1="14" x2="8" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" /><line x1="16" y1="14" x2="16" y2="14.01" /><line x1="8" y1="18" x2="8" y2="18.01" /><line x1="12" y1="18" x2="12" y2="18.01" /><line x1="16" y1="18" x2="16" y2="18.01" /></>,
  }
  return icons[type] || icons.calculator
}

export default function StateHeroBanner({ baseType, name, stateName }: { baseType: string; name: string; stateName: string }) {
  const theme = categoryThemes[baseType] || defaultTheme

  return (
    <div className={`mb-8 rounded-2xl overflow-hidden bg-gradient-to-r ${theme.gradient} p-8 md:p-12 relative`}>
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating circles */}
      <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/10 blur-sm" />
      <div className="absolute bottom-4 right-24 w-20 h-20 rounded-full bg-white/5 blur-sm" />

      <div className="relative flex items-center gap-6 md:gap-10">
        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {getIcon(theme.icon)}
          </svg>
        </div>

        <div>
          <p className="text-white/80 text-sm md:text-base font-medium mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {stateName} Calculator
          </p>
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {theme.tagline}
          </h2>
          <p className="text-white/70 text-sm mt-2 max-w-lg">
            Updated for 2025 with real {stateName} rates, brackets, and regulations
          </p>
        </div>
      </div>
    </div>
  )
}
