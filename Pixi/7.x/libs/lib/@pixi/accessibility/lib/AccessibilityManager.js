"use strict";
var core = require("@pixi/core"), display = require("@pixi/display"), events = require("@pixi/events"), accessibleTarget = require("./accessibleTarget.js");
display.DisplayObject.mixin(accessibleTarget.accessibleTarget);
const KEY_CODE_TAB = 9, DIV_TOUCH_SIZE = 100, DIV_TOUCH_POS_X = 0, DIV_TOUCH_POS_Y = 0, DIV_TOUCH_ZINDEX = 2, DIV_HOOK_SIZE = 1, DIV_HOOK_POS_X = -1e3, DIV_HOOK_POS_Y = -1e3, DIV_HOOK_ZINDEX = 2;
class AccessibilityManager {
  // 2fps
  /**
   * @param {PIXI.CanvasRenderer|PIXI.Renderer} renderer - A reference to the current renderer
   */
  constructor(renderer) {
    this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this.pool = [], this.renderId = 0, this.children = [], this.androidUpdateCount = 0, this.androidUpdateFrequency = 500, this._hookDiv = null, (core.utils.isMobile.tablet || core.utils.isMobile.phone) && this.createTouchHook();
    const div = document.createElement("div");
    div.style.width = `${DIV_TOUCH_SIZE}px`, div.style.height = `${DIV_TOUCH_SIZE}px`, div.style.position = "absolute", div.style.top = `${DIV_TOUCH_POS_X}px`, div.style.left = `${DIV_TOUCH_POS_Y}px`, div.style.zIndex = DIV_TOUCH_ZINDEX.toString(), this.div = div, this.renderer = renderer, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, !1);
  }
  /**
   * Value of `true` if accessibility is currently active and accessibility layers are showing.
   * @member {boolean}
   * @readonly
   */
  get isActive() {
    return this._isActive;
  }
  /**
   * Value of `true` if accessibility is enabled for touch devices.
   * @member {boolean}
   * @readonly
   */
  get isMobileAccessibility() {
    return this._isMobileAccessibility;
  }
  /**
   * Creates the touch hooks.
   * @private
   */
  createTouchHook() {
    const hookDiv = document.createElement("button");
    hookDiv.style.width = `${DIV_HOOK_SIZE}px`, hookDiv.style.height = `${DIV_HOOK_SIZE}px`, hookDiv.style.position = "absolute", hookDiv.style.top = `${DIV_HOOK_POS_X}px`, hookDiv.style.left = `${DIV_HOOK_POS_Y}px`, hookDiv.style.zIndex = DIV_HOOK_ZINDEX.toString(), hookDiv.style.backgroundColor = "#FF0000", hookDiv.title = "select to enable accessibility for this content", hookDiv.addEventListener("focus", () => {
      this._isMobileAccessibility = !0, this.activate(), this.destroyTouchHook();
    }), document.body.appendChild(hookDiv), this._hookDiv = hookDiv;
  }
  /**
   * Destroys the touch hooks.
   * @private
   */
  destroyTouchHook() {
    this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
  }
  /**
   * Activating will cause the Accessibility layer to be shown.
   * This is called when a user presses the tab key.
   * @private
   */
  activate() {
    this._isActive || (this._isActive = !0, globalThis.document.addEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), this.renderer.view.parentNode?.appendChild(this.div));
  }
  /**
   * Deactivating will cause the Accessibility layer to be hidden.
   * This is called when a user moves the mouse.
   * @private
   */
  deactivate() {
    !this._isActive || this._isMobileAccessibility || (this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), this.div.parentNode?.removeChild(this.div));
  }
  /**
   * This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
   * @private
   * @param {PIXI.Container} displayObject - The DisplayObject to check.
   */
  updateAccessibleObjects(displayObject) {
    if (!displayObject.visible || !displayObject.accessibleChildren)
      return;
    displayObject.accessible && displayObject.isInteractive() && (displayObject._accessibleActive || this.addChild(displayObject), displayObject.renderId = this.renderId);
    const children = displayObject.children;
    if (children)
      for (let i = 0; i < children.length; i++)
        this.updateAccessibleObjects(children[i]);
  }
  /**
   * Before each render this function will ensure that all divs are mapped correctly to their DisplayObjects.
   * @private
   */
  update() {
    const now = performance.now();
    if (core.utils.isMobile.android.device && now < this.androidUpdateCount || (this.androidUpdateCount = now + this.androidUpdateFrequency, !this.renderer.renderingToScreen))
      return;
    this.renderer.lastObjectRendered && this.updateAccessibleObjects(this.renderer.lastObjectRendered);
    const { x, y, width, height } = this.renderer.view.getBoundingClientRect(), { width: viewWidth, height: viewHeight, resolution } = this.renderer, sx = width / viewWidth * resolution, sy = height / viewHeight * resolution;
    let div = this.div;
    div.style.left = `${x}px`, div.style.top = `${y}px`, div.style.width = `${viewWidth}px`, div.style.height = `${viewHeight}px`;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.renderId !== this.renderId)
        child._accessibleActive = !1, core.utils.removeItems(this.children, i, 1), this.div.removeChild(child._accessibleDiv), this.pool.push(child._accessibleDiv), child._accessibleDiv = null, i--;
      else {
        div = child._accessibleDiv;
        let hitArea = child.hitArea;
        const wt = child.worldTransform;
        child.hitArea ? (div.style.left = `${(wt.tx + hitArea.x * wt.a) * sx}px`, div.style.top = `${(wt.ty + hitArea.y * wt.d) * sy}px`, div.style.width = `${hitArea.width * wt.a * sx}px`, div.style.height = `${hitArea.height * wt.d * sy}px`) : (hitArea = child.getBounds(), this.capHitArea(hitArea), div.style.left = `${hitArea.x * sx}px`, div.style.top = `${hitArea.y * sy}px`, div.style.width = `${hitArea.width * sx}px`, div.style.height = `${hitArea.height * sy}px`, div.title !== child.accessibleTitle && child.accessibleTitle !== null && (div.title = child.accessibleTitle), div.getAttribute("aria-label") !== child.accessibleHint && child.accessibleHint !== null && div.setAttribute("aria-label", child.accessibleHint)), (child.accessibleTitle !== div.title || child.tabIndex !== div.tabIndex) && (div.title = child.accessibleTitle, div.tabIndex = child.tabIndex, this.debug && this.updateDebugHTML(div));
      }
    }
    this.renderId++;
  }
  /**
   * private function that will visually add the information to the
   * accessability div
   * @param {HTMLElement} div -
   */
  updateDebugHTML(div) {
    div.innerHTML = `type: ${div.type}</br> title : ${div.title}</br> tabIndex: ${div.tabIndex}`;
  }
  /**
   * Adjust the hit area based on the bounds of a display object
   * @param {PIXI.Rectangle} hitArea - Bounds of the child
   */
  capHitArea(hitArea) {
    hitArea.x < 0 && (hitArea.width += hitArea.x, hitArea.x = 0), hitArea.y < 0 && (hitArea.height += hitArea.y, hitArea.y = 0);
    const { width: viewWidth, height: viewHeight } = this.renderer;
    hitArea.x + hitArea.width > viewWidth && (hitArea.width = viewWidth - hitArea.x), hitArea.y + hitArea.height > viewHeight && (hitArea.height = viewHeight - hitArea.y);
  }
  /**
   * Adds a DisplayObject to the accessibility manager
   * @private
   * @param {PIXI.DisplayObject} displayObject - The child to make accessible.
   */
  addChild(displayObject) {
    let div = this.pool.pop();
    div || (div = document.createElement("button"), div.style.width = `${DIV_TOUCH_SIZE}px`, div.style.height = `${DIV_TOUCH_SIZE}px`, div.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", div.style.position = "absolute", div.style.zIndex = DIV_TOUCH_ZINDEX.toString(), div.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? div.setAttribute("aria-live", "off") : div.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? div.setAttribute("aria-relevant", "additions") : div.setAttribute("aria-relevant", "text"), div.addEventListener("click", this._onClick.bind(this)), div.addEventListener("focus", this._onFocus.bind(this)), div.addEventListener("focusout", this._onFocusOut.bind(this))), div.style.pointerEvents = displayObject.accessiblePointerEvents, div.type = displayObject.accessibleType, displayObject.accessibleTitle && displayObject.accessibleTitle !== null ? div.title = displayObject.accessibleTitle : (!displayObject.accessibleHint || displayObject.accessibleHint === null) && (div.title = `displayObject ${displayObject.tabIndex}`), displayObject.accessibleHint && displayObject.accessibleHint !== null && div.setAttribute("aria-label", displayObject.accessibleHint), this.debug && this.updateDebugHTML(div), displayObject._accessibleActive = !0, displayObject._accessibleDiv = div, div.displayObject = displayObject, this.children.push(displayObject), this.div.appendChild(displayObject._accessibleDiv), displayObject._accessibleDiv.tabIndex = displayObject.tabIndex;
  }
  /**
   * Dispatch events with the EventSystem.
   * @param e
   * @param type
   * @private
   */
  _dispatchEvent(e, type) {
    const { displayObject: target } = e.target, boundry = this.renderer.events.rootBoundary, event = Object.assign(new events.FederatedEvent(boundry), { target });
    boundry.rootTarget = this.renderer.lastObjectRendered, type.forEach((type2) => boundry.dispatchEvent(event, type2));
  }
  /**
   * Maps the div button press to pixi's EventSystem (click)
   * @private
   * @param {MouseEvent} e - The click event.
   */
  _onClick(e) {
    this._dispatchEvent(e, ["click", "pointertap", "tap"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseover)
   * @private
   * @param {FocusEvent} e - The focus event.
   */
  _onFocus(e) {
    e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(e, ["mouseover"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseout)
   * @private
   * @param {FocusEvent} e - The focusout event.
   */
  _onFocusOut(e) {
    e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "polite"), this._dispatchEvent(e, ["mouseout"]);
  }
  /**
   * Is called when a key is pressed
   * @private
   * @param {KeyboardEvent} e - The keydown event.
   */
  _onKeyDown(e) {
    e.keyCode === KEY_CODE_TAB && this.activate();
  }
  /**
   * Is called when the mouse moves across the renderer element
   * @private
   * @param {MouseEvent} e - The mouse event.
   */
  _onMouseMove(e) {
    e.movementX === 0 && e.movementY === 0 || this.deactivate();
  }
  /** Destroys the accessibility manager */
  destroy() {
    this.destroyTouchHook(), this.div = null, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null;
  }
}
AccessibilityManager.extension = {
  name: "accessibility",
  type: [
    core.ExtensionType.RendererPlugin,
    core.ExtensionType.CanvasRendererPlugin
  ]
};
core.extensions.add(AccessibilityManager);
exports.AccessibilityManager = AccessibilityManager;
//# sourceMappingURL=AccessibilityManager.js.map
