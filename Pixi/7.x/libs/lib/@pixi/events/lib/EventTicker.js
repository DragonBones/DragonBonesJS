"use strict";
var core = require("@pixi/core");
class EventsTickerClass {
  constructor() {
    this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this.tickerAdded = !1, this._pauseUpdate = !0;
  }
  /**
   * Initializes the event ticker.
   * @param events - The event system.
   */
  init(events) {
    this.removeTickerListener(), this.events = events, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this.tickerAdded = !1, this._pauseUpdate = !0;
  }
  /** Whether to pause the update checks or not. */
  get pauseUpdate() {
    return this._pauseUpdate;
  }
  set pauseUpdate(paused) {
    this._pauseUpdate = paused;
  }
  /** Adds the ticker listener. */
  addTickerListener() {
    this.tickerAdded || !this.domElement || (core.Ticker.system.add(this.tickerUpdate, this, core.UPDATE_PRIORITY.INTERACTION), this.tickerAdded = !0);
  }
  /** Removes the ticker listener. */
  removeTickerListener() {
    this.tickerAdded && (core.Ticker.system.remove(this.tickerUpdate, this), this.tickerAdded = !1);
  }
  /** Sets flag to not fire extra events when the user has already moved there mouse */
  pointerMoved() {
    this._didMove = !0;
  }
  /** Updates the state of interactive objects. */
  update() {
    if (!this.domElement || this._pauseUpdate)
      return;
    if (this._didMove) {
      this._didMove = !1;
      return;
    }
    const rootPointerEvent = this.events.rootPointerEvent;
    this.events.supportsTouchEvents && rootPointerEvent.pointerType === "touch" || globalThis.document.dispatchEvent(new PointerEvent("pointermove", {
      clientX: rootPointerEvent.clientX,
      clientY: rootPointerEvent.clientY
    }));
  }
  /**
   * Updates the state of interactive objects if at least {@link PIXI.EventsTicker#interactionFrequency}
   * milliseconds have passed since the last invocation.
   *
   * Invoked by a throttled ticker update from {@link PIXI.Ticker.system}.
   * @param deltaTime - time delta since the last call
   */
  tickerUpdate(deltaTime) {
    this._deltaTime += deltaTime, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this.update());
  }
}
const EventsTicker = new EventsTickerClass();
exports.EventsTicker = EventsTicker;
//# sourceMappingURL=EventTicker.js.map
