export interface ActionConfig {
  action: string;
  navigation_path?: string;
  url_path?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  confirmation?: boolean;
}

export type ColorPreset = 'ocean' | 'sunset' | 'forest' | 'lavender' | 'amber' | 'slate';

export interface EntityConfig {
  entity: string;
  name?: string;
  icon?: string;
}

export interface AreaControlCardConfig {
  type: string;
  // Room
  area?: string;
  name?: string;
  navigation_path?: string;

  // Appearance
  color_preset: ColorPreset;
  background_mode: 'gradient' | 'image';
  image_url?: string;

  // Presence
  presence_entity?: string;

  // Entities (ordered, max 8)
  entities: EntityConfig[];

  // Actions
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface ColorPalette {
  primary: string;
  accent: string;
  glow_active: string;
  glow_secondary: string;
  background_tint: string;
}

// Home Assistant types (minimal subset)
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  areas: Record<string, HassArea>;
  devices: Record<string, HassDevice>;
  entities: Record<string, HassEntityRegistryEntry>;
  language: string;
  themes: {
    darkMode: boolean;
  };
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: { entity_id: string | string[] },
  ) => Promise<void>;
  formatEntityState: (stateObj: HassEntity) => string;
  localize: (key: string, ...args: unknown[]) => string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HassArea {
  area_id: string;
  name: string;
  picture: string | null;
  aliases: string[];
}

export interface HassDevice {
  id: string;
  area_id: string | null;
  name: string;
  name_by_user: string | null;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  device_id: string | null;
  area_id: string | null;
  name: string | null;
  icon: string | null;
  platform: string;
  disabled_by: string | null;
  hidden_by: string | null;
}
