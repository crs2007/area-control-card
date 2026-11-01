import { LitElement, html, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AreaControlCardConfig, HomeAssistant } from './types';
import {
  EDITOR_TAG,
  COLOR_PRESETS,
  MAX_ENTITIES,
  DOMAIN_ICONS,
  DEFAULT_CONFIG,
  PRESENCE_DEVICE_CLASSES,
  ROOM_TYPES,
} from './const';
import { getAreaEntitiesByDomain, getPresenceSensors } from './utils/area-entities';
import { getEntityName, getDomain, fireEvent } from './utils/ha-helpers';
import { localize } from './utils/localize';
import { editorStyles } from './styles';
import type { ColorPreset } from './types';

const ACTION_SCHEMA = [
  { name: 'tap_action', selector: { ui_action: {} } },
  { name: 'hold_action', selector: { ui_action: {} } },
  { name: 'double_tap_action', selector: { ui_action: {} } },
];

@customElement(EDITOR_TAG)
export class AreaControlCardEditor extends LitElement {
  static styles = editorStyles;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: AreaControlCardConfig;
  @state() private _showAdvanced = false;

  public setConfig(config: AreaControlCardConfig): void {
    this._config = { ...DEFAULT_CONFIG, ...config } as AreaControlCardConfig;
  }

  private get _lang(): string {
    return this.hass?.language || 'en';
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="editor">
        ${this._renderRoomSection()} ${this._renderAppearanceSection()}
        ${this._renderPresenceSection()} ${this._renderEntitiesSection()}
        ${this._renderAdvancedSection()}
      </div>
    `;
  }

  private _renderRoomSection(): TemplateResult {
    return html`
      <h3>${localize('editor.section_room', this._lang)}</h3>

      <ha-area-picker
        .hass=${this.hass}
        .value=${this._config.area || ''}
        .label=${localize('editor.area', this._lang)}
        @value-changed=${this._areaChanged}
      ></ha-area-picker>

      <ha-textfield
        .label=${localize('editor.display_name', this._lang)}
        .value=${this._config.name || ''}
        @input=${this._nameChanged}
      ></ha-textfield>

      <ha-textfield
        .label=${localize('editor.navigation_path', this._lang)}
        .value=${this._config.navigation_path || ''}
        @input=${this._navPathChanged}
      ></ha-textfield>
    `;
  }

  private _renderAppearanceSection(): TemplateResult {
    return html`
      <h3>${localize('editor.section_appearance', this._lang)}</h3>

      <p style="font-size: 13px; margin: 0 0 4px; color: var(--secondary-text-color);">
        ${localize('editor.color_preset', this._lang)}
      </p>
      <div class="color-swatches">
        ${(Object.keys(COLOR_PRESETS) as ColorPreset[]).map(
          (preset) => html`
            <button
              class="color-swatch ${this._config.color_preset === preset ? 'selected' : ''}"
              style="background: ${COLOR_PRESETS[preset].primary}"
              @click=${() => this._presetChanged(preset)}
              title=${localize(`preset.${preset}`, this._lang)}
              aria-label=${localize(`preset.${preset}`, this._lang)}
              aria-pressed=${String(this._config.color_preset === preset)}
            ></button>
          `,
        )}
      </div>

      <ha-form
        .hass=${this.hass}
        .data=${{ room_type: this._config.room_type || 'auto' }}
        .schema=${this._roomTypeSchema()}
        .computeLabel=${() => localize('editor.room_type', this._lang)}
        @value-changed=${this._roomTypeChanged}
      ></ha-form>

      <ha-icon-picker
        .hass=${this.hass}
        .value=${this._config.card_icon || ''}
        .label=${localize('editor.card_icon', this._lang)}
        @value-changed=${this._cardIconChanged}
      ></ha-icon-picker>

      <ha-textfield
        .label=${localize('editor.image_url', this._lang)}
        .value=${this._config.image_url || ''}
        @input=${this._imageUrlChanged}
      ></ha-textfield>

      <p style="font-size: 12px; margin: 4px 0 0; color: var(--secondary-text-color);">
        ${localize('editor.visual_priority', this._lang)}
      </p>
    `;
  }

  private _roomTypeSchema() {
    const option = (value: string, key: string) => ({ value, label: localize(key, this._lang) });
    return [
      {
        name: 'room_type',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              option('auto', 'editor.room_type_auto'),
              option('none', 'editor.room_type_none'),
              ...ROOM_TYPES.map((type) => option(type, `room.${type}`)),
            ],
          },
        },
      },
    ];
  }

  private _renderPresenceSection(): TemplateResult {
    const areaId = this._config.area;
    const presence = this._config.presence_entity;
    const value = Array.isArray(presence) ? presence : presence ? [presence] : [];

    // In an area, offer its presence sensors; otherwise any sensor of a presence device class
    const entitySelector = areaId
      ? { multiple: true, include_entities: getPresenceSensors(this.hass, areaId) }
      : {
          multiple: true,
          filter: PRESENCE_DEVICE_CLASSES.map((device_class) => ({
            domain: 'binary_sensor',
            device_class,
          })),
        };

    return html`
      <h3>${localize('editor.section_presence', this._lang)}</h3>

      <ha-form
        .hass=${this.hass}
        .data=${{ presence_entity: value }}
        .schema=${[{ name: 'presence_entity', selector: { entity: entitySelector } }]}
        .computeLabel=${() => localize('editor.presence_sensors', this._lang)}
        @value-changed=${this._presenceChanged}
      ></ha-form>
      <p class="hint">${localize('editor.presence_hint', this._lang)}</p>
    `;
  }

  private _renderEntitiesSection(): TemplateResult {
    const areaId = this._config.area;
    const pinnedEntities = this._config.entities || [];
    const pinnedIds = new Set(pinnedEntities.map((e) => e.entity));

    // Get area entities grouped by domain
    const grouped = areaId ? getAreaEntitiesByDomain(this.hass, areaId) : {};

    return html`
      <h3>${localize('editor.section_entities', this._lang)}</h3>

      ${pinnedEntities.length >= MAX_ENTITIES
        ? html`<p class="max-warning">${localize('editor.max_entities', this._lang)}</p>`
        : nothing}

      <!-- Pinned entities (reorderable) -->
      ${pinnedEntities.length > 0
        ? html`
            <div class="entity-list" style="margin-bottom: 12px;">
              ${pinnedEntities.map(
                (entityConfig, index) => html`
                  <div class="entity-row">
                    <ha-icon
                      .icon=${entityConfig.icon ||
                      DOMAIN_ICONS[getDomain(entityConfig.entity)] ||
                      'mdi:help-circle'}
                    ></ha-icon>
                    <span class="entity-name"
                      >${entityConfig.name || getEntityName(this.hass, entityConfig.entity)}</span
                    >
                    <span class="domain-badge">${getDomain(entityConfig.entity)}</span>
                    <div class="reorder-buttons">
                      <button
                        @click=${() => this._moveEntity(index, -1)}
                        ?disabled=${index === 0}
                        aria-label=${localize('editor.move_up', this._lang)}
                      >
                        ▲
                      </button>
                      <button
                        @click=${() => this._moveEntity(index, 1)}
                        ?disabled=${index === pinnedEntities.length - 1}
                        aria-label=${localize('editor.move_down', this._lang)}
                      >
                        ▼
                      </button>
                    </div>
                    <ha-icon-button
                      .label=${localize('editor.unpin_entity', this._lang)}
                      @click=${() => this._unpinEntity(index)}
                    >
                      <ha-icon icon="mdi:close"></ha-icon>
                    </ha-icon-button>
                  </div>
                `,
              )}
            </div>
          `
        : nothing}

      <!-- Available entities by domain -->
      ${Object.entries(grouped).map(
        ([domain, entityIds]) => html`
          ${entityIds
            .filter((id) => !pinnedIds.has(id))
            .map(
              (entityId) => html`
                <div class="entity-row">
                  <ha-icon .icon=${DOMAIN_ICONS[domain] || 'mdi:help-circle'}></ha-icon>
                  <span class="entity-name">${getEntityName(this.hass, entityId)}</span>
                  <span class="domain-badge">${domain}</span>
                  <ha-icon-button
                    .label=${localize('editor.pin_entity', this._lang)}
                    @click=${() => this._pinEntity(entityId)}
                    ?disabled=${pinnedEntities.length >= MAX_ENTITIES}
                  >
                    <ha-icon icon="mdi:plus"></ha-icon>
                  </ha-icon-button>
                </div>
              `,
            )}
        `,
      )}
    `;
  }

  private _renderAdvancedSection(): TemplateResult {
    return html`
      <button class="advanced-toggle" @click=${() => (this._showAdvanced = !this._showAdvanced)}>
        <ha-icon icon=${this._showAdvanced ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
        ${localize('editor.section_advanced', this._lang)}
      </button>

      ${this._showAdvanced
        ? html`
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${ACTION_SCHEMA}
              .computeLabel=${(item: { name: string }) =>
                localize(`editor.${item.name}`, this._lang)}
              @value-changed=${this._actionsChanged}
            ></ha-form>
          `
        : nothing}
    `;
  }

  // --- Event handlers ---

  private _areaChanged(e: CustomEvent): void {
    const value = e.detail?.value;
    if (value === this._config.area) return;
    this._updateConfig({ area: value || undefined, entities: [], presence_entity: undefined });
  }

  private _nameChanged(e: Event): void {
    this._updateConfig({ name: (e.target as HTMLInputElement).value || undefined });
  }

  private _navPathChanged(e: Event): void {
    this._updateConfig({ navigation_path: (e.target as HTMLInputElement).value || undefined });
  }

  private _presetChanged(preset: ColorPreset): void {
    this._updateConfig({ color_preset: preset });
  }

  private _cardIconChanged(e: CustomEvent): void {
    const value = e.detail?.value;
    this._updateConfig({ card_icon: value || undefined });
  }

  private _imageUrlChanged(e: Event): void {
    this._updateConfig({ image_url: (e.target as HTMLInputElement).value || undefined });
  }

  private _roomTypeChanged(e: CustomEvent): void {
    const value = e.detail?.value?.room_type;
    this._updateConfig({ room_type: value && value !== 'auto' ? value : undefined });
  }

  /** Keep YAML tidy: no key for none, a plain string for one sensor, a list for several */
  private _presenceChanged(e: CustomEvent): void {
    const value: string[] = e.detail?.value?.presence_entity || [];
    this._updateConfig({
      presence_entity: value.length > 1 ? value : value[0] || undefined,
    });
  }

  private _pinEntity(entityId: string): void {
    const entities = [...(this._config.entities || [])];
    if (entities.length >= MAX_ENTITIES) return;
    entities.push({ entity: entityId });
    this._updateConfig({ entities });
  }

  private _unpinEntity(index: number): void {
    const entities = [...(this._config.entities || [])];
    entities.splice(index, 1);
    this._updateConfig({ entities });
  }

  private _moveEntity(index: number, direction: number): void {
    const entities = [...(this._config.entities || [])];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= entities.length) return;
    [entities[index], entities[newIndex]] = [entities[newIndex], entities[index]];
    this._updateConfig({ entities });
  }

  private _actionsChanged(e: CustomEvent): void {
    const value = e.detail?.value as Partial<AreaControlCardConfig> | undefined;
    if (!value) return;
    this._updateConfig({
      tap_action: value.tap_action,
      hold_action: value.hold_action,
      double_tap_action: value.double_tap_action,
    });
  }

  private _updateConfig(updates: Partial<AreaControlCardConfig>): void {
    this._config = { ...this._config, ...updates };
    fireEvent(this, 'config-changed', { config: this._config });
  }
}
