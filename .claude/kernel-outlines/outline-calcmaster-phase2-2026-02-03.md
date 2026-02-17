# CalcMaster Phase 2 - Расширение методологий

**Session ID:** plan-calcmaster-phase2-2026-02-03
**Created:** 2026-02-03
**Status:** Ready for execution

---

## 1. Problem Statement

**Текущее состояние:**
- 55 methodology JSON файлов с базовым контентом (~100 слов на метод)
- MethodologySection отображает контент readonly
- Нет переключения между методами расчета
- Прямые ссылки на источники (плохо для SEO)
- Нет экспорта результатов

**Цели:**
1. Расширить контент методологий до 500+ слов с историей, научным обоснованием, примерами
2. Добавить вкладки для выбора метода расчета с пересчетом результатов
3. Редирект внешних ссылок через /api/redirect для сохранения SEO juice
4. Экспорт отчетов в PDF с брендингом через @react-pdf/renderer

---

## 2. Scope & Boundaries

**IN SCOPE:**
- Расширение контента 55 methodology JSON файлов (500+ слов, история, примеры)
- Компонент MethodSelector для переключения методов в калькуляторе
- Модификация calculator-engine.ts для поддержки разных методов
- API route /api/redirect для внешних ссылок
- PDF отчеты через @react-pdf/renderer с брендингом CalcMaster
- Компонент ExportReportButton

**OUT OF SCOPE:**
- Новые калькуляторы
- Изменение дизайна UI (кроме добавления вкладок)
- Серверная генерация PDF
- Мультиязычность
- Платные функции / подписки

---

## 3. Success Criteria

1. **Контент методологий:** Все 55 JSON файлов содержат 500+ слов на каждый метод с полями: history, scientificBasis, examples, comparison
2. **Переключение методов:** Калькуляторы с 2+ методами показывают вкладки, результат пересчитывается при смене метода
3. **Редирект ссылок:** Все внешние URL в sources проходят через /api/redirect?url=...
4. **PDF экспорт:** Кнопка "Download Report" генерирует PDF с результатами, методологией, источниками и логотипом CalcMaster
5. **Build:** npm run build проходит без ошибок, все 72 страницы генерируются

---

## 4. Tasks

<!-- EXECUTION_TASKS_START -->

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 1 | Extend MethodologyData types with expanded content fields | src/types/methodology.ts | - | 1 |
| 2 | Create MethodSelector component | src/components/ui/MethodSelector.tsx | - | 1 |
| 3 | Add method parameter to calculate() function signature | src/lib/calculator-engine.ts | - | 1 |
| 4 | Create /api/redirect route | src/app/api/redirect/route.ts | - | 1 |
| 5 | Install @react-pdf/renderer | package.json | - | 1 |
| 6 | Create PDF document template component | src/components/pdf/ReportDocument.tsx | 5 | 2 |
| 7 | Create ExportReportButton component | src/components/ui/ExportReportButton.tsx | 6 | 2 |
| 8 | Add CalcMaster logo assets for PDF | public/logo-pdf.png | - | 2 |
| 9 | Integrate MethodSelector into GenericCalculator | src/components/calculators/GenericCalculator.tsx | 2,3 | 3 |
| 10 | Update MethodologySection to use redirect URLs | src/components/ui/MethodologySection.tsx | 4 | 3 |
| 11 | Add ExportReportButton to calculator page | src/app/[category]/[slug]/page.tsx | 7 | 3 |
| 12 | Implement BMI alternative methods in engine | src/lib/calculator-engine.ts | 3 | 4 |
| 13 | Implement Calories alternative methods | src/lib/calculator-engine.ts | 3 | 4 |
| 14 | Implement Body Fat alternative methods | src/lib/calculator-engine.ts | 3 | 4 |
| 15 | Implement Mortgage alternative methods | src/lib/calculator-engine.ts | 3 | 4 |
| 16 | Expand health-bmi.json content | seo-templates/methodology/health-bmi.json | 1 | 5 |
| 17 | Expand health-calories.json content | seo-templates/methodology/health-calories.json | 1 | 5 |
| 18 | Expand health-bmr.json content | seo-templates/methodology/health-bmr.json | 1 | 5 |
| 19 | Expand health-bodyfat.json content | seo-templates/methodology/health-bodyfat.json | 1 | 5 |
| 20 | Expand health-macro.json content | seo-templates/methodology/health-macro.json | 1 | 5 |
| 21 | Expand health-protein.json content | seo-templates/methodology/health-protein.json | 1 | 5 |
| 22 | Expand health-idealweight.json content | seo-templates/methodology/health-idealweight.json | 1 | 5 |
| 23 | Expand health-sleep.json content | seo-templates/methodology/health-sleep.json | 1 | 5 |
| 24 | Expand health-ovulation.json content | seo-templates/methodology/health-ovulation.json | 1 | 5 |
| 25 | Expand health-duedate.json content | seo-templates/methodology/health-duedate.json | 1 | 5 |
| 26 | Expand health-pregnancy.json content | seo-templates/methodology/health-pregnancy.json | 1 | 5 |
| 27 | Expand finance-mortgage.json content | seo-templates/methodology/finance-mortgage.json | 1 | 6 |
| 28 | Expand finance-loan.json content | seo-templates/methodology/finance-loan.json | 1 | 6 |
| 29 | Expand finance-interest.json content | seo-templates/methodology/finance-interest.json | 1 | 6 |
| 30 | Expand finance-retirement.json content | seo-templates/methodology/finance-retirement.json | 1 | 6 |
| 31 | Expand finance-budget.json content | seo-templates/methodology/finance-budget.json | 1 | 6 |
| 32 | Expand finance-tax.json content | seo-templates/methodology/finance-tax.json | 1 | 6 |
| 33 | Expand finance-inflation.json content | seo-templates/methodology/finance-inflation.json | 1 | 6 |
| 34 | Expand finance-salary.json content | seo-templates/methodology/finance-salary.json | 1 | 6 |
| 35 | Expand finance-tip.json content | seo-templates/methodology/finance-tip.json | 1 | 6 |
| 36 | Expand finance-roi.json content | seo-templates/methodology/finance-roi.json | 1 | 6 |
| 37 | Expand finance-amortization.json content | seo-templates/methodology/finance-amortization.json | 1 | 6 |
| 38 | Expand finance-debtpayoff.json content | seo-templates/methodology/finance-debtpayoff.json | 1 | 6 |
| 39 | Expand math-percent.json content | seo-templates/methodology/math-percent.json | 1 | 7 |
| 40 | Expand math-quadratic.json content | seo-templates/methodology/math-quadratic.json | 1 | 7 |
| 41 | Expand math-statistics.json content | seo-templates/methodology/math-statistics.json | 1 | 7 |
| 42 | Expand math-probability.json content | seo-templates/methodology/math-probability.json | 1 | 7 |
| 43 | Expand math-gpa.json content | seo-templates/methodology/math-gpa.json | 1 | 7 |
| 44 | Expand education-finalgrade.json content | seo-templates/methodology/education-finalgrade.json | 1 | 7 |
| 45 | Expand education-collegegpa.json content | seo-templates/methodology/education-collegegpa.json | 1 | 7 |
| 46 | Expand datetime-age.json content | seo-templates/methodology/datetime-age.json | 1 | 8 |
| 47 | Expand datetime-timezone.json content | seo-templates/methodology/datetime-timezone.json | 1 | 8 |
| 48 | Expand construction-concrete.json content | seo-templates/methodology/construction-concrete.json | 1 | 8 |
| 49 | Expand construction-btu.json content | seo-templates/methodology/construction-btu.json | 1 | 8 |
| 50 | Expand remaining methodology files | seo-templates/methodology/*.json | 1 | 8 |
| 51 | Verify build passes | - | 1-50 | 9 |
| 52 | Test method switching on BMI calculator | - | 9,12 | 9 |
| 53 | Test PDF export functionality | - | 11 | 9 |
| 54 | Test redirect API | - | 10 | 9 |

<!-- EXECUTION_TASKS_END -->

---

## 5. Dependencies

**External Dependencies:**
- `@react-pdf/renderer` - PDF generation (~700KB bundle, dynamic import)
- `@airthium/react-pdf-table` - tables in PDF (optional)

**Internal Dependencies:**
- MethodologyData types → all methodology content tasks
- calculator-engine.ts method param → MethodSelector → GenericCalculator
- /api/redirect → MethodologySection
- ReportDocument → ExportReportButton → page.tsx

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| @react-pdf/renderer SSR errors | High | Medium | Dynamic import with ssr: false |
| Bundle size increase (+700KB) | Certain | Low | Lazy load PDF only on click |
| Redirect API abuse | Medium | Low | Rate limiting, validate URL whitelist |
| Content quality inconsistency | Medium | Medium | Use research templates, AI assistance |
| Method calculations incorrect | Medium | High | Unit tests for each formula |
| Build time increase | Low | Low | Acceptable tradeoff |

---

## 7. Verification Checklist

**Build Verification:**
- [ ] `npm run build` passes without errors
- [ ] All 72 pages generate successfully
- [ ] No TypeScript errors

**Functional Verification:**
- [ ] MethodSelector shows methods for calculators with 2+ methods
- [ ] Switching method recalculates result correctly
- [ ] PDF downloads with correct content and branding
- [ ] External links go through /api/redirect
- [ ] Redirect returns 301 status

**Content Verification:**
- [ ] Each method has 500+ words expanded content
- [ ] History, scientific basis, examples present
- [ ] Sources have valid URLs (for redirect)

---

## Human Decisions

| Question | Answer |
|----------|--------|
| Content depth | Maximum (500+ words per method) |
| PDF generation | Client-side @react-pdf/renderer |
| Method tabs | Recalculate on switch |
| Approach | B: Premium PDF |

---

## Next Step

```
claudikins-kernel:execute .claude/kernel-outlines/outline-calcmaster-phase2-2026-02-03.md
```
