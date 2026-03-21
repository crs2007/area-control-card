import { ColorPreset } from '../types';
import { COLOR_PRESETS } from '../const';

export function getColorPalette(preset: ColorPreset) {
  return COLOR_PRESETS[preset] || COLOR_PRESETS.ocean;
}

export function applyColorVariables(element: HTMLElement, preset: ColorPreset): void {
  const palette = getColorPalette(preset);
  element.style.setProperty('--acc-primary', palette.primary);
  element.style.setProperty('--acc-accent', palette.accent);
  element.style.setProperty('--acc-glow-active', palette.glow_active);
  element.style.setProperty('--acc-glow-secondary', palette.glow_secondary);
  element.style.setProperty('--acc-background-tint', palette.background_tint);
}
