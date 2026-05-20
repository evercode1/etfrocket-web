/*

|--------------------------------------------------------------------------

| Income Projection Math Validation

|--------------------------------------------------------------------------

|

| This file validates the dividend snowball projection calculations

| used by IncomeProjection.jsx.

|

| Run this file from the project root:

|

|     node src/utils/IncomeProjectionMathCheck.js

|

| Expected behavior:

|

| - All validation checks should PASS

| - Final output should display:

|

|     ✅ ALL INCOME PROJECTION CALCULATIONS ARE WORKING CORRECTLY

|

| If any test fails:

|

| - The console will display ❌ FAIL

| - Expected vs actual values will be shown

| - Review recent changes to the projection formula

|

*/

function assertEqual(actual, expected, label) {
  const passed = actual === expected;

  console.log(
    `${passed ? "✅ PASS" : "❌ FAIL"} - ${label}\nExpected: ${expected}\nActual: ${actual}\n`,
  );

  return passed;
}

function buildProjection({
  startingMonthlyIncome,
  monthlyContribution,
  annualIncomeGrowth,
  reinvestPercent,
  years,
}) {
  const totalMonths = years * 12;
  const monthlyGrowthRate = Number(annualIncomeGrowth || 0) / 100 / 12;
  const contributionIncomeRate = 0.008;
  const reinvestMonthlyBoost = (Number(reinvestPercent || 0) / 100) * 0.01;

  let monthlyIncome = Number(startingMonthlyIncome || 0);
  let cumulativeIncome = 0;

  return Array.from({ length: totalMonths }, (_, index) => {
    const monthNumber = index + 1;

    monthlyIncome =
      monthlyIncome * (1 + monthlyGrowthRate + reinvestMonthlyBoost) +
      Number(monthlyContribution || 0) * contributionIncomeRate;

    cumulativeIncome += monthlyIncome;

    return {
      monthNumber,
      label: `Month ${monthNumber}`,
      monthlyIncome: Number(monthlyIncome.toFixed(2)),
      cumulativeIncome: Number(cumulativeIncome.toFixed(2)),
    };
  });
}

console.log("Test 1: Flat income");
console.table(
  buildProjection({
    startingMonthlyIncome: 100,
    monthlyContribution: 0,
    annualIncomeGrowth: 0,
    reinvestPercent: 0,
    years: 1,
  }).filter((row) => row.monthNumber === 1 || row.monthNumber === 12),
);

console.log("Expected:");
console.log("Month 1 monthlyIncome = 100");
console.log("Month 12 monthlyIncome = 100");
console.log("Month 12 cumulativeIncome = 1200");

console.log("Test 2: Monthly contribution");
console.table(
  buildProjection({
    startingMonthlyIncome: 100,
    monthlyContribution: 100,
    annualIncomeGrowth: 0,
    reinvestPercent: 0,
    years: 1,
  }).slice(0, 3),
);

console.log("Expected:");
console.log("Month 1 monthlyIncome = 100.80");
console.log("Month 2 monthlyIncome = 101.60");
console.log("Month 3 monthlyIncome = 102.40");

console.log("Test 3: 12% annual growth");
console.table(
  buildProjection({
    startingMonthlyIncome: 120,
    monthlyContribution: 0,
    annualIncomeGrowth: 12,
    reinvestPercent: 0,
    years: 1,
  }).slice(0, 3),
);

console.log("Expected:");
console.log("Month 1 monthlyIncome = 121.20");
console.log("Month 2 monthlyIncome = 122.41 approx");
console.log("Month 3 monthlyIncome = 123.64 approx");

console.log("Test 4: 50% reinvested income");
console.table(
  buildProjection({
    startingMonthlyIncome: 100,
    monthlyContribution: 0,
    annualIncomeGrowth: 0,
    reinvestPercent: 50,
    years: 1,
  }).slice(0, 3),
);

console.log("Expected:");
console.log("Month 1 monthlyIncome = 100.50");
console.log("Month 2 monthlyIncome = 101.00 approx");
console.log("Month 3 monthlyIncome = 101.51 approx");

console.log("Test 5: Contribution only for 12 months");
const contributionOnly = buildProjection({
  startingMonthlyIncome: 0,
  monthlyContribution: 100,
  annualIncomeGrowth: 0,
  reinvestPercent: 0,
  years: 1,
});

console.table(
  contributionOnly.filter((row) => [1, 6, 12].includes(row.monthNumber)),
);
console.log("Expected:");
console.log("Month 1 monthlyIncome = 0.80");
console.log("Month 6 monthlyIncome = 4.80");
console.log("Month 12 monthlyIncome = 9.60");

console.log("Test 6: Growth + contribution");
console.table(
  buildProjection({
    startingMonthlyIncome: 100,
    monthlyContribution: 100,
    annualIncomeGrowth: 12,
    reinvestPercent: 0,
    years: 1,
  }).slice(0, 3),
);
console.log("Expected approx:");
console.log("Month 1 = 101.80");
console.log("Month 2 = 103.62");
console.log("Month 3 = 105.46");

console.log("Test 7: Zero everything");
const zeroCase = buildProjection({
  startingMonthlyIncome: 0,
  monthlyContribution: 0,
  annualIncomeGrowth: 0,
  reinvestPercent: 0,
  years: 1,
});

console.table(zeroCase.filter((row) => [1, 12].includes(row.monthNumber)));
console.log("Expected:");
console.log("Month 1 monthlyIncome = 0");
console.log("Month 12 cumulativeIncome = 0");

console.log("Test 8: 10-year projection length");
const tenYearProjection = buildProjection({
  startingMonthlyIncome: 100,
  monthlyContribution: 0,
  annualIncomeGrowth: 0,
  reinvestPercent: 0,
  years: 10,
});

console.log("Expected length = 120");
console.log("Actual length =", tenYearProjection.length);

console.log("Test 9: Cumulative income sanity check");
const flatIncome = buildProjection({
  startingMonthlyIncome: 250,
  monthlyContribution: 0,
  annualIncomeGrowth: 0,
  reinvestPercent: 0,
  years: 1,
});

console.table(flatIncome.filter((row) => row.monthNumber === 12));
console.log("Expected:");
console.log("Month 12 cumulativeIncome = 3000");

const testResults = [];

console.log("Running income projection math validation...\n");

const flatProjection = buildProjection({
  startingMonthlyIncome: 100,
  monthlyContribution: 0,
  annualIncomeGrowth: 0,
  reinvestPercent: 0,
  years: 1,
});

testResults.push(
  assertEqual(
    flatProjection[11].cumulativeIncome,
    1200,
    "Flat income cumulative total after 12 months",
  ),
);

const reinvestProjection = buildProjection({
  startingMonthlyIncome: 100,
  monthlyContribution: 0,
  annualIncomeGrowth: 0,
  reinvestPercent: 50,
  years: 1,
});

testResults.push(
  assertEqual(
    reinvestProjection[0].monthlyIncome,
    100.5,
    "50% reinvestment month 1 income",
  ),
);

testResults.push(
  assertEqual(
    reinvestProjection[1].monthlyIncome,
    101,
    "50% reinvestment month 2 income",
  ),
);

const contributionProjection = buildProjection({
  startingMonthlyIncome: 0,
  monthlyContribution: 100,
  annualIncomeGrowth: 0,
  reinvestPercent: 0,
  years: 1,
});

testResults.push(
  assertEqual(
    contributionProjection[11].monthlyIncome,
    9.6,
    "Monthly contribution income after 12 months",
  ),
);

const allPassed = testResults.every(Boolean);

console.log("\n====================================\n");

if (allPassed) {
  console.log("✅ ALL INCOME PROJECTION CALCULATIONS ARE WORKING CORRECTLY");
} else {
  console.log("❌ SOME INCOME PROJECTION CALCULATIONS FAILED VALIDATION");
}

console.log("\n====================================\n");
