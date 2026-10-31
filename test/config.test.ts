import { describe, it, expect, vi } from 'vitest';
import { normalizeConfig } from '../src/utils/config';
import { MAX_ENTITIES } from '../src/const';
import type { AreaControlCardConfig } from '../src/types';

const cfg = (extra: Record<string, unknown> = {}) =>
  ({ type: 'custom:area-control-card', ...extra }) as unknown as AreaControlCardConfig;

describe('normalizeConfig', () => {
  it('rejects a missing config', () => {
    expect(() => normalizeConfig(undefined as never)).toThrow('Invalid configuration');
  });

  it('applies defaults and an empty entity list', () => {
    const result = normalizeConfig(cfg());
    expect(result.color_preset).toBe('ocean');
    expect(result.entities).toEqual([]);
  });

  it('accepts bare entity id strings', () => {
    const result = normalizeConfig(cfg({ entities: ['light.a', { entity: 'fan.b', name: 'F' }] }));
    expect(result.entities).toEqual([{ entity: 'light.a' }, { entity: 'fan.b', name: 'F' }]);
  });

  it('rejects entities that are not a list', () => {
    expect(() => normalizeConfig(cfg({ entities: { entity: 'light.a' } }))).toThrow(
      '"entities" must be a list',
    );
  });

  it('rejects entries without an entity id', () => {
    expect(() => normalizeConfig(cfg({ entities: [{ name: 'x' }] }))).toThrow('entities[0]');
  });

  it('caps the entity list at MAX_ENTITIES', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const many = Array.from({ length: MAX_ENTITIES + 3 }, (_, i) => `light.l${i}`);
    expect(normalizeConfig(cfg({ entities: many })).entities).toHaveLength(MAX_ENTITIES);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('warns about an unknown color preset', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    normalizeConfig(cfg({ color_preset: 'neon' }));
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
