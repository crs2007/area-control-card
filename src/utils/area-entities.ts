import { HomeAssistant } from '../types';
import { SUPPORTED_DOMAINS } from '../const';

export function getAreaEntities(hass: HomeAssistant, areaId: string): string[] {
  // Get devices in this area
  const deviceIds = Object.values(hass.devices)
    .filter((d) => d.area_id === areaId)
    .map((d) => d.id);

  // Get entities: either directly assigned to area OR belonging to a device in area
  const entityEntries = Object.values(hass.entities).filter(
    (e) =>
      !e.disabled_by &&
      !e.hidden_by &&
      (e.area_id === areaId || (e.device_id && deviceIds.includes(e.device_id))),
  );

  return entityEntries.map((e) => e.entity_id);
}

export function getAreaEntitiesByDomain(
  hass: HomeAssistant,
  areaId: string,
): Record<string, string[]> {
  const entities = getAreaEntities(hass, areaId);
  const grouped: Record<string, string[]> = {};

  for (const entityId of entities) {
    const domain = entityId.split('.')[0];
    if (SUPPORTED_DOMAINS.includes(domain)) {
      if (!grouped[domain]) {
        grouped[domain] = [];
      }
      grouped[domain].push(entityId);
    }
  }

  return grouped;
}

export function getPresenceSensors(hass: HomeAssistant, areaId: string): string[] {
  const entities = getAreaEntities(hass, areaId);

  return entities.filter((entityId) => {
    if (!entityId.startsWith('binary_sensor.')) return false;
    const stateObj = hass.states[entityId];
    if (!stateObj) return false;
    const deviceClass = stateObj.attributes.device_class as string | undefined;
    return deviceClass && ['occupancy', 'motion', 'presence'].includes(deviceClass);
  });
}
