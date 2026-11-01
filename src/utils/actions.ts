import { ActionConfig, AreaControlCardConfig, EntityConfig } from '../types';

export type ActionKind = 'tap' | 'hold' | 'double_tap';

export interface ResolvedActions {
  /** Entity used by more-info / toggle actions */
  entity?: string;
  tap_action: ActionConfig;
  hold_action: ActionConfig;
  double_tap_action: ActionConfig;
}

const NONE: ActionConfig = { action: 'none' };

/** Actions that cannot do anything without an entity or a target */
function isUsable(action: ActionConfig | undefined, entity: string | undefined): boolean {
  if (!action || !action.action || action.action === 'none') return false;
  if (action.action === 'navigate') return !!action.navigation_path;
  if (action.action === 'url') return !!action.url_path;
  if (action.action === 'more-info' || action.action === 'toggle') return !!entity;
  return true;
}

/**
 * Work out the actions the card should actually run. Top-level `navigation_path` is shorthand
 * for a navigate tap action, and actions that cannot run (no path / no entity) become `none`.
 */
export function resolveActions(
  config: AreaControlCardConfig,
  fallbackEntity?: string,
): ResolvedActions {
  const entity = config.presence_entities?.[0] || config.entities?.[0]?.entity || fallbackEntity;

  const resolve = (action: ActionConfig | undefined): ActionConfig => {
    let result = action;
    if (result?.action === 'navigate' && !result.navigation_path && config.navigation_path) {
      result = { ...result, navigation_path: config.navigation_path };
    }
    return isUsable(result, entity) ? (result as ActionConfig) : NONE;
  };

  return {
    entity,
    tap_action: resolve(config.tap_action),
    hold_action: resolve(config.hold_action),
    double_tap_action: resolve(config.double_tap_action),
  };
}

/**
 * The action a chip runs instead of toggling its entity. `undefined` means the default toggle;
 * a configured action that cannot run (e.g. navigate without a path) also falls back to it.
 */
export function resolveChipAction(entityConfig: EntityConfig): ActionConfig | undefined {
  const action = entityConfig.tap_action;
  if (action?.action === 'none') return NONE;
  return isUsable(action, entityConfig.entity) ? action : undefined;
}

export function hasAnyAction(actions: ResolvedActions): boolean {
  return [actions.tap_action, actions.hold_action, actions.double_tap_action].some(
    (a) => a.action !== 'none',
  );
}
