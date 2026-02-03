// Visual scale presets for common calculator types

import type { VisualScaleConfig, ScaleSegment } from '@/types/methodology'

// BMI Scale (WHO Standards)
export const BMI_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: 10,
  max: 45,
  unit: 'kg/m²',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Underweight', min: 10, max: 18.5, color: '#3b82f6', description: 'Below healthy weight range' },
    { label: 'Normal', min: 18.5, max: 25, color: '#22c55e', description: 'Healthy weight range' },
    { label: 'Overweight', min: 25, max: 30, color: '#eab308', description: 'Above healthy weight range' },
    { label: 'Obese', min: 30, max: 45, color: '#ef4444', description: 'Significantly above healthy weight' },
  ],
}

// Body Fat Scale - Male
export const BODY_FAT_MALE_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: 2,
  max: 40,
  unit: '%',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Essential', min: 2, max: 6, color: '#3b82f6', description: 'Minimum for survival' },
    { label: 'Athletes', min: 6, max: 14, color: '#22c55e', description: 'Athletic performance range' },
    { label: 'Fitness', min: 14, max: 18, color: '#10b981', description: 'Fit and healthy' },
    { label: 'Average', min: 18, max: 25, color: '#eab308', description: 'Acceptable range' },
    { label: 'Obese', min: 25, max: 40, color: '#ef4444', description: 'Above healthy range' },
  ],
}

// Body Fat Scale - Female
export const BODY_FAT_FEMALE_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: 10,
  max: 45,
  unit: '%',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Essential', min: 10, max: 14, color: '#3b82f6', description: 'Minimum for survival' },
    { label: 'Athletes', min: 14, max: 21, color: '#22c55e', description: 'Athletic performance range' },
    { label: 'Fitness', min: 21, max: 25, color: '#10b981', description: 'Fit and healthy' },
    { label: 'Average', min: 25, max: 32, color: '#eab308', description: 'Acceptable range' },
    { label: 'Obese', min: 32, max: 45, color: '#ef4444', description: 'Above healthy range' },
  ],
}

// Risk Scale (Low to High)
export const RISK_SCALE: VisualScaleConfig = {
  type: 'gauge',
  min: 0,
  max: 100,
  unit: '%',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Low', min: 0, max: 33, color: '#22c55e', description: 'Low risk' },
    { label: 'Moderate', min: 33, max: 66, color: '#eab308', description: 'Moderate risk' },
    { label: 'High', min: 66, max: 100, color: '#ef4444', description: 'High risk' },
  ],
}

// Percentage Scale (0-100)
export const PERCENTAGE_SCALE: VisualScaleConfig = {
  type: 'progress',
  min: 0,
  max: 100,
  unit: '%',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Low', min: 0, max: 25, color: '#ef4444' },
    { label: 'Below Average', min: 25, max: 50, color: '#eab308' },
    { label: 'Above Average', min: 50, max: 75, color: '#10b981' },
    { label: 'High', min: 75, max: 100, color: '#22c55e' },
  ],
}

// Grade Scale (Letter Grades)
export const GRADE_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: 0,
  max: 100,
  unit: 'pts',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'F', min: 0, max: 60, color: '#ef4444' },
    { label: 'D', min: 60, max: 70, color: '#f97316' },
    { label: 'C', min: 70, max: 80, color: '#eab308' },
    { label: 'B', min: 80, max: 90, color: '#10b981' },
    { label: 'A', min: 90, max: 100, color: '#22c55e' },
  ],
}

// GPA Scale (4.0)
export const GPA_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: 0,
  max: 4,
  unit: 'GPA',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Failing', min: 0, max: 1, color: '#ef4444' },
    { label: 'Below Avg', min: 1, max: 2, color: '#f97316' },
    { label: 'Average', min: 2, max: 3, color: '#eab308' },
    { label: 'Good', min: 3, max: 3.5, color: '#10b981' },
    { label: 'Excellent', min: 3.5, max: 4, color: '#22c55e' },
  ],
}

// Debt-to-Income Ratio
export const DTI_SCALE: VisualScaleConfig = {
  type: 'gauge',
  min: 0,
  max: 60,
  unit: '%',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Excellent', min: 0, max: 20, color: '#22c55e', description: 'Very manageable debt' },
    { label: 'Good', min: 20, max: 36, color: '#10b981', description: 'Healthy debt level' },
    { label: 'Fair', min: 36, max: 43, color: '#eab308', description: 'May affect loan approval' },
    { label: 'Poor', min: 43, max: 60, color: '#ef4444', description: 'High debt burden' },
  ],
}

// Sleep Hours Scale
export const SLEEP_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: 4,
  max: 12,
  unit: 'hours',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Too Little', min: 4, max: 6, color: '#ef4444', description: 'Sleep deprivation' },
    { label: 'Short', min: 6, max: 7, color: '#eab308', description: 'May need more sleep' },
    { label: 'Optimal', min: 7, max: 9, color: '#22c55e', description: 'Recommended range' },
    { label: 'Long', min: 9, max: 12, color: '#3b82f6', description: 'May indicate health issues' },
  ],
}

// Calorie Deficit/Surplus Scale
export const CALORIE_BALANCE_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: -1000,
  max: 1000,
  unit: 'cal',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Extreme Deficit', min: -1000, max: -500, color: '#ef4444', description: 'Aggressive weight loss' },
    { label: 'Moderate Deficit', min: -500, max: -250, color: '#eab308', description: 'Healthy weight loss' },
    { label: 'Maintenance', min: -250, max: 250, color: '#22c55e', description: 'Maintain weight' },
    { label: 'Moderate Surplus', min: 250, max: 500, color: '#eab308', description: 'Lean bulking' },
    { label: 'Bulk', min: 500, max: 1000, color: '#3b82f6', description: 'Muscle building' },
  ],
}

// Protein Intake Scale (g/kg body weight)
export const PROTEIN_SCALE: VisualScaleConfig = {
  type: 'linear',
  min: 0.5,
  max: 2.5,
  unit: 'g/kg',
  showLabels: true,
  animate: true,
  segments: [
    { label: 'Low', min: 0.5, max: 0.8, color: '#ef4444', description: 'Below RDA' },
    { label: 'RDA', min: 0.8, max: 1.2, color: '#eab308', description: 'Minimum for sedentary' },
    { label: 'Active', min: 1.2, max: 1.6, color: '#22c55e', description: 'Good for active adults' },
    { label: 'Athletic', min: 1.6, max: 2.2, color: '#10b981', description: 'Optimal for athletes' },
    { label: 'Max', min: 2.2, max: 2.5, color: '#3b82f6', description: 'Upper limit' },
  ],
}

// Get scale preset by type
export function getScalePreset(type: string): VisualScaleConfig | null {
  const presets: Record<string, VisualScaleConfig> = {
    bmi: BMI_SCALE,
    'body-fat-male': BODY_FAT_MALE_SCALE,
    'body-fat-female': BODY_FAT_FEMALE_SCALE,
    risk: RISK_SCALE,
    percentage: PERCENTAGE_SCALE,
    grade: GRADE_SCALE,
    gpa: GPA_SCALE,
    dti: DTI_SCALE,
    sleep: SLEEP_SCALE,
    'calorie-balance': CALORIE_BALANCE_SCALE,
    protein: PROTEIN_SCALE,
  }

  return presets[type] || null
}

// Create custom scale from segments
export function createCustomScale(
  min: number,
  max: number,
  segments: ScaleSegment[],
  options?: Partial<VisualScaleConfig>
): VisualScaleConfig {
  return {
    type: options?.type || 'linear',
    min,
    max,
    segments,
    unit: options?.unit,
    showLabels: options?.showLabels ?? true,
    animate: options?.animate ?? true,
  }
}

// Get segment for a value
export function getSegmentForValue(scale: VisualScaleConfig, value: number): ScaleSegment | null {
  return scale.segments.find(seg => value >= seg.min && value <= seg.max) || null
}

// Get color for a value
export function getColorForValue(scale: VisualScaleConfig, value: number): string {
  const segment = getSegmentForValue(scale, value)
  return segment?.color || '#6b7280' // gray default
}
