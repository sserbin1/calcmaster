# CalcMaster Grand Improvement Plan

**Created:** 2026-02-17
**Status:** Research Complete, Ready for Execution
**Scope:** From 60 calculators → 2,500+ state-specific pages + platform features

---

## Executive Summary

CalcMaster has a solid foundation: 60 working calculators, AI explanations, scientific methodologies, PDF export. But to compete with calculator.net (100M+ visits/mo), we need to stop being a "calculator collection" and become **"The Notion for Numbers"** — a relational platform where calculations connect, persist, and generate actionable insights.

**The Three Pillars:**
1. **State-Specific Programmatic SEO** — 2,500+ hyper-local calculator pages
2. **Platform Features** — Calculator Chaining, AI Analyst, B2B Widgets
3. **Infrastructure** — Deploy, sitemap, schema, tests, monetization

---

## Phase 0: Ship What We Have (1-2 days)

### 0.1 Complete Phase 2 Execution
- Execute pending `.claude/kernel-outlines/outline-calcmaster-phase2-2026-02-03.md`
- 54 tasks: methodology expansion, method switching integration, PDF, redirect API

### 0.2 Critical SEO Infrastructure
- [ ] `sitemap.xml` generation (Next.js dynamic sitemap)
- [ ] `robots.txt`
- [ ] JSON-LD Schema markup integration (WebApplication, FAQPage, HowTo, BreadcrumbList)
- [ ] Favicon, OG images, logo in `/public/`

### 0.3 Deploy to Production
- [ ] Vercel deploy with custom domain (calcmaster.io / icalc.io)
- [ ] Google Search Console setup
- [ ] Google Analytics 4 setup

### 0.4 Split calculator-engine.ts
- [ ] Move 2,785-line monolith to individual files per category
- [ ] Add smoke tests for each calculator

---

## Phase 1: State-Specific Calculators (2,500+ pages)

### Research Completed
- **51 brainstorm files** generated (50 states + DC)
- **Deep research report** (40K chars) with search volume data
- **Top 20 highest-value calculators** identified by Gemini Deep Research

### Architecture

```
URL Structure:
/states/
├── /california/
│   ├── /california-state-income-tax-calculator/
│   ├── /prop-13-property-tax-savings-calculator/
│   ├── /california-vs-texas-cost-of-living-calculator/
│   ├── /california-wildfire-risk-calculator/
│   └── ... (50 per state)
├── /texas/
│   ├── /texas-property-tax-calculator-by-county/
│   ├── /texas-homestead-exemption-savings-calculator/
│   └── ...
└── /[state-slug]/[calculator-slug]/
```

### Implementation Strategy

#### 1.1 Data Schema
```typescript
interface StateCalculator {
  stateSlug: string;        // "california"
  stateName: string;        // "California"
  calcSlug: string;         // "state-income-tax"
  title: string;            // "California State Income Tax Calculator 2026"
  category: string;         // "taxes" | "real-estate" | "cost-of-living" | etc.
  searchQuery: string;      // "california income tax calculator"
  description: string;
  fields: CalculatorField[];
  formula: (inputs: Record<string, number>) => CalculatorOutput;
  stateData: Record<string, any>; // Tax brackets, rates, etc.
  seo: {
    metaTitle: string;
    metaDescription: string;
    faqs: FAQ[];
    schema: SchemaOrg;
  };
}
```

#### 1.2 Common Calculator Templates (reusable across states)
Based on deep research, these 20 templates cover 80%+ of state ideas:

| # | Template | Applies To | State-Specific Variables |
|---|----------|-----------|------------------------|
| 1 | State Income Tax Calculator | 43 states (not AK,FL,NV,NH,SD,TN,TX,WA,WY) | Tax brackets, deductions, local taxes |
| 2 | Property Tax by County | All 50 | Mill rates, assessment ratios, exemptions |
| 3 | Cost of Living Comparison | All 50 | C2ER COLI data, rental prices, gas prices |
| 4 | Paycheck/Take-Home Pay | All 50 | State tax, FICA, local tax, deductions |
| 5 | Vehicle Registration Fee | All 50 | Weight/value formulas, county fees |
| 6 | Sales Tax by ZIP Code | 45 states (not AK,DE,MT,NH,OR) | State+county+city+district stacking |
| 7 | Homestead Exemption Savings | ~30 states | Exemption amounts, caps, formulas |
| 8 | LLC Formation Cost | All 50 | Filing fees, annual fees, franchise tax |
| 9 | Unemployment Benefits | All 50 | Base period, benefit formulas, max/min |
| 10 | Solar Panel Savings | All 50 | Irradiance, utility rates, state incentives |
| 11 | Closing Cost Estimator | All 50 | Transfer taxes, recording fees, customs |
| 12 | In-State vs Out-of-State Tuition | All 50 | Flagship university costs |
| 13 | Move/Relocation Calculator | Top 20 states | Tax delta, COL delta, moving costs |
| 14 | Hurricane/Tornado/Earthquake Risk | Disaster-prone states | FEMA data, historical frequency |
| 15 | Toll Road Cost Calculator | States with tollways | Route-specific toll tables |
| 16 | Commute Cost Calculator | Major metros | Gas, transit, parking, time value |
| 17 | Minimum Wage vs Living Wage | All 50 | MIT Living Wage data, state minimum |
| 18 | ACA/Health Insurance Subsidy | All 50 | FPL, SLCSP, state marketplace |
| 19 | Cannabis Tax Calculator | Legal states (~24) | Excise, cultivation, retail tax tiers |
| 20 | State-Specific Curiosity Calc | All 50 | Unique per state (water volume, etc.) |

#### 1.3 Batch Strategy
- **Batch 1** (High ROI): Templates 1-6 × Top 10 states by population = 60 pages
- **Batch 2**: Templates 1-6 × Next 15 states = 90 pages
- **Batch 3**: Templates 7-12 × All 50 states = 300 pages
- **Batch 4**: Templates 13-20 × applicable states = 200 pages
- **Batch 5**: State-unique calculators (from brainstorm files) = ~500 pages
- **Batch 6**: Remaining combinations = 1,350+ pages

### Data Sources Required
- IRS Publication 15 (federal withholding)
- State Departments of Revenue (tax brackets)
- County Assessor databases (property tax)
- BLS CPI data (cost of living)
- USGS streamflow data (water calculators)
- FEMA disaster data (risk calculators)
- State DMV fee schedules
- MIT Living Wage Calculator
- EIA electricity rates (solar calculators)
- NCCI class codes (workers comp)

---

## Phase 2: Platform Features ("10x" Differentiators)

### 2.1 Calculator Chaining (Workflow Engine)
**The killer feature nobody else has.**

Example chains:
- **Home Buyer**: Mortgage → Property Tax → Closing Costs → Monthly Budget → Savings Impact
- **Health Journey**: BMI → Calories → Macros → Protein → Sleep
- **Relocator**: Cost of Living Comparison → Tax Difference → Rent Affordability → Commute Cost
- **Entrepreneur**: LLC Cost → Salary Calculator → Tax Estimate → Retirement Planning

Implementation:
- Zustand global state for cross-calculator variables
- "Use this result in..." button on every calculator
- Pre-built chain templates (curated flows)
- Visual chain builder (drag & connect calculators)

### 2.2 AI Contextual Analyst (Beyond Explanations)
Current: AI explains the formula
**New**: AI interprets YOUR result with personalized advice

- "Your BMI is 28.3 — here's a 12-week plan to reach 24.9"
- "Your DTI is 45% — you're above the FHA limit. Here are 3 strategies..."
- "At this savings rate, you'll reach $1M in 2041. If you increase by $200/mo, you'd reach it in 2037."

### 2.3 B2B Embeddable Widgets
- iframe-ready calculator versions (strip header/footer)
- White-label option (custom colors, logo)
- Lead capture integration (user enters email to get PDF report)
- Pricing: Free with CalcMaster branding / $29/mo white-label

### 2.4 Shareable Result Cards ("Spotify Wrapped for Numbers")
- Beautiful, branded image cards for social sharing
- "I'll be a millionaire by 2034! Check your timeline at CalcMaster"
- "My California tax savings by moving to Texas: $14,200/year"
- html-to-image generation for Open Graph

### 2.5 PWA + Home Screen
- Service worker for offline support
- "Add to Home Screen" prompt
- Pin specific calculators as shortcuts
- Push notifications (mortgage rate alerts, etc.)

### 2.6 Scenario Modeling (Pro Feature)
- Compare 3-5 scenarios side by side
- "What if I put 10% down vs 20% vs 30%?"
- Visual comparison charts
- Save and share scenarios

---

## Phase 3: Monetization Strategy

### Revenue Model (NO Display Ads)

| Stream | Pricing | Target |
|--------|---------|--------|
| **B2C Freemium** | Free / $5/mo Pro | Save history, scenarios, PDF, no branding |
| **B2B Widgets** | $29/mo white-label | Real estate agents, financial advisors, fitness coaches |
| **B2B API** | $99/mo | Developers embedding calculators |
| **Lead Gen** | $50-100/lead | Mortgage, insurance, legal referrals |
| **Sponsored Calculators** | $500-2000/mo | Brands sponsoring specific calculators |

### Lead Gen High-Value Verticals
1. **Mortgage** → "Connect with a lender" ($50-100/lead)
2. **Insurance** → "Get a quote" ($20-50/lead)
3. **LLC Formation** → "File now with LegalZoom" (affiliate $30/signup)
4. **Solar** → "Get 3 free quotes" ($50-100/lead)
5. **Tax** → "Find a CPA" ($20-40/lead)

---

## Phase 4: Growth & SEO

### 4.1 Internal Linking Strategy
- Every calculator links to 5 related calculators
- State hub pages link to all state calculators
- Category hub pages link to all category calculators
- Calculator chains create natural internal link graphs

### 4.2 Schema Markup (Rich Snippets)
- WebApplication schema on every calculator
- FAQPage schema (5 FAQs per page)
- HowTo schema (step-by-step usage)
- BreadcrumbList schema
- State-specific LocalBusiness schema where applicable

### 4.3 Content Marketing
- Blog posts targeting "how to calculate [X] in [state]"
- Comparison guides ("Property Tax: Texas vs California")
- Annual reports ("2026 State Tax Calculator Rankings")
- Infographics for link building

### 4.4 Technical SEO
- Core Web Vitals optimization (already Next.js SSG)
- AMP pages for mobile (optional)
- hreflang for future i18n (Spanish market huge)

---

## Implementation Roadmap

### Week 1: Foundation
- [ ] Complete Phase 2 (kernel:execute)
- [ ] Add sitemap.xml, robots.txt
- [ ] Integrate JSON-LD schema
- [ ] Deploy to Vercel
- [ ] GSC + GA4 setup

### Week 2: State Calculator Templates
- [ ] Design state calculator data schema
- [ ] Build 6 core templates (income tax, property tax, COL, paycheck, vehicle reg, sales tax)
- [ ] Generate data for top 10 states
- [ ] Launch 60 state-specific pages

### Week 3: Scale State Pages
- [ ] Generate data for all 50 states (6 templates)
- [ ] Add templates 7-12 for top states
- [ ] Build state hub pages (/states/california/)
- [ ] Total: ~400 pages live

### Week 4: Platform Features
- [ ] Calculator Chaining MVP (3 preset chains)
- [ ] AI Contextual Analyst upgrade
- [ ] Shareable result cards

### Month 2: Scale & Monetize
- [ ] State-unique calculators (from brainstorm files)
- [ ] B2B widget system
- [ ] Pro subscription (Stripe)
- [ ] Lead gen integrations (mortgage, insurance)

### Month 3: Growth
- [ ] 2,000+ pages live
- [ ] Blog content (20 posts)
- [ ] Link building campaign
- [ ] Spanish language version

---

## Research Files Generated

| File | Description | Size |
|------|-------------|------|
| `deep-research-results.md` | Gemini Deep Research: search patterns, volumes, data sources | 40K chars |
| `california-calculators-brainstorm.md` | 50 CA-specific calculator ideas | 8K chars |
| `texas-calculators-brainstorm.md` | 50 TX-specific calculator ideas | 8.5K chars |
| `newyork-calculators-brainstorm.md` | 50 NY-specific calculator ideas | 8.3K chars |
| `florida-calculators-brainstorm.md` | 50 FL-specific calculator ideas | 8.5K chars |
| `all-50-states-overview.md` | Strategy framework for all states | 7.5K chars |
| `state-ideas/*.md` (47 files) | 50 ideas per state | ~7K each |
| **Total research** | **~400K characters of research** | |

---

## Success Metrics

| Metric | Current | 30-Day | 90-Day | 1-Year |
|--------|---------|--------|--------|--------|
| Calculator Pages | 60 | 400+ | 2,000+ | 3,000+ |
| Indexed Pages | 0 | 100+ | 1,000+ | 3,000+ |
| Monthly Traffic | 0 | 5K | 100K | 1M+ |
| Revenue (MRR) | $0 | $0 | $500 | $10K+ |
| Backlinks | 0 | 50 | 500 | 5,000 |

---

## Next Action

Run: `/claudikins-kernel:outline` with Phase 0 (deploy) + Phase 1 Batch 1 (60 state pages) as the first execution plan.
