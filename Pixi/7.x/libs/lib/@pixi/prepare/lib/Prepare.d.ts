import { BasePrepare } from './BasePrepare';
import type { ExtensionMetadata, ISystem, Renderer } from '@pixi/core';
/**
 * The prepare plugin provides renderer-specific plugins for pre-rendering DisplayObjects. These plugins are useful for
 * asynchronously preparing and uploading to the GPU assets, textures, graphics waiting to be displayed.
 *
 * Do not instantiate this plugin directly. It is available from the `renderer.prepare` property.
 * @example
 * import { Application, Graphics } from 'pixi.js';
 *
 * // Create a new application (prepare will be auto-added to renderer)
 * const app = new Application();
 * document.body.appendChild(app.view);
 *
 * // Don't start rendering right away
 * app.stop();
 *
 * // Create a display object
 * const rect = new Graphics()
 *     .beginFill(0x00ff00)
 *     .drawRect(40, 40, 200, 200);
 *
 * // Add to the stage
 * app.stage.addChild(rect);
 *
 * // Don't start rendering until the graphic is uploaded to the GPU
 * app.renderer.prepare.upload(app.stage, () => {
 *     app.start();
 * });
 * @memberof PIXI
 */
export declare class Prepare extends BasePrepare implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * @param {PIXI.Renderer} renderer - A reference to the current renderer
     */
    constructor(renderer: Renderer);
}
