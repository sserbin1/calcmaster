# CalcMaster — State Calculator Development Plan

## Overview
Programmatic SEO project: 50 unique calculators per US state, each with custom fields, real calculations, rich output, hero images, and infographics.

## Target States
| # | State | Calcs | Status |
|---|-------|-------|--------|
| 1 | New York | 50 | IN PROGRESS |
| 2 | California | 50 | Not started |
| 3 | Texas | 50 | Not started |
| 4 | Florida | 50 | Not started |

## Pipeline per Calculator (checklist)

Each calculator goes through these 6 steps:

### Step 1: Custom Fields (`fields` in JSON)
**File:** `src/data/states/{state}.json`

Each calculator gets unique input fields specific to the topic. Example:
- `mortgage-recording-tax-new-york` → Purchase Price, Borough, Loan Amount, Property Type
- `congestion-pricing-new-york` → Vehicle Type, Trip Frequency, E-ZPass, Time of Day

### Step 2: Custom Calculation (`customCalc` in state-*.ts)
**Files:** `src/lib/calculators/state-finance.ts`, `state-housing.ts`, `state-cost-of-living.ts`, `state-legal.ts`, `state-specific.ts`, `state-education.ts`, `state-employment.ts`, `state-insurance.ts`

Real formulas with real rates/data. Route via `stateData.customCalc` field in JSON.

### Step 3: Rich Output
Each calculation returns:
- `primary` — main result number
- `secondary[]` — 4-8 supporting metrics
- `breakdown[]` — with colors for pie chart
- `chartData[]` — for bar/comparison chart
- `schedule` — table (bracket schedule, comparison, amortization) where relevant
- `advice` — contextual insight text

### Step 4: Unique SEO Text (already done for NY)
**File:** `src/data/states/{state}.json`
- `heroTitle`, `heroSubtitle` — page header
- `introText` — unique 3-5 sentence intro referencing real laws/programs
- `faqs[]` — 5 unique FAQs per calculator
- `benefits[]` — 3-4 benefit cards
- `formula` — human-readable formula text
- `primaryKeyword`, `secondaryKeywords` — SEO targeting

### Step 5: Hero Image (priority calculators)
**Files:** `public/images/{state}/` + `page.tsx` (make dynamic via JSON `heroImage` field)
- Generate via Gemini API
- Optimize with sharp (1200x670, JPEG quality 80, <100KB)
- Themed: state landmarks + calculator topic elements
- Priority: top-20 by search volume per state

### Step 6: Thematic Infographic
**Files:** `src/components/charts/` — category-specific components

| Component | For Categories | Visualizations |
|-----------|---------------|----------------|
| `TaxInfographic` (exists) | Tax/Finance | Treemap, Donut, Waterfall, Rate meters, Quick stats |
| `HousingInfographic` (new) | Housing | Borough comparison, Affordability gauge, Cost breakdown |
| `TransportInfographic` (new) | Transport | Mode comparison, Cost per trip, Annual savings |
| `CostOfLivingInfographic` (new) | Cost of Living | Budget donut, NYC vs National comparison |
| `LegalInfographic` (new) | Legal | Fee breakdown, Penalty escalation, County comparison |
| `EducationEnergyInfographic` (new) | Education/Energy | ROI payback, Savings projection, Cost comparison |

Route via `result.infographicType` field or conditional rendering in GenericCalculator.

---

## NY Calculator Categories (50 total)

### A. Income & Taxation (10) — Batch 1
| # | Slug | Custom Calc | Status |
|---|------|-------------|--------|
| 1 | income-tax-new-york | nyc-triple-tax | DONE (POC) |
| 2 | property-tax-new-york | ny-property-tax | DONE |
| 3 | sales-tax-new-york | ny-sales-tax | DONE |
| 4 | wall-street-bonus-tax-new-york | wall-street-bonus | DONE |
| 5 | estate-tax-new-york | ny-estate-tax | DONE |
| 6 | nyc-vs-yonkers-tax-new-york | nyc-vs-yonkers | DONE |
| 7 | freelancer-ubt-new-york | freelancer-ubt | DONE |
| 8 | retirement-tax-new-york | ny-retirement-tax | DONE |
| 9 | commuter-tax-new-york | commuter-tax | DONE |
| 10 | nanny-tax-new-york | nanny-tax | DONE |

### B. Housing & Real Estate (12) — Batch 2
| # | Slug | Custom Calc | Status |
|---|------|-------------|--------|
| 11 | mortgage-recording-tax-new-york | ny-mortgage-recording-tax | DONE |
| 12 | rent-vs-buy-new-york | ny-rent-vs-buy | DONE |
| 13 | mansion-tax-new-york | ny-mansion-tax | DONE |
| 14 | star-exemption-new-york | ny-star-exemption | DONE |
| 15 | coop-affordability-new-york | ny-coop-affordability | DONE |
| 16 | 40x-rent-rule-new-york | ny-40x-rent-rule | DONE |
| 17 | down-payment-new-york | ny-down-payment | DONE |
| 18 | home-equity-new-york | ny-home-equity | DONE |
| 19 | refinance-new-york | ny-refinance | DONE |
| 20 | adu-roi-new-york | ny-adu-roi | DONE |
| 21 | rent-stabilization-new-york | ny-rent-stabilization | DONE |
| 22 | coop-flip-tax-new-york | ny-coop-flip-tax | DONE |

### C. Transportation & Commuting (8) — Batch 3
| # | Slug | Custom Calc | Status |
|---|------|-------------|--------|
| 23 | mta-fare-calculator-new-york | ny-mta-fare | TODO |
| 24 | car-ownership-cost-new-york | ny-car-ownership | TODO |
| 25 | lirr-metro-north-new-york | ny-commuter-rail | TODO |
| 26 | bridge-tunnel-tolls-new-york | ny-bridge-tolls | TODO |
| 27 | congestion-pricing-new-york | ny-congestion-pricing | TODO |
| 28 | suburb-commute-new-york | ny-suburb-commute | TODO |
| 29 | auto-insurance-new-york | ny-auto-insurance | TODO |
| 30 | parking-garage-new-york | ny-parking-garage | TODO |

### D. Cost of Living & Lifestyle (10) — Batch 4
| # | Slug | Custom Calc | Status |
|---|------|-------------|--------|
| 31 | cost-of-living-new-york | ny-cost-of-living | TODO |
| 32 | bodega-grocery-new-york | ny-bodega-grocery | TODO |
| 33 | coned-bill-new-york | ny-coned-bill | TODO |
| 34 | moving-to-nyc-new-york | ny-moving-to-nyc | TODO |
| 35 | wedding-budget-new-york | ny-wedding-budget | TODO |
| 36 | private-school-new-york | ny-private-school | TODO |
| 37 | childcare-cost-new-york | ny-childcare-cost | TODO |
| 38 | restaurant-tip-new-york | ny-restaurant-tip | TODO |
| 39 | lottery-tax-new-york | ny-lottery-tax | TODO |
| 40 | child-support-new-york | ny-child-support | TODO |

### E. Business & Legal (5) — Batch 5
| # | Slug | Custom Calc | Status |
|---|------|-------------|--------|
| 41 | llc-publication-new-york | ny-llc-publication | TODO |
| 42 | business-registration-new-york | ny-business-reg | TODO |
| 43 | dmv-points-new-york | ny-dmv-points | TODO |
| 44 | dui-penalty-new-york | ny-dui-penalty | TODO |
| 45 | traffic-fine-new-york | ny-traffic-fine | TODO |

### F. Education, Energy & Tourism (5) — Batch 6
| # | Slug | Custom Calc | Status |
|---|------|-------------|--------|
| 46 | health-insurance-new-york | ny-health-insurance | TODO |
| 47 | suny-cuny-tuition-new-york | ny-suny-cuny | TODO |
| 48 | solar-nyserda-new-york | ny-solar-nyserda | TODO |
| 49 | ev-drive-clean-new-york | ny-ev-drive-clean | TODO |
| 50 | broadway-budget-new-york | ny-broadway-budget | TODO |

---

## Architecture Overview

### Files per state
- `src/data/states/{state}.json` — 50 calculators with fields, stateData, SEO text
- `src/lib/calculators/state-*.ts` — calculation functions per category
- `public/images/{state}/` — hero images

### Routing
```
JSON: stateData.customCalc = "ny-mortgage-recording-tax"
  → state-router.ts routes to state-housing.ts
    → calculateStateHousing() checks customCalc
      → calls calcMortgageRecordingTax()
        → returns rich CalculatorOutput
```

### SSR Pre-computation
Server (page.tsx) builds default inputs from field defaults → calls calculate() → passes initialResult + initialExplanation as props → Google Bot sees full results without JS.

### Design System
- Glassmorphism + Navy (#0F172A, #1E3A8A) + Gold (#CA8A04)
- Poppins (headings) + Open Sans (body)
- Glass cards, mesh gradient background
- Dark mode via CSS variables

### Build Command
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Generic calculators (mortgage, BMI, etc.)
NOT touched. They have their own calculation engine. State calculators are completely separate.

---

## Development Order
1. Custom fields + calculations for all 50 NY calcs (batches 1-6)
2. Infographic components (5 new components)
3. Dynamic hero image system + generate top-20 images
4. Build + verify all 50 NY pages
5. Repeat for California (50 unique calcs)
6. Repeat for Texas (50 unique calcs)
7. Repeat for Florida (50 unique calcs)
8. Final build (400+ pages) + deploy
