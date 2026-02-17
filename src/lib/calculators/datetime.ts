// DateTime calculator implementations
// Extracted from calculator-engine.ts

import type { CalculatorInput, CalculatorOutput, CalculatorField } from '../calculator-engine'

export function getDateTimeFields(type: string): CalculatorField[] | null {
  const fields: Record<string, CalculatorField[]> = {
    age: [
      { name: 'birthdate', label: 'Birth Date', type: 'date' },
    ],
    date: [
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
    ],
    time: [
      { name: 'hours1', label: 'Hours', type: 'number', placeholder: '2', default: 0 },
      { name: 'minutes1', label: 'Minutes', type: 'number', placeholder: '30', default: 0 },
      { name: 'seconds1', label: 'Seconds', type: 'number', placeholder: '0', default: 0 },
      { name: 'operation', label: 'Operation', type: 'select', options: [
        { value: 'add', label: 'Add Time' },
        { value: 'subtract', label: 'Subtract Time' },
        { value: 'convert', label: 'Convert to...' },
      ], default: 'add' },
      { name: 'hours2', label: 'Hours to Add/Sub', type: 'number', placeholder: '1', default: 0 },
      { name: 'minutes2', label: 'Minutes to Add/Sub', type: 'number', placeholder: '45', default: 0 },
    ],
    hours: [
      { name: 'startTime', label: 'Start Time', type: 'text', placeholder: '09:00', default: '09:00' },
      { name: 'endTime', label: 'End Time', type: 'text', placeholder: '17:00', default: '17:00' },
      { name: 'breakMinutes', label: 'Break Duration', type: 'number', placeholder: '30', unit: 'min', default: 0 },
    ],
    'day-counter': [
      { name: 'targetDate', label: 'Target Date', type: 'date' },
      { name: 'includeEndDate', label: 'Include End Date', type: 'radio', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], default: 'no' },
    ],
    timezone: [
      { name: 'time', label: 'Time', type: 'text', placeholder: '14:00' },
      { name: 'fromZone', label: 'From Timezone', type: 'select', options: [
        { value: '-12', label: 'UTC-12 (Baker Island)' },
        { value: '-11', label: 'UTC-11 (Samoa)' },
        { value: '-10', label: 'UTC-10 (Hawaii)' },
        { value: '-9', label: 'UTC-9 (Alaska)' },
        { value: '-8', label: 'UTC-8 (Pacific/LA)' },
        { value: '-7', label: 'UTC-7 (Mountain)' },
        { value: '-6', label: 'UTC-6 (Central)' },
        { value: '-5', label: 'UTC-5 (Eastern/NY)' },
        { value: '-4', label: 'UTC-4 (Atlantic)' },
        { value: '-3', label: 'UTC-3 (Brazil)' },
        { value: '0', label: 'UTC+0 (London)' },
        { value: '1', label: 'UTC+1 (Paris)' },
        { value: '2', label: 'UTC+2 (Cairo)' },
        { value: '3', label: 'UTC+3 (Moscow)' },
        { value: '4', label: 'UTC+4 (Dubai)' },
        { value: '5', label: 'UTC+5 (Pakistan)' },
        { value: '5.5', label: 'UTC+5:30 (India)' },
        { value: '6', label: 'UTC+6 (Bangladesh)' },
        { value: '7', label: 'UTC+7 (Bangkok)' },
        { value: '8', label: 'UTC+8 (Singapore/China)' },
        { value: '9', label: 'UTC+9 (Tokyo)' },
        { value: '10', label: 'UTC+10 (Sydney)' },
        { value: '12', label: 'UTC+12 (Auckland)' },
      ], default: '-5' },
      { name: 'toZone', label: 'To Timezone', type: 'select', options: [
        { value: '-12', label: 'UTC-12 (Baker Island)' },
        { value: '-11', label: 'UTC-11 (Samoa)' },
        { value: '-10', label: 'UTC-10 (Hawaii)' },
        { value: '-9', label: 'UTC-9 (Alaska)' },
        { value: '-8', label: 'UTC-8 (Pacific/LA)' },
        { value: '-7', label: 'UTC-7 (Mountain)' },
        { value: '-6', label: 'UTC-6 (Central)' },
        { value: '-5', label: 'UTC-5 (Eastern/NY)' },
        { value: '-4', label: 'UTC-4 (Atlantic)' },
        { value: '-3', label: 'UTC-3 (Brazil)' },
        { value: '0', label: 'UTC+0 (London)' },
        { value: '1', label: 'UTC+1 (Paris)' },
        { value: '2', label: 'UTC+2 (Cairo)' },
        { value: '3', label: 'UTC+3 (Moscow)' },
        { value: '4', label: 'UTC+4 (Dubai)' },
        { value: '5', label: 'UTC+5 (Pakistan)' },
        { value: '5.5', label: 'UTC+5:30 (India)' },
        { value: '6', label: 'UTC+6 (Bangladesh)' },
        { value: '7', label: 'UTC+7 (Bangkok)' },
        { value: '8', label: 'UTC+8 (Singapore/China)' },
        { value: '9', label: 'UTC+9 (Tokyo)' },
        { value: '10', label: 'UTC+10 (Sydney)' },
        { value: '12', label: 'UTC+12 (Auckland)' },
      ], default: '0' },
    ],
    timecard: [
      { name: 'entries', label: 'Time Entries (start-end, one per line)', type: 'text', placeholder: '09:00-12:30, 13:00-17:00' },
      { name: 'hourlyRate', label: 'Hourly Rate (optional)', type: 'number', placeholder: '25', unit: '$' },
    ],
    countdown: [
      { name: 'eventDate', label: 'Event Date', type: 'date' },
      { name: 'eventTime', label: 'Event Time (optional)', type: 'text', placeholder: '00:00' },
      { name: 'eventName', label: 'Event Name', type: 'text', placeholder: 'My Event' },
    ],
  }
  return fields[type] || null
}

export function calculateDateTime(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  switch (type) {
    case 'age': {
      const birthdate = new Date(input.birthdate as string)
      const today = new Date()

      let years = today.getFullYear() - birthdate.getFullYear()
      let months = today.getMonth() - birthdate.getMonth()
      let days = today.getDate() - birthdate.getDate()

      if (days < 0) {
        months--
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
      }
      if (months < 0) {
        years--
        months += 12
      }

      const totalDays = Math.floor((today.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24))

      return {
        primary: { value: years, label: 'Your Age', unit: 'years' },
        secondary: [
          { label: 'Months', value: months },
          { label: 'Days', value: days },
          { label: 'Total Days Lived', value: totalDays.toLocaleString() },
        ],
      }
    }

    case 'date': {
      const start = new Date(input.startDate as string)
      const end = new Date(input.endDate as string)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.floor(diffDays / 30.44)

      return {
        primary: { value: diffDays, label: 'Days Between', unit: 'days' },
        secondary: [
          { label: 'Weeks', value: diffWeeks },
          { label: 'Months (approx)', value: diffMonths },
        ],
      }
    }

    case 'time': {
      const hours1 = Number(input.hours1) || 0
      const minutes1 = Number(input.minutes1) || 0
      const seconds1 = Number(input.seconds1) || 0
      const hours2 = Number(input.hours2) || 0
      const minutes2 = Number(input.minutes2) || 0
      const operation = input.operation as string

      const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1
      const totalSeconds2 = hours2 * 3600 + minutes2 * 60

      let resultSeconds: number
      if (operation === 'add') {
        resultSeconds = totalSeconds1 + totalSeconds2
      } else if (operation === 'subtract') {
        resultSeconds = Math.max(0, totalSeconds1 - totalSeconds2)
      } else {
        resultSeconds = totalSeconds1
      }

      const resHours = Math.floor(resultSeconds / 3600)
      const resMinutes = Math.floor((resultSeconds % 3600) / 60)
      const resSecs = resultSeconds % 60

      return {
        primary: { value: `${resHours}h ${resMinutes}m ${resSecs}s`, label: 'Result' },
        secondary: [
          { label: 'Total Seconds', value: resultSeconds.toLocaleString() },
          { label: 'Total Minutes', value: Math.round(resultSeconds / 60 * 100) / 100 },
          { label: 'Decimal Hours', value: Math.round(resultSeconds / 3600 * 100) / 100 },
        ],
      }
    }

    case 'hours': {
      const startTime = input.startTime as string || '09:00'
      const endTime = input.endTime as string || '17:00'
      const breakMinutes = Number(input.breakMinutes) || 0

      const [startH, startM] = startTime.split(':').map(Number)
      const [endH, endM] = endTime.split(':').map(Number)

      let startMinutes = startH * 60 + startM
      let endMinutes = endH * 60 + endM

      // Handle overnight shifts
      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60
      }

      const workedMinutes = endMinutes - startMinutes - breakMinutes
      const hours = Math.floor(workedMinutes / 60)
      const minutes = workedMinutes % 60
      const decimalHours = Math.round(workedMinutes / 60 * 100) / 100

      return {
        primary: { value: `${hours}h ${minutes}m`, label: 'Hours Worked' },
        secondary: [
          { label: 'Decimal Hours', value: decimalHours },
          { label: 'Total Minutes', value: workedMinutes },
          ...(breakMinutes > 0 ? [{ label: 'Break Deducted', value: `${breakMinutes}m` }] : []),
        ],
      }
    }

    case 'day-counter': {
      const targetDate = new Date(input.targetDate as string)
      const includeEnd = input.includeEndDate === 'yes'
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      targetDate.setHours(0, 0, 0, 0)

      const diffTime = targetDate.getTime() - today.getTime()
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (includeEnd && diffDays > 0) diffDays += 1

      const isPast = diffDays < 0
      const absDays = Math.abs(diffDays)
      const weeks = Math.floor(absDays / 7)
      const remainingDays = absDays % 7

      return {
        primary: { value: absDays, label: isPast ? 'Days Ago' : 'Days Until', unit: 'days' },
        secondary: [
          { label: 'Weeks', value: `${weeks}w ${remainingDays}d` },
          { label: 'Target', value: targetDate.toLocaleDateString() },
          { label: 'Status', value: isPast ? 'Past' : diffDays === 0 ? 'Today!' : 'Future' },
        ],
      }
    }

    case 'timezone': {
      const timeStr = input.time as string || '12:00'
      const fromZone = Number(input.fromZone)
      const toZone = Number(input.toZone)

      const [hours, minutes] = timeStr.split(':').map(Number)
      const diff = toZone - fromZone

      let newHours = hours + diff
      let dayChange = ''

      if (newHours >= 24) {
        newHours -= 24
        dayChange = ' (+1 day)'
      } else if (newHours < 0) {
        newHours += 24
        dayChange = ' (-1 day)'
      }

      const newTime = `${String(Math.floor(newHours)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

      return {
        primary: { value: newTime + dayChange, label: 'Converted Time' },
        secondary: [
          { label: 'Original', value: timeStr },
          { label: 'Time Difference', value: `${diff > 0 ? '+' : ''}${diff} hours` },
        ],
      }
    }

    case 'timecard': {
      const entriesStr = input.entries as string || ''
      const hourlyRate = Number(input.hourlyRate) || 0

      const entries = entriesStr.split(',').map(e => e.trim()).filter(e => e.includes('-'))
      let totalMinutes = 0

      for (const entry of entries) {
        const [start, end] = entry.split('-').map(t => t.trim())
        if (start && end) {
          const [startH, startM] = start.split(':').map(Number)
          const [endH, endM] = end.split(':').map(Number)
          let startMins = startH * 60 + (startM || 0)
          let endMins = endH * 60 + (endM || 0)
          if (endMins < startMins) endMins += 24 * 60
          totalMinutes += endMins - startMins
        }
      }

      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      const decimalHours = Math.round(totalMinutes / 60 * 100) / 100
      const earnings = hourlyRate > 0 ? Math.round(decimalHours * hourlyRate * 100) / 100 : 0

      return {
        primary: { value: `${hours}h ${minutes}m`, label: 'Total Hours' },
        secondary: [
          { label: 'Decimal Hours', value: decimalHours },
          { label: 'Entries Counted', value: entries.length },
          ...(hourlyRate > 0 ? [{ label: 'Earnings', value: `$${earnings.toLocaleString()}` }] : []),
        ],
        advice: 'Format: start-end, separated by commas (e.g., 09:00-12:30, 13:00-17:00)',
      }
    }

    case 'countdown': {
      const eventDate = new Date(input.eventDate as string)
      const eventTimeStr = input.eventTime as string || '00:00'
      const eventName = input.eventName as string || 'Event'

      const [eventH, eventM] = eventTimeStr.split(':').map(Number)
      eventDate.setHours(eventH || 0, eventM || 0, 0, 0)

      const now = new Date()
      const diffMs = eventDate.getTime() - now.getTime()
      const isPast = diffMs < 0
      const absDiff = Math.abs(diffMs)

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000)

      return {
        primary: { value: isPast ? 'Event passed!' : `${days}d ${hours}h ${minutes}m`, label: isPast ? 'Status' : `Until ${eventName}` },
        secondary: [
          { label: 'Days', value: days },
          { label: 'Hours', value: hours },
          { label: 'Minutes', value: minutes },
          { label: 'Event Date', value: eventDate.toLocaleDateString() },
        ],
        advice: isPast ? `${eventName} was ${days} days ago.` : `${eventName} is coming up!`,
      }
    }
    default:
      return null
  }
}
