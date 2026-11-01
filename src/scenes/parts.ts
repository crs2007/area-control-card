import { svg, SVGTemplateResult } from 'lit';

/*
 * Small building blocks shared by the scenes. Animated elements never carry a `transform`
 * attribute, because the CSS animation would replace it; static placement goes on a wrapper.
 */

export const floorShadow = (cx: number, rx: number, y = 108): SVGTemplateResult =>
  svg`<ellipse cx=${cx} cy=${y} rx=${rx} ry="4.5" fill="url(#g-shadow)" />`;

/** Warm halo around a bulb: hidden when idle, dim on motion, bright when a light is on */
export const glow = (cx: number, cy: number, r: number): SVGTemplateResult =>
  svg`<circle class="glow" cx=${cx} cy=${cy} r=${r} fill="url(#g-glow)" />`;

/** Light cone below a lamp shade, from the shade's bottom edge down to the floor */
export const beam = (d: string): SVGTemplateResult =>
  svg`<path class="beam" d=${d} fill="url(#g-beam)" />`;

/** Potted plant standing on (x, y) */
export const plant = (x: number, y: number, delay = '0s'): SVGTemplateResult => svg`
  <g transform="translate(${x} ${y})">
    <g class="sway" style="--sw: 5deg; animation-delay: ${delay}">
      <path d="M0 -14 Q-12 -22 -13 -34 Q-3 -28 0 -14z" fill="url(#g-leaf)" />
      <path d="M0 -14 Q12 -24 12 -36 Q2 -30 0 -14z" fill="url(#g-leaf)" />
      <path d="M0 -14 Q-4 -30 2 -42 Q6 -28 0 -14z" fill="#3fa66b" />
      <path d="M0 -14 Q-16 -14 -19 -22 Q-8 -22 0 -14z" fill="#56b878" />
      <path d="M0 -14 Q15 -15 18 -24 Q8 -23 0 -14z" fill="#56b878" />
    </g>
    <path d="M-8 -14h16l-2.5 14h-11z" fill="#d9825b" />
    <path d="M-8.5 -16h17v3.5h-17z" fill="#c26b45" />
    <path d="M-5 -12.5l-1.6 10" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" />
  </g>
`;
