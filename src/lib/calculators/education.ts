// Education calculator implementations
// Extracted from calculator-engine.ts

import type { CalculatorInput, CalculatorOutput, CalculatorField } from '../calculator-engine'

export function getEducationFields(type: string): CalculatorField[] | null {
  const fields: Record<string, CalculatorField[]> = {
    'final-grade': [
      { name: 'currentGrade', label: 'Current Grade', type: 'number', placeholder: '85', unit: '%' },
      { name: 'desiredGrade', label: 'Desired Grade', type: 'number', placeholder: '90', unit: '%' },
      { name: 'finalWeight', label: 'Final Exam Weight', type: 'number', placeholder: '20', unit: '%' },
    ],
    'weighted-gpa': [
      { name: 'grades', label: 'Grades (comma-separated)', type: 'text', placeholder: 'A, B+, A-, B' },
      { name: 'credits', label: 'Credits (comma-separated)', type: 'text', placeholder: '4, 3, 3, 4' },
      { name: 'weights', label: 'Weights: AP/H/R (comma-separated)', type: 'text', placeholder: 'AP, H, R, AP' },
    ],
    'college-gpa': [
      { name: 'grades', label: 'Grades (comma-separated)', type: 'text', placeholder: 'A, B+, A-, C+' },
      { name: 'credits', label: 'Credit Hours (comma-separated)', type: 'text', placeholder: '3, 4, 3, 3' },
      { name: 'currentGpa', label: 'Current GPA (optional)', type: 'number', placeholder: '3.5' },
      { name: 'currentCredits', label: 'Current Credits (optional)', type: 'number', placeholder: '60' },
    ],
    'test-score': [
      { name: 'correct', label: 'Correct Answers', type: 'number', placeholder: '42' },
      { name: 'total', label: 'Total Questions', type: 'number', placeholder: '50' },
      { name: 'scale', label: 'Grading Scale', type: 'select', options: [
        { value: 'standard', label: 'Standard (A=90+)' },
        { value: 'strict', label: 'Strict (A=93+)' },
        { value: 'lenient', label: 'Lenient (A=85+)' },
      ], default: 'standard' },
    ],
    'study-timer': [
      { name: 'studyMinutes', label: 'Study Duration', type: 'number', placeholder: '25', unit: 'min', default: 25 },
      { name: 'breakMinutes', label: 'Break Duration', type: 'number', placeholder: '5', unit: 'min', default: 5 },
      { name: 'sessions', label: 'Number of Sessions', type: 'number', placeholder: '4', default: 4 },
      { name: 'longBreak', label: 'Long Break', type: 'number', placeholder: '15', unit: 'min', default: 15 },
    ],
  }
  return fields[type] || null
}

export function calculateEducation(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  switch (type) {
    case 'final-grade': {
      const currentGrade = Number(input.currentGrade)
      const desiredGrade = Number(input.desiredGrade)
      const finalWeight = Number(input.finalWeight) / 100

      // Formula: desiredGrade = currentGrade * (1 - finalWeight) + finalGrade * finalWeight
      // Solve for finalGrade: finalGrade = (desiredGrade - currentGrade * (1 - finalWeight)) / finalWeight
      const neededGrade = (desiredGrade - currentGrade * (1 - finalWeight)) / finalWeight
      const rounded = Math.round(neededGrade * 100) / 100

      let advice: string
      if (neededGrade > 100) {
        advice = `You need ${rounded}% which is above 100%. Consider adjusting your goal.`
      } else if (neededGrade < 0) {
        advice = `You could get 0% and still achieve your goal!`
      } else if (neededGrade > 90) {
        advice = `You need an A on the final (${rounded}%). Study hard!`
      } else {
        advice = `You need ${rounded}% on the final to achieve your goal.`
      }

      return {
        primary: { value: rounded, label: 'Final Exam Score Needed', unit: '%' },
        secondary: [
          { label: 'Current Grade', value: currentGrade, unit: '%' },
          { label: 'Desired Grade', value: desiredGrade, unit: '%' },
          { label: 'Final Weight', value: `${finalWeight * 100}%` },
        ],
        advice,
      }
    }

    case 'weighted-gpa': {
      const gradesStr = (input.grades as string || '').toUpperCase()
      const creditsStr = (input.credits as string || '')
      const weightsStr = (input.weights as string || '').toUpperCase()

      const gradePoints: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0,
      }

      // Weight bonuses: AP = +1.0, H (Honors) = +0.5, R (Regular) = 0
      const weightBonus: Record<string, number> = {
        'AP': 1.0, 'IB': 1.0, 'H': 0.5, 'HONORS': 0.5, 'R': 0, 'REGULAR': 0,
      }

      const grades = gradesStr.split(',').map(g => g.trim())
      const credits = creditsStr.split(',').map(c => Number(c.trim()) || 3)
      const weights = weightsStr.split(',').map(w => w.trim())

      let totalWeightedPoints = 0
      let totalUnweightedPoints = 0
      let totalCredits = 0

      for (let i = 0; i < grades.length; i++) {
        const grade = grades[i]
        const credit = credits[i] || 3
        const weight = weights[i] || 'R'

        if (gradePoints[grade] !== undefined) {
          const basePoints = gradePoints[grade]
          const bonus = weightBonus[weight] || 0
          totalUnweightedPoints += basePoints * credit
          totalWeightedPoints += (basePoints + bonus) * credit
          totalCredits += credit
        }
      }

      const weightedGpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0
      const unweightedGpa = totalCredits > 0 ? Math.round((totalUnweightedPoints / totalCredits) * 100) / 100 : 0

      return {
        primary: { value: weightedGpa, label: 'Weighted GPA' },
        secondary: [
          { label: 'Unweighted GPA', value: unweightedGpa },
          { label: 'Total Credits', value: totalCredits },
        ],
        advice: 'AP/IB adds 1.0, Honors adds 0.5 to grade points. Enter weights as AP, H, or R.',
      }
    }

    case 'college-gpa': {
      const gradesStr = (input.grades as string || '').toUpperCase()
      const creditsStr = (input.credits as string || '')
      const currentGpa = Number(input.currentGpa) || 0
      const currentCredits = Number(input.currentCredits) || 0

      const gradePoints: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0,
      }

      const grades = gradesStr.split(',').map(g => g.trim())
      const credits = creditsStr.split(',').map(c => Number(c.trim()) || 3)

      let semesterPoints = 0
      let semesterCredits = 0

      for (let i = 0; i < grades.length; i++) {
        const grade = grades[i]
        const credit = credits[i] || 3
        if (gradePoints[grade] !== undefined) {
          semesterPoints += gradePoints[grade] * credit
          semesterCredits += credit
        }
      }

      const semesterGpa = semesterCredits > 0 ? Math.round((semesterPoints / semesterCredits) * 100) / 100 : 0

      // Cumulative GPA
      const totalPoints = (currentGpa * currentCredits) + semesterPoints
      const totalCredits = currentCredits + semesterCredits
      const cumulativeGpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : semesterGpa

      return {
        primary: { value: semesterGpa, label: 'Semester GPA' },
        secondary: [
          { label: 'Cumulative GPA', value: cumulativeGpa },
          { label: 'Semester Credits', value: semesterCredits },
          { label: 'Total Credits', value: totalCredits },
        ],
        advice: currentCredits > 0 ? `Combined with previous ${currentCredits} credits at ${currentGpa} GPA.` : 'Add current GPA and credits to calculate cumulative.',
      }
    }

    case 'test-score': {
      const correct = Number(input.correct)
      const total = Number(input.total)
      const scale = input.scale as string

      const percentage = (correct / total) * 100
      const rounded = Math.round(percentage * 100) / 100

      const scales: Record<string, { A: number; B: number; C: number; D: number }> = {
        standard: { A: 90, B: 80, C: 70, D: 60 },
        strict: { A: 93, B: 83, C: 73, D: 63 },
        lenient: { A: 85, B: 75, C: 65, D: 55 },
      }

      const gradeScale = scales[scale] || scales.standard
      let letterGrade: string
      if (percentage >= gradeScale.A) letterGrade = 'A'
      else if (percentage >= gradeScale.B) letterGrade = 'B'
      else if (percentage >= gradeScale.C) letterGrade = 'C'
      else if (percentage >= gradeScale.D) letterGrade = 'D'
      else letterGrade = 'F'

      const wrong = total - correct
      const neededFor = (targetGrade: number) => Math.ceil(total * targetGrade / 100)

      return {
        primary: { value: rounded, label: 'Score', unit: '%' },
        secondary: [
          { label: 'Letter Grade', value: letterGrade },
          { label: 'Correct', value: `${correct}/${total}` },
          { label: 'Wrong', value: wrong },
          { label: 'For A', value: `Need ${neededFor(gradeScale.A)} correct` },
        ],
      }
    }

    case 'study-timer': {
      const studyMinutes = Number(input.studyMinutes) || 25
      const breakMinutes = Number(input.breakMinutes) || 5
      const sessions = Number(input.sessions) || 4
      const longBreak = Number(input.longBreak) || 15

      const totalStudyTime = studyMinutes * sessions
      const totalBreakTime = breakMinutes * (sessions - 1) + longBreak
      const totalTime = totalStudyTime + totalBreakTime

      const studyHours = Math.floor(totalStudyTime / 60)
      const studyMins = totalStudyTime % 60
      const totalHours = Math.floor(totalTime / 60)
      const totalMins = totalTime % 60

      return {
        primary: { value: `${totalHours}h ${totalMins}m`, label: 'Total Session Time' },
        secondary: [
          { label: 'Study Time', value: `${studyHours}h ${studyMins}m` },
          { label: 'Break Time', value: `${totalBreakTime} min` },
          { label: 'Sessions', value: sessions },
        ],
        breakdown: [
          ...Array.from({ length: sessions }, (_, i) => ({
            label: `Session ${i + 1}`,
            value: `${studyMinutes}min study${i < sessions - 1 ? ` + ${breakMinutes}min break` : ` + ${longBreak}min long break`}`,
          })),
        ],
        advice: `Pomodoro technique: ${studyMinutes} min focus, ${breakMinutes} min break. Long break after ${sessions} sessions.`,
      }
    }
    default:
      return null
  }
}
