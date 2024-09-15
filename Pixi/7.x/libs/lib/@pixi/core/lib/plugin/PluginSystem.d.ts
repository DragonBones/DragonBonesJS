import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderer } from '../IRenderer';
import type { ISystem } from '../system/ISystem';
export interface IRendererPlugins extends GlobalMixins.IRendererPlugins {
    [key: string]: any;
}
/**
 * Manages the functionality that allows users to extend pixi functionality via additional plugins.
 * @memberof PIXI
 */
export declare class PluginSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /** @ignore */
    rendererPlugins: IRendererPlugins;
    /**
     * Collection of plugins.
     * @readonly
     * @member {object}
     */
    readonly plugins: IRendererPlugins;
    private renderer;
    constructor(renderer: IRenderer);
    /**
     * Initialize the plugins.
     * @protected
     */
    init(): void;
    destroy(): void;
}
