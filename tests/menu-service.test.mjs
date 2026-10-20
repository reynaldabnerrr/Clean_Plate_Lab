import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROTEIN_TIERS,
  getMenuSlot,
  getMenuSlotFromDate,
  isMenuDateForSlot,
  getWeeklyMenuDate,
  formatNutritionValue,
  buildNutritionByTier,
  normalizeNutritionByTier,
  getMenuNutritionForTier,
  sortMealsByDay,
  normalizeMenuItem,
} from '../src/lib/menuService.js';

test('getMenuSlot correctly resolves day slot from explicit slot or name', () => {
  assert.equal(getMenuSlot({ menu_slot: 1 }), 1);
  assert.equal(getMenuSlot({ menuSlot: 6 }), 6);
  assert.equal(getMenuSlot({ day: 'Monday / Senin', code: 'CPL-MON' }), 1);
  assert.equal(getMenuSlot({ day: 'Tuesday / Selasa' }), 2);
  assert.equal(getMenuSlot({ day: 'Wednesday / Rabu' }), 3);
  assert.equal(getMenuSlot({ day: 'Thursday / Kamis' }), 4);
  assert.equal(getMenuSlot({ day: 'Friday / Jumat' }), 5);
  assert.equal(getMenuSlot({ day: 'Saturday / Sabtu' }), 6);

  assert.throws(() => getMenuSlot({ day: 'Sunday / Minggu' }), /slot Senin sampai Sabtu/);
  assert.throws(() => getMenuSlot({}), /slot Senin sampai Sabtu/);
});

test('getMenuSlotFromDate and isMenuDateForSlot accurately identify week days', () => {
  // 2026-10-19 is a Monday (ISO day 1)
  assert.equal(getMenuSlotFromDate('2026-10-19'), 1);
  assert.equal(isMenuDateForSlot('2026-10-19', 1), true);
  assert.equal(isMenuDateForSlot('2026-10-19', 2), false);

  // 2026-10-24 is a Saturday (ISO day 6)
  assert.equal(getMenuSlotFromDate('2026-10-24'), 6);
  assert.equal(isMenuDateForSlot('2026-10-24', 6), true);

  // Invalid date strings return null / false
  assert.equal(getMenuSlotFromDate('invalid-date'), null);
  assert.equal(getMenuSlotFromDate(''), null);
  assert.equal(isMenuDateForSlot('not-a-date', 1), false);
});

test('getWeeklyMenuDate generates valid calendar dates within the week', () => {
  const refDate = new Date('2026-10-20T10:00:00'); // Tuesday
  const monday = getWeeklyMenuDate(1, refDate);
  const saturday = getWeeklyMenuDate(6, refDate);

  assert.equal(monday, '2026-10-19');
  assert.equal(saturday, '2026-10-24');

  // Invalid slots return empty string
  assert.equal(getWeeklyMenuDate(0), '');
  assert.equal(getWeeklyMenuDate(7), '');
});

test('formatNutritionValue formats numbers with 2 decimals and safely handles invalid values', () => {
  assert.equal(formatNutritionValue(82.4), '82,40');
  assert.equal(formatNutritionValue(100), '100,00');
  assert.equal(formatNutritionValue(0), '0,00');
  assert.equal(formatNutritionValue('45.5'), '45,50');
  assert.equal(formatNutritionValue(NaN), '—');
  assert.equal(formatNutritionValue(null), '—');
  assert.equal(formatNutritionValue(undefined), '—');
});

test('buildNutritionByTier scales nutrition proportionally for all 5 tiers', () => {
  const snapshot = {
    protein: 40,
    carbs: 60,
    fat: 20,
    fiber: 5,
    sodium: 400,
    potassium: 300,
    kcal: 580,
  };

  const byTier = buildNutritionByTier(snapshot);

  for (const tier of PROTEIN_TIERS) {
    assert.ok(byTier[tier], `Tier ${tier} must exist`);
    assert.equal(byTier[tier].protein, tier);

    const ratio = tier / 40;
    assert.equal(byTier[tier].carbs, Math.round(snapshot.carbs * ratio * 100) / 100);
    assert.equal(byTier[tier].kcal, Math.round(snapshot.kcal * ratio * 100) / 100);
  }
});

test('normalizeNutritionByTier ensures every nutrient is numeric and non-negative', () => {
  const corruptInput = {
    40: { protein: -10, carbs: 'invalid', fat: null },
  };

  const normalized = normalizeNutritionByTier(corruptInput, { protein: 40, carbs: 50, fat: 15 });

  for (const tier of PROTEIN_TIERS) {
    const data = normalized[tier];
    assert.ok(Number.isFinite(data.protein) && data.protein >= 0);
    assert.ok(Number.isFinite(data.carbs) && data.carbs >= 0);
    assert.ok(Number.isFinite(data.fat) && data.fat >= 0);
  }
});

test('getMenuNutritionForTier falls back to default 40g tier when requested tier is invalid', () => {
  const menu = {
    protein: 40,
    carbs: 50,
    fat: 15,
  };

  const tier40 = getMenuNutritionForTier(menu, 40);
  const tierInvalid = getMenuNutritionForTier(menu, 999);

  assert.equal(tier40.protein, 40);
  assert.equal(tierInvalid.protein, 40);
});

test('sortMealsByDay orders meals strictly Monday to Saturday and deduplicates slot conflicts', () => {
  const unorderedMeals = [
    { day: 'Friday / Jumat', code: 'CPL-FRI' },
    { day: 'Monday / Senin', code: 'CPL-MON-1' },
    { day: 'Monday / Senin', code: 'CPL-MON-DUPLICATE' },
    { day: 'Wednesday / Rabu', code: 'CPL-WED' },
    { day: 'Tuesday / Selasa', code: 'CPL-TUE' },
  ];

  const sorted = sortMealsByDay(unorderedMeals);

  assert.equal(sorted.length, 4); // Deduplicated Monday
  assert.equal(sorted[0].code, 'CPL-MON-1');
  assert.equal(sorted[1].code, 'CPL-TUE');
  assert.equal(sorted[2].code, 'CPL-WED');
  assert.equal(sorted[3].code, 'CPL-FRI');
});

test('normalizeMenuItem safely parses tags from arrays, JSON strings, or invalid strings', () => {
  const validArrayItem = normalizeMenuItem({
    code: 'CPL-MON',
    day: 'Monday / Senin',
    tags_id: ['Senin', '80g'],
    tags_en: ['Monday', '80g'],
  });
  assert.deepEqual(validArrayItem.tags_ID, ['Senin', '80g']);

  const jsonStringItem = normalizeMenuItem({
    code: 'CPL-TUE',
    day: 'Tuesday / Selasa',
    tags_id: '["Selasa", "High Protein"]',
    tags_en: '["Tuesday", "High Protein"]',
  });
  assert.deepEqual(jsonStringItem.tags_ID, ['Selasa', 'High Protein']);

  const corruptTagItem = normalizeMenuItem({
    code: 'CPL-WED',
    day: 'Wednesday / Rabu',
    tags_id: '{not a valid json array',
    tags_en: 12345,
  });
  assert.ok(Array.isArray(corruptTagItem.tags_ID));
  assert.ok(Array.isArray(corruptTagItem.tags_EN));
});
