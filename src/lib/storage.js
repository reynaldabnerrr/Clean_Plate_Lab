const STORAGE_PREFIX = 'cpl:v1:';

export function readStoredState(key, validate) {
  if (typeof window === 'undefined') return null;

  try {
    const value = JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}${key}`));
    return validate(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredState(key, value) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    return;
  }
}

export function migrateStoredLanguage() {
  const stored = readStoredState('language', (value) => value === 'ID' || value === 'EN');
  if (stored) return stored;
  if (typeof window === 'undefined') return null;

  try {
    const legacy = window.localStorage.getItem('cpl-language');
    if (legacy !== 'ID' && legacy !== 'EN') return null;
    writeStoredState('language', legacy);
    window.localStorage.removeItem('cpl-language');
    return legacy;
  } catch {
    return null;
  }
}
