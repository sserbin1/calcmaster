'use client'

import { useState } from 'react'
import type { ReportData } from '@/components/pdf/ReportDocument'

interface ExportReportButtonProps {
  data: ReportData
  className?: string
}

export default function ExportReportButton({ data, className = '' }: ExportReportButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    setError(false)
    try {
      const [{ pdf }, { default: ReportDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/ReportDocument'),
      ])

      const blob = await pdf(<ReportDocument data={data} />).toBlob()
      const fileName = `${data.calculatorType}-report-${new Date().toISOString().split('T')[0]}.pdf`
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation failed:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? 'Generating...' : error ? 'Retry Download' : 'Download PDF'}
    </button>
  )
}
