import { AreaControlCardConfig, EntityConfig } from '../types';
import { COLOR_PRESETS, DEFAULT_CONFIG, MAX_ENTITIES } from '../const';
import { isRoomType } from './room-type';

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

function normalizePresence(raw: unknown): string[] {
  if (raw === undefined || raw === null || raw === '') return [];
  const list = Array.isArray(raw) ? raw : [raw];
  if (!list.every((id) => typeof id === 'string')) {
    throw new Error('"presence_entity" must be an entity id or a list of entity ids');
  }
  return list.filter(Boolean);
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

  let roomType = config.room_type;
  if (roomType && roomType !== 'auto' && roomType !== 'none' && !isRoomType(roomType)) {
    console.warn(`[area-control-card] Unknown room_type "${roomType}", using "auto"`);
    roomType = 'auto';
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
    room_type: roomType ?? DEFAULT_CONFIG.room_type,
    entities: normalizeEntities(config.entities),
    presence_entities: normalizePresence(config.presence_entity),
  } as AreaControlCardConfig;
}
