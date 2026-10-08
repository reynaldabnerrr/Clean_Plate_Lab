import test from 'node:test';
import assert from 'node:assert/strict';
import { isKitchenNoticeActive, isKitchenClosed, isServiceDate, getServiceDates, getOrderDateError } from '../src/lib/kitchen.js';
import { getDefaultOrderStartDate, getDefaultOrderEndDate, calculateOrderPricing, getDateInputValueInTimeZone } from '../src/lib/order.js';
import { buildMealItems, normalizeMealCustomizations, describeCustomization, formatKitchenMealItems } from '../src/lib/mealCustomization.js';
import { readStoredState, writeStoredState } from '../src/lib/storage.js';

test('notice ends exactly at midnight October 14 WITA, independent of host timezone', () => {
  assert.equal(isKitchenNoticeActive(new Date('2026-10-13T15:59:59.999Z')), true);
  assert.equal(isKitchenNoticeActive(new Date('2026-10-13T16:00:00Z')), false);
  assert.equal(isKitchenNoticeActive(new Date('2026-10-14T01:00:00Z')), false);
  assert.equal(getDateInputValueInTimeZone(new Date('2026-10-13T16:00:00Z')), '2026-10-14');
});

test('every closure date is unselectable and rejected on submission, including stale drafts', () => {
  for (let day = 8; day <= 13; day++) {
    const date = `2026-10-${String(day).padStart(2, '0')}`;
    assert.equal(isKitchenClosed(date), true);
    assert.equal(isServiceDate(date), false);
    assert.equal(getDefaultOrderStartDate(date), '2026-10-14');
    assert.equal(getOrderDateError(date, '2026-10-14', '2026-10-08'), 'kitchenClosed');
    assert.equal(getOrderDateError('2026-10-07', date, '2026-10-07'), 'kitchenClosed');
  }
});

test('October 14 is available; future days, Sundays and invalid dates follow service rules', () => {
  assert.equal(getOrderDateError('2026-10-14', '2026-10-14', '2026-10-08'), null);
  assert.equal(getOrderDateError('2026-10-14', '2026-10-17', '2026-10-14'), null);
  assert.equal(getOrderDateError('2026-10-14', '2026-10-17', '2026-10-15'), 'pastDate');
  assert.equal(getOrderDateError('2026-10-18', '2026-10-18', '2026-10-14'), 'invalidRange');
  assert.equal(getOrderDateError('2026-10-20', '2026-10-14', '2026-10-14'), 'invalidRange');
  assert.equal(isServiceDate('2026-02-30'), false);
  assert.equal(isServiceDate('garbage'), false);
  assert.equal(getDefaultOrderEndDate('2026-10-14'), '2026-10-17');
});

test('multi-day packages exclude every closure date and Sunday from their schedule and billable quantity', () => {
  assert.deepEqual(getServiceDates('2026-10-07', '2026-10-15'), ['2026-10-07', '2026-10-14', '2026-10-15']);
  assert.deepEqual(getServiceDates('2026-10-08', '2026-10-13'), []);
  assert.deepEqual(getServiceDates('2026-10-14', '2026-10-19'), ['2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-19']);
  assert.equal(calculateOrderPricing({proteinTier: 40, addonIds: [], quantity: getServiceDates('2026-10-07', '2026-10-15').length * 2}).total, 240000);
});

test('all 64 pairs of meal customizations survive draft persistence, kitchen details and pricing', () => {
  const store = new Map();
  globalThis.window = {localStorage: {getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value)}};
  try {
    const ids = ['no-rice', 'no-vegetables', 'no-egg'];
    for (let a = 0; a < 8; a++) for (let b = 0; b < 8; b++) {
      const mealCustomizations = [a, b].map(mask => ids.filter((_, bit) => mask & (1 << bit)));
      writeStoredState('order-draft', {mealCustomizations});
      const draft = readStoredState('order-draft', value => Boolean(value?.mealCustomizations));
      const items = buildMealItems({mealsPerDay: 2, singleMealReadyTime: '12:00', mealCustomizations: draft.mealCustomizations, proteinTier: 60, serviceDates: ['2026-10-14']});
      assert.deepEqual(items.map(item => item.customizationIds), mealCustomizations);
      assert.deepEqual(items.map(item => item.readyTime), ['12:00', '18:00']);
      assert.match(formatKitchenMealItems(items), /Meal 1 \(12:00\)/);
      assert.match(formatKitchenMealItems(items), /Meal 2 \(18:00\)/);
      assert.ok(formatKitchenMealItems(items).includes(describeCustomization(mealCustomizations[0], 'ID')));
      assert.ok(formatKitchenMealItems(items).includes(describeCustomization(mealCustomizations[1], 'ID')));
      for (const orderPeriod of ['daily', 'weekly', 'monthly']) {
        const order = {proteinTier: 60, addonIds: [], quantity: 2, orderPeriod};
        assert.deepEqual(calculateOrderPricing({...order, items}), calculateOrderPricing(order));
      }
    }
  } finally { delete globalThis.window; }
});

test('legacy draft defaults to complete meals; one-meal orders omit hidden second-meal customizations', () => {
  assert.deepEqual(normalizeMealCustomizations(undefined), [[], []]);
  assert.deepEqual(normalizeMealCustomizations([['no-rice', 'unknown', 'no-rice'], null]), [['no-rice'], []]);
  const items = buildMealItems({mealsPerDay: 1, singleMealReadyTime: '18:00', mealCustomizations: [[], ['no-egg']], proteinTier: 40, serviceDates: ['2026-10-14']});
  assert.equal(items.length, 1);
  assert.equal(items[0].readyTime, '18:00');
  assert.equal(describeCustomization(items[0].customizationIds, 'ID'), 'Meal lengkap');
  assert.equal(describeCustomization(items[0].customizationIds, 'EN'), 'Complete meal');
});
