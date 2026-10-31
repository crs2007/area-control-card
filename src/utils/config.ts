import { AreaControlCardConfig, EntityConfig } from '../types';
import { COLOR_PRESETS, DEFAULT_CONFIG, MAX_ENTITIES } from '../const';

function normalizeEntities(raw: unknown): EntityConfig[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    throw new Error('"entities" must be a list');
  }

  const entities = raw.map((item, index) => {
    if (typeof item === 'string') return { entity: item };
    if (item && typeof item === 'object' && typeof item.entity === 'string') {
      return item as EntityConfig;
    }
    throw new Error(`entities[${index}] must be an entity id or an object with an "entity" key`);
  });

  if (entities.length > MAX_ENTITIES) {
    console.warn(
      `[area-control-card] ${entities.length} entities configured, showing the first ${MAX_ENTITIES}`,
    );
  }
  return entities.slice(0, MAX_ENTITIES);
}

/** Validate a user config and merge it with the defaults. Throws a readable Error when invalid. */
export function normalizeConfig(config: Partial<AreaControlCardConfig>): AreaControlCardConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid configuration');
  }

  if (config.color_preset && !(config.color_preset in COLOR_PRESETS)) {
    console.warn(
      `[area-control-card] Unknown color_preset "${config.color_preset}", using the default`,
    );
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
    entities: normalizeEntities(config.entities),
  } as AreaControlCardConfig;
}
