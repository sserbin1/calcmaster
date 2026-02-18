const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));

function findCalc(slug) { return d.calculators.find(c => c.slug === slug); }

// #46 health-insurance-new-york
let c = findCalc('health-insurance-new-york');
c.stateData.customCalc = 'ny-health-insurance';
c.fields = [
  { name: 'age', label: 'Your Age', type: 'number', default: 35, min: 18, max: 64 },
  { name: 'planType', label: 'Plan Tier', type: 'select', options: [
    { value: 'bronze', label: 'Bronze (60/40)' }, { value: 'silver', label: 'Silver (70/30)' },
    { value: 'gold', label: 'Gold (80/20)' }, { value: 'platinum', label: 'Platinum (90/10)' },
  ], default: 'silver' },
  { name: 'householdSize', label: 'Household Size', type: 'select', options: [
    { value: '1', label: 'Individual' }, { value: '2', label: 'Couple' },
    { value: '3', label: 'Family (3)' }, { value: '4', label: 'Family (4+)' },
  ], default: '1' },
  { name: 'income', label: 'Household Income ($)', type: 'number', default: 50000, min: 0 },
  { name: 'smoker', label: 'Tobacco User?', type: 'radio', options: [
    { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes (No surcharge in NY!)' },
  ], default: 'no' },
];

// #47 suny-cuny-tuition-new-york
c = findCalc('suny-cuny-tuition-new-york');
c.stateData.customCalc = 'ny-suny-cuny';
c.fields = [
  { name: 'system', label: 'School System', type: 'select', options: [
    { value: 'suny_4yr', label: 'SUNY 4-Year' }, { value: 'suny_2yr', label: 'SUNY Community College' },
    { value: 'cuny_4yr', label: 'CUNY Senior College' }, { value: 'cuny_2yr', label: 'CUNY Community College' },
  ], default: 'suny_4yr' },
  { name: 'residency', label: 'Residency', type: 'radio', options: [
    { value: 'in_state', label: 'NY Resident' }, { value: 'out_state', label: 'Out-of-State' },
  ], default: 'in_state' },
  { name: 'householdIncome', label: 'Household Income ($)', type: 'number', default: 90000, min: 0 },
  { name: 'livingArrangement', label: 'Living Arrangement', type: 'select', options: [
    { value: 'on_campus', label: 'On Campus' }, { value: 'off_campus', label: 'Off Campus' },
    { value: 'commuter', label: 'Commuter (Living at Home)' },
  ], default: 'on_campus' },
];

// #48 solar-nyserda-new-york
c = findCalc('solar-nyserda-new-york');
c.stateData.customCalc = 'ny-solar-nyserda';
c.fields = [
  { name: 'systemSize', label: 'System Size (kW)', type: 'number', default: 8, min: 2, max: 25 },
  { name: 'monthlyBill', label: 'Monthly Electric Bill ($)', type: 'number', default: 180, min: 0 },
  { name: 'region', label: 'Region', type: 'select', options: [
    { value: 'downstate', label: 'Downstate (ConEd)' },
    { value: 'upstate', label: 'Upstate (National Grid/RG&E)' },
    { value: 'long_island', label: 'Long Island (PSEG LI)' },
  ], default: 'downstate' },
  { name: 'roofType', label: 'Property Type', type: 'radio', options: [
    { value: 'owned', label: 'Own Home (Rooftop)' }, { value: 'rented', label: 'Renter (Community Solar)' },
  ], default: 'owned' },
];

// #49 ev-drive-clean-new-york
c = findCalc('ev-drive-clean-new-york');
c.stateData.customCalc = 'ny-ev-drive-clean';
c.fields = [
  { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: [
    { value: 'new_ev', label: 'New Battery EV' }, { value: 'new_phev', label: 'New Plug-In Hybrid' },
    { value: 'used_ev', label: 'Used EV' },
  ], default: 'new_ev' },
  { name: 'msrp', label: 'Vehicle MSRP ($)', type: 'number', default: 45000, min: 0 },
  { name: 'annualMiles', label: 'Annual Miles', type: 'number', default: 12000, min: 0, max: 50000 },
  { name: 'electricRate', label: 'Electric Rate ($/kWh)', type: 'select', options: [
    { value: '0.20', label: '$0.20 (Upstate)' }, { value: '0.25', label: '$0.25 (Average)' },
    { value: '0.28', label: '$0.28 (ConEd NYC)' }, { value: '0.30', label: '$0.30 (High)' },
  ], default: '0.25' },
];

// #50 broadway-budget-new-york
c = findCalc('broadway-budget-new-york');
c.stateData.customCalc = 'ny-broadway-budget';
c.fields = [
  { name: 'showType', label: 'Show Type', type: 'select', options: [
    { value: 'musical', label: 'Musical' }, { value: 'play', label: 'Play' },
    { value: 'offbroadway', label: 'Off-Broadway' }, { value: 'special', label: 'Hit/Special Show' },
  ], default: 'musical' },
  { name: 'purchaseMethod', label: 'Purchase Method', type: 'select', options: [
    { value: 'tkts', label: 'TKTS Booth (25-50% off)' }, { value: 'advance', label: 'Advance Online' },
    { value: 'premium', label: 'Premium/VIP' }, { value: 'lottery', label: 'Digital Lottery ($30-40)' },
    { value: 'rush', label: 'Rush Tickets (Day-of)' },
  ], default: 'tkts' },
  { name: 'seats', label: 'Number of Tickets', type: 'select', options: [
    { value: '1', label: '1' }, { value: '2', label: '2' },
    { value: '3', label: '3' }, { value: '4', label: '4' },
  ], default: '2' },
  { name: 'includesDinner', label: 'Include Dinner?', type: 'radio', options: [
    { value: 'yes', label: 'Yes (Theater District)' }, { value: 'no', label: 'No (Show Only)' },
  ], default: 'yes' },
];

fs.writeFileSync('./src/data/states/new-york.json', JSON.stringify(d, null, 2));
console.log('Done: Updated 5 education/energy/tourism calculators with fields + customCalc');

// Verify
const d2 = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));
const withFields = d2.calculators.filter(c => c.fields && c.fields.length > 0);
const withCustom = d2.calculators.filter(c => c.stateData && c.stateData.customCalc);
console.log('Total calcs with fields:', withFields.length);
console.log('Total calcs with customCalc:', withCustom.length);
