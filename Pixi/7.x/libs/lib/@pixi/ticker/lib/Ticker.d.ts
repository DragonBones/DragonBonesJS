import { UPDATE_PRIORITY } from './const';
export type TickerCallback<T> = (this: T, dt: number) => any;
/**
 * A Ticker class that runs an update loop that other objects listen to.
 *
 * This class is composed around listeners meant for execution on the next requested animation frame.
 * Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.
 * @class
 * @memberof PIXI
 */
export declare class Ticker {
    /**
     * Target frames per millisecond.
     * @static
     */
    static targetFPMS: number;
    /** The private shared ticker instance */
    private static _shared;
    /** The private system ticker instance  */
    private static _system;
    /**
     * Whether or not this ticker should invoke the method
     * {@link PIXI.Ticker#start} automatically
     * when a listener is added.
     */
    autoStart: boolean;
    /**
     * Scalar time value from last frame to this frame.
     * This value is capped by setting {@link PIXI.Ticker#minFPS}
     * and is scaled with {@link PIXI.Ticker#speed}.
     * **Note:** The cap may be exceeded by scaling.
     */
    deltaTime: number;
    /**
     * Scaler time elapsed in milliseconds from last frame to this frame.
     * This value is capped by setting {@link PIXI.Ticker#minFPS}
     * and is scaled with {@link PIXI.Ticker#speed}.
     * **Note:** The cap may be exceeded by scaling.
     * If the platform supports DOMHighResTimeStamp,
     * this value will have a precision of 1 µs.
     * Defaults to target frame time
     * @default 16.66
     */
    deltaMS: number;
    /**
     * Time elapsed in milliseconds from last frame to this frame.
     * Opposed to what the scalar {@link PIXI.Ticker#deltaTime}
     * is based, this value is neither capped nor scaled.
     * If the platform supports DOMHighResTimeStamp,
     * this value will have a precision of 1 µs.
     * Defaults to target frame time
     * @default 16.66
     */
    elapsedMS: number;
    /**
     * The last time {@link PIXI.Ticker#update} was invoked.
     * This value is also reset internally outside of invoking
     * update, but only when a new animation frame is requested.
     * If the platform supports DOMHighResTimeStamp,
     * this value will have a precision of 1 µs.
     */
    lastTime: number;
    /**
     * Factor of current {@link PIXI.Ticker#deltaTime}.
     * @example
     * // Scales ticker.deltaTime to what would be
     * // the equivalent of approximately 120 FPS
     * ticker.speed = 2;
     */
    speed: number;
    /**
     * Whether or not this ticker has been started.
     * `true` if {@link PIXI.Ticker#start} has been called.
     * `false` if {@link PIXI.Ticker#stop} has been called.
     * While `false`, this value may change to `true` in the
     * event of {@link PIXI.Ticker#autoStart} being `true`
     * and a listener is added.
     */
    started: boolean;
    /** The first listener. All new listeners added are chained on this. */
    private _head;
    /** Internal current frame request ID */
    private _requestId;
    /**
     * Internal value managed by minFPS property setter and getter.
     * This is the maximum allowed milliseconds between updates.
     */
    private _maxElapsedMS;
    /**
     * Internal value managed by minFPS property setter and getter.
     * This is the minimum allowed milliseconds between updates.
     */
    private _minElapsedMS;
    /** If enabled, deleting is disabled.*/
    private _protected;
    /** The last time keyframe was executed. Maintains a relatively fixed interval with the previous value. */
    private _lastFrame;
    /**
     * Internal tick method bound to ticker instance.
     * This is because in early 2015, Function.bind
     * is still 60% slower in high performance scenarios.
     * Also separating frame requests from update method
     * so listeners may be called at any time and with
     * any animation API, just invoke ticker.update(time).
     * @param time - Time since last tick.
     */
    private _tick;
    constructor();
    /**
     * Conditionally requests a new animation frame.
     * If a frame has not already been requested, and if the internal
     * emitter has listeners, a new frame is requested.
     * @private
     */
    private _requestIfNeeded;
    /**
     * Conditionally cancels a pending animation frame.
     * @private
     */
    private _cancelIfNeeded;
    /**
     * Conditionally requests a new animation frame.
     * If the ticker has been started it checks if a frame has not already
     * been requested, and if the internal emitter has listeners. If these
     * conditions are met, a new frame is requested. If the ticker has not
     * been started, but autoStart is `true`, then the ticker starts now,
     * and continues with the previous conditions to request a new frame.
     * @private
     */
    private _startIfPossible;
    /**
     * Register a handler for tick events. Calls continuously unless
     * it is removed or the ticker is stopped.
     * @param fn - The listener function to be added for updates
     * @param context - The listener context
     * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
     * @returns This instance of a ticker
     */
    add<T = any>(fn: TickerCallback<T>, context?: T, priority?: UPDATE_PRIORITY): this;
    /**
     * Add a handler for the tick event which is only execute once.
     * @param fn - The listener function to be added for one update
     * @param context - The listener context
     * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
     * @returns This instance of a ticker
     */
    addOnce<T = any>(fn: TickerCallback<T>, context?: T, priority?: UPDATE_PRIORITY): this;
    /**
     * Internally adds the event handler so that it can be sorted by priority.
     * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
     * before the rendering.
     * @private
     * @param listener - Current listener being added.
     * @returns This instance of a ticker
     */
    private _addListener;
    /**
     * Removes any handlers matching the function and context parameters.
     * If no handlers are left after removing, then it cancels the animation frame.
     * @param fn - The listener function to be removed
     * @param context - The listener context to be removed
     * @returns This instance of a ticker
     */
    remove<T = any>(fn: TickerCallback<T>, context?: T): this;
    /**
     * The number of listeners on this ticker, calculated by walking through linked list
     * @readonly
     * @member {number}
     */
    get count(): number;
    /** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
    start(): void;
    /** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
    stop(): void;
    /** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
    destroy(): void;
    /**
     * Triggers an update. An update entails setting the
     * current {@link PIXI.Ticker#elapsedMS},
     * the current {@link PIXI.Ticker#deltaTime},
     * invoking all listeners with current deltaTime,
     * and then finally setting {@link PIXI.Ticker#lastTime}
     * with the value of currentTime that was provided.
     * This method will be called automatically by animation
     * frame callbacks if the ticker instance has been started
     * and listeners are added.
     * @param {number} [currentTime=performance.now()] - the current time of execution
     */
    update(currentTime?: number): void;
    /**
     * The frames per second at which this ticker is running.
     * The default is approximately 60 in most modern browsers.
     * **Note:** This does not factor in the value of
     * {@link PIXI.Ticker#speed}, which is specific
     * to scaling {@link PIXI.Ticker#deltaTime}.
     * @member {number}
     * @readonly
     */
    get FPS(): number;
    /**
     * Manages the maximum amount of milliseconds allowed to
     * elapse between invoking {@link PIXI.Ticker#update}.
     * This value is used to cap {@link PIXI.Ticker#deltaTime},
     * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
     * When setting this property it is clamped to a value between
     * `0` and `Ticker.targetFPMS * 1000`.
     * @member {number}
     * @default 10
     */
    get minFPS(): number;
    set minFPS(fps: number);
    /**
     * Manages the minimum amount of milliseconds required to
     * elapse between invoking {@link PIXI.Ticker#update}.
     * This will effect the measured value of {@link PIXI.Ticker#FPS}.
     * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
     * Otherwise it will be at least `minFPS`
     * @member {number}
     * @default 0
     */
    get maxFPS(): number;
    set maxFPS(fps: number);
    /**
     * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
     * {@link PIXI.VideoResource} to update animation frames / video textures.
     *
     * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
     *
     * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
     * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
     * @example
     * import { Ticker } from 'pixi.js';
     *
     * const ticker = Ticker.shared;
     * // Set this to prevent starting this ticker when listeners are added.
     * // By default this is true only for the PIXI.Ticker.shared instance.
     * ticker.autoStart = false;
     *
     * // FYI, call this to ensure the ticker is stopped. It should be stopped
     * // if you have not attempted to render anything yet.
     * ticker.stop();
     *
     * // Call this when you are ready for a running shared ticker.
     * ticker.start();
     * @example
     * import { autoDetectRenderer, Container } from 'pixi.js';
     *
     * // You may use the shared ticker to render...
     * const renderer = autoDetectRenderer();
     * const stage = new Container();
     * document.body.appendChild(renderer.view);
     * ticker.add((time) => renderer.render(stage));
     *
     * // Or you can just update it manually.
     * ticker.autoStart = false;
     * ticker.stop();
     * const animate = (time) => {
     *     ticker.update(time);
     *     renderer.render(stage);
     *     requestAnimationFrame(animate);
     * };
     * animate(performance.now());
     * @member {PIXI.Ticker}
     * @static
     */
    static get shared(): Ticker;
    /**
     * The system ticker instance used by {@link PIXI.BasePrepare} for core timing
     * functionality that shouldn't usually need to be paused, unlike the `shared`
     * ticker which drives visual animations and rendering which may want to be paused.
     *
     * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
     * @member {PIXI.Ticker}
     * @static
     */
    static get system(): Ticker;
}
