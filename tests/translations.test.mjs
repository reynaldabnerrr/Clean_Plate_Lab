import test from 'node:test';
import assert from 'node:assert/strict';
import { translations, translate } from '../src/data/translations.js';

test('translate returns correct copy for both Indonesian and English', () => {
  assert.equal(translate('ID', 'pillars'), 'Pilar Utama');
  assert.equal(translate('EN', 'pillars'), 'Core Pillars');
  assert.equal(translate('ID', 'orderMealPlan'), 'Pesan Catering');
  assert.equal(translate('EN', 'orderMealPlan'), 'Order Meal Plan');
});

test('translate falls back gracefully for unknown languages and missing keys', () => {
  // Unknown language falls back to English dictionary
  assert.equal(translate('FR', 'pillars'), 'Core Pillars');

  // Missing key anywhere returns the raw key itself
  assert.equal(translate('ID', 'non_existent_key_123'), 'non_existent_key_123');
  assert.equal(translate('EN', 'non_existent_key_123'), 'non_existent_key_123');

  // Null / undefined resilience
  assert.equal(translate(null, 'pillars'), 'Core Pillars');
  assert.equal(translate(undefined, null), null);
});

test('ID and EN translation dictionaries have complete 1:1 key parity', () => {
  const idKeys = Object.keys(translations.ID).sort();
  const enKeys = Object.keys(translations.EN).sort();

  const missingInEn = idKeys.filter((key) => !(key in translations.EN));
  const missingInId = enKeys.filter((key) => !(key in translations.ID));

  assert.deepEqual(
    missingInEn,
    [],
    `Keys in ID but missing in EN: ${missingInEn.join(', ')}`,
  );
  assert.deepEqual(
    missingInId,
    [],
    `Keys in EN but missing in ID: ${missingInId.join(', ')}`,
  );
  assert.equal(idKeys.length, enKeys.length, 'Total translation key counts must match');
});

test('all translation entries are non-empty strings', () => {
  for (const lang of ['ID', 'EN']) {
    for (const [key, value] of Object.entries(translations[lang])) {
      assert.equal(
        typeof value,
        'string',
        `Translation for "${key}" in ${lang} must be a string`,
      );
      assert.ok(
        value.trim().length > 0,
        `Translation for "${key}" in ${lang} must not be empty`,
      );
    }
  }
});
