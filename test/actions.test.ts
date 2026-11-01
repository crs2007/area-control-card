import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveActions, hasAnyAction, ActionKind } from '../src/utils/actions';
import { ActionGesture, HOLD_MS, DOUBLE_TAP_MS } from '../src/utils/action-gesture';
import type { AreaControlCardConfig } from '../src/types';

const cfg = (extra: Record<string, unknown> = {}) =>
  ({
    type: 'custom:area-control-card',
    entities: [],
    tap_action: { action: 'navigate' },
    hold_action: { action: 'more-info' },
    double_tap_action: { action: 'none' },
    ...extra,
  }) as unknown as AreaControlCardConfig;

describe('resolveActions', () => {
  it('disables navigate when there is no path', () => {
    const r = resolveActions(cfg());
    expect(r.tap_action.action).toBe('none');
    expect(hasAnyAction(r)).toBe(false);
  });

  it('uses the top-level navigation_path as a fallback for navigate', () => {
    const r = resolveActions(cfg({ navigation_path: '/lovelace/office' }));
    expect(r.tap_action).toEqual({ action: 'navigate', navigation_path: '/lovelace/office' });
  });

  it('prefers the navigation_path set on the action itself', () => {
    const r = resolveActions(
      cfg({
        navigation_path: '/old',
        tap_action: { action: 'navigate', navigation_path: '/new' },
      }),
    );
    expect(r.tap_action.navigation_path).toBe('/new');
  });

  it('enables more-info only when an entity is available', () => {
    expect(resolveActions(cfg()).hold_action.action).toBe('none');
    const r = resolveActions(cfg({ entities: [{ entity: 'light.a' }] }));
    expect(r.hold_action.action).toBe('more-info');
    expect(r.entity).toBe('light.a');
  });

  it('prefers the presence entity for more-info', () => {
    const r = resolveActions(
      cfg({ presence_entities: ['binary_sensor.m'], entities: [{ entity: 'light.a' }] }),
    );
    expect(r.entity).toBe('binary_sensor.m');
  });

  it('passes through other action types', () => {
    const r = resolveActions(
      cfg({ double_tap_action: { action: 'perform-action', perform_action: 'x.y' } }),
    );
    expect(r.double_tap_action.action).toBe('perform-action');
  });
});

describe('ActionGesture', () => {
  let fired: ActionKind[];
  const make = (has: ActionKind[]) =>
    new ActionGesture(
      (k) => fired.push(k),
      (k) => has.includes(k),
    );

  beforeEach(() => {
    vi.useFakeTimers();
    fired = [];
  });
  afterEach(() => vi.useRealTimers());

  it('fires tap immediately when no double tap is configured', () => {
    const g = make(['tap']);
    g.down();
    g.up();
    expect(fired).toEqual(['tap']);
  });

  it('fires hold after the hold delay and suppresses the tap', () => {
    const g = make(['tap', 'hold']);
    g.down();
    vi.advanceTimersByTime(HOLD_MS);
    g.up();
    expect(fired).toEqual(['hold']);
  });

  it('does not fire hold when released early', () => {
    const g = make(['tap', 'hold']);
    g.down();
    vi.advanceTimersByTime(HOLD_MS - 100);
    g.up();
    vi.advanceTimersByTime(HOLD_MS);
    expect(fired).toEqual(['tap']);
  });

  it('delays tap and fires double_tap on a second quick tap', () => {
    const g = make(['tap', 'double_tap']);
    g.down();
    g.up();
    expect(fired).toEqual([]);
    g.down();
    g.up();
    vi.advanceTimersByTime(DOUBLE_TAP_MS * 2);
    expect(fired).toEqual(['double_tap']);
  });

  it('fires a single delayed tap when no second tap follows', () => {
    const g = make(['tap', 'double_tap']);
    g.down();
    g.up();
    vi.advanceTimersByTime(DOUBLE_TAP_MS);
    expect(fired).toEqual(['tap']);
  });

  it('cancel stops a pending hold', () => {
    const g = make(['hold']);
    g.down();
    g.cancel();
    vi.advanceTimersByTime(HOLD_MS * 2);
    expect(fired).toEqual([]);
  });
});
