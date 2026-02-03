'use client'

import { useEffect, useState } from 'react'

export interface ScaleSegment {
  label: string
  min: number
  max: number
  color: string
}

export interface VisualScaleProps {
  value: number
  min: number
  max: number
  segments: ScaleSegment[]
  label?: string
  unit?: string
  showValue?: boolean
  animate?: boolean
}

export default function VisualScale({
  value,
  min,
  max,
  segments,
  label,
  unit,
  showValue = true,
  animate = true,
}: VisualScaleProps) {
  const [displayValue, setDisplayValue] = useState(animate ? min : value)
  const [markerPosition, setMarkerPosition] = useState(0)

  // Clamp value to range
  const clampedValue = Math.max(min, Math.min(max, value))
  const range = max - min

  // Calculate marker position (0-100%)
  const targetPosition = ((clampedValue - min) / range) * 100

  // Find current segment for value display color
  const currentSegment = segments.find(
    (seg) => clampedValue >= seg.min && clampedValue <= seg.max
  ) || segments[segments.length - 1]

  useEffect(() => {
    if (!animate) {
      setDisplayValue(clampedValue)
      setMarkerPosition(targetPosition)
      return
    }

    // Animate marker position
    const duration = 800
    const startTime = performance.now()
    const startPosition = markerPosition
    const startValue = displayValue

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      setMarkerPosition(startPosition + (targetPosition - startPosition) * eased)
      setDisplayValue(startValue + (clampedValue - startValue) * eased)

      if (progress < 1) {
        requestAnimationFrame(animateFrame)
      }
    }

    requestAnimationFrame(animateFrame)
  }, [clampedValue, targetPosition, animate])

  // Build gradient from segments
  const gradientStops = segments.map((seg, i) => {
    const startPercent = ((seg.min - min) / range) * 100
    const endPercent = ((seg.max - min) / range) * 100
    return `${seg.color} ${startPercent}%, ${seg.color} ${endPercent}%`
  }).join(', ')

  return (
    <div className="w-full py-4">
      {/* Label and value display */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && (
            <span
              className="text-lg font-bold"
              style={{ color: currentSegment.color }}
            >
              {displayValue.toFixed(1)}{unit && ` ${unit}`}
            </span>
          )}
        </div>
      )}

      {/* Scale bar with gradient */}
      <div className="relative">
        <div
          className="h-4 rounded-full overflow-hidden"
          style={{ background: `linear-gradient(to right, ${gradientStops})` }}
        />

        {/* Marker */}
        <div
          className="absolute top-0 w-1 h-6 -mt-1 bg-[var(--foreground)] rounded-full shadow-lg transition-transform"
          style={{
            left: `${markerPosition}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Marker tip */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--foreground)]" />
        </div>
      </div>

      {/* Segment labels */}
      <div className="flex justify-between mt-2 text-xs text-[var(--secondary)]">
        {segments.map((seg, i) => (
          <span
            key={i}
            className="text-center"
            style={{
              width: `${((seg.max - seg.min) / range) * 100}%`,
              color: currentSegment === seg ? seg.color : undefined,
              fontWeight: currentSegment === seg ? 600 : 400,
            }}
          >
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  )
}
