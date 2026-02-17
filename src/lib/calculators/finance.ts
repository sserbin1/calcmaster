// Finance calculator implementations
// Extracted from calculator-engine.ts

import { create, all } from 'mathjs'

const math = create(all, {
  precision: 64,
  number: 'BigNumber',
})

import type { CalculatorInput, CalculatorOutput, CalculatorField } from '../calculator-engine'

export function getFinanceFields(type: string): CalculatorField[] | null {
  const fields: Record<string, CalculatorField[]> = {
    mortgage: [
      { name: 'homePrice', label: 'Home Price', type: 'number', placeholder: '375000', unit: '$', default: 375000 },
      { name: 'downPayment', label: 'Down Payment', type: 'number', placeholder: '75000', unit: '$', default: 75000 },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '6.5', unit: '%', step: 0.1, default: 6.5 },
      { name: 'years', label: 'Loan Term', type: 'number', placeholder: '30', unit: 'years', default: 30 },
      { name: 'propertyTax', label: 'Property Tax', type: 'number', placeholder: '1.2', unit: '%/yr', step: 0.1, default: 1.2 },
      { name: 'homeInsurance', label: 'Home Insurance', type: 'number', placeholder: '1200', unit: '$/yr', default: 1200 },
      { name: 'pmi', label: 'PMI (if <20% down)', type: 'number', placeholder: '0', unit: '$/mo', default: 0 },
      { name: 'hoaFee', label: 'HOA Fee', type: 'number', placeholder: '0', unit: '$/mo', default: 0 },
      { name: 'extraPayment', label: 'Extra Monthly Payment', type: 'number', placeholder: '0', unit: '$', default: 0 },
      { name: 'startDate', label: 'Start Date', type: 'date' },
    ],
    loan: [
      { name: 'principal', label: 'Loan Amount', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '8', unit: '%', step: 0.1, default: 8 },
      { name: 'months', label: 'Loan Term', type: 'number', placeholder: '36', unit: 'months', default: 36 },
    ],
    tip: [
      { name: 'bill', label: 'Bill Amount', type: 'number', placeholder: '50', unit: '$', default: 50 },
      { name: 'tipPercent', label: 'Tip Percentage', type: 'number', placeholder: '18', unit: '%', default: 18 },
      { name: 'people', label: 'Split Between', type: 'number', placeholder: '1', default: 1 },
    ],
    'auto-loan': [
      { name: 'price', label: 'Vehicle Price', type: 'number', placeholder: '35000', unit: '$', default: 35000 },
      { name: 'downPayment', label: 'Down Payment', type: 'number', placeholder: '5000', unit: '$', default: 5000 },
      { name: 'tradeIn', label: 'Trade-in Value', type: 'number', placeholder: '0', unit: '$', default: 0 },
      { name: 'rate', label: 'Interest Rate', type: 'number', placeholder: '6.5', unit: '%', step: 0.1, default: 6.5 },
      { name: 'months', label: 'Loan Term', type: 'select', options: [
        { value: '36', label: '36 months' },
        { value: '48', label: '48 months' },
        { value: '60', label: '60 months' },
        { value: '72', label: '72 months' },
      ], default: '60' },
    ],
    interest: [
      { name: 'principal', label: 'Principal', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', placeholder: '5', unit: '%', step: 0.1, default: 5 },
      { name: 'time', label: 'Time Period', type: 'number', placeholder: '5', unit: 'years', default: 5 },
    ],
    compound: [
      { name: 'principal', label: 'Initial Investment', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', placeholder: '7', unit: '%', step: 0.1, default: 7 },
      { name: 'years', label: 'Time Period', type: 'number', placeholder: '10', unit: 'years', default: 10 },
      { name: 'contribution', label: 'Monthly Contribution', type: 'number', placeholder: '500', unit: '$', default: 500 },
      { name: 'frequency', label: 'Compound Frequency', type: 'select', options: [
        { value: '1', label: 'Annually' },
        { value: '4', label: 'Quarterly' },
        { value: '12', label: 'Monthly' },
        { value: '365', label: 'Daily' },
      ], default: '12' },
    ],
    salary: [
      { name: 'amount', label: 'Amount', type: 'number', placeholder: '25', unit: '$', default: 25 },
      { name: 'type', label: 'Type', type: 'select', options: [
        { value: 'hourly', label: 'Hourly Rate' },
        { value: 'weekly', label: 'Weekly Salary' },
        { value: 'biweekly', label: 'Bi-weekly Salary' },
        { value: 'monthly', label: 'Monthly Salary' },
        { value: 'annual', label: 'Annual Salary' },
      ], default: 'hourly' },
      { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', placeholder: '40', default: 40 },
    ],
    tax: [
      { name: 'income', label: 'Annual Income', type: 'number', placeholder: '75000', unit: '$', default: 75000 },
      { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
        { value: 'single', label: 'Single' },
        { value: 'married', label: 'Married Filing Jointly' },
        { value: 'head', label: 'Head of Household' },
      ], default: 'single' },
      { name: 'deductions', label: 'Deductions', type: 'number', placeholder: '14600', unit: '$', default: 14600 },
    ],
    inflation: [
      { name: 'amount', label: 'Current Amount', type: 'number', placeholder: '100', unit: '$', default: 100 },
      { name: 'rate', label: 'Inflation Rate', type: 'number', placeholder: '3', unit: '%', step: 0.1, default: 3 },
      { name: 'years', label: 'Years', type: 'number', placeholder: '10', default: 10 },
    ],
    budget: [
      { name: 'income', label: 'Monthly Income', type: 'number', placeholder: '5000', unit: '$', default: 5000 },
      { name: 'method', label: 'Budget Method', type: 'select', options: [
        { value: '50-30-20', label: '50/30/20 Rule' },
        { value: '60-20-20', label: '60/20/20 Rule' },
        { value: '70-20-10', label: '70/20/10 Rule' },
      ], default: '50-30-20' },
    ],
    retirement: [
      { name: 'currentAge', label: 'Current Age', type: 'number', placeholder: '30', default: 30 },
      { name: 'retireAge', label: 'Retirement Age', type: 'number', placeholder: '65', default: 65 },
      { name: 'currentSavings', label: 'Current Savings', type: 'number', placeholder: '50000', unit: '$', default: 50000 },
      { name: 'monthlyContrib', label: 'Monthly Contribution', type: 'number', placeholder: '500', unit: '$', default: 500 },
      { name: 'returnRate', label: 'Expected Return', type: 'number', placeholder: '7', unit: '%', step: 0.1, default: 7 },
    ],
    '401k': [
      { name: 'salary', label: 'Annual Salary', type: 'number', placeholder: '75000', unit: '$', default: 75000 },
      { name: 'contribution', label: 'Your Contribution', type: 'number', placeholder: '6', unit: '%', default: 6 },
      { name: 'employerMatch', label: 'Employer Match', type: 'number', placeholder: '50', unit: '%', default: 50 },
      { name: 'matchLimit', label: 'Match Limit', type: 'number', placeholder: '6', unit: '%', default: 6 },
      { name: 'years', label: 'Years to Retirement', type: 'number', placeholder: '30', default: 30 },
      { name: 'returnRate', label: 'Expected Return', type: 'number', placeholder: '7', unit: '%', step: 0.1, default: 7 },
    ],
    roi: [
      { name: 'initialInvestment', label: 'Initial Investment', type: 'number', placeholder: '10000', unit: '$', default: 10000 },
      { name: 'finalValue', label: 'Final Value', type: 'number', placeholder: '15000', unit: '$', default: 15000 },
      { name: 'years', label: 'Investment Period', type: 'number', placeholder: '5', unit: 'years', default: 5 },
    ],
    amortization: [
      { name: 'principal', label: 'Loan Amount', type: 'number', placeholder: '200000', unit: '$', default: 200000 },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', placeholder: '6', unit: '%', step: 0.1, default: 6 },
      { name: 'years', label: 'Loan Term', type: 'number', placeholder: '30', unit: 'years', default: 30 },
      { name: 'extraPayment', label: 'Extra Monthly Payment', type: 'number', placeholder: '0', unit: '$', default: 0 },
    ],
    'debt-payoff': [
      { name: 'totalDebt', label: 'Total Debt', type: 'number', placeholder: '25000', unit: '$', default: 25000 },
      { name: 'interestRate', label: 'Average Interest Rate', type: 'number', placeholder: '18', unit: '%', step: 0.1, default: 18 },
      { name: 'monthlyPayment', label: 'Monthly Payment', type: 'number', placeholder: '500', unit: '$', default: 500 },
    ],
  }
  return fields[type] || null
}

export function calculateFinance(type: string, input: CalculatorInput, method?: string): CalculatorOutput | null {
  switch (type) {
    case 'mortgage': {
      const homePrice = Number(input.homePrice || input.principal || 375000)
      const downPayment = Number(input.downPayment || 0)
      const loanAmount = homePrice - downPayment
      const annualRate = Number(input.rate) || 6.5
      const monthlyRate = annualRate / 100 / 12
      const years = Number(input.years) || 30
      const totalMonths = years * 12
      const extraPayment = Number(input.extraPayment || 0)

      // PITI components
      const propertyTaxRate = Number(input.propertyTax || 0) / 100
      const monthlyTax = (homePrice * propertyTaxRate) / 12
      const monthlyInsurance = Number(input.homeInsurance || 0) / 12
      const monthlyPMI = Number(input.pmi || 0)
      const monthlyHOA = Number(input.hoaFee || 0)

      // Auto-calculate PMI if down payment < 20% and user didn't set PMI
      const downPaymentPercent = (downPayment / homePrice) * 100
      const effectivePMI = monthlyPMI > 0 ? monthlyPMI : (downPaymentPercent < 20 ? Math.round(loanAmount * 0.005 / 12) : 0)

      // P&I calculation (standard PMT formula)
      const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      const totalPITI = monthlyPI + monthlyTax + monthlyInsurance + effectivePMI + monthlyHOA

      // Generate amortization schedule (month by month)
      let balance = loanAmount
      let cumInterest = 0
      let cumPrincipal = 0
      const yearlyData: { year: number; balance: number; interest: number; principal: number; cumInterest: number }[] = []
      const monthlySchedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = []

      let actualMonths = totalMonths
      for (let m = 1; m <= totalMonths && balance > 0; m++) {
        const intPmt = balance * monthlyRate
        let prinPmt = monthlyPI - intPmt + extraPayment
        if (prinPmt > balance) prinPmt = balance
        balance -= prinPmt
        if (balance < 0) balance = 0
        cumInterest += intPmt
        cumPrincipal += prinPmt

        monthlySchedule.push({
          month: m,
          payment: Math.round((prinPmt + intPmt) * 100) / 100,
          principal: Math.round(prinPmt * 100) / 100,
          interest: Math.round(intPmt * 100) / 100,
          balance: Math.round(balance * 100) / 100,
        })

        // Yearly summary (at month 12, 24, 36... or last month)
        if (m % 12 === 0 || balance <= 0) {
          const yr = Math.ceil(m / 12)
          yearlyData.push({
            year: yr,
            balance: Math.round(balance),
            interest: Math.round(intPmt),
            principal: Math.round(prinPmt),
            cumInterest: Math.round(cumInterest),
          })
        }

        if (balance <= 0) { actualMonths = m; break }
      }

      const totalInterest = Math.round(cumInterest)
      const totalCost = Math.round(loanAmount + cumInterest)

      // Payoff date
      const startDate = input.startDate ? new Date(input.startDate as string) : new Date()
      const payoffDate = new Date(startDate)
      payoffDate.setMonth(payoffDate.getMonth() + actualMonths)
      const payoffStr = payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

      // Interest saved with extra payments
      let interestSaved = 0
      let monthsSaved = 0
      if (extraPayment > 0) {
        // Calculate without extra payment for comparison
        let balNoExtra = loanAmount
        let cumIntNoExtra = 0
        for (let m = 1; m <= totalMonths && balNoExtra > 0; m++) {
          const intPmt = balNoExtra * monthlyRate
          let prinPmt = monthlyPI - intPmt
          if (prinPmt > balNoExtra) prinPmt = balNoExtra
          balNoExtra -= prinPmt
          cumIntNoExtra += intPmt
        }
        interestSaved = Math.round(cumIntNoExtra - cumInterest)
        monthsSaved = totalMonths - actualMonths
      }

      // Chart data: multi-series line (balance + cumulative interest by year)
      const chartData = yearlyData.map(d => ({
        name: `Year ${d.year}`,
        value: d.balance,
        balance: d.balance,
        cumulativeInterest: d.cumInterest,
      }))

      // Amortization schedule table (yearly)
      const scheduleRows = yearlyData.map(d => {
        const startMonth = (d.year - 1) * 12 + 1
        const endMonth = Math.min(d.year * 12, actualMonths)
        const yearPayments = monthlySchedule.slice(startMonth - 1, endMonth)
        const yearInterest = yearPayments.reduce((s, p) => s + p.interest, 0)
        const yearPrincipal = yearPayments.reduce((s, p) => s + p.principal, 0)
        return [
          d.year,
          '$' + Math.round(yearPrincipal).toLocaleString(),
          '$' + Math.round(yearInterest).toLocaleString(),
          '$' + Math.round(yearPrincipal + yearInterest).toLocaleString(),
          '$' + d.balance.toLocaleString(),
        ] as (string | number)[]
      })

      // Dynamic advice
      const adviceParts: string[] = []
      if (downPaymentPercent < 20) {
        adviceParts.push(`Your down payment is ${downPaymentPercent.toFixed(1)}% — below 20%. This triggers PMI (~$${effectivePMI}/mo). Increasing your down payment to 20% ($${Math.round(homePrice * 0.2).toLocaleString()}) would eliminate PMI and save you money.`)
      }
      if (extraPayment > 0 && interestSaved > 0) {
        adviceParts.push(`Extra payments of $${extraPayment}/mo will save you $${interestSaved.toLocaleString()} in interest and pay off your mortgage ${monthsSaved} months (${(monthsSaved / 12).toFixed(1)} years) early!`)
      }
      if (totalInterest > loanAmount) {
        adviceParts.push(`You'll pay more in interest ($${totalInterest.toLocaleString()}) than the loan itself. Consider a 15-year term or extra payments to reduce total interest significantly.`)
      }
      if (annualRate > 7) {
        adviceParts.push(`At ${annualRate}%, your rate is above average. Even a 0.5% reduction would save ~$${Math.round(loanAmount * 0.005 * years / 2).toLocaleString()} over the loan term. Shop around or consider buying points.`)
      }
      if (adviceParts.length === 0) {
        adviceParts.push(`Your mortgage looks well-structured. The total PITI payment of $${Math.round(totalPITI).toLocaleString()}/mo includes P&I, taxes, insurance${effectivePMI > 0 ? ', PMI' : ''}${monthlyHOA > 0 ? ', and HOA' : ''}. Payoff date: ${payoffStr}.`)
      }

      // Method-specific output
      if (method === 'pmt-formula') {
        // PMT Formula: P&I only, no PITI components
        return {
          primary: { value: Math.round(monthlyPI).toLocaleString(), label: 'Monthly P&I Payment', unit: '$' },
          secondary: [
            { label: 'Loan Amount', value: loanAmount.toLocaleString(), unit: '$' },
            { label: 'Total Interest', value: totalInterest.toLocaleString(), unit: '$' },
            { label: 'Total Cost (P&I)', value: totalCost.toLocaleString(), unit: '$' },
            { label: 'Payoff Date', value: payoffStr },
            ...(extraPayment > 0 ? [
              { label: 'Interest Saved', value: interestSaved.toLocaleString(), unit: '$' },
              { label: 'Time Saved', value: `${monthsSaved} months` },
            ] : []),
          ],
          chartData,
          schedule: {
            headers: ['Year', 'Principal', 'Interest', 'Total Payment', 'Remaining Balance'],
            rows: scheduleRows,
          },
          advice: adviceParts.join(' '),
        }
      }

      if (method === 'apr-vs-apy') {
        // APR vs APY: show rate comparisons
        const effectiveAPY = (Math.pow(1 + annualRate / 100 / 12, 12) - 1) * 100
        const totalPaidOverLife = monthlyPI * actualMonths
        const effectiveAPR = annualRate // Simplified: APR ≈ note rate when no points/fees

        return {
          primary: { value: annualRate.toFixed(2) + '% / ' + effectiveAPY.toFixed(2) + '%', label: 'APR / Effective APY' },
          secondary: [
            { label: 'Note Rate (APR)', value: annualRate.toFixed(3), unit: '%' },
            { label: 'Effective APY', value: effectiveAPY.toFixed(3), unit: '%' },
            { label: 'Monthly P&I', value: Math.round(monthlyPI).toLocaleString(), unit: '$' },
            { label: 'Total P&I Paid', value: Math.round(totalPaidOverLife).toLocaleString(), unit: '$' },
            { label: 'Total Interest', value: totalInterest.toLocaleString(), unit: '$' },
            { label: 'Interest / Principal Ratio', value: (totalInterest / loanAmount * 100).toFixed(1), unit: '%' },
          ],
          chartData: [
            { name: 'Principal', value: loanAmount, color: '#10b981' },
            { name: 'Total Interest', value: totalInterest, color: '#ef4444' },
          ],
          advice: `Your note rate is ${annualRate}% APR. Due to monthly compounding, the effective annual yield (APY) is ${effectiveAPY.toFixed(2)}%. Over ${years} years, you pay $${totalInterest.toLocaleString()} in interest on a $${loanAmount.toLocaleString()} loan — that's ${(totalInterest / loanAmount * 100).toFixed(0)}% of the principal. ${annualRate > 6 ? 'Consider refinancing if rates drop — even 0.5% lower could save thousands.' : 'Your rate is competitive for current market conditions.'}`,
        }
      }

      // Default: PITI (full housing payment)
      return {
        primary: { value: Math.round(totalPITI).toLocaleString(), label: 'Total Monthly Payment (PITI)', unit: '$' },
        secondary: [
          { label: 'Principal & Interest', value: Math.round(monthlyPI).toLocaleString(), unit: '$/mo' },
          { label: 'Property Tax', value: Math.round(monthlyTax).toLocaleString(), unit: '$/mo' },
          { label: 'Insurance', value: Math.round(monthlyInsurance).toLocaleString(), unit: '$/mo' },
          ...(effectivePMI > 0 ? [{ label: 'PMI', value: effectivePMI.toLocaleString(), unit: '$/mo' }] : []),
          ...(monthlyHOA > 0 ? [{ label: 'HOA', value: monthlyHOA.toLocaleString(), unit: '$/mo' }] : []),
          { label: 'Loan Amount', value: loanAmount.toLocaleString(), unit: '$' },
          { label: 'Total Interest', value: totalInterest.toLocaleString(), unit: '$' },
          { label: 'Total Cost', value: totalCost.toLocaleString(), unit: '$' },
          { label: 'Payoff Date', value: payoffStr },
          ...(extraPayment > 0 ? [
            { label: 'Interest Saved', value: interestSaved.toLocaleString(), unit: '$' },
            { label: 'Time Saved', value: `${monthsSaved} months` },
          ] : []),
        ],
        breakdown: [
          { label: 'Principal & Interest', value: '$' + Math.round(monthlyPI).toLocaleString(), color: '#6366f1' },
          { label: 'Property Tax', value: '$' + Math.round(monthlyTax).toLocaleString(), color: '#f59e0b' },
          { label: 'Insurance', value: '$' + Math.round(monthlyInsurance).toLocaleString(), color: '#22c55e' },
          ...(effectivePMI > 0 ? [{ label: 'PMI', value: '$' + effectivePMI.toLocaleString(), color: '#ef4444' }] : []),
          ...(monthlyHOA > 0 ? [{ label: 'HOA', value: '$' + monthlyHOA.toLocaleString(), color: '#8b5cf6' }] : []),
        ],
        chartData,
        schedule: {
          headers: ['Year', 'Principal', 'Interest', 'Total Payment', 'Remaining Balance'],
          rows: scheduleRows,
        },
        advice: adviceParts.join(' '),
      }
    }

    case 'loan': {
      const principal = Number(input.principal)
      const monthlyRate = Number(input.rate) / 100 / 12
      const payments = Number(input.months)

      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
      const totalPayment = monthlyPayment * payments
      const totalInterest = totalPayment - principal

      return {
        primary: { value: Math.round(monthlyPayment * 100) / 100, label: 'Monthly Payment', unit: '$' },
        secondary: [
          { label: 'Total Interest', value: Math.round(totalInterest * 100) / 100, unit: '$' },
          { label: 'Total Cost', value: Math.round(totalPayment * 100) / 100, unit: '$' },
        ],
      }
    }

    case 'tip': {
      const bill = Number(input.bill)
      const tipPercent = Number(input.tipPercent)
      const people = Number(input.people) || 1

      const tip = bill * (tipPercent / 100)
      const total = bill + tip
      const perPerson = total / people

      return {
        primary: { value: Math.round(tip * 100) / 100, label: 'Tip Amount', unit: '$' },
        secondary: [
          { label: 'Total', value: Math.round(total * 100) / 100, unit: '$' },
          ...(people > 1 ? [{ label: 'Per Person', value: Math.round(perPerson * 100) / 100, unit: '$' }] : []),
        ],
      }
    }

    case 'auto-loan': {
      const price = Number(input.price)
      const downPayment = Number(input.downPayment) || 0
      const tradeIn = Number(input.tradeIn) || 0
      const rate = Number(input.rate) / 100 / 12
      const months = Number(input.months)

      const principal = price - downPayment - tradeIn
      const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      const totalPayment = monthlyPayment * months
      const totalInterest = totalPayment - principal

      return {
        primary: { value: Math.round(monthlyPayment), label: 'Monthly Payment', unit: '$' },
        secondary: [
          { label: 'Loan Amount', value: principal.toLocaleString(), unit: '$' },
          { label: 'Total Interest', value: Math.round(totalInterest).toLocaleString(), unit: '$' },
          { label: 'Total Cost', value: Math.round(totalPayment).toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Principal', value: principal, color: '#10b981' },
          { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' },
        ],
      }
    }

    case 'interest': {
      const principal = Number(input.principal)
      const rate = Number(input.rate) / 100
      const time = Number(input.time)

      const interest = principal * rate * time
      const total = principal + interest

      return {
        primary: { value: Math.round(interest * 100) / 100, label: 'Simple Interest', unit: '$' },
        secondary: [
          { label: 'Total Amount', value: Math.round(total * 100) / 100, unit: '$' },
          { label: 'Interest per Year', value: Math.round(interest / time * 100) / 100, unit: '$' },
        ],
        advice: 'Simple interest is calculated only on the principal amount.',
      }
    }

    case 'compound': {
      const principal = Number(input.principal)
      const rate = Number(input.rate) / 100
      const years = Number(input.years)
      const contribution = Number(input.contribution) || 0
      const frequency = Number(input.frequency)

      // Compound interest formula with contributions
      const r = rate / frequency
      const n = frequency * years
      const compoundInterest = principal * Math.pow(1 + r, n)

      // Future value of series (contributions)
      const contributionValue = contribution * 12 * ((Math.pow(1 + rate / 12, years * 12) - 1) / (rate / 12))

      const totalValue = Math.round(compoundInterest + contributionValue)
      const totalContributions = principal + (contribution * 12 * years)
      const totalInterestEarned = totalValue - totalContributions

      return {
        primary: { value: totalValue.toLocaleString(), label: 'Future Value', unit: '$' },
        secondary: [
          { label: 'Total Contributions', value: totalContributions.toLocaleString(), unit: '$' },
          { label: 'Interest Earned', value: totalInterestEarned.toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Contributions', value: totalContributions, color: '#3b82f6' },
          { name: 'Interest', value: totalInterestEarned, color: '#10b981' },
        ],
        advice: 'Compound interest grows exponentially over time. Start early for maximum benefit.',
      }
    }

    case 'salary': {
      const amount = Number(input.amount)
      const type = input.type as string
      const hoursPerWeek = Number(input.hoursPerWeek) || 40

      let hourly: number, weekly: number, biweekly: number, monthly: number, annual: number

      switch (type) {
        case 'hourly':
          hourly = amount
          weekly = amount * hoursPerWeek
          biweekly = weekly * 2
          monthly = annual = weekly * 52 / 12
          annual = weekly * 52
          break
        case 'weekly':
          weekly = amount
          hourly = amount / hoursPerWeek
          biweekly = amount * 2
          monthly = amount * 52 / 12
          annual = amount * 52
          break
        case 'biweekly':
          biweekly = amount
          weekly = amount / 2
          hourly = weekly / hoursPerWeek
          monthly = amount * 26 / 12
          annual = amount * 26
          break
        case 'monthly':
          monthly = amount
          annual = amount * 12
          weekly = annual / 52
          biweekly = weekly * 2
          hourly = weekly / hoursPerWeek
          break
        case 'annual':
        default:
          annual = amount
          monthly = amount / 12
          weekly = amount / 52
          biweekly = weekly * 2
          hourly = weekly / hoursPerWeek
      }

      return {
        primary: { value: Math.round(annual).toLocaleString(), label: 'Annual Salary', unit: '$' },
        secondary: [
          { label: 'Monthly', value: Math.round(monthly).toLocaleString(), unit: '$' },
          { label: 'Bi-weekly', value: Math.round(biweekly).toLocaleString(), unit: '$' },
          { label: 'Hourly', value: Math.round(hourly * 100) / 100, unit: '$' },
        ],
      }
    }

    case 'tax': {
      const income = Number(input.income)
      const status = input.filingStatus as string
      const deductions = Number(input.deductions) || 14600

      const taxableIncome = Math.max(0, income - deductions)

      // 2024 US Federal Tax Brackets (simplified)
      const brackets: Record<string, { rate: number; min: number; max: number }[]> = {
        single: [
          { rate: 0.10, min: 0, max: 11600 },
          { rate: 0.12, min: 11600, max: 47150 },
          { rate: 0.22, min: 47150, max: 100525 },
          { rate: 0.24, min: 100525, max: 191950 },
          { rate: 0.32, min: 191950, max: 243725 },
          { rate: 0.35, min: 243725, max: 609350 },
          { rate: 0.37, min: 609350, max: Infinity },
        ],
        married: [
          { rate: 0.10, min: 0, max: 23200 },
          { rate: 0.12, min: 23200, max: 94300 },
          { rate: 0.22, min: 94300, max: 201050 },
          { rate: 0.24, min: 201050, max: 383900 },
          { rate: 0.32, min: 383900, max: 487450 },
          { rate: 0.35, min: 487450, max: 731200 },
          { rate: 0.37, min: 731200, max: Infinity },
        ],
        head: [
          { rate: 0.10, min: 0, max: 16550 },
          { rate: 0.12, min: 16550, max: 63100 },
          { rate: 0.22, min: 63100, max: 100500 },
          { rate: 0.24, min: 100500, max: 191950 },
          { rate: 0.32, min: 191950, max: 243700 },
          { rate: 0.35, min: 243700, max: 609350 },
          { rate: 0.37, min: 609350, max: Infinity },
        ],
      }

      let tax = 0
      let remaining = taxableIncome
      const statusBrackets = brackets[status] || brackets.single

      for (const bracket of statusBrackets) {
        if (remaining <= 0) break
        const taxableInBracket = Math.min(remaining, bracket.max - bracket.min)
        tax += taxableInBracket * bracket.rate
        remaining -= taxableInBracket
      }

      const effectiveRate = (tax / income) * 100
      const takeHome = income - tax

      return {
        primary: { value: Math.round(tax).toLocaleString(), label: 'Estimated Federal Tax', unit: '$' },
        secondary: [
          { label: 'Effective Rate', value: `${effectiveRate.toFixed(1)}%` },
          { label: 'Take Home', value: Math.round(takeHome).toLocaleString(), unit: '$' },
          { label: 'Monthly Take Home', value: Math.round(takeHome / 12).toLocaleString(), unit: '$' },
        ],
        advice: 'This is a simplified estimate. Consult a tax professional for accurate calculations.',
      }
    }

    case 'inflation': {
      const amount = Number(input.amount)
      const rate = Number(input.rate) / 100
      const years = Number(input.years)

      const futureValue = amount * Math.pow(1 + rate, years)
      const purchasingPower = amount / Math.pow(1 + rate, years)
      const totalInflation = ((futureValue - amount) / amount) * 100

      return {
        primary: { value: Math.round(futureValue * 100) / 100, label: 'Future Cost', unit: '$' },
        secondary: [
          { label: 'Purchasing Power', value: Math.round(purchasingPower * 100) / 100, unit: '$' },
          { label: 'Total Inflation', value: `${totalInflation.toFixed(1)}%` },
        ],
        advice: `$${amount} today will be worth $${purchasingPower.toFixed(2)} in ${years} years due to inflation.`,
      }
    }

    case 'budget': {
      const income = Number(input.income)
      const method = input.method as string

      const splits: Record<string, { needs: number; wants: number; savings: number }> = {
        '50-30-20': { needs: 50, wants: 30, savings: 20 },
        '60-20-20': { needs: 60, wants: 20, savings: 20 },
        '70-20-10': { needs: 70, wants: 20, savings: 10 },
      }

      const split = splits[method] || splits['50-30-20']
      const needs = Math.round(income * split.needs / 100)
      const wants = Math.round(income * split.wants / 100)
      const savings = Math.round(income * split.savings / 100)

      return {
        primary: { value: income.toLocaleString(), label: 'Monthly Income', unit: '$' },
        breakdown: [
          { label: `Needs (${split.needs}%)`, value: `$${needs.toLocaleString()}`, color: '#ef4444' },
          { label: `Wants (${split.wants}%)`, value: `$${wants.toLocaleString()}`, color: '#3b82f6' },
          { label: `Savings (${split.savings}%)`, value: `$${savings.toLocaleString()}`, color: '#10b981' },
        ],
        chartData: [
          { name: 'Needs', value: needs, color: '#ef4444' },
          { name: 'Wants', value: wants, color: '#3b82f6' },
          { name: 'Savings', value: savings, color: '#10b981' },
        ],
        advice: 'Needs: rent, utilities, groceries. Wants: dining, entertainment. Savings: emergency fund, investments.',
      }
    }

    case 'retirement': {
      const currentAge = Number(input.currentAge)
      const retireAge = Number(input.retireAge)
      const currentSavings = Number(input.currentSavings)
      const monthlyContrib = Number(input.monthlyContrib)
      const returnRate = Number(input.returnRate) / 100

      const yearsToRetire = retireAge - currentAge
      const monthlyRate = returnRate / 12
      const months = yearsToRetire * 12

      // Future value of current savings
      const fvCurrent = currentSavings * Math.pow(1 + returnRate, yearsToRetire)

      // Future value of contributions
      const fvContrib = monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

      const totalSavings = Math.round(fvCurrent + fvContrib)
      const totalContributions = currentSavings + (monthlyContrib * months)
      const interestEarned = totalSavings - totalContributions

      // 4% rule for retirement income
      const monthlyRetirementIncome = Math.round((totalSavings * 0.04) / 12)

      return {
        primary: { value: totalSavings.toLocaleString(), label: 'Retirement Savings', unit: '$' },
        secondary: [
          { label: 'Monthly Retirement Income', value: monthlyRetirementIncome.toLocaleString(), unit: '$' },
          { label: 'Total Contributions', value: totalContributions.toLocaleString(), unit: '$' },
          { label: 'Interest Earned', value: interestEarned.toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Contributions', value: totalContributions, color: '#3b82f6' },
          { name: 'Growth', value: interestEarned, color: '#10b981' },
        ],
        advice: 'Based on 4% safe withdrawal rate. Adjust for inflation and personal circumstances.',
      }
    }

    case '401k': {
      const salary = Number(input.salary)
      const contribution = Number(input.contribution) / 100
      const employerMatch = Number(input.employerMatch) / 100
      const matchLimit = Number(input.matchLimit) / 100
      const years = Number(input.years)
      const returnRate = Number(input.returnRate) / 100

      const annualContrib = salary * contribution
      const matchedAmount = Math.min(contribution, matchLimit) * salary * employerMatch
      const totalAnnualContrib = annualContrib + matchedAmount

      // Future value with contributions
      const fv = totalAnnualContrib * ((Math.pow(1 + returnRate, years) - 1) / returnRate) * (1 + returnRate)

      const totalContributions = totalAnnualContrib * years
      const interestEarned = fv - totalContributions

      return {
        primary: { value: Math.round(fv).toLocaleString(), label: 'Future Value', unit: '$' },
        secondary: [
          { label: 'Your Annual Contribution', value: Math.round(annualContrib).toLocaleString(), unit: '$' },
          { label: 'Employer Match', value: Math.round(matchedAmount).toLocaleString(), unit: '$' },
          { label: 'Free Money (Total Match)', value: Math.round(matchedAmount * years).toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Your Contributions', value: Math.round(annualContrib * years), color: '#3b82f6' },
          { name: 'Employer Match', value: Math.round(matchedAmount * years), color: '#8b5cf6' },
          { name: 'Growth', value: Math.round(interestEarned), color: '#10b981' },
        ],
        advice: 'Always contribute at least enough to get the full employer match - it\'s free money!',
      }
    }

    case 'roi': {
      const initial = Number(input.initialInvestment)
      const final = Number(input.finalValue)
      const years = Number(input.years)

      const roi = ((final - initial) / initial) * 100
      const annualizedRoi = (Math.pow(final / initial, 1 / years) - 1) * 100
      const profit = final - initial

      return {
        primary: { value: `${roi.toFixed(2)}%`, label: 'Total ROI' },
        secondary: [
          { label: 'Annualized ROI', value: `${annualizedRoi.toFixed(2)}%` },
          { label: 'Total Profit', value: profit.toLocaleString(), unit: '$' },
          { label: 'Profit per Year', value: Math.round(profit / years).toLocaleString(), unit: '$' },
        ],
        advice: roi > 0 ? 'Positive return on investment.' : 'Investment resulted in a loss.',
      }
    }

    case 'amortization': {
      const principal = Number(input.principal)
      const rate = Number(input.rate) / 100 / 12
      const years = Number(input.years)
      const extraPayment = Number(input.extraPayment) || 0

      const months = years * 12
      const basePayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      const monthlyPayment = basePayment + extraPayment

      // Calculate payoff with extra payments
      let balance = principal
      let totalInterest = 0
      let payoffMonths = 0

      while (balance > 0 && payoffMonths < months * 2) {
        const interest = balance * rate
        const principalPayment = Math.min(monthlyPayment - interest, balance)
        balance -= principalPayment
        totalInterest += interest
        payoffMonths++
      }

      const payoffYears = Math.floor(payoffMonths / 12)
      const payoffMonthsRemainder = payoffMonths % 12
      const savedInterest = extraPayment > 0 ? (principal * rate * months - totalInterest) : 0

      return {
        primary: { value: Math.round(basePayment), label: 'Monthly Payment', unit: '$' },
        secondary: [
          { label: 'Total Interest', value: Math.round(totalInterest).toLocaleString(), unit: '$' },
          { label: 'Payoff Time', value: `${payoffYears}y ${payoffMonthsRemainder}m` },
          ...(extraPayment > 0 ? [{ label: 'Interest Saved', value: Math.round(savedInterest).toLocaleString(), unit: '$' }] : []),
        ],
        chartData: [
          { name: 'Principal', value: principal, color: '#3b82f6' },
          { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' },
        ],
        advice: extraPayment > 0
          ? `Extra payments save $${Math.round(savedInterest).toLocaleString()} in interest!`
          : 'Adding extra payments can significantly reduce total interest.',
      }
    }

    case 'debt-payoff': {
      const totalDebt = Number(input.totalDebt)
      const rate = Number(input.interestRate) / 100 / 12
      const monthlyPayment = Number(input.monthlyPayment)

      if (monthlyPayment <= totalDebt * rate) {
        return {
          primary: { value: '∞', label: 'Payoff Time' },
          advice: 'Payment too low to cover interest. Increase monthly payment.',
        }
      }

      let balance = totalDebt
      let months = 0
      let totalInterest = 0

      while (balance > 0 && months < 1200) {
        const interest = balance * rate
        totalInterest += interest
        balance = balance + interest - monthlyPayment
        months++
      }

      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      const totalPaid = monthlyPayment * months

      return {
        primary: { value: `${years}y ${remainingMonths}m`, label: 'Payoff Time' },
        secondary: [
          { label: 'Total Interest', value: Math.round(totalInterest).toLocaleString(), unit: '$' },
          { label: 'Total Paid', value: Math.round(totalPaid).toLocaleString(), unit: '$' },
          { label: 'Monthly Payment', value: monthlyPayment.toLocaleString(), unit: '$' },
        ],
        chartData: [
          { name: 'Principal', value: totalDebt, color: '#3b82f6' },
          { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' },
        ],
        advice: 'Increase payments to pay off faster and save on interest.',
      }
    }
    default:
      return null
  }
}
