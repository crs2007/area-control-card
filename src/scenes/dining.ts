import { svg, SVGTemplateResult } from 'lit';
import { floorShadow, glow } from './parts';

/*
 * The ceiling fan (flattened blade disc, motor block, air lines) is adapted from the ceiling
 * fan illustration in ha-appliance-electromenager-cards, Copyright (c) 2026 Nicolas, MIT License.
 */
const blade = (angle: number): SVGTemplateResult => svg`
  <g transform="rotate(${angle})">
    <path d="M6 -3L38 -8Q44 0 38 8L6 3z" fill="url(#g-wood)" stroke="#5a3b1e" stroke-width=".7" />
    <rect x="4" y="-2" width="9" height="4" rx="1" fill="url(#g-chrome)" />
  </g>
`;

const chair = (x: number, flip: boolean): SVGTemplateResult => svg`
  <g transform="translate(${x} 0) scale(${flip ? -1 : 1} 1)">
    <rect x="0" y="62" width="5" height="44" rx="2" fill="url(#g-wood)" />
    <rect x="0" y="86" width="20" height="5" rx="2" fill="url(#g-fabric)" />
    <rect x="16" y="91" width="3.5" height="15" rx="1" fill="url(#g-wood)" />
  </g>
`;

/** Table, two chairs, flowers and a ceiling fan. Motion: fan turns, flowers sway. */
export const dining = () => svg`
  ${floorShadow(80, 64)}

  <!-- ceiling fan -->
  <rect x="78.5" y="-40" width="3" height="56" fill="url(#g-chrome)" />
  <g transform="translate(80 22) scale(1 .3)">
    <g class="spin">${[0, 90, 180, 270].map(blade)}</g>
  </g>
  <path d="M68 18q0-4 12-4t12 4v4q0 5-12 5t-12-5z" fill="url(#g-chrome)" stroke="#6f7781" stroke-width=".5" />
  ${glow(80, 30, 18)}
  <path d="M73 27h14q0 8-7 8t-7-8z" fill="url(#g-shade)" stroke="#d8bf8a" stroke-width=".5" />
  <g class="air" fill="none" stroke="#bfe3f7" stroke-width="1.4" stroke-linecap="round">
    <path d="M44 32q-5 10 0 20t0 18" />
    <path d="M116 32q5 10 0 20t0 18" />
  </g>

  ${chair(16, false)} ${chair(144, true)}

  <!-- flowers -->
  <g class="sway" style="--sw: 5deg; --d: 2.8s">
    <path d="M80 70 q-6 -10 -8 -16 M80 70 q0 -12 1 -18 M80 70 q6 -9 9 -14" stroke="#3fa66b" stroke-width="1.4" fill="none" />
    <circle cx="72" cy="53" r="3.4" fill="#ff7aa2" />
    <circle cx="81" cy="51" r="3.4" style="fill: var(--acc-accent)" />
    <circle cx="89" cy="55" r="3.4" fill="#ffd54f" />
  </g>
  <path d="M75 64 h10 l-1.5 8 h-7 z" style="fill: var(--acc-primary)" />
  <ellipse cx="54" cy="73" rx="9" ry="1.8" fill="#fff" stroke="#d4d9df" stroke-width=".5" />
  <ellipse cx="106" cy="73" rx="9" ry="1.8" fill="#fff" stroke="#d4d9df" stroke-width=".5" />

  <!-- table -->
  <rect x="34" y="73" width="92" height="6" rx="2" fill="url(#g-wood)" />
  <rect x="34" y="73" width="92" height="2" rx="1" fill="#fff" opacity=".25" />
  <rect x="40" y="79" width="4" height="27" fill="#8a5a2b" />
  <rect x="116" y="79" width="4" height="27" fill="#8a5a2b" />
`;
