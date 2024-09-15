import { EventBoundary } from './EventBoundary';
import { FederatedPointerEvent } from './FederatedPointerEvent';
import { FederatedWheelEvent } from './FederatedWheelEvent';
import type { ExtensionMetadata, IPointData, IRenderer, ISystem } from '@pixi/core';
import type { EventMode } from './FederatedEventTarget';
/** @ignore */
export interface EventSystemOptions {
    /**
     * The default event mode mode for all display objects.
     * This option only is available when using **@pixi/events** package
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @memberof PIXI.IRendererOptions
     */
    eventMode?: EventMode;
    /**
     * The event features that are enabled by the EventSystem
     * This option only is available when using **@pixi/events** package
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @memberof PIXI.IRendererOptions
     * @example
     * const app = new PIXI.Application({
     *   view: canvas,
     *   events: {
     *     move: true,
     *     globalMove: false,
     *     click: true,
     *     wheel: true,
     *   },
     * });
     */
    eventFeatures?: Partial<EventSystemFeatures>;
}
/**
 * The event features that are enabled by the EventSystem
 * This option only is available when using **@pixi/events** package
 * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
 * @memberof PIXI
 * @since 7.2.0
 */
interface EventSystemFeatures {
    /**
     * Enables pointer events associated with pointer movement:
     * - `pointermove` / `mousemove` / `touchmove`
     * - `pointerout` / `mouseout`
     * - `pointerover` / `mouseover`
     */
    move: boolean;
    /**
     * Enables global pointer move events:
     * - `globalpointermove`
     * - `globalmousemove`
     * - `globaltouchemove`
     */
    globalMove: boolean;
    /**
     * Enables pointer events associated with clicking:
     * - `pointerup` / `mouseup` / `touchend` / 'rightup'
     * - `pointerupoutside` / `mouseupoutside` / `touchendoutside` / 'rightupoutside'
     * - `pointerdown` / 'mousedown' / `touchstart` / 'rightdown'
     * - `click` / `tap`
     */
    click: boolean;
    /** - Enables wheel events. */
    wheel: boolean;
}
/**
 * The system for handling UI events.
 * @memberof PIXI
 */
export declare class EventSystem implements ISystem<EventSystemOptions> {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * The event features that are enabled by the EventSystem
     * This option only is available when using **@pixi/events** package
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @since 7.2.0
     */
    static defaultEventFeatures: EventSystemFeatures;
    private static _defaultEventMode;
    /**
     * The default interaction mode for all display objects.
     * @see PIXI.DisplayObject.eventMode
     * @type {PIXI.EventMode}
     * @readonly
     * @since 7.2.0
     */
    static get defaultEventMode(): EventMode;
    /**
     * The {@link PIXI.EventBoundary} for the stage.
     *
     * The {@link PIXI.EventBoundary#rootTarget rootTarget} of this root boundary is automatically set to
     * the last rendered object before any event processing is initiated. This means the main scene
     * needs to be rendered atleast once before UI events will start propagating.
     *
     * The root boundary should only be changed during initialization. Otherwise, any state held by the
     * event boundary may be lost (like hovered & pressed DisplayObjects).
     */
    readonly rootBoundary: EventBoundary;
    /** Does the device support touch events https://www.w3.org/TR/touch-events/ */
    readonly supportsTouchEvents: boolean;
    /** Does the device support pointer events https://www.w3.org/Submission/pointer-events/ */
    readonly supportsPointerEvents: boolean;
    /**
     * Should default browser actions automatically be prevented.
     * Does not apply to pointer events for backwards compatibility
     * preventDefault on pointer events stops mouse events from firing
     * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
     * @default true
     */
    autoPreventDefault: boolean;
    /**
     * Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
     * values, objects are handled as dictionaries of CSS values for {@code domElement},
     * and functions are called instead of changing the CSS.
     * Default CSS cursor values are provided for 'default' and 'pointer' modes.
     */
    cursorStyles: Record<string, string | ((mode: string) => void) | CSSStyleDeclaration>;
    /**
     * The DOM element to which the root event listeners are bound. This is automatically set to
     * the renderer's {@link PIXI.Renderer#view view}.
     */
    domElement: HTMLElement;
    /** The resolution used to convert between the DOM client space into world space. */
    resolution: number;
    /** The renderer managing this {@link PIXI.EventSystem}. */
    renderer: IRenderer;
    /**
     * The event features that are enabled by the EventSystem
     * This option only is available when using **@pixi/events** package
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @since 7.2.0
     * @example
     * const app = new PIXI.Application()
     * app.renderer.events.features.globalMove = false
     *
     * // to override all features use Object.assign
     * Object.assign(app.renderer.events.features, {
     *  move: false,
     *  globalMove: false,
     *  click: false,
     *  wheel: false,
     * })
     */
    readonly features: EventSystemFeatures;
    private currentCursor;
    private rootPointerEvent;
    private rootWheelEvent;
    private eventsAdded;
    /**
     * @param {PIXI.Renderer} renderer
     */
    constructor(renderer: IRenderer);
    /**
     * Runner init called, view is available at this point.
     * @ignore
     */
    init(options: EventSystemOptions): void;
    /**
     * Handle changing resolution.
     * @ignore
     */
    resolutionChange(resolution: number): void;
    /** Destroys all event listeners and detaches the renderer. */
    destroy(): void;
    /**
     * Sets the current cursor mode, handling any callbacks or CSS style changes.
     * @param mode - cursor mode, a key from the cursorStyles dictionary
     */
    setCursor(mode: string): void;
    /**
     * The global pointer event.
     * Useful for getting the pointer position without listening to events.
     * @since 7.2.0
     */
    get pointer(): Readonly<FederatedPointerEvent>;
    /**
     * Event handler for pointer down events on {@link PIXI.EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch event.
     */
    private onPointerDown;
    /**
     * Event handler for pointer move events on on {@link PIXI.EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch events.
     */
    private onPointerMove;
    /**
     * Event handler for pointer up events on {@link PIXI.EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch event.
     */
    private onPointerUp;
    /**
     * Event handler for pointer over & out events on {@link PIXI.EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch event.
     */
    private onPointerOverOut;
    /**
     * Passive handler for `wheel` events on {@link PIXI.EventSystem.domElement this.domElement}.
     * @param nativeEvent - The native wheel event.
     */
    protected onWheel(nativeEvent: WheelEvent): void;
    /**
     * Sets the {@link PIXI.EventSystem#domElement domElement} and binds event listeners.
     *
     * To deregister the current DOM element without setting a new one, pass {@code null}.
     * @param element - The new DOM element.
     */
    setTargetElement(element: HTMLElement): void;
    /** Register event listeners on {@link PIXI.Renderer#domElement this.domElement}. */
    private addEvents;
    /** Unregister event listeners on {@link PIXI.EventSystem#domElement this.domElement}. */
    private removeEvents;
    /**
     * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
     * resulting value is stored in the point. This takes into account the fact that the DOM
     * element could be scaled and positioned anywhere on the screen.
     * @param  {PIXI.IPointData} point - the point that the result will be stored in
     * @param  {number} x - the x coord of the position to map
     * @param  {number} y - the y coord of the position to map
     */
    mapPositionToPoint(point: IPointData, x: number, y: number): void;
    /**
     * Ensures that the original event object contains all data that a regular pointer event would have
     * @param event - The original event data from a touch or mouse event
     * @returns An array containing a single normalized pointer event, in the case of a pointer
     *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
     */
    private normalizeToPointerData;
    /**
     * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
     *
     * The returned {@link PIXI.FederatedWheelEvent} is a shared instance. It will not persist across
     * multiple native wheel events.
     * @param nativeEvent - The native wheel event that occurred on the canvas.
     * @returns A federated wheel event.
     */
    protected normalizeWheelEvent(nativeEvent: WheelEvent): FederatedWheelEvent;
    /**
     * Normalizes the `nativeEvent` into a federateed {@link PIXI.FederatedPointerEvent}.
     * @param event
     * @param nativeEvent
     */
    private bootstrapEvent;
    /**
     * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
     * @param event
     * @param nativeEvent
     */
    private transferMouseData;
}
export {};
