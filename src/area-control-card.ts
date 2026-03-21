import { LitElement, html, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AreaControlCardConfig, HomeAssistant } from './types';
import { CARD_TAG, EDITOR_TAG, CARD_VERSION, DEFAULT_CONFIG, DOMAIN_ICONS } from './const';
import { applyColorVariables } from './utils/colors';
import { getDomain, isEntityActive, isEntityUnavailable, toggleEntity, navigate, fireEvent } from './utils/ha-helpers';
import { localize } from './utils/localize';
import { cardStyles } from './styles';

// Register editor as side effect
import './editor';

console.info(`%c AREA-CONTROL-CARD %c v${CARD_VERSION} `, 'color: white; background: #0764FA; font-weight: bold;', 'color: #0764FA; background: white; font-weight: bold;');

@customElement(CARD_TAG)
export class AreaControlCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: AreaControlCardConfig;

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  public static getStubConfig(): Partial<AreaControlCardConfig> {
    return {
      ...DEFAULT_CONFIG,
      color_preset: 'ocean',
      background_mode: 'gradient',
      entities: [],
    };
  }

  public setConfig(config: Partial<AreaControlCardConfig>): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
    } as AreaControlCardConfig;
  }

  public getCardSize(): number {
    return 3;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('_config') && this._config) {
      applyColorVariables(this, this._config.color_preset);
    }
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const lang = this.hass.language || 'en';
    const areaId = this._config.area;
    const area = areaId ? this.hass.areas?.[areaId] : undefined;
    const roomName = this._config.name || area?.name || localize('card.no_area', lang);

    // Presence state
    const presenceEntity = this._config.presence_entity;
    const presenceState = presenceEntity ? this.hass.states[presenceEntity] : undefined;
    const isOccupied = presenceState?.state === 'on';

    // State text
    let stateText = '';
    if (presenceEntity) {
      stateText = isOccupied
        ? localize('card.occupied', lang)
        : localize('card.clear', lang);
    }

    const entities = this._config.entities || [];

    return html`
      <ha-card>
        <div
          class="card ${isOccupied ? 'occupied' : ''}"
          @click=${this._handleCardClick}
        >
          ${this._renderBackground(isOccupied)}
          ${isOccupied ? html`<div class="presence-badge"></div>` : nothing}
          <div class="info">
            <div class="room-name">${roomName}</div>
            ${stateText ? html`<div class="room-state">${stateText}</div>` : nothing}
          </div>
          <div class="chips-container">
            ${entities.map((entityConfig) => this._renderChip(entityConfig))}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderBackground(isOccupied: boolean): TemplateResult {
    if (this._config.background_mode === 'image' && this._config.image_url) {
      return html`
        <div class="image-background ${isOccupied ? 'animated' : ''}">
          <img src=${this._config.image_url} alt="" loading="lazy" />
        </div>
      `;
    }

    return html`
      <div class="gradient-blob ${isOccupied ? 'animated' : ''}"></div>
    `;
  }

  private _renderChip(entityConfig: { entity: string; icon?: string; name?: string }): TemplateResult {
    const stateObj = this.hass.states[entityConfig.entity];
    const domain = getDomain(entityConfig.entity);
    const unavailable = isEntityUnavailable(stateObj);
    const active = !unavailable && stateObj ? isEntityActive(stateObj) : false;

    const icon = entityConfig.icon || (stateObj?.attributes.icon as string) || DOMAIN_ICONS[domain] || 'mdi:help-circle';
    const chipClass = unavailable ? 'unavailable' : active ? 'active' : 'inactive';

    // Spin fan icon when active
    const shouldSpin = active && domain === 'fan';

    return html`
      <button
        class="chip ${chipClass}"
        @click=${(e: Event) => this._handleChipClick(e, entityConfig.entity)}
        title=${entityConfig.name || (stateObj?.attributes.friendly_name as string) || entityConfig.entity}
      >
        <ha-icon
          class=${shouldSpin ? 'icon-spin' : ''}
          .icon=${icon}
        ></ha-icon>
      </button>
    `;
  }

  private _handleChipClick(e: Event, entityId: string): void {
    e.stopPropagation();
    const stateObj = this.hass.states[entityId];
    if (isEntityUnavailable(stateObj)) return;
    toggleEntity(this.hass, entityId);
  }

  private _handleCardClick(): void {
    const action = this._config.tap_action;
    if (!action) return;

    if (action.action === 'navigate') {
      const path = this._config.navigation_path || (action as { navigation_path?: string }).navigation_path;
      if (path) {
        navigate(path);
      }
    } else if (action.action === 'more-info' && this._config.entities?.length > 0) {
      fireEvent(this, 'hass-more-info', {
        entityId: this._config.entities[0].entity,
      });
    }
  }
}

// Ensure HA knows about the card
(window as unknown as Record<string, unknown[]>).customCards =
  (window as unknown as Record<string, unknown[]>).customCards || [];
(window as unknown as Record<string, unknown[]>).customCards.push({
  type: CARD_TAG,
  name: 'Area Control Card',
  description: 'A beautiful, interactive room control panel with area auto-discovery',
  preview: true,
  documentationURL: 'https://github.com/area-control-card',
});
