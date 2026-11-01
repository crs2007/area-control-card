import { svg } from 'lit';
import { floorShadow } from './parts';

/** Tree, bench, sun and flowers. Motion: leaves sway, sun rays turn, a butterfly flutters by. */
export const outdoor = () => svg`
  ${floorShadow(80, 70, 109)}

  <!-- sun -->
  <g transform="translate(130 24)">
    <g class="spin slow" stroke="#ffc94d" stroke-width="2" stroke-linecap="round">
      <path d="M0 -17v-5M0 17v5M-17 0h-5M17 0h5M-12 -12l-3.5 -3.5M12 12l3.5 3.5M-12 12l-3.5 3.5M12 -12l3.5 -3.5" />
    </g>
  </g>
  <circle cx="130" cy="24" r="11" fill="url(#g-sun)" />

  <!-- grass -->
  <path d="M6 106 Q40 96 80 100 T154 104 V110 H6 Z" fill="#7fd38a" />
  <path d="M6 106 Q40 96 80 100 T154 104" stroke="#3fa66b" stroke-width="1" fill="none" />

  <!-- tree -->
  <path d="M33 104 Q36 80 34 62 H44 Q42 80 46 104 Z" fill="url(#g-wood)" />
  <g class="sway" style="--sw: 2.5deg; --d: 4s">
    <circle cx="39" cy="44" r="20" fill="#2e8b57" />
    <circle cx="26" cy="54" r="13" fill="#3fa66b" />
    <circle cx="53" cy="52" r="14" fill="#3fa66b" />
    <circle cx="40" cy="32" r="13" fill="url(#g-leaf)" />
    <circle cx="33" cy="38" r="5" fill="#fff" opacity=".18" />
    <circle cx="46" cy="50" r="2.2" fill="#e5484d" />
    <circle cx="30" cy="56" r="2.2" fill="#e5484d" />
  </g>

  <!-- bench -->
  <rect x="76" y="76" width="56" height="4" rx="1.5" fill="url(#g-wood)" />
  <rect x="76" y="82" width="56" height="4" rx="1.5" fill="url(#g-wood)" />
  <rect x="72" y="90" width="64" height="4" rx="1.5" fill="url(#g-wood)" />
  <path d="M80 76v28M128 76v28" stroke="#4a5058" stroke-width="2.4" stroke-linecap="round" />
  <rect x="94" y="84" width="14" height="6" rx="3" style="fill: var(--acc-accent)" />

  <!-- flowers -->
  <g class="sway" style="--sw: 7deg; --d: 2.2s">
    <path d="M60 104v-10M66 104v-14" stroke="#3fa66b" stroke-width="1.2" />
    <circle cx="60" cy="93" r="2.6" style="fill: var(--acc-primary)" />
    <circle cx="66" cy="89" r="2.6" fill="#ffd54f" />
  </g>
  <g class="sway" style="--sw: 6deg; --d: 2.6s; animation-delay: -1s">
    <path d="M144 104v-12M150 104v-8" stroke="#3fa66b" stroke-width="1.2" />
    <circle cx="144" cy="91" r="2.6" fill="#ff7aa2" />
    <circle cx="150" cy="95" r="2.6" style="fill: var(--acc-accent)" />
  </g>

  <!-- butterfly -->
  <g class="drift">
    <g class="flutter">
      <path d="M100 50 q-6 -7 -8 -1 q2 5 8 1z M100 50 q6 -7 8 -1 q-2 5 -8 1z" style="fill: var(--acc-primary)" />
    </g>
  </g>
`;
