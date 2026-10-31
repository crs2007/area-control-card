import { ActionKind } from './actions';

export const HOLD_MS = 500;
export const DOUBLE_TAP_MS = 250;

/**
 * Turns pointer events into tap / hold / double-tap. A tap is only delayed (to wait for a
 * possible second tap) when a double-tap action is actually configured.
 */
export class ActionGesture {
  private _holdTimer?: ReturnType<typeof setTimeout>;
  private _tapTimer?: ReturnType<typeof setTimeout>;
  private _held = false;

  constructor(
    private readonly _fire: (kind: ActionKind) => void,
    private readonly _has: (kind: ActionKind) => boolean,
  ) {}

  down(): void {
    this._held = false;
    this._clearHold();
    if (!this._has('hold')) return;
    this._holdTimer = setTimeout(() => {
      this._held = true;
      this._holdTimer = undefined;
      this._fire('hold');
    }, HOLD_MS);
  }

  up(): void {
    this._clearHold();
    if (this._held) {
      this._held = false;
      return;
    }

    if (this._has('double_tap')) {
      if (this._tapTimer) {
        clearTimeout(this._tapTimer);
        this._tapTimer = undefined;
        this._fire('double_tap');
      } else {
        this._tapTimer = setTimeout(() => {
          this._tapTimer = undefined;
          this._fire('tap');
        }, DOUBLE_TAP_MS);
      }
    } else {
      this._fire('tap');
    }
  }

  cancel(): void {
    this._clearHold();
    this._held = false;
  }

  /** Keyboard activation: always a plain tap */
  key(): void {
    this._fire('tap');
  }

  dispose(): void {
    this._clearHold();
    if (this._tapTimer) clearTimeout(this._tapTimer);
    this._tapTimer = undefined;
  }

  private _clearHold(): void {
    if (this._holdTimer) clearTimeout(this._holdTimer);
    this._holdTimer = undefined;
  }
}
