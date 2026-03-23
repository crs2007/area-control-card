import { ColorPalette, ColorPreset, AreaControlCardConfig } from './types';

export const CARD_TAG = 'area-control-card';
export const EDITOR_TAG = 'area-control-card-editor';
export const CARD_VERSION = '2026.03.23.1';

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

export const DEFAULT_CONFIG: Partial<AreaControlCardConfig> = {
  color_preset: 'ocean',
  background_mode: 'gradient',
  entities: [],
  tap_action: { action: 'navigate' },
  hold_action: { action: 'more-info' },
  double_tap_action: { action: 'none' },
};

export const PRESENCE_DEVICE_CLASSES = ['occupancy', 'motion', 'presence'];
