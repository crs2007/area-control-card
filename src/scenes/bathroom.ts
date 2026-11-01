import { svg } from 'lit';
import { floorShadow } from './parts';

/** Bathtub with a shower, mirror and towel. Motion: water drips, mirror fogs, towel sways. */
export const bathroom = () => svg`
  ${floorShadow(70, 60)}

  <!-- shower -->
  <path d="M18 106 V22 Q18 16 24 16 H34 V26" stroke="url(#g-chrome)" stroke-width="3" fill="none" stroke-linecap="round" />
  <path d="M27 26 h14 l-2 4 h-10 z" fill="url(#g-chrome)" stroke="#6f7781" stroke-width=".5" />
  <g class="drip" fill="#6cc4ef">
    <ellipse cx="30" cy="34" rx="1.2" ry="2" />
    <ellipse cx="34" cy="34" rx="1.2" ry="2" style="animation-delay: -.3s" />
    <ellipse cx="38" cy="34" rx="1.2" ry="2" style="animation-delay: -.6s" />
    <ellipse cx="32" cy="34" rx="1.2" ry="2" style="animation-delay: -.45s" />
    <ellipse cx="36" cy="34" rx="1.2" ry="2" style="animation-delay: -.15s" />
  </g>

  <!-- tub -->
  <ellipse cx="66" cy="68" rx="48" ry="5" fill="url(#g-water)" />
  <g class="bob" fill="#fff" opacity=".9">
    <circle cx="48" cy="66" r="3" />
    <circle cx="54" cy="64" r="2" />
    <circle cx="84" cy="66" r="2.6" />
  </g>
  <path d="M16 68 H116 Q116 98 92 100 H40 Q16 98 16 68 Z" fill="url(#g-body)" />
  <path d="M16 68 H116 Q116 98 92 100 H40 Q16 98 16 68 Z" fill="url(#g-gloss)" />
  <rect x="13" y="65" width="106" height="5" rx="2.5" fill="#fff" stroke="#d4d9df" stroke-width=".6" />
  <path d="M34 100 l-4 7 h6 l2 -7z M98 100 l4 7 h-6 l-2 -7z" fill="url(#g-chrome)" />

  <!-- mirror -->
  <ellipse cx="136" cy="34" rx="15" ry="19" style="fill: var(--acc-accent)" />
  <ellipse cx="136" cy="34" rx="12.5" ry="16.5" fill="url(#g-sky)" />
  <path d="M129 24 q3 -5 8 -6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" />
  <ellipse class="fog" cx="136" cy="38" rx="12" ry="12" fill="#fff" />

  <!-- towel -->
  <path d="M124 64 H150" stroke="url(#g-chrome)" stroke-width="2.4" stroke-linecap="round" />
  <g class="sway" style="--sw: 4deg; --d: 3s; transform-origin: 50% 0">
    <rect x="128" y="63" width="18" height="34" rx="2" style="fill: var(--acc-primary)" />
    <rect x="128" y="88" width="18" height="3" style="fill: var(--acc-accent)" />
    <rect x="128" y="63" width="6" height="34" fill="#fff" opacity=".18" />
  </g>
`;
