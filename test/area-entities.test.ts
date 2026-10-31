import { describe, it, expect } from 'vitest';
import {
  getAreaEntities,
  getAreaEntitiesByDomain,
  getPresenceSensors,
} from '../src/utils/area-entities';
import type { HomeAssistant, HassEntityRegistryEntry } from '../src/types';

const entry = (
  entity_id: string,
  extra: Partial<HassEntityRegistryEntry> = {},
): HassEntityRegistryEntry => ({
  entity_id,
  device_id: null,
  area_id: null,
  name: null,
  icon: null,
  platform: 'test',
  disabled_by: null,
  hidden_by: null,
  ...extra,
});

const makeHass = (entities: HassEntityRegistryEntry[]): HomeAssistant =>
  ({
    devices: {
      d_office: { id: 'd_office', area_id: 'office', name: 'Office device', name_by_user: null },
      d_bed: { id: 'd_bed', area_id: 'bedroom', name: 'Bed device', name_by_user: null },
    },
    entities: Object.fromEntries(entities.map((e) => [e.entity_id, e])),
    states: {
      'binary_sensor.motion': {
        entity_id: 'binary_sensor.motion',
        state: 'off',
        attributes: { device_class: 'motion' },
        last_changed: '',
        last_updated: '',
      },
      'binary_sensor.door': {
        entity_id: 'binary_sensor.door',
        state: 'off',
        attributes: { device_class: 'door' },
        last_changed: '',
        last_updated: '',
      },
    },
  }) as unknown as HomeAssistant;

describe('getAreaEntities', () => {
  it('includes entities of devices in the area', () => {
    const hass = makeHass([entry('light.a', { device_id: 'd_office' })]);
    expect(getAreaEntities(hass, 'office')).toEqual(['light.a']);
  });

  it('includes entities assigned directly to the area', () => {
    const hass = makeHass([entry('light.a', { area_id: 'office' })]);
    expect(getAreaEntities(hass, 'office')).toEqual(['light.a']);
  });

  it('lets an entity area override its device area', () => {
    const hass = makeHass([entry('switch.plug', { device_id: 'd_office', area_id: 'bedroom' })]);
    expect(getAreaEntities(hass, 'office')).toEqual([]);
    expect(getAreaEntities(hass, 'bedroom')).toEqual(['switch.plug']);
  });

  it('skips disabled, hidden, config and diagnostic entities', () => {
    const hass = makeHass([
      entry('light.disabled', { device_id: 'd_office', disabled_by: 'user' }),
      entry('light.hidden', { device_id: 'd_office', hidden_by: 'user' }),
      entry('switch.child_lock', { device_id: 'd_office', entity_category: 'config' }),
      entry('sensor.rssi', { device_id: 'd_office', entity_category: 'diagnostic' }),
      entry('light.ok', { device_id: 'd_office' }),
    ]);
    expect(getAreaEntities(hass, 'office')).toEqual(['light.ok']);
  });
});

describe('getAreaEntitiesByDomain', () => {
  it('groups supported domains only', () => {
    const hass = makeHass([
      entry('light.a', { area_id: 'office' }),
      entry('light.b', { area_id: 'office' }),
      entry('sensor.t', { area_id: 'office' }),
    ]);
    expect(getAreaEntitiesByDomain(hass, 'office')).toEqual({ light: ['light.a', 'light.b'] });
  });
});

describe('getPresenceSensors', () => {
  it('returns only binary sensors with a presence device class', () => {
    const hass = makeHass([
      entry('binary_sensor.motion', { area_id: 'office' }),
      entry('binary_sensor.door', { area_id: 'office' }),
    ]);
    expect(getPresenceSensors(hass, 'office')).toEqual(['binary_sensor.motion']);
  });
});
