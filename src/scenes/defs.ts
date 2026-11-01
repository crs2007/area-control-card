/*
 * Shared gradients for the room scenes.
 *
 * The chrome, gloss, shadow, body, dark and warm gradients, the ceiling fan and the lamp
 * beam/glow technique are adapted from ha-appliance-electromenager-cards
 * (https://github.com/skyrotter/ha-appliance-electromenager-cards),
 * Copyright (c) 2026 Nicolas, MIT License. See THIRD_PARTY_NOTICES.md.
 *
 * Each card renders in its own shadow root, so these ids cannot clash between cards.
 * Gradients that use --acc-* follow the card's color preset.
 */
import { svg } from 'lit';

export const defs = svg`
  <defs>
    <radialGradient id="g-backdrop" cx=".45" cy=".55" r=".6">
      <stop offset="0" style="stop-color: var(--acc-accent); stop-opacity: .45" />
      <stop offset=".7" style="stop-color: var(--acc-primary); stop-opacity: .22" />
      <stop offset="1" style="stop-color: var(--acc-primary); stop-opacity: 0" />
    </radialGradient>
    <linearGradient id="g-fabric" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color: var(--acc-accent)" />
      <stop offset="1" style="stop-color: var(--acc-primary)" />
    </linearGradient>
    <linearGradient id="g-body" x1="0" x2="1">
      <stop offset="0" stop-color="#eef1f4" />
      <stop offset=".5" stop-color="#ffffff" />
      <stop offset="1" stop-color="#d4d9df" />
    </linearGradient>
    <linearGradient id="g-chrome" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbfcfd" />
      <stop offset=".3" stop-color="#a3abb4" />
      <stop offset=".55" stop-color="#eef1f4" />
      <stop offset=".8" stop-color="#8d959f" />
      <stop offset="1" stop-color="#c9ced4" />
    </linearGradient>
    <linearGradient id="g-gloss" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".55" />
      <stop offset=".45" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="g-shadow">
      <stop offset="0" stop-color="#000" stop-opacity=".35" />
      <stop offset="1" stop-color="#000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="g-dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b3138" />
      <stop offset="1" stop-color="#101317" />
    </linearGradient>
    <linearGradient id="g-wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#a8743f" />
      <stop offset=".5" stop-color="#c9935a" />
      <stop offset="1" stop-color="#8a5a2b" />
    </linearGradient>
    <linearGradient id="g-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff7e0" />
      <stop offset="1" stop-color="#f1d9a6" />
    </linearGradient>
    <radialGradient id="g-glow">
      <stop offset="0" stop-color="#fff3c4" stop-opacity=".95" />
      <stop offset=".45" stop-color="#ffd27a" stop-opacity=".45" />
      <stop offset="1" stop-color="#ffb347" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="g-beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe9a0" stop-opacity=".6" />
      <stop offset="1" stop-color="#ffe9a0" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="g-screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style="stop-color: var(--acc-accent)" />
      <stop offset="1" style="stop-color: var(--acc-primary)" />
    </linearGradient>
    <linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7fd38a" />
      <stop offset="1" stop-color="#2e8b57" />
    </linearGradient>
    <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bfe3f7" />
      <stop offset="1" stop-color="#eaf6fd" />
    </linearGradient>
    <linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bfe9ff" />
      <stop offset="1" stop-color="#6cc4ef" />
    </linearGradient>
    <radialGradient id="g-sun" cx=".4" cy=".4">
      <stop offset="0" stop-color="#fff6c2" />
      <stop offset=".6" stop-color="#ffd54f" />
      <stop offset="1" stop-color="#ffb300" />
    </radialGradient>
  </defs>
`;
