import { EntityConfig, HomeAssistant } from '../types';
import { MAX_ENTITIES, SUPPORTED_DOMAINS, PRESENCE_DEVICE_CLASSES } from '../const';
import { getDomain } from './ha-helpers';

export function getAreaEntities(hass: HomeAssistant, areaId: string): string[] {
  const deviceIds = new Set(
    Object.values(hass.devices)
      .filter((d) => d.area_id === areaId)
      .map((d) => d.id),
  );

  return Object.values(hass.entities)
    .filter((e) => {
      if (e.disabled_by || e.hidden_by || e.entity_category) return false;
      // An entity's own area overrides the area of its device
      if (e.area_id) return e.area_id === areaId;
      return !!e.device_id && deviceIds.has(e.device_id);
    })
    .map((e) => e.entity_id);
}

export function getAreaEntitiesByDomain(
  hass: HomeAssistant,
  areaId: string,
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const entityId of getAreaEntities(hass, areaId)) {
    const domain = getDomain(entityId);
    if (SUPPORTED_DOMAINS.includes(domain)) {
      (grouped[domain] ||= []).push(entityId);
    }
  }

  return grouped;
}

/** Entities to show when none are pinned: supported domains in order, capped at MAX_ENTITIES. */
export function discoverAreaEntities(hass: HomeAssistant, areaId: string): EntityConfig[] {
  return Object.values(getAreaEntitiesByDomain(hass, areaId))
    .flat()
    .slice(0, MAX_ENTITIES)
    .map((entity) => ({ entity }));
}

export function isPresenceSensor(attributes: { device_class?: unknown } | undefined): boolean {
  return PRESENCE_DEVICE_CLASSES.includes(attributes?.device_class as string);
}

export function getPresenceSensors(hass: HomeAssistant, areaId: string): string[] {
  return getAreaEntities(hass, areaId).filter((entityId) => {
    if (!entityId.startsWith('binary_sensor.')) return false;
    return isPresenceSensor(hass.states[entityId]?.attributes);
  });
}
