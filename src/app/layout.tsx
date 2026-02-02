import type { Metadata } from 'next'
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
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-[var(--primary)]">
              CalcMaster
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/health" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors">Health</a>
              <a href="/finance" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors">Finance</a>
              <a href="/math" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors">Math</a>
              <a href="/date-time" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors">Date & Time</a>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-[var(--secondary)] text-sm">
              &copy; {new Date().getFullYear()} CalcMaster. Free calculators with AI-powered insights.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
