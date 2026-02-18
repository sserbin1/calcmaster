'use client'

interface AmortizationTableProps {
  headers: string[]
  rows: (string | number)[][]
}

export default function AmortizationTable({ headers, rows }: AmortizationTableProps) {
  if (!rows || rows.length === 0) return null

  return (
    <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-[var(--foreground)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <svg className="w-4 h-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Schedule
      </h3>
      <div className="overflow-x-auto -mx-1 rounded-lg">
        <table className="w-full text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          <thead>
            <tr className="border-b-2 border-[var(--border)]">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`py-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--secondary)] ${i === 0 ? 'text-left' : 'text-right'}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b border-[var(--border)]/50 transition-colors hover:bg-[var(--background)]/50 ${rowIdx % 2 === 0 ? '' : 'bg-[var(--background)]/30'}`}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`py-2.5 px-3 ${cellIdx === 0 ? 'text-left font-medium text-[var(--foreground)]' : 'text-right'} ${
                      cellIdx === row.length - 1 ? 'font-semibold text-[var(--primary)]' : 'text-[var(--secondary)]'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
