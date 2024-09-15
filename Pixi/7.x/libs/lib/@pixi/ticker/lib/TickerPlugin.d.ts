import { Ticker } from './Ticker';
import type { ExtensionMetadata } from '@pixi/extensions';
export interface TickerPluginOptions {
    /**
     * Automatically starts the rendering after the construction.
     *  **Note**: Setting this parameter to `false` does NOT stop the shared ticker even if you set
     *  `options.sharedTicker` to `true` in case that it is already started. Stop it by your own.
     * @memberof PIXI.IApplicationOptions
     * @default true
     */
    autoStart?: boolean;
    /**
     * Set`true` to use `Ticker.shared`, `false` to create new ticker.
     *  If set to `false`, you cannot register a handler to occur before anything that runs on the shared ticker.
     *  The system ticker will always run before both the shared ticker and the app ticker.
     * @memberof PIXI.IApplicationOptions
     * @default false
     */
    sharedTicker?: boolean;
}
/**
 * Middleware for for Application Ticker.
 * @class
 * @memberof PIXI
 */
export declare class TickerPlugin {
    /** @ignore */
    static extension: ExtensionMetadata;
    static start: () => void;
    static stop: () => void;
    static _ticker: Ticker;
    static ticker: Ticker;
    /**
     * Initialize the plugin with scope of application instance
     * @static
     * @private
     * @param {object} [options] - See application options
     */
    static init(options?: GlobalMixins.IApplicationOptions): void;
    /**
     * Clean up the ticker, scoped to application.
     * @static
     * @private
     */
    static destroy(): void;
}
