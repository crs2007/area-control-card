import { describe, it, expect } from 'vitest';
import { hassChangedForCard } from '../src/utils/should-update';
import type { HomeAssistant } from '../src/types';

const base = {
  language: 'en',
  areas: {},
  devices: {},
  entities: {},
  themes: { darkMode: false },
  states: { 'light.a': { state: 'on' }, 'light.other': { state: 'off' } },
};
const make = (over: Record<string, unknown> = {}) =>
  ({ ...base, ...over }) as unknown as HomeAssistant;

describe('hassChangedForCard', () => {
  it('updates on first hass', () => {
    expect(hassChangedForCard(undefined, make(), ['light.a'])).toBe(true);
  });

  it('ignores changes to unrelated entities', () => {
    const next = make({ states: { ...base.states, 'light.other': { state: 'on' } } });
    expect(hassChangedForCard(make(), next, ['light.a'])).toBe(false);
  });

  it('updates when a watched entity changes', () => {
    const next = make({ states: { ...base.states, 'light.a': { state: 'off' } } });
    expect(hassChangedForCard(make(), next, ['light.a'])).toBe(true);
  });

  it('updates on language, registry or theme changes', () => {
    expect(hassChangedForCard(make(), make({ language: 'he' }), [])).toBe(true);
    expect(hassChangedForCard(make(), make({ entities: {} }), [])).toBe(true);
    expect(hassChangedForCard(make(), make({ themes: { darkMode: true } }), [])).toBe(true);
  });
});
