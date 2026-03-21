import { HomeAssistant, HassEntity } from '../types';

export function getDomain(entityId: string): string {
  return entityId.split('.')[0];
}

export function getEntityName(hass: HomeAssistant, entityId: string): string {
  const registryEntry = hass.entities[entityId];
  if (registryEntry?.name) return registryEntry.name;

  const stateObj = hass.states[entityId];
  if (stateObj?.attributes.friendly_name) return stateObj.attributes.friendly_name as string;

  return entityId;
}

export function isEntityActive(stateObj: HassEntity): boolean {
  const domain = getDomain(stateObj.entity_id);

  switch (domain) {
    case 'light':
    case 'fan':
    case 'switch':
    case 'media_player':
    case 'script':
      return stateObj.state === 'on';
    case 'climate':
      return stateObj.state !== 'off' && stateObj.state !== 'unavailable';
    case 'cover':
      return stateObj.state === 'open';
    case 'lock':
      return stateObj.state === 'locked';
    case 'scene':
      return false; // Scenes don't have active/inactive
    default:
      return stateObj.state === 'on';
  }
}

export function isEntityUnavailable(stateObj: HassEntity | undefined): boolean {
  return !stateObj || stateObj.state === 'unavailable' || stateObj.state === 'unknown';
}

export function toggleEntity(hass: HomeAssistant, entityId: string): void {
  const domain = getDomain(entityId);
  const stateObj = hass.states[entityId];
  if (!stateObj) return;

  switch (domain) {
    case 'light':
    case 'fan':
    case 'switch':
    case 'media_player':
      hass.callService(domain, 'toggle', {}, { entity_id: entityId });
      break;
    case 'climate':
      if (stateObj.state === 'off') {
        hass.callService(domain, 'turn_on', {}, { entity_id: entityId });
      } else {
        hass.callService(domain, 'turn_off', {}, { entity_id: entityId });
      }
      break;
    case 'cover':
      if (stateObj.state === 'open') {
        hass.callService(domain, 'close_cover', {}, { entity_id: entityId });
      } else {
        hass.callService(domain, 'open_cover', {}, { entity_id: entityId });
      }
      break;
    case 'lock':
      if (stateObj.state === 'locked') {
        hass.callService(domain, 'unlock', {}, { entity_id: entityId });
      } else {
        hass.callService(domain, 'lock', {}, { entity_id: entityId });
      }
      break;
    case 'scene':
    case 'script':
      hass.callService(domain, 'turn_on', {}, { entity_id: entityId });
      break;
  }
}

export function fireEvent(
  node: HTMLElement,
  type: string,
  detail?: unknown,
  options?: { bubbles?: boolean; composed?: boolean },
): void {
  const event = new CustomEvent(type, {
    bubbles: options?.bubbles ?? true,
    composed: options?.composed ?? true,
    detail,
  });
  node.dispatchEvent(event);
}

export function navigate(path: string): void {
  history.pushState(null, '', path);
  const event = new Event('location-changed', { bubbles: true, composed: true });
  window.dispatchEvent(event);
}
