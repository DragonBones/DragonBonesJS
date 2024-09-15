"use strict";
var core = require("@pixi/core"), EventBoundary = require("./EventBoundary.js"), EventTicker = require("./EventTicker.js"), FederatedPointerEvent = require("./FederatedPointerEvent.js"), FederatedWheelEvent = require("./FederatedWheelEvent.js");
const MOUSE_POINTER_ID = 1, TOUCH_TO_POINTER = {
  touchstart: "pointerdown",
  touchend: "pointerup",
  touchendoutside: "pointerupoutside",
  touchmove: "pointermove",
  touchcancel: "pointercancel"
}, _EventSystem = class _EventSystem2 {
  /**
   * @param {PIXI.Renderer} renderer
   */
  constructor(renderer) {
    this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = renderer, this.rootBoundary = new EventBoundary.EventBoundary(null), EventTicker.EventsTicker.init(this), this.autoPreventDefault = !0, this.eventsAdded = !1, this.rootPointerEvent = new FederatedPointerEvent.FederatedPointerEvent(null), this.rootWheelEvent = new FederatedWheelEvent.FederatedWheelEvent(null), this.cursorStyles = {
      default: "inherit",
      pointer: "pointer"
    }, this.features = new Proxy({ ..._EventSystem2.defaultEventFeatures }, {
      set: (target, key, value) => (key === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = value), target[key] = value, !0)
    }), this.onPointerDown = this.onPointerDown.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), this.onPointerOverOut = this.onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this);
  }
  /**
   * The default interaction mode for all display objects.
   * @see PIXI.DisplayObject.eventMode
   * @type {PIXI.EventMode}
   * @readonly
   * @since 7.2.0
   */
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(options) {
    const { view, resolution } = this.renderer;
    this.setTargetElement(view), this.resolution = resolution, _EventSystem2._defaultEventMode = options.eventMode ?? "auto", Object.assign(this.features, options.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  /**
   * Handle changing resolution.
   * @ignore
   */
  resolutionChange(resolution) {
    this.resolution = resolution;
  }
  /** Destroys all event listeners and detaches the renderer. */
  destroy() {
    this.setTargetElement(null), this.renderer = null;
  }
  /**
   * Sets the current cursor mode, handling any callbacks or CSS style changes.
   * @param mode - cursor mode, a key from the cursorStyles dictionary
   */
  setCursor(mode) {
    mode = mode || "default";
    let applyStyles = !0;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (applyStyles = !1), this.currentCursor === mode)
      return;
    this.currentCursor = mode;
    const style = this.cursorStyles[mode];
    if (style)
      switch (typeof style) {
        case "string":
          applyStyles && (this.domElement.style.cursor = style);
          break;
        case "function":
          style(mode);
          break;
        case "object":
          applyStyles && Object.assign(this.domElement.style, style);
          break;
      }
    else
      applyStyles && typeof mode == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode) && (this.domElement.style.cursor = mode);
  }
  /**
   * The global pointer event.
   * Useful for getting the pointer position without listening to events.
   * @since 7.2.0
   */
  get pointer() {
    return this.rootPointerEvent;
  }
  /**
   * Event handler for pointer down events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerDown(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const events = this.normalizeToPointerData(nativeEvent);
    this.autoPreventDefault && events[0].isNormalized && (nativeEvent.cancelable || !("cancelable" in nativeEvent)) && nativeEvent.preventDefault();
    for (let i = 0, j = events.length; i < j; i++) {
      const nativeEvent2 = events[i], federatedEvent = this.bootstrapEvent(this.rootPointerEvent, nativeEvent2);
      this.rootBoundary.mapEvent(federatedEvent);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer move events on on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch events.
   */
  onPointerMove(nativeEvent) {
    if (!this.features.move)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, EventTicker.EventsTicker.pointerMoved();
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i = 0, j = normalizedEvents.length; i < j; i++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i]);
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer up events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerUp(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    let target = nativeEvent.target;
    nativeEvent.composedPath && nativeEvent.composedPath().length > 0 && (target = nativeEvent.composedPath()[0]);
    const outside = target !== this.domElement ? "outside" : "", normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i = 0, j = normalizedEvents.length; i < j; i++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i]);
      event.type += outside, this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer over & out events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerOverOut(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i = 0, j = normalizedEvents.length; i < j; i++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i]);
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Passive handler for `wheel` events on {@link PIXI.EventSystem.domElement this.domElement}.
   * @param nativeEvent - The native wheel event.
   */
  onWheel(nativeEvent) {
    if (!this.features.wheel)
      return;
    const wheelEvent = this.normalizeWheelEvent(nativeEvent);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(wheelEvent);
  }
  /**
   * Sets the {@link PIXI.EventSystem#domElement domElement} and binds event listeners.
   *
   * To deregister the current DOM element without setting a new one, pass {@code null}.
   * @param element - The new DOM element.
   */
  setTargetElement(element) {
    this.removeEvents(), this.domElement = element, EventTicker.EventsTicker.domElement = element, this.addEvents();
  }
  /** Register event listeners on {@link PIXI.Renderer#domElement this.domElement}. */
  addEvents() {
    if (this.eventsAdded || !this.domElement)
      return;
    EventTicker.EventsTicker.addTickerListener();
    const style = this.domElement.style;
    style && (globalThis.navigator.msPointerEnabled ? (style.msContentZooming = "none", style.msTouchAction = "none") : this.supportsPointerEvents && (style.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this.onPointerMove, !0), this.domElement.addEventListener("pointerdown", this.onPointerDown, !0), this.domElement.addEventListener("pointerleave", this.onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this.onPointerOverOut, !0), globalThis.addEventListener("pointerup", this.onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this.onPointerMove, !0), this.domElement.addEventListener("mousedown", this.onPointerDown, !0), this.domElement.addEventListener("mouseout", this.onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this.onPointerOverOut, !0), globalThis.addEventListener("mouseup", this.onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this.onPointerDown, !0), this.domElement.addEventListener("touchend", this.onPointerUp, !0), this.domElement.addEventListener("touchmove", this.onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
      passive: !0,
      capture: !0
    }), this.eventsAdded = !0;
  }
  /** Unregister event listeners on {@link PIXI.EventSystem#domElement this.domElement}. */
  removeEvents() {
    if (!this.eventsAdded || !this.domElement)
      return;
    EventTicker.EventsTicker.removeTickerListener();
    const style = this.domElement.style;
    globalThis.navigator.msPointerEnabled ? (style.msContentZooming = "", style.msTouchAction = "") : this.supportsPointerEvents && (style.touchAction = ""), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this.onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this.onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this.onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this.onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this.onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this.onPointerMove, !0), this.domElement.removeEventListener("mousedown", this.onPointerDown, !0), this.domElement.removeEventListener("mouseout", this.onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this.onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this.onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this.onPointerDown, !0), this.domElement.removeEventListener("touchend", this.onPointerUp, !0), this.domElement.removeEventListener("touchmove", this.onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement = null, this.eventsAdded = !1;
  }
  /**
   * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
   * resulting value is stored in the point. This takes into account the fact that the DOM
   * element could be scaled and positioned anywhere on the screen.
   * @param  {PIXI.IPointData} point - the point that the result will be stored in
   * @param  {number} x - the x coord of the position to map
   * @param  {number} y - the y coord of the position to map
   */
  mapPositionToPoint(point, x, y) {
    const rect = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
      x: 0,
      y: 0,
      width: this.domElement.width,
      height: this.domElement.height,
      left: 0,
      top: 0
    }, resolutionMultiplier = 1 / this.resolution;
    point.x = (x - rect.left) * (this.domElement.width / rect.width) * resolutionMultiplier, point.y = (y - rect.top) * (this.domElement.height / rect.height) * resolutionMultiplier;
  }
  /**
   * Ensures that the original event object contains all data that a regular pointer event would have
   * @param event - The original event data from a touch or mouse event
   * @returns An array containing a single normalized pointer event, in the case of a pointer
   *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
   */
  normalizeToPointerData(event) {
    const normalizedEvents = [];
    if (this.supportsTouchEvents && event instanceof TouchEvent)
      for (let i = 0, li = event.changedTouches.length; i < li; i++) {
        const touch = event.changedTouches[i];
        typeof touch.button > "u" && (touch.button = 0), typeof touch.buttons > "u" && (touch.buttons = 1), typeof touch.isPrimary > "u" && (touch.isPrimary = event.touches.length === 1 && event.type === "touchstart"), typeof touch.width > "u" && (touch.width = touch.radiusX || 1), typeof touch.height > "u" && (touch.height = touch.radiusY || 1), typeof touch.tiltX > "u" && (touch.tiltX = 0), typeof touch.tiltY > "u" && (touch.tiltY = 0), typeof touch.pointerType > "u" && (touch.pointerType = "touch"), typeof touch.pointerId > "u" && (touch.pointerId = touch.identifier || 0), typeof touch.pressure > "u" && (touch.pressure = touch.force || 0.5), typeof touch.twist > "u" && (touch.twist = 0), typeof touch.tangentialPressure > "u" && (touch.tangentialPressure = 0), typeof touch.layerX > "u" && (touch.layerX = touch.offsetX = touch.clientX), typeof touch.layerY > "u" && (touch.layerY = touch.offsetY = touch.clientY), touch.isNormalized = !0, touch.type = event.type, normalizedEvents.push(touch);
      }
    else if (!globalThis.MouseEvent || event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof globalThis.PointerEvent))) {
      const tempEvent = event;
      typeof tempEvent.isPrimary > "u" && (tempEvent.isPrimary = !0), typeof tempEvent.width > "u" && (tempEvent.width = 1), typeof tempEvent.height > "u" && (tempEvent.height = 1), typeof tempEvent.tiltX > "u" && (tempEvent.tiltX = 0), typeof tempEvent.tiltY > "u" && (tempEvent.tiltY = 0), typeof tempEvent.pointerType > "u" && (tempEvent.pointerType = "mouse"), typeof tempEvent.pointerId > "u" && (tempEvent.pointerId = MOUSE_POINTER_ID), typeof tempEvent.pressure > "u" && (tempEvent.pressure = 0.5), typeof tempEvent.twist > "u" && (tempEvent.twist = 0), typeof tempEvent.tangentialPressure > "u" && (tempEvent.tangentialPressure = 0), tempEvent.isNormalized = !0, normalizedEvents.push(tempEvent);
    } else
      normalizedEvents.push(event);
    return normalizedEvents;
  }
  /**
   * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
   *
   * The returned {@link PIXI.FederatedWheelEvent} is a shared instance. It will not persist across
   * multiple native wheel events.
   * @param nativeEvent - The native wheel event that occurred on the canvas.
   * @returns A federated wheel event.
   */
  normalizeWheelEvent(nativeEvent) {
    const event = this.rootWheelEvent;
    return this.transferMouseData(event, nativeEvent), event.deltaX = nativeEvent.deltaX, event.deltaY = nativeEvent.deltaY, event.deltaZ = nativeEvent.deltaZ, event.deltaMode = nativeEvent.deltaMode, this.mapPositionToPoint(event.screen, nativeEvent.clientX, nativeEvent.clientY), event.global.copyFrom(event.screen), event.offset.copyFrom(event.screen), event.nativeEvent = nativeEvent, event.type = nativeEvent.type, event;
  }
  /**
   * Normalizes the `nativeEvent` into a federateed {@link PIXI.FederatedPointerEvent}.
   * @param event
   * @param nativeEvent
   */
  bootstrapEvent(event, nativeEvent) {
    return event.originalEvent = null, event.nativeEvent = nativeEvent, event.pointerId = nativeEvent.pointerId, event.width = nativeEvent.width, event.height = nativeEvent.height, event.isPrimary = nativeEvent.isPrimary, event.pointerType = nativeEvent.pointerType, event.pressure = nativeEvent.pressure, event.tangentialPressure = nativeEvent.tangentialPressure, event.tiltX = nativeEvent.tiltX, event.tiltY = nativeEvent.tiltY, event.twist = nativeEvent.twist, this.transferMouseData(event, nativeEvent), this.mapPositionToPoint(event.screen, nativeEvent.clientX, nativeEvent.clientY), event.global.copyFrom(event.screen), event.offset.copyFrom(event.screen), event.isTrusted = nativeEvent.isTrusted, event.type === "pointerleave" && (event.type = "pointerout"), event.type.startsWith("mouse") && (event.type = event.type.replace("mouse", "pointer")), event.type.startsWith("touch") && (event.type = TOUCH_TO_POINTER[event.type] || event.type), event;
  }
  /**
   * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
   * @param event
   * @param nativeEvent
   */
  transferMouseData(event, nativeEvent) {
    event.isTrusted = nativeEvent.isTrusted, event.srcElement = nativeEvent.srcElement, event.timeStamp = performance.now(), event.type = nativeEvent.type, event.altKey = nativeEvent.altKey, event.button = nativeEvent.button, event.buttons = nativeEvent.buttons, event.client.x = nativeEvent.clientX, event.client.y = nativeEvent.clientY, event.ctrlKey = nativeEvent.ctrlKey, event.metaKey = nativeEvent.metaKey, event.movement.x = nativeEvent.movementX, event.movement.y = nativeEvent.movementY, event.page.x = nativeEvent.pageX, event.page.y = nativeEvent.pageY, event.relatedTarget = null, event.shiftKey = nativeEvent.shiftKey;
  }
};
_EventSystem.extension = {
  name: "events",
  type: [
    core.ExtensionType.RendererSystem,
    core.ExtensionType.CanvasRendererSystem
  ]
}, /**
* The event features that are enabled by the EventSystem
* This option only is available when using **@pixi/events** package
* (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
* @since 7.2.0
*/
_EventSystem.defaultEventFeatures = {
  move: !0,
  globalMove: !0,
  click: !0,
  wheel: !0
};
let EventSystem = _EventSystem;
core.extensions.add(EventSystem);
exports.EventSystem = EventSystem;
//# sourceMappingURL=EventSystem.js.map
