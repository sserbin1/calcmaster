const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));

function findCalc(slug) { return d.calculators.find(c => c.slug === slug); }

// #11 mortgage-recording-tax-new-york
let c = findCalc('mortgage-recording-tax-new-york');
c.stateData.customCalc = 'ny-mortgage-recording-tax';
c.fields = [
  { name: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', default: 800000, min: 0 },
  { name: 'loanAmount', label: 'Loan Amount ($)', type: 'number', default: 640000, min: 0 },
  { name: 'borough', label: 'Borough / County', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' }, { value: 'nassau', label: 'Nassau County' },
    { value: 'westchester', label: 'Westchester' },
  ], default: 'manhattan' },
  { name: 'propertyType', label: 'Property Type', type: 'radio', options: [
    { value: 'condo', label: 'Condo' }, { value: 'coop', label: 'Co-op (Exempt)' },
    { value: 'house', label: 'House' },
  ], default: 'condo' },
];

// #12 rent-vs-buy-new-york
c = findCalc('rent-vs-buy-new-york');
c.stateData.customCalc = 'ny-rent-vs-buy';
c.fields = [
  { name: 'homePrice', label: 'Home Price ($)', type: 'number', default: 750000, min: 0 },
  { name: 'monthlyRent', label: 'Current Monthly Rent ($)', type: 'number', default: 3000, min: 0 },
  { name: 'downPayment', label: 'Down Payment (%)', type: 'number', default: 20, min: 0, max: 100 },
  { name: 'yearsToStay', label: 'Years You Plan to Stay', type: 'number', default: 7, min: 1, max: 30 },
  { name: 'borough', label: 'Borough', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' },
  ], default: 'brooklyn' },
];

// #13 mansion-tax-new-york
c = findCalc('mansion-tax-new-york');
c.stateData.customCalc = 'ny-mansion-tax';
c.fields = [
  { name: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', default: 2000000, min: 0 },
  { name: 'propertyType', label: 'Property Type', type: 'radio', options: [
    { value: 'condo', label: 'Condo' }, { value: 'coop', label: 'Co-op' }, { value: 'house', label: 'House' },
  ], default: 'condo' },
];

// #14 star-exemption-new-york
c = findCalc('star-exemption-new-york');
c.stateData.customCalc = 'ny-star-exemption';
c.fields = [
  { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: 400000, min: 0 },
  { name: 'householdIncome', label: 'Household Income ($)', type: 'number', default: 85000, min: 0 },
  { name: 'age', label: 'Homeowner Age', type: 'number', default: 45, min: 18, max: 100 },
  { name: 'county', label: 'County', type: 'select', options: [
    { value: 'nyc', label: 'NYC (5 boroughs)' }, { value: 'nassau', label: 'Nassau' },
    { value: 'westchester', label: 'Westchester' }, { value: 'suffolk', label: 'Suffolk' },
    { value: 'upstate', label: 'Upstate NY' },
  ], default: 'nyc' },
];

// #15 coop-affordability-new-york
c = findCalc('coop-affordability-new-york');
c.stateData.customCalc = 'ny-coop-affordability';
c.fields = [
  { name: 'annualIncome', label: 'Annual Household Income ($)', type: 'number', default: 150000, min: 0 },
  { name: 'monthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', default: 500, min: 0 },
  { name: 'savedForDown', label: 'Savings for Down Payment ($)', type: 'number', default: 200000, min: 0 },
  { name: 'targetBorough', label: 'Target Borough', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' },
  ], default: 'manhattan' },
];

// #16 40x-rent-rule-new-york
c = findCalc('40x-rent-rule-new-york');
c.stateData.customCalc = 'ny-40x-rent-rule';
c.fields = [
  { name: 'annualIncome', label: 'Annual Income ($)', type: 'number', default: 80000, min: 0 },
  { name: 'desiredRent', label: 'Desired Monthly Rent ($)', type: 'number', default: 2500, min: 0 },
  { name: 'needsGuarantor', label: 'Using a Guarantor?', type: 'radio', options: [
    { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' },
  ], default: 'no' },
];

// #17 down-payment-new-york
c = findCalc('down-payment-new-york');
c.stateData.customCalc = 'ny-down-payment';
c.fields = [
  { name: 'targetPrice', label: 'Target Purchase Price ($)', type: 'number', default: 700000, min: 0 },
  { name: 'propertyType', label: 'Property Type', type: 'radio', options: [
    { value: 'coop', label: 'Co-op (20% min)' }, { value: 'condo', label: 'Condo (10% min)' },
    { value: 'house', label: 'House (5% min)' },
  ], default: 'coop' },
  { name: 'monthlySavings', label: 'Monthly Savings ($)', type: 'number', default: 3000, min: 0 },
  { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', default: 50000, min: 0 },
];

// #18 home-equity-new-york
c = findCalc('home-equity-new-york');
c.stateData.customCalc = 'ny-home-equity';
c.fields = [
  { name: 'homeValue', label: 'Current Home Value ($)', type: 'number', default: 600000, min: 0 },
  { name: 'mortgageBalance', label: 'Mortgage Balance ($)', type: 'number', default: 350000, min: 0 },
  { name: 'loanType', label: 'Loan Type', type: 'radio', options: [
    { value: 'heloc', label: 'HELOC' }, { value: 'loan', label: 'Home Equity Loan' },
  ], default: 'heloc' },
];

// #19 refinance-new-york
c = findCalc('refinance-new-york');
c.stateData.customCalc = 'ny-refinance';
c.fields = [
  { name: 'currentBalance', label: 'Current Loan Balance ($)', type: 'number', default: 400000, min: 0 },
  { name: 'currentRate', label: 'Current Interest Rate (%)', type: 'number', default: 7.0, step: 0.1 },
  { name: 'newRate', label: 'New Interest Rate (%)', type: 'number', default: 6.0, step: 0.1 },
  { name: 'remainingYears', label: 'Remaining Term (years)', type: 'number', default: 25, min: 1, max: 30 },
  { name: 'isCEMA', label: 'Use CEMA (save on MRT)?', type: 'radio', options: [
    { value: 'yes', label: 'Yes (Recommended)' }, { value: 'no', label: 'No' },
  ], default: 'yes' },
];

// #20 adu-roi-new-york
c = findCalc('adu-roi-new-york');
c.stateData.customCalc = 'ny-adu-roi';
c.fields = [
  { name: 'buildCost', label: 'ADU Build Cost ($)', type: 'number', default: 200000, min: 0 },
  { name: 'expectedRent', label: 'Expected Monthly Rent ($)', type: 'number', default: 2000, min: 0 },
  { name: 'homeValue', label: 'Current Home Value ($)', type: 'number', default: 500000, min: 0 },
  { name: 'location', label: 'Location', type: 'select', options: [
    { value: 'nyc', label: 'NYC' }, { value: 'nassau', label: 'Nassau/Suffolk' },
    { value: 'westchester', label: 'Westchester' }, { value: 'upstate', label: 'Upstate' },
  ], default: 'nyc' },
];

// #21 rent-stabilization-new-york
c = findCalc('rent-stabilization-new-york');
c.stateData.customCalc = 'ny-rent-stabilization';
c.fields = [
  { name: 'currentRent', label: 'Current Monthly Rent ($)', type: 'number', default: 1800, min: 0 },
  { name: 'leaseType', label: 'Lease Type', type: 'radio', options: [
    { value: '1year', label: '1-Year Lease' }, { value: '2year', label: '2-Year Lease' },
  ], default: '1year' },
  { name: 'yearsProjection', label: 'Years to Project', type: 'select', options: [
    { value: '3', label: '3 Years' }, { value: '5', label: '5 Years' },
    { value: '10', label: '10 Years' }, { value: '15', label: '15 Years' },
  ], default: '5' },
];

// #22 coop-flip-tax-new-york
c = findCalc('coop-flip-tax-new-york');
c.stateData.customCalc = 'ny-coop-flip-tax';
c.fields = [
  { name: 'salePrice', label: 'Sale Price ($)', type: 'number', default: 800000, min: 0 },
  { name: 'purchasePrice', label: 'Original Purchase Price ($)', type: 'number', default: 600000, min: 0 },
  { name: 'flipTaxType', label: 'Flip Tax Calculation', type: 'radio', options: [
    { value: 'price', label: '% of Sale Price' }, { value: 'profit', label: '% of Profit' },
  ], default: 'price' },
];

fs.writeFileSync('./src/data/states/new-york.json', JSON.stringify(d, null, 2));
console.log('Done: Updated 12 housing calculators with fields + customCalc');

// Verify
const d2 = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));
const withFields = d2.calculators.filter(c => c.fields && c.fields.length > 0);
const withCustom = d2.calculators.filter(c => c.stateData && c.stateData.customCalc);
console.log('Total calcs with fields:', withFields.length);
console.log('Total calcs with customCalc:', withCustom.length);
