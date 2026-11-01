import { AreaControlCardConfig, HassArea, RoomType } from '../types';
import { ROOM_ICON_MAP, ROOM_KEYWORDS, ROOM_TYPES } from '../const';

export interface ResolvedRoom {
  type: RoomType;
  /** Chosen in the config, as opposed to guessed from the area icon or name */
  explicit: boolean;
}

export function isRoomType(value: unknown): value is RoomType {
  return ROOM_TYPES.includes(value as RoomType);
}

/** `mdi:bed` matches `mdi:bed` and `mdi:bed-king`, but not `mdi:bedside` */
function matchIcon(icon: string | null | undefined): RoomType | null {
  if (!icon) return null;
  const match = ROOM_ICON_MAP.find(([prefix]) => icon === prefix || icon.startsWith(`${prefix}-`));
  return match ? match[1] : null;
}

function matchName(name: string | undefined): RoomType | null {
  if (!name) return null;
  const lower = name.toLowerCase();
  const match = ROOM_KEYWORDS.find(([, keywords]) => keywords.some((k) => lower.includes(k)));
  return match ? match[0] : null;
}

/** The room scene to draw: the configured one, else a guess from the area icon, then its name. */
export function resolveRoomType(
  config: Pick<AreaControlCardConfig, 'room_type' | 'name'>,
  area: Pick<HassArea, 'name' | 'icon'> | undefined,
): ResolvedRoom | null {
  const setting = config.room_type ?? 'auto';
  if (setting === 'none') return null;
  if (isRoomType(setting)) return { type: setting, explicit: true };

  const type = matchIcon(area?.icon) ?? matchName(area?.name) ?? matchName(config.name) ?? null;
  return type ? { type, explicit: false } : null;
}
