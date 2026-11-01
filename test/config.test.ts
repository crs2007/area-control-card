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

  it('keeps a per-entity tap_action', () => {
    const tap_action = { action: 'perform-action', perform_action: 'script.tv_on' };
    const result = normalizeConfig(cfg({ entities: [{ entity: 'media_player.tv', tap_action }] }));
    expect(result.entities[0].tap_action).toEqual(tap_action);
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

  it('normalizes a single presence sensor to a list', () => {
    expect(normalizeConfig(cfg({ presence_entity: 'binary_sensor.m' })).presence_entities).toEqual([
      'binary_sensor.m',
    ]);
    expect(normalizeConfig(cfg()).presence_entities).toEqual([]);
  });

  it('accepts a list of presence sensors', () => {
    const result = normalizeConfig(
      cfg({ presence_entity: ['binary_sensor.a', 'binary_sensor.b'] }),
    );
    expect(result.presence_entities).toEqual(['binary_sensor.a', 'binary_sensor.b']);
  });

  it('rejects presence sensors that are not entity ids', () => {
    expect(() => normalizeConfig(cfg({ presence_entity: [1] }))).toThrow('presence_entity');
  });

  it('defaults room_type to auto and falls back on unknown values', () => {
    expect(normalizeConfig(cfg()).room_type).toBe('auto');
    expect(normalizeConfig(cfg({ room_type: 'kitchen' })).room_type).toBe('kitchen');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(normalizeConfig(cfg({ room_type: 'attic' })).room_type).toBe('auto');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
