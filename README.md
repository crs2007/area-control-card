# Area Control Card

> A reusable, GUI-configurable Home Assistant custom Lovelace card for room/area control with HACS distribution.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/crs2007/area-control-card?style=for-the-badge)
![GitHub Release Date](https://img.shields.io/github/release-date/crs2007/area-control-card?style=for-the-badge)
![License](https://img.shields.io/github/license/crs2007/area-control-card?style=for-the-badge)
![HA Version](https://img.shields.io/badge/HA-2023.4%2B-blue?style=for-the-badge&logo=homeassistant)

---

**Area Control Card** gives any Home Assistant user a beautiful, interactive room control panel — configured entirely through the visual editor (GUI). Pick an area, and the card auto-discovers devices. Pick a color theme, and the entire card adapts. Pick a presence sensor, and the card comes alive when someone walks in. **Zero YAML required.**

<!-- Add your card screenshot here -->
<!-- ![Area Control Card](https://raw.githubusercontent.com/crs2007/area-control-card/main/images/card-preview.png) -->

## Features

- **Zero YAML** — Full GUI visual editor, no YAML needed for basic setup
- **Area Auto-Discovery** — Select an area and the card automatically finds all devices and entities
- **8 Entity Domains** — Lights, fans, switches, media players, climate, covers, locks, scenes & scripts
- **6 Color Themes** — Ocean, Sunset, Forest, Lavender, Amber, Slate
- **Presence Sensing** — Animated badge, border glow, and background animations when a room is occupied
- **Glassmorphism Design** — Backdrop blur, semi-transparent layers, subtle glow effects
- **Responsive** — Works on mobile, tablet, desktop, and cast displays
- **i18n Ready** — English and Hebrew included, easily extensible
- **Lightweight** — Single JS file, no dependencies on other custom cards

---

## Installation

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=crs2007&repository=area-control-card&category=frontend)

<details>
<summary>Click to show installation instructions</summary>

### Method 1 — HACS (Recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed in your Home Assistant instance.
2. Click the button above **or** go to **HACS > Frontend > "+" > Search "Area Control Card"**.
3. Click **Download**.
4. Reload your browser (**Ctrl + F5** / **Cmd + Shift + R**).
5. Add the card via the visual editor.

### Method 2 — Manual

1. Download `area-control-card.js` from the [latest release](https://github.com/crs2007/area-control-card/releases).
2. Copy the file to your `config/www/` folder.
3. In Home Assistant go to **Settings > Dashboards > Resources** and add:
   - **URL:** `/local/area-control-card.js`
   - **Type:** JavaScript Module
4. Reload your browser.
5. Add the card via the visual editor.

</details>

---

## Configuration (GUI)

The card is fully configurable from the Home Assistant visual editor. No YAML needed.

<details>
<summary>Click to show configuration details</summary>

After adding the card to your dashboard, the visual editor provides five sections:

### Section 1 — Room Setup

| Setting | Description | Default |
|:---|:---|:---|
| Area | Dropdown of all HA areas — filters entities to that area | — |
| Display Name | Custom room name override | Area name |
| Navigation Path | Path to navigate on card tap (e.g., `/dashboard/office`) | — |

### Section 2 — Appearance

| Setting | Description | Default |
|:---|:---|:---|
| Color Theme | 6 preset color swatches to pick from | Ocean |
| Background Mode | "Animated Gradient" or "Custom Image" | Animated Gradient |
| Image URL | URL for custom background image (only when "Custom Image" is selected) | — |

### Section 3 — Presence Sensor

| Setting | Description | Default |
|:---|:---|:---|
| Sensor | Dropdown of `binary_sensor.*` entities in the selected area (filtered by occupancy/motion/presence device class) | None |

### Section 4 — Entity Controls

| Setting | Description |
|:---|:---|
| Entity List | Auto-populated from area entities, grouped by domain |
| Pin/Unpin | Toggle entities to show as chips on the card (max 8) |
| Reorder | Move pinned entities up/down to set display order |

### Section 5 — Advanced (collapsed by default)

| Setting | Description | Default |
|:---|:---|:---|
| Tap Action | Action on card tap | Navigate |
| Hold Action | Action on card hold | More Info |
| Double-Tap Action | Action on card double-tap | None |

</details>

---

## Supported Entity Domains

<details>
<summary>Click to show supported domains</summary>

Each entity domain gets a chip with tap-to-toggle and state-aware visuals:

| Domain | Icon | Chip Tap Action | Visual State |
|:---|:---|:---|:---|
| `light` | `mdi:lightbulb` | Toggle on/off | Glow when on |
| `fan` | `mdi:fan` | Toggle on/off | Icon spins when on |
| `switch` | `mdi:power-plug` | Toggle on/off | Colored when on |
| `media_player` | `mdi:television` | Toggle on/off | Colored when on |
| `climate` | `mdi:thermometer` | Toggle on/off | Colored when on |
| `cover` | `mdi:blinds` | Open/close | State-aware |
| `lock` | `mdi:lock` | Lock/unlock | State-aware |
| `scene` | `mdi:palette` | Activate | One-shot |
| `script` | `mdi:script-text` | Execute | One-shot |

**Chip visual states:**
- **Active (ON):** Colored background + white icon + glow animation
- **Inactive (OFF):** Transparent background + muted icon
- **Unavailable:** Greyed out + non-interactive

</details>

---

## Color Themes

<details>
<summary>Click to show color presets</summary>

Six built-in color presets are available, each adapting to HA dark and light modes:

| Preset | Primary | Accent | Best For |
|:---|:---|:---|:---|
| **Ocean** | `#0764FA` | `#8ACDD7` | Cool, tech-forward rooms |
| **Sunset** | `#E85D3A` | `#DF826C` | Warm, cozy spaces |
| **Forest** | `#2D8A4E` | `#7BC67E` | Natural, calming feel |
| **Lavender** | `#7C3AED` | `#A78BFA` | Elegant, modern style |
| **Amber** | `#D97706` | `#FCD34D` | Energetic, bright rooms |
| **Slate** | `#475569` | `#94A3B8` | Professional, neutral |

</details>

---

## Presence Detection

<details>
<summary>Click to show presence features</summary>

When a presence/motion sensor is configured and detects occupancy:

| Feature | Occupied | Clear |
|:---|:---|:---|
| Status text | "Occupied" | "Clear" |
| Presence badge | Animated pulsing dot | Hidden |
| Background | Animated gradient shift / image breathing | Static |
| Border | Colored glow pulse | No glow |

If no presence sensor is selected, the card works normally without these features.

</details>

---

## YAML Configuration (Advanced)

<details>
<summary>Click to show YAML reference</summary>

While the GUI editor is recommended, you can also configure the card via YAML:

```yaml
type: custom:area-control-card
area: office
name: My Office
color_preset: ocean
background_mode: gradient
# background_mode: image
# image_url: /local/images/office.jpg
presence_entity: binary_sensor.office_motion
navigation_path: /dashboard/office
entities:
  - entity: light.office_ceiling
    name: Ceiling Light
    icon: mdi:ceiling-light
  - entity: fan.office_fan
  - entity: switch.office_monitor
  - entity: media_player.office_speaker
  - entity: climate.office_ac
```

### Config Reference

| Key | Type | Required | Default | Description |
|:---|:---|:---|:---|:---|
| `area` | string | No | — | Home Assistant area ID |
| `name` | string | No | Area name | Display name override |
| `color_preset` | string | No | `ocean` | One of: `ocean`, `sunset`, `forest`, `lavender`, `amber`, `slate` |
| `background_mode` | string | No | `gradient` | `gradient` or `image` |
| `image_url` | string | No | — | Background image URL (when `background_mode: image`) |
| `presence_entity` | string | No | — | `binary_sensor` entity ID for presence detection |
| `navigation_path` | string | No | — | Dashboard path to navigate on card tap |
| `entities` | list | No | — | List of entity configurations (max 8) |
| `entities[].entity` | string | Yes | — | Entity ID |
| `entities[].name` | string | No | Friendly name | Display name override |
| `entities[].icon` | string | No | Domain default | Custom MDI icon |
| `tap_action` | object | No | `navigate` | Standard HA tap action |
| `hold_action` | object | No | `more-info` | Standard HA hold action |
| `double_tap_action` | object | No | `none` | Standard HA double-tap action |

</details>

---

## Translations

<details>
<summary>Click to show i18n details</summary>

The card ships with **English** and **Hebrew** translations and auto-detects the HA language setting.

### Adding a New Language

1. Fork this repository.
2. Copy `src/locales/en.json` to `src/locales/{locale}.json` (e.g., `fr.json`).
3. Translate all values (keep keys unchanged).
4. Submit a Pull Request.

See [src/locales/translations/README.md](src/locales/translations/README.md) for details.

</details>

---

## Troubleshooting

<details>
<summary>Click to show troubleshooting tips</summary>

| Issue | Solution |
|:---|:---|
| Card not showing up | Clear browser cache and reload. Verify the resource is added under **Settings > Dashboards > Resources**. |
| No entities found | Make sure your devices are assigned to an area in **Settings > Areas**. |
| Presence not working | Verify the sensor has `device_class` set to `occupancy`, `motion`, or `presence`. |
| Animations are laggy | The card respects `prefers-reduced-motion`. On older devices, animations are automatically reduced. |

**Minimum Requirements:**
- Home Assistant **2023.4** or newer
- A modern browser (Chrome, Firefox, Safari, Edge)

</details>

---

## Development

<details>
<summary>Click to show developer setup</summary>

```bash
# Clone the repository
git clone https://github.com/crs2007/area-control-card.git
cd area-control-card

# Install dependencies
npm install

# Build the card
npm run build

# Watch for changes during development
npm run watch

# Run linting
npm run lint

# Run tests
npm test
```

The built file is output to `dist/area-control-card.js`. Copy it to your HA `config/www/` folder for testing.

</details>

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

If you find a bug or have a feature request, please [open an issue](https://github.com/crs2007/area-control-card/issues).
