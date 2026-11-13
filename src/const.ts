import { ColorPalette, ColorPreset, AreaControlCardConfig, RoomType } from './types';

export const CARD_TAG = 'area-control-card';
export const EDITOR_TAG = 'area-control-card-editor';
export const CARD_VERSION = '2026.11.13.0';

export const MAX_ENTITIES = 8;

export const COLOR_PRESETS: Record<ColorPreset, ColorPalette> = {
  ocean: {
    primary: '#0764FA',
    accent: '#8ACDD7',
    glow_active: 'rgba(138,205,215,0.8)',
    glow_secondary: 'rgba(7,100,250,0.3)',
    background_tint: 'rgba(7,100,250,0.08)',
  },
  sunset: {
    primary: '#E85D3A',
    accent: '#DF826C',
    glow_active: 'rgba(223,130,108,0.8)',
    glow_secondary: 'rgba(232,93,58,0.3)',
    background_tint: 'rgba(232,93,58,0.08)',
  },
  forest: {
    primary: '#2D8A4E',
    accent: '#7BC67E',
    glow_active: 'rgba(123,198,126,0.8)',
    glow_secondary: 'rgba(45,138,78,0.3)',
    background_tint: 'rgba(45,138,78,0.08)',
  },
  lavender: {
    primary: '#7C3AED',
    accent: '#A78BFA',
    glow_active: 'rgba(167,139,250,0.8)',
    glow_secondary: 'rgba(124,58,237,0.3)',
    background_tint: 'rgba(124,58,237,0.08)',
  },
  amber: {
    primary: '#D97706',
    accent: '#FCD34D',
    glow_active: 'rgba(252,211,77,0.8)',
    glow_secondary: 'rgba(217,119,6,0.3)',
    background_tint: 'rgba(217,119,6,0.08)',
  },
  slate: {
    primary: '#475569',
    accent: '#94A3B8',
    glow_active: 'rgba(148,163,184,0.8)',
    glow_secondary: 'rgba(71,85,105,0.3)',
    background_tint: 'rgba(71,85,105,0.08)',
  },
};

export const DOMAIN_ICONS: Record<string, string> = {
  light: 'mdi:lightbulb',
  fan: 'mdi:fan',
  media_player: 'mdi:television',
  switch: 'mdi:power-plug',
  climate: 'mdi:thermometer',
  cover: 'mdi:blinds',
  lock: 'mdi:lock',
  scene: 'mdi:palette',
  script: 'mdi:script-text',
};

export const SUPPORTED_DOMAINS = Object.keys(DOMAIN_ICONS);

/** Active chip colors, one per domain, readable on light and dark themes */
export const DOMAIN_COLORS: Record<string, string> = {
  light: '#FFB300',
  fan: '#00BCD4',
  switch: '#2196F3',
  media_player: '#9C27B0',
  climate: '#FF7043',
  cover: '#26A69A',
  lock: '#43A047',
  scene: '#EC407A',
  script: '#5C6BC0',
};

export const ROOM_TYPES: RoomType[] = [
  'living',
  'bedroom',
  'kitchen',
  'bathroom',
  'office',
  'kids',
  'dining',
  'outdoor',
];

/** Area icon (or icon prefix) → room scene. Checked in order, so specific icons come first. */
export const ROOM_ICON_MAP: [string, RoomType][] = [
  ['mdi:silverware-fork-knife', 'dining'],
  ['mdi:table-chair', 'dining'],
  ['mdi:table-furniture', 'dining'],
  ['mdi:sofa', 'living'],
  ['mdi:television', 'living'],
  ['mdi:bed', 'bedroom'],
  ['mdi:bunk-bed', 'kids'],
  ['mdi:baby', 'kids'],
  ['mdi:toy-brick', 'kids'],
  ['mdi:teddy-bear', 'kids'],
  ['mdi:human-child', 'kids'],
  ['mdi:silverware', 'kitchen'],
  ['mdi:stove', 'kitchen'],
  ['mdi:fridge', 'kitchen'],
  ['mdi:chef-hat', 'kitchen'],
  ['mdi:pot', 'kitchen'],
  ['mdi:shower', 'bathroom'],
  ['mdi:bathtub', 'bathroom'],
  ['mdi:toilet', 'bathroom'],
  ['mdi:desk', 'office'],
  ['mdi:laptop', 'office'],
  ['mdi:monitor', 'office'],
  ['mdi:briefcase', 'office'],
  ['mdi:tree', 'outdoor'],
  ['mdi:flower', 'outdoor'],
  ['mdi:grass', 'outdoor'],
  ['mdi:balcony', 'outdoor'],
  ['mdi:pine-tree', 'outdoor'],
  ['mdi:sprout', 'outdoor'],
];

/**
 * Area name keywords (English and Hebrew) → room scene, matched as substrings of the
 * lower-cased name. Checked in order: the most specific rooms come first, so that
 * "Master bathroom" is a bathroom and "Kids bedroom" is a kids room.
 */
export const ROOM_KEYWORDS: [RoomType, string[]][] = [
  ['bathroom', ['bath', 'toilet', 'shower', 'restroom', 'powder', 'אמבטיה', 'שירותים', 'מקלחת']],
  ['kids', ['kid', 'child', 'nursery', 'baby', 'playroom', 'ילד', 'תינוק', 'משחקים']],
  ['dining', ['dining', 'פינת אוכל', 'חדר אוכל']],
  ['kitchen', ['kitchen', 'pantry', 'מטבח']],
  ['office', ['office', 'study', 'workspace', 'משרד', 'עבודה', 'חדר מחשב']],
  [
    'outdoor',
    ['garden', 'yard', 'patio', 'balcony', 'terrace', 'porch', 'outdoor', 'גינה', 'חצר', 'מרפסת'],
  ],
  ['living', ['living', 'lounge', 'family room', 'סלון', 'חדר מגורים', 'טלוויזיה']],
  ['bedroom', ['bed', 'master', 'guest', 'שינה', 'הורים', 'אורחים']],
];

export const DEFAULT_CONFIG: Partial<AreaControlCardConfig> = {
  color_preset: 'ocean',
  room_type: 'auto',
  entities: [],
  tap_action: { action: 'navigate' },
  hold_action: { action: 'more-info' },
  double_tap_action: { action: 'none' },
};

export const PRESENCE_DEVICE_CLASSES = ['occupancy', 'motion', 'presence'];
