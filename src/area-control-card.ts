import { LitElement, html, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AreaControlCardConfig, EntityConfig, HassArea, HomeAssistant, RoomType } from './types';
import {
  CARD_TAG,
  EDITOR_TAG,
  CARD_VERSION,
  DEFAULT_CONFIG,
  DOMAIN_COLORS,
  DOMAIN_ICONS,
} from './const';
import { applyColorVariables, hexToRgba } from './utils/colors';
import {
  getDomain,
  isEntityActive,
  isEntityUnavailable,
  toggleEntity,
  fireEvent,
} from './utils/ha-helpers';
import { discoverAreaEntities } from './utils/area-entities';
import { hassChangedForCard } from './utils/should-update';
import { localize } from './utils/localize';
import { normalizeConfig } from './utils/config';
import {
  ActionKind,
  ResolvedActions,
  hasAnyAction,
  resolveActions,
  resolveChipAction,
} from './utils/actions';
import { ActionGesture } from './utils/action-gesture';
import { resolveRoomType } from './utils/room-type';
import { renderScene } from './scenes';
import { sceneStyles } from './scenes/scene-styles';
import { cardStyles } from './styles';

// Register editor as side effect
import './editor';

console.info(
  `%c AREA-CONTROL-CARD %c v${CARD_VERSION} `,
  'color: white; background: #0764FA; font-weight: bold;',
  'color: #0764FA; background: white; font-weight: bold;',
);

@customElement(CARD_TAG)
export class AreaControlCard extends LitElement {
  static styles = [cardStyles, sceneStyles];

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: AreaControlCardConfig;

  private _actions!: ResolvedActions;
  private _watched: string[] = [];
  private _discovery?: {
    entities: HomeAssistant['entities'];
    devices: HomeAssistant['devices'];
    areaId: string;
    result: EntityConfig[];
  };
  private _gesture = new ActionGesture(
    (kind) => this._runAction(kind),
    (kind) => this._actions?.[`${kind}_action`]?.action !== 'none',
  );

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._gesture.dispose();
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  public static getStubConfig(): Partial<AreaControlCardConfig> {
    return {
      ...DEFAULT_CONFIG,
      color_preset: 'ocean',
      entities: [],
    };
  }

  public setConfig(config: Partial<AreaControlCardConfig>): void {
    this._config = normalizeConfig(config);
    this._actions = resolveActions(this._config);
  }

  public getCardSize(): number {
    return 3;
  }

  // Sections view (HA 2024.8+)
  public getGridOptions() {
    return { columns: 6, rows: 3, min_columns: 4, min_rows: 2 };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!changedProps.has('hass') || changedProps.size > 1 || !this._config) return true;
    return hassChangedForCard(
      changedProps.get('hass') as HomeAssistant | undefined,
      this.hass,
      this._watched,
    );
  }

  /** The registries only change on registry updates, so cache discovery between state changes. */
  private _discover(areaId: string): EntityConfig[] {
    const { entities, devices } = this.hass;
    const cache = this._discovery;
    if (
      cache &&
      cache.entities === entities &&
      cache.devices === devices &&
      cache.areaId === areaId
    ) {
      return cache.result;
    }
    const result = discoverAreaEntities(this.hass, areaId);
    this._discovery = { entities, devices, areaId, result };
    return result;
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

    // Presence: occupied while any chosen sensor is on
    const presenceEntities = this._config.presence_entities;
    const isOccupied = presenceEntities.some((id) => this.hass.states[id]?.state === 'on');

    // State text
    let stateText = '';
    if (presenceEntities.length) {
      stateText = isOccupied ? localize('card.occupied', lang) : localize('card.clear', lang);
    }

    let entities = this._config.entities || [];

    // Auto-discover entities from area when none are manually pinned
    if (entities.length === 0 && areaId) {
      entities = this._discover(areaId);
    }

    this._watched = [...entities.map((e) => e.entity), ...presenceEntities];

    // Domains with an active entity on the card, so the room scene can reflect them
    const activeDomains = new Set(
      entities
        .map((e) => this.hass.states[e.entity])
        .filter((stateObj) => stateObj && isEntityActive(stateObj))
        .map((stateObj) => getDomain(stateObj.entity_id)),
    );

    // Entity-less actions (navigate) work as configured; more-info falls back to what is shown
    this._actions = resolveActions(this._config, entities[0]?.entity);
    const clickable = hasAnyAction(this._actions);

    return html`
      <ha-card>
        <div
          class="card ${isOccupied ? 'occupied' : ''} ${clickable ? 'clickable' : ''}"
          role=${clickable ? 'button' : nothing}
          tabindex=${clickable ? '0' : nothing}
          aria-label=${clickable ? roomName : nothing}
          @pointerdown=${() => this._gesture.down()}
          @pointerup=${() => this._gesture.up()}
          @pointerleave=${() => this._gesture.cancel()}
          @pointercancel=${() => this._gesture.cancel()}
          @contextmenu=${(e: Event) =>
            this._actions.hold_action.action !== 'none' && e.preventDefault()}
          @keydown=${this._handleKeyDown}
        >
          ${isOccupied
            ? html`<div
                class="presence-badge"
                role="img"
                aria-label=${localize('card.occupied', lang)}
              ></div>`
            : nothing}
          <div class="room-name">${roomName}</div>
          <div
            class="chips-container"
            @pointerdown=${(e: Event) => e.stopPropagation()}
            @pointerup=${(e: Event) => e.stopPropagation()}
            @keydown=${(e: Event) => e.stopPropagation()}
          >
            ${entities.map((entityConfig) => this._renderChip(entityConfig))}
          </div>
          ${this._renderBottomVisual(area, isOccupied, activeDomains)}
          ${stateText ? html`<div class="room-state">${stateText}</div>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderBottomVisual(
    area: HassArea | undefined,
    isOccupied: boolean,
    activeDomains: Set<string>,
  ): TemplateResult {
    // Priority 1: card_icon config
    if (this._config.card_icon) {
      return this._renderIconVisual(this._config.card_icon, isOccupied);
    }

    // Priority 2: Custom image URL
    if (this._config.image_url) {
      return this._renderImageVisual(this._config.image_url, isOccupied);
    }

    // Priority 3: a room scene chosen in the config. Priority 5: one guessed from the area.
    const room = resolveRoomType(this._config, area);
    if (room?.explicit) {
      return this._renderSceneVisual(room.type, isOccupied, activeDomains);
    }

    // Priority 4: HA area picture
    if (area?.picture) {
      return this._renderImageVisual(area.picture, isOccupied);
    }

    if (room) {
      return this._renderSceneVisual(room.type, isOccupied, activeDomains);
    }

    // Priority 6: the area's own icon
    if (area?.icon) {
      return this._renderIconVisual(area.icon, isOccupied);
    }

    // Priority 7: Gradient blob fallback
    return html` <div class="gradient-blob ${isOccupied ? 'animated' : ''}"></div> `;
  }

  private _renderIconVisual(icon: string, isOccupied: boolean): TemplateResult {
    return html`
      <div class="bottom-visual icon-visual ${isOccupied ? 'animated' : ''}">
        <ha-icon .icon=${icon}></ha-icon>
      </div>
    `;
  }

  private _renderImageVisual(src: string, isOccupied: boolean): TemplateResult {
    return html`
      <div class="bottom-visual image-visual ${isOccupied ? 'animated' : ''}">
        <img src=${src} alt="" loading="lazy" />
      </div>
    `;
  }

  private _renderSceneVisual(
    type: RoomType,
    isOccupied: boolean,
    activeDomains: Set<string>,
  ): TemplateResult {
    const classes = [
      isOccupied ? 'motion' : '',
      activeDomains.has('light') ? 'lights-on' : '',
      activeDomains.has('fan') ? 'fan-on' : '',
      activeDomains.has('media_player') ? 'media-on' : '',
    ].join(' ');
    return html`
      <div
        class="bottom-visual scene-visual ${classes}"
        role="img"
        aria-label=${localize(`room.${type}`, this.hass.language || 'en')}
      >
        <svg viewBox="0 0 160 120" preserveAspectRatio="xMinYMax meet" aria-hidden="true">
          ${renderScene(type)}
        </svg>
      </div>
    `;
  }

  private _renderChip(entityConfig: EntityConfig): TemplateResult {
    const stateObj = this.hass.states[entityConfig.entity];
    const domain = getDomain(entityConfig.entity);
    const unavailable = isEntityUnavailable(stateObj);
    const active = !unavailable && stateObj ? isEntityActive(stateObj) : false;

    const icon =
      entityConfig.icon ||
      (stateObj?.attributes.icon as string) ||
      DOMAIN_ICONS[domain] ||
      'mdi:help-circle';
    const chipClass = unavailable ? 'unavailable' : active ? 'active' : 'inactive';
    const label =
      entityConfig.name || (stateObj?.attributes.friendly_name as string) || entityConfig.entity;
    const oneShot = ['scene', 'script', 'button', 'input_button'].includes(domain);
    const color = DOMAIN_COLORS[domain];
    const colorStyle = color ? `--chip-color: ${color}; --chip-glow: ${hexToRgba(color, 0.6)}` : '';

    return html`
      <button
        class="chip ${chipClass} d-${domain}"
        style=${colorStyle}
        @click=${(e: Event) => this._handleChipClick(e, entityConfig)}
        title=${label}
        aria-label=${label}
        aria-pressed=${oneShot ? nothing : String(active)}
        ?disabled=${unavailable}
      >
        <ha-icon .icon=${icon}></ha-icon>
      </button>
    `;
  }

  private _handleChipClick(e: Event, entityConfig: EntityConfig): void {
    e.stopPropagation();
    const entityId = entityConfig.entity;
    const stateObj = this.hass.states[entityId];
    if (isEntityUnavailable(stateObj)) return;

    const chipAction = resolveChipAction(entityConfig);
    if (chipAction) {
      if (chipAction.action === 'none') return;
      fireEvent(this, 'hass-action', {
        config: { entity: entityId, tap_action: chipAction },
        action: 'tap',
      });
      return;
    }
    // Unlocking is security-sensitive: require explicit confirmation
    if (getDomain(entityId) === 'lock' && stateObj.state === 'locked') {
      const lang = this.hass.language || 'en';
      const name = (stateObj.attributes.friendly_name as string) || entityId;
      if (!window.confirm(`${localize('card.confirm_unlock', lang)} ${name}?`)) return;
    }
    toggleEntity(this.hass, entityId);
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._gesture.key();
    }
  }

  private _runAction(kind: ActionKind): void {
    const action = this._actions[`${kind}_action`];
    if (action.action === 'none') return;
    // Let the HA frontend execute the action (navigate, more-info, perform-action, url, ...)
    fireEvent(this, 'hass-action', {
      config: {
        entity: this._actions.entity,
        tap_action: this._actions.tap_action,
        hold_action: this._actions.hold_action,
        double_tap_action: this._actions.double_tap_action,
      },
      action: kind,
    });
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
  documentationURL: 'https://github.com/crs2007/area-control-card',
});
