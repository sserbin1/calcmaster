const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));

function findCalc(slug) { return d.calculators.find(c => c.slug === slug); }

// #23 mta-fare-calculator-new-york
let c = findCalc('mta-fare-calculator-new-york');
c.stateData.customCalc = 'ny-mta-fare';
c.fields = [
  { name: 'tripsPerWeek', label: 'Trips per Week', type: 'number', default: 10, min: 1, max: 50 },
  { name: 'fareType', label: 'Fare Method', type: 'select', options: [
    { value: 'omny', label: 'OMNY (Tap & Go)' }, { value: 'weekly', label: 'MetroCard Weekly' },
    { value: 'monthly', label: 'MetroCard Monthly' }, { value: 'payperride', label: 'Pay-Per-Ride' },
  ], default: 'omny' },
  { name: 'reducedFare', label: 'Reduced Fare?', type: 'radio', options: [
    { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes (Senior/Disabled)' },
  ], default: 'no' },
];

// #24 car-ownership-cost-new-york
c = findCalc('car-ownership-cost-new-york');
c.stateData.customCalc = 'ny-car-ownership';
c.fields = [
  { name: 'borough', label: 'Borough', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' },
  ], default: 'manhattan' },
  { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: [
    { value: 'economy', label: 'Economy' }, { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' }, { value: 'luxury', label: 'Luxury' },
  ], default: 'sedan' },
  { name: 'annualMiles', label: 'Annual Miles Driven', type: 'number', default: 8000, min: 0, max: 50000 },
  { name: 'parkingType', label: 'Parking', type: 'radio', options: [
    { value: 'garage', label: 'Garage' }, { value: 'street', label: 'Street (Free/ASP)' },
  ], default: 'garage' },
];

// #25 lirr-metro-north-new-york
c = findCalc('lirr-metro-north-new-york');
c.stateData.customCalc = 'ny-commuter-rail';
c.fields = [
  { name: 'railroad', label: 'Railroad', type: 'radio', options: [
    { value: 'lirr', label: 'LIRR' }, { value: 'metro_north', label: 'Metro-North' },
  ], default: 'lirr' },
  { name: 'zone', label: 'Zone', type: 'select', options: [
    { value: '1', label: 'Zone 1 (Closest)' }, { value: '3', label: 'Zone 3' },
    { value: '4', label: 'Zone 4' }, { value: '7', label: 'Zone 7' },
    { value: '9', label: 'Zone 9' }, { value: '12', label: 'Zone 12 (Far)' },
  ], default: '3' },
  { name: 'peakTravel', label: 'Travel Time', type: 'radio', options: [
    { value: 'peak', label: 'Peak' }, { value: 'offpeak', label: 'Off-Peak' },
  ], default: 'peak' },
  { name: 'daysPerWeek', label: 'Days per Week', type: 'select', options: [
    { value: '2', label: '2 days' }, { value: '3', label: '3 days' },
    { value: '4', label: '4 days' }, { value: '5', label: '5 days' },
  ], default: '5' },
];

// #26 bridge-tunnel-tolls-new-york
c = findCalc('bridge-tunnel-tolls-new-york');
c.stateData.customCalc = 'ny-bridge-tolls';
c.fields = [
  { name: 'crossing', label: 'Crossing', type: 'select', options: [
    { value: 'gwb', label: 'George Washington Bridge' }, { value: 'lincoln', label: 'Lincoln Tunnel' },
    { value: 'holland', label: 'Holland Tunnel' }, { value: 'verrazano', label: 'Verrazano-Narrows' },
    { value: 'triboro', label: 'RFK (Triboro) Bridge' }, { value: 'throgs_neck', label: 'Throgs Neck Bridge' },
    { value: 'bronx_whitestone', label: 'Bronx-Whitestone' }, { value: 'queens_midtown', label: 'Queens Midtown Tunnel' },
    { value: 'battery', label: 'Hugh L. Carey Tunnel' }, { value: 'henry_hudson', label: 'Henry Hudson Bridge' },
  ], default: 'lincoln' },
  { name: 'hasEZPass', label: 'E-ZPass?', type: 'radio', options: [
    { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No (Cash/Mail)' },
  ], default: 'yes' },
  { name: 'tripsPerMonth', label: 'Trips per Month', type: 'number', default: 20, min: 1, max: 100 },
  { name: 'vehicleType', label: 'Vehicle', type: 'select', options: [
    { value: 'car', label: 'Car / SUV' }, { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'truck_2axle', label: 'Truck (2 Axle)' }, { value: 'truck_3axle', label: 'Truck (3+ Axle)' },
  ], default: 'car' },
];

// #27 congestion-pricing-new-york
c = findCalc('congestion-pricing-new-york');
c.stateData.customCalc = 'ny-congestion-pricing';
c.fields = [
  { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: [
    { value: 'car', label: 'Car / SUV' }, { value: 'small_truck', label: 'Small Truck' },
    { value: 'large_truck', label: 'Large Truck / Bus' }, { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'taxi', label: 'Taxi (surcharge)' }, { value: 'rideshare', label: 'Rideshare (surcharge)' },
  ], default: 'car' },
  { name: 'tripFrequency', label: 'Trip Frequency', type: 'select', options: [
    { value: 'daily', label: 'Daily (22/mo)' }, { value: '3x_week', label: '3x/week' },
    { value: '2x_week', label: '2x/week' }, { value: 'weekly', label: 'Weekly' },
    { value: 'occasional', label: 'Occasional (2/mo)' },
  ], default: 'daily' },
  { name: 'hasEZPass', label: 'E-ZPass?', type: 'radio', options: [
    { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No (+50%)' },
  ], default: 'yes' },
  { name: 'timeOfDay', label: 'Time of Day', type: 'radio', options: [
    { value: 'peak', label: 'Peak (5AM-9PM)' }, { value: 'overnight', label: 'Overnight (75% off)' },
  ], default: 'peak' },
];

// #28 suburb-commute-new-york
c = findCalc('suburb-commute-new-york');
c.stateData.customCalc = 'ny-suburb-commute';
c.fields = [
  { name: 'suburb', label: 'Suburb', type: 'select', options: [
    { value: 'stamford', label: 'Stamford, CT' }, { value: 'white_plains', label: 'White Plains, NY' },
    { value: 'hoboken', label: 'Hoboken, NJ' }, { value: 'jersey_city', label: 'Jersey City, NJ' },
    { value: 'long_beach', label: 'Long Beach, LI' }, { value: 'new_rochelle', label: 'New Rochelle, NY' },
    { value: 'maplewood', label: 'Maplewood, NJ' }, { value: 'yonkers', label: 'Yonkers, NY' },
  ], default: 'stamford' },
  { name: 'householdIncome', label: 'Household Income ($)', type: 'number', default: 150000, min: 0 },
  { name: 'commuteMode', label: 'Commute Mode', type: 'radio', options: [
    { value: 'train', label: 'Train + Subway' }, { value: 'drive', label: 'Drive' },
  ], default: 'train' },
];

// #29 auto-insurance-new-york
c = findCalc('auto-insurance-new-york');
c.stateData.customCalc = 'ny-auto-insurance';
c.fields = [
  { name: 'borough', label: 'Location', type: 'select', options: [
    { value: 'manhattan', label: 'Manhattan' }, { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' }, { value: 'bronx', label: 'Bronx' },
    { value: 'staten_island', label: 'Staten Island' }, { value: 'nassau', label: 'Nassau County' },
    { value: 'westchester', label: 'Westchester' }, { value: 'suffolk', label: 'Suffolk County' },
  ], default: 'brooklyn' },
  { name: 'driverAge', label: 'Driver Age', type: 'number', default: 30, min: 16, max: 100 },
  { name: 'coverage', label: 'Coverage Level', type: 'select', options: [
    { value: 'minimum', label: 'NY Minimum (25/50/25)' }, { value: 'standard', label: 'Standard (100/300/100)' },
    { value: 'full', label: 'Full Coverage' }, { value: 'premium', label: 'Premium (Low Deductible)' },
  ], default: 'full' },
  { name: 'drivingRecord', label: 'Driving Record', type: 'select', options: [
    { value: 'clean', label: 'Clean (3+ years)' }, { value: 'minor', label: '1-2 Minor Tickets' },
    { value: 'accident', label: 'At-Fault Accident' }, { value: 'dui', label: 'DUI/DWI' },
  ], default: 'clean' },
  { name: 'vehicleType', label: 'Vehicle', type: 'select', options: [
    { value: 'economy', label: 'Economy' }, { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' }, { value: 'luxury', label: 'Luxury' }, { value: 'sports', label: 'Sports Car' },
  ], default: 'sedan' },
];

// #30 parking-garage-new-york
c = findCalc('parking-garage-new-york');
c.stateData.customCalc = 'ny-parking-garage';
c.fields = [
  { name: 'neighborhood', label: 'Neighborhood', type: 'select', options: [
    { value: 'midtown', label: 'Midtown Manhattan' }, { value: 'fidi', label: 'Financial District' },
    { value: 'upper_east', label: 'Upper East Side' }, { value: 'upper_west', label: 'Upper West Side' },
    { value: 'chelsea', label: 'Chelsea' }, { value: 'soho', label: 'SoHo / TriBeCa' },
    { value: 'east_village', label: 'East Village / LES' }, { value: 'brooklyn_heights', label: 'Brooklyn Heights' },
    { value: 'williamsburg', label: 'Williamsburg' }, { value: 'lic', label: 'Long Island City' },
    { value: 'astoria', label: 'Astoria' },
  ], default: 'midtown' },
  { name: 'parkingType', label: 'Parking Type', type: 'select', options: [
    { value: 'monthly', label: 'Monthly' }, { value: 'daily', label: 'Daily (22 days/mo)' },
    { value: 'hourly', label: 'Hourly (8hrs x 22 days)' },
  ], default: 'monthly' },
  { name: 'vehicleSize', label: 'Vehicle Size', type: 'select', options: [
    { value: 'compact', label: 'Compact (-15%)' }, { value: 'standard', label: 'Standard' },
    { value: 'suv', label: 'SUV (+20%)' }, { value: 'oversized', label: 'Oversized (+40%)' },
  ], default: 'standard' },
];

fs.writeFileSync('./src/data/states/new-york.json', JSON.stringify(d, null, 2));
console.log('Done: Updated 8 transport calculators with fields + customCalc');

// Verify
const d2 = JSON.parse(fs.readFileSync('./src/data/states/new-york.json', 'utf8'));
const withFields = d2.calculators.filter(c => c.fields && c.fields.length > 0);
const withCustom = d2.calculators.filter(c => c.stateData && c.stateData.customCalc);
console.log('Total calcs with fields:', withFields.length);
console.log('Total calcs with customCalc:', withCustom.length);
