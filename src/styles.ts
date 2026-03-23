import { css } from 'lit';

export const cardStyles = css`
  :host {
    --acc-primary: #0764fa;
    --acc-accent: #8acdd7;
    --acc-glow-active: rgba(138, 205, 215, 0.8);
    --acc-glow-secondary: rgba(7, 100, 250, 0.3);
    --acc-background-tint: rgba(7, 100, 250, 0.08);
  }

  .card {
    position: relative;
    min-height: 180px;
    border-radius: 16px;
    padding: 20px;
    overflow: hidden;
    cursor: pointer;
    background: var(--ha-card-background, var(--card-background-color, #fff));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s ease;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    gap: 0;
    box-sizing: border-box;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--acc-background-tint);
    border-radius: 16px;
    pointer-events: none;
    z-index: 0;
  }

  .card.occupied {
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.08),
      0 0 20px var(--acc-glow-secondary);
    animation: borderGlow 2s ease-in-out infinite;
  }

  .room-name {
    grid-column: 1;
    grid-row: 1;
    font-size: 22px;
    font-weight: 600;
    color: var(--acc-primary);
    margin: 0;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    z-index: 1;
    padding-bottom: 6px;
    border-bottom: 2px solid var(--acc-accent);
    align-self: start;
  }

  .room-state {
    grid-column: 2;
    grid-row: 2;
    font-size: 13px;
    font-weight: 400;
    color: var(--acc-primary);
    opacity: 0.7;
    align-self: end;
    justify-self: end;
    position: relative;
    z-index: 1;
  }

  .chips-container {
    grid-column: 2;
    grid-row: 1;
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(2, 36px);
    gap: 6px;
    justify-items: center;
    align-content: start;
    margin-inline-start: 12px;
  }

  /* Gradient blob background */
  .gradient-blob {
    position: absolute;
    bottom: -20px;
    inset-inline-start: -20px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--acc-accent) 0%, var(--acc-primary) 100%);
    opacity: 0.25;
    filter: blur(30px);
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .gradient-blob.animated {
    animation: gradientShift 4s ease-in-out infinite;
  }

  /* Bottom-left visual element (icon / image) */
  .bottom-visual {
    grid-column: 1;
    grid-row: 2;
    position: relative;
    z-index: 0;
    align-self: end;
    justify-self: start;
    width: 110px;
    height: 110px;
    overflow: hidden;
    pointer-events: none;
  }

  .bottom-visual.icon-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.18;
    color: var(--acc-primary);
    transition: opacity 0.3s ease;
  }

  .bottom-visual.icon-visual ha-icon {
    --mdc-icon-size: 90px;
  }

  .bottom-visual.icon-visual.animated {
    animation: iconBreathe 3s ease-in-out infinite;
  }

  .bottom-visual.image-visual {
    border-radius: 16px;
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }

  .bottom-visual.image-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    filter: saturate(0.5);
    mask-image: radial-gradient(ellipse at bottom left, black 40%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at bottom left, black 40%, transparent 70%);
  }

  .bottom-visual.image-visual.animated img {
    animation: imageBreathe 3s ease-in-out infinite;
  }

  /* Presence badge */
  .presence-badge {
    position: absolute;
    top: 14px;
    inset-inline-end: 14px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--acc-accent);
    z-index: 2;
    animation: presencePulse 1.5s ease-in-out infinite;
  }

  /* Entity chip */
  .chip {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    padding: 0;
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;
    position: relative;
  }

  .chip.active {
    background: var(--acc-primary);
    box-shadow: 0 0 12px var(--acc-glow-active);
    animation: chipGlow 2s ease-in-out infinite;
  }

  .chip.inactive {
    background: rgba(128, 128, 128, 0.15);
  }

  .chip.unavailable {
    background: rgba(128, 128, 128, 0.08);
    opacity: 0.5;
    cursor: default;
  }

  .chip ha-icon {
    --mdc-icon-size: 20px;
  }

  .chip.active ha-icon {
    color: #fff;
  }

  .chip.inactive ha-icon {
    color: var(--primary-text-color, #333);
    opacity: 0.6;
  }

  .chip.unavailable ha-icon {
    color: var(--disabled-text-color, #999);
  }

  .chip.active .icon-spin {
    animation: iconSpin 3s linear infinite;
  }

  /* Animations */
  @keyframes borderGlow {
    0%,
    100% {
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.08),
        0 0 20px var(--acc-glow-secondary);
    }
    50% {
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.08),
        0 0 35px var(--acc-glow-secondary);
    }
  }

  @keyframes chipGlow {
    0%,
    100% {
      box-shadow: 0 0 12px var(--acc-glow-active);
    }
    50% {
      box-shadow: 0 0 20px var(--acc-glow-active);
    }
  }

  @keyframes gradientShift {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.25;
    }
    50% {
      transform: translate(10px, -10px) scale(1.1);
      opacity: 0.35;
    }
  }

  @keyframes iconBreathe {
    0%,
    100% {
      opacity: 0.18;
      transform: scale(1);
    }
    50% {
      opacity: 0.28;
      transform: scale(1.05);
    }
  }

  @keyframes imageBreathe {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes presencePulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.7;
    }
  }

  @keyframes iconSpin {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .card.occupied,
    .chip.active,
    .gradient-blob.animated,
    .bottom-visual.icon-visual.animated,
    .bottom-visual.image-visual.animated img,
    .presence-badge,
    .chip.active .icon-spin {
      animation: none !important;
    }
  }

  /* Responsive */
  @container (max-width: 300px) {
    .chips-container {
      grid-template-columns: 36px;
    }

    .bottom-visual {
      width: 80px;
      height: 80px;
    }

    .bottom-visual.icon-visual ha-icon {
      --mdc-icon-size: 60px;
    }

    .gradient-blob {
      width: 100px;
      height: 100px;
    }
  }
`;

export const editorStyles = css`
  .editor {
    padding: 16px;
  }

  .editor h3 {
    font-size: 14px;
    font-weight: 500;
    margin: 16px 0 8px;
    color: var(--primary-text-color);
  }

  .editor h3:first-child {
    margin-top: 0;
  }

  .side-by-side {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 8px;
  }

  .color-swatches {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 8px 0;
  }

  .color-swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid transparent;
    cursor: pointer;
    transition:
      border-color 0.2s,
      transform 0.2s;
    padding: 0;
  }

  .color-swatch:hover {
    transform: scale(1.1);
  }

  .color-swatch.selected {
    border-color: var(--primary-color);
    transform: scale(1.15);
  }

  .entity-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .entity-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 8px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }

  .entity-row ha-icon {
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .entity-row .entity-name {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entity-row .domain-badge {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--accent-color, #03a9f4);
    color: #fff;
    text-transform: capitalize;
    flex-shrink: 0;
  }

  .entity-row .reorder-buttons {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .entity-row .reorder-buttons button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    font-size: 14px;
    color: var(--secondary-text-color);
  }

  .max-warning {
    font-size: 12px;
    color: var(--error-color, #db4437);
    margin-top: 4px;
  }

  .advanced-toggle {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--secondary-text-color);
    margin-top: 16px;
    background: none;
    border: none;
    padding: 0;
  }
`;
