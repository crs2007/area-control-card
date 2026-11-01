import { svg, SVGTemplateResult } from 'lit';
import { RoomType } from '../types';
import { defs } from './defs';
import { living } from './living';
import { bedroom } from './bedroom';
import { kitchen } from './kitchen';
import { bathroom } from './bathroom';
import { office } from './office';
import { kids } from './kids';
import { dining } from './dining';
import { outdoor } from './outdoor';

export const SCENES: Record<RoomType, () => SVGTemplateResult> = {
  living,
  bedroom,
  kitchen,
  bathroom,
  office,
  kids,
  dining,
  outdoor,
};

/** Contents of the scene's <svg>: preset-tinted backdrop, motion ripples, then the room */
export function renderScene(type: RoomType): SVGTemplateResult {
  return svg`
    ${defs}
    <circle cx="80" cy="66" r="58" fill="url(#g-backdrop)" />
    <circle class="ripple" cx="80" cy="66" r="52" />
    <circle class="ripple" cx="80" cy="66" r="52" style="animation-delay: -1.4s" />
    ${SCENES[type]()}
  `;
}
