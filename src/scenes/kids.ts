import { svg, SVGTemplateResult } from 'lit';
import { floorShadow } from './parts';

const star = (x: number, y: number, r: number, delay: string): SVGTemplateResult => svg`
  <path
    class="twinkle"
    style="animation-delay: ${delay}"
    d="M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3}
       L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z"
    fill="#ffd54f"
  />
`;

const block = (x: number, y: number, color: string, letter: string): SVGTemplateResult => svg`
  <rect x=${x} y=${y} width="14" height="14" rx="2" fill=${color} />
  <rect x=${x} y=${y} width="14" height="4" rx="2" fill="#fff" opacity=".25" />
  <text x=${x + 7} y=${y + 10.5} text-anchor="middle" font-size="9" font-weight="700"
    font-family="sans-serif" fill="#fff">${letter}</text>
`;

/** Small bed, a hanging mobile, toy blocks and a ball. Motion: mobile swings, ball bounces. */
export const kids = () => svg`
  ${floorShadow(80, 68)}

  ${star(18, 20, 3.5, '0s')} ${star(140, 14, 3, '-.7s')} ${star(116, 34, 2.4, '-1.3s')}

  <!-- mobile -->
  <g class="sway" style="--sw: 5deg; --d: 3.6s; transform-origin: 50% 0">
    <path d="M70 -40 V12 M52 12 H88 M52 12 v8 M70 12 v12 M88 12 v6" stroke="#8d959f" stroke-width=".8" />
    <path d="M52 20 l2 4 l4.5 .5 l-3.3 3 l1 4.5 l-4.2 -2.4 l-4.2 2.4 l1 -4.5 l-3.3 -3 l4.5 -.5z" fill="#ffd54f" />
    <circle cx="70" cy="28" r="5" style="fill: var(--acc-accent)" />
    <path d="M84 20 q4 -4 8 0 q3 0 3 3 t-3 3 h-8 q-3 0 -3 -3 t3 -3z" fill="#fff" stroke="#d4d9df" stroke-width=".6" />
  </g>

  <!-- bed -->
  <rect x="14" y="62" width="6" height="44" rx="2.5" style="fill: var(--acc-primary)" />
  <rect x="84" y="72" width="6" height="34" rx="2.5" style="fill: var(--acc-primary)" />
  <rect x="18" y="80" width="68" height="14" rx="3" fill="url(#g-body)" />
  <ellipse cx="30" cy="78" rx="8" ry="4.5" fill="#fff" stroke="#dfe3e8" stroke-width=".6" />
  <path d="M38 74 Q60 71 85 76 V92 Q60 95 37 92 Z" fill="url(#g-fabric)" />
  <g fill="#fff" opacity=".6">
    <circle cx="48" cy="81" r="1.4" /><circle cx="60" cy="86" r="1.4" /><circle cx="72" cy="80" r="1.4" />
  </g>
  <path d="M20 98 h64" style="stroke: var(--acc-primary)" stroke-width="2.5" />

  <!-- blocks -->
  ${block(100, 92, '#e5484d', 'A')} ${block(115, 92, '#3e8ed0', 'B')} ${block(107.5, 78, '#f2c94c', 'C')}

  <!-- ball -->
  <ellipse class="ball-shadow" cx="142" cy="106" rx="6" ry="1.6" fill="#000" opacity=".2" />
  <g class="bounce">
    <circle cx="142" cy="99" r="7" fill="#ff7043" />
    <path d="M135 99 q7 -4 14 0" stroke="#fff" stroke-width="2" fill="none" />
    <circle cx="139.5" cy="96" r="2" fill="#fff" opacity=".5" />
  </g>
`;
