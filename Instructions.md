# Area Control Card — Project Plan

> **A reusable, GUI-configurable Home Assistant custom Lovelace card for room/area control with HACS distribution.**

---

## 1. Vision & Motivation

### The Problem

Building a rich, per-room control card in Home Assistant today requires hand-crafting 100+ lines of YAML per room using `button-card`, `mushroom`, and `card_mod`. Every new room means copy-pasting, renaming entities, adjusting colors — and one typo breaks the whole card. There is no visual editor, no area-awareness, and no reuse.

### The Goal

**`area-control-card`** is a single custom card that gives any HA user a beautiful, interactive room control panel — configured entirely through the visual editor (GUI). Pick an area, and the card auto-discovers devices. Pick a color theme, and the entire card adapts. Pick a presence sensor, and the card comes alive when someone walks in. Zero YAML required.

### Target Users

| Persona | Need |
|---------|------|
| **Beginner HA user** | Pretty room card without writing YAML |
| **Power user** | Reusable template across 10+ rooms, consistent look |
| **Dashboard designer** | Customizable themes, animations, professional feel |
| **Community contributor** | i18n-ready, extensible architecture, clean codebase |

### Success Criteria

- [ ] One-click install via HACS
- [ ] Full GUI editor — zero YAML needed for basic setup
- [ ] Works across any HA instance with no dependencies on other custom cards
- [ ] Under 100KB gzipped bundle
- [ ] Renders correctly on mobile, tablet, desktop, and cast displays
- [ ] 50+ GitHub stars within 3 months of launch (stretch goal)

---

## 2. Feature Specification

### 2.1 Core Card Layout

```
┌──────────────────────────────────────────────┐
│  [Room Name]              [chip] [chip] [chip]│
│  [Presence State]         [chip] [chip] [chip]│
│  [Animated Gradient       [chip] [chip]       │
│   or Custom Image]                            │
│                                               │
│         ● Occupied badge (when active)        │
└──────────────────────────────────────────────┘
```

**Layout behavior:**
- Room name + state on the left
- Entity chip row on the right (up to 8 chips, wrapping into a 2-column grid)
- Background: animated gradient blob OR custom image (user choice)
- Card uses glassmorphism: backdrop blur + semi-transparent background + subtle border
- Tap on card navigates to room sub-dashboard (configurable path)

### 2.2 Area & Entity Discovery

| Feature | Detail |
|---------|--------|
| **Area picker** | GUI dropdown lists all HA areas. Selection filters entities to that area only. |
| **Auto-discovery** | Once area is selected, card fetches all entities in that area via `hass.areas`, `hass.devices`, `hass.entities`. |
| **Entity picker** | GUI shows checkboxes of discovered entities, grouped by domain. User pins up to 8. |
| **Pin/unpin favorites** | Pinned entities appear as chips. Unpinned entities are hidden but still available. |
| **Manual override** | User can add entities NOT in the area (edge case: virtual entities, helpers, etc.). |
| **Entity ordering** | Pinned entities can be reordered in the GUI via up/down buttons. |

**How area auto-detect works internally:**

```
User selects area "Office"
  → hass.areas["office"] → area_id
  → hass.devices filtered by area_id → device_ids[]
  → hass.entities filtered by device_id ∈ device_ids[] → entity_ids[]
  → Group by domain (light.*, fan.*, media_player.*, etc.)
  → Present in GUI for pin/unpin
```

### 2.3 Supported Entity Types & Controls

Each entity domain gets a **chip** (tap = primary action) and a **long-press popup** (detailed control):

| Domain | Chip Tap Action | Long-Press Popup | Chip Icon |
|--------|----------------|------------------|-----------|
| `light` | Toggle on/off | Brightness slider, color temp, RGB picker | `mdi:lightbulb` (auto) |
| `fan` | Toggle on/off | Speed percentage slider, direction toggle, oscillation | `mdi:fan` (auto) |
| `media_player` | Toggle on/off | Volume slider, source selector, play/pause/stop | `mdi:television` (auto) |
| `switch` | Toggle on/off | State display, last changed timestamp | `mdi:power-plug` (auto) |
| `climate` | Toggle on/off | Temperature slider, HVAC mode selector, fan mode | `mdi:thermometer` (auto) |
| `cover` | Toggle open/close | Position slider (0-100%), tilt slider if supported | `mdi:blinds` (auto) |
| `lock` | Toggle lock/unlock | State display, lock/unlock confirmation dialog | `mdi:lock` (auto) |
| `scene` / `script` | Activate | Last activated timestamp, description | `mdi:palette` / `mdi:script` |

**Chip visual states:**
- **Active (ON):** Colored background (from theme) + white icon + glow animation
- **Inactive (OFF):** Transparent background + muted icon
- **Unavailable:** Greyed out + strikethrough icon + tooltip "Entity unavailable"

**Long-press popup specification:**
- Popup appears as a `ha-dialog` (native HA dialog) anchored to the chip
- Contains domain-specific controls (see table above)
- "More Info" button opens the native HA entity dialog
- Popup dismisses on outside click or Escape key

**Icon handling:**
- Default: auto-detected from entity domain
- Override: user can set custom MDI icon per entity in the GUI editor
- State-based: icons can change based on entity state (e.g., `mdi:fan` spins when fan is on)

### 2.4 Presence / Motion Sensor

| Feature | Detail |
|---------|--------|
| **Sensor picker** | GUI dropdown filters to `binary_sensor.*` entities in the selected area with `device_class: occupancy, motion, presence`. |
| **Occupied state** | When sensor = `on`: card shows animated badge + image/gradient starts animating + border glow. |
| **Clear state** | When sensor = `off`: badge hidden, image/gradient static, border glow off. |
| **Badge** | Small pulsing dot or icon (configurable) overlaid on the card corner. |
| **Image animation** | When occupied: gentle CSS scale/pulse animation on the room image or gradient shift on the animated blob. |
| **Border glow** | Subtle colored box-shadow pulse matching the card's primary theme color. |
| **No sensor** | If no sensor is selected, the card functions normally without presence features. |

### 2.5 Color Palette System

Six built-in presets, each defining 5 CSS variables:

| Preset | Primary | Accent | Glow Active | Glow Secondary | Background Tint |
|--------|---------|--------|-------------|----------------|-----------------|
| **Ocean** | `#0764FA` | `#8ACDD7` | `rgba(138,205,215,0.8)` | `rgba(7,100,250,0.3)` | `rgba(7,100,250,0.08)` |
| **Sunset** | `#E85D3A` | `#DF826C` | `rgba(223,130,108,0.8)` | `rgba(232,93,58,0.3)` | `rgba(232,93,58,0.08)` |
| **Forest** | `#2D8A4E` | `#7BC67E` | `rgba(123,198,126,0.8)` | `rgba(45,138,78,0.3)` | `rgba(45,138,78,0.08)` |
| **Lavender** | `#7C3AED` | `#A78BFA` | `rgba(167,139,250,0.8)` | `rgba(124,58,237,0.3)` | `rgba(124,58,237,0.08)` |
| **Amber** | `#D97706` | `#FCD34D` | `rgba(252,211,77,0.8)` | `rgba(217,119,6,0.3)` | `rgba(217,119,6,0.08)` |
| **Slate** | `#475569` | `#94A3B8` | `rgba(148,163,184,0.8)` | `rgba(71,85,105,0.3)` | `rgba(71,85,105,0.08)` |

**Theme-aware behavior:**
- In HA dark mode: card background uses the tint color at low opacity over dark
- In HA light mode: card background uses the tint color at low opacity over light
- Text color auto-adapts: white on dark, dark on light

### 2.6 Room Image / Animated Gradient

**Option A — Custom Image:**
- User provides a URL or uploads an image (stored as URL string in config)
- Image rendered as CSS `background-image` with `object-fit: cover`
- Rounded corners clipped to card radius
- When presence sensor active: gentle `scale(1.02)` breathing animation
- When inactive: static

**Option B — Animated Gradient (Default):**
- CSS animated gradient blob using the card's color preset
- Gradient uses `radial-gradient` with two theme colors
- When presence sensor active: gradient shifts and pulses
- When inactive: static gradient
- Positioned in bottom-left corner (like your current card's blue circle)

**GUI toggle:** Radio buttons in editor — "Custom Image" vs "Animated Gradient"

### 2.7 Navigation

| Config Key | Type | Default | Description |
|-----------|------|---------|-------------|
| `navigation_path` | string | (none) | Path to navigate on card tap (e.g., `/dashboard-mushroom/office`) |
| `tap_action` | object | `{ action: 'navigate' }` | Standard HA tap_action config |
| `hold_action` | object | `{ action: 'more-info' }` | Standard HA hold_action config |
| `double_tap_action` | object | `{ action: 'none' }` | Standard HA double_tap_action config |

### 2.8 Visual Editor (GUI)

The editor is a standard HA `LitElement` form rendered in the card editor panel. It has these sections:

**Section 1 — Room Setup**
- Area dropdown (populated from `hass.areas`)
- Room display name (text input, defaults to area name)
- Navigation path (text input)

**Section 2 — Appearance**
- Color preset picker (6 swatches, click to select)
- Background mode toggle: "Animated Gradient" | "Custom Image"
- Image URL input (shown only when "Custom Image" selected)
- Preview thumbnail showing current color + background choice

**Section 3 — Presence Sensor**
- Dropdown of `binary_sensor.*` entities in selected area (filtered by device_class)
- "None" option to disable presence features

**Section 4 — Entity Controls**
- Auto-populated list from area entities, grouped by domain
- Each entity row: checkbox (pin/unpin) + icon preview + friendly name + domain badge
- Pinned entities shown at top with drag handles or up/down buttons for reorder
- Maximum 8 pinned entities enforced in UI
- Per-entity overrides (expandable): custom icon, custom name

**Section 5 — Advanced (collapsed by default)**
- Tap/hold/double-tap action configurators
- Custom CSS class input
- Card size override (for dashboard grid)

### 2.9 Internationalization (i18n)

**Architecture:**
```
src/
  locales/
    en.json      ← English (default, always shipped)
    he.json      ← Hebrew (shipped by author)
    translations/ ← Community contributions
      README.md   ← "How to add a language"
```

**Translation keys example (`en.json`):**
```json
{
  "editor": {
    "section_room": "Room Setup",
    "area": "Area",
    "display_name": "Display Name",
    "section_appearance": "Appearance",
    "color_preset": "Color Theme",
    "background_mode": "Background",
    "gradient": "Animated Gradient",
    "image": "Custom Image",
    "image_url": "Image URL",
    "section_presence": "Presence Sensor",
    "no_sensor": "None",
    "section_entities": "Entity Controls",
    "pin_entity": "Show on card",
    "max_entities": "Maximum 8 entities",
    "section_advanced": "Advanced"
  },
  "card": {
    "occupied": "Occupied",
    "clear": "Clear",
    "unavailable": "Unavailable",
    "unknown": "Unknown"
  }
}
```

**Language detection:** reads `hass.language` and falls back to `en`.

**Community contribution flow:**
1. Fork repo
2. Copy `en.json` → `{locale}.json`
3. Translate values
4. Submit PR
5. Maintainer merges → next release includes new language

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Card rendering** | LitElement + TypeScript | HA standard; used by mushroom, mini-graph, etc. Best ecosystem fit. |
| **Styling** | CSS-in-JS via Lit `css` tag | Scoped Shadow DOM styles, no leaking. |
| **Build** | Rollup | Standard for HA cards; tree-shaking, small output. |
| **Package manager** | npm | Standard for JS ecosystem. |
| **Linting** | ESLint + Prettier | Code consistency. |
| **Testing** | Vitest + @open-wc/testing | Fast, modern, Web Component compatible. |
| **CI/CD** | GitHub Actions | Auto-build, test, release. |
| **Distribution** | HACS (default) + manual | Maximum HA reach. |

### 3.2 Project Structure

```
area-control-card/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint + test on PR
│   │   ├── release.yml               # Build + create GitHub Release on tag
│   │   └── hacs-validate.yml         # HACS validation check
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── area-control-card.ts          # Main card element (LitElement)
│   ├── editor.ts                     # Visual editor element
│   ├── types.ts                      # TypeScript interfaces & config schema
│   ├── const.ts                      # Constants, defaults, presets
│   ├── styles.ts                     # CSS styles & animations
│   ├── utils/
│   │   ├── area-entities.ts          # Area → device → entity resolution
│   │   ├── colors.ts                 # Color preset logic
│   │   ├── localize.ts              # i18n loader & fallback
│   │   └── ha-helpers.ts            # HA API helper functions
│   ├── components/
│   │   ├── entity-chip.ts            # Single entity chip component
│   │   ├── entity-popup.ts           # Long-press popup dialog
│   │   ├── presence-badge.ts         # Presence indicator badge
│   │   ├── gradient-blob.ts          # Animated gradient background
│   │   └── image-background.ts       # Custom image background
│   └── locales/
│       ├── en.json
│       ├── he.json
│       └── translations/
│           └── README.md
├── test/
│   ├── card.test.ts
│   ├── editor.test.ts
│   ├── area-entities.test.ts
│   └── fixtures/
│       └── mock-hass.ts              # Mock HA state for tests
├── dist/                             # Built output (gitignored, created by CI)
│   └── area-control-card.js
├── hacs.json                         # HACS metadata
├── rollup.config.mjs                 # Build config
├── tsconfig.json
├── package.json
├── LICENSE                           # MIT
├── README.md                         # User-facing docs with screenshots
├── CONTRIBUTING.md                   # Developer guide
├── CHANGELOG.md
└── .prettierrc
```

### 3.3 Config Schema (TypeScript)

```typescript
interface AreaControlCardConfig {
  // Room
  area?: string;                    // HA area_id
  name?: string;                    // Display name override
  navigation_path?: string;         // Tap navigation target

  // Appearance
  color_preset: ColorPreset;        // 'ocean'|'sunset'|'forest'|'lavender'|'amber'|'slate'
  background_mode: 'gradient' | 'image';
  image_url?: string;               // Only when background_mode = 'image'

  // Presence
  presence_entity?: string;         // binary_sensor entity_id

  // Entities (ordered)
  entities: EntityConfig[];         // Max 8

  // Actions
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

interface EntityConfig {
  entity: string;                   // entity_id
  name?: string;                    // Display name override
  icon?: string;                    // MDI icon override
}

type ColorPreset = 'ocean' | 'sunset' | 'forest' | 'lavender' | 'amber' | 'slate';
```

### 3.4 Key Implementation Details

**Shadow DOM isolation:**
- All styles live inside Shadow DOM — no `card_mod` or global CSS needed
- Animations defined as `@keyframes` inside the shadow root
- No CSS leakage in or out

**Entity state subscription:**
- Card subscribes to `hass` object updates (standard Lit property)
- Only re-renders chips whose state actually changed (Lit's reactive update cycle)
- Presence sensor state checked on every `hass` update

**Area entity resolution (runtime):**
```typescript
function getAreaEntities(hass: HomeAssistant, areaId: string): string[] {
  const deviceIds = Object.values(hass.devices)
    .filter(d => d.area_id === areaId)
    .map(d => d.id);

  const entityEntries = Object.values(hass.entities)
    .filter(e => deviceIds.includes(e.device_id) || e.area_id === areaId);

  return entityEntries.map(e => e.entity_id);
}
```

**Long-press detection:**
- Use HA's built-in `ha-action` handler or implement 500ms touch/pointer hold
- On trigger, dispatch custom event that opens `entity-popup`

**Popup implementation:**
- Render as `ha-dialog` (HA's native dialog component)
- Contents vary by domain — use a factory pattern:
  ```typescript
  function renderPopupContent(domain: string, stateObj: HassEntity): TemplateResult
  ```

---

## 4. HACS Integration & Distribution

### 4.1 HACS Requirements

**`hacs.json`:**
```json
{
  "name": "Area Control Card",
  "render_readme": true,
  "filename": "area-control-card.js"
}
```

**Repository requirements:**
- [x] Public GitHub repository
- [x] `hacs.json` in root
- [x] `dist/area-control-card.js` created by GitHub Release action
- [x] Releases use GitHub Releases with semantic versioning tags (`v1.0.0`)
- [x] `README.md` with installation instructions and screenshots
- [x] Repository topics include `hacs`, `homeassistant`, `lovelace`

### 4.2 Installation Methods

**Method 1 — HACS (Primary):**
1. Open HACS → Frontend → "+" → Search "Area Control Card"
2. Install → Reload browser
3. Add card via visual editor

**Method 2 — Manual:**
1. Download `area-control-card.js` from latest GitHub Release
2. Copy to `config/www/area-control-card.js`
3. Add resource in HA: Settings → Dashboards → Resources → Add `/local/area-control-card.js`
4. Add card via visual editor

### 4.3 Release Pipeline (GitHub Actions)

```
Push tag v1.x.x
  → ci.yml: lint + test
  → release.yml:
      1. npm ci
      2. npm run build (rollup → dist/area-control-card.js)
      3. Create GitHub Release with dist/area-control-card.js as asset
      4. HACS picks up new release automatically
```

---

## 5. Design Specifications

### 5.1 Card Dimensions

| Property | Value |
|----------|-------|
| Min height | 200px |
| Default width | Full column width |
| Border radius | 16px |
| Padding | 22px |
| Chip size | 36px × 36px |
| Chip gap | 6px |
| Chip grid | max 2 columns, right-aligned |

### 5.2 Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Room name | 18px | 500 | `--acc-primary` |
| State text | 14px | 400 | `--acc-primary` at 70% opacity |
| Chip icons | 20px | — | White (active) / muted (inactive) |

### 5.3 Animations

| Animation | Trigger | CSS |
|-----------|---------|-----|
| **Chip glow** | Entity ON | `box-shadow` pulse, 2s infinite, using `--acc-glow-active` |
| **Gradient shift** | Presence ON | `background-position` shift, 4s ease infinite |
| **Image breathe** | Presence ON | `transform: scale(1.02)`, 3s ease infinite |
| **Presence badge pulse** | Presence ON | Scale + opacity pulse, 1.5s infinite |
| **Border glow** | Presence ON | `box-shadow` using `--acc-glow-secondary`, 2s infinite |
| **Icon spin** | Room occupied (room icon only) | `rotateY(360deg)`, 3s linear infinite |

### 5.4 Responsive Behavior

| Breakpoint | Adaptation |
|------------|------------|
| **< 300px** (small column) | Chips collapse to single column, image/gradient shrinks |
| **300–500px** (standard column) | Default layout, 2-column chips |
| **> 500px** (wide column) | More horizontal spacing, larger image area |
| **Cast display** | Animations disabled (performance), larger touch targets |

### 5.5 RTL Support

- Layout uses CSS `logical properties` (`inline-start` / `inline-end` instead of `left` / `right`)
- Chip grid respects `direction: rtl` from HA
- Room name and state text align correctly for Hebrew/Arabic
- Editor form elements are RTL-aware

---

## 6. Limitations & Constraints

| Limitation | Detail | Mitigation |
|-----------|--------|------------|
| **Max 8 entities** | UI chip grid designed for 8; more causes overflow | Editor enforces limit with clear message |
| **Area required** | Auto-discovery only works if HA areas are configured | Fallback: manual entity picker still works without area |
| **No custom themes beyond presets** | V1 ships with 6 presets only, no arbitrary color picker | Planned for V2; presets cover 90% of use cases |
| **No entity auto-sort** | Entity order is manual pin order | Alphabetical sort as optional future feature |
| **Image storage** | Card stores image as URL string, not binary | User must host image (HA local `/local/` or external URL) |
| **Single presence sensor** | Only one binary_sensor per card | Sufficient for most rooms; template sensor can combine multiple |
| **Performance on old devices** | Animations may lag on older tablets/phones | `prefers-reduced-motion` media query disables animations |
| **No entity history** | Card shows current state only, no graphs | Out of scope; use mini-graph-card alongside |
| **HA version** | Requires HA 2023.4+ (area entity registry APIs) | Documented in README with version badge |

---

## 7. Development Roadmap

### Phase 1 — Foundation (Week 1–2)

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 1.1 | Initialize repo: `package.json`, TypeScript, Rollup, ESLint, Prettier | 🔴 Critical | 2h |
| 1.2 | Set up LitElement boilerplate: card registration, `setConfig()`, `set hass()` | 🔴 Critical | 3h |
| 1.3 | Define TypeScript interfaces (`types.ts`) and config schema | 🔴 Critical | 2h |
| 1.4 | Implement color preset system (`const.ts`, `colors.ts`) | 🔴 Critical | 2h |
| 1.5 | Build card shell: glass background, room name, state display | 🔴 Critical | 4h |
| 1.6 | Implement area → entity resolution logic (`area-entities.ts`) | 🔴 Critical | 4h |
| 1.7 | Set up basic CI: lint + build on PR (`ci.yml`) | 🟡 Important | 2h |

**Phase 1 deliverable:** Card renders with room name, color theme, glass background. No interactivity yet.

### Phase 2 — Entity Chips (Week 3–4)

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 2.1 | Build `entity-chip` component: icon, active/inactive/unavailable states | 🔴 Critical | 6h |
| 2.2 | Implement tap-to-toggle for all 8 entity domains | 🔴 Critical | 6h |
| 2.3 | Build chip glow animations (per-domain color logic) | 🟡 Important | 3h |
| 2.4 | Implement chip grid layout (2-column, right-aligned, RTL-aware) | 🔴 Critical | 3h |
| 2.5 | Build `entity-popup` component: long-press detection + `ha-dialog` | 🟡 Important | 8h |
| 2.6 | Implement domain-specific popup controls (light, fan, climate, etc.) | 🟡 Important | 10h |
| 2.7 | Write unit tests for chip rendering and state mapping | 🟡 Important | 4h |

**Phase 2 deliverable:** Chips render, toggle on tap, show detailed popup on long-press. Full entity control works.

### Phase 3 — Presence & Background (Week 5–6)

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 3.1 | Build `presence-badge` component: pulsing dot with occupied/clear states | 🔴 Critical | 3h |
| 3.2 | Implement border glow animation on occupied | 🔴 Critical | 2h |
| 3.3 | Build `gradient-blob` component: animated gradient background | 🔴 Critical | 4h |
| 3.4 | Build `image-background` component: custom image with breathe animation | 🔴 Critical | 3h |
| 3.5 | Connect presence sensor state to all animations | 🔴 Critical | 3h |
| 3.6 | Implement `prefers-reduced-motion` fallback | 🟡 Important | 1h |
| 3.7 | Implement navigation (`tap_action`, `hold_action`, `double_tap_action`) | 🟡 Important | 3h |
| 3.8 | Write integration tests for presence → animation flow | 🟡 Important | 3h |

**Phase 3 deliverable:** Full visual card with presence detection, animations, and navigation. Card is feature-complete in YAML mode.

### Phase 4 — Visual Editor (Week 7–9)

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 4.1 | Build editor shell: `static get configElement()` registration | 🔴 Critical | 2h |
| 4.2 | Section 1 — Room Setup: area dropdown, name input, nav path | 🔴 Critical | 4h |
| 4.3 | Section 2 — Appearance: color swatch picker, background toggle, image URL | 🔴 Critical | 6h |
| 4.4 | Section 3 — Presence sensor dropdown (filtered by area + device_class) | 🔴 Critical | 3h |
| 4.5 | Section 4 — Entity list: auto-populated, domain-grouped, pin/unpin, reorder | 🔴 Critical | 10h |
| 4.6 | Section 5 — Advanced: action configurators, custom CSS class | 🟢 Nice-to-have | 4h |
| 4.7 | Editor ↔ card two-way binding: `configChanged` event dispatch | 🔴 Critical | 3h |
| 4.8 | Editor validation: max 8 entities, required fields, URL validation | 🟡 Important | 3h |
| 4.9 | Write tests for editor state management | 🟡 Important | 3h |

**Phase 4 deliverable:** Full visual editor. Users can configure the entire card without YAML.

### Phase 5 — i18n & Polish (Week 10)

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 5.1 | Build `localize.ts`: language loader with `hass.language` detection + fallback | 🔴 Critical | 3h |
| 5.2 | Create `en.json` + `he.json` translation files | 🔴 Critical | 3h |
| 5.3 | Wire all editor labels and card strings through `localize()` | 🔴 Critical | 4h |
| 5.4 | Write `translations/README.md` contribution guide | 🟡 Important | 1h |
| 5.5 | Responsive testing: mobile, tablet, desktop, cast | 🟡 Important | 4h |
| 5.6 | RTL testing with Hebrew HA instance | 🟡 Important | 2h |
| 5.7 | Performance profiling: bundle size audit, render performance | 🟡 Important | 3h |
| 5.8 | Accessibility audit: keyboard nav, ARIA labels, color contrast | 🟡 Important | 3h |

**Phase 5 deliverable:** Polished, localized, accessible card.

### Phase 6 — Distribution & Launch (Week 11–12)

| # | Task | Priority | Est. Hours |
|---|------|----------|------------|
| 6.1 | Write `README.md`: installation, screenshots, config reference, FAQ | 🔴 Critical | 4h |
| 6.2 | Write `CONTRIBUTING.md`: dev setup, architecture overview, PR process | 🟡 Important | 2h |
| 6.3 | Create `CHANGELOG.md` | 🟡 Important | 1h |
| 6.4 | Set up release GitHub Action: build → tag → GitHub Release | 🔴 Critical | 3h |
| 6.5 | Set up HACS validation GitHub Action | 🔴 Critical | 1h |
| 6.6 | Create `hacs.json` + add repository topics | 🔴 Critical | 0.5h |
| 6.7 | Submit to HACS default repository (PR to `hacs/default`) | 🔴 Critical | 1h |
| 6.8 | Create GitHub Issue templates (bug report + feature request) | 🟡 Important | 1h |
| 6.9 | Create demo screenshots / GIF for README | 🟡 Important | 3h |
| 6.10 | Announce on HA Community Forum + Reddit r/homeassistant | 🟡 Important | 2h |

**Phase 6 deliverable:** Card is live on HACS, discoverable, and documented.

---

## 8. Future Roadmap (Post V1)

| Feature | Version | Description |
|---------|---------|-------------|
| Custom color picker | V1.1 | Full HSL picker alongside presets |
| Entity auto-sort | V1.1 | Sort pinned entities by domain or name |
| Multiple presence sensors | V1.2 | OR/AND logic for multiple sensors |
| Conditional chip visibility | V1.2 | Show/hide chip based on template condition |
| Card themes marketplace | V2.0 | Community-submitted color themes as JSON |
| Floorplan integration | V2.0 | Mini SVG floorplan as background option |
| Drag-and-drop entity reorder | V2.0 | Full drag-and-drop in editor (not just up/down) |
| Entity history sparkline | V2.0 | Tiny inline chart in popup showing last 24h |

---

## 9. Reference: Existing Card Analysis

Your current Office card (the YAML document provided) uses these stacked custom cards:
- `custom:button-card` — main card structure, icon, name, state
- `custom:mushroom-chips-card` — entity chip row
- `card_mod` — CSS injection for styling

**What `area-control-card` replaces:**
- All three dependencies → single standalone card
- ~130 lines of YAML per room → zero YAML (GUI editor)
- Manual entity listing → auto-discovery from HA area
- Hardcoded colors → preset picker
- No presence integration → built-in presence badge + animations

**What stays the same:**
- Visual language: glassmorphism, glow animations, chip row layout
- Interaction model: tap to toggle, navigate to sub-dashboard
- Animation style: cyan/orange glow, icon spin, breathing gradient

---

## 10. Claude Code Implementation Notes

When building this project with Claude Code, use the following approach:

### Session 1 — Scaffolding
```
"Initialize the area-control-card project:
 - npm init, install LitElement, TypeScript, Rollup, ESLint, Prettier
 - Create the folder structure from Section 3.2
 - Set up rollup.config.mjs for single-file output
 - Create tsconfig.json with strict mode
 - Register the custom element with HA's customElements
 - Verify it renders a blank card in HA"
```

### Session 2 — Core Card
```
"Build the main card (area-control-card.ts):
 - Implement setConfig() with validation per types.ts
 - Implement set hass() property
 - Render room name, state, glass background
 - Apply color preset CSS variables from const.ts
 - Wire up navigation tap_action"
```

### Session 3 — Entity System
```
"Build entity chips and area resolution:
 - Implement getAreaEntities() in area-entities.ts
 - Build entity-chip.ts with domain-aware rendering
 - Build entity-popup.ts with ha-dialog
 - Implement all 8 domain controls in popup
 - Add glow animations per chip state"
```

### Session 4 — Visual Editor
```
"Build the full visual editor (editor.ts):
 - Area dropdown from hass.areas
 - Color preset swatch picker
 - Background mode toggle
 - Presence sensor dropdown (filtered)
 - Entity pin/unpin list with domain grouping
 - Two-way config binding via configChanged event"
```

### Session 5 — Polish & Ship
```
"Finalize for release:
 - Add i18n system with en.json + he.json
 - Add all animations (presence, glow, gradient)
 - Set up GitHub Actions (CI + Release + HACS validation)
 - Write README with screenshots
 - Create hacs.json
 - Tag v1.0.0"
```

---

## 11. Checklist — Ready for Build

Before starting Claude Code sessions, ensure:

- [ ] GitHub repository created: `github.com/<username>/area-control-card`
- [ ] Node.js 18+ installed on dev machine
- [ ] Home Assistant dev instance available for testing (or use HA container)
- [ ] Screenshots of current card design saved as visual reference
- [ ] HA areas configured in test instance (at least 2–3 rooms with devices)
- [ ] Decision: which room to use as primary test case
- [ ] This plan document reviewed and approved

---

*Generated for Sharon's Home Assistant area-control-card project.*
*Architecture: LitElement + TypeScript + Rollup + HACS.*
*License: MIT.*
