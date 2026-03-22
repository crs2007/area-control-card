import { LitElement, html, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AreaControlCardConfig, HomeAssistant, EntityConfig } from './types';
import { EDITOR_TAG, COLOR_PRESETS, MAX_ENTITIES, DOMAIN_ICONS, SUPPORTED_DOMAINS, DEFAULT_CONFIG } from './const';
import { getAreaEntitiesByDomain, getPresenceSensors } from './utils/area-entities';
import { getEntityName, getDomain, fireEvent } from './utils/ha-helpers';
import { localize } from './utils/localize';
import { editorStyles } from './styles';
import type { ColorPreset } from './types';

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
        ${this._renderRoomSection()}
        ${this._renderAppearanceSection()}
        ${this._renderPresenceSection()}
        ${this._renderEntitiesSection()}
        ${this._renderAdvancedSection()}
      </div>
    `;
  }

  private _renderRoomSection(): TemplateResult {
    const areas = this.hass.areas ? Object.values(this.hass.areas) : [];

    return html`
      <h3>${localize('editor.section_room', this._lang)}</h3>

      <ha-select
        .label=${localize('editor.area', this._lang)}
        .value=${this._config.area || ''}
        @change=${this._areaChanged}
        @closed=${(e: Event) => e.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${areas.map(
          (area) => html`
            <ha-list-item .value=${area.area_id}>${area.name}</ha-list-item>
          `,
        )}
      </ha-select>

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
              title=${preset}
            ></button>
          `,
        )}
      </div>

      <ha-select
        .label=${localize('editor.background_mode', this._lang)}
        .value=${this._config.background_mode || 'gradient'}
        @change=${this._backgroundModeChanged}
        @closed=${(e: Event) => e.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        <ha-list-item value="gradient">${localize('editor.gradient', this._lang)}</ha-list-item>
        <ha-list-item value="image">${localize('editor.image', this._lang)}</ha-list-item>
      </ha-select>

      ${this._config.background_mode === 'image'
        ? html`
            <ha-textfield
              .label=${localize('editor.image_url', this._lang)}
              .value=${this._config.image_url || ''}
              @input=${this._imageUrlChanged}
            ></ha-textfield>
          `
        : nothing}
    `;
  }

  private _renderPresenceSection(): TemplateResult {
    const areaId = this._config.area;
    const sensors = areaId ? getPresenceSensors(this.hass, areaId) : [];

    return html`
      <h3>${localize('editor.section_presence', this._lang)}</h3>

      <ha-select
        .label=${localize('editor.section_presence', this._lang)}
        .value=${this._config.presence_entity || ''}
        @change=${this._presenceChanged}
        @closed=${(e: Event) => e.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        <ha-list-item value="">${localize('editor.no_sensor', this._lang)}</ha-list-item>
        ${sensors.map(
          (entityId) => html`
            <ha-list-item .value=${entityId}>
              ${getEntityName(this.hass, entityId)}
            </ha-list-item>
          `,
        )}
      </ha-select>
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
                    <ha-icon .icon=${entityConfig.icon || DOMAIN_ICONS[getDomain(entityConfig.entity)] || 'mdi:help-circle'}></ha-icon>
                    <span class="entity-name">${entityConfig.name || getEntityName(this.hass, entityConfig.entity)}</span>
                    <span class="domain-badge">${getDomain(entityConfig.entity)}</span>
                    <div class="reorder-buttons">
                      <button @click=${() => this._moveEntity(index, -1)} ?disabled=${index === 0}>▲</button>
                      <button @click=${() => this._moveEntity(index, 1)} ?disabled=${index === pinnedEntities.length - 1}>▼</button>
                    </div>
                    <ha-icon-button @click=${() => this._unpinEntity(index)}>
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
            <ha-textfield
              .label=${localize('editor.tap_action', this._lang)}
              .value=${this._config.tap_action?.action || 'navigate'}
              @input=${(e: Event) => this._actionChanged('tap_action', (e.target as HTMLInputElement).value)}
            ></ha-textfield>
            <ha-textfield
              .label=${localize('editor.hold_action', this._lang)}
              .value=${this._config.hold_action?.action || 'more-info'}
              @input=${(e: Event) => this._actionChanged('hold_action', (e.target as HTMLInputElement).value)}
            ></ha-textfield>
          `
        : nothing}
    `;
  }

  // --- Event handlers ---

  private _areaChanged(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
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

  private _backgroundModeChanged(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as 'gradient' | 'image';
    this._updateConfig({ background_mode: value });
  }

  private _imageUrlChanged(e: Event): void {
    this._updateConfig({ image_url: (e.target as HTMLInputElement).value || undefined });
  }

  private _presenceChanged(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this._updateConfig({ presence_entity: value || undefined });
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

  private _actionChanged(key: string, value: string): void {
    this._updateConfig({ [key]: { action: value } });
  }

  private _updateConfig(updates: Partial<AreaControlCardConfig>): void {
    this._config = { ...this._config, ...updates };
    fireEvent(this, 'config-changed', { config: this._config });
  }
}
