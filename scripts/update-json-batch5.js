const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));

function findCalc(slug) { return d.calculators.find(c => c.slug === slug); }

// #41 llc-publication-new-york
let c = findCalc('llc-publication-new-york');
c.stateData.customCalc = 'ny-llc-publication';
c.fields = [
  { name: 'county', label: 'County', type: 'select', options: [
    { value: 'new_york', label: 'New York (Manhattan)' }, { value: 'kings', label: 'Kings (Brooklyn)' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'richmond', label: 'Richmond (Staten Island)' }, { value: 'nassau', label: 'Nassau' },
    { value: 'suffolk', label: 'Suffolk' }, { value: 'westchester', label: 'Westchester' },
    { value: 'albany', label: 'Albany' }, { value: 'erie', label: 'Erie (Buffalo)' },
  ], default: 'new_york' },
  { name: 'entityType', label: 'Entity Type', type: 'radio', options: [
    { value: 'llc', label: 'LLC' }, { value: 'llp', label: 'LLP' },
  ], default: 'llc' },
  { name: 'useService', label: 'Publication Service?', type: 'radio', options: [
    { value: 'yes', label: 'Yes (Handles Everything)' }, { value: 'no', label: 'No (DIY)' },
  ], default: 'yes' },
];

// #42 business-registration-new-york
c = findCalc('business-registration-new-york');
c.stateData.customCalc = 'ny-business-reg';
c.fields = [
  { name: 'entityType', label: 'Entity Type', type: 'select', options: [
    { value: 'llc', label: 'LLC' }, { value: 'corp', label: 'Corporation' },
    { value: 'sole', label: 'Sole Proprietorship' }, { value: 'partnership', label: 'Partnership' },
  ], default: 'llc' },
  { name: 'hasEIN', label: 'Need EIN?', type: 'radio', options: [
    { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No (Already Have)' },
  ], default: 'yes' },
  { name: 'needsPermits', label: 'NYC Business Certificate?', type: 'radio', options: [
    { value: 'yes', label: 'Yes ($110)' }, { value: 'no', label: 'No (Outside NYC)' },
  ], default: 'yes' },
];

// #43 dmv-points-new-york
c = findCalc('dmv-points-new-york');
c.stateData.customCalc = 'ny-dmv-points';
c.fields = [
  { name: 'currentPoints', label: 'Current Points on License', type: 'number', default: 3, min: 0, max: 20 },
  { name: 'newViolation', label: 'New Violation', type: 'select', options: [
    { value: 'speeding_10', label: 'Speeding 1-10 MPH Over (3 pts)' },
    { value: 'speeding_15', label: 'Speeding 11-20 MPH Over (4 pts)' },
    { value: 'speeding_25', label: 'Speeding 21-30 MPH Over (6 pts)' },
    { value: 'speeding_40', label: 'Speeding 31-40 MPH Over (8 pts)' },
    { value: 'red_light', label: 'Red Light (3 pts)' },
    { value: 'cell_phone', label: 'Cell Phone Use (5 pts)' },
    { value: 'reckless', label: 'Reckless Driving (5 pts)' },
    { value: 'following', label: 'Following Too Closely (4 pts)' },
  ], default: 'speeding_15' },
  { name: 'hasDefensiveDriving', label: 'Defensive Driving Course?', type: 'radio', options: [
    { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes (-4 pts, 10% insurance discount)' },
  ], default: 'no' },
];

// #44 dui-penalty-new-york
c = findCalc('dui-penalty-new-york');
c.stateData.customCalc = 'ny-dui-penalty';
c.fields = [
  { name: 'offense', label: 'Offense', type: 'select', options: [
    { value: 'first', label: 'First Offense' }, { value: 'second', label: 'Second Offense (within 10yr)' },
    { value: 'third', label: 'Third Offense (Felony)' },
  ], default: 'first' },
  { name: 'bac', label: 'BAC Level', type: 'select', options: [
    { value: 'low', label: 'DWAI (0.05-0.07%)' }, { value: 'standard', label: 'DWI (0.08-0.17%)' },
    { value: 'aggravated', label: 'Aggravated DWI (0.18%+)' },
  ], default: 'standard' },
  { name: 'hasMinor', label: 'Minor in Vehicle?', type: 'radio', options: [
    { value: 'no', label: 'No' }, { value: 'yes', label: "Yes (Leandra's Law — Felony)" },
  ], default: 'no' },
];

// #45 traffic-fine-new-york
c = findCalc('traffic-fine-new-york');
c.stateData.customCalc = 'ny-traffic-fine';
c.fields = [
  { name: 'violationType', label: 'Violation Type', type: 'select', options: [
    { value: 'speed_camera', label: 'Speed Camera ($50)' },
    { value: 'red_light_camera', label: 'Red Light Camera ($50)' },
    { value: 'officer_speeding', label: 'Officer — Speeding' },
    { value: 'officer_red', label: 'Officer — Red Light' },
    { value: 'officer_phone', label: 'Officer — Cell Phone' },
    { value: 'bus_lane', label: 'Bus Lane Camera ($50)' },
  ], default: 'speed_camera' },
  { name: 'location', label: 'Location', type: 'radio', options: [
    { value: 'nyc', label: 'NYC (+NYC Surcharge)' }, { value: 'upstate', label: 'Upstate NY' },
  ], default: 'nyc' },
  { name: 'priorViolations', label: 'Prior Violations (18 months)', type: 'select', options: [
    { value: '0', label: 'None' }, { value: '1', label: '1 Prior' },
    { value: '2', label: '2 Prior' }, { value: '3', label: '3+ Prior' },
  ], default: '0' },
];

fs.writeFileSync('./src/data/states/new-york.json', JSON.stringify(d, null, 2));
console.log('Done: Updated 5 legal calculators with fields + customCalc');

// Verify
const d2 = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));
const withFields = d2.calculators.filter(c => c.fields && c.fields.length > 0);
const withCustom = d2.calculators.filter(c => c.stateData && c.stateData.customCalc);
console.log('Total calcs with fields:', withFields.length);
console.log('Total calcs with customCalc:', withCustom.length);
