import { describe, it, expect, vi } from 'vitest';
import {
  getDomain,
  isEntityActive,
  isEntityUnavailable,
  toggleEntity,
} from '../src/utils/ha-helpers';
import type { HassEntity, HomeAssistant } from '../src/types';

const makeState = (
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {},
): HassEntity => ({ entity_id, state, attributes, last_changed: '', last_updated: '' });

const makeHass = (stateObj: HassEntity, callService = vi.fn().mockResolvedValue(undefined)) =>
  ({
    states: { [stateObj.entity_id]: stateObj },
    callService,
  }) as unknown as HomeAssistant;

describe('getDomain', () => {
  it('returns the part before the dot', () => {
    expect(getDomain('light.kitchen')).toBe('light');
  });
});

describe('isEntityActive', () => {
  it.each([
    ['light.a', 'on', true],
    ['light.a', 'off', false],
    ['lock.a', 'locked', true],
    ['lock.a', 'unlocked', false],
    ['cover.a', 'open', true],
    ['cover.a', 'opening', true],
    ['cover.a', 'closed', false],
    ['scene.a', 'on', false],
    ['media_player.a', 'playing', true],
    ['media_player.a', 'paused', true],
    ['media_player.a', 'on', true],
    ['media_player.a', 'off', false],
    ['media_player.a', 'standby', false],
    ['media_player.a', 'idle', false],
    ['climate.a', 'heat', true],
    ['climate.a', 'off', false],
    ['input_boolean.a', 'on', true],
  ])('%s in state %s -> %s', (id, state, expected) => {
    expect(isEntityActive(makeState(id, state))).toBe(expected);
  });
});

describe('isEntityUnavailable', () => {
  it('treats a missing state as unavailable', () => {
    expect(isEntityUnavailable(undefined)).toBe(true);
  });
  it('treats unavailable as unavailable', () => {
    expect(isEntityUnavailable(makeState('light.a', 'unavailable'))).toBe(true);
  });
  it('keeps unknown entities (e.g. unused scenes) interactive', () => {
    expect(isEntityUnavailable(makeState('scene.a', 'unknown'))).toBe(false);
  });
});

describe('toggleEntity', () => {
  const run = async (state: HassEntity) => {
    const callService = vi.fn().mockResolvedValue(undefined);
    await toggleEntity(makeHass(state, callService), state.entity_id);
    return callService.mock.calls[0];
  };

  it.each([
    ['light.a', 'on', 'light', 'toggle'],
    ['switch.a', 'off', 'switch', 'toggle'],
    ['climate.a', 'off', 'climate', 'turn_on'],
    ['climate.a', 'heat', 'climate', 'turn_off'],
    ['cover.a', 'open', 'cover', 'close_cover'],
    ['cover.a', 'closed', 'cover', 'open_cover'],
    ['cover.a', 'opening', 'cover', 'stop_cover'],
    ['cover.a', 'closing', 'cover', 'stop_cover'],
    ['lock.a', 'locked', 'lock', 'unlock'],
    ['lock.a', 'unlocked', 'lock', 'lock'],
    ['scene.a', 'unknown', 'scene', 'turn_on'],
    ['script.a', 'off', 'script', 'turn_on'],
    ['button.a', 'unknown', 'button', 'press'],
    ['input_boolean.a', 'on', 'homeassistant', 'toggle'],
  ])('%s (%s) -> %s.%s', async (id, state, domain, service) => {
    const call = await run(makeState(id, state));
    expect(call[0]).toBe(domain);
    expect(call[1]).toBe(service);
    expect(call[3]).toEqual({ entity_id: id });
  });

  it('toggles media players that support power control', async () => {
    const call = await run(makeState('media_player.a', 'on', { supported_features: 128 | 256 }));
    expect(call.slice(0, 2)).toEqual(['media_player', 'toggle']);
  });

  it('uses play/pause for media players without power control', async () => {
    const call = await run(makeState('media_player.a', 'playing', { supported_features: 16384 }));
    expect(call.slice(0, 2)).toEqual(['media_player', 'media_play_pause']);
  });

  it('swallows service call failures', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const callService = vi.fn().mockRejectedValue(new Error('boom'));
    const state = makeState('light.a', 'on');
    await expect(toggleEntity(makeHass(state, callService), 'light.a')).resolves.toBeUndefined();
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});
