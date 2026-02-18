const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));

function findCalc(slug) { return d.calculators.find(c => c.slug === slug); }

// #2 property-tax-new-york
let c = findCalc('property-tax-new-york');
c.stateData.customCalc = 'ny-property-tax';
c.fields = [
  { name: 'homeValue', label: 'Home Value ($)', type: 'number', default: 500000, min: 0 },
  { name: 'borough', label: 'Location', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' }, { value: 'nassau', label: 'Nassau County' },
    { value: 'westchester', label: 'Westchester' }, { value: 'suffolk', label: 'Suffolk County' },
    { value: 'upstate', label: 'Upstate NY' }
  ], default: 'manhattan' },
  { name: 'propertyClass', label: 'Property Class', type: 'radio', options: [
    { value: 'class1', label: '1-3 Family Home' }, { value: 'class2', label: 'Co-op / Condo' }
  ], default: 'class1' },
  { name: 'starProgram', label: 'STAR Program', type: 'select', options: [
    { value: 'none', label: 'Not Enrolled' }, { value: 'basic', label: 'Basic STAR' },
    { value: 'enhanced', label: 'Enhanced STAR (65+)' }
  ], default: 'none' }
];

// #3 sales-tax-new-york
c = findCalc('sales-tax-new-york');
c.stateData.customCalc = 'ny-sales-tax';
c.fields = [
  { name: 'purchaseAmount', label: 'Purchase Amount ($)', type: 'number', default: 500, min: 0 },
  { name: 'itemType', label: 'Item Type', type: 'select', options: [
    { value: 'general', label: 'General Merchandise' }, { value: 'clothing', label: 'Clothing / Footwear' },
    { value: 'electronics', label: 'Electronics' }, { value: 'groceries', label: 'Groceries (Unprepared)' },
    { value: 'prepared_food', label: 'Prepared Food' }, { value: 'prescription', label: 'Prescription Drugs' }
  ], default: 'general' },
  { name: 'location', label: 'Purchase Location', type: 'select', options: [
    { value: 'nyc', label: 'New York City (8.875%)' }, { value: 'westchester', label: 'Westchester (7.375%)' },
    { value: 'nassau', label: 'Nassau County (8.25%)' }, { value: 'suffolk', label: 'Suffolk County (8.25%)' },
    { value: 'albany', label: 'Albany (8%)' }, { value: 'buffalo', label: 'Buffalo (8%)' },
    { value: 'yonkers', label: 'Yonkers (5.5%)' }
  ], default: 'nyc' }
];

// #4 wall-street-bonus-tax-new-york
c = findCalc('wall-street-bonus-tax-new-york');
c.stateData.customCalc = 'wall-street-bonus';
c.fields = [
  { name: 'baseSalary', label: 'Base Salary ($)', type: 'number', default: 200000, min: 0 },
  { name: 'bonusAmount', label: 'Bonus / RSU Amount ($)', type: 'number', default: 300000, min: 0 },
  { name: 'compensationType', label: 'Compensation Type', type: 'radio', options: [
    { value: 'cash', label: 'Cash Bonus' }, { value: 'rsu', label: 'RSU / Equity' }
  ], default: 'cash' },
  { name: 'nycResident', label: 'NYC Resident?', type: 'radio', options: [
    { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }
  ], default: 'yes' }
];

// #5 estate-tax-new-york
c = findCalc('estate-tax-new-york');
c.stateData.customCalc = 'ny-estate-tax';
c.fields = [
  { name: 'estateValue', label: 'Total Estate Value ($)', type: 'number', default: 7000000, min: 0 },
  { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
    { value: 'single', label: 'Single / Unmarried' }, { value: 'married', label: 'Married' }
  ], default: 'single' },
  { name: 'hasSpouse', label: 'Passing to Surviving Spouse?', type: 'radio', options: [
    { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }
  ], default: 'no' }
];

// #6 nyc-vs-yonkers-tax-new-york
c = findCalc('nyc-vs-yonkers-tax-new-york');
c.stateData.customCalc = 'nyc-vs-yonkers';
c.fields = [
  { name: 'annualIncome', label: 'Annual Income ($)', type: 'number', default: 120000, min: 0 },
  { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
    { value: 'single', label: 'Single' }, { value: 'married', label: 'Married Filing Jointly' }
  ], default: 'single' },
  { name: 'currentLocation', label: 'Where Do You Live?', type: 'select', options: [
    { value: 'nyc', label: 'New York City' }, { value: 'yonkers', label: 'Yonkers' },
    { value: 'westchester', label: 'Westchester (other)' }, { value: 'nassau', label: 'Nassau / Suffolk' },
    { value: 'upstate', label: 'Upstate NY' }
  ], default: 'nyc' }
];

// #7 freelancer-ubt-new-york
c = findCalc('freelancer-ubt-new-york');
c.stateData.customCalc = 'freelancer-ubt';
c.fields = [
  { name: 'netEarnings', label: 'Gross Freelance Income ($)', type: 'number', default: 100000, min: 0 },
  { name: 'businessExpenses', label: 'Business Expenses ($)', type: 'number', default: 15000, min: 0 },
  { name: 'nycBased', label: 'NYC Based?', type: 'radio', options: [
    { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }
  ], default: 'yes' },
  { name: 'businessType', label: 'Business Structure', type: 'select', options: [
    { value: 'sole_prop', label: 'Sole Proprietorship' }, { value: 'llc', label: 'Single-Member LLC' },
    { value: 'scorp', label: 'S-Corporation' }
  ], default: 'sole_prop' }
];

// #8 retirement-tax-new-york
c = findCalc('retirement-tax-new-york');
c.stateData.customCalc = 'ny-retirement-tax';
c.fields = [
  { name: 'retirementIncome', label: 'Annual Retirement Income ($)', type: 'number', default: 60000, min: 0 },
  { name: 'incomeSource', label: 'Income Source', type: 'select', options: [
    { value: 'social-security', label: 'Social Security' }, { value: 'pension', label: 'Private Pension' },
    { value: 'gov-pension', label: 'Government Pension (NYS/Federal)' }, { value: '401k', label: '401(k) / IRA Withdrawal' }
  ], default: '401k' },
  { name: 'age', label: 'Your Age', type: 'number', default: 67, min: 18, max: 100 },
  { name: 'filingStatus', label: 'Filing Status', type: 'select', options: [
    { value: 'single', label: 'Single' }, { value: 'married', label: 'Married Filing Jointly' }
  ], default: 'single' }
];

// #9 commuter-tax-new-york
c = findCalc('commuter-tax-new-york');
c.stateData.customCalc = 'commuter-tax';
c.fields = [
  { name: 'annualSalary', label: 'Annual Salary ($)', type: 'number', default: 120000, min: 0 },
  { name: 'residenceState', label: 'Home State', type: 'select', options: [
    { value: 'nj', label: 'New Jersey' }, { value: 'ct', label: 'Connecticut' },
    { value: 'pa', label: 'Pennsylvania' }, { value: 'none', label: 'Other / No-Tax State' }
  ], default: 'nj' },
  { name: 'workLocation', label: 'Work Location', type: 'select', options: [
    { value: 'nyc', label: 'New York City' }, { value: 'westchester', label: 'Westchester' },
    { value: 'nassau', label: 'Long Island' }
  ], default: 'nyc' },
  { name: 'daysInOffice', label: 'Office Days per Week', type: 'select', options: [
    { value: '1', label: '1 day' }, { value: '2', label: '2 days' }, { value: '3', label: '3 days' },
    { value: '4', label: '4 days' }, { value: '5', label: '5 days (full-time)' }
  ], default: '3' }
];

// #10 nanny-tax-new-york
c = findCalc('nanny-tax-new-york');
c.stateData.customCalc = 'nanny-tax';
c.fields = [
  { name: 'annualWage', label: 'Annual Nanny Wage ($)', type: 'number', default: 45000, min: 0 },
  { name: 'weeklyHours', label: 'Hours per Week', type: 'number', default: 40, min: 1, max: 80 },
  { name: 'provideBenefits', label: 'Benefits Package', type: 'select', options: [
    { value: 'none', label: 'No Benefits' }, { value: 'basic', label: 'Basic (PTO + Sick)' },
    { value: 'full', label: 'Full (PTO + Health + Bonus)' }
  ], default: 'basic' }
];

fs.writeFileSync('./src/data/states/new-york.json', JSON.stringify(d, null, 2));
console.log('Done: Updated 9 calculators with fields + customCalc');

// Verify
const d2 = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));
const withFields = d2.calculators.filter(c => c.fields && c.fields.length > 0);
const withCustom = d2.calculators.filter(c => c.stateData && c.stateData.customCalc);
console.log('Calcs with fields:', withFields.length, withFields.map(c => c.slug));
console.log('Calcs with customCalc:', withCustom.length, withCustom.map(c => c.slug + '->' + c.stateData.customCalc));
