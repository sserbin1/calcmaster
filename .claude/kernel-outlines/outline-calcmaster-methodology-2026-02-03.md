# CalcMaster Methodology Enhancement Plan

**Session ID:** plan-calcmaster-methodology-2026-02-03
**Created:** 2026-02-03
**Approach:** Component-First Architecture

## Problem Statement

CalcMaster has 60 working calculators but lacks:
1. Scientific methodologies with sources
2. Visual scales and animations
3. Alternative calculation methods
4. Professional-grade UX matching calculator.net

## Scope & Boundaries

**In Scope:**
- All 60 calculators across 7 categories
- Scientific methodologies with formulas and sources
- Visual scales (BMI scale, risk meters, gauges)
- Result animations (count up, progress)
- Alternative methods where applicable
- Methodology section on each calculator page

**Out of Scope:**
- New calculators
- Changing base formulas (only adding alternatives)
- Mobile app
- Backend API changes

## Success Criteria

1. All 60 calculators have Methodology section with:
   - Method name and formula
   - At least 2 alternative methods (where applicable)
   - Source links (WHO, NIH, peer-reviewed)
   - Method limitations

2. Visual elements:
   - Health: color scales (green-yellow-red)
   - Finance: pie charts, progress bars
   - Math: step-by-step visualization

3. Animations:
   - Count-up animation for results
   - Smooth transitions
   - Loading states

4. Build passes without errors
5. Lighthouse score >= 90

## Research Summary

### Health Calculators
- **BMI**: Quetelet Index (1830-1850), WHO categories (Underweight <18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese ≥30)
- **Calories/TDEE**: Mifflin-St Jeor (gold standard, 82% accurate), Harris-Benedict (69% accurate), Katch-McArdle (requires body fat)
- **Body Fat**: US Navy Method (Hodgdon & Beckett 1984, ±3-4% accuracy)
- **Ideal Weight**: Devine, Robinson, Miller, Hamwi formulas

### Finance Calculators
- **Mortgage**: PMT formula, APR vs APY, amortization schedules
- **Compound Interest**: A = P(1 + r/n)^(nt), Rule of 72 (doubling time)
- **Retirement**: 4% Rule (Trinity Study 1998), Monte Carlo simulations

### Math Calculators
- **Statistics**: Mean, median, mode, standard deviation (sample vs population)
- **Quadratic**: Discriminant analysis, complex roots handling

---

<!-- EXECUTION_TASKS_START -->

## Batch 1: Core UI Components

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 1 | Create VisualScale component with color gradients and marker animation | src/components/ui/VisualScale.tsx | - | 1 |
| 2 | Create MethodologySection component with expandable formulas and sources | src/components/ui/MethodologySection.tsx | - | 1 |
| 3 | Create AnimatedNumber component with count-up effect | src/components/ui/AnimatedNumber.tsx | - | 1 |
| 4 | Create GaugeChart component for risk/progress visualization | src/components/ui/GaugeChart.tsx | - | 1 |
| 5 | Add Framer Motion for animations | package.json | - | 1 |

## Batch 2: Data Schema & Types

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 6 | Extend CalculatorData interface with methodology fields | src/data/calculators.ts | 1-5 | 2 |
| 7 | Create methodology data types (Method, Source, VisualScaleConfig) | src/types/methodology.ts | - | 2 |
| 8 | Create visual scale configuration types and presets | src/lib/scale-presets.ts | 7 | 2 |

## Batch 3: Health Calculators Methodology (12 calculators)

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 9 | Add BMI methodology (Quetelet, WHO categories, Asian adjustment, New BMI) | seo-templates/methodology/health-bmi.json | 6-8 | 3 |
| 10 | Add Calories/TDEE methodology (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle) | seo-templates/methodology/health-calories.json | 6-8 | 3 |
| 11 | Add BMR methodology (same formulas, usage guidance) | seo-templates/methodology/health-bmr.json | 6-8 | 3 |
| 12 | Add Macro methodology (IIFYM, Keto, Athletic, USDA) | seo-templates/methodology/health-macro.json | 6-8 | 3 |
| 13 | Add Body Fat methodology (Navy, YMCA, Deurenberg, ranges by age/gender) | seo-templates/methodology/health-bodyfat.json | 6-8 | 3 |
| 14 | Add Ideal Weight methodology (Devine, Robinson, Miller, Hamwi) | seo-templates/methodology/health-idealweight.json | 6-8 | 3 |
| 15 | Add Protein methodology (RDA 0.8g/kg, ISSN 1.4-2.0g/kg, elderly) | seo-templates/methodology/health-protein.json | 6-8 | 3 |
| 16 | Add Ovulation methodology (cycle-14, fertile window, limitations) | seo-templates/methodology/health-ovulation.json | 6-8 | 3 |
| 17 | Add Due Date methodology (Naegele's rule, cycle adjustments, LMP vs ultrasound) | seo-templates/methodology/health-duedate.json | 6-8 | 3 |
| 18 | Add Pregnancy methodology (trimester definitions, milestones) | seo-templates/methodology/health-pregnancy.json | 6-8 | 3 |
| 19 | Add Sleep methodology (90-min cycles, NSF recommendations, chronotypes) | seo-templates/methodology/health-sleep.json | 6-8 | 3 |
| 20 | Integrate Health visual scales (BMI color scale, body fat gauge) | src/lib/health-scales.ts | 1-4, 8 | 3 |

## Batch 4: Finance Calculators Methodology (13 calculators)

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 21 | Add Mortgage methodology (PMT formula, APR vs APY, PITI) | seo-templates/methodology/finance-mortgage.json | 6-8 | 4 |
| 22 | Add Loan/Auto-loan methodology (same PMT, balloon payments) | seo-templates/methodology/finance-loan.json | 6-8 | 4 |
| 23 | Add Tip methodology (standards by country, pre/post tax) | seo-templates/methodology/finance-tip.json | 6-8 | 4 |
| 24 | Add Interest/Compound methodology (simple vs compound, Rule of 72, continuous) | seo-templates/methodology/finance-interest.json | 6-8 | 4 |
| 25 | Add Salary methodology (gross vs net, tax implications) | seo-templates/methodology/finance-salary.json | 6-8 | 4 |
| 26 | Add Tax methodology (US 2024 brackets, progressive calculation) | seo-templates/methodology/finance-tax.json | 6-8 | 4 |
| 27 | Add Inflation methodology (CPI, purchasing power) | seo-templates/methodology/finance-inflation.json | 6-8 | 4 |
| 28 | Add Budget methodology (50/30/20 origins, zero-based) | seo-templates/methodology/finance-budget.json | 6-8 | 4 |
| 29 | Add Retirement/401k methodology (4% rule, Trinity Study, Monte Carlo) | seo-templates/methodology/finance-retirement.json | 6-8 | 4 |
| 30 | Add ROI methodology (simple vs annualized, IRR) | seo-templates/methodology/finance-roi.json | 6-8 | 4 |
| 31 | Add Amortization methodology (French vs German vs American) | seo-templates/methodology/finance-amortization.json | 6-8 | 4 |
| 32 | Add Debt Payoff methodology (Avalanche vs Snowball) | seo-templates/methodology/finance-debtpayoff.json | 6-8 | 4 |
| 33 | Integrate Finance visual elements (amortization charts, pie charts) | src/lib/finance-visualizations.ts | 1-4, 8 | 4 |

## Batch 5: Math Calculators Methodology (10 calculators)

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 34 | Add Percent methodology (X% of Y, X is what % of Y, % change) | seo-templates/methodology/math-percent.json | 6-8 | 5 |
| 35 | Add Scientific methodology (supported functions, expression parsing) | seo-templates/methodology/math-scientific.json | 6-8 | 5 |
| 36 | Add Fraction methodology (operations, GCD simplification algorithm) | seo-templates/methodology/math-fraction.json | 6-8 | 5 |
| 37 | Add GPA methodology (4.0 vs 5.0 scale, weighted vs unweighted) | seo-templates/methodology/math-gpa.json | 6-8 | 5 |
| 38 | Add Grade methodology (letter scales by institution) | seo-templates/methodology/math-grade.json | 6-8 | 5 |
| 39 | Add Quadratic methodology (discriminant, complex roots, graphing) | seo-templates/methodology/math-quadratic.json | 6-8 | 5 |
| 40 | Add Slope methodology (point-slope, slope-intercept forms) | seo-templates/methodology/math-slope.json | 6-8 | 5 |
| 41 | Add Std-Dev methodology (sample vs population, Bessel's correction) | seo-templates/methodology/math-stddev.json | 6-8 | 5 |
| 42 | Add Statistics methodology (mean, median, mode, quartiles, box plots) | seo-templates/methodology/math-statistics.json | 6-8 | 5 |
| 43 | Add Probability methodology (basic, combinations, permutations) | seo-templates/methodology/math-probability.json | 6-8 | 5 |
| 44 | Integrate Math visual elements (step-by-step, graph preview) | src/lib/math-visualizations.ts | 1-4, 8 | 5 |

## Batch 6: Date-Time Calculators Methodology (8 calculators)

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 45 | Add Age methodology (exact calculation, leap years, timezone) | seo-templates/methodology/datetime-age.json | 6-8 | 6 |
| 46 | Add Date methodology (business days, weekends, holidays) | seo-templates/methodology/datetime-date.json | 6-8 | 6 |
| 47 | Add Time methodology (arithmetic, 12/24 format) | seo-templates/methodology/datetime-time.json | 6-8 | 6 |
| 48 | Add Hours methodology (work hours, overtime standards) | seo-templates/methodology/datetime-hours.json | 6-8 | 6 |
| 49 | Add Day Counter methodology (Julian date, calendar systems) | seo-templates/methodology/datetime-daycounter.json | 6-8 | 6 |
| 50 | Add Timezone methodology (UTC offsets, DST handling) | seo-templates/methodology/datetime-timezone.json | 6-8 | 6 |
| 51 | Add Timecard methodology (payroll standards) | seo-templates/methodology/datetime-timecard.json | 6-8 | 6 |
| 52 | Add Countdown methodology (precision, event timing) | seo-templates/methodology/datetime-countdown.json | 6-8 | 6 |

## Batch 7: Construction & Tools Calculators (9 calculators)

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 53 | Add Sqft methodology (area formulas for shapes) | seo-templates/methodology/construction-sqft.json | 6-8 | 7 |
| 54 | Add Paint methodology (coverage rates, multiple coats) | seo-templates/methodology/construction-paint.json | 6-8 | 7 |
| 55 | Add Concrete methodology (cubic yards, waste factors 10%) | seo-templates/methodology/construction-concrete.json | 6-8 | 7 |
| 56 | Add Tile methodology (spacing, pattern waste 10-15%) | seo-templates/methodology/construction-tile.json | 6-8 | 7 |
| 57 | Add BTU methodology (Manual J, heating/cooling load) | seo-templates/methodology/construction-btu.json | 6-8 | 7 |
| 58 | Add Converter methodology (SI units, conversion standards) | seo-templates/methodology/tools-converter.json | 6-8 | 7 |
| 59 | Add Password methodology (entropy, NIST guidelines) | seo-templates/methodology/tools-password.json | 6-8 | 7 |
| 60 | Add Random/Dice methodology (PRNG, cryptographic randomness) | seo-templates/methodology/tools-random.json | 6-8 | 7 |
| 61 | Add Love methodology (disclaimer: entertainment only) | seo-templates/methodology/fun-love.json | 6-8 | 7 |

## Batch 8: Education Calculators (5 calculators)

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 62 | Add Final Grade methodology (weighted average) | seo-templates/methodology/education-finalgrade.json | 6-8 | 8 |
| 63 | Add Weighted GPA methodology (AP/IB bonuses) | seo-templates/methodology/education-weightedgpa.json | 6-8 | 8 |
| 64 | Add College GPA methodology (cumulative calculation) | seo-templates/methodology/education-collegegpa.json | 6-8 | 8 |
| 65 | Add Test Score methodology (grading curves) | seo-templates/methodology/education-testscore.json | 6-8 | 8 |
| 66 | Add Study Timer methodology (Pomodoro, spaced repetition) | seo-templates/methodology/education-studytimer.json | 6-8 | 8 |

## Batch 9: Integration & Page Updates

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 67 | Update calculator page template with MethodologySection | src/app/[category]/[slug]/page.tsx | 2, 6-66 | 9 |
| 68 | Integrate VisualScale into GenericCalculator for Health | src/components/calculators/GenericCalculator.tsx | 1, 20 | 9 |
| 69 | Add AnimatedNumber to result display | src/components/calculators/GenericCalculator.tsx | 3 | 9 |
| 70 | Create methodology data loader and merge with SEO data | src/data/methodology-loader.ts | 9-66 | 9 |

## Batch 10: Testing & Verification

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 71 | Verify build passes with all new components | - | 67-70 | 10 |
| 72 | Run Lighthouse audit and optimize if needed | - | 71 | 10 |
| 73 | Deploy to production | - | 72 | 10 |

<!-- EXECUTION_TASKS_END -->

## Dependencies Graph

```
Batch 1 (Core Components) ─┬─> Batch 2 (Types) ─┬─> Batch 3-8 (Methodology Data)
                           │                    │
                           └─> Batch 9 (Integration) ─> Batch 10 (Deploy)
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Bundle size increase from animations | Lazy load Framer Motion, code split |
| Methodology data volume | JSON files loaded per-page, not bundled |
| Visual scale performance | Use CSS transitions where possible, GPU-accelerated |

## Verification Checklist

- [ ] All 60 calculators have methodology section
- [ ] Visual scales render correctly on all Health calculators
- [ ] Animations smooth (60fps)
- [ ] Build passes
- [ ] Lighthouse >= 90
- [ ] No console errors
- [ ] Mobile responsive
