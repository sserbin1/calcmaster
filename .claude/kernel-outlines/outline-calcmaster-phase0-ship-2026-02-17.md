# CalcMaster Phase 0: Ship to Production

**Session ID:** plan-calcmaster-phase0-ship-2026-02-17
**Created:** 2026-02-17
**Approach:** Complete Phase 0 — SEO + Engine Split + Deploy
**Working Directory:** C:\Projects\calcmaster

---

## 1. Problem Statement

CalcMaster has 60 working calculators but has **never been deployed**. It lacks critical SEO infrastructure (no sitemap, no robots.txt, no `public/` directory), the calculator engine is a 2,785-line monolith that won't scale for 2,500+ planned state-specific pages, and 66+ files of Phase 2 work sit uncommitted. Before building state-specific calculators (Phase 1), we need a clean, deployed, SEO-ready foundation.

---

## 2. Scope & Boundaries

**IN SCOPE:**
- sitemap.ts, robots.ts for Google indexing
- Enhanced JSON-LD schema (WebApplication, FAQPage, HowTo, BreadcrumbList, Organization)
- public/ directory: favicon, icons
- Fix next.config.ts warnings (esmExternals, @next/swc)
- Split calculator-engine.ts (2,785 lines) into per-category modules
- Commit all uncommitted work (66 modified + 50+ untracked)
- Deploy to Vercel (default domain)

**OUT OF SCOPE:**
- State-specific calculators (Phase 1)
- Calculator Chaining, B2B widgets (Phase 2)
- Custom domain purchase/setup
- Google Search Console / GA4 (post-deploy manual tasks)
- New calculator implementations
- UI/design changes
- OG image generation (use defaults)

---

## 3. Success Criteria

1. `npm run build` passes with 0 warnings about @next/swc
2. All 73+ pages generate with JSON-LD schema markup
3. `/sitemap.xml` returns valid XML with all calculator URLs
4. `/robots.txt` allows crawling, points to sitemap
5. Favicon visible in browser tab
6. calculator-engine.ts reduced from 2,785 lines to <100 (router only)
7. All code committed to git
8. Site live on Vercel default URL

---

## 4. Tasks

<!-- EXECUTION_TASKS_START -->

| # | Task | Files | Deps | Batch |
|---|------|-------|------|-------|
| 1 | Create public/ directory with favicon.ico and icon.png — generate a simple "CM" branded icon using SVG-to-PNG or placeholder | public/favicon.ico, public/icon.png, public/apple-icon.png | - | 1 |
| 2 | Create src/app/sitemap.ts — dynamic sitemap generating URLs for all 60 calculators (from calculators.ts data) + 7 category pages + homepage. Use MetadataRoute.Sitemap return type | src/app/sitemap.ts | - | 1 |
| 3 | Create src/app/robots.ts — allow all crawlers, reference /sitemap.xml. Use MetadataRoute.Robots return type | src/app/robots.ts | - | 1 |
| 4 | Fix next.config.ts — remove experimental.esmExternals: 'loose' entirely. If build fails, add serverExternalPackages: ['mathjs'] instead | next.config.ts | - | 1 |
| 5 | Create src/lib/schema-generators.ts — export functions: generateOrganizationSchema(), generateWebSiteSchema(), generateCalculatorSchema(calc), generateFAQSchema(faqs), generateHowToSchema(calc), generateBreadcrumbSchema(items). All return valid Schema.org JSON-LD objects | src/lib/schema-generators.ts | - | 1 |
| 6 | Add Organization + WebSite JSON-LD to layout.tsx — insert <script type="application/ld+json"> in the <body> with Organization and WebSite schema from schema-generators | src/app/layout.tsx | 5 | 2 |
| 7 | Enhance calculator page JSON-LD — replace existing simple schema (lines 167-201) with comprehensive schema using schema-generators: WebApplication with featureList, enhanced FAQPage, HowTo steps, BreadcrumbList | src/app/[category]/[slug]/page.tsx | 5 | 2 |
| 8 | Add JSON-LD to category pages — CollectionPage schema with ItemList of calculators in that category + BreadcrumbList | src/app/[category]/page.tsx | 5 | 2 |
| 9 | Add JSON-LD to homepage — WebSite with SearchAction potential, SiteNavigationElement listing all categories | src/app/page.tsx | 5 | 2 |
| 10 | Extract health calculators — move bmi, calories, tdee, bmr, macro, body-fat, ideal-weight, protein, ovulation, due-date, pregnancy, sleep calculation logic from calculator-engine.ts into src/lib/calculators/health.ts. Export calculateHealth(type, input, method) function. Keep same CalculatorOutput return type | src/lib/calculators/health.ts | - | 3 |
| 11 | Extract finance calculators — move mortgage, loan, auto-loan, interest, compound, tip, salary, tax, inflation, budget, retirement, 401k, roi, amortization, debt-payoff into src/lib/calculators/finance.ts. Export calculateFinance(type, input, method) | src/lib/calculators/finance.ts | - | 3 |
| 12 | Extract math calculators — move percent, scientific, fraction, gpa, grade, quadratic, slope, std-dev, statistics, probability into src/lib/calculators/math.ts. Export calculateMath(type, input, method) | src/lib/calculators/math.ts | - | 3 |
| 13 | Extract datetime calculators — move age, date, time, hours, day-counter, timezone, timecard, countdown into src/lib/calculators/datetime.ts. Export calculateDateTime(type, input, method) | src/lib/calculators/datetime.ts | - | 3 |
| 14 | Extract remaining calculators — create src/lib/calculators/construction.ts (concrete, sqft, tile, paint, btu), education.ts (final-grade, weighted-gpa, college-gpa, test-score, study-timer), fun.ts (love, random, dice, password, converter). Each exports calculate[Category](type, input, method) | src/lib/calculators/construction.ts, src/lib/calculators/education.ts, src/lib/calculators/fun.ts | - | 3 |
| 15 | Refactor calculator-engine.ts into router — keep type definitions (CalculatorInput, CalculatorOutput, CalculatorField) and getFields() function. Replace massive switch statement with category routing: import calculateHealth, calculateFinance, etc., delegate based on calculator category. Target: <200 lines | src/lib/calculator-engine.ts | 10-14 | 4 |
| 16 | Build verification — run npm run build, fix any import/type errors from the split. Ensure all 73 pages still generate. No @next/swc warnings | - | 1-15 | 5 |

<!-- EXECUTION_TASKS_END -->

---

## 5. Dependencies

```
Batch 1 (5 parallel tasks): 1, 2, 3, 4, 5
  └── All independent, no cross-dependencies

Batch 2 (4 parallel tasks): 6, 7, 8, 9
  └── All depend on task 5 (schema-generators.ts)

Batch 3 (5 parallel tasks): 10, 11, 12, 13, 14
  └── All independent engine extractions

Batch 4 (1 task): 15
  └── Depends on tasks 10-14 (all category modules exist)

Batch 5 (1 task): 16
  └── Depends on all previous tasks
```

Total: 5 batches, 16 tasks

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Removing esmExternals breaks mathjs/recharts imports | Medium | High | Test build immediately; fallback to serverExternalPackages: ['mathjs'] |
| Engine split introduces import errors | Low | Medium | Each split is pure extraction; build verify catches issues |
| JSON-LD markup invalid | Low | Low | Validate with Google Rich Results Test post-deploy |
| Favicon generation fails in automated env | Medium | Low | Use simple SVG placeholder; replace with designed icon later |
| Vercel build timeout (large project) | Low | Medium | standalone output already configured |

---

## 7. Verification Checklist

- [ ] `npm run build` passes with 0 errors, 0 @next/swc warnings
- [ ] All 73 pages generate successfully (or more with sitemap)
- [ ] `/sitemap.xml` accessible and contains all calculator URLs
- [ ] `/robots.txt` accessible with correct content
- [ ] Favicon visible in browser tab
- [ ] JSON-LD present on: homepage, category pages, calculator pages
- [ ] Google Rich Results Test shows valid structured data
- [ ] calculator-engine.ts is router-only (<200 lines)
- [ ] 7 category module files exist in src/lib/calculators/
- [ ] All files committed to git (clean working tree)
- [ ] Vercel deployment successful, site accessible

---

## Human Decisions

| Question | Answer |
|----------|--------|
| Scope | Full Phase 0 (SEO + split + deploy) |
| Domain | Vercel default for now |
| Approach | B: Complete Phase 0 |

---

## Next Step

```
claudikins-kernel:execute .claude/kernel-outlines/outline-calcmaster-phase0-ship-2026-02-17.md
```
