import type { EventSystem } from './EventSystem';
/**
 * This class handles automatic firing of PointerEvents
 * in the case where the pointer is stationary for too long.
 * This is to ensure that hit-tests are still run on moving objects.
 * @memberof PIXI
 * @since 7.2.0
 * @see PIXI.EventsTicker
 */
declare class EventsTickerClass {
    /** The event system. */
    events: EventSystem;
    /** The DOM element to listen to events on. */
    domElement: HTMLElement;
    /** The frequency that fake events will be fired. */
    interactionFrequency: number;
    private _deltaTime;
    private _didMove;
    private tickerAdded;
    private _pauseUpdate;
    /**
     * Initializes the event ticker.
     * @param events - The event system.
     */
    init(events: EventSystem): void;
    /** Whether to pause the update checks or not. */
    get pauseUpdate(): boolean;
    set pauseUpdate(paused: boolean);
    /** Adds the ticker listener. */
    addTickerListener(): void;
    /** Removes the ticker listener. */
    removeTickerListener(): void;
    /** Sets flag to not fire extra events when the user has already moved there mouse */
    pointerMoved(): void;
    /** Updates the state of interactive objects. */
    private update;
    /**
     * Updates the state of interactive objects if at least {@link PIXI.EventsTicker#interactionFrequency}
     * milliseconds have passed since the last invocation.
     *
     * Invoked by a throttled ticker update from {@link PIXI.Ticker.system}.
     * @param deltaTime - time delta since the last call
     */
    private tickerUpdate;
}
/**
 * This class handles automatic firing of PointerEvents
 * in the case where the pointer is stationary for too long.
 * This is to ensure that hit-tests are still run on moving objects.
 * @memberof PIXI
 * @type {PIXI.EventsTickerClass}
 * @since 7.2.0
 */
export declare const EventsTicker: EventsTickerClass;
export {};
