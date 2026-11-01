import { css } from 'lit';

/*
 * Room scene animations. The wrapper carries the state classes:
 *   .motion     a chosen presence sensor is on
 *   .lights-on  a shown light is on
 *   .fan-on     a shown fan is on
 *   .media-on   a shown media player is playing
 * Everything is static while none of them is set. Only transform and opacity are animated.
 */
export const sceneStyles = css`
  .bottom-visual.scene-visual {
    width: 208px;
    height: 156px;
    margin-block-end: -14px;
    margin-inline-start: -12px;
    filter: saturate(0.7);
    transition: filter 0.6s ease;
  }

  .scene-visual.motion,
  .scene-visual.lights-on,
  .scene-visual.media-on,
  .scene-visual.fan-on {
    filter: none;
  }

  .scene-visual svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }

  .scene-visual .sway,
  .scene-visual .spin,
  .scene-visual .bob,
  .scene-visual .breathe,
  .scene-visual .bounce,
  .scene-visual .ball-shadow,
  .scene-visual .twinkle,
  .scene-visual .type,
  .scene-visual .drip ellipse,
  .scene-visual .steam path,
  .scene-visual .drift,
  .scene-visual .flutter,
  .scene-visual .ripple {
    transform-box: fill-box;
    transform-origin: 50% 50%;
  }

  .scene-visual .sway,
  .scene-visual .breathe {
    transform-origin: 50% 100%;
  }

  .scene-visual .type {
    transform-origin: 0 50%;
  }

  /* Lamps: dim on motion, bright when a light is on */
  .scene-visual .glow,
  .scene-visual .beam {
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  .scene-visual.motion .glow {
    opacity: 0.5;
  }
  .scene-visual.motion .beam {
    opacity: 0.3;
  }
  .scene-visual.lights-on .glow {
    opacity: 1;
    animation: sc-glow 3.5s ease-in-out infinite;
  }
  .scene-visual.lights-on .beam {
    opacity: 0.8;
  }

  /* Screens: the TV wakes for media, the office monitor also wakes on motion */
  .scene-visual .screen {
    opacity: 0.18;
    transition: opacity 0.6s ease;
  }
  .scene-visual.media-on .screen,
  .scene-visual.motion .screen.wake {
    opacity: 1;
  }
  .scene-visual .scan {
    opacity: 0;
  }
  .scene-visual.media-on .scan {
    animation: sc-scan 2.6s linear infinite;
  }
  .scene-visual.motion .type {
    animation: sc-type 3.2s steps(6, end) infinite;
  }

  .scene-visual .glow-soft {
    opacity: 0.15;
    transition: opacity 0.6s ease;
  }
  .scene-visual.motion .glow-soft {
    opacity: 0.7;
  }

  .scene-visual .fog {
    opacity: 0;
    transition: opacity 2s ease;
  }
  .scene-visual.motion .fog {
    opacity: 0.45;
  }

  .scene-visual .steam path,
  .scene-visual .drip ellipse {
    opacity: 0;
  }
  .scene-visual.motion .steam path {
    animation: sc-steam 2.4s ease-out infinite;
  }
  .scene-visual.motion .drip ellipse {
    animation: sc-drip 0.9s linear infinite;
  }

  .scene-visual.motion .sway {
    animation: sc-sway var(--d, 3s) ease-in-out infinite;
  }
  .scene-visual.motion .bob {
    animation: sc-bob 2.4s ease-in-out infinite;
  }
  .scene-visual.motion .breathe {
    animation: sc-breathe 4s ease-in-out infinite;
  }
  .scene-visual.motion .twinkle {
    animation: sc-twinkle 1.8s ease-in-out infinite;
  }
  .scene-visual.motion .bounce {
    animation: sc-bounce 1.1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .scene-visual.motion .ball-shadow {
    animation: sc-ball-shadow 1.1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .scene-visual.motion .drift {
    animation: sc-drift 7s ease-in-out infinite;
  }
  .scene-visual.motion .flutter {
    animation: sc-flutter 0.25s ease-in-out infinite alternate;
  }

  /* Ceiling fan and sun rays: slow on motion, fast when the fan is on */
  .scene-visual.motion .spin {
    animation: sc-spin 2.4s linear infinite;
  }
  .scene-visual.fan-on .spin {
    animation: sc-spin 0.6s linear infinite;
  }
  .scene-visual .spin.slow {
    animation-duration: 14s;
  }
  .scene-visual .air path {
    opacity: 0;
    stroke-dasharray: 4 6;
  }
  .scene-visual.fan-on .air path {
    opacity: 0.75;
    animation: sc-air 0.8s linear infinite;
  }

  .scene-visual .ripple {
    fill: none;
    stroke: var(--acc-accent);
    stroke-width: 1.5;
    opacity: 0;
  }
  .scene-visual.motion .ripple {
    animation: sc-ripple 2.8s ease-out infinite;
  }

  @keyframes sc-sway {
    0%,
    100% {
      transform: rotate(calc(var(--sw, 4deg) * -1));
    }
    50% {
      transform: rotate(var(--sw, 4deg));
    }
  }

  @keyframes sc-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes sc-bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-1.5px);
    }
  }

  @keyframes sc-breathe {
    0%,
    100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(1.05);
    }
  }

  @keyframes sc-glow {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  @keyframes sc-scan {
    from {
      transform: translateX(0);
      opacity: 0.6;
    }
    to {
      transform: translateX(31px);
      opacity: 0;
    }
  }

  @keyframes sc-type {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  @keyframes sc-steam {
    0% {
      opacity: 0;
      transform: translateY(4px) scaleX(0.8);
    }
    35% {
      opacity: 0.85;
    }
    100% {
      opacity: 0;
      transform: translateY(-8px) scaleX(1.2);
    }
  }

  @keyframes sc-drip {
    0% {
      opacity: 0.9;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(30px);
    }
  }

  @keyframes sc-twinkle {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(0.7);
    }
    50% {
      opacity: 1;
      transform: scale(1.15);
    }
  }

  @keyframes sc-bounce {
    0%,
    100% {
      transform: translateY(0) scale(1.06, 0.94);
    }
    12% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-14px);
    }
  }

  @keyframes sc-ball-shadow {
    0%,
    100% {
      transform: scaleX(1);
      opacity: 0.2;
    }
    50% {
      transform: scaleX(0.55);
      opacity: 0.1;
    }
  }

  @keyframes sc-drift {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-18px, -8px);
    }
    50% {
      transform: translate(-34px, 4px);
    }
    75% {
      transform: translate(-14px, 10px);
    }
  }

  @keyframes sc-flutter {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0.35);
    }
  }

  @keyframes sc-air {
    to {
      stroke-dashoffset: -20;
    }
  }

  @keyframes sc-ripple {
    0% {
      opacity: 0.55;
      transform: scale(0.8);
    }
    100% {
      opacity: 0;
      transform: scale(1.18);
    }
  }

  @container (max-width: 300px) {
    .bottom-visual.scene-visual {
      width: 152px;
      height: 114px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scene-visual *,
    .scene-visual.lights-on .glow {
      animation: none !important;
    }
  }
`;
