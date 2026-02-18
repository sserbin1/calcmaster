const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));

function findCalc(slug) { return d.calculators.find(c => c.slug === slug); }

// #31 cost-of-living-new-york
let c = findCalc('cost-of-living-new-york');
c.stateData.customCalc = 'ny-cost-of-living';
c.fields = [
  { name: 'annualIncome', label: 'Annual Income ($)', type: 'number', default: 80000, min: 0 },
  { name: 'borough', label: 'Borough', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' },
  ], default: 'manhattan' },
  { name: 'householdSize', label: 'Household Size', type: 'select', options: [
    { value: '1', label: 'Single' }, { value: '2', label: 'Couple' },
    { value: '3', label: 'Family (3)' }, { value: '4', label: 'Family (4+)' },
  ], default: '1' },
];

// #32 bodega-grocery-new-york
c = findCalc('bodega-grocery-new-york');
c.stateData.customCalc = 'ny-bodega-grocery';
c.fields = [
  { name: 'weeklyGroceries', label: 'Weekly Grocery Budget ($)', type: 'number', default: 150, min: 0 },
  { name: 'bodegaPct', label: 'Bodega Shopping (%)', type: 'select', options: [
    { value: '10', label: '10% (Rare)' }, { value: '30', label: '30% (Sometimes)' },
    { value: '50', label: '50% (Often)' }, { value: '70', label: '70% (Most shopping)' },
  ], default: '30' },
  { name: 'dietType', label: 'Diet Type', type: 'select', options: [
    { value: 'budget', label: 'Budget' }, { value: 'moderate', label: 'Moderate' },
    { value: 'organic', label: 'Organic' }, { value: 'premium', label: 'Premium' },
  ], default: 'moderate' },
  { name: 'householdSize', label: 'Household Size', type: 'select', options: [
    { value: '1', label: '1 Person' }, { value: '2', label: '2 People' },
    { value: '3', label: '3 People' }, { value: '4', label: '4+ People' },
  ], default: '1' },
];

// #33 coned-bill-new-york
c = findCalc('coned-bill-new-york');
c.stateData.customCalc = 'ny-coned-bill';
c.fields = [
  { name: 'apartmentSize', label: 'Apartment Size', type: 'select', options: [
    { value: 'studio', label: 'Studio' }, { value: '1br', label: '1 Bedroom' },
    { value: '2br', label: '2 Bedroom' }, { value: '3br', label: '3 Bedroom' },
  ], default: '1br' },
  { name: 'acUsage', label: 'AC Usage', type: 'select', options: [
    { value: 'none', label: 'No AC' }, { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' }, { value: 'heavy', label: 'Heavy (24/7)' },
  ], default: 'moderate' },
  { name: 'season', label: 'Season', type: 'select', options: [
    { value: 'summer', label: 'Summer' }, { value: 'winter', label: 'Winter' },
    { value: 'spring', label: 'Spring / Fall' },
  ], default: 'summer' },
  { name: 'hasGas', label: 'Gas Service?', type: 'radio', options: [
    { value: 'yes', label: 'Yes (Heat + Cooking)' }, { value: 'no', label: 'No (All Electric)' },
  ], default: 'yes' },
];

// #34 moving-to-nyc-new-york
c = findCalc('moving-to-nyc-new-york');
c.stateData.customCalc = 'ny-moving-to-nyc';
c.fields = [
  { name: 'movingFrom', label: 'Moving From', type: 'select', options: [
    { value: 'local_nyc', label: 'Within NYC' }, { value: 'tri_state', label: 'Tri-State Area' },
    { value: 'out_of_state', label: 'Out of State' }, { value: 'cross_country', label: 'Cross Country' },
  ], default: 'out_of_state' },
  { name: 'apartmentSize', label: 'Apartment Size', type: 'select', options: [
    { value: 'studio', label: 'Studio' }, { value: '1br', label: '1 Bedroom' },
    { value: '2br', label: '2 Bedroom' }, { value: '3br', label: '3 Bedroom' },
  ], default: '1br' },
  { name: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', default: 3000, min: 0 },
  { name: 'hasBroker', label: 'Using a Broker?', type: 'radio', options: [
    { value: 'yes', label: 'Yes (15% fee)' }, { value: 'no', label: 'No (No-Fee)' },
  ], default: 'yes' },
];

// #35 wedding-budget-new-york
c = findCalc('wedding-budget-new-york');
c.stateData.customCalc = 'ny-wedding-budget';
c.fields = [
  { name: 'guestCount', label: 'Guest Count', type: 'number', default: 120, min: 10, max: 500 },
  { name: 'venueType', label: 'Venue Location', type: 'select', options: [
    { value: 'city', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'hudson_valley', label: 'Hudson Valley' }, { value: 'long_island', label: 'Long Island' },
  ], default: 'city' },
  { name: 'tier', label: 'Budget Tier', type: 'select', options: [
    { value: 'budget', label: 'Budget ($30-50K)' }, { value: 'mid', label: 'Mid-Range ($50-100K)' },
    { value: 'luxury', label: 'Luxury ($100K+)' },
  ], default: 'mid' },
];

// #36 private-school-new-york
c = findCalc('private-school-new-york');
c.stateData.customCalc = 'ny-private-school';
c.fields = [
  { name: 'gradeLevel', label: 'Grade Level', type: 'select', options: [
    { value: 'pre_k', label: 'Pre-K' }, { value: 'elementary', label: 'Elementary (K-5)' },
    { value: 'middle', label: 'Middle School (6-8)' }, { value: 'high', label: 'High School (9-12)' },
  ], default: 'elementary' },
  { name: 'schoolTier', label: 'School Tier', type: 'select', options: [
    { value: 'budget', label: 'Budget ($18-35K)' }, { value: 'mid', label: 'Mid-Range ($40-55K)' },
    { value: 'elite', label: 'Elite ($55-62K+)' },
  ], default: 'mid' },
  { name: 'children', label: 'Number of Children', type: 'select', options: [
    { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
  ], default: '1' },
  { name: 'yearsRemaining', label: 'Years Until Graduation', type: 'number', default: 8, min: 1, max: 14 },
];

// #37 childcare-cost-new-york
c = findCalc('childcare-cost-new-york');
c.stateData.customCalc = 'ny-childcare-cost';
c.fields = [
  { name: 'careType', label: 'Care Type', type: 'select', options: [
    { value: 'daycare', label: 'Daycare Center' }, { value: 'nanny', label: 'Full-Time Nanny' },
    { value: 'nanny_share', label: 'Nanny Share' },
  ], default: 'daycare' },
  { name: 'childAge', label: 'Child Age', type: 'select', options: [
    { value: 'infant', label: 'Infant (0-1)' }, { value: 'toddler', label: 'Toddler (1-3)' },
    { value: 'preschool', label: 'Preschool (3-5)' },
  ], default: 'infant' },
  { name: 'borough', label: 'Borough', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' },
  ], default: 'manhattan' },
  { name: 'schedule', label: 'Schedule', type: 'radio', options: [
    { value: 'full', label: 'Full-Time' }, { value: 'part', label: 'Part-Time (60%)' },
  ], default: 'full' },
];

// #38 restaurant-tip-new-york
c = findCalc('restaurant-tip-new-york');
c.stateData.customCalc = 'ny-restaurant-tip';
c.fields = [
  { name: 'billAmount', label: 'Bill Amount ($)', type: 'number', default: 80, min: 0 },
  { name: 'serviceLevel', label: 'Service Level', type: 'select', options: [
    { value: 'poor', label: 'Poor' }, { value: 'fair', label: 'Fair' },
    { value: 'good', label: 'Good' }, { value: 'excellent', label: 'Excellent' },
  ], default: 'good' },
  { name: 'diningType', label: 'Dining Type', type: 'select', options: [
    { value: 'sit_down', label: 'Sit-Down Restaurant' }, { value: 'fast_casual', label: 'Fast Casual' },
    { value: 'delivery', label: 'Delivery' }, { value: 'bar', label: 'Bar / Drinks' },
    { value: 'coffee', label: 'Coffee Shop' },
  ], default: 'sit_down' },
  { name: 'groupSize', label: 'Group Size', type: 'select', options: [
    { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '4', label: '4' },
    { value: '6', label: '6+ (Auto-Gratuity)' },
  ], default: '2' },
];

// #39 lottery-tax-new-york
c = findCalc('lottery-tax-new-york');
c.stateData.customCalc = 'ny-lottery-tax';
c.fields = [
  { name: 'winnings', label: 'Lottery Jackpot ($)', type: 'number', default: 1000000, min: 0 },
  { name: 'paymentOption', label: 'Payment Option', type: 'radio', options: [
    { value: 'lump', label: 'Lump Sum (60%)' }, { value: 'annuity', label: 'Annuity (30 years)' },
  ], default: 'lump' },
  { name: 'nycResident', label: 'NYC Resident?', type: 'radio', options: [
    { value: 'yes', label: 'Yes (Triple Tax)' }, { value: 'no', label: 'No' },
  ], default: 'yes' },
];

// #40 child-support-new-york
c = findCalc('child-support-new-york');
c.stateData.customCalc = 'ny-child-support';
c.fields = [
  { name: 'payerIncome', label: 'Your Annual Income ($)', type: 'number', default: 80000, min: 0 },
  { name: 'otherIncome', label: "Other Parent's Income ($)", type: 'number', default: 50000, min: 0 },
  { name: 'children', label: 'Number of Children', type: 'select', options: [
    { value: '1', label: '1 Child' }, { value: '2', label: '2 Children' },
    { value: '3', label: '3 Children' }, { value: '4', label: '4 Children' },
  ], default: '1' },
  { name: 'custody', label: 'Custody Arrangement', type: 'radio', options: [
    { value: 'primary', label: 'Other Parent Primary' }, { value: 'shared', label: 'Shared (50/50)' },
  ], default: 'primary' },
];

fs.writeFileSync('./src/data/states/new-york.json', JSON.stringify(d, null, 2));
console.log('Done: Updated 10 cost-of-living calculators with fields + customCalc');

// Verify
const d2 = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));
const withFields = d2.calculators.filter(c => c.fields && c.fields.length > 0);
const withCustom = d2.calculators.filter(c => c.stateData && c.stateData.customCalc);
console.log('Total calcs with fields:', withFields.length);
console.log('Total calcs with customCalc:', withCustom.length);
