'use client'

import { useEffect, useState } from 'react'

export interface GaugeChartProps {
  value: number
  min?: number
  max?: number
  label?: string
  unit?: string
  size?: number
  thickness?: number
  animate?: boolean
  segments?: Array<{
    color: string
    from: number
    to: number
    label?: string
  }>
  thresholds?: {
    low?: number
    high?: number
  }
}

export default function GaugeChart({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  size = 200,
  thickness = 20,
  animate = true,
  segments,
  thresholds,
}: GaugeChartProps) {
  const [displayValue, setDisplayValue] = useState(animate ? min : value)

  // Clamp value
  const clampedValue = Math.max(min, Math.min(max, value))
  const range = max - min

  // Calculate angle (180 degrees arc from left to right)
  const startAngle = 180
  const endAngle = 0
  const angleRange = startAngle - endAngle
  const targetAngle = startAngle - ((displayValue - min) / range) * angleRange

  // SVG calculations
  const center = size / 2
  const radius = (size - thickness) / 2
  const innerRadius = radius - thickness

  // Helper to create arc path
  const createArc = (startDeg: number, endDeg: number, r: number) => {
    const startRad = (startDeg * Math.PI) / 180
    const endRad = (endDeg * Math.PI) / 180

    const x1 = center + r * Math.cos(startRad)
    const y1 = center - r * Math.sin(startRad)
    const x2 = center + r * Math.cos(endRad)
    const y2 = center - r * Math.sin(endRad)

    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
    const sweep = endDeg > startDeg ? 0 : 1

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`
  }

  // Animation effect
  useEffect(() => {
    if (!animate) {
      setDisplayValue(clampedValue)
      return
    }

    const duration = 1000
    const startTime = performance.now()
    const startValue = displayValue

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplayValue(startValue + (clampedValue - startValue) * eased)

      if (progress < 1) {
        requestAnimationFrame(animateFrame)
      }
    }

    requestAnimationFrame(animateFrame)
  }, [clampedValue, animate])

  // Determine color based on thresholds or segments
  const getValueColor = () => {
    if (segments) {
      const segment = segments.find(s => displayValue >= s.from && displayValue <= s.to)
      return segment?.color || 'var(--primary)'
    }

    if (thresholds) {
      if (thresholds.low && displayValue < thresholds.low) return '#22c55e' // green
      if (thresholds.high && displayValue > thresholds.high) return '#ef4444' // red
      return '#eab308' // yellow
    }

    return 'var(--primary)'
  }

  // Default segments if none provided
  const renderSegments = segments || [
    { color: '#22c55e', from: min, to: min + range * 0.33 },
    { color: '#eab308', from: min + range * 0.33, to: min + range * 0.66 },
    { color: '#ef4444', from: min + range * 0.66, to: max },
  ]

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background segments */}
        {renderSegments.map((seg, i) => {
          const segStartAngle = startAngle - ((seg.from - min) / range) * angleRange
          const segEndAngle = startAngle - ((seg.to - min) / range) * angleRange

          return (
            <path
              key={i}
              d={createArc(segStartAngle, segEndAngle, radius)}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeLinecap="butt"
              opacity={0.2}
            />
          )
        })}

        {/* Value arc */}
        <path
          d={createArc(startAngle, targetAngle, radius)}
          fill="none"
          stroke={getValueColor()}
          strokeWidth={thickness}
          strokeLinecap="round"
          style={{
            transition: animate ? 'none' : 'stroke-dashoffset 0.3s ease-out',
          }}
        />

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r={4}
          fill="var(--foreground)"
        />

        {/* Needle */}
        <line
          x1={center}
          y1={center}
          x2={center + (radius - thickness / 2) * Math.cos((targetAngle * Math.PI) / 180)}
          y2={center - (radius - thickness / 2) * Math.sin((targetAngle * Math.PI) / 180)}
          stroke="var(--foreground)"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Min/Max labels */}
        <text
          x={thickness / 2}
          y={center + 15}
          textAnchor="start"
          className="fill-[var(--secondary)] text-xs"
        >
          {min}
        </text>
        <text
          x={size - thickness / 2}
          y={center + 15}
          textAnchor="end"
          className="fill-[var(--secondary)] text-xs"
        >
          {max}
        </text>

        {/* Value display */}
        <text
          x={center}
          y={center + 30}
          textAnchor="middle"
          className="fill-[var(--foreground)] text-2xl font-bold"
        >
          {displayValue.toFixed(1)}
          {unit && <tspan className="text-sm ml-1">{unit}</tspan>}
        </text>
      </svg>

      {/* Label */}
      {label && (
        <p className="text-sm text-[var(--secondary)] mt-2">{label}</p>
      )}

      {/* Segment labels */}
      {segments && segments.some(s => s.label) && (
        <div className="flex gap-4 mt-3 text-xs">
          {segments.filter(s => s.label).map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              {seg.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
