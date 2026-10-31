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

const MEDIA_PLAYER_INACTIVE = ['off', 'standby', 'idle', 'unavailable', 'unknown'];
// MediaPlayerEntityFeature.TURN_ON | TURN_OFF
const MEDIA_PLAYER_POWER_FEATURES = 128 | 256;

export function isEntityActive(stateObj: HassEntity): boolean {
  const domain = getDomain(stateObj.entity_id);

  switch (domain) {
    case 'media_player':
      return !MEDIA_PLAYER_INACTIVE.includes(stateObj.state);
    case 'climate':
      return !['off', 'unavailable', 'unknown'].includes(stateObj.state);
    case 'cover':
      return stateObj.state === 'open' || stateObj.state === 'opening';
    case 'lock':
      return stateObj.state === 'locked';
    case 'scene':
    case 'button':
    case 'input_button':
      return false; // One-shot entities have no active state
    default:
      return stateObj.state === 'on';
  }
}

/** Only a missing or `unavailable` entity is non-interactive; `unknown` is valid (e.g. unused scenes). */
export function isEntityUnavailable(stateObj: HassEntity | undefined): boolean {
  return !stateObj || stateObj.state === 'unavailable';
}

export async function toggleEntity(hass: HomeAssistant, entityId: string): Promise<void> {
  const domain = getDomain(entityId);
  const stateObj = hass.states[entityId];
  if (!stateObj) return;

  const call = (service: string, callDomain = domain) =>
    hass.callService(callDomain, service, {}, { entity_id: entityId });

  try {
    switch (domain) {
      case 'media_player': {
        const features = Number(stateObj.attributes.supported_features ?? 0);
        await (features & MEDIA_PLAYER_POWER_FEATURES ? call('toggle') : call('media_play_pause'));
        break;
      }
      case 'climate':
        await call(stateObj.state === 'off' ? 'turn_on' : 'turn_off');
        break;
      case 'cover':
        if (stateObj.state === 'opening' || stateObj.state === 'closing') {
          await call('stop_cover');
        } else {
          await call(stateObj.state === 'open' ? 'close_cover' : 'open_cover');
        }
        break;
      case 'lock':
        await call(stateObj.state === 'locked' ? 'unlock' : 'lock');
        break;
      case 'scene':
      case 'script':
        await call('turn_on');
        break;
      case 'button':
      case 'input_button':
        await call('press');
        break;
      case 'light':
      case 'fan':
      case 'switch':
        await call('toggle');
        break;
      default:
        // input_boolean, humidifier, siren, vacuum, ...
        await call('toggle', 'homeassistant');
    }
  } catch (err) {
    console.error(`[area-control-card] Failed to toggle ${entityId}`, err);
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
