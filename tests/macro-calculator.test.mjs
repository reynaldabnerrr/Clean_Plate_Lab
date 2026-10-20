import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMacroTargets } from '../src/lib/calculations.js';

test('calculateMacroTargets calculates realistic BMR and macros for standard male', () => {
  const result = calculateMacroTargets({
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male',
    activity: 1.375,
    goal: 'maintain',
  });

  assert.equal(typeof result.bmr, 'number');
  assert.equal(typeof result.estimatedCalories, 'number');
  assert.equal(typeof result.estimatedProtein, 'number');
  assert.equal(typeof result.estimatedCarbs, 'number');
  assert.equal(typeof result.estimatedFat, 'number');

  assert.ok(result.bmr > 1500 && result.bmr < 2000, `BMR ${result.bmr} should be in realistic range`);
  assert.ok(result.estimatedCalories > 2000, `Calories ${result.estimatedCalories} should be positive`);
  assert.equal(result.proteinPerKg, 1.4);
  assert.equal(result.estimatedProtein, Math.round(70 * 1.4));
  assert.ok([25, 40, 60, 80, 100].includes(result.recommendedProteinTier));
});

test('calculateMacroTargets adjusts multipliers correctly for cut and muscle goals', () => {
  const maintain = calculateMacroTargets({ weight: 80, height: 180, age: 30, gender: 'male', activity: 1.55, goal: 'maintain' });
  const cut = calculateMacroTargets({ weight: 80, height: 180, age: 30, gender: 'male', activity: 1.55, goal: 'cut' });
  const muscle = calculateMacroTargets({ weight: 80, height: 180, age: 30, gender: 'male', activity: 1.55, goal: 'muscle' });

  assert.ok(cut.estimatedCalories < maintain.estimatedCalories, 'Cut calories should be less than maintain');
  assert.ok(muscle.estimatedCalories > maintain.estimatedCalories, 'Muscle calories should be greater than maintain');

  assert.equal(cut.proteinPerKg, 2.2);
  assert.equal(muscle.proteinPerKg, 2.4);
  assert.ok(cut.estimatedProtein > maintain.estimatedProtein, 'Cut requires higher protein per kg');
});

test('calculateMacroTargets handles female calculation formula', () => {
  const female = calculateMacroTargets({
    weight: 55,
    height: 160,
    age: 28,
    gender: 'female',
    activity: 1.2,
    goal: 'maintain',
  });

  assert.ok(female.bmr > 1000 && female.bmr < 1600);
  assert.ok(female.estimatedCalories > 1200);
  assert.ok([25, 40, 60, 80, 100].includes(female.recommendedProteinTier));
});

test('calculateMacroTargets safely handles empty, null, and corrupt inputs without NaN', () => {
  const corruptInputs = [
    {},
    null,
    undefined,
    { weight: 0, height: 0, age: 0, activity: 0 },
    { weight: -50, height: -180, age: -30, activity: -1.5 },
    { weight: 'invalid', height: 'corrupt', age: null, activity: undefined },
  ];

  for (const input of corruptInputs) {
    const result = calculateMacroTargets(input);

    assert.equal(Number.isFinite(result.bmr), true, 'BMR must be finite');
    assert.equal(Number.isFinite(result.estimatedCalories), true, 'Calories must be finite');
    assert.equal(Number.isFinite(result.estimatedProtein), true, 'Protein must be finite');
    assert.equal(Number.isFinite(result.estimatedCarbs), true, 'Carbs must be finite');
    assert.equal(Number.isFinite(result.estimatedFat), true, 'Fat must be finite');
    assert.ok(result.bmr > 0, 'BMR must be positive');
    assert.ok(result.estimatedCalories > 0, 'Calories must be positive');
    assert.ok([25, 40, 60, 80, 100].includes(result.recommendedProteinTier));
  }
});
