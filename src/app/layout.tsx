import type { Metadata } from 'next'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema-generators'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CalcMaster - Free Online Calculators',
    template: '%s | CalcMaster',
  },
  description: 'Free online calculators for health, finance, math, and more. Get instant results with AI-powered explanations.',
  keywords: ['calculator', 'online calculator', 'free calculator', 'bmi calculator', 'mortgage calculator'],
  authors: [{ name: 'CalcMaster' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calcmaster.io',
    siteName: 'CalcMaster',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              generateOrganizationSchema(),
              generateWebSiteSchema(),
            ]),
          }}
        />
        {/* Decorative mesh gradient */}
        <div className="mesh-gradient" aria-hidden="true" />

        <header className="sticky top-0 z-50 glass-card-strong" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--navy)] to-[var(--primary)] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--navy)' }}>CalcMaster</span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              <a href="/health" className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all">Health</a>
              <a href="/finance" className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all">Finance</a>
              <a href="/math" className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all">Math</a>
              <a href="/date-time" className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all">Date & Time</a>
            </div>
          </nav>
        </header>
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="relative z-10 border-t border-[var(--border)] mt-16 bg-[var(--navy)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span className="text-white/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>CalcMaster</span>
              </div>
              <p className="text-white/40 text-sm">
                &copy; {new Date().getFullYear()} CalcMaster. Free calculators with AI-powered insights.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
