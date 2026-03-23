# CLAUDE.md — Area Control Card

## Project Overview

A reusable, GUI-configurable Home Assistant custom Lovelace card for room/area control, distributed via HACS. Built with LitElement + TypeScript + Rollup. Single JS output file, no external custom card dependencies.

**GitHub:** `crs2007/area-control-card`
**Author:** Sharon
**License:** MIT
**HA Requirement:** 2023.4+

## Build & Dev Commands

```bash
npm install          # Install dependencies
npm run build        # Rollup build → dist/area-control-card.js
npm run watch        # Rollup watch mode for development
npm run lint         # ESLint on src/**/*.ts
npm run format       # Prettier on src/**/*.ts
npm test             # Vitest run (single pass)
npm run test:watch   # Vitest watch mode
```

Output: `dist/area-control-card.js` (ES module, minified, no sourcemaps)

## Architecture

### Tech Stack
- **Rendering:** LitElement (Lit 3.x) with TypeScript decorators
- **Styling:** CSS-in-JS via Lit `css` tag (Shadow DOM scoped)
- **Build:** Rollup with TypeScript, JSON, Node Resolve, and Terser plugins
- **Testing:** Vitest
- **Linting:** ESLint + Prettier (single quotes, trailing commas, 100 char width)
- **CI:** GitHub Actions (ci.yml, release.yml, hacs-validate.yml)
- **Distribution:** HACS custom frontend card

### Project Structure
```
src/
  area-control-card.ts    # Main card LitElement (renders card, chips, background, presence)
  editor.ts               # Visual editor LitElement (5-section GUI config form)
  types.ts                # TypeScript interfaces (config, HA types, entities)
  const.ts                # Constants: tag names, version, color presets, domain icons, defaults
  styles.ts               # Card + editor CSS (animations, glassmorphism, responsive)
  utils/
    area-entities.ts      # Area → device → entity resolution, presence sensor filtering
    colors.ts             # Apply color preset CSS variables to host element
    ha-helpers.ts         # getDomain, toggleEntity, isEntityActive, fireEvent, navigate
    localize.ts           # i18n loader with hass.language detection + en fallback
  locales/
    en.json               # English translations
    he.json               # Hebrew translations
    translations/README.md
```

### Key Patterns
- Card registers via `@customElement('area-control-card')` and `window.customCards`
- Editor registers via `@customElement('area-control-card-editor')`
- Config flows through `setConfig()` → merged with `DEFAULT_CONFIG` from const.ts
- Color theming uses CSS custom properties (`--acc-primary`, `--acc-accent`, `--acc-glow-*`, `--acc-background-tint`)
- Entity state subscriptions happen via Lit's reactive `hass` property (no manual subscriptions)
- Area entity discovery: `hass.areas` → `hass.devices` (filter by area_id) → `hass.entities` (filter by device_id or area_id)
- Config changes in editor fire `config-changed` CustomEvent with `{ config }` detail

### Supported Entity Domains
light, fan, switch, media_player, climate, cover, lock, scene, script — each with domain-specific toggle logic in `ha-helpers.ts`

### Color Presets
ocean, sunset, forest, lavender, amber, slate — defined in `const.ts` with 5 color values each

## Code Style

- TypeScript strict mode enabled
- Prettier: single quotes, trailing commas, 100 char line width, 2-space indent
- Use Lit decorators (`@customElement`, `@property`, `@state`)
- Shadow DOM for all styles — no global CSS
- CSS logical properties for RTL support (`inset-inline-start`, `margin-inline-start`)
- Respect `prefers-reduced-motion` — disable animations when set
- All user-facing strings go through `localize()` with language key

## HACS Configuration

- `hacs.json` in root: includes `name`, `type`, `render_readme`, `filename`, and `version` fields
- CI triggers on push/PR to `main` branch

## Release & Versioning Process

### Version Format
- CalVer format: `YYYY.MM.DD.Minor` (e.g., `2026.03.22.0`)
- Minor starts at `0` and increments for multiple releases on the same day (e.g., `2026.03.22.1`)

### How to release a new version
1. Update `CARD_VERSION` in `src/const.ts` to the new CalVer version
2. Update `version` in `package.json` to match
3. Update `version` in `hacs.json` to match
3. Commit and push changes to `main`
4. Create and push a git tag: `git tag v<version> && git push --tags`
5. The `release.yml` GitHub Actions workflow automatically builds and creates a GitHub Release with `dist/area-control-card.js` attached

### How HACS delivers updates to users
- HACS periodically polls GitHub repos (every few hours) for new releases
- When a new release tag is detected, HACS shows an "Update available" badge to all users who have the card installed
- Users must manually click "Update" in HACS — there is no auto-update
- After updating, users may need to clear browser cache / hard-refresh to load the new JS file

### Important
- The git tag version (e.g., `v2026.03.22.0`) and `CARD_VERSION` in `const.ts` must always match
- The release asset filename must match `hacs.json` → `filename` (`area-control-card.js`)

## Testing

- Framework: Vitest
- Run: `npm test` (single pass) or `npm run test:watch`
- Test files expected in `test/` directory

## Important Notes

- Max 8 pinned entities per card (enforced in editor UI)
- Card version is hardcoded in `const.ts` as `CARD_VERSION`
- The `types.ts` file contains minimal HA type definitions — not the full HA TypeScript types
- Editor clears entities and presence_entity when area changes (fresh discovery)
- Background modes: `gradient` (animated blob) or `image` (custom URL with overlay)
- Presence detection filters `binary_sensor.*` by device_class: occupancy, motion, presence
