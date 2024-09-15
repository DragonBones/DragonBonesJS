import { Point } from '@pixi/core';
import type { EventBoundary } from './EventBoundary';
import type { FederatedEventTarget } from './FederatedEventTarget';
export interface PixiTouch extends Touch {
    button: number;
    buttons: number;
    isPrimary: boolean;
    width: number;
    height: number;
    tiltX: number;
    tiltY: number;
    pointerType: string;
    pointerId: number;
    pressure: number;
    twist: number;
    tangentialPressure: number;
    layerX: number;
    layerY: number;
    offsetX: number;
    offsetY: number;
    isNormalized: boolean;
    type: string;
}
/**
 * An DOM-compatible synthetic event implementation that is "forwarded" on behalf of an original
 * FederatedEvent or native {@link https://dom.spec.whatwg.org/#event Event}.
 * @memberof PIXI
 * @typeParam N - The type of native event held.
 */
export declare class FederatedEvent<N extends UIEvent | PixiTouch = UIEvent | PixiTouch> implements UIEvent {
    /** Flags whether this event bubbles. This will take effect only if it is set before propagation. */
    bubbles: boolean;
    /** @deprecated since 7.0.0 */
    cancelBubble: boolean;
    /**
     * Flags whether this event can be canceled using {@link PIXI.FederatedEvent.preventDefault}. This is always
     * false (for now).
     */
    readonly cancelable = false;
    /**
     * Flag added for compatibility with DOM {@code Event}. It is not used in the Federated Events
     * API.
     * @see https://dom.spec.whatwg.org/#dom-event-composed
     */
    readonly composed = false;
    /** The listeners of the event target that are being notified. */
    currentTarget: FederatedEventTarget;
    /** Flags whether the default response of the user agent was prevent through this event. */
    defaultPrevented: boolean;
    /**
     * The propagation phase.
     * @default {@link PIXI.FederatedEvent.NONE}
     */
    eventPhase: number;
    /** Flags whether this is a user-trusted event */
    isTrusted: boolean;
    /** @deprecated since 7.0.0 */
    returnValue: boolean;
    /** @deprecated since 7.0.0 */
    srcElement: EventTarget;
    /** The event target that this will be dispatched to. */
    target: FederatedEventTarget;
    /** The timestamp of when the event was created. */
    timeStamp: number;
    /** The type of event, e.g. {@code "mouseup"}. */
    type: string;
    /** The native event that caused the foremost original event. */
    nativeEvent: N;
    /** The original event that caused this event, if any. */
    originalEvent: FederatedEvent<N>;
    /** Flags whether propagation was stopped. */
    propagationStopped: boolean;
    /** Flags whether propagation was immediately stopped. */
    propagationImmediatelyStopped: boolean;
    /** The composed path of the event's propagation. The {@code target} is at the end. */
    path: FederatedEventTarget[];
    /** The {@link PIXI.EventBoundary} that manages this event. Null for root events. */
    readonly manager: EventBoundary;
    /** Event-specific detail */
    detail: number;
    /** The global Window object. */
    view: WindowProxy;
    /**
     * Not supported.
     * @deprecated since 7.0.0
     */
    which: number;
    /** The coordinates of the evnet relative to the nearest DOM layer. This is a non-standard property. */
    layer: Point;
    /** @readonly */
    get layerX(): number;
    /** @readonly */
    get layerY(): number;
    /** The coordinates of the event relative to the DOM document. This is a non-standard property. */
    page: Point;
    /** @readonly */
    get pageX(): number;
    /** @readonly */
    get pageY(): number;
    /**
     * @param manager - The event boundary which manages this event. Propagation can only occur
     *  within the boundary's jurisdiction.
     */
    constructor(manager: EventBoundary);
    /**
     * Fallback for the deprecated @code{PIXI.InteractionEvent.data}.
     * @deprecated since 7.0.0
     */
    get data(): this;
    /** The propagation path for this event. Alias for {@link PIXI.EventBoundary.propagationPath}. */
    composedPath(): FederatedEventTarget[];
    /**
     * Unimplemented method included for implementing the DOM interface {@code Event}. It will throw an {@code Error}.
     * @deprecated
     * @param _type
     * @param _bubbles
     * @param _cancelable
     */
    initEvent(_type: string, _bubbles?: boolean, _cancelable?: boolean): void;
    /**
     * Unimplemented method included for implementing the DOM interface {@code UIEvent}. It will throw an {@code Error}.
     * @deprecated
     * @param _typeArg
     * @param _bubblesArg
     * @param _cancelableArg
     * @param _viewArg
     * @param _detailArg
     */
    initUIEvent(_typeArg: string, _bubblesArg?: boolean, _cancelableArg?: boolean, _viewArg?: Window | null, _detailArg?: number): void;
    /** Prevent default behavior of PixiJS and the user agent. */
    preventDefault(): void;
    /**
     * Stop this event from propagating to any addition listeners, including on the
     * {@link PIXI.FederatedEventTarget.currentTarget currentTarget} and also the following
     * event targets on the propagation path.
     */
    stopImmediatePropagation(): void;
    /**
     * Stop this event from propagating to the next {@link PIXI.FederatedEventTarget}. The rest of the listeners
     * on the {@link PIXI.FederatedEventTarget.currentTarget currentTarget} will still be notified.
     */
    stopPropagation(): void;
    readonly NONE = 0;
    readonly CAPTURING_PHASE = 1;
    readonly AT_TARGET = 2;
    readonly BUBBLING_PHASE = 3;
}
