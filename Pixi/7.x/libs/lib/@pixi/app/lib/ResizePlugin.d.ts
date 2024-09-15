import type { ExtensionMetadata, Renderer } from '@pixi/core';
type ResizeableRenderer = Pick<Renderer, 'resize'>;
export interface ResizePluginOptions {
    /**
     * Element to automatically resize stage to.
     * @memberof PIXI.IApplicationOptions
     */
    resizeTo?: Window | HTMLElement;
}
/**
 * Middleware for for Application's resize functionality
 * @private
 * @class
 */
export declare class ResizePlugin {
    /** @ignore */
    static extension: ExtensionMetadata;
    static resizeTo: Window | HTMLElement;
    static resize: () => void;
    static renderer: ResizeableRenderer;
    static queueResize: () => void;
    static render: () => void;
    private static _resizeId;
    private static _resizeTo;
    private static cancelResize;
    /**
     * Initialize the plugin with scope of application instance
     * @static
     * @private
     * @param {object} [options] - See application options
     */
    static init(options: ResizePluginOptions): void;
    /**
     * Clean up the ticker, scoped to application
     * @static
     * @private
     */
    static destroy(): void;
}
export {};
