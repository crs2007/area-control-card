import { svg } from 'lit';
import { beam, floorShadow, glow } from './parts';

/** Bed, nightstand lamp and a curtained window. Motion: curtains sway, blanket breathes. */
export const bedroom = () => svg`
  ${floorShadow(78, 70)}

  <!-- window with a night sky -->
  <rect x="100" y="12" width="42" height="36" rx="2" fill="#fff" />
  <rect x="102.5" y="14.5" width="37" height="31" fill="url(#g-sky)" />
  <circle cx="128" cy="24" r="5" fill="#fff8d6" />
  <circle cx="130" cy="22.5" r="4.2" fill="url(#g-sky)" />
  <path d="M121 14.5v31M102.5 30h37" stroke="#fff" stroke-width="2" />
  <rect x="96" y="9" width="50" height="3" rx="1.5" fill="url(#g-wood)" />
  <g class="sway" style="--sw: 3deg; --d: 3.4s; transform-origin: 50% 0">
    <path d="M97 12 h11 q-2 18 1 38 h-12 z" style="fill: var(--acc-accent)" />
    <path d="M101 13 q-1 18 1 36" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" fill="none" />
  </g>
  <g class="sway" style="--sw: -3deg; --d: 3.8s; transform-origin: 50% 0; animation-delay: -.8s">
    <path d="M145 12 h-11 q2 18 -1 38 h12 z" style="fill: var(--acc-accent)" />
    <path d="M141 13 q1 18 -1 36" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" fill="none" />
  </g>

  <!-- nightstand + lamp -->
  ${beam('M9 76 L2 88 L28 88 L21 76 Z')}
  ${glow(15, 70, 16)}
  <rect x="4" y="86" width="22" height="20" rx="2" fill="url(#g-wood)" />
  <path d="M6 95h18" stroke="#6b4420" stroke-width=".8" />
  <circle cx="15" cy="91" r="1.1" fill="url(#g-chrome)" />
  <rect x="14" y="76" width="2" height="10" fill="url(#g-chrome)" />
  <path d="M8 76 L22 76 L19 64 L11 64 Z" fill="url(#g-shade)" stroke="#d8bf8a" stroke-width=".6" />

  <!-- bed -->
  <rect x="30" y="54" width="9" height="52" rx="3" fill="url(#g-wood)" />
  <rect x="126" y="74" width="7" height="32" rx="2.5" fill="url(#g-wood)" />
  <rect x="36" y="80" width="92" height="16" rx="4" fill="url(#g-body)" />
  <ellipse cx="50" cy="77" rx="11" ry="6" fill="#fff" stroke="#dfe3e8" stroke-width=".6" />
  <g class="breathe">
    <path d="M62 72 Q92 68 127 74 L127 94 Q94 98 60 94 Q56 84 62 72z" fill="url(#g-fabric)" />
    <path d="M62 72 Q92 68 127 74 L127 79 Q94 74 61 78z" fill="#fff" opacity=".35" />
  </g>
`;
