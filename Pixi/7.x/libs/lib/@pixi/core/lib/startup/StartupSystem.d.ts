import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderer } from '../IRenderer';
import type { ISystem } from '../system/ISystem';
/**
 * Options for the startup system.
 * @memberof PIXI
 */
export interface StartupSystemOptions {
    /**
     * Whether to log the version and type information of renderer to console.
     * @memberof PIXI.IRendererOptions
     */
    hello: boolean;
}
/**
 * A simple system responsible for initiating the renderer.
 * @memberof PIXI
 */
export declare class StartupSystem implements ISystem<StartupSystemOptions> {
    /** @ignore */
    static defaultOptions: StartupSystemOptions;
    /** @ignore */
    static extension: ExtensionMetadata;
    readonly renderer: IRenderer;
    constructor(renderer: IRenderer);
    /**
     * It all starts here! This initiates every system, passing in the options for any system by name.
     * @param options - the config for the renderer and all its systems
     */
    run(options: StartupSystemOptions): void;
    destroy(): void;
}
