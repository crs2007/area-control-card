import { svg } from 'lit';
import { beam, floorShadow, glow, plant } from './parts';

/** Sofa, floor lamp, wall TV and a plant. Motion: TV flickers, plant and cushion sway. */
export const living = () => svg`
  ${floorShadow(80, 66)}
  <ellipse cx="80" cy="106" rx="46" ry="6" style="fill: var(--acc-accent); opacity: .35" />

  <!-- wall TV -->
  <rect x="58" y="18" width="44" height="28" rx="2.5" fill="url(#g-dark)" />
  <g class="screen">
    <rect x="60.5" y="20.5" width="39" height="23" rx="1" fill="url(#g-screen)" />
    <rect class="scan" x="60.5" y="20.5" width="8" height="23" fill="#fff" opacity=".25" />
  </g>
  <rect x="60.5" y="20.5" width="39" height="23" rx="1" fill="url(#g-gloss)" />

  <!-- floor lamp -->
  ${beam('M14 38 L2 106 L44 106 L30 38 Z')}
  ${glow(22, 34, 18)}
  <rect x="21" y="38" width="2" height="66" fill="url(#g-chrome)" />
  <ellipse cx="22" cy="105" rx="8" ry="2" fill="#4a5058" />
  <path d="M12 38 L32 38 L27.5 22 L16.5 22 Z" fill="url(#g-shade)" stroke="#d8bf8a" stroke-width=".6" />

  <!-- sofa -->
  <rect x="44" y="62" width="72" height="26" rx="8" fill="url(#g-fabric)" />
  <rect x="44" y="62" width="72" height="26" rx="8" fill="url(#g-gloss)" opacity=".5" />
  <rect x="48" y="80" width="31" height="13" rx="4" fill="url(#g-fabric)" />
  <rect x="81" y="80" width="31" height="13" rx="4" fill="url(#g-fabric)" />
  <path d="M50 82h27M83 82h27" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" stroke-linecap="round" />
  <rect x="36" y="71" width="14" height="26" rx="6" fill="url(#g-fabric)" />
  <rect x="110" y="71" width="14" height="26" rx="6" fill="url(#g-fabric)" />
  <rect x="38" y="92" width="84" height="6" rx="3" style="fill: var(--acc-primary)" />
  <rect x="38" y="92" width="84" height="6" rx="3" fill="#000" opacity=".15" />
  <rect x="42" y="98" width="4" height="7" rx="1" fill="url(#g-wood)" />
  <rect x="114" y="98" width="4" height="7" rx="1" fill="url(#g-wood)" />
  <g transform="translate(58 74)">
    <g class="sway" style="--sw: 6deg; --d: 2.6s">
      <rect x="-8" y="-8" width="16" height="15" rx="4" fill="#ffb74d" transform="rotate(-10)" />
    </g>
  </g>

  ${plant(140, 106, '-1.2s')}
`;
