import { HomeAssistant } from '../types';

/**
 * HA hands the card a new `hass` object on every state change anywhere in the instance.
 * Only re-render when something this card actually shows has changed.
 */
export function hassChangedForCard(
  oldHass: HomeAssistant | undefined,
  newHass: HomeAssistant,
  watchedEntities: Iterable<string>,
): boolean {
  if (!oldHass) return true;
  if (
    oldHass.language !== newHass.language ||
    oldHass.areas !== newHass.areas ||
    oldHass.devices !== newHass.devices ||
    oldHass.entities !== newHass.entities ||
    oldHass.themes?.darkMode !== newHass.themes?.darkMode
  ) {
    return true;
  }
  for (const id of watchedEntities) {
    if (oldHass.states[id] !== newHass.states[id]) return true;
  }
  return false;
}
