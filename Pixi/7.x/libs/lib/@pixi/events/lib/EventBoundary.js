"use strict";
var core = require("@pixi/core"), EventTicker = require("./EventTicker.js"), FederatedMouseEvent = require("./FederatedMouseEvent.js"), FederatedPointerEvent = require("./FederatedPointerEvent.js"), FederatedWheelEvent = require("./FederatedWheelEvent.js");
const PROPAGATION_LIMIT = 2048, tempHitLocation = new core.Point(), tempLocalMapping = new core.Point();
class EventBoundary {
  /**
   * @param rootTarget - The holder of the event boundary.
   */
  constructor(rootTarget) {
    this.dispatch = new core.utils.EventEmitter(), this.moveOnAll = !1, this.enableGlobalMoveEvents = !0, this.mappingState = {
      trackingData: {}
    }, this.eventPool = /* @__PURE__ */ new Map(), this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = !1, this.rootTarget = rootTarget, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel);
  }
  /**
   * Adds an event mapping for the event `type` handled by `fn`.
   *
   * Event mappings can be used to implement additional or custom events. They take an event
   * coming from the upstream scene (or directly from the {@link PIXI.EventSystem}) and dispatch new downstream events
   * generally trickling down and bubbling up to {@link PIXI.EventBoundary.rootTarget this.rootTarget}.
   *
   * To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
   * instead.
   * @param type - The type of upstream event to map.
   * @param fn - The mapping method. The context of this function must be bound manually, if desired.
   */
  addEventMapping(type, fn) {
    this.mappingTable[type] || (this.mappingTable[type] = []), this.mappingTable[type].push({
      fn,
      priority: 0
    }), this.mappingTable[type].sort((a, b) => a.priority - b.priority);
  }
  /**
   * Dispatches the given event
   * @param e
   * @param type
   */
  dispatchEvent(e, type) {
    e.propagationStopped = !1, e.propagationImmediatelyStopped = !1, this.propagate(e, type), this.dispatch.emit(type || e.type, e);
  }
  /**
   * Maps the given upstream event through the event boundary and propagates it downstream.
   * @param e
   */
  mapEvent(e) {
    if (!this.rootTarget)
      return;
    const mappers = this.mappingTable[e.type];
    if (mappers)
      for (let i = 0, j = mappers.length; i < j; i++)
        mappers[i].fn(e);
    else
      console.warn(`[EventBoundary]: Event mapping not defined for ${e.type}`);
  }
  /**
   * Finds the DisplayObject that is the target of a event at the given coordinates.
   *
   * The passed (x,y) coordinates are in the world space above this event boundary.
   * @param x
   * @param y
   */
  hitTest(x, y) {
    EventTicker.EventsTicker.pauseUpdate = !0;
    const fn = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", invertedPath = this[fn](
      this.rootTarget,
      this.rootTarget.eventMode,
      tempHitLocation.set(x, y),
      this.hitTestFn,
      this.hitPruneFn
    );
    return invertedPath && invertedPath[0];
  }
  /**
   * Propagate the passed event from from {@link PIXI.EventBoundary.rootTarget this.rootTarget} to its
   * target {@code e.target}.
   * @param e - The event to propagate.
   * @param type
   */
  propagate(e, type) {
    if (!e.target)
      return;
    const composedPath = e.composedPath();
    e.eventPhase = e.CAPTURING_PHASE;
    for (let i = 0, j = composedPath.length - 1; i < j; i++)
      if (e.currentTarget = composedPath[i], this.notifyTarget(e, type), e.propagationStopped || e.propagationImmediatelyStopped)
        return;
    if (e.eventPhase = e.AT_TARGET, e.currentTarget = e.target, this.notifyTarget(e, type), !(e.propagationStopped || e.propagationImmediatelyStopped)) {
      e.eventPhase = e.BUBBLING_PHASE;
      for (let i = composedPath.length - 2; i >= 0; i--)
        if (e.currentTarget = composedPath[i], this.notifyTarget(e, type), e.propagationStopped || e.propagationImmediatelyStopped)
          return;
    }
  }
  /**
   * Emits the event {@code e} to all interactive display objects. The event is propagated in the bubbling phase always.
   *
   * This is used in the `globalpointermove` event.
   * @param e - The emitted event.
   * @param type - The listeners to notify.
   * @param targets - The targets to notify.
   */
  all(e, type, targets = this._allInteractiveElements) {
    if (targets.length === 0)
      return;
    e.eventPhase = e.BUBBLING_PHASE;
    const events = Array.isArray(type) ? type : [type];
    for (let i = targets.length - 1; i >= 0; i--)
      events.forEach((event) => {
        e.currentTarget = targets[i], this.notifyTarget(e, event);
      });
  }
  /**
   * Finds the propagation path from {@link PIXI.EventBoundary.rootTarget rootTarget} to the passed
   * {@code target}. The last element in the path is {@code target}.
   * @param target
   */
  propagationPath(target) {
    const propagationPath = [target];
    for (let i = 0; i < PROPAGATION_LIMIT && target !== this.rootTarget; i++) {
      if (!target.parent)
        throw new Error("Cannot find propagation path to disconnected target");
      propagationPath.push(target.parent), target = target.parent;
    }
    return propagationPath.reverse(), propagationPath;
  }
  hitTestMoveRecursive(currentTarget, eventMode, location, testFn, pruneFn, ignore = !1) {
    let shouldReturn = !1;
    if (this._interactivePrune(currentTarget))
      return null;
    if ((currentTarget.eventMode === "dynamic" || eventMode === "dynamic") && (EventTicker.EventsTicker.pauseUpdate = !1), currentTarget.interactiveChildren && currentTarget.children) {
      const children = currentTarget.children;
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i], nestedHit = this.hitTestMoveRecursive(
          child,
          this._isInteractive(eventMode) ? eventMode : child.eventMode,
          location,
          testFn,
          pruneFn,
          ignore || pruneFn(currentTarget, location)
        );
        if (nestedHit) {
          if (nestedHit.length > 0 && !nestedHit[nestedHit.length - 1].parent)
            continue;
          const isInteractive = currentTarget.isInteractive();
          (nestedHit.length > 0 || isInteractive) && (isInteractive && this._allInteractiveElements.push(currentTarget), nestedHit.push(currentTarget)), this._hitElements.length === 0 && (this._hitElements = nestedHit), shouldReturn = !0;
        }
      }
    }
    const isInteractiveMode = this._isInteractive(eventMode), isInteractiveTarget = currentTarget.isInteractive();
    return isInteractiveMode && isInteractiveTarget && this._allInteractiveElements.push(currentTarget), ignore || this._hitElements.length > 0 ? null : shouldReturn ? this._hitElements : isInteractiveMode && !pruneFn(currentTarget, location) && testFn(currentTarget, location) ? isInteractiveTarget ? [currentTarget] : [] : null;
  }
  /**
   * Recursive implementation for {@link PIXI.EventBoundary.hitTest hitTest}.
   * @param currentTarget - The DisplayObject that is to be hit tested.
   * @param eventMode - The event mode for the `currentTarget` or one of its parents.
   * @param location - The location that is being tested for overlap.
   * @param testFn - Callback that determines whether the target passes hit testing. This callback
   *  can assume that `pruneFn` failed to prune the display object.
   * @param pruneFn - Callback that determiness whether the target and all of its children
   *  cannot pass the hit test. It is used as a preliminary optimization to prune entire subtrees
   *  of the scene graph.
   * @returns An array holding the hit testing target and all its ancestors in order. The first element
   *  is the target itself and the last is {@link PIXI.EventBoundary.rootTarget rootTarget}. This is the opposite
   *  order w.r.t. the propagation path. If no hit testing target is found, null is returned.
   */
  hitTestRecursive(currentTarget, eventMode, location, testFn, pruneFn) {
    if (this._interactivePrune(currentTarget) || pruneFn(currentTarget, location))
      return null;
    if ((currentTarget.eventMode === "dynamic" || eventMode === "dynamic") && (EventTicker.EventsTicker.pauseUpdate = !1), currentTarget.interactiveChildren && currentTarget.children) {
      const children = currentTarget.children;
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i], nestedHit = this.hitTestRecursive(
          child,
          this._isInteractive(eventMode) ? eventMode : child.eventMode,
          location,
          testFn,
          pruneFn
        );
        if (nestedHit) {
          if (nestedHit.length > 0 && !nestedHit[nestedHit.length - 1].parent)
            continue;
          const isInteractive = currentTarget.isInteractive();
          return (nestedHit.length > 0 || isInteractive) && nestedHit.push(currentTarget), nestedHit;
        }
      }
    }
    const isInteractiveMode = this._isInteractive(eventMode), isInteractiveTarget = currentTarget.isInteractive();
    return isInteractiveMode && testFn(currentTarget, location) ? isInteractiveTarget ? [currentTarget] : [] : null;
  }
  _isInteractive(int) {
    return int === "static" || int === "dynamic";
  }
  _interactivePrune(displayObject) {
    return !!(!displayObject || displayObject.isMask || !displayObject.visible || !displayObject.renderable || displayObject.eventMode === "none" || displayObject.eventMode === "passive" && !displayObject.interactiveChildren || displayObject.isMask);
  }
  /**
   * Checks whether the display object or any of its children cannot pass the hit test at all.
   *
   * {@link PIXI.EventBoundary}'s implementation uses the {@link PIXI.DisplayObject.hitArea hitArea}
   * and {@link PIXI.DisplayObject._mask} for pruning.
   * @param displayObject
   * @param location
   */
  hitPruneFn(displayObject, location) {
    if (displayObject.hitArea && (displayObject.worldTransform.applyInverse(location, tempLocalMapping), !displayObject.hitArea.contains(tempLocalMapping.x, tempLocalMapping.y)))
      return !0;
    if (displayObject._mask) {
      const maskObject = displayObject._mask.isMaskData ? displayObject._mask.maskObject : displayObject._mask;
      if (maskObject && !maskObject.containsPoint?.(location))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the display object passes hit testing for the given location.
   * @param displayObject
   * @param location
   * @returns - Whether `displayObject` passes hit testing for `location`.
   */
  hitTestFn(displayObject, location) {
    return displayObject.eventMode === "passive" ? !1 : displayObject.hitArea ? !0 : displayObject.containsPoint ? displayObject.containsPoint(location) : !1;
  }
  /**
   * Notify all the listeners to the event's `currentTarget`.
   *
   * If the `currentTarget` contains the property `on<type>`, then it is called here,
   * simulating the behavior from version 6.x and prior.
   * @param e - The event passed to the target.
   * @param type
   */
  notifyTarget(e, type) {
    type = type ?? e.type;
    const handlerKey = `on${type}`;
    e.currentTarget[handlerKey]?.(e);
    const key = e.eventPhase === e.CAPTURING_PHASE || e.eventPhase === e.AT_TARGET ? `${type}capture` : type;
    this.notifyListeners(e, key), e.eventPhase === e.AT_TARGET && this.notifyListeners(e, type);
  }
  /**
   * Maps the upstream `pointerdown` events to a downstream `pointerdown` event.
   *
   * `touchstart`, `rightdown`, `mousedown` events are also dispatched for specific pointer types.
   * @param from
   */
  mapPointerDown(from) {
    if (!(from instanceof FederatedPointerEvent.FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.createPointerEvent(from);
    if (this.dispatchEvent(e, "pointerdown"), e.pointerType === "touch")
      this.dispatchEvent(e, "touchstart");
    else if (e.pointerType === "mouse" || e.pointerType === "pen") {
      const isRightButton = e.button === 2;
      this.dispatchEvent(e, isRightButton ? "rightdown" : "mousedown");
    }
    const trackingData = this.trackingData(from.pointerId);
    trackingData.pressTargetsByButton[from.button] = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointermove` to downstream `pointerout`, `pointerover`, and `pointermove` events, in that order.
   *
   * The tracking data for the specific pointer has an updated `overTarget`. `mouseout`, `mouseover`,
   * `mousemove`, and `touchmove` events are fired as well for specific pointer types.
   * @param from - The upstream `pointermove` event.
   */
  mapPointerMove(from) {
    if (!(from instanceof FederatedPointerEvent.FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
    const e = this.createPointerEvent(from);
    this._isPointerMoveEvent = !1;
    const isMouse = e.pointerType === "mouse" || e.pointerType === "pen", trackingData = this.trackingData(from.pointerId), outTarget = this.findMountedTarget(trackingData.overTargets);
    if (trackingData.overTargets?.length > 0 && outTarget !== e.target) {
      const outType = from.type === "mousemove" ? "mouseout" : "pointerout", outEvent = this.createPointerEvent(from, outType, outTarget);
      if (this.dispatchEvent(outEvent, "pointerout"), isMouse && this.dispatchEvent(outEvent, "mouseout"), !e.composedPath().includes(outTarget)) {
        const leaveEvent = this.createPointerEvent(from, "pointerleave", outTarget);
        for (leaveEvent.eventPhase = leaveEvent.AT_TARGET; leaveEvent.target && !e.composedPath().includes(leaveEvent.target); )
          leaveEvent.currentTarget = leaveEvent.target, this.notifyTarget(leaveEvent), isMouse && this.notifyTarget(leaveEvent, "mouseleave"), leaveEvent.target = leaveEvent.target.parent;
        this.freeEvent(leaveEvent);
      }
      this.freeEvent(outEvent);
    }
    if (outTarget !== e.target) {
      const overType = from.type === "mousemove" ? "mouseover" : "pointerover", overEvent = this.clonePointerEvent(e, overType);
      this.dispatchEvent(overEvent, "pointerover"), isMouse && this.dispatchEvent(overEvent, "mouseover");
      let overTargetAncestor = outTarget?.parent;
      for (; overTargetAncestor && overTargetAncestor !== this.rootTarget.parent && overTargetAncestor !== e.target; )
        overTargetAncestor = overTargetAncestor.parent;
      if (!overTargetAncestor || overTargetAncestor === this.rootTarget.parent) {
        const enterEvent = this.clonePointerEvent(e, "pointerenter");
        for (enterEvent.eventPhase = enterEvent.AT_TARGET; enterEvent.target && enterEvent.target !== outTarget && enterEvent.target !== this.rootTarget.parent; )
          enterEvent.currentTarget = enterEvent.target, this.notifyTarget(enterEvent), isMouse && this.notifyTarget(enterEvent, "mouseenter"), enterEvent.target = enterEvent.target.parent;
        this.freeEvent(enterEvent);
      }
      this.freeEvent(overEvent);
    }
    const allMethods = [], allowGlobalPointerEvents = this.enableGlobalMoveEvents ?? !0;
    this.moveOnAll ? allMethods.push("pointermove") : this.dispatchEvent(e, "pointermove"), allowGlobalPointerEvents && allMethods.push("globalpointermove"), e.pointerType === "touch" && (this.moveOnAll ? allMethods.splice(1, 0, "touchmove") : this.dispatchEvent(e, "touchmove"), allowGlobalPointerEvents && allMethods.push("globaltouchmove")), isMouse && (this.moveOnAll ? allMethods.splice(1, 0, "mousemove") : this.dispatchEvent(e, "mousemove"), allowGlobalPointerEvents && allMethods.push("globalmousemove"), this.cursor = e.target?.cursor), allMethods.length > 0 && this.all(e, allMethods), this._allInteractiveElements.length = 0, this._hitElements.length = 0, trackingData.overTargets = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointerover` to downstream `pointerover` and `pointerenter` events, in that order.
   *
   * The tracking data for the specific pointer gets a new `overTarget`.
   * @param from - The upstream `pointerover` event.
   */
  mapPointerOver(from) {
    if (!(from instanceof FederatedPointerEvent.FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const trackingData = this.trackingData(from.pointerId), e = this.createPointerEvent(from), isMouse = e.pointerType === "mouse" || e.pointerType === "pen";
    this.dispatchEvent(e, "pointerover"), isMouse && this.dispatchEvent(e, "mouseover"), e.pointerType === "mouse" && (this.cursor = e.target?.cursor);
    const enterEvent = this.clonePointerEvent(e, "pointerenter");
    for (enterEvent.eventPhase = enterEvent.AT_TARGET; enterEvent.target && enterEvent.target !== this.rootTarget.parent; )
      enterEvent.currentTarget = enterEvent.target, this.notifyTarget(enterEvent), isMouse && this.notifyTarget(enterEvent, "mouseenter"), enterEvent.target = enterEvent.target.parent;
    trackingData.overTargets = e.composedPath(), this.freeEvent(e), this.freeEvent(enterEvent);
  }
  /**
   * Maps the upstream `pointerout` to downstream `pointerout`, `pointerleave` events, in that order.
   *
   * The tracking data for the specific pointer is cleared of a `overTarget`.
   * @param from - The upstream `pointerout` event.
   */
  mapPointerOut(from) {
    if (!(from instanceof FederatedPointerEvent.FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const trackingData = this.trackingData(from.pointerId);
    if (trackingData.overTargets) {
      const isMouse = from.pointerType === "mouse" || from.pointerType === "pen", outTarget = this.findMountedTarget(trackingData.overTargets), outEvent = this.createPointerEvent(from, "pointerout", outTarget);
      this.dispatchEvent(outEvent), isMouse && this.dispatchEvent(outEvent, "mouseout");
      const leaveEvent = this.createPointerEvent(from, "pointerleave", outTarget);
      for (leaveEvent.eventPhase = leaveEvent.AT_TARGET; leaveEvent.target && leaveEvent.target !== this.rootTarget.parent; )
        leaveEvent.currentTarget = leaveEvent.target, this.notifyTarget(leaveEvent), isMouse && this.notifyTarget(leaveEvent, "mouseleave"), leaveEvent.target = leaveEvent.target.parent;
      trackingData.overTargets = null, this.freeEvent(outEvent), this.freeEvent(leaveEvent);
    }
    this.cursor = null;
  }
  /**
   * Maps the upstream `pointerup` event to downstream `pointerup`, `pointerupoutside`,
   * and `click`/`rightclick`/`pointertap` events, in that order.
   *
   * The `pointerupoutside` event bubbles from the original `pointerdown` target to the most specific
   * ancestor of the `pointerdown` and `pointerup` targets, which is also the `click` event's target. `touchend`,
   * `rightup`, `mouseup`, `touchendoutside`, `rightupoutside`, `mouseupoutside`, and `tap` are fired as well for
   * specific pointer types.
   * @param from - The upstream `pointerup` event.
   */
  mapPointerUp(from) {
    if (!(from instanceof FederatedPointerEvent.FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const now = performance.now(), e = this.createPointerEvent(from);
    if (this.dispatchEvent(e, "pointerup"), e.pointerType === "touch")
      this.dispatchEvent(e, "touchend");
    else if (e.pointerType === "mouse" || e.pointerType === "pen") {
      const isRightButton = e.button === 2;
      this.dispatchEvent(e, isRightButton ? "rightup" : "mouseup");
    }
    const trackingData = this.trackingData(from.pointerId), pressTarget = this.findMountedTarget(trackingData.pressTargetsByButton[from.button]);
    let clickTarget = pressTarget;
    if (pressTarget && !e.composedPath().includes(pressTarget)) {
      let currentTarget = pressTarget;
      for (; currentTarget && !e.composedPath().includes(currentTarget); ) {
        if (e.currentTarget = currentTarget, this.notifyTarget(e, "pointerupoutside"), e.pointerType === "touch")
          this.notifyTarget(e, "touchendoutside");
        else if (e.pointerType === "mouse" || e.pointerType === "pen") {
          const isRightButton = e.button === 2;
          this.notifyTarget(e, isRightButton ? "rightupoutside" : "mouseupoutside");
        }
        currentTarget = currentTarget.parent;
      }
      delete trackingData.pressTargetsByButton[from.button], clickTarget = currentTarget;
    }
    if (clickTarget) {
      const clickEvent = this.clonePointerEvent(e, "click");
      clickEvent.target = clickTarget, clickEvent.path = null, trackingData.clicksByButton[from.button] || (trackingData.clicksByButton[from.button] = {
        clickCount: 0,
        target: clickEvent.target,
        timeStamp: now
      });
      const clickHistory = trackingData.clicksByButton[from.button];
      if (clickHistory.target === clickEvent.target && now - clickHistory.timeStamp < 200 ? ++clickHistory.clickCount : clickHistory.clickCount = 1, clickHistory.target = clickEvent.target, clickHistory.timeStamp = now, clickEvent.detail = clickHistory.clickCount, clickEvent.pointerType === "mouse") {
        const isRightButton = clickEvent.button === 2;
        this.dispatchEvent(clickEvent, isRightButton ? "rightclick" : "click");
      } else
        clickEvent.pointerType === "touch" && this.dispatchEvent(clickEvent, "tap");
      this.dispatchEvent(clickEvent, "pointertap"), this.freeEvent(clickEvent);
    }
    this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointerupoutside` event to a downstream `pointerupoutside` event, bubbling from the original
   * `pointerdown` target to `rootTarget`.
   *
   * (The most specific ancestor of the `pointerdown` event and the `pointerup` event must the
   * `{@link PIXI.EventBoundary}'s root because the `pointerup` event occurred outside of the boundary.)
   *
   * `touchendoutside`, `mouseupoutside`, and `rightupoutside` events are fired as well for specific pointer
   * types. The tracking data for the specific pointer is cleared of a `pressTarget`.
   * @param from - The upstream `pointerupoutside` event.
   */
  mapPointerUpOutside(from) {
    if (!(from instanceof FederatedPointerEvent.FederatedPointerEvent)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const trackingData = this.trackingData(from.pointerId), pressTarget = this.findMountedTarget(trackingData.pressTargetsByButton[from.button]), e = this.createPointerEvent(from);
    if (pressTarget) {
      let currentTarget = pressTarget;
      for (; currentTarget; )
        e.currentTarget = currentTarget, this.notifyTarget(e, "pointerupoutside"), e.pointerType === "touch" ? this.notifyTarget(e, "touchendoutside") : (e.pointerType === "mouse" || e.pointerType === "pen") && this.notifyTarget(e, e.button === 2 ? "rightupoutside" : "mouseupoutside"), currentTarget = currentTarget.parent;
      delete trackingData.pressTargetsByButton[from.button];
    }
    this.freeEvent(e);
  }
  /**
   * Maps the upstream `wheel` event to a downstream `wheel` event.
   * @param from - The upstream `wheel` event.
   */
  mapWheel(from) {
    if (!(from instanceof FederatedWheelEvent.FederatedWheelEvent)) {
      console.warn("EventBoundary cannot map a non-wheel event as a wheel event");
      return;
    }
    const wheelEvent = this.createWheelEvent(from);
    this.dispatchEvent(wheelEvent), this.freeEvent(wheelEvent);
  }
  /**
   * Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
   *
   * This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
   * or `pointerover` target was unmounted from the scene graph.
   * @param propagationPath - The propagation path was valid in the past.
   * @returns - The most specific event-target still mounted at the same location in the scene graph.
   */
  findMountedTarget(propagationPath) {
    if (!propagationPath)
      return null;
    let currentTarget = propagationPath[0];
    for (let i = 1; i < propagationPath.length && propagationPath[i].parent === currentTarget; i++)
      currentTarget = propagationPath[i];
    return currentTarget;
  }
  /**
   * Creates an event whose {@code originalEvent} is {@code from}, with an optional `type` and `target` override.
   *
   * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The {@code originalEvent} for the returned event.
   * @param [type=from.type] - The type of the returned event.
   * @param target - The target of the returned event.
   */
  createPointerEvent(from, type, target) {
    const event = this.allocateEvent(FederatedPointerEvent.FederatedPointerEvent);
    return this.copyPointerData(from, event), this.copyMouseData(from, event), this.copyData(from, event), event.nativeEvent = from.nativeEvent, event.originalEvent = from, event.target = target ?? this.hitTest(event.global.x, event.global.y) ?? this._hitElements[0], typeof type == "string" && (event.type = type), event;
  }
  /**
   * Creates a wheel event whose {@code originalEvent} is {@code from}.
   *
   * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The upstream wheel event.
   */
  createWheelEvent(from) {
    const event = this.allocateEvent(FederatedWheelEvent.FederatedWheelEvent);
    return this.copyWheelData(from, event), this.copyMouseData(from, event), this.copyData(from, event), event.nativeEvent = from.nativeEvent, event.originalEvent = from, event.target = this.hitTest(event.global.x, event.global.y), event;
  }
  /**
   * Clones the event {@code from}, with an optional {@code type} override.
   *
   * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The event to clone.
   * @param [type=from.type] - The type of the returned event.
   */
  clonePointerEvent(from, type) {
    const event = this.allocateEvent(FederatedPointerEvent.FederatedPointerEvent);
    return event.nativeEvent = from.nativeEvent, event.originalEvent = from.originalEvent, this.copyPointerData(from, event), this.copyMouseData(from, event), this.copyData(from, event), event.target = from.target, event.path = from.composedPath().slice(), event.type = type ?? event.type, event;
  }
  /**
   * Copies wheel {@link PIXI.FederatedWheelEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + deltaMode
   * + deltaX
   * + deltaY
   * + deltaZ
   * @param from
   * @param to
   */
  copyWheelData(from, to) {
    to.deltaMode = from.deltaMode, to.deltaX = from.deltaX, to.deltaY = from.deltaY, to.deltaZ = from.deltaZ;
  }
  /**
   * Copies pointer {@link PIXI.FederatedPointerEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + pointerId
   * + width
   * + height
   * + isPrimary
   * + pointerType
   * + pressure
   * + tangentialPressure
   * + tiltX
   * + tiltY
   * @param from
   * @param to
   */
  copyPointerData(from, to) {
    from instanceof FederatedPointerEvent.FederatedPointerEvent && to instanceof FederatedPointerEvent.FederatedPointerEvent && (to.pointerId = from.pointerId, to.width = from.width, to.height = from.height, to.isPrimary = from.isPrimary, to.pointerType = from.pointerType, to.pressure = from.pressure, to.tangentialPressure = from.tangentialPressure, to.tiltX = from.tiltX, to.tiltY = from.tiltY, to.twist = from.twist);
  }
  /**
   * Copies mouse {@link PIXI.FederatedMouseEvent} data from {@code from} to {@code to}.
   *
   * The following properties are copied:
   * + altKey
   * + button
   * + buttons
   * + clientX
   * + clientY
   * + metaKey
   * + movementX
   * + movementY
   * + pageX
   * + pageY
   * + x
   * + y
   * + screen
   * + shiftKey
   * + global
   * @param from
   * @param to
   */
  copyMouseData(from, to) {
    from instanceof FederatedMouseEvent.FederatedMouseEvent && to instanceof FederatedMouseEvent.FederatedMouseEvent && (to.altKey = from.altKey, to.button = from.button, to.buttons = from.buttons, to.client.copyFrom(from.client), to.ctrlKey = from.ctrlKey, to.metaKey = from.metaKey, to.movement.copyFrom(from.movement), to.screen.copyFrom(from.screen), to.shiftKey = from.shiftKey, to.global.copyFrom(from.global));
  }
  /**
   * Copies base {@link PIXI.FederatedEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + isTrusted
   * + srcElement
   * + timeStamp
   * + type
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyData(from, to) {
    to.isTrusted = from.isTrusted, to.srcElement = from.srcElement, to.timeStamp = performance.now(), to.type = from.type, to.detail = from.detail, to.view = from.view, to.which = from.which, to.layer.copyFrom(from.layer), to.page.copyFrom(from.page);
  }
  /**
   * @param id - The pointer ID.
   * @returns The tracking data stored for the given pointer. If no data exists, a blank
   *  state will be created.
   */
  trackingData(id) {
    return this.mappingState.trackingData[id] || (this.mappingState.trackingData[id] = {
      pressTargetsByButton: {},
      clicksByButton: {},
      overTarget: null
    }), this.mappingState.trackingData[id];
  }
  /**
   * Allocate a specific type of event from {@link PIXI.EventBoundary#eventPool this.eventPool}.
   *
   * This allocation is constructor-agnostic, as long as it only takes one argument - this event
   * boundary.
   * @param constructor - The event's constructor.
   */
  allocateEvent(constructor) {
    this.eventPool.has(constructor) || this.eventPool.set(constructor, []);
    const event = this.eventPool.get(constructor).pop() || new constructor(this);
    return event.eventPhase = event.NONE, event.currentTarget = null, event.path = null, event.target = null, event;
  }
  /**
   * Frees the event and puts it back into the event pool.
   *
   * It is illegal to reuse the event until it is allocated again, using `this.allocateEvent`.
   *
   * It is also advised that events not allocated from {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}
   * not be freed. This is because of the possibility that the same event is freed twice, which can cause
   * it to be allocated twice & result in overwriting.
   * @param event - The event to be freed.
   * @throws Error if the event is managed by another event boundary.
   */
  freeEvent(event) {
    if (event.manager !== this)
      throw new Error("It is illegal to free an event not managed by this EventBoundary!");
    const constructor = event.constructor;
    this.eventPool.has(constructor) || this.eventPool.set(constructor, []), this.eventPool.get(constructor).push(event);
  }
  /**
   * Similar to {@link PIXI.EventEmitter.emit}, except it stops if the `propagationImmediatelyStopped` flag
   * is set on the event.
   * @param e - The event to call each listener with.
   * @param type - The event key.
   */
  notifyListeners(e, type) {
    const listeners = e.currentTarget._events[type];
    if (listeners && e.currentTarget.isInteractive())
      if ("fn" in listeners)
        listeners.once && e.currentTarget.removeListener(type, listeners.fn, void 0, !0), listeners.fn.call(listeners.context, e);
      else
        for (let i = 0, j = listeners.length; i < j && !e.propagationImmediatelyStopped; i++)
          listeners[i].once && e.currentTarget.removeListener(type, listeners[i].fn, void 0, !0), listeners[i].fn.call(listeners[i].context, e);
  }
}
exports.EventBoundary = EventBoundary;
//# sourceMappingURL=EventBoundary.js.map
