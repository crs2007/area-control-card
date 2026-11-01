import { svg } from 'lit';
import { beam, floorShadow, glow, plant } from './parts';

/** Desk with a monitor, desk lamp and chair. Motion: the screen comes on and code types out. */
export const office = () => svg`
  ${floorShadow(80, 68)}

  <!-- monitor -->
  <rect x="44" y="30" width="56" height="36" rx="3" fill="url(#g-dark)" />
  <g class="screen wake">
    <rect x="47" y="33" width="50" height="30" rx="1.5" fill="url(#g-screen)" />
    <g fill="#fff" opacity=".85">
      <rect class="type" x="51" y="38" width="22" height="2.4" rx="1.2" />
      <rect class="type" x="55" y="43" width="30" height="2.4" rx="1.2" style="animation-delay: .4s" />
      <rect class="type" x="55" y="48" width="18" height="2.4" rx="1.2" style="animation-delay: .8s" />
      <rect class="type" x="51" y="53" width="26" height="2.4" rx="1.2" style="animation-delay: 1.2s" />
    </g>
  </g>
  <rect x="47" y="33" width="50" height="30" rx="1.5" fill="url(#g-gloss)" />
  <path d="M68 66 h8 l2 6 h-12 z" fill="url(#g-chrome)" />

  <!-- desk lamp -->
  ${beam('M104 50 L94 72 L124 72 L114 50 Z')}
  ${glow(109, 48, 15)}
  <ellipse cx="128" cy="71" rx="7" ry="1.8" fill="#4a5058" />
  <path d="M128 71 L134 52 L110 44" stroke="url(#g-chrome)" stroke-width="2" fill="none" stroke-linejoin="round" />
  <circle cx="134" cy="52" r="1.8" fill="#4a5058" />
  <path d="M102 50 L116 50 L113 41 L106 40 Z" style="fill: var(--acc-primary)" />

  <!-- mug -->
  <g class="steam" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round">
    <path d="M36 60 q-2 -4 0 -8 t0 -8" />
    <path d="M40 60 q2 -4 0 -8 t0 -8" style="animation-delay: -1s" />
  </g>
  <rect x="33" y="62" width="10" height="10" rx="2" style="fill: var(--acc-accent)" />
  <path d="M43 65 q4 0 4 3 t-4 3" style="stroke: var(--acc-accent)" stroke-width="1.6" fill="none" />

  <!-- desk -->
  <rect x="18" y="72" width="124" height="6" rx="2" fill="url(#g-wood)" />
  <rect x="24" y="78" width="4" height="28" fill="#6b4420" />
  <rect x="104" y="78" width="32" height="28" rx="1.5" fill="url(#g-wood)" />
  <path d="M106 92h28" stroke="#6b4420" stroke-width=".8" />
  <path d="M117 85h6M117 99h6" stroke="url(#g-chrome)" stroke-width="1.6" stroke-linecap="round" />
  <rect x="54" y="69" width="30" height="3" rx="1" fill="#d4d9df" />

  <!-- chair -->
  <g class="sway" style="--sw: 4deg; --d: 3.2s">
    <rect x="40" y="76" width="8" height="24" rx="3" fill="url(#g-fabric)" />
    <rect x="40" y="94" width="30" height="6" rx="3" fill="url(#g-fabric)" />
  </g>
  <path d="M55 100 v4 M44 107 h22" stroke="#4a5058" stroke-width="2" stroke-linecap="round" />
  <circle cx="44" cy="107.5" r="1.6" fill="#2b3138" />
  <circle cx="66" cy="107.5" r="1.6" fill="#2b3138" />

  ${plant(150, 106, '-.5s')}
`;
