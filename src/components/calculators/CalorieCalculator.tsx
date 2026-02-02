'use client'

import { useState } from 'react'
import { calculateCalories, activityLabels, type CalorieResult, type CalorieInput } from '@/lib/calculators/calories'

export default function CalorieCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState<CalorieInput['activityLevel']>('moderate')
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain')
  const [result, setResult] = useState<CalorieResult | null>(null)

  const calculate = () => {
    const ageNum = parseInt(age)
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)

    if (!ageNum || !weightNum || !heightNum) return

    const res = calculateCalories({
      age: ageNum,
      gender,
      weight: weightNum,
      height: heightNum,
      activityLevel,
      goal,
    })
    setResult(res)
  }

  return (
    <div className="space-y-6">
      {/* Gender */}
      <div>
        <label className="block text-sm font-medium mb-2">Gender</label>
        <div className="flex rounded-xl bg-[var(--muted)] p-1">
          <button
            onClick={() => setGender('male')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              gender === 'male' ? 'bg-[var(--background)] shadow text-[var(--primary)]' : 'text-[var(--secondary)]'
            }`}
          >
            Male
          </button>
          <button
            onClick={() => setGender('female')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              gender === 'female' ? 'bg-[var(--background)] shadow text-[var(--primary)]' : 'text-[var(--secondary)]'
            }`}
          >
            Female
          </button>
        </div>
      </div>

      {/* Age, Weight, Height */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            className="calc-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="calc-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            className="calc-input"
          />
        </div>
      </div>

      {/* Activity Level */}
      <div>
        <label className="block text-sm font-medium mb-2">Activity Level</label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as CalorieInput['activityLevel'])}
          className="calc-input"
        >
          {Object.entries(activityLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Goal */}
      <div>
        <label className="block text-sm font-medium mb-2">Goal</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'lose', label: 'Lose Weight', icon: '📉' },
            { value: 'maintain', label: 'Maintain', icon: '⚖️' },
            { value: 'gain', label: 'Build Muscle', icon: '💪' },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value as typeof goal)}
              className={`p-3 rounded-xl border-2 transition-all ${
                goal === g.value
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                  : 'border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              <span className="text-2xl block mb-1">{g.icon}</span>
              <span className="text-sm font-medium">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-medium text-lg hover:bg-[var(--primary-hover)] transition-colors"
      >
        Calculate Calories
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Result */}
          <div className="result-card text-center">
            <p className="text-sm opacity-80 mb-1">Daily Calories</p>
            <p className="text-6xl font-bold mb-2">{result.targetCalories}</p>
            <p className="text-lg opacity-80">
              {goal === 'lose' && `${Math.abs(result.deficit)} cal deficit`}
              {goal === 'gain' && `${result.deficit} cal surplus`}
              {goal === 'maintain' && 'maintenance calories'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--muted)]">
              <p className="text-sm text-[var(--secondary)]">BMR</p>
              <p className="text-2xl font-bold">{result.bmr}</p>
              <p className="text-xs text-[var(--secondary)]">calories at rest</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--muted)]">
              <p className="text-sm text-[var(--secondary)]">TDEE</p>
              <p className="text-2xl font-bold">{result.tdee}</p>
              <p className="text-xs text-[var(--secondary)]">total daily expenditure</p>
            </div>
          </div>

          {/* Macros */}
          <div className="p-6 rounded-2xl border-2 border-[var(--border)]">
            <h3 className="font-bold mb-4">Recommended Macros</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Protein</span>
                  <span>{result.protein.min}-{result.protein.max}g</span>
                </div>
                <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Carbs</span>
                  <span>{result.carbs.min}-{result.carbs.max}g</span>
                </div>
                <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Fat</span>
                  <span>{result.fat.min}-{result.fat.max}g</span>
                </div>
                <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          {result.weeklyChange !== 0 && (
            <div className="p-6 rounded-2xl bg-[var(--muted)]">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span>📊</span> Estimated Progress
              </h3>
              <p className="text-[var(--secondary)]">
                Following this plan, you can expect to {goal === 'lose' ? 'lose' : 'gain'} approximately{' '}
                <span className="font-bold text-[var(--foreground)]">
                  {Math.abs(result.weeklyChange)} kg per week
                </span>{' '}
                ({Math.abs(result.weeklyChange * 4).toFixed(1)} kg per month)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
