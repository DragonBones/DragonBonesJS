import { utils } from '@pixi/core';
import type { AllFederatedEventMap } from './FederatedEventMap';
import type { FederatedPointerEvent } from './FederatedPointerEvent';
import type { FederatedWheelEvent } from './FederatedWheelEvent';
export type Cursor = 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ns-resize' | 'ew-resize' | 'nesw-resize' | 'col-resize' | 'nwse-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';
export interface IHitArea {
    contains(x: number, y: number): boolean;
}
/**
 * Function type for handlers, e.g., onclick
 * @memberof PIXI
 */
export type FederatedEventHandler<T = FederatedPointerEvent> = (event: T) => void;
/**
 * The type of interaction a DisplayObject can be. For more information on values and their meaning,
 * see {@link PIXI.DisplayObject.eventMode DisplayObject's eventMode property}.
 * @memberof PIXI
 * @since 7.2.0
 */
export type EventMode = 'none' | 'passive' | 'auto' | 'static' | 'dynamic';
/**
 * Describes the shape for a {@link PIXI.FederatedEvent}'s' `eventTarget`.
 * @memberof PIXI
 */
export interface FederatedEventTarget extends utils.EventEmitter, EventTarget {
    /** The cursor preferred when the mouse pointer is hovering over. */
    cursor: Cursor | string;
    /** The parent of this event target. */
    readonly parent?: FederatedEventTarget;
    /** The children of this event target. */
    readonly children?: ReadonlyArray<FederatedEventTarget>;
    /** Whether this event target should fire UI events. */
    interactive: boolean;
    _internalInteractive: boolean;
    /** The mode of interaction for this object */
    eventMode: EventMode;
    _internalEventMode: EventMode;
    /** Returns true if the DisplayObject has interactive 'static' or 'dynamic' */
    isInteractive: () => boolean;
    /** Whether this event target has any children that need UI events. This can be used optimize event propagation. */
    interactiveChildren: boolean;
    /** The hit-area specifies the area for which pointer events should be captured by this event target. */
    hitArea: IHitArea | null;
    /** Remove all listeners, or those of the specified event. */
    removeAllListeners(event?: string | symbol): this;
    /** Handler for 'click' event */
    onclick: FederatedEventHandler | null;
    /** Handler for 'mousedown' event */
    onmousedown: FederatedEventHandler | null;
    /** Handler for 'mouseenter' event */
    onmouseenter: FederatedEventHandler | null;
    /** Handler for 'mouseleave' event */
    onmouseleave: FederatedEventHandler | null;
    /** Handler for 'mousemove' event */
    onmousemove: FederatedEventHandler | null;
    /** Handler for 'globalmousemove' event */
    onglobalmousemove: FederatedEventHandler | null;
    /** Handler for 'mouseout' event */
    onmouseout: FederatedEventHandler | null;
    /** Handler for 'mouseover' event */
    onmouseover: FederatedEventHandler | null;
    /** Handler for 'mouseup' event */
    onmouseup: FederatedEventHandler | null;
    /** Handler for 'mouseupoutside' event */
    onmouseupoutside: FederatedEventHandler | null;
    /** Handler for 'pointercancel' event */
    onpointercancel: FederatedEventHandler | null;
    /** Handler for 'pointerdown' event */
    onpointerdown: FederatedEventHandler | null;
    /** Handler for 'pointerenter' event */
    onpointerenter: FederatedEventHandler | null;
    /** Handler for 'pointerleave' event */
    onpointerleave: FederatedEventHandler | null;
    /** Handler for 'pointermove' event */
    onpointermove: FederatedEventHandler | null;
    /** Handler for 'globalpointermove' event */
    onglobalpointermove: FederatedEventHandler | null;
    /** Handler for 'pointerout' event */
    onpointerout: FederatedEventHandler | null;
    /** Handler for 'pointerover' event */
    onpointerover: FederatedEventHandler | null;
    /** Handler for 'pointertap' event */
    onpointertap: FederatedEventHandler | null;
    /** Handler for 'pointerup' event */
    onpointerup: FederatedEventHandler | null;
    /** Handler for 'pointerupoutside' event */
    onpointerupoutside: FederatedEventHandler | null;
    /** Handler for 'rightclick' event */
    onrightclick: FederatedEventHandler | null;
    /** Handler for 'rightdown' event */
    onrightdown: FederatedEventHandler | null;
    /** Handler for 'rightup' event */
    onrightup: FederatedEventHandler | null;
    /** Handler for 'rightupoutside' event */
    onrightupoutside: FederatedEventHandler | null;
    /** Handler for 'tap' event */
    ontap: FederatedEventHandler | null;
    /** Handler for 'touchcancel' event */
    ontouchcancel: FederatedEventHandler | null;
    /** Handler for 'touchend' event */
    ontouchend: FederatedEventHandler | null;
    /** Handler for 'touchendoutside' event */
    ontouchendoutside: FederatedEventHandler | null;
    /** Handler for 'touchmove' event */
    ontouchmove: FederatedEventHandler | null;
    /** Handler for 'globaltouchmove' event */
    onglobaltouchmove: FederatedEventHandler | null;
    /** Handler for 'touchstart' event */
    ontouchstart: FederatedEventHandler | null;
    /** Handler for 'wheel' event */
    onwheel: FederatedEventHandler<FederatedWheelEvent> | null;
}
type AddListenerOptions = boolean | AddEventListenerOptions;
type RemoveListenerOptions = boolean | EventListenerOptions;
export interface IFederatedDisplayObject extends Omit<FederatedEventTarget, 'parent' | 'children' | keyof utils.EventEmitter | 'cursor'> {
    addEventListener<K extends keyof AllFederatedEventMap>(type: K, listener: (e: AllFederatedEventMap[K]) => any, options?: AddListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddListenerOptions): void;
    removeEventListener<K extends keyof AllFederatedEventMap>(type: K, listener: (e: AllFederatedEventMap[K]) => any, options?: RemoveListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: RemoveListenerOptions): void;
}
export declare const FederatedDisplayObject: IFederatedDisplayObject;
export {};
