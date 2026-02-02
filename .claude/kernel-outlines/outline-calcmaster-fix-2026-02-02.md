# CalcMaster: Fix All Calculator Formulas

## Problem Statement
45 из 60 калькуляторов показывают "Coming soon!" потому что отсутствуют формулы в `calculator-engine.ts`. Реализовано только 15 калькуляторов.

## Scope & Boundaries
**IN SCOPE:**
- Добавить формулы для всех 45 недостающих калькуляторов
- Добавить поля ввода (fields) для каждого калькулятора
- Тестирование каждой категории после реализации

**OUT OF SCOPE:**
- Изменение UI компонентов
- Изменение SEO данных
- Новые типы визуализаций

## Success Criteria
- Все 60 калькуляторов возвращают реальные результаты
- Нет "Coming soon!" на production
- Build проходит без ошибок

## Tasks

<!-- EXECUTION_TASKS_START -->

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 1 | Health calculators: macro, body-fat, ideal-weight, protein, ovulation, due-date, pregnancy, sleep | src/lib/calculator-engine.ts | - | 1 |
| 2 | Finance calculators: auto-loan, interest, compound, salary, tax, inflation, budget, retirement, 401k, roi, amortization, debt-payoff | src/lib/calculator-engine.ts | 1 | 2 |
| 3 | Math calculators: scientific, fraction, gpa, grade, quadratic, slope, std-dev, statistics, probability | src/lib/calculator-engine.ts | 2 | 3 |
| 4 | Date-Time calculators: time, hours, day-counter, timezone, timecard, countdown | src/lib/calculator-engine.ts | 3 | 4 |
| 5 | Construction & Tools: concrete, tile, btu, password, converter | src/lib/calculator-engine.ts | 4 | 5 |
| 6 | Education calculators: final-grade, weighted-gpa, college-gpa, test-score, study-timer | src/lib/calculator-engine.ts | 5 | 6 |

<!-- EXECUTION_TASKS_END -->

## Dependencies
- Все задачи работают с одним файлом `calculator-engine.ts`
- Последовательное выполнение чтобы избежать конфликтов

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Сложные формулы для finance | Использовать стандартные финансовые формулы |
| Некорректные расчёты | Ручная проверка после каждого batch |

## Verification Checklist
- [ ] npm run build проходит
- [ ] Все калькуляторы возвращают числовые результаты
- [ ] Проверка 3-4 калькуляторов из каждой категории вручную
- [ ] Deploy на Vercel

## Calculator Details by Batch

### Batch 1: Health (8 calculators)
- `macro` - Macronutrient calculator (protein/carbs/fat split)
- `body-fat` - Body fat % (Navy method)
- `ideal-weight` - Ideal weight by height
- `protein` - Daily protein needs
- `ovulation` - Ovulation date prediction
- `due-date` - Pregnancy due date
- `pregnancy` - Pregnancy week tracker
- `sleep` - Sleep cycle calculator

### Batch 2: Finance (12 calculators)
- `auto-loan` - Car loan calculator
- `interest` - Simple interest
- `compound` - Compound interest with contributions
- `salary` - Hourly to annual conversion
- `tax` - Income tax estimation
- `inflation` - Inflation impact
- `budget` - 50/30/20 budget rule
- `retirement` - Retirement savings
- `401k` - 401k with employer match
- `roi` - Return on investment
- `amortization` - Loan amortization schedule
- `debt-payoff` - Debt payoff (snowball/avalanche)

### Batch 3: Math (9 calculators)
- `scientific` - Basic scientific operations
- `fraction` - Fraction operations
- `gpa` - GPA calculator (already partial)
- `grade` - Grade calculator
- `quadratic` - Quadratic equation solver
- `slope` - Slope from two points
- `std-dev` - Standard deviation
- `statistics` - Mean, median, mode
- `probability` - Basic probability

### Batch 4: Date-Time (6 calculators)
- `time` - Time duration/arithmetic
- `hours` - Work hours calculator
- `day-counter` - Days until event
- `timezone` - Timezone converter
- `timecard` - Timecard calculator
- `countdown` - Countdown to date

### Batch 5: Construction & Tools (5 calculators)
- `concrete` - Concrete volume calculator
- `tile` - Tile calculator for floor/wall
- `btu` - BTU calculator for AC/heating
- `password` - Password generator
- `converter` - Unit converter

### Batch 6: Education (5 calculators)
- `final-grade` - Final grade needed
- `weighted-gpa` - Weighted GPA (AP/IB)
- `college-gpa` - College GPA calculator
- `test-score` - Test score percentage
- `study-timer` - Pomodoro timer settings
