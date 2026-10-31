import { describe, it, expect } from 'vitest';
import { localize, translations } from '../src/utils/localize';

describe('localize', () => {
  it('returns English by default', () => {
    expect(localize('card.occupied')).toBe('Occupied');
  });

  it('returns Hebrew for he', () => {
    expect(localize('card.occupied', 'he')).toBe('תפוס');
  });

  it('falls back from a regional tag to the base language', () => {
    expect(localize('card.occupied', 'he-IL')).toBe('תפוס');
    expect(localize('card.occupied', 'en-GB')).toBe('Occupied');
  });

  it('falls back to English for unknown languages', () => {
    expect(localize('card.occupied', 'xx')).toBe('Occupied');
  });

  it('returns the key when it does not exist', () => {
    expect(localize('card.nope')).toBe('card.nope');
    expect(localize('bad')).toBe('bad');
  });
});

describe('locale files', () => {
  const keysOf = (t: Record<string, Record<string, string>>) =>
    Object.entries(t).flatMap(([s, fields]) => Object.keys(fields).map((f) => `${s}.${f}`));

  it.each(Object.keys(translations).filter((l) => l !== 'en'))(
    '%s has exactly the same keys as en',
    (lang) => {
      expect(keysOf(translations[lang]).sort()).toEqual(keysOf(translations.en).sort());
    },
  );
});
