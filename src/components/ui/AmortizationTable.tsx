'use client'

interface AmortizationTableProps {
  headers: string[]
  rows: (string | number)[][]
}

export default function AmortizationTable({ headers, rows }: AmortizationTableProps) {
  if (!rows || rows.length === 0) return null

  return (
    <div className="p-6 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)]">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <span>📋</span> Amortization Schedule
      </h3>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[var(--border)]">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`py-3 px-3 font-semibold text-[var(--secondary)] ${i === 0 ? 'text-left' : 'text-right'}`}
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
                className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--muted)] ${rowIdx % 2 === 0 ? '' : 'bg-[var(--muted)]/50'}`}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`py-2.5 px-3 ${cellIdx === 0 ? 'text-left font-medium' : 'text-right'} ${
                      cellIdx === row.length - 1 ? 'font-semibold text-[var(--primary)]' : ''
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
