'use client'

export interface MethodOption {
  id: string
  name: string
  description?: string
  accuracy?: string
  isDefault?: boolean
}

export interface MethodSelectorProps {
  methods: MethodOption[]
  selectedMethod: string
  onMethodChange: (methodId: string) => void
  className?: string
}

export default function MethodSelector({
  methods,
  selectedMethod,
  onMethodChange,
  className = '',
}: MethodSelectorProps) {
  if (methods.length < 2) {
    return null
  }

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-[var(--secondary)] mb-2">
        Calculation Method
      </label>
      <div className="flex flex-wrap gap-2">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isSelected
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]'
                }
              `}
              title={method.description}
            >
              {method.name}
              {method.isDefault && !isSelected && (
                <span className="ml-1 text-xs opacity-60">(default)</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
