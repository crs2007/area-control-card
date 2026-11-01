import { svg, SVGTemplateResult } from 'lit';
import { beam, floorShadow, glow } from './parts';

const pendant = (x: number, delay: string): SVGTemplateResult => svg`
  ${beam(`M${x - 8} 30 L${x - 20} 74 L${x + 20} 74 L${x + 8} 30 Z`)}
  ${glow(x, 30, 14)}
  <g class="sway" style="--sw: 4deg; --d: 2.8s; transform-origin: 50% 0; animation-delay: ${delay}">
    <path d="M${x} -40 V20" stroke="#4a5058" stroke-width=".8" />
    <path d="M${x - 9} 30 Q${x - 9} 20 ${x} 20 Q${x + 9} 20 ${x + 9} 30 Z" fill="url(#g-dark)" />
    <path d="M${x - 6} 26 Q${x - 5} 22 ${x - 1} 21.5" stroke="#fff" stroke-opacity=".35" fill="none" />
  </g>
`;

/** Counter with a steaming pot and pendant lights. Motion: steam rises, pendants swing. */
export const kitchen = () => svg`
  ${floorShadow(80, 70)}

  <!-- backsplash -->
  <rect x="16" y="54" width="128" height="20" style="fill: var(--acc-accent); opacity: .3" />
  <path d="M16 64h128M32 54v20M48 54v20M64 54v20M80 54v20M96 54v20M112 54v20M128 54v20"
    stroke="#fff" stroke-opacity=".5" stroke-width=".6" />

  ${pendant(100, '0s')} ${pendant(128, '-.7s')}

  <!-- steam -->
  <g class="steam" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
    <path d="M44 52 q-4 -6 0 -12 t0 -12" />
    <path d="M52 50 q4 -6 0 -12 t0 -12" style="animation-delay: -.6s" />
    <path d="M60 52 q-4 -6 0 -12 t0 -12" style="animation-delay: -1.2s" />
  </g>

  <!-- pot -->
  <rect x="38" y="60" width="28" height="14" rx="3" fill="url(#g-chrome)" />
  <ellipse cx="52" cy="60" rx="15" ry="2.6" fill="#8d959f" />
  <path d="M38 63h-5M66 63h5" stroke="#4a5058" stroke-width="2.2" stroke-linecap="round" />
  <rect x="49" y="55.5" width="6" height="2.5" rx="1" fill="#4a5058" />

  <!-- herbs -->
  <rect x="112" y="64" width="12" height="10" rx="2" fill="#d9825b" />
  <g class="sway" style="--sw: 6deg; --d: 2.4s">
    <path d="M118 64 q-6 -6 -4 -12 M118 64 q0 -8 2 -13 M118 64 q5 -5 6 -10" stroke="#3fa66b"
      stroke-width="1.6" fill="none" stroke-linecap="round" />
    <circle cx="114" cy="52" r="2.4" fill="#56b878" />
    <circle cx="120" cy="51" r="2.4" fill="#7fd38a" />
    <circle cx="124" cy="54" r="2.4" fill="#56b878" />
  </g>

  <!-- counter and cabinets -->
  <rect x="10" y="74" width="140" height="6" rx="2" fill="#3a3f45" />
  <rect x="10" y="74" width="140" height="2" rx="1" fill="#fff" opacity=".2" />
  <rect x="14" y="80" width="132" height="26" fill="url(#g-body)" />
  <path d="M47 80v26M80 80v26M113 80v26" stroke="#c9ced4" stroke-width=".8" />
  <path d="M41 86v8M53 86v8M107 86v8M119 86v8" stroke="url(#g-chrome)" stroke-width="2" stroke-linecap="round" />
  <rect x="58" y="84" width="44" height="17" rx="2" fill="url(#g-dark)" />
  <rect class="glow-soft" x="60" y="86" width="40" height="13" rx="1.5" fill="#ff9a4d" />
  <rect x="58" y="84" width="44" height="17" rx="2" fill="url(#g-gloss)" />
`;
