'use client'

import { useEffect, useState, useRef } from 'react'

export interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  formatFn?: (value: number) => string
  onAnimationComplete?: () => void
}

export default function AnimatedNumber({
  value,
  duration = 800,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formatFn,
  onAnimationComplete,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValueRef = useRef(0)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const startValue = prevValueRef.current
    const endValue = value
    const startTime = performance.now()

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out exponential for satisfying deceleration
      const eased = 1 - Math.pow(2, -10 * progress)

      const current = startValue + (endValue - startValue) * eased
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        prevValueRef.current = endValue
        onAnimationComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration, onAnimationComplete])

  // Format the display value
  const formattedValue = formatFn
    ? formatFn(displayValue)
    : displayValue.toFixed(decimals)

  // Add thousands separator for large numbers
  const withSeparator = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <span className={className}>
      {prefix}{withSeparator}{suffix}
    </span>
  )
}

// Utility hook for count-up effect
export function useAnimatedNumber(
  targetValue: number,
  options: {
    duration?: number
    decimals?: number
    onComplete?: () => void
  } = {}
) {
  const { duration = 800, decimals = 0, onComplete } = options
  const [value, setValue] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const start = prevRef.current
    const end = targetValue
    const startTime = performance.now()
    let frame: number

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(2, -10 * progress)

      setValue(Number((start + (end - start) * eased).toFixed(decimals)))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        setValue(end)
        prevRef.current = end
        onComplete?.()
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [targetValue, duration, decimals, onComplete])

  return value
}
